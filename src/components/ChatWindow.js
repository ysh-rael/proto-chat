"use client"
import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  IconButton,
  Stack,
  Switch,
  FormControlLabel,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { Code } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { v4 as uuidv4 } from 'uuid';
import ReactMarkdown from 'react-markdown';
import { sxProps } from './constants';
import './ChatWindow.css';

const NEXT_PUBLIC_API_IA = process.env['NEXT_PUBLIC_API_IA'];
console.log("API IA:", NEXT_PUBLIC_API_IA);


const MODEL = 'gemma3:4b';


function formatDate(date) {
  try {
    const dt = typeof date === 'string' ? new Date(date) : date;
    if(!dt) {
      console.log('sem data')
      return ''
    }

    if (Number.isNaN(dt?.getTime())) {
      console.log('data inválida')
      return ''
    }

    const formatted = dt.toLocaleString()
      .replace(/,|:\d{2}$/g, ''); // Remove os segundos e a virgula

    return formatted;
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return '';
  }
}

function isBot(msg) {
  return /bot/.test(msg.from);
}
function isMe(msg) {
  return /me/.test(msg.from);
}
function isSystem(msg) {
  return /system/.test(msg.from);
}
function whoIs(msg) {
  if (typeof msg !== 'object') return '';
  if (typeof msg.from !== 'string') return '';
  switch (msg.from) {
    case 'me': return 'Usuário';
    case 'bot': return 'Assistente';
    case 'system': return 'system';
    default: return '';
  }
}

function Dot({ delay = '0s' }) {
  return (
    <Box sx={{ ...sxProps['box--Dot-component'], animationDelay: delay }} />
  );
}

function IsTyping({ isTyping }) {
  if (!isTyping) return null;
  return (
    <Box display="flex" justifyContent="flex-start">
      <Box
        display="flex"
        alignItems="center"
        gap={0.5}
        bgcolor="#e0e0e0"
        color="black"
        px={2}
        py={1}
        borderRadius={3}
        maxWidth="70%"
      >
        <Dot />
        <Dot delay="0.2s" />
        <Dot delay="0.4s" />
      </Box>
    </Box>
  );
}

export default function ChatWindow({ user, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSystemMode, setIsSystemMode] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedMsgId, setSelectedMsgId] = useState(null);
  const [editInput, setEditInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    setMessages([
      {
        id: uuidv4(),
        from: 'system',
        text: user.name !== 'Comercial' ? `Você está conversãndo com ${user.name}` : 'Você é um assistente de RH. Você preza pela exatida, então, quando não tiver a informação correta, sempre informa que pode estar enganada e busca, se tiver fontes onde a resposta pode ser encontrada. Seu nome é agatha.',
      },
    ]);
  }, [user]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const addMessage = (msg) => {
    setMessages((prev) => [...prev, { id: uuidv4(), ...msg }]);
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
    setInput('');

    addMessage({ from: isSystemMode ? 'system' : 'me', text, date: new Date() });

    if (isSystemMode) {
      // Desabilita modo prompt depois de um envio
      setIsSystemMode(() => false);
      return;
    }

    if (user.name === 'Comercial') {
      setIsTyping(true);

      const history = messages
        .filter((m) => isMe(m) || isBot(m) || isSystem(m))
        .map((m) => `${whoIs(m)}: ${m.text}`)
        .join('\n');

      const fullPrompt = `${history}\n${whoIs({ from: 'me' })}: ${text}`;

      try {
        const start = performance.now();
        const response = await fetch(NEXT_PUBLIC_API_IA, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: MODEL,
            prompt: fullPrompt,
            stream: false,
          }),
        });

        const end = performance.now();
        const durationMs = end - start;
        const durationSec = (durationMs / 1000).toFixed(2); // Ex: "1.53"

        if (!response.ok) throw new Error(`Erro HTTP ${response.status}`);

        const data = await response.json();
        addMessage({
          from: 'bot', text: data.response.trim(), date: new Date(), time: `${durationSec}s`,
        });
      } catch (err) {
        console.error('Erro Ollama:', err.message);
        addMessage({ from: 'bot', text: 'Erro ao consultar o Ollama.', date: new Date() });
      } finally {
        setIsTyping(false);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  const handleRightClick = (event, msgId, msgText) => {
    event.preventDefault();
    setSelectedMsgId(msgId);
    setEditInput(msgText);
    setContextMenu({
      mouseX: event.clientX + 2,
      mouseY: event.clientY - 6,
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
    setSelectedMsgId(null);
  };

  const handleRemoveMessage = () => {
    setMessages((prev) => prev.filter((msg) => msg.id !== selectedMsgId));
    handleCloseContextMenu();
  };

  const handleEditMessage = () => {
    const newText = prompt('Editar mensagem:', editInput);
    if (newText != null) {
      setMessages((prev) => prev.map((msg) => (
        msg.id === selectedMsgId ? { ...msg, text: newText } : msg)));
    }
    handleCloseContextMenu();
  };

  return (
    <Box flex={1} display="flex" flexDirection="column" justifyContent="space-between" p={2} bgcolor="#f9f9f9">
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6">
          Conversa com
          {' '}
          {user.name}
        </Typography>
        <Avatar src={currentUser.avatar} alt={currentUser.name} />
      </Box>

      {/* Mensagens */}
      <Box
        flex={1}
        p={1}
        mb={2}
        overflow="auto"
        component={Paper}
        variant="outlined"
        sx={{ backgroundColor: '#fff', borderRadius: 2 }}
      >
        <Stack spacing={1}>
          {messages.map((msg) => (
            <Box
              className={` container_msg container_msg_from_${msg.from.toLowerCase()}`}
              key={msg.id}
              onContextMenu={isMe(msg) ? (e) => handleRightClick(e, msg.id, msg.text) : undefined}
            >
              <Box
                className={`msg_from_${msg.from.toLowerCase()}`}
                px={1.4}
                py={0}
                borderRadius={3}
                maxWidth="70%"
              >
                <Typography variant="body2" component="div">
                  {isSystem(msg) && (<Code color="primary" />)}
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </Typography>
              </Box>
              <span className="span_msg_date">
                {formatDate(msg.date)}
                {msg?.time ? ` - ${msg?.time}` : ''}
              </span>
            </Box>
          ))}

          <IsTyping isTyping={isTyping} />
          <div ref={endRef} />
        </Stack>
      </Box>

      {/* Menu de contexto */}
      <Menu
        open={contextMenu !== null}
        onClose={handleCloseContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={handleEditMessage}>
          {' '}
          <EditIcon />
          {' '}
          Editar
        </MenuItem>
        <MenuItem onClick={handleRemoveMessage}>
          {' '}
          <DeleteIcon />
          {' '}
          Remover
        </MenuItem>
      </Menu>

      {/* Entrada */}
      <Box display="flex" gap={1} alignItems="center">
        <TextField
          fullWidth
          label={isSystemMode ? 'Digite um prompt system' : 'Digite uma mensagem'}
          color={isSystemMode ? 'warning' : 'primary'}
          variant="outlined"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <Tooltip title={isSystemMode ? 'Enviar Prompt de comando' : 'Enviar Mensagem'}>
          <IconButton color={isSystemMode ? 'warning' : 'primary'} onClick={sendMessage}>
            <SendIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Habilitar Prompt de Comando">
          <FormControlLabel
            control={(
              <Switch
                checked={isSystemMode}
                onChange={() => setIsSystemMode((prev) => !prev)}
                color="primary"
              />
            )}
          />
        </Tooltip>
      </Box>
    </Box>
  );
}

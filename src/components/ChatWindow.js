import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  IconButton,
  Stack,
  Avatar,
  Tooltip,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { v4 as uuidv4 } from 'uuid';

export default function ChatWindow({ user, currentUser }) {
  const [messages, setMessages] = useState([
    { from: 'bot', text: `Olá, você está falando com ${user.name}.`, id: uuidv4() },
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    setMessages([
      { from: 'bot', text: `Olá, você está falando com ${user.name}.` },
    ]);
  }, [user]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { from: 'me', text: input }]);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <Box
      flex={1}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      p={2}
      bgcolor="#f9f9f9"
    >
      {/* Header com avatar */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Typography variant="h6">
          Conversa com
          {' '}
          {user.name}
        </Typography>
        <Tooltip title={currentUser.name}>
          <Avatar src={currentUser.avatar} alt={currentUser.name} />
        </Tooltip>
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
              key={msg.id}
              display="flex"
              justifyContent={msg.from === 'me' ? 'flex-end' : 'flex-start'}
            >
              <Box
                bgcolor={msg.from === 'me' ? '#1976d2' : '#e0e0e0'}
                color={msg.from === 'me' ? 'white' : 'black'}
                px={2}
                py={1}
                borderRadius={3}
                maxWidth="70%"
              >
                <Typography variant="body2">{msg.text}</Typography>
              </Box>
            </Box>
          ))}
          <div ref={endRef} />
        </Stack>
      </Box>

      {/* Campo de entrada */}
      <Box display="flex" gap={1}>
        <TextField
          fullWidth
          label="Digite uma mensagem"
          variant="outlined"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <IconButton color="primary" onClick={sendMessage}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

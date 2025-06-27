import React from 'react';
import {
  Box,
  List,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Divider,
} from '@mui/material';
import { sxProps } from './constants';

export default function ChatSidebar({ users, selectedUser, onSelectUser }) {
  return (
    <Box
      width={250}
      bgcolor="#f1f1f1"
      p={2}
      sx={sxProps['box--ChatSidebar-container']}
    >
      {/* LOGO */}
      <Box display="flex" justifyContent="center" mb={2}>
        <img src="/logo192.png" alt="Chat Logo" width={80} />
      </Box>

      {/* TITULO CONVERSAS */}
      <Typography variant="h6" gutterBottom>
        Conversas
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {/* LISTA DE CONTATOS  */}
      <List>
        {users.map((user) => (
          <ListItemButton
            key={user.name}
            selected={selectedUser.name === user.name}
            onClick={() => onSelectUser(user)}
          >
            <ListItemAvatar>
              <Avatar src={user.avatar} alt={user.name} />
            </ListItemAvatar>

            <ListItemText primary={user.name} />

          </ListItemButton>
        ))}
      </List>

    </Box>
  );
}

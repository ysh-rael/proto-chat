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

export default function ChatSidebar({ users, selectedUser, onSelectUser }) {
  return (
    <Box
      width={250}
      bgcolor="#f1f1f1"
      p={2}
      sx={{ borderRight: '1px solid #ddd' }}
    >
      {/* Logo */}
      <Box display="flex" justifyContent="center" mb={2}>
        <img src="/logo192.png" alt="Chat Logo" width={80} />
      </Box>

      <Typography variant="h6" gutterBottom>
        Conversas
      </Typography>
      <Divider sx={{ mb: 2 }} />

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

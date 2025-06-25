import React, { useState } from 'react';
import { Box } from '@mui/material';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';

const currentUser = {
  name: 'Yshrael',
  avatar: 'https://i.pravatar.cc/150?img=3',
};

const users = [
  {
    name: 'Suporte',
    avatar: 'https://i.pravatar.cc/150?img=5',
  },
  {
    name: 'Comercial',
    avatar: 'https://i.pravatar.cc/150?img=6',
  },
  {
    name: 'Financeiro',
    avatar: 'https://i.pravatar.cc/150?img=7',
  },
];

export default function ChatLayout() {
  const [selectedUser, setSelectedUser] = useState(users[0]);

  return (
    <Box display="flex" height="100vh">
      <ChatSidebar
        users={users}
        selectedUser={selectedUser}
        onSelectUser={setSelectedUser}
      />
      <ChatWindow
        user={selectedUser}
        currentUser={currentUser}
      />
    </Box>
  );
}

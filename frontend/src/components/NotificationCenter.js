import React from 'react';
import {
  Alert,
  Snackbar,
  Box,
} from '@mui/material';
import { useDMS } from '../context/DMSContext';

const NotificationCenter = () => {
  const { notifications, removeNotification } = useDMS();

  const handleClose = (id) => {
    removeNotification(id);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        pointerEvents: 'none',
      }}
    >
      {notifications.map(notification => (
        <Alert
          key={notification.id}
          severity={notification.type}
          onClose={() => handleClose(notification.id)}
          sx={{
            pointerEvents: 'auto',
            minWidth: 300,
            boxShadow: 2,
          }}
        >
          {notification.message}
        </Alert>
      ))}
    </Box>
  );
};

export default NotificationCenter;

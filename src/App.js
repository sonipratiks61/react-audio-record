import './App.css';
import React from 'react';
import AudioRecorder from './AudioRecorder';
import { Box, Typography } from '@mui/material';


function App() {
  return (
    <Box sx={{
      marginTop: 8,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <Typography component="h1" variant="h5">
        Audio Recording with start/pause/stop and play
      </Typography>
      <Box sx={{ mt: 1 }}>
        <AudioRecorder />
      </Box>

    </Box>
  );
}

export default App;

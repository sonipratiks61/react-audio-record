import { Box, Button } from '@mui/material';
import React, { useState } from 'react';

function startTimer() {
  let seconds = 0;
  let interval;

  function updateTimer() {
    seconds++;
    console.log(`Timer: ${seconds} seconds`);
  }

  function toggleTimer() {
    if (interval) {
      clearInterval(interval);
      interval = null;
    } else {
      interval = setInterval(updateTimer, 1000);
    }
  }

  function resetTimer() {
    clearInterval(interval);
    interval = null;
    seconds = 0;
    console.log('Timer reset');
  }

  return {
    toggle: toggleTimer,
    reset: resetTimer,
    seconds,
  };
}


const AudioRecorder = () => {
  const timer = startTimer();
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioPlayerSrc, setAudioPlayerSrc] = useState("");

  const handleStartRecording = async () => {
    const audioChunks = [];
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);

    recorder.ondataavailable = event => {
      if (event.data.size > 0) {
        // const chunks = [...audioChunks, event.data];
        // console.log('-chunks', chunks);
        // setAudioChunks(chunks);
        audioChunks.push(event.data);
        // setAudioChunks((prevChunks) => [...prevChunks, event.data]);
      }
    };

    recorder.onstart = () => {
      setIsRecording(true);
      setIsPaused(false);
      timer.reset();
    };

    recorder.onpause = () => {
      setIsPaused(true);
      timer.toggle();
    };

    recorder.onresume = () => {
      setIsPaused(false);
      timer.toggle();
    };

    recorder.onstop = () => {
      console.log('recording stopped', audioChunks);
      const blob = new Blob(audioChunks, { type: 'audio/wav' });
      setAudioPlayerSrc(URL.createObjectURL(blob));
      timer.reset();
    };

    setMediaRecorder(recorder);
    recorder.start();
  };

  const handlePauseResume = () => {

    if (mediaRecorder.state === 'recording') {
      mediaRecorder.pause();
    } else if (mediaRecorder.state === 'paused') {
      mediaRecorder.resume();
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  return (
    <Box>
      <Box>
        <Button
          fullWidth
          variant="contained"
          sx={{ m: 1 }}
          onClick={handleStartRecording}
          disabled={isRecording}
        >
          Start Recording
        </Button>
      </Box>

      <Box>
        <Button
          fullWidth
          variant="contained"
          sx={{ m: 1 }}
          onClick={handlePauseResume} disabled={!isRecording}
        >
          {isPaused ? 'Resume' : 'Pause'}
        </Button>
      </Box>

      <Box>
        <Button
          fullWidth
          variant="contained"
          sx={{ m: 1 }}
          onClick={handleStopRecording} disabled={!isRecording}
        >
          Stop Recording
        </Button>
      </Box>

      <Box>
        <Button
          fullWidth
          variant="contained"
          sx={{ m: 1 }}
          onClick={handleStopRecording} disabled={!isRecording}
        >
          Reset
        </Button>
      </Box>


      <Box>
        <audio id="audioPlayer" controls src={audioPlayerSrc}></audio>
      </Box>
    </Box>

  );
};

export default AudioRecorder;

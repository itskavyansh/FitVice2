import React, { useState, useEffect } from 'react';
import {
  IconButton,
  Tooltip,
  CircularProgress,
  Box,
  Typography,
  Fade,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';

const VoiceInterface = ({ onVoiceInput, isProcessing, disabled }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [recognition, setRecognition] = useState(null);
  const [speechSynthesis, setSpeechSynthesis] = useState(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onVoiceInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognition);
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      setSpeechSynthesis(window.speechSynthesis);
    }

    return () => {
      if (recognition) {
        recognition.abort();
      }
      if (speechSynthesis) {
        speechSynthesis.cancel();
      }
    };
  }, [onVoiceInput]);

  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    if (speechSynthesis && speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
  };

  const speak = (text) => {
    if (!speechSynthesis || !voiceEnabled) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Find a good voice
    const voices = speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      voice => voice.name.includes('Google') || voice.name.includes('Male')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
    };

    speechSynthesis.speak(utterance);
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <Tooltip title={voiceEnabled ? 'Disable voice' : 'Enable voice'}>
        <IconButton
          color={voiceEnabled ? 'primary' : 'default'}
          onClick={toggleVoice}
          size="small"
        >
          {voiceEnabled ? <VolumeUpIcon /> : <VolumeOffIcon />}
        </IconButton>
      </Tooltip>

      <Tooltip title={isListening ? 'Stop listening' : 'Start listening'}>
        <IconButton
          color={isListening ? 'error' : 'primary'}
          onClick={toggleListening}
          disabled={disabled || isProcessing || !recognition}
          size="small"
        >
          {isListening ? (
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <CircularProgress size={24} />
              <MicIcon
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px',
                }}
              />
            </Box>
          ) : (
            <MicIcon />
          )}
        </IconButton>
      </Tooltip>

      {isListening && (
        <Fade in={true}>
          <Typography variant="caption" color="text.secondary">
            Listening...
          </Typography>
        </Fade>
      )}
    </Box>
  );
};

export default VoiceInterface; 
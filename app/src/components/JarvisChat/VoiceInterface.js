import React, { useState, useEffect, useCallback } from 'react';
import {
  IconButton,
  Tooltip,
  CircularProgress,
  Box,
  Typography,
  Fade,
  Snackbar,
  Alert,
  Button,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import RefreshIcon from '@mui/icons-material/Refresh';
import WifiOffIcon from '@mui/icons-material/WifiOff';

const VoiceInterface = ({ onVoiceInput, isProcessing, disabled }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [recognition, setRecognition] = useState(null);
  const [speechSynthesis, setSpeechSynthesis] = useState(null);
  const [error, setError] = useState(null);
  const [networkError, setNetworkError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [autoRetry, setAutoRetry] = useState(false);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      console.log('Network connection restored');
      setIsOnline(true);
      if (autoRetry) {
        console.log('Auto-retrying speech recognition');
        setTimeout(() => retryRecognition(), 1000);
        setAutoRetry(false);
      }
    };

    const handleOffline = () => {
      console.log('Network connection lost');
      setIsOnline(false);
      if (isListening) {
        try {
          recognition?.abort();
          setIsListening(false);
          setError('Network connection lost. Will retry when online.');
          setNetworkError(true);
          setAutoRetry(true);
        } catch (e) {
          console.error('Error handling offline state:', e);
        }
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isListening, recognition, autoRetry]);

  // Create recognition instance with better browser support
  const createRecognitionInstance = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Speech Recognition API not supported in this browser');
      setError('Voice recognition is not supported in your browser');
      return null;
    }

    try {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('Voice recognized:', transcript);
        onVoiceInput(transcript);
        setIsListening(false);
        setNetworkError(false);
        setRetryCount(0);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);

        if (event.error === 'network') {
          setNetworkError(true);
          if (!navigator.onLine) {
            setError('Your device appears to be offline. Please check your internet connection.');
            setAutoRetry(true);
          } else {
            setError('Network error connecting to speech servers. Please try again.');
          }
        } else if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          setError('Microphone access denied. Please enable microphone permissions.');
        } else if (event.error === 'no-speech') {
          setError('No speech detected. Please try speaking again.');
        } else if (event.error === 'aborted') {
          // User canceled - no need for error message
          setError(null);
        } else {
          setError(`Speech recognition error: ${event.error}`);
        }

        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
      };

      recognitionInstance.onnomatch = () => {
        console.log('No speech detected');
        setError('No speech detected, please try again');
        setIsListening(false);
      };

      return recognitionInstance;
    } catch (e) {
      console.error('Failed to initialize speech recognition:', e);
      setError('Failed to initialize speech recognition');
      return null;
    }
  }, [onVoiceInput]);

  useEffect(() => {
    const recognitionInstance = createRecognitionInstance();
    setRecognition(recognitionInstance);

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      setSpeechSynthesis(window.speechSynthesis);
      console.log('Speech synthesis initialized successfully');

      // Force load voices
      window.speechSynthesis.onvoiceschanged = () => {
        const voices = window.speechSynthesis.getVoices();
        console.log('Available voices:', voices.length);
      };
    }

    return () => {
      if (recognitionInstance) {
        try {
          recognitionInstance.abort();
        } catch (e) {
          console.error('Error stopping recognition:', e);
        }
      }
      if (speechSynthesis) {
        speechSynthesis.cancel();
      }
    };
  }, [createRecognitionInstance]);

  const retryRecognition = () => {
    if (!isOnline) {
      setError('Cannot retry while offline. Will automatically retry when online.');
      setAutoRetry(true);
      return;
    }

    setNetworkError(false);
    setError(null);
    setRetryCount((prev) => prev + 1);

    // Create a new instance if needed
    if (!recognition || retryCount > 2) {
      const newRecognition = createRecognitionInstance();
      setRecognition(newRecognition);

      if (newRecognition) {
        setTimeout(() => {
          startListening(newRecognition);
        }, 500);
      }
    } else {
      startListening(recognition);
    }
  };

  const startListening = (recognitionInstance) => {
    if (!recognitionInstance) return;

    if (!isOnline) {
      setError('Cannot start voice recognition while offline');
      setNetworkError(true);
      setAutoRetry(true);
      return;
    }

    try {
      recognitionInstance.start();
      setIsListening(true);
      console.log('Started listening...');
    } catch (e) {
      console.error('Error starting recognition:', e);
      setError('Error starting voice recognition. Please try again.');
    }
  };

  const toggleListening = () => {
    if (!recognition) {
      setError('Voice recognition is not available in your browser');
      return;
    }

    if (isListening) {
      try {
        recognition.stop();
        setIsListening(false);
      } catch (e) {
        console.error('Error stopping recognition:', e);
        setError('Error stopping voice recognition');
      }
    } else {
      startListening(recognition);
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
      (voice) => voice.name.includes('Google') || voice.name.includes('Male'),
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

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <Tooltip title={voiceEnabled ? 'Disable voice' : 'Enable voice'}>
        <IconButton color={voiceEnabled ? 'primary' : 'default'} onClick={toggleVoice} size="small">
          {voiceEnabled ? <VolumeUpIcon /> : <VolumeOffIcon />}
        </IconButton>
      </Tooltip>

      {!isOnline ? (
        <Tooltip title="Waiting for network connection">
          <IconButton color="warning" size="small">
            <WifiOffIcon />
          </IconButton>
        </Tooltip>
      ) : networkError ? (
        <Tooltip title="Retry voice recognition">
          <IconButton color="warning" onClick={retryRecognition} size="small">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title={isListening ? 'Stop listening' : 'Start listening'}>
          <IconButton
            color={isListening ? 'error' : 'primary'}
            onClick={toggleListening}
            disabled={disabled || isProcessing || !isOnline}
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
      )}

      {isListening && (
        <Fade in={true}>
          <Typography variant="caption" color="text.secondary">
            Listening...
          </Typography>
        </Fade>
      )}

      {autoRetry && !isListening && (
        <Fade in={true}>
          <Typography variant="caption" color="text.secondary">
            Will retry when online
          </Typography>
        </Fade>
      )}

      <Snackbar
        open={!!error}
        autoHideDuration={5000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          variant="filled"
          action={
            networkError && isOnline ? (
              <Button color="inherit" size="small" onClick={retryRecognition}>
                Retry
              </Button>
            ) : null
          }
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VoiceInterface;

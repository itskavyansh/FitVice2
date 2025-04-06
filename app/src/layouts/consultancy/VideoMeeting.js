import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import ChatIcon from '@mui/icons-material/Chat';
import CallEndIcon from '@mui/icons-material/CallEnd';
import PersonIcon from '@mui/icons-material/Person';

function VideoMeeting({ meetingId, onEndCall }) {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [participants, setParticipants] = useState([{ id: 1, name: 'You', isHost: true }]);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);

  useEffect(() => {
    // Initialize WebRTC
    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    initializeMedia();

    return () => {
      // Cleanup
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }
        setIsScreenSharing(true);
      } catch (error) {
        console.error('Error sharing screen:', error);
      }
    } else {
      if (localStream && localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
      }
      setIsScreenSharing(false);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { text: newMessage, sender: 'You', timestamp: new Date() }]);
      setNewMessage('');
    }
  };

  const handleEndCall = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    onEndCall();
  };

  return (
    <MDBox>
      <Grid container spacing={2}>
        {/* Main video area */}
        <Grid item xs={12} md={9}>
          <Card sx={{ height: '70vh', position: 'relative' }}>
            <CardContent sx={{ height: '100%', p: '0 !important' }}>
              {/* Remote video (or placeholder) */}
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  bgcolor: 'grey.900',
                  position: 'relative',
                }}
              >
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
                {!remoteStream && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center',
                      color: 'white',
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 64 }} />
                    <Typography>Waiting for others to join...</Typography>
                  </Box>
                )}
              </Box>

              {/* Local video */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  right: 16,
                  width: '200px',
                  height: '150px',
                  bgcolor: 'grey.800',
                  borderRadius: 1,
                  overflow: 'hidden',
                }}
              >
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>

              {/* Controls */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: 1,
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  padding: 1,
                  borderRadius: 4,
                }}
              >
                <IconButton onClick={toggleMute} color="primary">
                  {isMuted ? <MicOffIcon /> : <MicIcon />}
                </IconButton>
                <IconButton onClick={toggleVideo} color="primary">
                  {isVideoOff ? <VideocamOffIcon /> : <VideocamIcon />}
                </IconButton>
                <IconButton onClick={toggleScreenShare} color="primary">
                  {isScreenSharing ? <StopScreenShareIcon /> : <ScreenShareIcon />}
                </IconButton>
                <IconButton onClick={() => setIsChatOpen(true)} color="primary">
                  <ChatIcon />
                </IconButton>
                <IconButton onClick={handleEndCall} color="error">
                  <CallEndIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Participants list */}
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '70vh' }}>
            <CardContent>
              <MDTypography variant="h6" gutterBottom>
                Participants ({participants.length})
              </MDTypography>
              {participants.map((participant) => (
                <Box
                  key={participant.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <PersonIcon />
                  <Typography>
                    {participant.name} {participant.isHost && '(Host)'}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Chat Dialog */}
      <Dialog open={isChatOpen} onClose={() => setIsChatOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Chat</DialogTitle>
        <DialogContent>
          <Box sx={{ height: '300px', overflowY: 'auto', mb: 2 }}>
            {messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  mb: 1,
                  textAlign: message.sender === 'You' ? 'right' : 'left',
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {message.sender}
                </Typography>
                <Typography>{message.text}</Typography>
              </Box>
            ))}
          </Box>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsChatOpen(false)}>Close</Button>
          <Button onClick={handleSendMessage} variant="contained" color="primary">
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </MDBox>
  );
}

VideoMeeting.propTypes = {
  meetingId: PropTypes.string.isRequired,
  onEndCall: PropTypes.func.isRequired,
};

export default VideoMeeting;

/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================
*/

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

// @mui material components
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Icon from '@mui/material/Icon';

// Icons
import SendIcon from '@mui/icons-material/Send';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';

// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';

// Auth context
import { useAuth } from 'context/AuthContext';

// Helper function to get random response with typing delay
const getResponse = (query) => {
  // Normalize query to lowercase for easier matching
  const normalizedQuery = query.toLowerCase();

  // Define response categories
  const responses = {
    greeting: [
      "Hello! I'm your fitness assistant. How can I help you today?",
      'Hi there! Ready to crush some fitness goals today?',
      "Welcome to FitVice! I'm here to help with your fitness journey.",
    ],
    workout: [
      'For beginners, I recommend starting with 3 days of full-body workouts. Focus on compound movements like squats, push-ups, and rows.',
      'HIIT workouts are great for burning fat! Try 30 seconds of intense exercise followed by 30 seconds of rest for 20 minutes.',
      'To build muscle, focus on progressive overload - gradually increasing weight or reps over time.',
      'For a quick home workout, try: 3 sets of 15 push-ups, 3 sets of 15 squats, 3 sets of 10 lunges each leg, and a 30-second plank.',
      'A 5-day split might work well for intermediate lifters: Day 1: Chest, Day 2: Back, Day 3: Legs, Day 4: Shoulders, Day 5: Arms.',
      'Try this beginner-friendly leg day: 3x10 squats, 3x10 lunges, 3x15 calf raises, and 3x10 glute bridges.',
      'For cardio and strength combined, try circuit training - moving through 5-6 exercises with minimal rest in between.',
      'If you have limited time, focus on compound exercises that work multiple muscle groups: deadlifts, squats, bench press, and pull-ups.',
    ],
    nutrition: [
      'Protein is essential for muscle recovery. Aim for 1.6-2.2g per kg of bodyweight daily.',
      'Stay hydrated! Drink at least 8 glasses of water daily, more when exercising.',
      'Pre-workout nutrition should include carbs for energy and some protein. Try a banana with peanut butter.',
      'For weight loss, focus on creating a modest calorie deficit through a combination of diet and exercise.',
    ],
    cardio: [
      'For heart health, aim for 150 minutes of moderate cardio per week.',
      'Zone 2 cardio (60-70% max heart rate) is great for fat burning and endurance.',
      'Mix up your cardio with activities you enjoy - swimming, cycling, or dancing all count!',
      'HIIT cardio sessions can be as short as 15 minutes and still be effective!',
    ],
    weight: [
      "Healthy weight loss is about 1-2 pounds per week. Anything faster isn't sustainable.",
      'Weight fluctuations are normal! Focus on weekly trends rather than daily numbers.',
      'Building muscle while losing fat is possible with proper nutrition and strength training.',
      'Your BMI is just one metric - body composition matters more than weight alone.',
    ],
    help: [
      'I can help with workout suggestions, nutrition advice, and answer general fitness questions!',
      'Try asking me about workout plans, nutrition tips, or cardio exercises!',
      "I'm your AI fitness assistant - ask me anything about exercise, nutrition, or wellness!",
    ],
    fallback: [
      "I'm still learning about fitness topics. Could you rephrase that?",
      "Hmm, I'm not sure about that. Try asking about workouts, nutrition, or cardio instead!",
      "I don't have information on that yet. Is there something else I can help with?",
    ],
  };

  // Match query to category
  let category = 'fallback';

  if (normalizedQuery.match(/hello|hi|hey|greetings/)) {
    category = 'greeting';
  } else if (normalizedQuery.match(/workout|exercise|training|lift|strength|gym|routine|plan/)) {
    category = 'workout';
  } else if (normalizedQuery.match(/food|eat|diet|nutrition|protein|carb|calorie|meal/)) {
    category = 'nutrition';
  } else if (
    normalizedQuery.match(/cardio|run|running|jog|walk|swimming|cycling|heart|endurance/)
  ) {
    category = 'cardio';
  } else if (normalizedQuery.match(/weight|fat|lose|gain|bmi|body/)) {
    category = 'weight';
  } else if (normalizedQuery.match(/help|what|how|can you|assist/)) {
    category = 'help';
  }

  // Get random response from category
  const categoryResponses = responses[category];
  const randomIndex = Math.floor(Math.random() * categoryResponses.length);
  return categoryResponses[randomIndex];
};

function Chatbot({ isDialog, botName }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState(() => {
    // Try to load previous messages from localStorage
    const savedMessages = localStorage.getItem('fitvice-chat-history');
    if (savedMessages) {
      try {
        // Parse the saved messages and ensure timestamps are Date objects
        const parsedMessages = JSON.parse(savedMessages).map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));

        // Only return if we have valid messages
        if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
          return parsedMessages;
        }
      } catch (error) {
        console.error('Error parsing saved chat history:', error);
      }
    }

    // Default initial message with botName
    return [
      {
        id: 1,
        text: `Hello${
          user ? ` ${user.firstName}` : ''
        }! I'm Jarvis, your fitness assistant. How can I help with your fitness journey today?`,
        sender: 'bot',
        timestamp: new Date(),
      },
    ];
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('fitvice-chat-history', JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  }, [messages]);

  // Suggested questions
  const suggestions = [
    { text: 'Suggest a workout routine', icon: <FitnessCenterIcon /> },
    { text: 'Nutrition tips', icon: <RestaurantIcon /> },
    { text: 'Cardio exercise ideas', icon: <DirectionsRunIcon /> },
    { text: 'Weight loss advice', icon: <MonitorWeightIcon /> },
    { text: 'What can you help with?', icon: <HelpOutlineIcon /> },
  ];

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (text = input) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate bot thinking and typing
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getResponse(text),
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearConversation = () => {
    // Ask for confirmation first
    if (window.confirm('Are you sure you want to clear this conversation?')) {
      // Reset to just the welcome message with botName
      const welcomeMessage = {
        id: 1,
        text: `Hello${
          user ? ` ${user.firstName}` : ''
        }! I'm Jarvis, your fitness assistant. How can I help with your fitness journey today?`,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages([welcomeMessage]);
      // This will trigger the useEffect that saves to localStorage
    }
  };

  return isDialog ? (
    // Dialog version (simplified layout)
    <MDBox height="100%" display="flex" flexDirection="column">
      {/* Chat header */}
      <MDBox
        p={1.75}
        bgcolor="success.main"
        color="white"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box display="flex" alignItems="center">
          <MDTypography
            variant="h5"
            fontWeight="bold"
            color="#4caf50"
            sx={{
              textShadow: '0px 1px 2px rgba(0,0,0,0.3)',
              letterSpacing: '0.5px',
              ml: 5,
            }}
          >
            <span style={{ color: '#4caf50' }}>{botName}</span>
          </MDTypography>
        </Box>
        <MDButton
          color="white"
          variant="text"
          size="small"
          onClick={handleClearConversation}
          sx={{ minWidth: 'auto', p: 0.75 }}
        >
          <Icon>delete</Icon>
        </MDButton>
      </MDBox>

      {/* Messages container */}
      <MDBox
        p={2}
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'grey.100',
        }}
      >
        <List sx={{ width: '100%', p: 0 }}>
          {messages.map((message, index) => (
            <ListItem
              key={message.id}
              sx={{
                textAlign: message.sender === 'user' ? 'right' : 'left',
                pl: message.sender === 'user' ? 3 : 1,
                pr: message.sender === 'user' ? 1 : 3,
                mt: index > 0 ? 0.75 : 0,
                py: 0.75,
              }}
              alignItems="flex-start"
            >
              {message.sender === 'bot' && (
                <ListItemAvatar sx={{ minWidth: 40 }}>
                  <Avatar sx={{ bgcolor: 'success.main', width: 32, height: 32 }}>
                    <SmartToyIcon />
                  </Avatar>
                </ListItemAvatar>
              )}
              <ListItemText
                primary={
                  <Card
                    sx={{
                      p: 1.5,
                      display: 'inline-block',
                      bgcolor: message.sender === 'user' ? 'success.main' : 'white',
                      borderRadius:
                        message.sender === 'user' ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
                      maxWidth: '85%',
                      ml: message.sender === 'user' ? 'auto' : 0,
                      mr: message.sender === 'user' ? 0 : 'auto',
                      boxShadow: 1,
                    }}
                  >
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{
                        color: message.sender === 'user' ? 'white' : 'text.primary',
                        whiteSpace: 'pre-wrap',
                        fontSize: '0.875rem',
                      }}
                    >
                      {message.text}
                    </Typography>
                  </Card>
                }
                secondary={
                  <Typography
                    component="span"
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display: 'block',
                      mt: 0.25,
                      fontSize: '0.7rem',
                      textAlign: message.sender === 'user' ? 'right' : 'left',
                    }}
                  >
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Typography>
                }
              />
              {message.sender === 'user' && (
                <ListItemAvatar sx={{ minWidth: 40, ml: 1 }}>
                  <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
              )}
            </ListItem>
          ))}
          {isTyping && (
            <ListItem alignItems="flex-start" sx={{ py: 0.75 }}>
              <ListItemAvatar sx={{ minWidth: 40 }}>
                <Avatar sx={{ bgcolor: 'success.main', width: 32, height: 32 }}>
                  <SmartToyIcon />
                </Avatar>
              </ListItemAvatar>
              <Box
                sx={{
                  display: 'flex',
                  p: 1.5,
                  bgcolor: 'white',
                  borderRadius: '4px 18px 18px 18px',
                  boxShadow: 1,
                  mt: 0.5,
                }}
              >
                <Typography variant="body2">
                  <span className="typing-dot">.</span>
                  <span className="typing-dot">.</span>
                  <span className="typing-dot">.</span>
                </Typography>
              </Box>
            </ListItem>
          )}
          <div ref={messagesEndRef} />
        </List>

        {/* Suggestions */}
        {messages.length < 3 && (
          <Box
            sx={{
              mt: 1.5,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 0.75,
              justifyContent: 'center',
            }}
          >
            {suggestions.map((suggestion, index) => (
              <Chip
                key={index}
                icon={suggestion.icon}
                label={suggestion.text}
                size="medium"
                onClick={() => handleSendMessage(suggestion.text)}
                sx={{
                  m: 0.5,
                  fontSize: '0.75rem',
                  height: 32,
                  bgcolor: 'white',
                  '&:hover': { bgcolor: 'success.light', color: 'white' },
                  transition: 'all 0.2s',
                }}
              />
            ))}
          </Box>
        )}
      </MDBox>

      {/* Input area */}
      <MDBox p={1.5} bgcolor="white" borderTop={1} borderColor="grey.300">
        <TextField
          fullWidth
          multiline
          maxRows={2}
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          variant="outlined"
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => handleSendMessage()}
                  disabled={!input.trim() || isTyping}
                  color="success"
                  size="medium"
                >
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '24px',
              paddingRight: '12px',
              fontSize: '0.9rem',
            },
          }}
        />
      </MDBox>

      {/* Styling for typing animation */}
      <style data-style="true">{`
        @keyframes blink {
          0% { opacity: 0.2; }
          20% { opacity: 1; }
          100% { opacity: 0.2; }
        }
        .typing-dot {
          animation: blink 1.4s infinite;
          animation-fill-mode: both;
          font-size: 1.75rem;
          line-height: 0;
        }
        .typing-dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        .typing-dot:nth-child(3) {
          animation-delay: 0.4s;
        }
      `}</style>
    </MDBox>
  ) : (
    // Regular page version with full dashboard layout
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} lg={10} xl={8} sx={{ mx: 'auto' }}>
            <Card
              sx={{ overflow: 'hidden', height: '75vh', display: 'flex', flexDirection: 'column' }}
            >
              {/* Chat header */}
              <MDBox
                p={2}
                bgcolor="success.main"
                color="white"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: 'white', color: '#4caf50', mr: 1 }}>
                    <SmartToyIcon />
                  </Avatar>
                  <MDTypography
                    variant="h5"
                    fontWeight="bold"
                    color="#4caf50"
                    sx={{
                      textShadow: '0px 1px 2px rgba(0,0,0,0.3)',
                      letterSpacing: '0.5px',
                    }}
                  >
                    <span style={{ color: '#4caf50' }}>{botName}</span>
                  </MDTypography>
                </Box>
                <MDButton
                  color="white"
                  variant="text"
                  size="small"
                  onClick={handleClearConversation}
                  startIcon={<Icon>delete</Icon>}
                >
                  Clear
                </MDButton>
              </MDBox>

              {/* Messages container */}
              <MDBox
                p={2}
                sx={{
                  flexGrow: 1,
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  bgcolor: 'grey.100',
                }}
              >
                <List sx={{ width: '100%', p: 0 }}>
                  {messages.map((message, index) => (
                    <ListItem
                      key={message.id}
                      sx={{
                        textAlign: message.sender === 'user' ? 'right' : 'left',
                        pl: message.sender === 'user' ? 4 : 1,
                        pr: message.sender === 'user' ? 1 : 4,
                        mt: index > 0 ? 1 : 0,
                      }}
                      alignItems="flex-start"
                    >
                      {message.sender === 'bot' && (
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'success.main' }}>
                            <SmartToyIcon />
                          </Avatar>
                        </ListItemAvatar>
                      )}
                      <ListItemText
                        primary={
                          <Card
                            sx={{
                              p: 1.5,
                              display: 'inline-block',
                              bgcolor: message.sender === 'user' ? 'success.main' : 'white',
                              borderRadius:
                                message.sender === 'user'
                                  ? '20px 5px 20px 20px'
                                  : '5px 20px 20px 20px',
                              maxWidth: '80%',
                              ml: message.sender === 'user' ? 'auto' : 0,
                              mr: message.sender === 'user' ? 0 : 'auto',
                              boxShadow: 1,
                            }}
                          >
                            <Typography
                              component="span"
                              variant="body1"
                              sx={{
                                color: message.sender === 'user' ? 'white' : 'text.primary',
                                whiteSpace: 'pre-wrap',
                              }}
                            >
                              {message.text}
                            </Typography>
                          </Card>
                        }
                        secondary={
                          <Typography
                            component="span"
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              display: 'block',
                              mt: 0.5,
                              textAlign: message.sender === 'user' ? 'right' : 'left',
                            }}
                          >
                            {new Date(message.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </Typography>
                        }
                      />
                      {message.sender === 'user' && (
                        <ListItemAvatar sx={{ ml: 2 }}>
                          <Avatar sx={{ bgcolor: 'secondary.main' }}>
                            <PersonIcon />
                          </Avatar>
                        </ListItemAvatar>
                      )}
                    </ListItem>
                  ))}
                  {isTyping && (
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'success.main' }}>
                          <SmartToyIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <Box
                        sx={{
                          display: 'flex',
                          p: 2,
                          bgcolor: 'white',
                          borderRadius: '5px 20px 20px 20px',
                          boxShadow: 1,
                          mt: 1,
                        }}
                      >
                        <Typography variant="body2">
                          <span className="typing-dot">.</span>
                          <span className="typing-dot">.</span>
                          <span className="typing-dot">.</span>
                        </Typography>
                      </Box>
                    </ListItem>
                  )}
                  <div ref={messagesEndRef} />
                </List>

                {/* Suggestions */}
                {messages.length < 3 && (
                  <Box
                    sx={{
                      mt: 2,
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 1,
                      justifyContent: 'center',
                    }}
                  >
                    {suggestions.map((suggestion, index) => (
                      <Chip
                        key={index}
                        icon={suggestion.icon}
                        label={suggestion.text}
                        onClick={() => handleSendMessage(suggestion.text)}
                        sx={{
                          m: 0.5,
                          bgcolor: 'white',
                          '&:hover': { bgcolor: 'success.light', color: 'white' },
                          transition: 'all 0.2s',
                        }}
                      />
                    ))}
                  </Box>
                )}
              </MDBox>

              {/* Input area */}
              <MDBox p={2} bgcolor="white" borderTop={1} borderColor="grey.300">
                <TextField
                  fullWidth
                  multiline
                  maxRows={3}
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => handleSendMessage()}
                          disabled={!input.trim() || isTyping}
                          color="success"
                        >
                          <SendIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '30px',
                      paddingRight: '14px',
                    },
                  }}
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />

      {/* Styling for typing animation */}
      <style data-style="true">{`
        @keyframes blink {
          0% { opacity: 0.2; }
          20% { opacity: 1; }
          100% { opacity: 0.2; }
        }
        .typing-dot {
          animation: blink 1.4s infinite;
          animation-fill-mode: both;
          font-size: 2rem;
          line-height: 0;
        }
        .typing-dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        .typing-dot:nth-child(3) {
          animation-delay: 0.4s;
        }
      `}</style>
    </DashboardLayout>
  );
}

// Add PropTypes validation
Chatbot.propTypes = {
  isDialog: PropTypes.bool,
  botName: PropTypes.string,
};

// Set default props
Chatbot.defaultProps = {
  isDialog: false,
  botName: 'Jarvis',
};

export default Chatbot;

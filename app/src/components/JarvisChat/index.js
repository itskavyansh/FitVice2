import React, { useState, useRef, useEffect } from 'react';
import { useJarvis } from '../../context/JarvisContext';
import VoiceInterface from './VoiceInterface';
import ReactMarkdown from 'react-markdown';
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Typography,
  CircularProgress,
  Fade,
  Card,
  CardContent,
  Chip,
  Drawer,
  useTheme,
  useMediaQuery,
  Button,
  Tooltip,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ScheduleIcon from '@mui/icons-material/Schedule';
import TimerIcon from '@mui/icons-material/Timer';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const MessageBubble = ({ message, isUser }) => {
  const renderContent = () => {
    // Handle string messages (both direct strings and message objects with message property)
    if (typeof message === 'string') {
      return <ReactMarkdown>{message}</ReactMarkdown>;
    }
    if (typeof message.message === 'string') {
      return <ReactMarkdown>{message.message}</ReactMarkdown>;
    }

    // Handle structured responses based on type
    if (message?.metadata?.type === 'workout_plan') {
      const plan = message.metadata.data || {};
      return (
        <Card variant="outlined">
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <FitnessCenterIcon />
              <Typography variant="h6">Workout Plan</Typography>
            </Box>
            {Array.isArray(plan.exercises) && plan.exercises.map((exercise, index) => (
              <Box key={index} mb={1}>
                <Typography variant="body2" color="text.secondary">
                  {exercise.name}
                  {exercise.duration ? ` - ${exercise.duration}` : ''}
                  {exercise.sets ? ` - ${exercise.sets} sets of ${exercise.reps} reps` : ''}
                </Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      );
    }

    if (message?.metadata?.type === 'meal_plan') {
      const plan = message.metadata.data || {};
      return (
        <Card variant="outlined">
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <RestaurantIcon />
              <Typography variant="h6">Meal Plan</Typography>
            </Box>
            {Array.isArray(plan.meals) && plan.meals.map((meal, index) => (
              <Box key={index} mb={1}>
                <Typography variant="subtitle2" color="primary">
                  {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {Array.isArray(meal.items) ? meal.items.join(', ') : meal.items}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {meal.calories} calories
                </Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      );
    }

    if (message?.metadata?.type === 'task_created') {
      const task = message.metadata.data || {};
      return (
        <Card variant="outlined">
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <AssignmentIcon />
              <Typography variant="h6">Task Created</Typography>
            </Box>
            <Typography variant="body1">{task.title || 'New Task'}</Typography>
            {task.dueDate && (
              <Typography variant="body2" color="text.secondary">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </Typography>
            )}
            <Chip 
              label={task.priority || 'normal'} 
              size="small"
              sx={{ mt: 1 }}
              color={
                task.priority === 'high' ? 'error' :
                task.priority === 'medium' ? 'warning' : 'default'
              }
            />
          </CardContent>
        </Card>
      );
    }

    // Handle suggestions
    if (message?.suggestions) {
      return (
        <>
          <ReactMarkdown>{message.message || 'Here are some suggestions:'}</ReactMarkdown>
          <Box display="flex" gap={1} flexWrap="wrap">
            {message.suggestions.map((suggestion, index) => (
              <Chip
                key={index}
                label={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                color="primary"
                variant="outlined"
                sx={{ mb: 1 }}
              />
            ))}
          </Box>
        </>
      );
    }

    // Default to displaying the message or a fallback
    return <ReactMarkdown>{message?.message || 'No message content'}</ReactMarkdown>;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 2,
      }}
    >
      <Paper
        elevation={1}
        sx={{
          p: 2,
          maxWidth: '80%',
          backgroundColor: isUser ? 'primary.light' : 'background.paper',
          color: isUser ? 'primary.contrastText' : 'text.primary',
          borderRadius: isUser ? '20px 20px 0 20px' : '20px 20px 20px 0',
        }}
      >
        {renderContent()}
      </Paper>
    </Box>
  );
};

const JarvisChat = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const {
    getJarvisResponse,
    conversationHistory,
    clearConversation,
    isProcessing,
  } = useJarvis();

  const [input, setInput] = useState('');
  const [showAutomation, setShowAutomation] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversationHistory]);

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }
    if (!input.trim() || isProcessing) return;

    const userMessage = input.trim();
    setInput('');
    await getJarvisResponse(userMessage);
  };

  const handleVoiceInput = (transcript) => {
    setInput(transcript);
    handleSubmit();
  };

  const automationCommands = [
    {
      title: 'Schedule Workout',
      description: 'Set up a recurring workout schedule',
      icon: <ScheduleIcon />,
      command: 'Schedule a workout routine for me every Monday, Wednesday, and Friday at 7 AM'
    },
    {
      title: 'Meal Prep Reminder',
      description: 'Get reminders for meal preparation',
      icon: <RestaurantIcon />,
      command: 'Remind me to prepare my meals every Sunday at 3 PM'
    },
    {
      title: 'Progress Check',
      description: 'Set up automatic progress tracking',
      icon: <PlaylistAddCheckIcon />,
      command: 'Track my workout progress and send me a weekly report every Sunday'
    },
    {
      title: 'Water Intake',
      description: 'Set up water intake reminders',
      icon: <TimerIcon />,
      command: 'Remind me to drink water every 2 hours from 8 AM to 8 PM'
    }
  ];

  const handleAutomationCommand = (command) => {
    setInput(command);
    setShowAutomation(false);
    handleSubmit();
  };

  return (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      position: 'relative',
      backgroundColor: 'background.default',
      overflow: 'hidden'
    }}>
      {/* Main Chat Area */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        transition: 'all 0.3s ease',
        transform: showAutomation ? 'translateX(-100%)' : 'translateX(0)',
        opacity: showAutomation ? 0 : 1,
        width: '100%'
      }}>
        {/* Chat Header */}
        <Box sx={{
          p: 2,
          backgroundColor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Jarvis AI Assistant</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Automation Commands">
              <IconButton 
                onClick={() => setShowAutomation(!showAutomation)}
                color={showAutomation ? "primary" : "default"}
                size="small"
              >
                <AutoFixHighIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Clear Conversation">
              <IconButton 
                onClick={clearConversation} 
                color="error" 
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Messages Area */}
        <Box sx={{ 
          flex: 1, 
          overflow: 'auto', 
          p: 3,
          backgroundColor: 'grey.50',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: theme.palette.grey[300],
            borderRadius: '4px',
            '&:hover': {
              background: theme.palette.grey[400],
            },
          },
        }}>
          {conversationHistory.length === 0 ? (
            <Box sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'text.secondary',
              textAlign: 'center',
              gap: 2
            }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Welcome to Jarvis!
              </Typography>
              <Typography variant="body1" sx={{ maxWidth: '80%' }}>
                I can help you with workout planning, meal planning, and task management.
              </Typography>
              <Typography variant="body1" sx={{ maxWidth: '80%' }}>
                Try asking me something or check out the automation commands.
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                You can also use voice commands by clicking the microphone icon.
              </Typography>
            </Box>
          ) : (
            conversationHistory.map((message, index) => (
              <MessageBubble
                key={index}
                message={message}
                isUser={message.isUser}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input Area */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: 2,
            backgroundColor: 'background.paper',
            borderTop: 1,
            borderColor: 'divider',
            display: 'flex',
            gap: 1,
            alignItems: 'center',
            position: 'sticky',
            bottom: 0,
            zIndex: 10,
            boxShadow: '0 -2px 4px rgba(0,0,0,0.05)'
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isProcessing}
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
                backgroundColor: 'background.default',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'background.paper',
                },
              },
            }}
            InputProps={{
              endAdornment: (
                <VoiceInterface
                  onVoiceInput={handleVoiceInput}
                  isProcessing={isProcessing}
                  disabled={isProcessing}
                />
              ),
            }}
          />
          <IconButton
            type="submit"
            color="primary"
            disabled={!input.trim() || isProcessing}
            sx={{
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1)',
              },
            }}
          >
            {isProcessing ? (
              <CircularProgress size={24} />
            ) : (
              <SendIcon />
            )}
          </IconButton>
        </Box>
      </Box>

      {/* Automation View */}
      <Box sx={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        transition: 'all 0.3s ease',
        transform: showAutomation ? 'translateX(0)' : 'translateX(100%)',
        opacity: showAutomation ? 1 : 0,
        backgroundColor: 'background.paper',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Box sx={{
          p: 2,
          backgroundColor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Automation Commands</Typography>
          <IconButton 
            onClick={() => setShowAutomation(false)}
            size="small"
          >
            <ArrowBackIcon />
          </IconButton>
        </Box>
        <Box sx={{ 
          flex: 1, 
          overflow: 'auto', 
          p: 3,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: theme.palette.grey[300],
            borderRadius: '4px',
            '&:hover': {
              background: theme.palette.grey[400],
            },
          },
        }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {automationCommands.map((cmd, index) => (
              <Card 
                key={index} 
                variant="outlined"
                sx={{
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[2],
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    {cmd.icon}
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      {cmd.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {cmd.description}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleAutomationCommand(cmd.command)}
                    sx={{
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.02)',
                      },
                    }}
                  >
                    Use Command
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default JarvisChat; 
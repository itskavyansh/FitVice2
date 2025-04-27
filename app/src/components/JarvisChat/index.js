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
  Grid,
  alpha,
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
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const MessageBubble = ({ message, isUser, darkMode }) => {
  const { getJarvisResponse } = useJarvis();

  // Helper function to detect intents in the message text
  const detectIntents = (text) => {
    const intents = {
      workout: /workout|exercise|fitness|training|gym|cardio|strength/i.test(text),
      nutrition: /nutrition|diet|food|meal|eat|recipe|calorie|protein|carb|fat/i.test(text),
      schedule: /schedule|calendar|plan|remind|appointment|event/i.test(text),
      progress: /progress|track|monitor|measure|record|log|weight/i.test(text),
    };

    return Object.keys(intents).filter((key) => intents[key]);
  };

  // Function to handle button actions
  const handleActionClick = (action) => {
    let prompt = '';
    switch (action) {
      case 'create_workout':
        prompt = 'Create a detailed workout plan based on this';
        break;
      case 'show_nutrition':
        prompt = 'Show me a meal plan that complements this';
        break;
      case 'recipe_ideas':
        prompt = 'Generate some healthy recipe ideas related to this';
        break;
      case 'track_progress':
        prompt = 'Help me track my progress for this';
        break;
      case 'set_reminder':
        prompt = 'Set a reminder for this activity';
        break;
      case 'view_details':
        prompt = 'Give me more details about this';
        break;
      default:
        prompt = 'Tell me more about this';
    }

    // Get the original message content as context
    const messageContent =
      typeof message === 'string' ? message : message.message || 'this information';

    // Submit the follow-up prompt
    getJarvisResponse(`${prompt}: "${messageContent.slice(0, 100)}..."`);
  };

  const renderActionButtons = () => {
    // Don't show action buttons on user messages
    if (isUser) return null;

    const messageText = typeof message === 'string' ? message : message.message || '';

    const detectedIntents = detectIntents(messageText);

    // Don't show buttons if no intents were detected
    if (detectedIntents.length === 0) return null;

    const buttons = [];

    if (detectedIntents.includes('workout')) {
      buttons.push(
        <Button
          key="workout"
          variant="outlined"
          size="small"
          color="primary"
          startIcon={<FitnessCenterIcon />}
          onClick={() => handleActionClick('create_workout')}
          sx={{ m: 0.5 }}
        >
          Create Workout
        </Button>,
      );
    }

    if (detectedIntents.includes('nutrition')) {
      buttons.push(
        <Button
          key="nutrition"
          variant="outlined"
          size="small"
          color="primary"
          startIcon={<RestaurantIcon />}
          onClick={() => handleActionClick('show_nutrition')}
          sx={{ m: 0.5 }}
        >
          Meal Plan
        </Button>,
        <Button
          key="recipe"
          variant="outlined"
          size="small"
          color="primary"
          startIcon={<RestaurantIcon />}
          onClick={() => handleActionClick('recipe_ideas')}
          sx={{ m: 0.5 }}
        >
          Recipe Ideas
        </Button>,
      );
    }

    if (detectedIntents.includes('schedule')) {
      buttons.push(
        <Button
          key="schedule"
          variant="outlined"
          size="small"
          color="primary"
          startIcon={<ScheduleIcon />}
          onClick={() => handleActionClick('set_reminder')}
          sx={{ m: 0.5 }}
        >
          Set Reminder
        </Button>,
      );
    }

    if (detectedIntents.includes('progress')) {
      buttons.push(
        <Button
          key="progress"
          variant="outlined"
          size="small"
          color="primary"
          startIcon={<PlaylistAddCheckIcon />}
          onClick={() => handleActionClick('track_progress')}
          sx={{ m: 0.5 }}
        >
          Track Progress
        </Button>,
      );
    }

    // Always offer a "more details" button if we detected any intent
    if (buttons.length > 0) {
      buttons.push(
        <Button
          key="more"
          variant="outlined"
          size="small"
          color="secondary"
          onClick={() => handleActionClick('view_details')}
          sx={{ m: 0.5 }}
        >
          More Details
        </Button>,
      );
    }

    return buttons.length > 0 ? (
      <Box mt={2} display="flex" flexWrap="wrap">
        {buttons}
      </Box>
    ) : null;
  };

  const renderContent = () => {
    // Handle string messages (both direct strings and message objects with message property)
    if (typeof message === 'string') {
      return (
        <>
          <ReactMarkdown>{message}</ReactMarkdown>
          {renderActionButtons()}
        </>
      );
    }
    if (typeof message.message === 'string') {
      return (
        <>
          <ReactMarkdown>{message.message}</ReactMarkdown>
          {renderActionButtons()}
        </>
      );
    }

    // Handle structured responses based on type
    if (message?.metadata?.type === 'workout_plan') {
      const plan = message.metadata.data || {};
      return (
        <>
          <Card
            variant="outlined"
            sx={{
              backgroundColor: darkMode ? 'rgba(66, 66, 66, 0.6)' : 'rgba(255, 255, 255, 0.8)',
              borderColor: darkMode ? 'grey.700' : 'grey.300',
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <FitnessCenterIcon color="primary" />
                <Typography variant="h6">Workout Plan</Typography>
              </Box>
              {Array.isArray(plan.exercises) &&
                plan.exercises.map((exercise, index) => (
                  <Box key={index} mb={1}>
                    <Typography variant="body2" color="text.secondary">
                      {exercise.name}
                      {exercise.duration ? ` - ${exercise.duration}` : ''}
                      {exercise.sets ? ` - ${exercise.sets} sets of ${exercise.reps} reps` : ''}
                    </Typography>
                  </Box>
                ))}
              <Box mt={2} display="flex" flexWrap="wrap">
                <Button
                  variant="outlined"
                  size="small"
                  color="primary"
                  startIcon={<ScheduleIcon />}
                  onClick={() => handleActionClick('set_reminder')}
                  sx={{ m: 0.5 }}
                >
                  Schedule Workout
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  color="primary"
                  startIcon={<PlaylistAddCheckIcon />}
                  onClick={() => handleActionClick('track_progress')}
                  sx={{ m: 0.5 }}
                >
                  Track Progress
                </Button>
              </Box>
            </CardContent>
          </Card>
        </>
      );
    }

    if (message?.metadata?.type === 'meal_plan') {
      const plan = message.metadata.data || {};
      return (
        <>
          <Card
            variant="outlined"
            sx={{
              backgroundColor: darkMode ? 'rgba(66, 66, 66, 0.6)' : 'rgba(255, 255, 255, 0.8)',
              borderColor: darkMode ? 'grey.700' : 'grey.300',
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <RestaurantIcon color="primary" />
                <Typography variant="h6">Meal Plan</Typography>
              </Box>
              {Array.isArray(plan.meals) &&
                plan.meals.map((meal, index) => (
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
              <Box mt={2} display="flex" flexWrap="wrap">
                <Button
                  variant="outlined"
                  size="small"
                  color="primary"
                  startIcon={<RestaurantIcon />}
                  onClick={() => handleActionClick('recipe_ideas')}
                  sx={{ m: 0.5 }}
                >
                  Recipe Ideas
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  color="primary"
                  startIcon={<ScheduleIcon />}
                  onClick={() => handleActionClick('set_reminder')}
                  sx={{ m: 0.5 }}
                >
                  Schedule Meal Prep
                </Button>
              </Box>
            </CardContent>
          </Card>
        </>
      );
    }

    if (message?.metadata?.type === 'task_created') {
      const task = message.metadata.data || {};
      return (
        <>
          <Card
            variant="outlined"
            sx={{
              backgroundColor: darkMode ? 'rgba(66, 66, 66, 0.6)' : 'rgba(255, 255, 255, 0.8)',
              borderColor: darkMode ? 'grey.700' : 'grey.300',
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <AssignmentIcon color="primary" />
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
                  task.priority === 'high'
                    ? 'error'
                    : task.priority === 'medium'
                      ? 'warning'
                      : 'default'
                }
              />
              <Box mt={2} display="flex" flexWrap="wrap">
                <Button
                  variant="outlined"
                  size="small"
                  color="primary"
                  startIcon={<ScheduleIcon />}
                  onClick={() => handleActionClick('set_reminder')}
                  sx={{ m: 0.5 }}
                >
                  Set Reminder
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  color="primary"
                  startIcon={<PlaylistAddCheckIcon />}
                  onClick={() => handleActionClick('track_progress')}
                  sx={{ m: 0.5 }}
                >
                  Track Progress
                </Button>
              </Box>
            </CardContent>
          </Card>
        </>
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
                onClick={() => getJarvisResponse(suggestion)}
                color="primary"
                variant="outlined"
                sx={{
                  mb: 1,
                  backgroundColor: darkMode ? 'rgba(66, 66, 66, 0.6)' : 'rgba(255, 255, 255, 0.8)',
                  borderColor: darkMode ? 'primary.dark' : 'primary.main',
                  '&:hover': {
                    backgroundColor: darkMode ? 'primary.dark' : 'primary.light',
                    color: darkMode ? 'common.white' : 'primary.main',
                  },
                }}
              />
            ))}
          </Box>
          {renderActionButtons()}
        </>
      );
    }

    // Default to displaying the message or a fallback
    return (
      <>
        <ReactMarkdown>{message?.message || 'No message content'}</ReactMarkdown>
        {renderActionButtons()}
      </>
    );
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
          backgroundColor: isUser
            ? darkMode
              ? 'primary.dark'
              : 'primary.light'
            : darkMode
              ? 'grey.800'
              : 'background.paper',
          color: isUser
            ? darkMode
              ? 'primary.contrastText'
              : 'primary.contrastText'
            : darkMode
              ? 'common.white'
              : 'text.primary',
          borderRadius: isUser ? '20px 20px 0 20px' : '20px 20px 20px 0',
          boxShadow: darkMode ? '0 2px 8px rgba(0, 0, 0, 0.5)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s',
          border: darkMode ? `1px solid ${isUser ? 'primary.dark' : 'grey.700'}` : 'none',
        }}
      >
        {renderContent()}
      </Paper>
    </Box>
  );
};

// Add a new component for quick action buttons at the top of the chat
const QuickActions = ({ onActionClick }) => {
  const actions = [
    {
      id: 'workout',
      icon: <FitnessCenterIcon />,
      label: 'Workout',
      prompt: 'Create a 30-minute full body workout plan',
    },
    {
      id: 'meal',
      icon: <RestaurantIcon />,
      label: 'Meal Plan',
      prompt: 'Suggest healthy meal ideas for today',
    },
    {
      id: 'reminder',
      icon: <ScheduleIcon />,
      label: 'Reminder',
      prompt: 'Set a reminder for my workout',
    },
    {
      id: 'progress',
      icon: <PlaylistAddCheckIcon />,
      label: 'Progress',
      prompt: 'Track my fitness progress',
    },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        overflowX: 'auto',
        py: 1,
        px: 2,
        '&::-webkit-scrollbar': {
          height: '4px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: (theme) => theme.palette.grey[300],
          borderRadius: '4px',
        },
      }}
    >
      {actions.map((action) => (
        <Button
          key={action.id}
          variant="outlined"
          size="small"
          startIcon={action.icon}
          onClick={() => onActionClick(action.prompt)}
          sx={{
            borderRadius: '20px',
            whiteSpace: 'nowrap',
            minWidth: 'auto',
            transition: 'all 0.3s',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: 1,
            },
          }}
        >
          {action.label}
        </Button>
      ))}
    </Box>
  );
};

// Add a Welcome Screen component with featured capabilities
const WelcomeScreen = ({ onActionClick }) => {
  const theme = useTheme();

  const capabilities = [
    {
      id: 'workout',
      icon: <FitnessCenterIcon fontSize="large" />,
      title: 'Workout Plans',
      description: 'Create personalized workout routines based on your goals',
      prompt: 'Create a personalized workout plan',
      color: theme.palette.primary.main,
    },
    {
      id: 'nutrition',
      icon: <RestaurantIcon fontSize="large" />,
      title: 'Meal Planning',
      description: 'Get healthy meal ideas and nutrition advice',
      prompt: 'Plan my meals for the week',
      color: theme.palette.success.main,
    },
    {
      id: 'reminders',
      icon: <ScheduleIcon fontSize="large" />,
      title: 'Reminders & Scheduling',
      description: 'Set reminders for workouts and track your progress',
      prompt: 'Set a workout reminder',
      color: theme.palette.warning.main,
    },
    {
      id: 'tracking',
      icon: <PlaylistAddCheckIcon fontSize="large" />,
      title: 'Progress Tracking',
      description: 'Track your fitness journey and celebrate milestones',
      prompt: 'Help me track my progress',
      color: theme.palette.info.main,
    },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        p: 3,
        textAlign: 'center',
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Welcome to Jarvis
      </Typography>

      <Typography variant="body1" sx={{ mb: 4, maxWidth: '600px' }}>
        Your personal AI fitness assistant. I can help you with workouts, nutrition, scheduling, and
        more.
      </Typography>

      <Grid container spacing={2} sx={{ maxWidth: '800px' }}>
        {capabilities.map((capability) => (
          <Grid item xs={12} sm={6} key={capability.id}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                transition: 'all 0.3s',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3,
                  borderColor: capability.color,
                },
              }}
              onClick={() => onActionClick(capability.prompt)}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  mb: 2,
                  color: capability.color,
                  backgroundColor: alpha(capability.color, 0.1),
                }}
              >
                {capability.icon}
              </Box>
              <Typography variant="h6" gutterBottom>
                {capability.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {capability.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
        Try saying "Create a workout plan" or click one of the options above to get started.
      </Typography>
    </Box>
  );
};

const JarvisChat = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { getJarvisResponse, conversationHistory, clearConversation, isProcessing } = useJarvis();

  const [input, setInput] = useState('');
  const [showAutomation, setShowAutomation] = useState(false);
  const [showDarkMode, setShowDarkMode] = useState(false);
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
    if (!transcript || typeof transcript !== 'string' || transcript.trim() === '') {
      console.error('Invalid transcript received:', transcript);
      return;
    }

    console.log('Received voice input:', transcript);
    setInput(transcript);

    // Use setTimeout with a slightly longer delay to ensure state update before submission
    setTimeout(() => {
      if (transcript && transcript.trim()) {
        console.log('Submitting voice input form...');
        const form = document.querySelector('form');
        if (form) {
          const submitEvent = new Event('submit', { cancelable: true });
          form.dispatchEvent(submitEvent);
        } else {
          console.error('Form element not found for voice submission');
          // Fallback to direct handleSubmit call
          handleSubmit();
        }
      } else {
        console.warn('Empty transcript after state update, aborting submission');
      }
    }, 300); // Longer delay to ensure state is updated
  };

  const handleQuickAction = (prompt) => {
    setInput(prompt);
    setTimeout(() => handleSubmit(), 100);
  };

  const automationCommands = [
    {
      title: 'Schedule Workout',
      description: 'Set up a recurring workout schedule',
      icon: <ScheduleIcon />,
      command: 'Schedule a workout routine for me every Monday, Wednesday, and Friday at 7 AM',
    },
    {
      title: 'Meal Prep Reminder',
      description: 'Get reminders for meal preparation',
      icon: <RestaurantIcon />,
      command: 'Remind me to prepare my meals every Sunday at 3 PM',
    },
    {
      title: 'Progress Check',
      description: 'Set up automatic progress tracking',
      icon: <PlaylistAddCheckIcon />,
      command: 'Track my workout progress and send me a weekly report every Sunday',
    },
    {
      title: 'Water Intake',
      description: 'Set up water intake reminders',
      icon: <TimerIcon />,
      command: 'Remind me to drink water every 2 hours from 8 AM to 8 PM',
    },
  ];

  const handleAutomationCommand = (command) => {
    setInput(command);
    setShowAutomation(false);
    handleSubmit();
  };

  const toggleDarkMode = () => {
    setShowDarkMode(!showDarkMode);
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        position: 'relative',
        backgroundColor: showDarkMode ? 'grey.900' : 'background.default',
        overflow: 'hidden',
        color: showDarkMode ? 'common.white' : 'text.primary',
        transition: 'background-color 0.3s, color 0.3s',
      }}
    >
      {/* Main Chat Area */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          position: 'relative',
          transition: 'all 0.3s ease',
          transform: showAutomation ? 'translateX(-100%)' : 'translateX(0)',
          opacity: showAutomation ? 0 : 1,
          width: '100%',
        }}
      >
        {/* Chat Header */}
        <Box
          sx={{
            p: 2,
            backgroundColor: showDarkMode ? 'grey.800' : 'background.paper',
            borderBottom: 1,
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 10,
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Jarvis AI Assistant
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title={showDarkMode ? 'Light Mode' : 'Dark Mode'}>
              <IconButton onClick={toggleDarkMode} size="small">
                {showDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Automation Commands">
              <IconButton
                onClick={() => setShowAutomation(!showAutomation)}
                color={showAutomation ? 'primary' : 'default'}
                size="small"
              >
                <AutoFixHighIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Clear Conversation">
              <IconButton onClick={clearConversation} color="error" size="small">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Quick Action Buttons */}
        {conversationHistory.length > 0 && <QuickActions onActionClick={handleQuickAction} />}

        {/* Messages Area */}
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            p: 3,
            backgroundColor: showDarkMode ? 'grey.900' : 'grey.50',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: theme.palette.grey[showDarkMode ? 700 : 300],
              borderRadius: '4px',
              '&:hover': {
                background: theme.palette.grey[showDarkMode ? 600 : 400],
              },
            },
          }}
        >
          {conversationHistory.length === 0 ? (
            <WelcomeScreen onActionClick={handleQuickAction} />
          ) : (
            conversationHistory.map((message, index) => (
              <MessageBubble
                key={index}
                message={message}
                isUser={message.isUser}
                darkMode={showDarkMode}
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
            backgroundColor: showDarkMode ? 'grey.800' : 'background.paper',
            borderTop: 1,
            borderColor: 'divider',
            display: 'flex',
            gap: 1,
            alignItems: 'center',
            position: 'sticky',
            bottom: 0,
            zIndex: 10,
            boxShadow: '0 -2px 4px rgba(0,0,0,0.05)',
            transition: 'background-color 0.3s',
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
                backgroundColor: showDarkMode ? 'grey.800' : 'background.default',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: showDarkMode ? 'grey.700' : 'background.paper',
                },
              },
              '& .MuiOutlinedInput-input': {
                color: showDarkMode ? 'common.white' : 'text.primary',
              },
            }}
            InputProps={{
              endAdornment: (
                <VoiceInterface
                  onVoiceInput={handleVoiceInput}
                  isProcessing={isProcessing}
                  disabled={isProcessing}
                  darkMode={showDarkMode}
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
            {isProcessing ? <CircularProgress size={24} /> : <SendIcon />}
          </IconButton>
        </Box>
      </Box>

      {/* Automation View */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          transition: 'all 0.3s ease',
          transform: showAutomation ? 'translateX(0)' : 'translateX(100%)',
          opacity: showAutomation ? 1 : 0,
          backgroundColor: showDarkMode ? 'grey.800' : 'background.paper',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            p: 2,
            backgroundColor: showDarkMode ? 'grey.800' : 'background.paper',
            borderBottom: 1,
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Automation Commands
          </Typography>
          <IconButton onClick={() => setShowAutomation(false)} size="small">
            <ArrowBackIcon />
          </IconButton>
        </Box>
        <Box
          sx={{
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
              background: theme.palette.grey[showDarkMode ? 700 : 300],
              borderRadius: '4px',
              '&:hover': {
                background: theme.palette.grey[showDarkMode ? 600 : 400],
              },
            },
            backgroundColor: showDarkMode ? 'grey.900' : 'background.default',
          }}
        >
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
                  backgroundColor: showDarkMode ? 'grey.800' : 'background.paper',
                  color: showDarkMode ? 'common.white' : 'text.primary',
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    {cmd.icon}
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      {cmd.title}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color={showDarkMode ? 'text.secondary' : 'text.secondary'}
                    sx={{ mb: 2 }}
                  >
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

import React, { useState, useRef, useEffect } from 'react';
import { useJarvis } from '../../context/JarvisContext';
import ExampleCommands from './ExampleCommands';
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
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import HelpIcon from '@mui/icons-material/Help';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AssignmentIcon from '@mui/icons-material/Assignment';

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
  const [showExamples, setShowExamples] = useState(!isMobile);
  const messagesEndRef = useRef(null);
  const voiceInterfaceRef = useRef(null);

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    handleSubmit();
  };

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

    const userInput = input.trim();
    setInput('');

    try {
      await getJarvisResponse(userInput);
    } catch (error) {
      console.error('Error getting response:', error);
    }
  };

  const handleVoiceInput = (transcript) => {
    setInput(transcript);
    handleSubmit();
  };

  const handleExampleClick = (example) => {
    setInput(example);
    if (isMobile) {
      setShowExamples(false);
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex' }}>
      {/* Main Chat Area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Chat Header */}
        <Box
          sx={{
            p: 2,
            backgroundColor: 'background.paper',
            borderBottom: 1,
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6">Jarvis AI Assistant</Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <VoiceInterface
              ref={voiceInterfaceRef}
              onVoiceInput={handleVoiceInput}
              isProcessing={isProcessing}
              disabled={!input.trim()}
            />
            <IconButton 
              onClick={() => setShowExamples(!showExamples)}
              color="primary"
              size="small"
            >
              <HelpIcon />
            </IconButton>
            <IconButton onClick={clearConversation} color="error" size="small">
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Messages Area */}
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            p: 2,
            backgroundColor: 'grey.50',
          }}
        >
          {conversationHistory.length === 0 ? (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'text.secondary',
              }}
            >
              <Typography variant="h6" gutterBottom>
                Welcome to Jarvis!
              </Typography>
              <Typography variant="body2">
                I can help you with workout planning, meal planning, and task management.
              </Typography>
              <Typography variant="body2">
                Try asking me something or check out the example commands.
              </Typography>
              <Typography variant="body2" sx={{ mt: 2 }}>
                You can also use voice commands by clicking the microphone icon.
              </Typography>
            </Box>
          ) : (
            conversationHistory.map((message) => (
              <MessageBubble
                key={message.id}
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
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Ask Jarvis anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isProcessing}
            size="small"
          />
          <IconButton
            type="submit"
            color="primary"
            disabled={!input.trim() || isProcessing}
          >
            {isProcessing ? (
              <Fade in={true}>
                <CircularProgress size={24} />
              </Fade>
            ) : (
              <SendIcon />
            )}
          </IconButton>
        </Box>
      </Box>

      {/* Examples Drawer/Sidebar */}
      {isMobile ? (
        <Drawer
          anchor="right"
          open={showExamples}
          onClose={() => setShowExamples(false)}
          PaperProps={{
            sx: { width: '80%', maxWidth: 360 },
          }}
        >
          <Box sx={{ p: 2 }}>
            <ExampleCommands onExampleClick={handleExampleClick} />
          </Box>
        </Drawer>
      ) : (
        <Box
          sx={{
            width: 300,
            borderLeft: 1,
            borderColor: 'divider',
            display: showExamples ? 'block' : 'none',
            overflow: 'auto',
          }}
        >
          <Box sx={{ p: 2 }}>
            <ExampleCommands onExampleClick={handleExampleClick} />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default JarvisChat; 
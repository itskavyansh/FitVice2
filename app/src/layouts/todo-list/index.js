/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================
*/

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  Paper,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  Tooltip,
  Badge,
  Popover,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  PriorityHigh as PriorityHighIcon,
  Star as StarIcon,
  DragIndicator as DragIndicatorIcon,
} from '@mui/icons-material';
import { SlArrowRight } from 'react-icons/sl';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

// @mui material components
import Grid from '@mui/material/Grid';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';

// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';

const TodoList = () => {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      const parsedTodos = JSON.parse(savedTodos);
      return parsedTodos.map((todo) => ({
        ...todo,
        dailyCompletions: todo.dailyCompletions || Array(7).fill(false),
        weeklyCompletions: todo.weeklyCompletions || {},
        priority: todo.priority || 'medium',
        starred: todo.starred || false,
      }));
    }
    return [];
  });
  const [newTodo, setNewTodo] = useState('');
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editText, setEditText] = useState('');
  const [editPriority, setEditPriority] = useState('medium');
  const [calendarAnchorEl, setCalendarAnchorEl] = useState(null);
  const [selectedTodoForCalendar, setSelectedTodoForCalendar] = useState(null);

  const getCurrentDay = () => new Date().getDay();

  const getDayName = (index) => {
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    return days[index];
  };

  const isDayInFuture = (index) => {
    const currentDay = getCurrentDay();
    return index > currentDay;
  };

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (newTodo.trim() === '') return;

    setTodos([
      ...todos,
      {
        id: Date.now(),
        text: newTodo,
        completed: false,
        dailyCompletions: Array(7).fill(false),
        weeklyCompletions: {},
        priority: 'medium',
        starred: false,
        history: [],
      },
    ]);
    setNewTodo('');
  };

  const handleToggleTodo = (id) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          const currentDay = getCurrentDay();
          const newDailyCompletions = [...todo.dailyCompletions];
          newDailyCompletions[currentDay] = !newDailyCompletions[currentDay];

          return {
            ...todo,
            dailyCompletions: newDailyCompletions,
            history: [
              ...todo.history,
              {
                date: new Date().toISOString(),
                action: newDailyCompletions[currentDay] ? 'completed' : 'uncompleted',
                day: currentDay,
              },
            ],
          };
        }
        return todo;
      }),
    );
  };

  const handleDailyToggle = (id, dayIndex) => {
    if (isDayInFuture(dayIndex)) return;

    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          const newDailyCompletions = [...todo.dailyCompletions];
          newDailyCompletions[dayIndex] = !newDailyCompletions[dayIndex];

          return {
            ...todo,
            dailyCompletions: newDailyCompletions,
            history: [
              ...todo.history,
              {
                date: new Date().toISOString(),
                action: newDailyCompletions[dayIndex] ? 'completed' : 'uncompleted',
                day: dayIndex,
              },
            ],
          };
        }
        return todo;
      }),
    );
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleOpenHistory = (todo) => {
    setSelectedTodo(todo);
    setHistoryDialogOpen(true);
  };

  const handleCloseHistory = () => {
    setHistoryDialogOpen(false);
    setSelectedTodo(null);
  };

  const handleOpenEdit = (todo) => {
    setSelectedTodo(todo);
    setEditText(todo.text);
    setEditPriority(todo.priority);
    setEditDialogOpen(true);
  };

  const handleCloseEdit = () => {
    setEditDialogOpen(false);
    setSelectedTodo(null);
    setEditText('');
    setEditPriority('medium');
  };

  const handleSaveEdit = () => {
    if (selectedTodo) {
      setTodos(
        todos.map((todo) =>
          todo.id === selectedTodo.id ? { ...todo, text: editText, priority: editPriority } : todo,
        ),
      );
      handleCloseEdit();
    }
  };

  const handleToggleStar = (id) => {
    setTodos((prevTodos) => {
      const updatedTodos = prevTodos.map((todo) =>
        todo.id === id ? { ...todo, starred: !todo.starred, isAnimating: true } : todo,
      );

      // Sort todos: starred items first, then by original order
      const sortedTodos = updatedTodos.sort((a, b) => {
        if (a.starred === b.starred) {
          return prevTodos.indexOf(a) - prevTodos.indexOf(b);
        }
        return b.starred ? 1 : -1;
      });

      // Remove animation flag after sorting
      return sortedTodos.map((todo) => ({
        ...todo,
        isAnimating: false,
      }));
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <PriorityHighIcon color="error" />;
      case 'medium':
        return <PriorityHighIcon color="warning" />;
      case 'low':
        return <PriorityHighIcon color="success" />;
      default:
        return null;
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTodos(items);
  };

  const handleCalendarOpen = (event, todo) => {
    setCalendarAnchorEl(event.currentTarget);
    setSelectedTodoForCalendar(todo);
  };

  const handleCalendarClose = () => {
    setCalendarAnchorEl(null);
    setSelectedTodoForCalendar(null);
  };

  const calendarOpen = Boolean(calendarAnchorEl);

  const handleCalendarDateSelect = (date, todoId) => {
    const selectedDate = date.format('YYYY-MM-DD');
    const weekStart = date.startOf('week').format('YYYY-MM-DD');

    setTodos((prevTodos) => {
      return prevTodos.map((todo) => {
        if (todo.id === todoId) {
          const updatedWeeklyCompletions = {
            ...todo.weeklyCompletions,
            [weekStart]: {
              ...(todo.weeklyCompletions[weekStart] || {}),
              [selectedDate]: !(todo.weeklyCompletions[weekStart]?.[selectedDate] || false),
            },
          };

          return {
            ...todo,
            weeklyCompletions: updatedWeeklyCompletions,
          };
        }
        return todo;
      });
    });
  };

  const getDateCompletionStatus = (date, todoId) => {
    const todo = todos.find((t) => t.id === todoId);
    if (!todo) return false;

    const weekStart = date.startOf('week').format('YYYY-MM-DD');
    const dateStr = date.format('YYYY-MM-DD');
    return todo.weeklyCompletions[weekStart]?.[dateStr] || false;
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={2}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <MDBox>
              <Container maxWidth="sm">
                <Box sx={{ my: 2 }}>
                  <Typography
                    variant="h3"
                    component="h1"
                    gutterBottom
                    sx={{
                      fontWeight: 'bold',
                      color: 'rgba(52,70,102,255)',
                      mb: 2,
                      fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                      lineHeight: 1.2,
                    }}
                  >
                    Daily Task Tracker
                  </Typography>

                  <Paper
                    elevation={3}
                    sx={{
                      p: 2,
                      mb: 2,
                      borderRadius: 2,
                      background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
                    }}
                  >
                    <form onSubmit={handleAddTodo}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          placeholder="Add a new task..."
                          value={newTodo}
                          onChange={(e) => setNewTodo(e.target.value)}
                          size="small"
                          sx={{
                            flexGrow: 1,
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1,
                            },
                          }}
                        />
                        <Button
                          variant="contained"
                          color="primary"
                          type="submit"
                          startIcon={<AddIcon />}
                          size="small"
                          sx={{
                            borderRadius: 1,
                            px: 2,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            color: 'white !important',
                            '&:hover': {
                              transform: 'translateY(-1px)',
                              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                              color: 'white !important',
                            },
                          }}
                        >
                          Add
                        </Button>
                      </Box>
                    </form>
                  </Paper>

                  <Paper
                    elevation={3}
                    sx={{
                      borderRadius: 2,
                      overflow: 'hidden',
                      background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
                    }}
                  >
                    <DragDropContext onDragEnd={handleDragEnd}>
                      <Droppable droppableId="todos">
                        {(provided) => (
                          <List {...provided.droppableProps} ref={provided.innerRef} sx={{ py: 0 }}>
                            {todos.map((todo, index) => (
                              <Draggable
                                key={todo.id}
                                draggableId={todo.id.toString()}
                                index={index}
                              >
                                {(provided) => (
                                  <ListItem
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    sx={{
                                      py: 1,
                                      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                                      transform: todo.isAnimating ? 'translateY(-100px)' : 'none',
                                      opacity: todo.isAnimating ? 0 : 1,
                                      '&:hover': {
                                        backgroundColor: 'rgba(0,0,0,0.02)',
                                      },
                                      display: 'flex',
                                      alignItems: 'center',
                                      position: 'relative',
                                      '&.reordering': {
                                        animation: 'slideIn 0.5s ease-out',
                                      },
                                      '@keyframes slideIn': {
                                        '0%': {
                                          opacity: 0,
                                          transform: 'translateY(-20px)',
                                        },
                                        '100%': {
                                          opacity: 1,
                                          transform: 'translateY(0)',
                                        },
                                      },
                                    }}
                                    className={todo.starred ? 'reordering' : ''}
                                  >
                                    <Box
                                      {...provided.dragHandleProps}
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        mr: 1,
                                        cursor: 'grab',
                                        '&:active': {
                                          cursor: 'grabbing',
                                        },
                                      }}
                                    >
                                      <DragIndicatorIcon
                                        sx={{
                                          color: 'text.secondary',
                                          '&:hover': {
                                            color: '#3089eb',
                                          },
                                        }}
                                      />
                                    </Box>
                                    <Checkbox
                                      checked={todo.dailyCompletions[getCurrentDay()]}
                                      onChange={() => handleToggleTodo(todo.id)}
                                      sx={{
                                        '&.Mui-checked': {
                                          color: '#3089eb',
                                        },
                                      }}
                                    />
                                    <Box sx={{ flexGrow: 1, ml: 2 }}>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <ListItemText
                                          primary={
                                            <Typography
                                              variant="h6"
                                              sx={{
                                                fontWeight: 'bold',
                                                fontSize: '1.2rem',
                                                textDecoration: todo.completed
                                                  ? 'line-through'
                                                  : 'none',
                                                color: todo.completed
                                                  ? 'text.secondary'
                                                  : 'text.primary',
                                              }}
                                            >
                                              {todo.text}
                                            </Typography>
                                          }
                                        />
                                      </Box>
                                      <Stack
                                        direction="row"
                                        spacing={2}
                                        sx={{
                                          mt: 2,
                                          justifyContent: 'space-between',
                                          maxWidth: '500px',
                                          width: '300px',
                                          height: '34px',
                                          alignItems: 'center',
                                        }}
                                      >
                                        {Array(7)
                                          .fill(0)
                                          .map((_, index) => {
                                            const isFutureDay = isDayInFuture(index);
                                            return (
                                              <Box
                                                key={index}
                                                sx={{
                                                  display: 'flex',
                                                  flexDirection: 'column',
                                                  alignItems: 'center',
                                                  position: 'relative',
                                                  opacity: isFutureDay ? 0.5 : 1,
                                                }}
                                              >
                                                <Checkbox
                                                  checked={todo.dailyCompletions[index]}
                                                  onChange={() => handleDailyToggle(todo.id, index)}
                                                  size="small"
                                                  disabled={isFutureDay}
                                                  sx={{
                                                    position: 'absolute',
                                                    opacity: 0,
                                                    width: '28px',
                                                    height: '28px',
                                                    cursor: isFutureDay ? 'not-allowed' : 'pointer',
                                                    zIndex: 1,
                                                  }}
                                                />
                                                <Box
                                                  component="label"
                                                  sx={{
                                                    width: '28px',
                                                    height: '28px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '14px',
                                                    fontWeight: 700,
                                                    color: todo.dailyCompletions[index]
                                                      ? 'white'
                                                      : 'text.secondary',
                                                    cursor: isFutureDay ? 'not-allowed' : 'pointer',
                                                    border: todo.dailyCompletions[index]
                                                      ? 'none'
                                                      : '2px solid',
                                                    borderColor: 'text.secondary',
                                                    borderRadius: '20%',
                                                    backgroundColor: todo.dailyCompletions[index]
                                                      ? '#4da3ff'
                                                      : 'transparent',
                                                    backgroundImage: todo.dailyCompletions[index]
                                                      ? 'linear-gradient(147deg, #4da3ff 0%, #3089eb 74%)'
                                                      : 'none',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                      transform: isFutureDay
                                                        ? 'none'
                                                        : 'scale(1.1)',
                                                    },
                                                  }}
                                                >
                                                  {getDayName(index)}
                                                </Box>
                                              </Box>
                                            );
                                          })}
                                        <IconButton
                                          size="small"
                                          sx={{
                                            color: '#3089eb',
                                            '&:hover': {
                                              backgroundColor: 'rgba(48, 137, 235, 0.1)',
                                              transform: 'scale(1.1)',
                                            },
                                          }}
                                          onClick={(e) => handleCalendarOpen(e, todo)}
                                        >
                                          <SlArrowRight />
                                        </IconButton>
                                      </Stack>
                                    </Box>
                                    <ListItemSecondaryAction>
                                      <Stack
                                        direction="row"
                                        spacing={1}
                                        sx={{ alignItems: 'center', mr: 1 }}
                                      >
                                        <Box
                                          className="heart-container"
                                          sx={{
                                            '--heart-color': '#ff4d8d',
                                            width: '24px',
                                            height: '24px',
                                            position: 'relative',
                                            transition: '.3s',
                                            '& .checkbox': {
                                              position: 'absolute',
                                              width: '100%',
                                              height: '100%',
                                              opacity: 0,
                                              zIndex: 20,
                                              cursor: 'pointer',
                                            },
                                            '& .svg-container': {
                                              width: '100%',
                                              height: '100%',
                                              display: 'flex',
                                              justifyContent: 'center',
                                              alignItems: 'center',
                                            },
                                            '& .svg-outline, & .svg-filled': {
                                              fill: 'var(--heart-color)',
                                              position: 'absolute',
                                            },
                                            '& .svg-filled': {
                                              animation: 'keyframes-svg-filled 1s',
                                              display: 'none',
                                            },
                                            '& .svg-celebrate': {
                                              position: 'absolute',
                                              animation: 'keyframes-svg-celebrate .5s',
                                              animationFillMode: 'forwards',
                                              display: 'none',
                                              stroke: 'var(--heart-color)',
                                              fill: 'var(--heart-color)',
                                              strokeWidth: '2px',
                                            },
                                            '& .checkbox:checked ~ .svg-container .svg-filled': {
                                              display: 'block',
                                            },
                                            '& .checkbox:checked ~ .svg-container .svg-celebrate': {
                                              display: 'block',
                                            },
                                            '@keyframes keyframes-svg-filled': {
                                              '0%': { transform: 'scale(0)' },
                                              '25%': { transform: 'scale(1.2)' },
                                              '50%': {
                                                transform: 'scale(1)',
                                                filter: 'brightness(1.5)',
                                              },
                                            },
                                            '@keyframes keyframes-svg-celebrate': {
                                              '0%': { transform: 'scale(0)' },
                                              '50%': { opacity: 1, filter: 'brightness(1.5)' },
                                              '100%': {
                                                transform: 'scale(1.4)',
                                                opacity: 0,
                                                display: 'none',
                                              },
                                            },
                                          }}
                                        >
                                          <input
                                            type="checkbox"
                                            className="checkbox"
                                            checked={todo.starred}
                                            onChange={() => handleToggleStar(todo.id)}
                                          />
                                          <div className="svg-container">
                                            <svg
                                              viewBox="0 0 24 24"
                                              className="svg-outline"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z" />
                                            </svg>
                                            <svg
                                              viewBox="0 0 24 24"
                                              className="svg-filled"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z" />
                                            </svg>
                                            <svg
                                              className="svg-celebrate"
                                              width="100"
                                              height="100"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <polygon points="10,10 20,20" />
                                              <polygon points="10,50 20,50" />
                                              <polygon points="20,80 30,70" />
                                              <polygon points="90,10 80,20" />
                                              <polygon points="90,50 80,50" />
                                              <polygon points="80,80 70,70" />
                                            </svg>
                                          </div>
                                        </Box>
                                        <IconButton
                                          edge="end"
                                          aria-label="edit"
                                          onClick={() => handleOpenEdit(todo)}
                                          sx={{
                                            color: 'text.secondary',
                                            '&:hover': {
                                              color: '#3089eb',
                                              backgroundColor: 'rgba(48, 137, 235, 0.1)',
                                            },
                                          }}
                                        >
                                          <EditIcon />
                                        </IconButton>
                                        <IconButton
                                          edge="end"
                                          aria-label="delete"
                                          onClick={() => handleDeleteTodo(todo.id)}
                                          sx={{
                                            color: 'error.main',
                                            '&:hover': {
                                              backgroundColor: 'error.light',
                                            },
                                          }}
                                        >
                                          <DeleteIcon />
                                        </IconButton>
                                      </Stack>
                                    </ListItemSecondaryAction>
                                  </ListItem>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </List>
                        )}
                      </Droppable>
                    </DragDropContext>
                    {todos.length === 0 && (
                      <ListItem sx={{ py: 2 }}>
                        <ListItemText
                          primary={
                            <Typography
                              variant="h6"
                              align="center"
                              sx={{
                                color: 'text.secondary',
                                py: 2,
                              }}
                            >
                              No tasks yet. Add one above!
                            </Typography>
                          }
                        />
                      </ListItem>
                    )}
                  </Paper>
                </Box>
              </Container>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>

      <Dialog
        open={historyDialogOpen}
        onClose={handleCloseHistory}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: '#3089eb',
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          Task History
        </DialogTitle>
        <DialogContent>
          {selectedTodo && (
            <Box sx={{ py: 2 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  color: '#3089eb',
                  fontWeight: 'bold',
                }}
              >
                {selectedTodo.text}
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedTodo.history.map((record, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          '&:nth-of-type(odd)': {
                            backgroundColor: 'action.hover',
                          },
                        }}
                      >
                        <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Chip
                            label={record.action}
                            color={record.action === 'completed' ? 'success' : 'warning'}
                            size="small"
                            sx={{
                              fontWeight: 'bold',
                              minWidth: '100px',
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCloseHistory}
            variant="contained"
            sx={{
              borderRadius: 1,
              px: 3,
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEdit}
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: '12px',
            overflow: 'hidden',
            width: '300px',
            height: '225px', // 4:3 ratio (300 * 0.75 = 225)
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: '#3089eb',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.25rem',
            py: 1.5,
            flex: '0 0 auto',
          }}
        >
          Edit Task
        </DialogTitle>
        <DialogContent
          sx={{
            pt: 2,
            pb: 2,
            px: 2,
            flex: '1 1 auto',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <TextField
            fullWidth
            placeholder="Task name"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
          />
        </DialogContent>
        <DialogActions
          sx={{
            px: 2,
            pb: 2,
            pt: 0,
            flex: '0 0 auto',
          }}
        >
          <Button
            onClick={handleCloseEdit}
            variant="outlined"
            size="small"
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              px: 2,
              borderColor: '#3089eb',
              color: '#3089eb',
              '&:hover': {
                borderColor: '#3089eb',
                backgroundColor: 'rgba(48, 137, 235, 0.1)',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveEdit}
            variant="contained"
            size="small"
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              px: 2,
              backgroundColor: '#3089eb',
              color: 'white !important',
              '&:hover': {
                backgroundColor: '#2776cc',
              },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Popover
        open={calendarOpen}
        anchorEl={calendarAnchorEl}
        onClose={handleCalendarClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            backdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(255, 255, 255, 0.97)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            marginLeft: '8px',
          },
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            onChange={(newDate) => {
              if (selectedTodoForCalendar) {
                handleCalendarDateSelect(newDate, selectedTodoForCalendar.id);
              }
            }}
            renderDay={(day, _value, DayComponentProps) => {
              const isCompleted =
                selectedTodoForCalendar && getDateCompletionStatus(day, selectedTodoForCalendar.id);

              return (
                <Badge
                  key={day.toString()}
                  overlap="circular"
                  badgeContent={isCompleted ? '✓' : null}
                  sx={{
                    '& .MuiBadge-badge': {
                      backgroundColor: '#4da3ff',
                      color: 'white',
                      fontSize: '0.8rem',
                    },
                  }}
                >
                  <Box
                    {...DayComponentProps}
                    sx={{
                      ...DayComponentProps.sx,
                      backgroundColor: isCompleted ? 'rgba(77, 163, 255, 0.1)' : 'transparent',
                    }}
                  >
                    {day.date()}
                  </Box>
                </Badge>
              );
            }}
          />
        </LocalizationProvider>
      </Popover>

      <Footer />
    </DashboardLayout>
  );
};

export default TodoList;

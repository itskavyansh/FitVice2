/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================
*/

import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';

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
      }));
    }
    return [];
  });
  const [newTodo, setNewTodo] = useState('');
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);

  const getCurrentDay = () => new Date().getDay();

  const getDayName = (index) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[index];
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
        history: [],
      },
    ]);
    setNewTodo('');
  };

  const handleToggleTodo = (id) => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    );
  };

  const handleDailyToggle = (id, dayIndex) => {
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
      })
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

  const getCurrentWeekCompletion = (todo) => {
    const currentDate = new Date();
    const currentWeek = `${currentDate.getFullYear()}-W${Math.ceil(
      (currentDate.getDate() + currentDate.getDay()) / 7
    )}`;
    return todo.weeklyCompletions.find((week) => week.week === currentWeek)?.completed || false;
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <MDBox>
              <Container maxWidth="md">
                <Box sx={{ my: 4 }}>
                  <Typography
                    variant="h3"
                    component="h1"
                    gutterBottom
                    align="center"
                    sx={{
                      fontWeight: 'bold',
                      color: 'primary.main',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                      mb: 4,
                    }}
                  >
                    Daily Task Tracker
                  </Typography>

                  <Paper
                    elevation={3}
                    sx={{
                      p: 3,
                      mb: 3,
                      borderRadius: 2,
                      background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
                    }}
                  >
                    <form onSubmit={handleAddTodo}>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          placeholder="Add a new task..."
                          value={newTodo}
                          onChange={(e) => setNewTodo(e.target.value)}
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
                          sx={{
                            borderRadius: 1,
                            px: 3,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            '&:hover': {
                              transform: 'translateY(-1px)',
                              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                            },
                          }}
                        >
                          Add Task
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
                    <List>
                      {todos.map((todo) => (
                        <React.Fragment key={todo.id}>
                          <ListItem
                            sx={{
                              py: 2,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                backgroundColor: 'rgba(0,0,0,0.02)',
                              },
                            }}
                          >
                            <Checkbox
                              checked={todo.completed}
                              onChange={() => handleToggleTodo(todo.id)}
                              sx={{
                                '&.Mui-checked': {
                                  color: 'primary.main',
                                },
                              }}
                            />
                            <Box sx={{ flexGrow: 1, ml: 2 }}>
                              <ListItemText
                                primary={
                                  <Typography
                                    variant="h6"
                                    sx={{
                                      textDecoration: todo.completed ? 'line-through' : 'none',
                                      color: todo.completed ? 'text.secondary' : 'text.primary',
                                      fontWeight: todo.completed ? 'normal' : '500',
                                    }}
                                  >
                                    {todo.text}
                                  </Typography>
                                }
                              />
                              <Stack
                                direction="row"
                                spacing={2}
                                sx={{
                                  mt: 2,
                                  justifyContent: 'space-between',
                                  maxWidth: '500px',
                                }}
                              >
                                {Array(7)
                                  .fill(0)
                                  .map((_, index) => (
                                    <Box
                                      key={index}
                                      sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        p: 1,
                                        borderRadius: 1,
                                        bgcolor:
                                          index === getCurrentDay()
                                            ? 'primary.light'
                                            : 'transparent',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                          bgcolor: 'action.hover',
                                        },
                                      }}
                                    >
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          color:
                                            index === getCurrentDay()
                                              ? 'primary.main'
                                              : 'text.secondary',
                                          fontWeight: index === getCurrentDay() ? 'bold' : 'normal',
                                          mb: 0.5,
                                        }}
                                      >
                                        {getDayName(index)}
                                      </Typography>
                                      <Checkbox
                                        checked={todo.dailyCompletions[index]}
                                        onChange={() => handleDailyToggle(todo.id, index)}
                                        size="small"
                                        sx={{
                                          color: index === getCurrentDay() ? 'primary.main' : 'default',
                                          '&.Mui-checked': {
                                            color: 'primary.main',
                                          },
                                        }}
                                      />
                                    </Box>
                                  ))}
                              </Stack>
                            </Box>
                            <ListItemSecondaryAction>
                              <IconButton
                                edge="end"
                                aria-label="history"
                                onClick={() => handleOpenHistory(todo)}
                                sx={{
                                  mr: 1,
                                  color: 'text.secondary',
                                  '&:hover': {
                                    color: 'primary.main',
                                    backgroundColor: 'primary.light',
                                  },
                                }}
                              >
                                <MoreVertIcon />
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
                            </ListItemSecondaryAction>
                          </ListItem>
                          <Divider sx={{ mx: 2 }} />
                        </React.Fragment>
                      ))}
                      {todos.length === 0 && (
                        <ListItem>
                          <ListItemText
                            primary={
                              <Typography
                                variant="h6"
                                align="center"
                                sx={{
                                  color: 'text.secondary',
                                  py: 4,
                                }}
                              >
                                No tasks yet. Add one above!
                              </Typography>
                            }
                          />
                        </ListItem>
                      )}
                    </List>
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
            bgcolor: 'primary.main',
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
                  color: 'primary.main',
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
                        <TableCell>
                          {new Date(record.date).toLocaleDateString()}
                        </TableCell>
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

      <Footer />
    </DashboardLayout>
  );
};

export default TodoList;

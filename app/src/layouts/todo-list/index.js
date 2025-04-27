/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================
*/

import React, { useState, useEffect, useCallback } from 'react';
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
  Event as EventIcon,
} from '@mui/icons-material';
import { SlArrowRight } from 'react-icons/sl';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar, PickersDay } from '@mui/x-date-pickers';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';

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
    try {
      const savedTodos = localStorage.getItem('todos');
      if (savedTodos) {
        const parsedTodos = JSON.parse(savedTodos);
        return parsedTodos.map((todo) => ({
          id: todo.id || Date.now() + Math.random(),
          text: todo.text || '',
          dailyCompletions:
            todo.dailyCompletions && todo.dailyCompletions.length === 7
              ? todo.dailyCompletions
              : Array(7).fill(false),
          weeklyCompletions: todo.weeklyCompletions || {},
          priority: todo.priority || 'medium',
          starred: todo.starred || false,
          dueDate: todo.dueDate || null,
          history: todo.history || [],
          createdAt: todo.createdAt || new Date().toISOString(),
        }));
      }
    } catch (error) {
      console.error('Failed to parse todos from localStorage:', error);
    }
    return [];
  });
  const [newTodo, setNewTodo] = useState('');
  const [newTodoDueDate, setNewTodoDueDate] = useState(null);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editText, setEditText] = useState('');
  const [editPriority, setEditPriority] = useState('medium');
  const [editDueDate, setEditDueDate] = useState(null);
  const [calendarAnchorEl, setCalendarAnchorEl] = useState(null);
  const [selectedTodoForCalendar, setSelectedTodoForCalendar] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null);

  const getCurrentDay = () => new Date().getDay();

  const getDayName = (index, format = 'short') => {
    const days =
      format === 'short'
        ? ['S', 'M', 'T', 'W', 'T', 'F', 'S']
        : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[index];
  };

  const isDayInFuture = (index) => {
    const currentDay = getCurrentDay();
    return index > currentDay;
  };

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = useCallback(
    (e) => {
      e.preventDefault();
      if (newTodo.trim() === '') return;

      const newTask = {
        id: Date.now(),
        text: newTodo.trim(),
        dailyCompletions: Array(7).fill(false),
        weeklyCompletions: {},
        priority: 'medium',
        starred: false,
        dueDate: newTodoDueDate ? dayjs(newTodoDueDate).toISOString() : null,
        history: [],
        createdAt: new Date().toISOString(),
      };

      setTodos((prevTodos) => [newTask, ...prevTodos]);
      setNewTodo('');
      setNewTodoDueDate(null);
    },
    [newTodo, newTodoDueDate],
  );

  const updateTodo = useCallback((id, updates) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo)),
    );
  }, []);

  const handleToggleToday = useCallback(
    (id) => {
      const currentDay = getCurrentDay();
      const todo = todos.find((t) => t.id === id);
      if (!todo) return;

      const newDailyCompletions = [...todo.dailyCompletions];
      newDailyCompletions[currentDay] = !newDailyCompletions[currentDay];
      const action = newDailyCompletions[currentDay] ? 'completed' : 'uncompleted';

      updateTodo(id, {
        dailyCompletions: newDailyCompletions,
        history: [...todo.history, { date: new Date().toISOString(), action, day: currentDay }],
      });
    },
    [todos, updateTodo],
  );

  const handleDailyToggle = useCallback(
    (id, dayIndex) => {
      if (isDayInFuture(dayIndex)) return;

      const todo = todos.find((t) => t.id === id);
      if (!todo) return;

      const newDailyCompletions = [...todo.dailyCompletions];
      newDailyCompletions[dayIndex] = !newDailyCompletions[dayIndex];
      const action = newDailyCompletions[dayIndex] ? 'completed' : 'uncompleted';

      updateTodo(id, {
        dailyCompletions: newDailyCompletions,
        history: [...todo.history, { date: new Date().toISOString(), action, day: dayIndex }],
      });
    },
    [todos, updateTodo],
  );

  const handleOpenHistory = useCallback((todo) => {
    setSelectedTodo(todo);
    setHistoryDialogOpen(true);
  }, []);

  const handleCloseHistory = useCallback(() => {
    setHistoryDialogOpen(false);
    setSelectedTodo(null);
  }, []);

  const handleOpenEdit = useCallback((todo) => {
    setSelectedTodo(todo);
    setEditText(todo.text);
    setEditPriority(todo.priority || 'medium');
    setEditDueDate(todo.dueDate ? dayjs(todo.dueDate) : null);
    setEditDialogOpen(true);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setEditDialogOpen(false);
    setSelectedTodo(null);
    setEditText('');
    setEditPriority('medium');
    setEditDueDate(null);
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (!selectedTodo) return;
    updateTodo(selectedTodo.id, {
      text: editText.trim(),
      priority: editPriority,
      dueDate: editDueDate ? dayjs(editDueDate).toISOString() : null,
    });
    handleCloseEdit();
  }, [selectedTodo, editText, editPriority, editDueDate, updateTodo, handleCloseEdit]);

  const handleToggleStar = useCallback((id) => {
    setTodos((prevTodos) => {
      const updatedTodos = prevTodos.map((todo) =>
        todo.id === id ? { ...todo, starred: !todo.starred } : todo,
      );
      return updatedTodos.sort((a, b) => {
        if (a.starred !== b.starred) return b.starred ? 1 : -1;
        const dateA = dayjs(a.createdAt || 0);
        const dateB = dayjs(b.createdAt || 0);
        return dateB.diff(dateA);
      });
    });
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  const getPriorityIcon = (priority) => {
    const color = getPriorityColor(priority);
    if (color === 'default' || color === 'info') return null;
    return (
      <Tooltip title={`${priority.charAt(0).toUpperCase() + priority.slice(1)} Priority`}>
        <PriorityHighIcon color={color} sx={{ fontSize: '1rem' }} />
      </Tooltip>
    );
  };

  const handleDragEnd = useCallback(
    (result) => {
      if (!result.destination || result.destination.index === result.source.index) {
        return;
      }
      const items = Array.from(todos);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      setTodos(items);
    },
    [todos],
  );

  const handleCalendarOpen = useCallback((event, todo) => {
    setCalendarAnchorEl(event.currentTarget);
    setSelectedTodoForCalendar(todo);
  }, []);

  const handleCalendarClose = useCallback(() => {
    setCalendarAnchorEl(null);
    setSelectedTodoForCalendar(null);
  }, []);

  const calendarOpen = Boolean(calendarAnchorEl);

  const handleCalendarDateSelect = useCallback((date, todoId) => {
    const selectedDate = date.format('YYYY-MM-DD');
    const weekStart = date.startOf('week').format('YYYY-MM-DD');
    setTodos((prevTodos) =>
      prevTodos.map((todo) => {
        if (todo.id === todoId) {
          const currentStatus = todo.weeklyCompletions?.[weekStart]?.[selectedDate] || false;
          const updatedWeeklyCompletions = {
            ...todo.weeklyCompletions,
            [weekStart]: {
              ...(todo.weeklyCompletions?.[weekStart] || {}),
              [selectedDate]: !currentStatus,
            },
          };
          return { ...todo, weeklyCompletions: updatedWeeklyCompletions };
        }
        return todo;
      }),
    );
  }, []);

  const openDeleteConfirm = useCallback((id) => {
    setTodoToDelete(id);
    setDeleteConfirmOpen(true);
  }, []);

  const closeDeleteConfirm = useCallback(() => {
    setTodoToDelete(null);
    setDeleteConfirmOpen(false);
  }, []);

  const confirmDeleteTodo = useCallback(() => {
    if (todoToDelete) {
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== todoToDelete));
    }
    closeDeleteConfirm();
  }, [todoToDelete, closeDeleteConfirm]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox py={3}>
          <Container maxWidth="md">
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12}>
                <Typography
                  variant="h4"
                  component="h1"
                  gutterBottom
                  align="center"
                  sx={{ fontWeight: 'bold', color: 'text.primary', mb: 3 }}
                >
                  Daily Task Tracker
                </Typography>

                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    mb: 3,
                    borderRadius: 2,
                    backgroundColor: 'background.paper',
                  }}
                >
                  <form onSubmit={handleAddTodo}>
                    <Stack spacing={1.5} direction={{ xs: 'column', sm: 'row' }}>
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
                      <Box sx={{ minWidth: 200 }}>
                        <DateTimePicker
                          label="Due Date (Opt.)"
                          value={newTodoDueDate}
                          onChange={(newValue) => setNewTodoDueDate(newValue)}
                          ampm={true}
                          slotProps={{ textField: { size: 'small', fullWidth: true } }}
                        />
                      </Box>
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        startIcon={<AddIcon />}
                        size="medium"
                        sx={{
                          borderRadius: 1,
                          px: 3,
                          color: 'white !important',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Add Task
                      </Button>
                    </Stack>
                  </form>
                </Paper>

                <Paper
                  elevation={2}
                  sx={{
                    borderRadius: 2,
                    overflow: 'hidden',
                    backgroundColor: 'background.paper',
                  }}
                >
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="todos">
                      {(providedDroppable) => (
                        <List
                          {...providedDroppable.droppableProps}
                          ref={providedDroppable.innerRef}
                          sx={{ py: 0 }}
                        >
                          {todos.map((todo, index) => (
                            <Draggable key={todo.id} draggableId={String(todo.id)} index={index}>
                              {(providedDraggable) => (
                                <ListItem
                                  ref={providedDraggable.innerRef}
                                  {...providedDraggable.draggableProps}
                                  sx={{
                                    py: 1.5,
                                    pr: { xs: 1, sm: 2 },
                                    pl: { xs: 1, sm: 2 },
                                    backgroundColor: 'inherit',
                                    '&:hover': {
                                      backgroundColor: 'action.hover',
                                    },
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    position: 'relative',
                                    borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                                    '&:last-child': {
                                      borderBottom: 'none',
                                    },
                                  }}
                                >
                                  <Box
                                    {...providedDraggable.dragHandleProps}
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      pt: 0.5,
                                      mr: 1,
                                      cursor: 'grab',
                                      color: 'text.secondary',
                                      '&:hover': { color: 'primary.main' },
                                      '&:active': { cursor: 'grabbing' },
                                    }}
                                  >
                                    <DragIndicatorIcon sx={{ fontSize: '1.25rem' }} />
                                  </Box>

                                  <Checkbox
                                    checked={todo.dailyCompletions[getCurrentDay()]}
                                    onChange={() => handleToggleToday(todo.id)}
                                    sx={{
                                      p: 0,
                                      mr: 1.5,
                                      mt: 0.5,
                                      color: 'primary.main',
                                    }}
                                  />

                                  <Box sx={{ flexGrow: 1, mr: 1, mt: 0.5 }}>
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        flexWrap: 'wrap',
                                        gap: 0.5,
                                        mb: 1,
                                      }}
                                    >
                                      {getPriorityIcon(todo.priority)}
                                      <Typography
                                        variant="body1"
                                        sx={{
                                          fontWeight: 500,
                                          textDecoration: todo.dailyCompletions[getCurrentDay()]
                                            ? 'line-through'
                                            : 'none',
                                          color: todo.dailyCompletions[getCurrentDay()]
                                            ? 'text.disabled'
                                            : 'text.primary',
                                          wordBreak: 'break-word',
                                          mr: 'auto',
                                        }}
                                      >
                                        {todo.text}
                                      </Typography>
                                      {todo.dueDate && (
                                        <Chip
                                          label={`Due: ${dayjs(todo.dueDate).format('MMM D, h:mm A')}`}
                                          size="small"
                                          variant="outlined"
                                          sx={{
                                            height: 'auto',
                                            fontSize: '0.75rem',
                                            color: dayjs().isAfter(dayjs(todo.dueDate))
                                              ? 'error.main'
                                              : 'text.secondary',
                                            borderColor: dayjs().isAfter(dayjs(todo.dueDate))
                                              ? 'error.light'
                                              : 'action.disabled',
                                            mt: { xs: 0.5, sm: 0 },
                                            ml: 1,
                                          }}
                                        />
                                      )}
                                    </Box>

                                    <Stack
                                      direction="row"
                                      spacing={0.5}
                                      sx={{ alignItems: 'center', flexWrap: 'wrap' }}
                                    >
                                      {Array(7)
                                        .fill(0)
                                        .map((_, dayIndex) => {
                                          const isFutureDay = isDayInFuture(dayIndex);
                                          return (
                                            <Tooltip
                                              key={dayIndex}
                                              title={getDayName(dayIndex, 'full')}
                                              placement="top"
                                            >
                                              <Checkbox
                                                checked={todo.dailyCompletions[dayIndex]}
                                                onChange={() =>
                                                  handleDailyToggle(todo.id, dayIndex)
                                                }
                                                size="small"
                                                disabled={isFutureDay}
                                                icon={
                                                  <Box
                                                    sx={{
                                                      width: 16,
                                                      height: 16,
                                                      borderRadius: '4px',
                                                      border: '1px solid',
                                                      borderColor: 'action.disabled',
                                                    }}
                                                  />
                                                }
                                                checkedIcon={
                                                  <Box
                                                    sx={{
                                                      width: 16,
                                                      height: 16,
                                                      borderRadius: '4px',
                                                      bgcolor: 'primary.light',
                                                    }}
                                                  />
                                                }
                                                sx={{
                                                  p: 0.5,
                                                  opacity: isFutureDay ? 0.5 : 1,
                                                  cursor: isFutureDay ? 'not-allowed' : 'pointer',
                                                  color: 'transparent',
                                                  '&.Mui-disabled': {
                                                    cursor: 'not-allowed',
                                                  },
                                                }}
                                              />
                                            </Tooltip>
                                          );
                                        })}
                                      <Tooltip title="View/Mark Past Dates">
                                        <IconButton
                                          size="small"
                                          sx={{
                                            color: 'text.secondary',
                                            ml: 0.5,
                                            '&:hover': { backgroundColor: 'action.hover' },
                                          }}
                                          onClick={(e) => handleCalendarOpen(e, todo)}
                                        >
                                          <SlArrowRight size="0.8em" />
                                        </IconButton>
                                      </Tooltip>
                                    </Stack>
                                  </Box>

                                  <Stack
                                    direction={{ xs: 'column', sm: 'row' }}
                                    spacing={0.5}
                                    sx={{
                                      alignItems: 'center',
                                      mt: { xs: 1, sm: 0.5 },
                                    }}
                                  >
                                    <Tooltip title={todo.starred ? 'Unstar' : 'Star'}>
                                      <IconButton
                                        size="small"
                                        onClick={() => handleToggleStar(todo.id)}
                                        sx={{
                                          color: todo.starred ? 'warning.main' : 'action.disabled',
                                          '&:hover': { backgroundColor: 'action.hover' },
                                        }}
                                      >
                                        <StarIcon sx={{ fontSize: '1rem' }} />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="View History">
                                      <IconButton
                                        size="small"
                                        aria-label="history"
                                        onClick={() => handleOpenHistory(todo)}
                                        sx={{
                                          color: 'text.secondary',
                                          '&:hover': { backgroundColor: 'action.hover' },
                                        }}
                                      >
                                        <MoreVertIcon sx={{ fontSize: '1rem' }} />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Edit">
                                      <IconButton
                                        size="small"
                                        aria-label="edit"
                                        onClick={() => handleOpenEdit(todo)}
                                        sx={{
                                          color: 'text.secondary',
                                          '&:hover': { backgroundColor: 'action.hover' },
                                        }}
                                      >
                                        <EditIcon sx={{ fontSize: '1rem' }} />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                      <IconButton
                                        size="small"
                                        aria-label="delete"
                                        onClick={() => openDeleteConfirm(todo.id)}
                                        sx={{
                                          color: 'error.main',
                                          '&:hover': { backgroundColor: 'action.hover' },
                                        }}
                                      >
                                        <DeleteIcon sx={{ fontSize: '1rem' }} />
                                      </IconButton>
                                    </Tooltip>
                                  </Stack>
                                </ListItem>
                              )}
                            </Draggable>
                          ))}
                          {providedDroppable.placeholder}
                        </List>
                      )}
                    </Droppable>
                  </DragDropContext>
                  {todos.length === 0 && (
                    <ListItem sx={{ py: 3 }}>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body1"
                            align="center"
                            sx={{ color: 'text.secondary' }}
                          >
                            No tasks yet. Add one above!
                          </Typography>
                        }
                      />
                    </ListItem>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </MDBox>

        <Dialog
          open={historyDialogOpen}
          onClose={handleCloseHistory}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '12px',
            },
          }}
        >
          <DialogTitle
            sx={{ bgcolor: 'primary.main', color: 'white', fontSize: '1.1rem', py: 1.5, px: 2 }}
          >
            {`History: ${selectedTodo?.text?.substring(0, 50)}${selectedTodo?.text?.length > 50 ? '...' : ''}`}
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            {selectedTodo?.history?.length > 0 ? (
              <TableContainer component={Paper} elevation={0} sx={{ mt: 1, maxHeight: 400 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow sx={{ '& th': { fontWeight: 'bold', bgcolor: 'grey.100' } }}>
                      <TableCell>Date</TableCell>
                      <TableCell>Action</TableCell>
                      <TableCell>Day</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[...selectedTodo.history].reverse().map((entry, index) => (
                      <TableRow key={index} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                        <TableCell>{dayjs(entry.date).format('MMM D, YYYY h:mm A')}</TableCell>
                        <TableCell>
                          <Chip
                            label={entry.action}
                            size="small"
                            color={entry.action === 'completed' ? 'success' : 'default'}
                          />
                        </TableCell>
                        <TableCell>{getDayName(entry.day, 'full')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 2 }}>
                No history available.
              </Typography>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 2, pb: 2 }}>
            <Button onClick={handleCloseHistory} variant="outlined" size="small">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={editDialogOpen}
          onClose={handleCloseEdit}
          maxWidth="sm"
          fullWidth
          PaperProps={{ sx: { borderRadius: '12px' } }}
        >
          <DialogTitle
            sx={{ bgcolor: 'primary.main', color: 'white', fontSize: '1.1rem', py: 1.5, px: 2 }}
          >
            Edit Task
          </DialogTitle>
          <DialogContent sx={{ pt: '20px !important', pb: 2 }}>
            <Stack spacing={2}>
              <TextField
                label="Task Text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                fullWidth
                variant="outlined"
                margin="dense"
              />
              <TextField
                select
                label="Priority"
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value)}
                fullWidth
                variant="outlined"
                margin="dense"
                SelectProps={{ native: true }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </TextField>
              <DateTimePicker
                label="Due Date (Optional)"
                value={editDueDate}
                onChange={setEditDueDate}
                ampm={true}
                slotProps={{ textField: { size: 'small', fullWidth: true, margin: 'dense' } }}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 2, pb: 2 }}>
            <Button onClick={handleCloseEdit} variant="outlined" size="small">
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              variant="contained"
              size="small"
              sx={{ color: 'white !important' }}
              color="primary"
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={deleteConfirmOpen}
          onClose={closeDeleteConfirm}
          maxWidth="xs"
          PaperProps={{ sx: { borderRadius: '12px', p: 1 } }}
        >
          <DialogTitle
            sx={{
              bgcolor: 'transparent',
              color: 'error.main',
              textAlign: 'center',
              pt: 2,
              fontSize: '1.1rem',
            }}
          >
            <DeleteIcon sx={{ verticalAlign: 'middle', mr: 0.5 }} /> Confirm Deletion
          </DialogTitle>
          <DialogContent sx={{ pt: 1, pb: 2 }}>
            <Typography variant="body1" align="center" color="text.secondary">
              Are you sure you want to delete this task?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ pb: 2, justifyContent: 'center' }}>
            <Button onClick={closeDeleteConfirm} variant="outlined" size="small" sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button
              onClick={confirmDeleteTodo}
              variant="contained"
              color="error"
              size="small"
              sx={{ color: 'white !important' }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Popover
          open={calendarOpen}
          anchorEl={calendarAnchorEl}
          onClose={handleCalendarClose}
          anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
          transformOrigin={{ vertical: 'center', horizontal: 'left' }}
          PaperProps={{ elevation: 3, sx: { borderRadius: '12px', ml: '8px', overflow: 'hidden' } }}
        >
          <DateCalendar
            onChange={(newDate) => {
              if (selectedTodoForCalendar) {
                handleCalendarDateSelect(newDate, selectedTodoForCalendar.id);
              }
            }}
            slots={{ day: DayWithBadge }}
            slotProps={{
              day: {
                todos: todos,
                selectedTodoId: selectedTodoForCalendar?.id,
              },
            }}
          />
        </Popover>

        <Footer />
      </DashboardLayout>
    </LocalizationProvider>
  );
};

const DayWithBadge = (props) => {
  const { day, outsideCurrentMonth, todos, selectedTodoId, ...other } = props;
  const todo = todos?.find((t) => t.id === selectedTodoId);
  let isCompleted = false;
  if (todo && !outsideCurrentMonth) {
    const weekStart = dayjs(day).startOf('week').format('YYYY-MM-DD');
    const dateStr = dayjs(day).format('YYYY-MM-DD');
    isCompleted = todo.weeklyCompletions?.[weekStart]?.[dateStr] || false;
  }

  return (
    <Badge
      key={props.day.toString()}
      overlap="circular"
      variant="dot"
      color={isCompleted ? 'success' : 'default'}
      invisible={!isCompleted || outsideCurrentMonth}
      sx={{ '& .MuiBadge-badge': { width: 6, height: 6, minWidth: 6, borderRadius: '50%' } }}
    >
      <PickersDay {...other} day={day} outsideCurrentMonth={outsideCurrentMonth} />
    </Badge>
  );
};

export default TodoList;

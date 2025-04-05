const express = require('express');
const router = express.Router();

// Natural Language Processing functions
const analyzeUserInput = (input) => {
  // Task creation patterns
  const taskPatterns = [
    /create( a)? task/i,
    /add( a)? task/i,
    /remind me to/i,
    /schedule/i
  ];

  // Workout planning patterns
  const workoutPatterns = [
    /create( a)? workout/i,
    /plan( a)? workout/i,
    /exercise plan/i,
    /fitness routine/i
  ];

  // Meal planning patterns
  const mealPatterns = [
    /create( a)? meal plan/i,
    /plan( my)? meals/i,
    /diet plan/i,
    /nutrition plan/i
  ];

  // Check patterns and extract relevant information
  if (taskPatterns.some(pattern => pattern.test(input))) {
    return {
      type: 'create_task',
      data: {
        title: input.replace(/create task|add task|remind me to|schedule/gi, '').trim(),
        dueDate: extractDate(input),
        priority: extractPriority(input)
      }
    };
  }

  if (workoutPatterns.some(pattern => pattern.test(input))) {
    return {
      type: 'plan_workout',
      data: {
        type: extractWorkoutType(input),
        duration: extractDuration(input),
        intensity: extractIntensity(input)
      }
    };
  }

  if (mealPatterns.some(pattern => pattern.test(input))) {
    return {
      type: 'plan_meal',
      data: {
        preferences: extractDietaryPreferences(input),
        restrictions: extractRestrictions(input),
        calories: extractCalories(input)
      }
    };
  }

  return {
    type: 'general_query',
    data: { query: input }
  };
};

// Helper functions for information extraction
const extractDate = (input) => {
  // Implement date extraction logic
  return null;
};

const extractPriority = (input) => {
  if (/high priority|urgent|important/i.test(input)) return 'high';
  if (/medium priority|normal/i.test(input)) return 'medium';
  if (/low priority/i.test(input)) return 'low';
  return 'medium';
};

const extractWorkoutType = (input) => {
  if (/cardio|running|jogging|cycling/i.test(input)) return 'cardio';
  if (/strength|weights|lifting/i.test(input)) return 'strength';
  if (/yoga|flexibility|stretching/i.test(input)) return 'flexibility';
  return 'general';
};

const extractDuration = (input) => {
  const durationMatch = input.match(/(\d+)\s*(min(ute)?s?|hours?)/i);
  if (durationMatch) {
    const value = parseInt(durationMatch[1]);
    const unit = durationMatch[2].toLowerCase().startsWith('h') ? 'hours' : 'minutes';
    return { value, unit };
  }
  return { value: 30, unit: 'minutes' }; // Default duration
};

const extractIntensity = (input) => {
  if (/high intensity|intense|hard/i.test(input)) return 'high';
  if (/medium intensity|moderate/i.test(input)) return 'medium';
  if (/low intensity|light|easy/i.test(input)) return 'low';
  return 'medium';
};

const extractDietaryPreferences = (input) => {
  const preferences = [];
  if (/vegetarian/i.test(input)) preferences.push('vegetarian');
  if (/vegan/i.test(input)) preferences.push('vegan');
  if (/keto/i.test(input)) preferences.push('keto');
  if (/paleo/i.test(input)) preferences.push('paleo');
  return preferences;
};

const extractRestrictions = (input) => {
  const restrictions = [];
  if (/gluten[- ]free/i.test(input)) restrictions.push('gluten-free');
  if (/dairy[- ]free/i.test(input)) restrictions.push('dairy-free');
  if (/nut[- ]free/i.test(input)) restrictions.push('nut-free');
  return restrictions;
};

const extractCalories = (input) => {
  const calorieMatch = input.match(/(\d+)\s*calories/i);
  return calorieMatch ? parseInt(calorieMatch[1]) : null;
};

// Route handlers
router.post('/analyze', async (req, res) => {
  try {
    const { input } = req.body;
    const analysis = analyzeUserInput(input);
    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing input:', error);
    res.status(500).json({ error: 'Failed to analyze input' });
  }
});

router.post('/command', async (req, res) => {
  try {
    const { command } = req.body;
    const analysis = analyzeUserInput(command);
    
    // Process the command based on the analysis
    let result;
    switch (analysis.type) {
      case 'create_task':
        // Handle task creation
        result = { message: 'Task created successfully', data: analysis.data };
        break;
      case 'plan_workout':
        // Handle workout planning
        result = { message: 'Workout plan created', data: analysis.data };
        break;
      case 'plan_meal':
        // Handle meal planning
        result = { message: 'Meal plan created', data: analysis.data };
        break;
      default:
        result = { message: 'Command processed', data: analysis };
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error processing command:', error);
    res.status(500).json({ error: 'Failed to process command' });
  }
});

module.exports = router; 
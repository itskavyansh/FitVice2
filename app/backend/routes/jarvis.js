const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk'); // Add Groq SDK
const auth = require('../middleware/auth'); // Make sure auth middleware is used for /command
const Task = require('../models/Task'); // Import the Task model

// Initialize Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const groqModel = 'mistral-saba-24b';

// New function to analyze input using Groq
const analyzeWithGroq = async (input, history = []) => {
  const systemPrompt = `You are an AI assistant for a fitness app called FitVice. 
Analyze the user's input (considering the conversation history if provided) and determine their intent. 
Possible intents are: 'create_task', 'plan_workout', 'plan_meal', 'general_query'.
Extract relevant parameters for each intent.
Respond ONLY with a JSON object in the following format. Do not add any explanations.

For 'create_task':
{ "type": "create_task", "data": { "title": "extracted task title", "dueDate": "extracted date or null", "priority": "high|medium|low or null" } }

For 'plan_workout':
{ "type": "plan_workout", "data": { "goal": "extracted goal or null", "duration_minutes": extracted_duration_in_minutes_or_null, "intensity": "high|medium|low or null" } }

For 'plan_meal':
{ "type": "plan_meal", "data": { "preferences": ["extracted preferences"], "restrictions": ["extracted restrictions"], "calories": extracted_calories_or_null } }

For 'general_query':
{ "type": "general_query", "data": { "query": "original user input" } }

If no specific intent is clear, default to 'general_query'. Extract parameters as best as possible, using null if not found.`;

  // Prepare messages array including history
  const messages = [
    {
      role: 'system',
      content: systemPrompt,
    },
    // Add history messages 
    ...history.map(msg => ({ role: msg.role, content: msg.content })),
    // Add the current user input
    {
      role: 'user',
      content: input,
    },
  ];

  try {
     console.log("Sending to Groq (Analyze Intent):", JSON.stringify(messages, null, 2)); // Log messages sent
    const chatCompletion = await groq.chat.completions.create({
      messages: messages, // Use the array with history
      model: groqModel,
      temperature: 0.5,
      stream: false,
      response_format: { type: "json_object" }, // Request JSON output
    });

    const text = chatCompletion.choices[0]?.message?.content || '';
    console.log("Groq raw response (Analyze Intent):", text);
    
    try {
      const analysis = JSON.parse(text);
      if (!analysis.type || !analysis.data) {
          throw new Error("Invalid JSON structure from Groq");
      }
      return analysis;
    } catch (parseError) {
      console.error('Failed to parse Groq JSON response (Analyze Intent):', text, parseError);
      return { type: 'general_query', data: { query: input } };
    }

  } catch (error) {
    console.error('Error calling Groq API (Analyze Intent):', error);
    return { type: 'general_query', data: { query: input } };
  }
};

// --- New function to generate workout plan using Groq ---
const generateWorkoutPlanWithGroq = async (goal, duration_minutes, intensity) => {
  const systemPrompt = `You are a fitness expert creating personalized workout plans.
Generate a structured workout plan based on the user's goal, desired duration, and intensity.
Provide the plan ONLY as a JSON object with the following structure:
{
  "planTitle": "Descriptive Title (e.g., 45-Minute Intermediate Strength Workout)",
  "goal": "${goal || 'General Fitness'}",
  "duration_minutes": ${duration_minutes || 45},
  "intensity": "${intensity || 'medium'}",
  "phases": [
    {
      "phaseName": "Warm-up",
      "duration_minutes": 5,
      "exercises": [
        { "name": "Example: Jumping Jacks", "duration_or_reps": "60 seconds" },
        { "name": "Example: Dynamic Stretches", "duration_or_reps": "3 minutes" }
      ]
    },
    {
      "phaseName": "Workout",
      "duration_minutes": ${duration_minutes ? duration_minutes - 10 : 35},
      "exercises": [
        { "name": "Exercise 1 Name", "sets": number, "reps": "X-Y reps or time", "rest_seconds": number },
        { "name": "Exercise 2 Name", "sets": number, "reps": "X-Y reps or time", "rest_seconds": number }
        // Add more exercises based on goal, duration, intensity
      ]
    },
    {
      "phaseName": "Cool-down",
      "duration_minutes": 5,
      "exercises": [
        { "name": "Example: Static Stretching", "duration_or_reps": "5 minutes" }
      ]
    }
  ],
  "notes": "Optional: Add brief tips or notes here."
}
Ensure the workout phase duration reflects the total requested duration minus warm-up and cool-down. Include appropriate exercises for the specified goal and intensity.`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          // Construct a user message if needed, or rely on system prompt
          content: `Generate a workout plan with goal: ${goal || 'Not specified'}, duration: ${duration_minutes || 'Not specified'} minutes, intensity: ${intensity || 'Not specified'}`,
        },
      ],
      model: groqModel,
      temperature: 0.7,
      stream: false,
      response_format: { type: "json_object" },
    });

    const text = chatCompletion.choices[0]?.message?.content || '';
    console.log("Groq workout plan raw response:", text);
    const plan = JSON.parse(text);
    // Optional: Add further validation for the plan structure
    return { success: true, plan: plan };
  } catch (error) {
    console.error('Error generating workout plan with Groq:', error);
    return { success: false, error: 'Failed to generate workout plan.' };
  }
};

// --- New function to generate meal plan using Groq ---
const generateMealPlanWithGroq = async (preferences, restrictions, calories) => {
  const systemPrompt = `You are a nutritionist creating personalized meal plans.
Generate a structured 1-day meal plan based on the user's dietary preferences, restrictions, and target calorie goal.
Provide the plan ONLY as a JSON object with the following structure:
{
  "planTitle": "Descriptive Title (e.g., 2000 Calorie Vegan Gluten-Free Meal Plan)",
  "targetCalories": ${calories || 2000},
  "preferences": ${JSON.stringify(preferences || [])},
  "restrictions": ${JSON.stringify(restrictions || [])},
  "meals": {
    "breakfast": {
      "name": "Meal Name",
      "calories": number,
      "protein": "Xg",
      "ingredients": ["Ingredient 1", "Ingredient 2"],
      "recipe_notes": "Optional: Brief preparation notes"
    },
    "lunch": {
      "name": "Meal Name",
      "calories": number,
      "protein": "Xg",
      "ingredients": ["Ingredient 1"],
      "recipe_notes": "Optional notes"
    },
    "dinner": {
      "name": "Meal Name",
      "calories": number,
      "protein": "Xg",
      "ingredients": ["Ingredient 1"],
      "recipe_notes": "Optional notes"
    },
    "snacks": [
      {
        "name": "Snack Name",
        "calories": number,
        "protein": "Xg",
        "ingredients": ["Ingredient 1"],
        "recipe_notes": "Optional notes"
      }
      // Can include multiple snacks
    ]
  },
  "totalEstimated": {
      "calories": number, // Sum of meal/snack calories
      "protein": "Xg" // Sum of meal/snack protein
  },
  "notes": "Optional: General dietary advice or notes."
}
Ensure the meal suggestions align with the preferences and restrictions. Aim to be close to the target calorie count.`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: `Generate a meal plan with preferences: ${preferences?.join(', ') || 'None'}, restrictions: ${restrictions?.join(', ') || 'None'}, target calories: ${calories || 'Not specified'}`,
        },
      ],
      model: groqModel,
      temperature: 0.8, // Slightly higher temp for more variety
      stream: false,
      response_format: { type: "json_object" },
    });

    const text = chatCompletion.choices[0]?.message?.content || '';
    console.log("Groq meal plan raw response:", text);
    const plan = JSON.parse(text);
    // Optional: Add validation
    return { success: true, plan: plan };
  } catch (error) {
    console.error('Error generating meal plan with Groq:', error);
    return { success: false, error: 'Failed to generate meal plan.' };
  }
};

// --- New function to handle general query using Groq ---
const handleGeneralQueryWithGroq = async (query, history = []) => {
  const systemPrompt = `
**Your Persona: Jarvis - The Empathetic Fitness Coach**
*   You are NOT a generic AI. You are Jarvis, a friendly, motivating, and knowledgeable fitness coach integrated into the FitVice app.
*   **Tone:** Be positive, supportive, encouraging, and empathetic. Use a slightly informal, conversational style like a helpful coach chatting with a client.
*   **Personality:** Use relevant emojis sparingly (💪, ✅, 🤔, 👍, 🎉) to add warmth. Avoid robotic phrasing.
*   **Engagement:** Ask relevant follow-up questions when appropriate to keep the conversation flowing and gather more information (like asking about sets/reps after suggesting exercises).
*   **Greetings:** Start the *very first* message in a conversation naturally (e.g., "Hey there!", "Happy to help!", "Let's get started!"). Do NOT use greetings like "Hello!" or "Hi!" in subsequent replies within the same conversation (check the history).

**Formatting Rules (CRITICAL):**
*   **Paragraphs:** Keep paragraphs VERY short (1-2 sentences ideally, 3 max).
*   **Lists (Exercises, Tips, Steps, etc.): MUST use bullet points.**
    *   Example: 
        "Okay, here's a quick chest routine:
        *   Incline Dumbbell Press (3 sets of 8-12 reps)
        *   Flat Barbell Bench Press (3 sets of 6-8 reps)
        *   Cable Flyes (3 sets of 12-15 reps)"
*   Use **bold text** sparingly for emphasis on key terms or titles.

**Your Task:**
1.  Answer the user's general fitness, nutrition, or FitVice app-related questions clearly and concisely, following all persona and formatting rules.
2.  If the user asks for a complex, structured plan (like a detailed multi-day workout or meal plan), provide a *brief bullet-point summary* or overview and suggest they use a specific feature if appropriate, instead of generating a long, unstructured text blob.
3.  If you cannot fulfill a request (e.g., account deletion, accessing personal data), politely explain your limitations as a fitness assistant within the app.
4.  Always consider the conversation history to provide relevant and non-repetitive responses.
`;

  // Prepare messages array including history
  const messages = [
    {
      role: 'system',
      content: systemPrompt,
    },
    // Add history messages (ensure alternating user/assistant roles if possible)
    ...history.map(msg => ({ role: msg.role, content: msg.content })),
    // Add the current user query
    {
      role: 'user',
      content: query,
    },
  ];

  try {
    console.log("Sending to Groq (General Query - Revised Prompt):", JSON.stringify(messages, null, 2));
    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: groqModel,
      temperature: 0.75, // Slightly increased for more variability
      stream: false,
    });

    const responseText = chatCompletion.choices[0]?.message?.content || 'Hmm, I seem to be speechless right now. 🤔 Could you try asking differently?';
    console.log("Groq Raw Response (General Query - Revised Prompt):", responseText); // Log the raw response
    return { success: true, response: responseText };
  } catch (error) {
    console.error('Error handling general query with Groq:', error);
    return { success: false, error: 'Oops! I ran into a small glitch trying to answer that. Please try again.' };
  }
};

// Route handlers
router.post('/analyze', async (req, res) => {
  try {
    const { input, history } = req.body; // Accept history
    if (!input) {
        return res.status(400).json({ error: 'Input text is required' });
    }
    const analysis = await analyzeWithGroq(input, history); // Pass history
    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing input:', error);
    res.status(500).json({ error: 'Failed to analyze input' });
  }
});

router.post('/command', auth, async (req, res) => {
  console.log(`[Jarvis Command] Received command for user: ${req.user?.id}`); // Log user ID
  try {
    const { command, history } = req.body; 
     if (!command) {
        console.log("[Jarvis Command] Error: Command text is required");
        return res.status(400).json({ error: 'Command text is required' });
    }
    console.log(`[Jarvis Command] Analyzing command: "${command}"`);
    const analysis = await analyzeWithGroq(command, history);
    console.log("[Jarvis Command] Analysis complete:", JSON.stringify(analysis, null, 2));
    
    let result;
    let responseStatus = 200; // Default success status

    switch (analysis.type) {
      case 'create_task':
        console.log("[Jarvis Command] Handling type: create_task");
        try {
          const taskData = analysis.data;
          const newTask = new Task({
            user: req.user.id, 
            title: taskData.title || 'Untitled Task', 
            dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null, 
            priority: taskData.priority || 'medium',
          });
          await newTask.save();
          console.log("[Jarvis Command] Task saved successfully:", newTask._id);
          result = { 
            message: `Task "${newTask.title}" created successfully.`, 
            type: 'task_created', // Specific type for frontend
            data: newTask 
          };
        } catch (taskError) {
          console.error('[Jarvis Command] Error creating task:', taskError);
          responseStatus = 500; // Indicate server error for task save
          result = { 
            message: 'Analyzed: Create task, but failed to save to database.', 
            error: taskError.message, 
            data: analysis.data 
          };
        }
        break;
      case 'plan_workout':
        console.log("[Jarvis Command] Handling type: plan_workout");
        const workoutData = analysis.data;
        const workoutPlanResult = await generateWorkoutPlanWithGroq(
          workoutData.goal,
          workoutData.duration_minutes,
          workoutData.intensity
        );
        if (workoutPlanResult.success) {
          console.log("[Jarvis Command] Workout plan generated.");
          result = { 
            message: `Workout plan "${workoutPlanResult.plan?.planTitle || 'Plan'}" generated successfully.`, 
            type: 'workout_plan', 
            data: workoutPlanResult.plan 
          };
        } else {
          console.error("[Jarvis Command] Failed to generate workout plan:", workoutPlanResult.error);
          responseStatus = 500;
          result = { 
            message: 'Analyzed: Plan workout, but failed to generate the plan.',
            error: workoutPlanResult.error,
            data: analysis.data
          };
        }
        break;
      case 'plan_meal':
         console.log("[Jarvis Command] Handling type: plan_meal");
        const mealData = analysis.data;
        const mealPlanResult = await generateMealPlanWithGroq(
          mealData.preferences,
          mealData.restrictions,
          mealData.calories
        );
        if (mealPlanResult.success) {
          console.log("[Jarvis Command] Meal plan generated.");
          result = { 
            message: `Meal plan "${mealPlanResult.plan?.planTitle || 'Plan'}" generated successfully.`, 
            type: 'meal_plan', 
            data: mealPlanResult.plan 
          };
        } else {
          console.error("[Jarvis Command] Failed to generate meal plan:", mealPlanResult.error);
          responseStatus = 500;
          result = { 
            message: 'Analyzed: Plan meal, but failed to generate the plan.',
            error: mealPlanResult.error,
            data: analysis.data
          };
        }
        break;
      default: // general_query
        console.log("[Jarvis Command] Handling type: general_query");
        const queryResponse = await handleGeneralQueryWithGroq(analysis.data.query, history);
        if (queryResponse.success) {
            console.log("[Jarvis Command] General query answered.");
           result = { 
             message: queryResponse.response, 
             type: 'general_response',
             data: analysis.data 
           };
        } else {
           console.error("[Jarvis Command] Failed to answer general query:", queryResponse.error);
           responseStatus = 500;
           result = { 
            message: queryResponse.error, 
            type: 'error',
            data: analysis.data
           };
        }
    }
    
    console.log(`[Jarvis Command] Sending response (Status ${responseStatus}):`, JSON.stringify(result));
    res.status(responseStatus).json(result);

  } catch (error) {
    // Catch errors occurring *before* the switch statement or outside specific try/catches
    console.error('[Jarvis Command] Top-level error processing command:', error);
    res.status(500).json({ error: 'Failed to process command due to an unexpected server error.' });
  }
});

module.exports = router; 
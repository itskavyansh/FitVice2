const express = require('express');
const router = express.Router();
// const { GoogleGenerativeAI } = require('@google/generative-ai'); // Remove Gemini
const Groq = require('groq-sdk'); // Add Groq SDK
const auth = require('../middleware/auth');

// Initialize Google Generative AI - Remove
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Initialize Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const groqModel = 'mixtral-8x7b-32768';

// Generate recipe based on ingredients
router.post('/generate', auth, async (req, res) => {
  try {
    const { ingredients } = req.body;

    if (!ingredients) {
      return res.status(400).json({
        success: false,
        message: 'Please provide ingredients',
      });
    }

    // Keep the detailed prompt structure
    const promptContent = `Create a healthy recipe using these ingredients: ${ingredients}.
    Please provide the recipe in the following JSON format ONLY. Do not add any extra text or explanation before or after the JSON block:
    {
      "title": "Recipe Title",
      "description": "Brief description of the recipe",
      "ingredients": ["list of ingredients with quantities"],
      "instructions": ["step by step instructions"],
      "nutritionInfo": {
        "calories": number,
        "protein": "Xg",
        "carbs": "Xg",
        "fat": "Xg"
      }
    }`;

    // Replace Gemini call with Groq call
    // const result = await model.generateContent(prompt);
    // const response = await result.response;
    // const text = response.text();

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that generates recipes in JSON format.',
        },
        {
          role: 'user',
          content: promptContent,
        },
      ],
      model: groqModel,
      temperature: 0.7, // Adjust temperature as needed
      // max_tokens: 1024, // Optional: set max tokens if needed
      // top_p: 1, // Optional
      // stop: null, // Optional
      stream: false, // We want the full response here
    });

    const text = chatCompletion.choices[0]?.message?.content || '';

    // Attempt to parse the text response as JSON
    let recipe;
    try {
      // Groq might still include ```json ... ```, try to extract it
      const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      const jsonString = jsonMatch ? jsonMatch[1].trim() : text.trim();
      recipe = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse Groq response:', text);
      console.error('Parse Error:', parseError);
      return res.status(500).json({
        success: false,
        message: 'Failed to parse recipe data from AI. The format might be incorrect.',
        rawResponse: text, // Send raw response for debugging
      });
    }

    res.json({
      success: true,
      data: recipe,
    });
  } catch (error) {
    console.error('Recipe generation error:', error);
    // Check for specific Groq API errors if needed
    res.status(500).json({
      success: false,
      message: 'Failed to generate recipe. Please try again.',
    });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
const auth = require("../middleware/auth");

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate recipe based on ingredients
router.post("/generate", auth, async (req, res) => {
  try {
    const { ingredients } = req.body;

    if (!ingredients) {
      return res.status(400).json({
        success: false,
        message: "Please provide ingredients",
      });
    }

    const prompt = `Create a healthy recipe using these ingredients: ${ingredients}. 
    Please provide the recipe in the following JSON format:
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

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a professional nutritionist and chef. Create healthy, balanced recipes with accurate nutritional information.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const recipe = JSON.parse(completion.choices[0].message.content);

    res.json({
      success: true,
      data: recipe,
    });
  } catch (error) {
    console.error("Recipe generation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate recipe. Please try again.",
    });
  }
});

module.exports = router; 
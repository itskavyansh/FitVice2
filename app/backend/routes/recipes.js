const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const auth = require("../middleware/auth");

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

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
    Please provide the recipe strictly in the following JSON format, with no introductory text or markdown formatting:
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

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    let recipe;
    try {
      const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
      recipe = JSON.parse(cleanedText);
    } catch (parseError) {
        console.error("Failed to parse Gemini response:", parseError);
        console.error("Raw Gemini response text:", text);
        return res.status(500).json({
            success: false,
            message: "Failed to parse recipe data from AI response.",
            rawResponse: process.env.NODE_ENV === 'development' ? text : undefined
        });
    }

    res.json({
      success: true,
      data: recipe,
    });
  } catch (error) {
    console.error("Recipe generation error:", error);
    if (error.response) {
        console.error("Gemini API Error details:", error.response.data);
    }
    res.status(500).json({
      success: false,
      message: "Failed to generate recipe. Please try again.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router; 
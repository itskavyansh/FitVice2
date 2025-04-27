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
// Update to a supported model (mixtral-8x7b-32768 is decommissioned)
const groqModel = 'llama3-70b-8192';

// Function to generate a reliable image URL for a given ingredient
function getRecipeImageUrl(ingredient) {
  // Clean and encode the ingredient name
  const cleanIngredient = ingredient.trim().toLowerCase();
  const encodedIngredient = encodeURIComponent(cleanIngredient);

  // Use a more reliable approach with Unsplash collections
  return `https://source.unsplash.com/collection/2097631/800x600?${encodedIngredient},food`;
}

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

    console.log(`Generating recipe for ingredients: ${ingredients}`);

    // Check if GROQ API key is available
    if (!process.env.GROQ_API_KEY) {
      console.error('GROQ_API_KEY is not defined in environment variables');
      return res.status(500).json({
        success: false,
        message: 'API configuration error. Please contact support.',
      });
    }

    // Simplify the prompt to avoid formatting issues
    const promptContent = `Create a healthy recipe using these ingredients: ${ingredients}.
    Output the recipe in valid JSON format with these fields only: 
    title - the name of the recipe, 
    description - brief description of the recipe, 
    ingredients - array of ingredients with quantities, 
    instructions - array of steps, 
    nutritionInfo - object with calories, protein, carbs, fat`;

    console.log('Sending request to Groq API...');

    try {
      // Groq API call with simplified error handling
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content:
              "You are a recipe expert. Always respond with valid JSON that can be parsed directly. Don't include markdown code blocks or any text outside the JSON.",
          },
          {
            role: 'user',
            content: promptContent,
          },
        ],
        model: groqModel,
        temperature: 0.7,
        stream: false,
      });

      console.log('Received response from Groq API');
      const text = chatCompletion.choices[0]?.message?.content || '';
      console.log('Raw response length:', text.length);

      // Create a fallback recipe
      const mainIngredient = ingredients.split(',')[0].trim();
      const fallbackRecipe = {
        title: `Simple ${mainIngredient.charAt(0).toUpperCase() + mainIngredient.slice(1)} Recipe`,
        description: `A healthy recipe featuring ${ingredients}`,
        ingredients: ingredients.split(',').map((i) => `${i.trim()} - as needed`),
        instructions: [
          `Prepare ${mainIngredient} and other ingredients`,
          'Cook according to your preference',
          'Enjoy your meal!',
        ],
        nutritionInfo: {
          calories: '350',
          protein: '15g',
          carbs: '40g',
          fat: '10g',
        },
        image: getRecipeImageUrl(mainIngredient),
      };

      // Attempt to parse the text response as JSON
      let recipe;
      try {
        // First try: direct parsing
        try {
          recipe = JSON.parse(text);
          console.log('Successfully parsed JSON directly');
        } catch (directParseError) {
          console.log('Direct parsing failed, trying to extract JSON from markdown');

          // Second try: extract JSON from markdown code blocks
          const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
          if (jsonMatch) {
            const jsonString = jsonMatch[1].trim();
            recipe = JSON.parse(jsonString);
            console.log('Successfully parsed JSON from markdown code block');
          } else {
            // Third try: look for opening and closing braces
            const potentialJson = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
            if (potentialJson && text.indexOf('{') !== -1 && text.lastIndexOf('}') !== -1) {
              recipe = JSON.parse(potentialJson);
              console.log('Successfully parsed JSON by extracting braces');
            } else {
              console.log('Could not extract valid JSON, using fallback recipe');
              recipe = fallbackRecipe;
            }
          }
        }

        // Ensure all required fields are present
        if (!recipe.title || !recipe.ingredients || !recipe.instructions) {
          console.log('Missing required fields in recipe response, using fallback recipe');
          recipe = fallbackRecipe;
        }

        // Ensure image field exists
        if (!recipe.image) {
          recipe.image = getRecipeImageUrl(ingredients.split(',')[0]);
        }

        // Ensure nutritionInfo exists
        if (!recipe.nutritionInfo) {
          recipe.nutritionInfo = {
            calories: '350',
            protein: '15g',
            carbs: '40g',
            fat: '10g',
          };
        }

        console.log('Sending successful response with recipe');
        return res.json({
          success: true,
          data: recipe,
        });
      } catch (parseError) {
        console.error('Failed to parse Groq response:', parseError.message);
        console.log('Using fallback recipe due to parsing failure');

        return res.json({
          success: true,
          data: fallbackRecipe,
        });
      }
    } catch (groqError) {
      console.error('Groq API call failed:', groqError.message);

      // Create and return a fallback recipe
      const mainIngredient = ingredients.split(',')[0].trim();
      const fallbackRecipe = {
        title: `Simple ${mainIngredient.charAt(0).toUpperCase() + mainIngredient.slice(1)} Recipe`,
        description: `A healthy recipe featuring ${ingredients}. This is a fallback recipe created when we couldn't connect to our AI service.`,
        ingredients: ingredients.split(',').map((i) => `${i.trim()} - as needed`),
        instructions: [
          `Prepare ${mainIngredient} and other ingredients`,
          'Cook according to your preference',
          'Enjoy your meal!',
        ],
        nutritionInfo: {
          calories: '350',
          protein: '15g',
          carbs: '40g',
          fat: '10g',
        },
        image: getRecipeImageUrl(mainIngredient),
      };

      return res.json({
        success: true,
        data: fallbackRecipe,
      });
    }
  } catch (error) {
    console.error('Recipe generation error:', error.message);
    console.error('Error stack:', error.stack);

    // Return fallback recipe even in case of error
    try {
      const mainIngredient = req.body.ingredients.split(',')[0].trim();
      const fallbackRecipe = {
        title: `Simple ${mainIngredient.charAt(0).toUpperCase() + mainIngredient.slice(1)} Recipe`,
        description: `A healthy recipe. This is a fallback recipe created when there was an error.`,
        ingredients: req.body.ingredients.split(',').map((i) => `${i.trim()} - as needed`),
        instructions: [
          `Prepare ${mainIngredient} and other ingredients`,
          'Cook according to your preference',
          'Enjoy your meal!',
        ],
        nutritionInfo: {
          calories: '350',
          protein: '15g',
          carbs: '40g',
          fat: '10g',
        },
        image: getRecipeImageUrl(mainIngredient),
      };

      return res.json({
        success: true,
        data: fallbackRecipe,
      });
    } catch (fallbackError) {
      console.error('Even fallback creation failed:', fallbackError);

      // Absolute last resort
      return res.status(500).json({
        success: false,
        message: 'Failed to generate recipe. Please try again.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
});

module.exports = router;

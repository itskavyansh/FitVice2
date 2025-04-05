class GeminiService {
  constructor() {
    this.conversationHistory = [];
    this.initializeAPI();
  }

  initializeAPI() {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    if (!apiKey) {
      console.error('API key is missing. Please check your .env file.');
      return;
    }
    this.apiKey = apiKey.replace(/["']/g, '').trim();
  }

  async generateRecipe(ingredients) {
    try {
      if (!this.apiKey) {
        throw new Error('API key is not configured. Please check your .env file.');
      }

      const prompt = `You are a professional chef and nutritionist. Create a healthy recipe using these ingredients: ${ingredients}.

Your role:
- Create delicious, healthy recipes
- Provide accurate nutritional information
- Give clear, step-by-step instructions
- Suggest ingredient substitutions if needed
- Consider dietary preferences and restrictions

Please provide the recipe in this exact JSON format:
{
  "title": "Recipe Title",
  "description": "Brief description of the recipe",
  "image": "https://source.unsplash.com/400x300/?food,${ingredients.split(',')[0].trim()}",
  "ingredients": ["ingredient 1 with quantity", "ingredient 2 with quantity"],
  "instructions": ["Step 1", "Step 2", "Step 3"],
  "nutritionInfo": {
    "calories": "number",
    "protein": "number in grams",
    "carbs": "number in grams",
    "fat": "number in grams"
  }
}`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${this.apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
            topP: 0.8,
            topK: 40
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate recipe');
      }

      const data = await response.json();
      const recipeText = data.candidates[0].content.parts[0].text;
      
      // Extract JSON from the response
      const jsonMatch = recipeText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid recipe format received');
      }
      
      const recipeData = JSON.parse(jsonMatch[0]);
      
      // Ensure image URL is properly formatted
      if (!recipeData.image) {
        recipeData.image = `https://source.unsplash.com/400x300/?food,${ingredients.split(',')[0].trim()}`;
      }
      
      return {
        success: true,
        data: recipeData
      };
    } catch (error) {
      console.error('Error generating recipe:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  async askHealthQuestion(question) {
    try {
      if (!this.apiKey) {
        throw new Error('API key is not configured. Please check your .env file.');
      }

      const prompt = `You are a professional nutritionist and health expert. Please provide a clear, evidence-based answer to this health question: ${question}

Your role:
- Provide accurate, science-based information
- Focus on practical, actionable advice
- Consider individual health needs
- Be clear and concise
- Use professional but accessible language

Please format your response in clear paragraphs with:
1. A direct answer to the question
2. Supporting scientific evidence
3. Practical recommendations
4. Any relevant precautions or considerations`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${this.apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
            topP: 0.8,
            topK: 40
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get health advice');
      }

      const data = await response.json();
      const answer = data.candidates[0].content.parts[0].text;
      
      return {
        success: true,
        data: answer
      };
    } catch (error) {
      console.error('Error getting health advice:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  async getNutritionTips() {
    try {
      if (!this.apiKey) {
        throw new Error('API key is not configured. Please check your .env file.');
      }

      const prompt = `You are a professional nutritionist and health expert. Generate 5 engaging and practical nutrition tips that are:
- Evidence-based and scientifically accurate
- Easy to understand and implement
- Focused on practical daily habits
- Positive and encouraging
- Relevant to general health and wellness

For each tip, provide:
1. A catchy title (max 5 words)
2. A clear, concise description (2-3 sentences)
3. A relevant Material-UI icon name
4. A color theme that matches the tip's mood

Format the response as a JSON array with this exact structure:
[
  {
    "title": "Tip Title",
    "description": "Clear, practical description of the tip and its benefits.",
    "icon": "MaterialUIIconName",
    "color": "primary|secondary|success|info|warning|error"
  }
]

Use these Material-UI icons: Restaurant, LocalDining, FoodBank, Nutrition, HealthAndSafety, FitnessCenter, WaterDrop, Favorite, Lightbulb, EmojiFoodBeverage`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${this.apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 1000,
            topP: 0.9,
            topK: 40
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get nutrition tips');
      }

      const data = await response.json();
      const tipsText = data.candidates[0].content.parts[0].text;
      
      // Extract JSON from the response
      const jsonMatch = tipsText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('Invalid tips format received');
      }
      
      const tipsData = JSON.parse(jsonMatch[0]);
      
      // Validate and ensure each tip has all required fields
      const validatedTips = tipsData.map(tip => ({
        title: tip.title || 'Nutrition Tip',
        description: tip.description || 'Practical advice for better health',
        icon: tip.icon || 'Nutrition',
        color: tip.color || 'primary'
      }));
      
      return {
        success: true,
        data: validatedTips
      };
    } catch (error) {
      console.error('Error getting nutrition tips:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }
}

export default new GeminiService(); 
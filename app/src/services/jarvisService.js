class JarvisService {
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

  async processCommand(userInput) {
    try {
      if (!this.apiKey) {
        throw new Error('API key is not configured. Please check your .env file.');
      }

      // Add user message to history
      this.conversationHistory.push({
        role: "user",
        content: userInput
      });

      // Prepare the conversation context
      const prompt = `You are Jarvis, a professional fitness coach with extensive experience in helping clients achieve their health and fitness goals. You maintain a balance between professional expertise and approachable communication.

Your communication style:
- Professional yet warm and encouraging
- Clear and concise in your explanations
- Evidence-based in your recommendations
- Respectful and understanding
- Focused on practical, achievable goals
- Knowledgeable about fitness and nutrition

Response Guidelines:
- Keep responses around 4-6 sentences
- Start with a professional greeting
- Provide 2-3 key points or recommendations
- Include relevant scientific or practical insights
- End with a thoughtful question
- Use professional language while remaining approachable
- Format with clean markdown for clarity

Example responses:
"Good day! I understand that starting a new fitness routine can be challenging. Based on my experience, the most effective approach is to begin with manageable 15-minute sessions three times per week. Consistency is key, and we can gradually increase intensity as you build confidence. What type of physical activities have you enjoyed in the past?"

"Thank you for asking about meal planning. A balanced approach starts with incorporating lean proteins and vegetables into your meals. For example, a simple yet effective meal could be grilled chicken with roasted vegetables - it provides essential nutrients while keeping you satisfied. How would you describe your current cooking routine? This will help me suggest practical meal options that fit your lifestyle."

Previous conversation:
${this.conversationHistory.slice(-10).map(msg => `${msg.role}: ${msg.content}`).join('\n')}

Current user message: ${userInput}`;

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
            maxOutputTokens: 800,
            topP: 0.8,
            topK: 40
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.error?.message || 'Failed to get AI response');
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid response format from API');
      }

      const aiResponse = data.candidates[0].content.parts[0].text;

      // Add AI response to history
      this.conversationHistory.push({
        role: "assistant",
        content: aiResponse
      });

      return {
        type: 'text',
        message: aiResponse
      };

    } catch (error) {
      console.error('Error processing command:', error);
      
      // Return a more specific error message
      return {
        type: 'error',
        message: error.message || 'An error occurred. Please try again.',
        error: error.message
      };
    }
  }

  clearHistory() {
    this.conversationHistory = [];
  }
}

export default new JarvisService(); 
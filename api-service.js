// API Service for Gemini Integration
class GeminiAIService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  }

  // Generate meal plan based on user profile
  async generateMealPlan(userProfile) {
    const prompt = this.buildMealPlanPrompt(userProfile);
    
    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      return this.parseMealPlanResponse(data);
    } catch (error) {
      console.error('Error generating meal plan:', error);
      return this.getFallbackMealPlan();
    }
  }

  // Build the prompt for meal plan generation
  buildMealPlanPrompt(userProfile) {
    return `You are a professional nutritionist creating a personalized meal plan for a client with the following profile:
- Age: ${userProfile.age || 'Not specified'}
- Gender: ${userProfile.gender || 'Not specified'}
- Dietary restrictions: ${userProfile.dietaryRestrictions || 'None'}
- Health goals: ${userProfile.healthGoals || 'General health'}
- Food preferences: ${userProfile.foodPreferences || 'No specific preferences'}
- Allergies: ${userProfile.allergies || 'None'}

Please generate a 3-day meal plan with breakfast, lunch, and dinner for each day.
Each meal should include:
1. Meal name
2. Ingredients list with quantities
3. Step-by-step cooking instructions
4. Approximate nutritional information (calories, protein, carbs, fat)

Format your response as JSON with the following structure:
{
  "mealPlan": [
    {
      "day": "Monday",
      "meals": [
        {
          "type": "breakfast",
          "name": "Meal name",
          "ingredients": [{"name": "ingredient", "quantity": "amount"}],
          "instructions": ["Step 1", "Step 2", ...],
          "nutrition": {"calories": 0, "protein": 0, "carbs": 0, "fat": 0}
        }
      ]
    }
  ]
}`;
  }

  // Parse the API response
  parseMealPlanResponse(data) {
    try {
      // Extract the text from the Gemini response
      const responseText = data.candidates[0].content.parts[0].text;
      
      // Try to parse JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // If no JSON found, return structured data based on text
      return this.extractMealPlanFromText(responseText);
    } catch (error) {
      console.error('Error parsing API response:', error);
      return this.getFallbackMealPlan();
    }
  }

  // Extract meal plan from text if JSON parsing fails
  extractMealPlanFromText(text) {
    // This is a simplified extraction - you might need to enhance this
    // based on the actual response format from Gemini
    return {
      mealPlan: [
        {
          day: "Monday",
          meals: [
            {
              type: "breakfast",
              name: "Custom Breakfast",
              ingredients: [{name: "Oatmeal", quantity: "1 cup"}],
              instructions: ["Cook oatmeal with water or milk"],
              nutrition: {calories: 150, protein: 5, carbs: 27, fat: 3}
            }
          ]
        }
      ]
    };
  }

  // Fallback meal plan if API fails
  getFallbackMealPlan() {
    return {
      mealPlan: [
        {
          day: "Sample Day",
          meals: [
            {
              type: "breakfast",
              name: "Healthy Breakfast",
              ingredients: [{name: "Oatmeal", quantity: "1 cup"}, {name: "Banana", quantity: "1"}],
              instructions: ["Cook oatmeal", "Slice banana on top"],
              nutrition: {calories: 250, protein: 6, carbs: 50, fat: 4}
            },
            {
              type: "lunch",
              name: "Balanced Lunch",
              ingredients: [{name: "Chicken breast", quantity: "100g"}, {name: "Vegetables", quantity: "1 cup"}],
              instructions: ["Grill chicken", "Steam vegetables"],
              nutrition: {calories: 300, protein: 30, carbs: 10, fat: 15}
            },
            {
              type: "dinner",
              name: "Light Dinner",
              ingredients: [{name: "Salmon", quantity: "100g"}, {name: "Salad", quantity: "1 bowl"}],
              instructions: ["Bake salmon", "Mix salad greens"],
              nutrition: {calories: 350, protein: 25, carbs: 15, fat: 20}
            }
          ]
        }
      ]
    };
  }

  // Customize recipe based on modifications
  async customizeRecipe(baseRecipe, modifications) {
    const prompt = `Please modify the following recipe based on these modifications:

Base Recipe:
${JSON.stringify(baseRecipe)}

Modifications:
${modifications}

Please provide the updated recipe in the same JSON format.`;

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      return this.parseRecipeResponse(data);
    } catch (error) {
      console.error('Error customizing recipe:', error);
      return baseRecipe; // Return original recipe if customization fails
    }
  }

  // Parse recipe customization response
  parseRecipeResponse(data) {
    try {
      const responseText = data.candidates[0].content.parts[0].text;
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return null;
    } catch (error) {
      console.error('Error parsing recipe response:', error);
      return null;
    }
  }
}
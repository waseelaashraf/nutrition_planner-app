document.addEventListener('DOMContentLoaded', function() {
    // Initialize the API service with your Gemini API key
    // Replace 'YOUR_GEMINI_API_KEY' with your actual API key
    const apiService = new GeminiAIService('AIzaSyAWEhL0vty4ktpaMaR__tU0kYxbdME3NAc');
    
    // DOM Elements
    const profileForm = document.getElementById('profile-form');
    const loadingIndicator = document.getElementById('loading-indicator');
    const mealPlanDisplay = document.getElementById('meal-plan-display');
    const mealPlanContent = document.getElementById('meal-plan-content');
    const errorMessage = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');
    const closeErrorBtn = document.getElementById('close-error-btn');
    const generatePlanBtn = document.getElementById('generate-plan-btn');
    const savePlanBtn = document.getElementById('save-plan-btn');
    const customizePlanBtn = document.getElementById('customize-plan-btn');
    const newPlanBtn = document.getElementById('new-plan-btn');
    
    // Event Listeners
    profileForm.addEventListener('submit', handleFormSubmit);
    closeErrorBtn.addEventListener('click', hideErrorMessage);
    savePlanBtn.addEventListener('click', saveMealPlan);
    customizePlanBtn.addEventListener('click', customizeMealPlan);
    newPlanBtn.addEventListener('click', createNewPlan);
    
    // Handle form submission
    async function handleFormSubmit(e) {
        e.preventDefault();
        
        // Show loading indicator
        showLoadingIndicator();
        
        // Collect form data
        const formData = new FormData(profileForm);
        const userProfile = {
            age: formData.get('age'),
            gender: formData.get('gender'),
            dietaryRestrictions: formData.get('dietaryRestrictions'),
            healthGoals: formData.get('healthGoals'),
            foodPreferences: formData.get('foodPreferences'),
            allergies: formData.get('allergies')
        };
        
        try {
            // Generate meal plan using API
            const mealPlan = await apiService.generateMealPlan(userProfile);
            
            // Display the meal plan
            displayMealPlan(mealPlan);
        } catch (error) {
            // Show error message
            showError('Failed to generate meal plan. Please try again.');
            console.error('Error:', error);
        } finally {
            // Hide loading indicator
            hideLoadingIndicator();
        }
    }
    
    // Display meal plan in the UI
    function displayMealPlan(mealPlan) {
        // Clear previous content
        mealPlanContent.innerHTML = '';
        
        // Check if meal plan exists
        if (!mealPlan || !mealPlan.mealPlan || mealPlan.mealPlan.length === 0) {
            showError('No meal plan was generated. Please check your inputs and try again.');
            return;
        }
        
        // Create HTML for each day
        mealPlan.mealPlan.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'day-plan';
            
            const dayTitle = document.createElement('h3');
            dayTitle.textContent = day.day;
            dayElement.appendChild(dayTitle);
            
            // Create HTML for each meal
            day.meals.forEach(meal => {
                const mealElement = document.createElement('div');
                mealElement.className = 'meal';
                
                const mealTitle = document.createElement('h4');
                mealTitle.textContent = `${meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}: ${meal.name}`;
                mealElement.appendChild(mealTitle);
                
                // Ingredients
                const ingredientsElement = document.createElement('div');
                ingredientsElement.className = 'ingredients';
                ingredientsElement.innerHTML = '<strong>Ingredients:</strong>';
                
                const ingredientsList = document.createElement('ul');
                meal.ingredients.forEach(ingredient => {
                    const ingredientItem = document.createElement('li');
                    ingredientItem.textContent = `${ingredient.quantity} ${ingredient.name}`;
                    ingredientsList.appendChild(ingredientItem);
                });
                
                ingredientsElement.appendChild(ingredientsList);
                mealElement.appendChild(ingredientsElement);
                
                // Instructions
                const instructionsElement = document.createElement('div');
                instructionsElement.className = 'instructions';
                instructionsElement.innerHTML = '<strong>Instructions:</strong>';
                
                const instructionsList = document.createElement('ol');
                meal.instructions.forEach(instruction => {
                    const instructionItem = document.createElement('li');
                    instructionItem.textContent = instruction;
                    instructionsList.appendChild(instructionItem);
                });
                
                instructionsElement.appendChild(instructionsList);
                mealElement.appendChild(instructionsElement);
                
                // Nutrition
                const nutritionElement = document.createElement('div');
                nutritionElement.className = 'nutrition';
                nutritionElement.innerHTML = `<strong>Nutrition:</strong> Calories: ${meal.nutrition.calories}, Protein: ${meal.nutrition.protein}g, Carbs: ${meal.nutrition.carbs}g, Fat: ${meal.nutrition.fat}g`;
                mealElement.appendChild(nutritionElement);
                
                dayElement.appendChild(mealElement);
            });
            
            mealPlanContent.appendChild(dayElement);
        });
        
        // Show meal plan display
        mealPlanDisplay.classList.remove('hidden');
    }
    
    // Show loading indicator
    function showLoadingIndicator() {
        loadingIndicator.classList.remove('hidden');
        mealPlanDisplay.classList.add('hidden');
    }
    
    // Hide loading indicator
    function hideLoadingIndicator() {
        loadingIndicator.classList.add('hidden');
    }
    
    // Show error message
    function showError(message) {
        errorText.textContent = message;
        errorMessage.classList.remove('hidden');
    }
    
    // Hide error message
    function hideErrorMessage() {
        errorMessage.classList.add('hidden');
    }
    
    // Save meal plan (placeholder function)
    function saveMealPlan() {
        // In a real application, this would save the meal plan to a database or local storage
        alert('Meal plan saved successfully!');
    }
    
    // Customize meal plan (placeholder function)
    function customizeMealPlan() {
        // In a real application, this would open a customization interface
        alert('Customization feature coming soon!');
    }
    
    // Create new plan
    function createNewPlan() {
        // Reset form and hide meal plan
        profileForm.reset();
        mealPlanDisplay.classList.add('hidden');
        window.scrollTo(0, 0);
    }
});
// Basic UI Testing
function testUIComponents() {
    console.log('Testing UI Components...');
    
    // Test form elements
    const formElements = profileForm.querySelectorAll('input, select, button');
    console.log(`Found ${formElements.length} form elements`);
    
    // Test API service
    console.log('Testing API service...');
    const testProfile = {
        age: '30',
        gender: 'female',
        dietaryRestrictions: 'vegetarian',
        healthGoals: 'weight loss',
        foodPreferences: 'likes vegetables, dislikes spicy food',
        allergies: 'nuts'
    };
    
    // Test loading indicator
    console.log('Testing loading indicator...');
    showLoadingIndicator();
    setTimeout(hideLoadingIndicator, 2000);
    
    // Test error message
    console.log('Testing error message...');
    showError('This is a test error message');
    setTimeout(hideErrorMessage, 3000);
    
    console.log('UI testing complete');
}

// Run tests when the page loads (for development only)
// testUIComponents();
// Add input validation
function validateForm() {
    let isValid = true;
    
    // Simple validation example - check if age is provided and within reasonable range
    const ageInput = document.getElementById('age');
    if (ageInput.value && (ageInput.value < 1 || ageInput.value > 120)) {
        showError('Please enter a valid age between 1 and 120');
        isValid = false;
    }
    
    return isValid;
}

// Update the form submission handler to include validation
profileForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    // Rest of the form submission logic...
    showLoadingIndicator();
    
    const formData = new FormData(profileForm);
    const userProfile = {
        age: formData.get('age'),
        gender: formData.get('gender'),
        dietaryRestrictions: formData.get('dietaryRestrictions'),
        healthGoals: formData.get('healthGoals'),
        foodPreferences: formData.get('foodPreferences'),
        allergies: formData.get('allergies')
    };
    
    apiService.generateMealPlan(userProfile)
        .then(mealPlan => {
            displayMealPlan(mealPlan);
            hideLoadingIndicator();
        })
        .catch(error => {
            console.error('Error:', error);
            showError('Failed to generate meal plan. Please try again.');
            hideLoadingIndicator();
        });
});

// Add a feature to download the meal plan as JSON
function downloadMealPlan() {
    const mealPlanData = {
        generatedAt: new Date().toISOString(),
        mealPlan: currentMealPlan
    };
    
    const dataStr = JSON.stringify(mealPlanData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `meal-plan-${new Date().toISOString().slice(0,10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Add download button to the action buttons
const downloadBtn = document.createElement('button');
downloadBtn.textContent = 'Download Plan';
downloadBtn.className = 'btn-secondary';
downloadBtn.addEventListener('click', downloadMealPlan);
document.querySelector('.action-buttons').appendChild(downloadBtn);

// Store current meal plan for download functionality
let currentMealPlan = null;

// Update displayMealPlan to store the current meal plan
function displayMealPlan(mealPlan) {
    // Store the meal plan for download
    currentMealPlan = mealPlan;
    
    // Rest of the displayMealPlan function...
    // (existing code remains the same)
}

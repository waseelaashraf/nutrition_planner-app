// Dummy client data for testing
const dummyClients = [
    {
        id: "1",
        name: "Sarah Johnson",
        email: "sarah@example.com",
        age: "32",
        gender: "female",
        dietaryRestrictions: "vegetarian",
        healthGoals: "weight loss",
        foodPreferences: "likes vegetables, dislikes spicy food",
        allergies: "nuts",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: "2",
        name: "Michael Chen",
        email: "michael@example.com",
        age: "45",
        gender: "male",
        dietaryRestrictions: "gluten-free",
        healthGoals: "muscle gain",
        foodPreferences: "likes chicken, fish",
        allergies: "shellfish",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: "3",
        name: "Emma Rodriguez",
        email: "emma@example.com",
        age: "28",
        gender: "female",
        dietaryRestrictions: "dairy-free",
        healthGoals: "maintain weight",
        foodPreferences: "likes fruits, dislikes red meat",
        allergies: "dairy, eggs",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

// Function to load dummy data if no clients exist
function loadDummyDataIfNeeded() {
    const savedClients = localStorage.getItem('nutritionPlannerClients');
    if (!savedClients || JSON.parse(savedClients).length === 0) {
        localStorage.setItem('nutritionPlannerClients', JSON.stringify(dummyClients));
        return dummyClients;
    }
    return JSON.parse(savedClients);
}
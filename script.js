document.addEventListener('DOMContentLoaded', () => {
    // 1. Get DOM elements
    const weatherSelect = document.getElementById('weather');
    const eventSelect = document.getElementById('event');
    const moodSelect = document.getElementById('mood');
    const wardrobeIntegrationCheckbox = document.getElementById('wardrobeIntegration');
    const getSuggestionBtn = document.getElementById('getSuggestionBtn');
    const outfitSuggestionDiv = document.getElementById('outfitSuggestion');
    const outfitImage = document.getElementById('outfitImage');
    const outfitDescription = document.getElementById('outfitDescription');
    const tryAgainBtn = document.getElementById('tryAgainBtn');
    const saveBtn = document.getElementById('saveBtn');
    const messageBox = document.getElementById('messageBox');
    const messageText = document.getElementById('messageText');
    const closeMessageBtn = document.getElementById('closeMessageBtn');


    // Wardrobe inventory placeholder (can be expanded)
    const wardrobe = {
        hasCoat: true,
        hasBoots: true,
        hasUmbrella: true,
        hasFormalShirt: true,
        hasTShirt: true,
        hasShorts: true,
        hasJeans: true,
        hasDress: true,
        hasSweater: true,
        hasScarf: true,
        hasCasualShoes: true,
        hasSandals: true,
        hasRaincoat: true
    };


    // Outfit rules based on the flowchart logic and samples
    // Rules are ordered from most specific to more general.
    // The first matching rule will be applied.
    const outfitRules = [
        // Specific combinations
        { weather: "cold", event: "interview", mood: "energetic", outfit: "A sharp, warm suit with a stylish overcoat, complemented by professional boots. You'll exude confidence and professionalism.", image: "https://placehold.co/300x300/a0a0a0/ffffff?text=Formal+Suit+Coat" },
        { weather: "cold", event: "interview", mood: "neutral", outfit: "A sharp, warm suit with a stylish overcoat, complemented by professional boots. You'll exude confidence and professionalism.", image: "https://placehold.co/300x300/a0a0a0/ffffff?text=Formal+Suit+Coat" },
        { weather: "hot", event: "party", mood: "energetic", outfit: "A vibrant, light t-shirt with comfortable shorts and trendy sandals. Perfect for dancing the night away!", image: "https://placehold.co/300x300/ff6600/ffffff?text=Bright+T-shirt+Shorts" },
        { weather: "rainy", event: "school", outfit: "A cozy, water-resistant hoodie paired with sturdy boots and comfortable jeans. Don't forget your umbrella!", image: "https://placehold.co/300x300/5a67d8/ffffff?text=Hoodie+Boots" },
        { weather: "rainy", event: "home", outfit: "Comfortable sweatpants and a soft long-sleeve shirt. Perfect for a cozy day in, watching the rain.", image: "https://placehold.co/300x300/81e6d9/333333?text=Comfy+Homewear" },
        { weather: "sunny", event: "date", mood: "sexy", outfit: "A elegant summer dress or a chic skirt and top, with stylish sandals. Radiate charm and confidence!", image: "https://placehold.co/300x300/d53f8c/ffffff?text=Elegant+Summer+Outfit" },
        { weather: "hot", event: "date", mood: "sexy", outfit: "A elegant summer dress or a chic skirt and top, with stylish sandals. Radiate charm and confidence!", image: "https://placehold.co/300x300/d53f8c/ffffff?text=Elegant+Summer+Outfit" },
        { weather: "cold", event: "date", mood: "sexy", outfit: "A stylish, warm dress or a smart blouse with a skirt/trousers and knee-high boots. Add a fashionable coat for warmth and allure.", image: "https://placehold.co/300x300/6b46c1/ffffff?text=Chic+Winter+Date" },


        // Mood-based rules (more general)
        { mood: "sad", outfit: "Soft, oversized hoodie or sweater with super cozy sweatpants or fluffy socks. Comfort is key to lifting spirits!", image: "https://placehold.co/300x300/f6ad55/ffffff?text=Soft+Cozy+Clothes" },
        { mood: "energetic", outfit: "Lightweight, breathable athletic wear, like a bright t-shirt and track pants/shorts. Get ready to move!", image: "https://placehold.co/300x300/48bb78/ffffff?text=Athletic+Wear" },
        { mood: "tired", outfit: "Your comfiest oversized tee and softest lounge pants. Prioritize comfort and relaxation.", image: "https://placehold.co/300x300/a0aec0/ffffff?text=Ultra+Comfy+Loungewear" },
        { mood: "sexy", outfit: "Something that makes you feel confident and alluring, like a fitted dress or a stylish top with sleek trousers. Embrace your inner glow!", image: "https://placehold.co/300x300/ed64a6/ffffff?text=Confident+Alluring+Outfit" },
        { mood: "neutral", outfit: "Classic jeans and a versatile t-shirt or a simple button-down shirt. Comfortable and ready for anything.", image: "https://placehold.co/300x300/63b3ed/ffffff?text=Casual+Everyday+Wear" },


        // Weather-based rules (most general)
        { weather: "sunny", outfit: "Light and airy clothes like a breathable t-shirt or a sundress, with shorts or a light skirt. Don't forget sunglasses!", image: "https://placehold.co/300x300/68d391/ffffff?text=Light+Summer+Wear" },
        { weather: "rainy", outfit: "Water-resistant jacket, jeans or waterproof pants, and rain boots. An umbrella is a must!", image: "https://placehold.co/300x300/4299e1/ffffff?text=Rainy+Weather+Gear" },
        { weather: "cold", outfit: "Warm layers! Start with thermal wear, add a thick sweater, a warm coat, and maybe a scarf and gloves.", image: "https://placehold.co/300x300/a0aec0/ffffff?text=Layered+Warm+Outfit" },
        { weather: "hot", outfit: "Minimal, breathable clothing like shorts, tank tops, or light dresses. Stay cool and hydrated!", image: "https://placehold.co/300x300/f6e05e/333333?text=Cool+Summer+Clothes" },


        // Default fallback (should ideally not be reached if inputs are valid)
        { outfit: "A comfortable and versatile outfit, suitable for various conditions.", image: "https://placehold.co/300x300/cccccc/000000?text=Default+Outfit" }
    ];


    // Function to show a message in the message box
    function showMessage(msg, type = 'warning') {
        messageText.textContent = msg;
        messageBox.classList.remove('hidden');
        // Optional: Change styling based on message type (e.g., 'error', 'success', 'info')
        if (type === 'error') {
            messageBox.classList.remove('bg-yellow-100', 'border-yellow-400', 'text-yellow-700');
            messageBox.classList.add('bg-red-100', 'border-red-400', 'text-red-700');
        } else { // default to warning
            messageBox.classList.remove('bg-red-100', 'border-red-400', 'text-red-700');
            messageBox.classList.add('bg-yellow-100', 'border-yellow-400', 'text-yellow-700');
        }
    }


    // Function to hide the message box
    function hideMessage() {
        messageBox.classList.add('hidden');
    }


    // Function to generate outfit suggestion
    function generateOutfit() {
        hideMessage(); // Hide any previous messages


        const weather = weatherSelect.value;
        const event = eventSelect.value;
        const mood = moodSelect.value;
        const useWardrobe = wardrobeIntegrationCheckbox.checked;


        // 2. If inputs are missing → show an error message
        if (!weather || !event || !mood) {
            showMessage('Please select all three options: Weather, Event, and Mood.');
            outfitSuggestionDiv.classList.add('hidden');
            return;
        }


        let suggestedOutfit = null;
        let additionalNotes = [];


        // System analyzes the combination using IF-THEN logic
        for (const rule of outfitRules) {
            let match = true;
            // Check weather condition
            if (rule.weather && rule.weather !== weather) {
                match = false;
            }
            // Check event condition
            if (rule.event && rule.event !== event) {
                match = false;
            }
            // Check mood condition
            // For mood, a general mood rule can still apply if a more specific rule doesn't cover it.
            // But if a rule explicitly states a mood, it must match.
            if (rule.mood && rule.mood !== mood) {
                match = false;
            }


            if (match) {
                suggestedOutfit = rule;
                break; // Found the most specific matching rule, exit loop
            }
        }


        // Fallback if no specific rule matches (should be covered by the last default rule)
        if (!suggestedOutfit) {
            suggestedOutfit = outfitRules[outfitRules.length - 1]; // Use the very last default rule
        }


        // 3. If wardrobe integration is activated → use those data points
        if (useWardrobe) {
            // Refine suggestion based on wardrobe data
            if (weather === "cold" && !wardrobe.hasCoat) {
                additionalNotes.push("It's cold, and you seem to be missing a coat in your wardrobe. Consider layering up more!");
            }
            if (weather === "rainy" && !wardrobe.hasUmbrella) {
                additionalNotes.push("It's rainy, and you might be missing an umbrella. Don't forget one!");
            }
            if (event === "interview" && !wardrobe.hasFormalShirt) {
                 additionalNotes.push("For an interview, a formal shirt is highly recommended. You might want to consider acquiring one.");
            }
            if ((weather === "hot" || weather === "sunny") && event === "party" && !wardrobe.hasTShirt && !wardrobe.hasShorts) {
                additionalNotes.push("For a hot party, light t-shirts and shorts are great. Check if you have suitable options.");
            }
            if ((weather === "rainy" || weather === "cold") && event === "school" && !wardrobe.hasBoots) {
                additionalNotes.push("For school on a rainy/cold day, boots would be ideal for comfort and protection.");
            }
            // Add more wardrobe-based refinements as needed
        }


        // 4. Visual of the outfit + explanation is shown
        outfitImage.src = suggestedOutfit.image;
        outfitImage.alt = `Suggested outfit for ${weather}, ${event}, ${mood}.`;
        let description = suggestedOutfit.outfit;
        if (additionalNotes.length > 0) {
            description += "<br><br><strong>Wardrobe Notes:</strong> " + additionalNotes.join(" ");
        }
        outfitDescription.innerHTML = description;


        outfitSuggestionDiv.classList.remove('hidden'); // Show the suggestion section
    }


    // Event Listeners
    getSuggestionBtn.addEventListener('click', generateOutfit);
    closeMessageBtn.addEventListener('click', hideMessage);


    // 5. User can click “Try Again” or “Save”
    tryAgainBtn.addEventListener('click', () => {
        // Reset inputs
        weatherSelect.value = "";
        eventSelect.value = "";
        moodSelect.value = "";
        wardrobeIntegrationCheckbox.checked = false;
        // Hide suggestion and message box
        outfitSuggestionDiv.classList.add('hidden');
        hideMessage();
        // Optionally, re-focus on the first input
        weatherSelect.focus();
    });


    saveBtn.addEventListener('click', () => {
        // Placeholder for save functionality
        // In a real app, this would save to local storage, a database, etc.
        showMessage('Outfit saved! (This is a placeholder action in this demo.)', 'info');
    });


    // Initial state: hide suggestion section
    outfitSuggestionDiv.classList.add('hidden');
    messageBox.classList.add('hidden');
});





// Arrays for each category
const fandoms = [
    "Star Wars", "Harry Potter", "Jujutsu Kaisen", "Marvel", "DC Comics",
    "The Lord of the Rings", "Stranger Things", "The Witcher", "Naruto", "One Piece"
];
const tags = [
    "Angst", "Fluff", "Hurt/Comfort", "Romance", "Adventure", "Family", 
    "Friendship", "Alternate Universe", "Canon Compliant", "LGBTQ+"
];
const relationships = [
    "Hermione/Draco", "Megumi/Yuji", "Leia/Luke", "Tony/Pepper", "Batman/Joker",
    "Harry/Ginny", "Ron/Hermione", "Steve/Peggy", "Naruto/Hinata", "Luffy/Nami"
];
const characters = [
    "Yuji Itadori", "Leia Organa", "Harry Potter", "Anakin Skywalker", 
    "Wanda Maximoff", "Hermione Granger", "Tony Stark", "Naruto Uzumaki", 
    "Frodo Baggins", "Geralt of Rivia"
];

// Function to filter and show suggestions based on user input
function filterSuggestions(input, suggestionsArray, suggestionsContainer) {
    const query = input.value.trim().split(",").pop().trim().toLowerCase();
    suggestionsContainer.innerHTML = ""; // Clear previous suggestions

    if (query === "") return; // No suggestions if input is empty

    // Filter array items that start with the user's query
    const filteredItems = suggestionsArray.filter(item => item.toLowerCase().startsWith(query));

    filteredItems.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("suggestion");
        div.textContent = item;
        suggestionsContainer.appendChild(div);
    });
}

// Function to add click event listeners to suggestion items
function addSuggestionEventListeners(input, suggestionsContainer) {
    suggestionsContainer.addEventListener("click", (event) => {
        if (event.target && event.target.matches("div")) {
            const selectedItem = event.target.textContent.trim();

            // Get the current input value and split into entries
            let entries = input.value.split(",").map(entry => entry.trim());
            
            // Replace the last entry (partial input) with the selected item
            entries[entries.length - 1] = selectedItem;

            // Update the input field with the new entries
            input.value = entries.join(", ") + ", ";

            // Clear the suggestions
            suggestionsContainer.innerHTML = "";

            // Focus back on the input for further typing
            input.focus();
        }
    });
}

// Main function to handle the autocomplete feature
function setupAutocomplete(inputId, suggestionsContainerId, suggestionsArray) {
    const input = document.getElementById(inputId);
    const suggestionsContainer = document.getElementById(suggestionsContainerId);

    // When the user types in the input box, filter array items and show suggestions
    input.addEventListener("input", () => {
        filterSuggestions(input, suggestionsArray, suggestionsContainer);
    });

    // Add click event listener to suggestions
    addSuggestionEventListeners(input, suggestionsContainer);

    // Close suggestions when clicking outside
    document.addEventListener("click", (event) => {
        if (!suggestionsContainer.contains(event.target) && event.target !== input) {
            suggestionsContainer.innerHTML = "";
        }
    });
}

// Initialize the autocomplete functionality for all categories on page load
document.addEventListener("DOMContentLoaded", () => {
    setupAutocomplete("fandomInput", "fandomSuggestions", fandoms);
    setupAutocomplete("tagsInput", "tagsSuggestions", tags);
    setupAutocomplete("relationshipsInput", "relationshipsSuggestions", relationships);
    setupAutocomplete("charactersInput", "charactersSuggestions", characters);
});

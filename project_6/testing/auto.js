// List of common fanfic tags
const fanficTags = [
    "Angst", "Fluff", "Hurt/Comfort", "Romance", "Adventure", "Family", "Friendship",
    "Slow Burn", "Alternate Universe", "Canon Compliant", "LGBTQ+", "Drama", "Slice of Life",
    "Fantasy", "Action", "Angsty Fluff", "Healing", "Tear Jerker", "Humor", "Mystery", 
    "Supernatural", "Alternate Universe - Modern", "Genderbent", "WIP", "One-Shot", "Smut", 
    "Angst with a Happy Ending", "Character Death", "MPreg", "Fluff and Angst", "Romantic Comedy", 
    "Crossovers", "Time Travel", "Fix-It", "Sassy Characters", "Tragic", "Mystical Realism",
    "Magical Realism", "Shapeshifters", "Villain Redemption", "Enemies to Lovers", "Fake Dating",
    "College AU", "High School AU", "Historical AU", "Pirate AU", "Superhero AU", "Bodyguard AU"
];

// Function to filter and show the suggestions based on user input
function filterTags(input, suggestionsContainer) {
    const query = input.value.trim().split(",").pop().trim().toLowerCase();
    suggestionsContainer.innerHTML = ""; // Clear previous suggestions

    if (query === "") return; // No suggestions if input is empty

    // Filter tags that start with the user's query
    const filteredTags = fanficTags.filter(tag => tag.toLowerCase().startsWith(query));

    filteredTags.forEach(tag => {
        const div = document.createElement("div");
        div.classList.add("suggestion");
        div.textContent = tag;
        suggestionsContainer.appendChild(div);
    });
}

// Function to add click event listeners to suggestion items
function addSuggestionEventListeners(input, suggestionsContainer) {
    suggestionsContainer.addEventListener("click", (event) => {
        if (event.target && event.target.matches("div")) {
            const selectedTag = event.target.textContent.trim();

            // Get the current input value and split into tags
            let tags = input.value.split(",").map(tag => tag.trim());
            
            // Replace the last tag (partial input) with the selected tag
            tags[tags.length - 1] = selectedTag;

            // Update the input field with the new tags
            input.value = tags.join(", ") + ", ";

            // Clear the suggestions
            suggestionsContainer.innerHTML = "";

            // Focus back on the input for further typing
            input.focus();
        }
    });
}

// Main function to handle the autocomplete feature
function setupAutocomplete(inputId, suggestionsContainerId) {
    const input = document.getElementById(inputId);
    const suggestionsContainer = document.getElementById(suggestionsContainerId);

    // When the user types in the input box, filter tags and show suggestions
    input.addEventListener("input", () => {
        filterTags(input, suggestionsContainer);
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

// Initialize the autocomplete functionality on page load
document.addEventListener("DOMContentLoaded", () => {
    setupAutocomplete("tagsInput", "suggestionsContainer");
});
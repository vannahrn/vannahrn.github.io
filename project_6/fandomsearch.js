const fandoms = [
    "Star Wars", "Harry Potter", "Jujutsu Kaisen", "Marvel", "DC Comics",
    "The Lord of the Rings", "Stranger Things", "The Witcher", "Naruto", "One Piece",
    "Attack on Titan", "My Hero Academia", "Game of Thrones", "The Mandalorian", "Doctor Who",
    "Supernatural", "Sherlock", "Breaking Bad", "The Umbrella Academy", "Demon Slayer",
    "Fullmetal Alchemist", "Avatar: The Last Airbender", "The Legend of Korra", "Final Fantasy", "Kingdom Hearts",
    "The Hunger Games", "Percy Jackson", "Twilight", "The Walking Dead", "Shadow and Bone",
    "Cyberpunk 2077", "Resident Evil", "The Last of Us", "Elden Ring", "Undertale",
    "Overwatch", "Hades", "Stardew Valley", "Animal Crossing", "League of Legends",
    "The Sims", "Dragon Age", "Mass Effect", "Skyrim", "Persona 5",
    "Fate/Stay Night", "Chainsaw Man", "Tokyo Revengers", "Bleach", "Hunter x Hunter"

];

function filterSuggestions(input, suggestionsArray, suggestionsContainer) {
    const query = input.value.trim().toLowerCase(); // Removed multi-tag logic
    suggestionsContainer.innerHTML = "";

    if (query === "") return;

    const filteredItems = suggestionsArray.filter(item => item.toLowerCase().startsWith(query));

    filteredItems.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("suggestion");
        div.textContent = item;
        suggestionsContainer.appendChild(div);
    });
}

function addSuggestionEventListeners(input, suggestionsContainer) {
    suggestionsContainer.addEventListener("click", (event) => {
        if (event.target && event.target.matches("div")) {
            const selectedItem = event.target.textContent.trim();

            // Directly replace the input value
            input.value = selectedItem;

            suggestionsContainer.innerHTML = "";

            input.focus();
        }
    });
}

function setupAutocomplete(inputId, suggestionsContainerId, suggestionsArray) {
    const input = document.getElementById(inputId);
    const suggestionsContainer = document.getElementById(suggestionsContainerId);

    input.addEventListener("input", () => {
        filterSuggestions(input, suggestionsArray, suggestionsContainer);
    });

    addSuggestionEventListeners(input, suggestionsContainer);

    document.addEventListener("click", (event) => {
        if (!suggestionsContainer.contains(event.target) && event.target !== input) {
            suggestionsContainer.innerHTML = "";
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    setupAutocomplete("fandomInput", "fandomSuggestions", fandoms);
});

const searchButton = document.createElement("button");
searchButton.textContent = "Search";
searchButton.id = "searchButton";
document.body.appendChild(searchButton);

searchButton.addEventListener("click", () => {
    alert("search clikcked");
});

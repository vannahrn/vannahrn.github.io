//dummy fake fanfics and their metadata

const fanfics = [
    {
        title: "The Hero's Journey",
        fandom: "Marvel",
        tags: "Adventure, Action",
        rating: "Teen",
        summary: "An exciting adventure following a young hero.",
        wordCount: 5000
    },
    {
        title: "Love in the Stars",
        fandom: "Star Wars",
        tags: "Romance, Drama",
        rating: "Mature",
        summary: "A tale of forbidden love in the galaxy.",
        wordCount: 7000
    },
    {
        title: "Mystic Worlds",
        fandom: "Harry Potter",
        tags: "Fantasy, Mystery",
        rating: "General",
        summary: "Exploring hidden secrets of a magical world.",
        wordCount: 8000
    },
    // Add more objects as needed
];

//when search button is clicked, script reads search input
document.getElementById("search-button").addEventListener("click", function() {
    const query = document.getElementById("search-input").value.toLowerCase();
    const results = searchFanfics(query);
    displayResults(results);
});

//converts everything to lowercase for better searching
function searchFanfics(query) {
    return fanfics.filter(fanfic =>
        fanfic.title.toLowerCase().includes(query) ||
        fanfic.fandom.toLowerCase().includes(query) ||
        fanfic.tags.toLowerCase().includes(query) ||
        fanfic.rating.toLowerCase().includes(query)
    );
}

function displayResults(results) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = ""; // clear previous results


    //if no results are found
    if (results.length === 0) {
        resultsDiv.innerHTML = "<p>No fanfics found.</p>";
        return;
    }

    //display results if it is found that metadata matches
    results.forEach(fanfic => {
        const result = `
            <div>
                <h3>${fanfic.title}</h3>
                <p><strong>Fandom:</strong> ${fanfic.fandom}</p>
                <p><strong>Tags:</strong> ${fanfic.tags}</p>
                <p><strong>Rating:</strong> ${fanfic.rating}</p>
                <p><strong>Word Count:</strong> ${fanfic.wordCount}</p>
                <p><strong>Summary:</strong> ${fanfic.summary}</p>
            </div>
        `;
        resultsDiv.innerHTML += result;
    });
}

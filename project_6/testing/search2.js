async function loadFanficFiles() {
    const filenames = ['fanfic1.txt', 'fanfic2.txt', 'fanfic3.txt', 'fanfic4.txt']; // List of .txt files
    const fanfics = [];

    for (const filename of filenames) {
        const response = await fetch(`fanfics/${filename}`);
        const text = await response.text();

        // Parse the metadata and content of the fanfic
        const fanfic = parseMetadata(text);
        fanfics.push(fanfic);
    }

    return fanfics;
}

function parseMetadata(fileContent) {
    const lines = fileContent.split("\n");
    const metadata = {};

    lines.forEach(line => {
        const [key, ...value] = line.split(":");
        if (key && value) {
            metadata[key.trim().toLowerCase()] = value.join(":").trim();
        }
    });

    // Converts relationships, tags, and warnings into arrays
    if (metadata.category) {
        metadata.category = metadata.category.split(",").map(r => r.trim());
    }
    if (metadata.tags) {
        metadata.tags = metadata.tags.split(",").map(tag => tag.trim().toLowerCase());
    }
    if (metadata.warnings) {
        metadata.warnings = metadata.warnings.split(",").map(warning => warning.trim().toLowerCase());
    }

    // Convert word count to size categories
    if (metadata['word count']) {
        const wordCount = parseInt(metadata['word count'], 10);
        if (wordCount <= 1000) {
            metadata.size = "Blurb";
        } else if (wordCount <= 10000) {
            metadata.size = "One Shot";
        } else if (wordCount <= 50000) {
            metadata.size = "Mini Series";
        } else {
            metadata.size = "Full Series";
        }
    }

    return metadata;
}

// Search button functionality
document.getElementById("searchButton").addEventListener("click", async () => {
    const fanfics = await loadFanficFiles(); // Load in fanfic data from .txt files

    const title = document.getElementById("title").value.toLowerCase();
    const author = document.getElementById("author").value.toLowerCase();
    const rating = document.getElementById("rating").value;
    const language = document.getElementById("language").value;
    const category = Array.from(document.querySelectorAll("input[name='category']:checked"))
                               .map(checkbox => checkbox.value);
    const completion = document.querySelector("input[name='completion']:checked").value; // Get the selected radio value
    const crossover = document.querySelector("input[name='crossover']:checked").value; // Get the selected radio value
    const chapters = document.querySelector("input[name='chapters']:checked").value; // Get the selected radio value
    const wordCountFilter = document.querySelector("input[name='wordCount']:checked").value; // Get word count category
    const warnings = Array.from(document.querySelectorAll("input[name='warnings']:checked"))
                               .map(checkbox => checkbox.value.toLowerCase()); // Get selected warnings
    const fandom = document.getElementById("fandom").value.toLowerCase();
    const tagsInput = document.getElementById("tags").value.toLowerCase(); // Get tags input
    const tags = tagsInput ? tagsInput.split(",").map(tag => tag.trim()) : []; // Convert to array

    const results = fanfics.filter(fanfic => {
        let matchesWordCount = true;

        // Check word count category
        if (wordCountFilter !== "all") {
            matchesWordCount = fanfic.size.toLowerCase() === wordCountFilter;
        }

        // Check warnings
        const matchesWarnings = warnings.length === 0 || warnings.every(warning => fanfic.warnings.includes(warning));

        // Check tags
        const matchesTags = tags.length === 0 || tags.every(tag => fanfic.tags.includes(tag));

        return (
            (!title || fanfic.title.toLowerCase().includes(title)) &&
            (!author || fanfic.author.toLowerCase().includes(author)) &&
            (!rating || fanfic.rating === rating) &&
            (!language || fanfic.language === language) &&
            (category.length === 0 || category.some(r => fanfic.category.includes(r))) &&
            (completion === "all" || fanfic.status.toLowerCase() === completion) &&
            (crossover === "all" || fanfic.crossover.toLowerCase() === crossover) &&
            (chapters === "all" || fanfic.chapters.toLowerCase() === chapters) &&
            matchesWordCount && // Include word count match
            matchesWarnings && // Include warnings match
            matchesTags && // Include tags match
            (!fandom || fanfic.fandom.toLowerCase().includes(fandom))
        );
    });

    displayResults(results);
});

function displayResults(results) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = ""; // Clear previous results

    if (results.length === 0) {
        resultsDiv.textContent = "No results found.";
        return;
    }

    results.forEach(fanfic => {
        const fanficDiv = document.createElement("div");
        fanficDiv.innerHTML = `
            <h3>${fanfic.title}</h3>
            <p><b>Author:</b> ${fanfic.author}</p>
            <p><b>Rating:</b> ${fanfic.rating}</p>
            <p><b>Language:</b> ${fanfic.language}</p>
            <p><b>Category:</b> ${fanfic.category.join(", ")}</p>
            <p><b>Status:</b> ${fanfic.status}</p>
            <p><b>Crossovers:</b> ${fanfic.crossover}</p>
            <p><b>Chapters:</b> ${fanfic.chapters}</p>
            <p><b>Word Count:</b> ${fanfic.size} (${Number(fanfic['word count']).toLocaleString()} words)</p>
            <p><b>Fandom:</b> ${fanfic.fandom}</p>
            <p><b>Warnings:</b> ${fanfic.warnings.join(", ")}</p>
            <p><b>Tags:</b> ${fanfic.tags.join(", ")}</p>
        `;
        resultsDiv.appendChild(fanficDiv);
    });
}

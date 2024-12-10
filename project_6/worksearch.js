async function loadFanficFiles() {
    const filenames = ['fanfic1.txt', 'fanfic2.txt', 'fanfic3.txt', 'fanfic4.txt'];
    const fanfics = [];

    for (const filename of filenames) {
        const response = await fetch(`fanfics/${filename}`);
        const text = await response.text();

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

    if (metadata.category) {
        metadata.category = metadata.category.split(",").map(r => r.trim());
    }
    if (metadata.tags) {
        metadata.tags = metadata.tags.split(",").map(tag => tag.trim().toLowerCase());
    }
    if (metadata.warnings) {
        metadata.warnings = metadata.warnings.split(",").map(warning => warning.trim().toLowerCase());
    }

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
    const fanfics = await loadFanficFiles();

    const title = document.getElementById("title").value.toLowerCase();
    const author = document.getElementById("author").value.toLowerCase();
    const rating = document.getElementById("rating").value;
    const language = document.getElementById("language").value;
    const category = Array.from(document.querySelectorAll("input[name='category']:checked"))
                               .map(checkbox => checkbox.value);
    const completion = document.querySelector("input[name='completion']:checked").value; 
    const crossover = document.querySelector("input[name='crossover']:checked").value; 
    const chapters = document.querySelector("input[name='chapters']:checked").value; 
    const wordCountFilter = document.querySelector("input[name='wordCount']:checked").value;
    const warnings = Array.from(document.querySelectorAll("input[name='warnings']:checked"))
                               .map(checkbox => checkbox.value.toLowerCase());
    const fandom = document.getElementById("fandom").value.toLowerCase();
    const tagsInput = document.getElementById("tags").value.toLowerCase();
    const tags = tagsInput ? tagsInput.split(",").map(tag => tag.trim()) : []; 

    const results = fanfics.filter(fanfic => {
        let matchesWordCount = true;

        if (wordCountFilter !== "all") {
            matchesWordCount = fanfic.size.toLowerCase() === wordCountFilter;
        }

        const matchesWarnings = warnings.length === 0 || warnings.every(warning => fanfic.warnings.includes(warning));

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
            matchesWordCount && 
            matchesWarnings && 
            matchesTags &&
            (!fandom || fanfic.fandom.toLowerCase().includes(fandom))
        );
    });

    displayResults(results);
});

function displayResults(results) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    if (results.length === 0) {
        resultsDiv.textContent = "No results found.";
        return;
    }

    results.forEach(fanfic => {
        const fanficDiv = document.createElement("div");
        fanficDiv.classList.add("fanfic");
        
        fanficDiv.innerHTML = `
            <h3>${fanfic.title}</h3>
            <p><b>${fanfic.author}</b> | ${fanfic.rating} | ${fanfic.language}</p>
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

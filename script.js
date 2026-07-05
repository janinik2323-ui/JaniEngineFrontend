// MAIN SEARCH FUNCTION
function startSearch() {
    const q = document.getElementById("searchInput").value.trim();
    if (!q) return;

    // hide search UI
    document.getElementById("searchInput").style.opacity = "0";
    document.querySelector(".tabs").style.opacity = "0";
    document.getElementById("searchBtn").style.opacity = "0";

    // show loading
    const loading = document.getElementById("loadingScreen");
    loading.style.display = "flex";

    // fetch results from Render backend
    fetch("https://janienginebackend-1.onrender.com/api/search?q=" + encodeURIComponent(q))
        .then(res => res.json())
        .then(data => {
            setTimeout(() => {
                loading.style.display = "none";
                showResults(data);
                animateLogo();
            }, 1500);
        })
        .catch(err => {
            console.error("Fetch error:", err);
            loading.style.display = "none";
            document.getElementById("results").innerHTML = "<p>Error loading results.</p>";
        });
}

// SHOW RESULTS
function showResults(data) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.style.display = "block";
    resultsDiv.innerHTML = "";

    if (!data || data.length === 0) {
        resultsDiv.innerHTML = "<p>No results found.</p>";
        return;
    }

    data.forEach(item => {
        const div = document.createElement("div");
        div.innerHTML = `
            <h2>${item.title}</h2>
            <p>${item.snippet?.substring(0, 200) || ""}...</p>
            <a href="${item.url}" target="_blank">${item.url}</a>
            <hr>
        `;
        resultsDiv.appendChild(div);
    });
}

// LOGO ANIMATION
function animateLogo() {
    const title = document.getElementById("janiTitle");

    setTimeout(() => {
        title.classList.add("small");
    }, 1000);
}

// CLICK ON LOGO TO RESET
document.getElementById("janiTitle").addEventListener("click", () => {
    document.getElementById("janiTitle").classList.remove("small");
    document.getElementById("results").style.display = "none";

    document.getElementById("searchInput").style.opacity = "1";
    document.querySelector(".tabs").style.opacity = "1";
    document.getElementById("searchBtn").style.opacity = "1";

    document.getElementById("homeScreen").style.display = "block";
});

// THEME TOGGLE
document.getElementById("themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

// SEARCH BUTTON + ENTER
document.getElementById("searchBtn").addEventListener("click", startSearch);
document.getElementById("searchInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") startSearch();
});

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
                renderResults(data);   // NOVO
                animateLogo();
            }, 1500);
        })
        .catch(err => {
            console.error("Fetch error:", err);
            loading.style.display = "none";
            document.getElementById("results").innerHTML = "<p>Error loading results.</p>";
        });
}



// ⭐⭐⭐ NOVO — FULL RESULTS RENDERER (WEB + IMAGES + VIDEOS) ⭐⭐⭐
function renderResults(results) {
    const webDiv = document.getElementById("webResults");
    const imgDiv = document.getElementById("imagesSection");
    const vidDiv = document.getElementById("videosSection");

    const sectionButtons = document.getElementById("section-buttons");
    const imagesBtn = document.getElementById("imagesBtn");
    const videosBtn = document.getElementById("videosBtn");

    webDiv.innerHTML = "";
    imgDiv.innerHTML = "";
    vidDiv.innerHTML = "";

    let hasImages = false;
    let hasVideos = false;

    results.forEach(r => {
        // WEB RESULTS
        webDiv.innerHTML += `
            <div class="web-item">
                <img src="${r.favicon || ""}" class="favicon" />
                <div>
                    <a href="${r.url}" target="_blank" class="title">${r.title}</a>
                    <p>${r.content?.slice(0, 200)}...</p>
                </div>
            </div>
        `;

        // IMAGES
        if (r.images && r.images.length > 0) {
            hasImages = true;
            r.images.forEach(img => {
                imgDiv.innerHTML += `
                    <div class="image-box">
                        <img src="${img}" onclick="openFullscreen('${img}')">
                        <a class="download-btn" href="${img}" download>Download</a>
                    </div>
                `;
            });
        }

        // VIDEOS
        if (r.youtube && r.youtube.thumbnail) {
            hasVideos = true;
            vidDiv.innerHTML += `
                <div class="video-box">
                    <img src="${r.youtube.thumbnail}" class="video-thumb">
                    <h3>${r.youtube.title}</h3>
                    <p>${r.youtube.channel}</p>
                    <a href="${r.url}" target="_blank" class="play-btn">▶ Play</a>
                </div>
            `;
        }
    });

    // SHOW BUTTONS ONLY IF CONTENT EXISTS
    sectionButtons.style.display = (hasImages || hasVideos) ? "flex" : "none";
    imagesBtn.style.display = hasImages ? "inline-block" : "none";
    videosBtn.style.display = hasVideos ? "inline-block" : "none";

    // SCROLL BUTTONS
    imagesBtn.onclick = () => document.getElementById("imagesTitle").scrollIntoView({ behavior: "smooth" });
    videosBtn.onclick = () => document.getElementById("videosTitle").scrollIntoView({ behavior: "smooth" });

    // SHOW TITLES ONLY IF CONTENT EXISTS
    document.getElementById("imagesTitle").style.display = hasImages ? "block" : "none";
    document.getElementById("videosTitle").style.display = hasVideos ? "block" : "none";
}



// ⭐⭐⭐ FULLSCREEN IMAGE ⭐⭐⭐
function openFullscreen(img) {
    document.getElementById("fullscreenModal").style.display = "flex";
    document.getElementById("fullscreenImage").src = img;
}

document.getElementById("fullscreenModal").onclick = () => {
    document.getElementById("fullscreenModal").style.display = "none";
};



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

    // hide sections
    document.getElementById("webResults").innerHTML = "";
    document.getElementById("imagesSection").innerHTML = "";
    document.getElementById("videosSection").innerHTML = "";

    document.getElementById("section-buttons").style.display = "none";
    document.getElementById("imagesTitle").style.display = "none";
    document.getElementById("videosTitle").style.display = "none";

    // show home screen
    document.getElementById("homeScreen").style.display = "block";

    // restore search UI
    document.getElementById("searchInput").style.opacity = "1";
    document.querySelector(".tabs").style.opacity = "1";
    document.getElementById("searchBtn").style.opacity = "1";
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

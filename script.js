// ===============================
// STICKY BAR ELEMENTS
// ===============================
const searchInputTop = document.getElementById("searchInputTop");
const imagesBtnTop = document.getElementById("imagesBtnTop");
const videosBtnTop = document.getElementById("videosBtnTop");

// ===============================
// MAIN SEARCH FUNCTION
// ===============================
function startSearch() {
    const q = document.getElementById("searchInput").value.trim();
    if (!q) return;

    // hide home screen
    document.getElementById("homeScreen").style.display = "none";

    // hide home search UI
    document.getElementById("searchInput").style.opacity = "0";
    document.querySelector(".tabs").style.opacity = "0";
    document.getElementById("searchBtn").style.opacity = "0";

    // show loading
    const loading = document.getElementById("loadingScreen");
    loading.style.display = "flex";

    // fetch results from backend
    fetch("https://janienginebackend-1.onrender.com/api/search?q=" + encodeURIComponent(q))
        .then(res => res.json())
        .then(data => {
            setTimeout(() => {
                loading.style.display = "none";
                renderResults(data);
                animateLogo();

                // update sticky search bar
                searchInputTop.value = q;
            }, 1500);
        })
        .catch(err => {
            console.error("Fetch error:", err);
            loading.style.display = "none";
            document.getElementById("webResults").innerHTML = "<p>Error loading results.</p>";
        });
}

// ===============================
// STICKY SEARCH BAR → ENTER SEARCH
// ===============================
searchInputTop.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        document.getElementById("searchInput").value = searchInputTop.value;
        startSearch();
    }
});

// ===============================
// RENDER RESULTS (WEB + IMAGES + VIDEOS)
// ===============================
function renderResults(results) {
    const webDiv = document.getElementById("webResults");
    const imgDiv = document.getElementById("imagesSection");
    const vidDiv = document.getElementById("videosSection");

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
                        <img src="${img}" class="thumbImg" onclick="openZoom('image', '${img}')">
                        <a class="download-btn" href="${img}" download>Download</a>
                    </div>
                `;
            });
        }

        // VIDEOS (YouTube)
        if (r.youtube && r.youtube.thumbnail) {
            hasVideos = true;
            vidDiv.innerHTML += `
                <div class="video-box">
                    <img src="${r.youtube.thumbnail}" class="video-thumb" onclick="openZoom('video', '${r.url}')">
                    <h3>${r.youtube.title}</h3>
                    <p>${r.youtube.channel}</p>
                    <a href="${r.url}" target="_blank" class="play-btn">▶ Play</a>
                </div>
            `;
        }
    });

    // SHOW TITLES
    document.getElementById("imagesTitle").style.display = hasImages ? "block" : "none";
    document.getElementById("videosTitle").style.display = hasVideos ? "block" : "none";

    // STICKY BUTTONS
    imagesBtnTop.style.display = hasImages ? "inline-block" : "none";
    videosBtnTop.style.display = hasVideos ? "inline-block" : "none";

    // SCROLL BUTTONS
    imagesBtnTop.onclick = () => document.getElementById("imagesTitle").scrollIntoView({ behavior: "smooth" });
    videosBtnTop.onclick = () => document.getElementById("videosTitle").scrollIntoView({ behavior: "smooth" });
}

// ===============================
// FULLSCREEN ZOOM (IMAGE + VIDEO)
// ===============================
function openZoom(type, src) {
    const overlay = document.getElementById("zoomOverlay");
    const img = document.getElementById("zoomImg");
    const vid = document.getElementById("zoomVideo");
    const dl = document.getElementById("downloadBtn");

    overlay.style.display = "flex";

    if (type === "image") {
        img.src = src;
        img.style.display = "block";
        vid.style.display = "none";
        dl.innerText = "Download image";
    } else {
        vid.src = src;
        vid.style.display = "block";
        img.style.display = "none";
        dl.innerText = "Download video";
    }

    dl.href = src;
}

document.getElementById("zoomOverlay").onclick = () => {
    document.getElementById("zoomOverlay").style.display = "none";
};

// ===============================
// LOGO ANIMATION
// ===============================
function animateLogo() {
    const title = document.getElementById("janiTitle");
    setTimeout(() => {
        title.classList.add("small");
    }, 1000);
}

// ===============================
// RESET ON LOGO CLICK
// ===============================
document.getElementById("janiTitle").addEventListener("click", () => {
    document.getElementById("janiTitle").classList.remove("small");

    // clear results
    document.getElementById("webResults").innerHTML = "";
    document.getElementById("imagesSection").innerHTML = "";
    document.getElementById("videosSection").innerHTML = "";

    // hide titles
    document.getElementById("imagesTitle").style.display = "none";
    document.getElementById("videosTitle").style.display = "none";

    // clear sticky search
    searchInputTop.value = "";

    // show home screen
    document.getElementById("homeScreen").style.display = "block";

    // restore home search UI
    document.getElementById("searchInput").style.opacity = "1";
    document.querySelector(".tabs").style.opacity = "1";
    document.getElementById("searchBtn").style.opacity = "1";
});

// ===============================
// THEME TOGGLE
// ===============================
document.getElementById("themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

// ===============================
// HOME SEARCH BUTTON + ENTER
// ===============================
document.getElementById("searchBtn").addEventListener("click", startSearch);
document.getElementById("searchInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") startSearch();
});

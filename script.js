// ===============================
// CLEAN HTML (sprječava video/audio/script/iframe bugove)
// ===============================
function cleanHTML(text) {
    if (!text) return "";

    return text
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, "")
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<audio[^>]*>[\s\S]*?<\/audio>/gi, "")
        .replace(/<video[^>]*>[\s\S]*?<\/video>/gi, "")
        .replace(/<source[^>]*>/gi, "")
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .trim();
}

// ===============================
// GLOBAL STATE
// ===============================
const searchInputTop = document.getElementById("searchInputTop");
const imagesBtnTop = document.getElementById("imagesBtnTop");
const videosBtnTop = document.getElementById("videosBtnTop");

let allImages = [];
let allVideos = [];

// ===============================
// MAIN SEARCH FUNCTION
// ===============================
function startSearch() {
    const q = document.getElementById("searchInput").value.trim();
    if (!q) return;

    // sakrij home screen
    document.getElementById("homeScreen").style.display = "none";

    // sakrij početni search UI
    document.getElementById("searchInput").style.opacity = "0";
    document.querySelector(".tabs").style.opacity = "0";
    document.getElementById("searchBtn").style.opacity = "0";

    // pokaži loading
    const loading = document.getElementById("loadingScreen");
    loading.style.display = "flex";

    // fetch prema backendu
    fetch("https://janienginebackend-1.onrender.com/api/search?q=" + encodeURIComponent(q))
        .then(res => res.json())
        .then(data => {
            setTimeout(() => {
                loading.style.display = "none";
                renderResults(data);

                // pokreni animaciju loga (bez blur-a)
                animateLogo();

                // upiši query u gornji search
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
// GORNJI SEARCH BAR → ENTER
// ===============================
searchInputTop.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        document.getElementById("searchInput").value = searchInputTop.value;
        startSearch();
    }
});

// ===============================
// RENDER RESULTS (INFO + PAR MEDIA)
// ===============================
function renderResults(results) {
    const webDiv = document.getElementById("webResults");
    const imgDiv = document.getElementById("imagesSection");
    const vidDiv = document.getElementById("videosSection");

    webDiv.innerHTML = "";
    imgDiv.innerHTML = "";
    vidDiv.innerHTML = "";

    allImages = [];
    allVideos = [];

    let hasImages = false;
    let hasVideos = false;

    results.forEach(r => {
        // WEB INFO
        webDiv.innerHTML += `
            <div class="web-item">
                <img src="${r.favicon || ""}" class="favicon" />
                <div>
                    <a href="${r.url}" target="_blank" class="title">${r.title}</a>
                    <p>${cleanHTML(r.content).slice(0, 200)}...</p>
                </div>
            </div>
        `;

        // SLIKE — skupljamo sve, ali na glavnoj samo malo
        if (r.images && r.images.length > 0) {
            hasImages = true;
            r.images.forEach(img => allImages.push(img));

            r.images.slice(0, 2).forEach(img => {
                imgDiv.innerHTML += `
                    <div class="image-box">
                        <img src="${img}" class="thumbImg" onclick="openZoom('image', '${img}')">
                        <a class="download-btn" href="${img}" download>Download</a>
                    </div>
                `;
            });
        }

        // VIDEA — skupljamo sve, na glavnoj jedan
        if (r.youtube && r.youtube.thumbnail) {
            hasVideos = true;
            allVideos.push({
                url: r.url,
                thumb: r.youtube.thumbnail,
                title: r.youtube.title,
                channel: r.youtube.channel
            });

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

    // TITLOVI
    document.getElementById("imagesTitle").style.display = hasImages ? "block" : "none";
    document.getElementById("videosTitle").style.display = hasVideos ? "block" : "none";

    // GORNJI GUMBI
    imagesBtnTop.style.display = hasImages ? "inline-block" : "none";
    videosBtnTop.style.display = hasVideos ? "inline-block" : "none";

    // KLIK → NOVI PAGE
    imagesBtnTop.onclick = openImagesPage;
    videosBtnTop.onclick = openVideosPage;
}

// ===============================
// NOVI PAGE ZA SLIKE
// ===============================
function openImagesPage() {
    const win = window.open("", "_blank");
    win.document.write(`
        <html>
        <head>
            <title>Images - JANI ENGINE</title>
            <style>
                body { font-family: Arial, sans-serif; background:#f5f5f5; margin:0; padding:20px; }
                h1 { text-align:center; }
                .grid { display:flex; flex-wrap:wrap; gap:16px; justify-content:center; }
                .item { background:white; padding:10px; border-radius:10px; box-shadow:0 2px 8px rgba(0,0,0,0.1); }
                .item img { max-width:260px; max-height:180px; object-fit:cover; border-radius:8px; display:block; }
                .item a { display:inline-block; margin-top:8px; color:#00aaff; text-decoration:none; }
            </style>
        </head>
        <body>
            <h1>Images</h1>
            <div class="grid">
                ${allImages.map(src => `
                    <div class="item">
                        <img src="${src}">
                        <a href="${src}" download>Download image</a>
                    </div>
                `).join("")}
            </div>
        </body>
        </html>
    `);
    win.document.close();
}

// ===============================
// NOVI PAGE ZA VIDEA
// ===============================
function openVideosPage() {
    const win = window.open("", "_blank");
    win.document.write(`
        <html>
        <head>
            <title>Videos - JANI ENGINE</title>
            <style>
                body { font-family: Arial, sans-serif; background:#f5f5f5; margin:0; padding:20px; }
                h1 { text-align:center; }
                .grid { display:flex; flex-wrap:wrap; gap:16px; justify-content:center; }
                .item { background:white; padding:10px; border-radius:10px; box-shadow:0 2px 8px rgba(0,0,0,0.1); width:320px; }
                .item img { width:100%; height:180px; object-fit:cover; border-radius:8px; display:block; }
                .item h3 { margin:8px 0 4px; }
                .item p { margin:0 0 8px; color:#555; }
                .item a { display:inline-block; color:#00aaff; text-decoration:none; }
            </style>
        </head>
        <body>
            <h1>Videos</h1>
            <div class="grid">
                ${allVideos.map(v => `
                    <div class="item">
                        <img src="${v.thumb}">
                        <h3>${v.title}</h3>
                        <p>${v.channel}</p>
                        <a href="${v.url}" target="_blank">Open video</a>
                    </div>
                `).join("")}
            </div>
        </body>
        </html>
    `);
    win.document.close();
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

document.getElementById("zoomOverlay").onclick = () => {
    document.getElementById("zoomOverlay").style.display = "none";
};

// ===============================
// LOGO ANIMATION (bez blur-a)
// ===============================
function animateLogo() {
    const title = document.getElementById("janiTitle");

    // ostane 0.5 sekundi u sredini
    setTimeout(() => {

        // samo shrink + move to corner
        title.classList.add("small");

        // pričekaj da animacija završi (0.9s)
        setTimeout(() => {

            // tek sada prikaži top bar
            document.getElementById("topBar").style.display = "flex";

        }, 900);

    }, 500);
}

// ===============================
// RESET NA KLIK LOGO
// ===============================
document.getElementById("janiTitle").addEventListener("click", () => {
    document.getElementById("janiTitle").classList.remove("small");

    // sakrij rezultate
    document.getElementById("webResults").innerHTML = "";
    document.getElementById("imagesSection").innerHTML = "";
    document.getElementById("videosSection").innerHTML = "";

    document.getElementById("imagesTitle").style.display = "none";
    document.getElementById("videosTitle").style.display = "none";

    // sakrij gornji bar
    document.getElementById("topBar").style.display = "none";

    // očisti gornji search
    searchInputTop.value = "";

    // pokaži home screen
    document.getElementById("homeScreen").style.display = "block";

    // vrati početni search UI
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

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
// SERVER DOWN POPUP + TERMINAL + ERROR BLINK + GLITCH
// ===============================
function showServerDown() {
    const overlay = document.getElementById("serverDownOverlay");
    overlay.style.display = "flex";

    startDevTerminal();
    startErrorBlink();
    startGlitchEffect();
}

document.getElementById("closeServerDown").onclick = () => {
    document.getElementById("serverDownOverlay").style.display = "none";
};

// TERMINAL ANIMACIJA
function startDevTerminal() {
    const terminal = document.getElementById("devTerminal");
    const lines = [
        "> Initializing backend modules...",
        "> Checking database integrity...",
        "> Rebuilding search index...",
        "> Optimizing crawler pipelines...",
        "> Restarting service...",
        "> Cleaning outdated cache...",
        "> Updating dependencies...",
        "> Monitoring server health...",
        "> ...",
    ];

    let i = 0;
    terminal.innerHTML = "";

    setInterval(() => {
        terminal.innerHTML += lines[i] + "<br>";
        i++;

        if (i >= lines.length) {
            i = 0;
            terminal.innerHTML = "";
        }
    }, 500);
}

// ERROR BLINK
function startErrorBlink() {
    const title = document.querySelector("#serverDownBox h2");
    title.classList.add("errorBlink");
}

// GLITCH EFFECT
function startGlitchEffect() {
    const title = document.querySelector("#serverDownBox h2");

    setInterval(() => {
        title.style.transform = "translateX(2px)";
        setTimeout(() => {
            title.style.transform = "translateX(-2px)";
        }, 50);
        setTimeout(() => {
            title.style.transform = "translateX(0px)";
        }, 100);
    }, 800);
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
// MAIN SEARCH FUNCTION (PREUSMJERENO NA POPUP)
// ===============================
function startSearch() {
    showServerDown();
    return;
}

// ===============================
// GORNJI SEARCH BAR → ENTER
// ===============================
searchInputTop.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        showServerDown();
    }
});

// ===============================
// RENDER RESULTS (NE KORISTI SE DOK JE SERVER DOWN)
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
// FULLSCREEN ZOOM
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
// LOGO ANIMATION (bez blur-a)
// ===============================
function animateLogo() {
    const title = document.getElementById("janiTitle");

    setTimeout(() => {
        title.classList.add("small");

        setTimeout(() => {
            document.getElementById("topBar").style.display = "flex";
        }, 900);

    }, 500);
}

// ===============================
// RESET NA KLIK LOGO
// ===============================
document.getElementById("janiTitle").addEventListener("click", () => {
    document.getElementById("janiTitle").classList.remove("small");

    document.getElementById("webResults").innerHTML = "";
    document.getElementById("imagesSection").innerHTML = "";
    document.getElementById("videosSection").innerHTML = "";

    document.getElementById("imagesTitle").style.display = "none";
    document.getElementById("videosTitle").style.display = "none";

    document.getElementById("topBar").style.display = "none";

    searchInputTop.value = "";

    document.getElementById("homeScreen").style.display = "block";

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

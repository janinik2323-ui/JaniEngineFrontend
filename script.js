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
// SERVER DOWN POPUP + TERMINAL + WARNING EFFECT + SOUND
// ===============================
function showServerDown() {
    const overlay = document.getElementById("serverDownOverlay");
    overlay.style.display = "flex";

    applyWarningStyle();
    startDevTerminal();
    playWarningSound();
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

// SMOOTH RED TRANSITION + GLOW + ⚠ ICON (NO DUPLICATION)
function applyWarningStyle() {
    const title = document.querySelector("#serverDownBox h2");

    // makni stare warning ikone
    const oldIcons = title.querySelectorAll(".warningIcon");
    oldIcons.forEach(icon => icon.remove());

    // dodaj smooth crvenu transformaciju
    title.classList.add("warningTitle");

    // dodaj warning ikonu (samo jednu)
    const icon = document.createElement("span");
    icon.classList.add("warningIcon");
    icon.innerText = "⚠";
    title.appendChild(icon);
}

// SOUND EFFECT (3s power-down)
function playWarningSound() {
    const sound = document.getElementById("warningSound");
    sound.currentTime = 0;
    sound.play().catch(() => {});
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
// MAIN SEARCH FUNCTION (SERVER DOWN MODE)
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
// RENDER RESULTS (DISABLED WHILE SERVER DOWN)
// ===============================
function renderResults(results) {
    const webDiv = document.getElementById("webResults");
    const imgDiv = document.getElementById("imagesSection");
    const vidDiv = document.getElementById("videosSection");

    webDiv.innerHTML = "";
    imgDiv.innerHTML = "";
    vidDiv.innerHTML = "";

    all
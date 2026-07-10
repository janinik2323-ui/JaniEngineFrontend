// ===============================
// SERVER DOWN POPUP
// ===============================
function showServerDown() {
    document.getElementById("serverDownOverlay").style.display = "flex";

    applyWarningStyle();
    startDevTerminal();
    playWarningSound();
}

// CLOSE WARNING POPUP → OPEN NEXT WINDOW AFTER 1s
document.getElementById("closeServerDown").onclick = () => {
    document.getElementById("serverDownOverlay").style.display = "none";

    setTimeout(() => {
        openNextUpdatesWindow();
    }, 1000);
};


// ===============================
// TERMINAL ANIMATION
// ===============================
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

// ===============================
// WARNING STYLE (NO DUPLICATION)
// ===============================
function applyWarningStyle() {
    const title = document.querySelector("#serverDownBox h2");

    // remove old icons
    title.querySelectorAll(".warningIcon").forEach(icon => icon.remove());

    // add red glow
    title.classList.add("warningTitle");

    // add warning icon
    const icon = document.createElement("span");
    icon.classList.add("warningIcon");
    icon.innerText = "⚠";
    title.appendChild(icon);
}


// ===============================
// NEXT UPDATES WINDOW
// ===============================
function openNextUpdatesWindow() {
    const overlay = document.getElementById("nextUpdatesOverlay");
    const items = document.querySelectorAll(".updateItem");
    const sound = document.getElementById("openWindowSound");

    overlay.style.display = "flex";

    // play sound
    sound.currentTime = 0;
    sound.play().catch(() => {});

    // red-by-red animation
    items.forEach((item, index) => {
        item.style.animationDelay = (index * 0.55) + "s";
    });
}

// CLOSE NEXT UPDATES WINDOW
document.getElementById("closeUpdates").onclick = () => {
    document.getElementById("nextUpdatesOverlay").style.display = "none";
};


// ===============================
// SOUND EFFECT (3s POWER-DOWN)
// ===============================
function playWarningSound() {
    const sound = document.getElementById("warningSound");

    sound.currentTime = 0;
    sound.volume = 1.0;

    sound.play().catch(() => {
        console.log("Autoplay blocked — user interaction required.");
    });
}


// ===============================
// SEARCH BUTTON + ENTER
// ===============================
document.getElementById("searchBtn").onclick = showServerDown;

document.getElementById("searchInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") showServerDown();
});


// ===============================
// SERVER DOWN POPUP
// ===============================
function showServerDown() {
    document.getElementById("serverDownOverlay").style.display = "flex";

    applyWarningStyle();
    startDevTerminal();
    playWarningSound();
}

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
function openNextUpdatesWindow() {
    const overlay = document.getElementById("nextUpdatesOverlay");
    const items = document.querySelectorAll(".updateItem");
    const sound = document.getElementById("openWindowSound");

    overlay.style.display = "flex";

    // pusti zvuk open.window
    sound.currentTime = 0;
    sound.play().catch(() => {});

    // red-po-red animacija
    items.forEach((item, index) => {
        item.style.animationDelay = (index * 0.55) + "s";
    });
}
document.getElementById("closeUpdates").onclick = () => {
    document.getElementById("nextUpdatesOverlay").style.display = "none";
};


// ===============================
// SOUND EFFECT (3s POWER-DOWN)
// ===============================
function playWarningSound() {
    const sound = document.getElementById("warningSound");

    sound.currentTime = 0;   // reset
    sound.volume = 1.0;      // full volume

    sound.play().catch(() => {
        console.log("Autoplay blocked — user interaction required.");
    });
}

// ===============================
// SEARCH BUTTON + ENTER
// ===============================
document.getElementById("closeServerDown").onclick = () => {
    document.getElementById("serverDownOverlay").style.display = "none";

    // čekaj 1 sekundu pa otvori novi prozor
    setTimeout(() => {
        openNextUpdatesWindow();
    }, 1000);
};

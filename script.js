function goToNextPage() {
    window.location.href = "nextpage.html";
}

function spawnYesButtons() {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const buttonWidth = 150;
    const buttonHeight = 50;
    const margin = 50;
    const safeWidth = viewportWidth - buttonWidth - (margin * 2);
    const safeHeight = viewportHeight - buttonHeight - (margin * 2);
    
    const numberOfNewButtons = Math.floor(Math.random() * 4) + 1;

    for (let i = 0; i < numberOfNewButtons; i++) {
        const newYesBtn = document.createElement("button");
        newYesBtn.innerText = "Yes";
        newYesBtn.classList.add("yes-btn");
        newYesBtn.onclick = goToNextPage;

        const x = Math.floor(Math.random() * safeWidth);
        const y = Math.floor(Math.random() * safeHeight);

        newYesBtn.style.position = "fixed";
        newYesBtn.style.left = `${x + margin}px`;
        newYesBtn.style.top = `${y + margin}px`;

        document.body.appendChild(newYesBtn);
    }
}

// Function to create floating elements (hearts or flowers)
function createFloatingElement(type) {
    const background = document.querySelector(".background");
    const element = document.createElement("i");
    
    const flowerTypes = ['fa-asterisk','fa-sun','fa-snowflake','fa-spa'];
    
    if (type === 'flower') {
        const randomFlower = flowerTypes[Math.floor(Math.random() * flowerTypes.length)];
        element.className = `fas ${randomFlower} flower`;
    } else {
        element.className = "fas fa-heart heart";
    }

    const randomSize = Math.random() * 20 + 20; // Size between 20px - 40px
    element.style.fontSize = `${randomSize}px`;

    element.style.left = `${Math.random() * 100}vw`;
    
    // Slightly different animation durations for variety
    const duration = Math.random() * 3 + 3;
    element.style.animationDuration = `${duration}s`;

    // Random initial rotation for flowers
    if (type === 'flower') {
        const rotation = Math.random() * 360;
        element.style.setProperty('--initial-rotation', `${rotation}deg`);
    }

    background.appendChild(element);

    setTimeout(() => {
        element.remove();
    }, duration * 1000);
}

// Function to create and animate big falling hearts
function createBigFallingHeart() {
    const background = document.querySelector(".background");
    const heart = document.createElement("i");
    heart.className = "fas fa-heart big-heart";

    const size = Math.random() * 200 + 100;
    heart.style.fontSize = `${size}px`;

    const leftPosition = Math.random() * (window.innerWidth - size);
    heart.style.left = `${leftPosition}px`;

    const rotationSpeed = Math.random() * 2 + 1;
    const rotationDirection = Math.random() < 0.5 ? -1 : 1;
    heart.style.setProperty('--rotation-speed', `${rotationSpeed}s`);
    heart.style.setProperty('--rotation-direction', rotationDirection);

    const fallDuration = Math.random() * 3 + 4;
    heart.style.setProperty('--fall-duration', `${fallDuration}s`);

    const initialRotation = Math.random() * 360;
    heart.style.setProperty('--initial-rotation', `${initialRotation}deg`);

    background.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, fallDuration * 1000);
}

// Start animations
function startAnimations() {
    // Create hearts every 500ms
    setInterval(() => {
        createFloatingElement('heart');
    }, 500);

    // Create flowers every 300ms
    setInterval(() => {
        createFloatingElement('flower');
    }, 800);
}

function startBigHearts() {
    function scheduleNextHeart() {
        const delay = Math.random() * 6000 + 1000;
        setTimeout(() => {
            createBigFallingHeart();
            scheduleNextHeart();
        }, delay);
    }
    scheduleNextHeart();
}

// Start all animations
startAnimations();
startBigHearts();
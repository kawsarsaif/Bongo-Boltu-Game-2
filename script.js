const gun = document.getElementById("gun");
const target = document.getElementById("target");
const gameContainer = document.querySelector(".game-container");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const popup = document.getElementById("popup");

const shootSound = document.getElementById("shoot-sound");
const hitSound = document.getElementById("hit-sound");
const gameOverSound = document.getElementById("gameOverSound");

let score = 0;
let timeLeft = 50;

// 🔄 Rotate Gun Towards Touch (For Mobile)
document.addEventListener("mousemove", rotateGun);
document.addEventListener("touchmove", (event) => {
    let touch = event.touches[0];
    rotateGun(touch);
});

function rotateGun(event) {
    let gunX = gun.getBoundingClientRect().left + gun.width / 2;
    let gunY = gun.getBoundingClientRect().top + gun.height / 2;
    let angle = Math.atan2(event.clientY - gunY, event.clientX - gunX) * (180 / Math.PI);
    gun.style.transform = `rotate(${angle + 90}deg)`;
}

// 🔫 Shoot Bullet on Click & Touch
document.addEventListener("click", shootBullet);
document.addEventListener("touchstart", shootBullet);

function shootBullet(event) {
    let bullet = document.createElement("img");
    bullet.src = "bullet.png";
    bullet.classList.add("bullet");
    gameContainer.appendChild(bullet);

    let gunX = gun.getBoundingClientRect().left + gun.width / 2;
    let gunY = gun.getBoundingClientRect().top + gun.height / 2;
    let angle = Math.atan2(event.clientY - gunY, event.clientX - gunX);

    bullet.style.left = `${gunX}px`;
    bullet.style.top = `${gunY}px`;

    let bulletSpeed = 2;
    shootSound.play();

    let bulletInterval = setInterval(() => {
        bullet.style.left = `${bullet.offsetLeft + Math.cos(angle) * bulletSpeed}px`;
        bullet.style.top = `${bullet.offsetTop + Math.sin(angle) * bulletSpeed}px`;

        // 📌 Check Collision with Target
        if (isColliding(bullet, target)) {
            target.style.display = "none"; // Hide target when hit
            clearInterval(bulletInterval);
            bullet.remove();
            hitSound.play();
            score++;
            scoreDisplay.textContent = score;
            setTimeout(() => target.style.display = "block", 1000); // Respawn after 1 sec

            // 🎉 Show Popup if Score = 15
            if (score >= 5) {
                popup.style.display = "block";
                gameOverSound.play();

            }
        }

        // 🛑 Remove Bullet if it Goes Off-Screen
        if (bullet.offsetTop < 0 || bullet.offsetLeft < 0 || bullet.offsetLeft > window.innerWidth) {
            clearInterval(bulletInterval);
            bullet.remove();
        }
    }, 1);
}

// 🎯 Collision Detection Function
function isColliding(bullet, target) {
    let bulletRect = bullet.getBoundingClientRect();
    let targetRect = target.getBoundingClientRect();
    return !(
        bulletRect.top > targetRect.bottom ||
        bulletRect.bottom < targetRect.top ||
        bulletRect.left > targetRect.right ||
        bulletRect.right < targetRect.left
    );
}

// ⏳ Countdown Timer
let timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        alert("⏳ Time's up! Try Again!");
        location.reload();
    }
}, 1000);

// 🔄 Restart Game
function restartGame() {
    location.reload();
}




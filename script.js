const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spinBtn');
const resultValue = document.getElementById('resultValue');

// ข้อมูลรางวัล
const prizes = [
    { label: "100 COINS", color: "#6366f1" },
    { label: "JACKPOT", color: "#f43f5e" },
    { label: "TRY AGAIN", color: "#475569" },
    { label: "FREE SPIN", color: "#10b981" },
    { label: "50 COINS", color: "#f59e0b" },
    { label: "BIG WIN", color: "#8b5cf6" }
];

const numPrizes = prizes.length;
const arc = Math.PI / (numPrizes / 2);
let startAngle = 0;
let spinAngleStart = 0;
let spinTime = 0;
let spinTimeTotal = 0;

// ปรับความละเอียด Canvas ให้คมชัด
function setupCanvas() {
    canvas.width = 1000;
    canvas.height = 1000;
    drawWheel();
}

function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 450;

    prizes.forEach((prize, i) => {
        const angle = startAngle + i * arc;
        
        // วาดส่วนโค้ง
        ctx.fillStyle = prize.color;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, angle, angle + arc, false);
        ctx.lineTo(centerX, centerY);
        ctx.fill();
        ctx.stroke();

        // ใส่ข้อความ
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle + arc / 2);
        ctx.fillStyle = "#fff";
        ctx.font = 'bold 40px sans-serif';
        ctx.fillText(prize.label, 180, 15);
        ctx.restore();
    });
}

function rotateWheel() {
    spinTime += 30;
    if (spinTime >= spinTimeTotal) {
        stopRotateWheel();
        return;
    }
    const spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
    startAngle += (spinAngle * Math.PI / 180);
    drawWheel();
    requestAnimationFrame(rotateWheel);
}

function stopRotateWheel() {
    const degrees = startAngle * 180 / Math.PI + 90;
    const arcd = arc * 180 / Math.PI;
    const index = Math.floor((360 - degrees % 360) / arcd);
    const result = prizes[index % numPrizes].label;
    
    resultValue.innerText = result;
    resultValue.style.fontSize = "2rem";
    resultValue.style.color = "#fbbf24";
    spinBtn.disabled = false;
}

// ฟังก์ชันฟิสิกส์การหยุด (Easing)
function easeOut(t, b, c, d) {
    const ts = (t /= d) * t;
    const tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);
}

spinBtn.addEventListener('click', () => {
    spinAngleStart = Math.random() * 10 + 10;
    spinTime = 0;
    spinTimeTotal = Math.random() * 3000 + 4000; // หมุน 4-7 วินาที
    spinBtn.disabled = true;
    rotateWheel();
});

setupCanvas();

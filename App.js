
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;

addEventListener('resize', () => {
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    
    init();
    eyes.onClick(leftEye);
    eyes.onClick(rightEye);
});

class EyeStructure {
    constructor(canvasWidth, canvasHeight, isRightEye) {
        const widthCenter = canvasWidth / 2;

        this.leftX = widthCenter - 240;
        this.rightX = this.leftX + 225;
        this.y = canvasHeight * 0.35;

        if(isRightEye) {
            this.leftX = widthCenter + 15;
            this.rightX = this.leftX + 225;
        }

        this.quadX = (this.leftX + this.rightX) / 2;
        this.quadTopY = this.y - 112.5;
        this.quadBotY = this.y + 112.5;

        this.cubicLeftX = this.leftX + 45;
        this.cubicRightX = this.rightX - 45;
        this.cubicTopY = this.y - 90;
        this.cubicBotY = this.y + 90;

        this.count = 0;
        this.velocity = 0.03;
        this.wavePoints = [];
        this.tearDrops = [];
        this.blinkPoint = this.quadTopY;
    }
    getMousePos(event) {
        this.mouseX = event.clientX - this.leftX;
        this.mouseY = event.clientY;
    }
    getYrange() {
        this.t = this.mouseX / 225;
        this.yTop = (1-this.t)**3 * this.y + 3 * (1-this.t)**2 * this.t * this.cubicTopY + 3*(1-this.t) * this.t**2 * this.cubicTopY + this.t**3 * this.y;
        this.yBottom = (1-this.t)**3 * this.y + 3 * (1-this.t)**2 * this.t * this.cubicBotY + 3*(1-this.t) * this.t**2 * this.cubicBotY + this.t**3 * this.y;
    }
}

class Eyes {
    constructor() {

    }
    draw(eye) {
        const gradient = ctx.createLinearGradient(eye.quadX, eye.cubicTopY + 10, eye.quadX, eye.cubicTopY + 110);
        gradient.addColorStop(0, '#FFDBAC');
        gradient.addColorStop(0.3, '#F1C27D');
        gradient.addColorStop(0.7, '#E0AC69');
        gradient.addColorStop(1, '#C68642');

        ctx.beginPath();
        ctx.moveTo(eye.leftX, eye.y);
        ctx.quadraticCurveTo(eye.quadX, eye.quadTopY, eye.rightX, eye.y);
        ctx.quadraticCurveTo(eye.quadX, eye.quadBotY, eye.leftX, eye.y);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(eye.quadX, eye.y, 45 , 0, 2 * Math.PI);
        ctx.fillStyle = '#77C66E';
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#d6d4e0'
        ctx.stroke();
        ctx.closePath();
    
        ctx.beginPath();
        ctx.arc(eye.quadX, eye.y, 23.34 , 0, 2 * Math.PI);
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.closePath();
    
        ctx.beginPath();
        ctx.arc(eye.quadX + 10, eye.y - 7, 8.34 , 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.closePath();
        
        ctx.beginPath();
        ctx.moveTo(eye.leftX, eye.y);
        ctx.bezierCurveTo(eye.cubicLeftX, eye.cubicBotY, eye.cubicRightX, eye.cubicBotY, eye.rightX, eye.y);
        ctx.quadraticCurveTo(eye.quadX, eye.quadBotY, eye.leftX, eye.y);
        ctx.fillStyle = '#F1C27D';
        ctx.fill();
        ctx.lineWidth = 0.5;
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#d6d4e0'
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(eye.leftX, eye.y);
        ctx.bezierCurveTo(eye.cubicLeftX, eye.cubicTopY, eye.cubicRightX, eye.cubicTopY, eye.rightX, eye.y);
        ctx.quadraticCurveTo(eye.quadX, eye.blinkPoint, eye.leftX, eye.y);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.lineWidth = 0.5;
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#d6d4e0'
        ctx.stroke();
        ctx.closePath();
    }
    update() {
        this.draw(leftEye);
        this.blink(leftEye);

        this.draw(rightEye);
        this.blink(rightEye);
    }

    blink(eye) {
        const acceleration = 0.05;

        if ((eye.blinkPoint < eye.quadBotY - 3) && (eye.count % 2 === 1)) {
            eye.blinkPoint += eye.velocity;
            eye.velocity += acceleration; 
        } else if ((eye.blinkPoint > eye.quadTopY + 4) && (eye.count % 2 === 0)) {
            eye.blinkPoint -= eye.velocity;
            eye.velocity += acceleration;
        }
    }
    onClick(eye) {
        canvas.addEventListener('click', (event) => { 
            eye.getMousePos(event);
            eye.getYrange();
            
            if((0 <= eye.mouseX && eye.mouseX <= 225) && (eye.yTop <= eye.mouseY && eye.mouseY <= eye.yBottom)) {
                eye.count++;
                eye.velocity = 0.03;
                console.log(eye.count);
                console.log(eye.velocity);
                console.log(eye.mouseX);
                console.log(eye.mouseY);
                console.log(eye.yTop);
                console.log(eye.yBottom);
            }
            
        })
    }
}

class WavePoint {
    constructor(x, y, radian, velocity) {
        this.x = x;
        this.y = y;
        this.fixedY = y;
        this.radian = radian;
        this.velocity  = velocity;
        this.yRange = Math.random() * 7; 
    }
    update() {
        this.radian += this.velocity;
        this.y = this.fixedY + (Math.sin(this.radian) * this.yRange);
    }
}

class TearDrop {
    constructor(x, y, velocity) {
        this.x = x;
        this.y = y;
        this.velocity = velocity;
        this.radius = 0;

        this.ttl = 500;
        this.maxRadius = getRandomInt(2, 5);
    }
    draw() {
        ctx.beginPath();
        ctx.fillStyle = '#a7d0f0';
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
    update() {
        this.draw();

        if(this.radius <= this.maxRadius) {
            this.radius += 0.02;
        } else if(this.radius >= this.maxRadius) {
            const gravity = 0.15;
            this.y += this.velocity;
            this.velocity += gravity;
        }

        this.ttl -= 1;
    }
}

class TearWave {
    constructor() {
        this.totalPoints = 10;
        this.velocity = 0.03;

        this.timer = 0;
    }
    init(eye) {
        const vertex = eye.quadBotY - 50;
        const xGap = (eye.rightX - eye.leftX) / (this.totalPoints - 1);
        const yGap = (vertex - eye.y ) / Math.floor(this.totalPoints / 2);
    
        for (let i = 0; i < this.totalPoints; i++) {
            const x = xGap * i + eye.leftX;
            const y = i < this.totalPoints / 2 ? eye.y + (i * yGap) : vertex - ((i - Math.floor((this.totalPoints - 1) / 2)) * yGap);
            eye.wavePoints.push(new WavePoint(x, y, i, this.velocity))
        }
    }
    draw(eye) {
        ctx.beginPath();
        ctx.fillStyle = 'rgba(35, 137, 218, 0.4)';

        let prevX = eye.wavePoints[0].x;
        let prevY = eye.wavePoints[0].y;

        ctx.moveTo(prevX, prevY);
        
        for(let i = 1; i < this.totalPoints; i++) {
            if(i < this.totalPoints - 1 ) {
                eye.wavePoints[i].update();
            }

            const centerX = (prevX + eye.wavePoints[i].x) / 2;
            const centerY = (prevY + eye.wavePoints[i].y) / 2;

            ctx.quadraticCurveTo(prevX, prevY, centerX, centerY);

            prevX = eye.wavePoints[i].x;
            prevY = eye.wavePoints[i].y;
        }

        ctx.lineTo(prevX, prevY);
        ctx.quadraticCurveTo(eye.quadX, eye.quadBotY , eye.leftX, eye.y);
        ctx.fill();
        ctx.closePath();
    }
    update() {
        this.draw(leftEye);
        this.draw(rightEye);
    }
}

let leftEye;
let rightEye;
let eyes = new Eyes();
let tearWave = new TearWave();
let timer = 0;

function init() {
    leftEye = new EyeStructure(canvas.width, canvas.height, false);
    rightEye = new EyeStructure(canvas.width, canvas.height, true);

    tearWave.init(leftEye);
    tearWave.init(rightEye);
}

function generateTears(eye) {
    if(timer % 40 === 0){
        let x = (eye.rightX - eye.leftX) * Math.random() + eye.leftX;
        let t = (x - eye.leftX) / 225 ;

        if(t <= 0.1) {
            x += 20;
            t = (x - eye.leftX) / 225 ;
        }
        if(t >= 0.9) {
            x -= 20;
            t = (x - eye.leftX) / 225 ;
        }
        
        const y = (1-t)**2 * eye.y + 2 * (1-t) * t * eye.quadBotY + t**2 * eye.y;

        eye.tearDrops.push(new TearDrop(x, y, 0.1));
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    eyes.update();
    
    tearWave.update();
    
    leftEye.tearDrops.forEach((tearDrop, index) => {
        tearDrop.update();
        if(tearDrop.ttl === 0) {
            leftEye.tearDrops.splice(index, 1);
        }
    });

    rightEye.tearDrops.forEach((tearDrop, index) => {
        tearDrop.update();
        if(tearDrop.ttl === 0) {
            rightEye.tearDrops.splice(index, 1);
        }
    });

  

    timer++;
    generateTears(leftEye);
    generateTears(rightEye);
}

window.onload = () => {
    init();
    eyes.onClick(leftEye);
    eyes.onClick(rightEye);
    animate();
}



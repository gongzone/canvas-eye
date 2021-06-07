
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;

addEventListener('resize', () => {
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    
    init();
    eyes.getMousePos(leftEye);
    eyes.getMousePos(rightEye);
    eyes.onClick(leftEye);
    eyes.onClick(rightEye);
});

class EyeStructure {
    constructor(canvasWidth, canvasHeight, isRightEye) {
        //Coordinates for Structure
        const widthCenter = canvasWidth / 2;
        const yRatio = 0.35;

        this.leftX = widthCenter - 240;
        this.rightX = this.leftX + 225;
        this.y = canvasHeight * yRatio;

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

        //for Blinking
        this.blinkPoint = this.quadTopY;
        this.clickCount = 0;
        this.currentTime = 0;
        this.dt = 0;
        this.blink_Velocity = 0;
        
        //for Changing BallSize
        this.onOff = "off";
        this.radius = 45;
        this.fixedRadius = 45;
        this.radian = 0;
        this.radian_Velocity = 0.15;
        this.max_Velocity = 0.1;
        this.max = 5; 
        
        //arrays for push
        this.wavePoints = [];
        this.tearDrops = [];
        this.scatteredTears = [];
    }
    setMousePos(event) {
        this.mouseX = event.clientX - this.leftX;
        this.mouseY = event.clientY;
    }
    setYrange() {
        this.yTop = this.getYrange(this.y, this.cubicTopY, this.cubicTopY, this.y);
        this.yBottom = this.getYrange(this.y, this.cubicBotY, this.cubicBotY, this.y);
    }
    getYrange(pA, pB, pC, pD) {
        const t = this.mouseX / 225;
        const s = (1 - t);

        return s**3 * pA + 3 * (s**2 * t) * pB + 3 * (s * t**2) * pC + t**3 * pD;
    }
}

class Eyes {
    constructor() {
    
    }
    drawUpperLid(eye) {
        const gradient = ctx.createLinearGradient(eye.quadX, eye.cubicTopY + 10, eye.quadX, eye.cubicTopY + 110);
        gradient.addColorStop(0, '#FFDBAC');
        gradient.addColorStop(0.3, '#F1C27D');
        gradient.addColorStop(0.7, '#E0AC69');
        gradient.addColorStop(1, '#C68642');

        ctx.beginPath();
        ctx.moveTo(eye.leftX, eye.y);
        ctx.bezierCurveTo(eye.cubicLeftX, eye.cubicTopY, eye.cubicRightX, eye.cubicTopY, eye.rightX, eye.y);
        ctx.quadraticCurveTo(eye.quadX, eye.blinkPoint, eye.leftX, eye.y);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.closePath();
    }
    drawLowerLid(eye) {
        ctx.beginPath();
        ctx.moveTo(eye.leftX, eye.y);
        ctx.bezierCurveTo(eye.cubicLeftX, eye.cubicBotY, eye.cubicRightX, eye.cubicBotY, eye.rightX, eye.y);
        ctx.quadraticCurveTo(eye.quadX, eye.quadBotY, eye.leftX, eye.y);
        ctx.fillStyle = '#F1C27D';
        ctx.fill();
        ctx.closePath();
    }
    drawWhite(eye) {
        ctx.beginPath();
        ctx.moveTo(eye.leftX, eye.y);
        ctx.quadraticCurveTo(eye.quadX, eye.quadTopY, eye.rightX, eye.y);
        ctx.quadraticCurveTo(eye.quadX, eye.quadBotY, eye.leftX, eye.y);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.closePath();
    }
    drawIris_Pupil(eye) {
        ctx.beginPath();
        ctx.arc(eye.quadX, eye.y, eye.radius, 0, 2 * Math.PI);
        ctx.fillStyle = '#77C66E';
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#d6d4e0'
        ctx.stroke();
        ctx.closePath();
    
        ctx.beginPath();
        ctx.arc(eye.quadX, eye.y, eye.radius - 20, 0, 2 * Math.PI);
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.closePath();
    
        ctx.beginPath();
        ctx.arc(eye.quadX + 10, eye.y - 7, eye.radius - 36, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.closePath();
    }
    update() {
        this.drawUpperLid(leftEye);
        this.blink(leftEye);
        this.changeEyeBallSize(leftEye);

        this.drawUpperLid(rightEye);
        this.blink(rightEye);
        this.changeEyeBallSize(rightEye);
    }
    blink(eye) {
        const acceleration = 200;
        
        if ((eye.blinkPoint < eye.quadBotY) && (eye.clickCount % 2 === 1)) {
            eye.dt = (new Date().getTime() - eye.currentTime ) / 1000;
            eye.currentTime = new Date().getTime(); 

            if (eye.dt > 0.2) { //fix the bug when switching browser tab
                dt = 0;
            };
            
            eye.blink_Velocity += acceleration * eye.dt;
            eye.blinkPoint += eye.blink_Velocity * eye.dt;
        } else if ((eye.blinkPoint > eye.quadTopY + 4) && (eye.clickCount % 2 === 0)) {
            eye.dt = (new Date().getTime() - eye.currentTime) / 1000;
            eye.currentTime = new Date().getTime(); 

            if (eye.dt > 0.2) { //fix the bug when switching browser tab
                dt = 0;
            };

            eye.blink_Velocity += acceleration * eye.dt;
            eye.blinkPoint -= eye.blink_Velocity * eye.dt;
        }
    }
    changeEyeBallSize(eye) {
        if((0 <= eye.mouseX && eye.mouseX <= 225) && (eye.yTop <= eye.mouseY && eye.mouseY <= eye.yBottom)) {
            eye.onOff = "on";
            eye.max = eye.max < 0 ? 0 : eye.max;

            eye.radian += eye.radian_Velocity;
            eye.radius = eye.fixedRadius + (Math.sin(eye.radian) * eye.max);
    
            eye.max -= eye.max_Velocity;

            if(eye.max <= 0 || eye.max >= 5) {
                eye.max_Velocity *= -1;
            }
            } else if(eye.max !== 5) {
                eye.onOff = "off";
            
                if((eye.max >= 0) && (eye.onOff = "off")) {
                    eye.radian += eye.radian_Velocity;
                    eye.radius = eye.fixedRadius + (Math.sin(eye.radian) * eye.max);

                    eye.max -= 0.05;
                }
            } 
    }
    getMousePos(eye) {
        canvas.addEventListener('mousemove', (event) => {
            eye.setMousePos(event);
            eye.setYrange();
        })
    }
    onClick(eye) {
        canvas.addEventListener('click', () => { 
            
            if((0 <= eye.mouseX && eye.mouseX <= 225) && (eye.yTop <= eye.mouseY && eye.mouseY <= eye.yBottom)) {
                eye.clickCount++;
                eye.blink_Velocity = 0.00;
                eye.currentTime = new Date().getTime();
            }
        })
    }
}

class WavePoint {
    constructor(x, y, radian) {
        this.x = x;
        this.y = y;
        this.fixedY = y;
        this.radian = radian;
        this.radian_Velocity = 0.03;
        this.max = Math.random() * 8; 
    }
    update() {
        this.y = this.fixedY + (Math.sin(this.radian) * this.max);
        this.radian += this.radian_Velocity;
    }
}

class TearWave {
    constructor() {
        this.totalPoints = 10;
    }
    init(eye) {
        const vertex = this.totalPoints % 2 === 0 ? eye.quadBotY - 50 : eye.quadBotY - 55;
        const xGap = (eye.rightX - eye.leftX) / (this.totalPoints - 1);
        const yGap = (vertex - eye.y ) / Math.floor(this.totalPoints / 2);
    
        for (let i = 0; i < this.totalPoints; i++) {
            const x = xGap * i + eye.leftX;
            const y = i < this.totalPoints / 2 ? eye.y + (i * yGap) : vertex - ((i - Math.floor((this.totalPoints - 1) / 2)) * yGap);
            eye.wavePoints.push(new WavePoint(x, y, Math.PI / 2 * i))
        }
    }
    draw(eye) {
        ctx.beginPath();
        ctx.fillStyle = '#a7d0f0';

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
        ctx.quadraticCurveTo(eye.quadX, eye.quadBotY + 3 , eye.leftX, eye.y);
        ctx.fill();
        ctx.closePath();
    }
}

class TearDrop {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;

        this.gravity = 0.15;
        this.randomRadius = getRandomNum(2, 5);
    }
    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
    update() {
        this.draw();
    
        if(this.radius <= this.randomRadius) {
            this.radius += 0.02;
        } else if(this.radius >= this.randomRadius) {
            this.y += this.velocity.y;
            this.velocity.y += this.gravity;
        }

        this.scatter(leftEye);
        this.scatter(rightEye);
    }
    scatter(eye)  {
        if(this.y + this.radius >= canvas.height) {
            eye.tearDrops.forEach((tearDrop, index) => {
                if(tearDrop.y + tearDrop.radius >= canvas.height){
                eye.tearDrops.splice(index, 1);
            }})
            
            for(let i = 0; i < 10; i++) {
            eye.scatteredTears.push(new ScatteredTears(this.x, this.y,  (this.radius*4) * Math.random()));
            }
        }
}
}

class ScatteredTears extends TearDrop {
    constructor(x, y, radius) {
        super(x, y, radius);
        this.velocity = {
            x: getRandomNum(-4, 4),
            y: getRandomNum(-5, 5),
        }

        this.gravity = 0.08;
        this.ttl = 200;
        this.r = 167;
        this.g = 208;
        this.b = 240;
        this.alpha = 1;
    }
    draw() {
        ctx.beginPath();
        ctx.fillStyle = `rgba(${this.r}, ${this.g}, ${this.b}, ${this.alpha} )`;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
    update() {
        this.ttl -= 1;
        this.draw();

        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.velocity.y += this.gravity;
        this.r += getRandomInt(-15, 15);
        this.g += getRandomInt(-15, 15);
        this.b += getRandomInt(-15, 15);
        this.alpha -= 1 / this.ttl;
    }

}

class HoverShining {
    constructor() {
        this.alpha = 0.01;
        this.alpha_Velocity = 0.02;
    }
    draw(eye) {
        ctx.beginPath();
        ctx.save();
        ctx.moveTo(eye.leftX, eye.y);
        ctx.bezierCurveTo(eye.cubicLeftX, eye.cubicTopY, eye.cubicRightX, eye.cubicTopY, eye.rightX, eye.y);
        ctx.bezierCurveTo(eye.cubicRightX, eye.cubicBotY, eye.cubicLeftX, eye.cubicBotY, eye.leftX, eye.y);
        ctx.shadowColor = `rgba(242, 233, 197, ${this.alpha})`
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.restore();
        ctx.closePath();
    }
    generateShining (eye) {
        if((0 <= eye.mouseX && eye.mouseX <= 225) && (eye.yTop <= eye.mouseY && eye.mouseY <= eye.yBottom)) {
            this.draw(eye);

            this.alpha += this.alpha_Velocity ;

            if(this.alpha <= 0 || this.alpha >= 1 ) {
                this.alpha_Velocity *= -1;
            }
        } 
    }
}

let leftEye;
let rightEye;
let eyes = new Eyes();
let tearWave = new TearWave();
let hoverShining = new HoverShining();
let timer = 0;

function init() {
    leftEye = new EyeStructure(canvas.width, canvas.height, false);
    rightEye = new EyeStructure(canvas.width, canvas.height, true);

    tearWave.init(leftEye);
    tearWave.init(rightEye);
}

function generateTears(eye) {
    if(timer % 60 === 0){
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

        eye.tearDrops.push(new TearDrop(x, y, 0, '#a7d0f0', {
            x: 0,
            y: 0.1,
        }));
    }
}

function getRandomNum(min, max) {
    return Math.random() * (max - min + 1) + min;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    eyes.drawLowerLid(leftEye);
    eyes.drawLowerLid(rightEye);

    hoverShining.generateShining(leftEye);
    hoverShining.generateShining(rightEye);

    leftEye.tearDrops.forEach((tearDrop) => {
        tearDrop.update();
    });

    if(leftEye.clickCount % 2 === 0) {
        generateTears(leftEye);
    }
    
    rightEye.tearDrops.forEach((tearDrop) => {
            tearDrop.update();
    });

    if(rightEye.clickCount % 2 === 0){
        generateTears(rightEye);
    }
    
    eyes.drawWhite(leftEye);
    eyes.drawWhite(rightEye);

    eyes.drawIris_Pupil(leftEye);
    eyes.drawIris_Pupil(rightEye);

    tearWave.draw(leftEye);
    tearWave.draw(rightEye);

    eyes.update();

    timer++;

    leftEye.scatteredTears.forEach((scatteredTear, index) => {
        scatteredTear.update();
        if(scatteredTear.ttl === 0) {
            leftEye.scatteredTears.splice(index, 1);
        }
    })

    rightEye.scatteredTears.forEach((scatteredTear, index) => {
        scatteredTear.update();
        if(scatteredTear.ttl === 0) {
            rightEye.scatteredTears.splice(index, 1);
        }
    })
    
}

window.onload = () => {
    init();
    eyes.getMousePos(leftEye);
    eyes.getMousePos(rightEye);
    eyes.onClick(leftEye);
    eyes.onClick(rightEye);
    animate();
}

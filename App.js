
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
    eyes.onMouseOver(leftEye);
    eyes.onMouseOver(rightEye);
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
        this.scatteredTears = [];
        this.blinkPoint = this.quadTopY;

        this.pupilRadius = 45;
        this.fixedRadius = 45;
        this.radian = Math.PI;
        this.velocity2  = 0.15;
        this.speed = 0.1;
        this.max = 6; 
        this.gg = 0;
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
    drawPupil(eye) {
        ctx.beginPath();
        ctx.arc(eye.quadX, eye.y, eye.pupilRadius , 0, 2 * Math.PI);
        ctx.fillStyle = '#77C66E';
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#d6d4e0'
        ctx.stroke();
        ctx.closePath();
    
        ctx.beginPath();
        ctx.arc(eye.quadX, eye.y, eye.pupilRadius - 20, 0, 2 * Math.PI);
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.closePath();
    
        ctx.beginPath();
        ctx.arc(eye.quadX + 10, eye.y - 7, eye.pupilRadius - 36, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.closePath();
    }
    update() {
        this.drawUpperLid(leftEye);
        this.blink(leftEye);
        this.fd(leftEye);

        this.drawUpperLid(rightEye);
        this.blink(rightEye);
        this.fd(rightEye);

        
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
    fd (eye) {
        if((0 <= eye.mouseX && eye.mouseX <= 225) && (eye.yTop <= eye.mouseY && eye.mouseY <= eye.yBottom)) {
            eye.gg = 1;
            eye.radian += eye.velocity2;
            eye.pupilRadius = eye.fixedRadius + (Math.sin(eye.radian) * eye.max);
    
            eye.max -= eye.speed;
            eye.max = eye.max < 0 ? 0 : eye.max;

            if(eye.max <= 0 || eye.max >= 6) {
                eye.speed *= -1;
            }
            } else if(((0 > eye.mouseX || eye.mouseX > 225) || (eye.yTop > eye.mouseY || eye.mouseY > eye.yBottom)) && eye.max !== 6) {
                eye.gg = 0;
            
                if((eye.max >= 0) && (eye.gg === 0)) {
                    eye.radian += eye.velocity2;
                    eye.pupilRadius = eye.fixedRadius + (Math.sin(eye.radian) * eye.max);

                    eye.max -= 0.05;
                }
            } 
    }
    onMouseOver(eye) {
        canvas.addEventListener('mousemove', (event) => {
            eye.getMousePos(event);
            eye.getYrange();
        })
    
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
        this.yRange = Math.random() * 8; 
    }
    update() {
        this.radian += this.velocity;
        this.y = this.fixedY + (Math.sin(this.radian) * this.yRange);
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
        this.ttl = 500;
        this.randomRadius = getRandomInt(2, 5);
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
    scatter(eye) {
        if(this.y + this.radius >= canvas.height) {
            for(let i = 0; i < 10; i++) {
            eye.scatteredTears.push(new ScatteredTears(this.x, this.y, (this.radius - 1) * Math.random()));
            }
            eye.tearDrops.forEach((tearDrop, index) => {
                if(tearDrop.y + this.radius >= canvas.height){
                eye.tearDrops.splice(index, 1);
            }})
        }
}
}

class ScatteredTears extends TearDrop {
    constructor(x, y, radius) {
        super(x, y, radius);
        this.velocity = {
            x: getRandomInt(-4, 4),
            y: getRandomInt(-5, 5),
        }

        this.gravity = 0.08;
        this.randomRadius = Math.random() * this.radius;
        this.ttl = 100;
        this.r = 167;
        this.g = 208;
        this.b = 240;
        this.alpha = 1;
    }
    draw() {
        ctx.beginPath();
        ctx.fillStyle = `rgb(${this.r}, ${this.g}, ${this.b}, ${this.alpha} )`;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
    update() {
        this.draw();

        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.velocity.y += this.gravity;
        this.ttl -= 1;
        this.r += getRandomInt(-15, 15);
        this.g += getRandomInt(-15, 15);
        this.b += getRandomInt(-15, 15);
        this.alpha -= 1 / this.ttl;
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

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    eyes.drawLowerLid(leftEye);
    eyes.drawLowerLid(rightEye);

    leftEye.tearDrops.forEach((tearDrop, index) => {
        tearDrop.update();
    });

    rightEye.tearDrops.forEach((tearDrop, index) => {
        tearDrop.update();
    });

    eyes.drawWhite(leftEye);
    eyes.drawWhite(rightEye);

    eyes.drawPupil(leftEye);
    eyes.drawPupil(rightEye);

    tearWave.update();

    eyes.update();

    timer++;
    generateTears(leftEye);
    generateTears(rightEye);

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
    eyes.onClick(leftEye);
    eyes.onClick(rightEye);
    eyes.onMouseOver(leftEye);
    eyes.onMouseOver(rightEye);
    animate();
   
}

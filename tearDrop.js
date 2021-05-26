import { EyeStructure } from './eyeStructure copy.js';

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.fixedY = y;
        this.velocity = 1;
        this.max = Math.random() * 8;
    }
    update() {
        this.y = this.fixedY += this.velocity;
    }
}

export class TearDrop {
    constructor() {
        this.particles = [];
        this.totalPoints = 4;
    }
    resize(stageWidth, stageHeight) {
        this.stageWidth = stageWidth;
        this.stageHeight = stageHeight;
        this.init();
    }
    init() {
        this.lefteye = new EyeStructure(this.stageWidth, this.stageHeight, 0.35, false);
        this.righteye = new EyeStructure(this.stageWidth, this.stageHeight, 0.35, true);
        this.pointGap = (this.lefteye.rightX - this.lefteye.leftX) / (this.totalPoints + 1);  

        this.teard();
    }
    draw(ctx) {
        for(let i = 0; i < this.totalPoints; i++){
            this.particles[i].update();
        const x = this.particles[i].x;
        const y = this.particles[i].y;
        const radius = 5;

        ctx.beginPath();
        ctx.fillStyle = 'blue';
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        }
    }
    teard() {
        this.particles = [];
        let hh = 0;

        for(let i = 1; i < this.totalPoints - 1; i++) {
            if(i === 1) {
                hh = 10; 
            } else if(i !== 1) {
                hh = 0;
            }
            this.particles.push(new Point(
                this.pointGap * i + this.lefteye.leftX,
                this.lefteye.y + (i * 27) + hh,
            ));
        }

        for(let i = 3; i < this.totalPoints + 1; i++) {
            if(i === 4) {
                hh = 10; 
            } else if(i !== 4) {
                hh = 0;
            }
            this.particles.push(new Point(
                this.pointGap * i + this.lefteye.leftX,
                (this.lefteye.y + 54) - (i - 3) * 27 + hh,
            ));
        }
    }
}

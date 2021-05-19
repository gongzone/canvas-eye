import { EyeStructure } from './eyeStructure copy.js';

class Point {
    constructor(x, y, index) {
        this.x = x;
        this.y = y;
        this.fixedY = y;
        this.sinX = index;
        this.velocity = 0.01;
        this.max = Math.random() * 8;
    }
    update() {
        this.sinX += this.velocity;
        this.y = this.fixedY + (Math.sin(this.sinX) * this.max);
}
}
export class Wave {
    constructor() {
        this.index = 0;
        this.totalPoints = 10;
        this.color = 'rgba(35, 137, 218, 0.4)';
        
        this.points1 = [];
        this.points2 = [];
    }

    resize(stageWidth, stageHeight) {
        this.stageWidth = stageWidth;
        this.stageHeight = stageHeight;

        this.initEyeS();
        this.waveY1 = this.lefteye.y;
        this.waveY2 = this.righteye.y;

        this.pointGap1 = (this.lefteye.rightX - this.lefteye.leftX) / (this.totalPoints - 1);
        this.pointGap2 = (this.righteye.rightX - this.righteye.leftX) / (this.totalPoints - 1);
        
        this.initPoint1();
        this.initPoint2();
    }

    initEyeS() {
        this.lefteye = new EyeStructure(this.stageWidth, this.stageHeight, 0.35, false);
        this.righteye = new EyeStructure(this.stageWidth, this.stageHeight, 0.35, true);
    }
    
    initPoint1() {
        this.points1 = [];

        for(let i = 0; i < this.totalPoints / 2; i++) {
            this.points1.push(new Point(
                this.pointGap1 * i + this.lefteye.leftX,
                this.waveY1 + (i * 12),
                this.index + i,
                ));
        }

        for(let i = 5; i < this.totalPoints ; i++) {
            this.points1.push(new Point(
                this.pointGap1 * i + this.lefteye.leftX,
                (this.waveY1 + 48) - (i-5) * 12,
                this.index + i,
                ));
        }
    }

    initPoint2() {
        this.points2 = [];

        for(let i = 0; i < this.totalPoints / 2; i++) {
            this.points2.push(new Point(
                this.pointGap2 * i + this.righteye.leftX,
                this.waveY2  + (i * 12),
                this.index + i,
                ));
        }

        for(let i = 5; i < this.totalPoints; i++) {
            this.points2.push(new Point(
                this.pointGap2 * i + this.righteye.leftX,
                (this.waveY2 + 48) - (i-5) * 12,
                this.index + i,
                ));
        }
    }

    draw1(ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.color;

        let prevX = this.points1[0].x;
        let prevY = this.points1[0].y;

        ctx.moveTo(prevX, prevY);
        
        for(let i = 1; i < this.totalPoints; i++) {
            if(i < this.totalPoints - 1 ) {
                this.points1[i].update();
            }

            const cx = (prevX + this.points1[i].x) / 2;
            const cy = (prevY + this.points1[i].y) / 2;

            ctx.quadraticCurveTo(prevX, prevY, cx, cy);

            prevX = this.points1[i].x;
            prevY = this.points1[i].y;
        }

        ctx.lineTo(prevX, prevY);
        ctx.quadraticCurveTo(this.lefteye.quadX, this.lefteye.quadBotY , this.lefteye.leftX, this.lefteye.y);
        ctx.fill();
        ctx.closePath();
    }
    
    draw2(ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.color;

        let prevX = this.points2[0].x;
        let prevY = this.points2[0].y;

        ctx.moveTo(prevX, prevY);
        
        for(let i = 1; i < this.totalPoints; i++) {
            if(i < this.totalPoints -1 ) {
                this.points2[i].update();
            }

            const cx = (prevX + this.points2[i].x) / 2;
            const cy = (prevY + this.points2[i].y) / 2;

            ctx.quadraticCurveTo(prevX, prevY, cx, cy);

            prevX = this.points2[i].x;
            prevY = this.points2[i].y;
        }

        ctx.lineTo(prevX, prevY);
        ctx.quadraticCurveTo(this.righteye.quadX, this.righteye.quadBotY, this.righteye.leftX, this.righteye.y);
        ctx.fill();
        ctx.closePath();
    }


}
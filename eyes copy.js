import { EyeStructure } from './eyeStructure copy.js';
import { EyeBall } from './eyeBall.js';

export class Eyes {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;

        this.leftCount = 0;
        this.rightCount = 0;
        this.velocityL = 0.03;
        this.velocityR = 0.03;
    }

    resize(stageWidth, stageHeight) {
        this.stageWidth = stageWidth;
        this.stageHeight = stageHeight;
        this.init();
    }

    init() {
        this.lefteye = new EyeStructure(this.stageWidth, this.stageHeight, 0.35, false);
        this.righteye = new EyeStructure(this.stageWidth, this.stageHeight, 0.35, true);
        this.eyeBall = new EyeBall(this.lefteye.quadX, this.lefteye.y, this.righteye.quadX, this.righteye.y, this.ctx)
        }

    draw(ctx, eye) {
        const gradient = ctx.createLinearGradient(eye.quadX, eye.bezierTopY + 10, eye.quadX, eye.bezierTopY + 110);
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
        ctx.moveTo(eye.leftX, eye.y);
        ctx.bezierCurveTo(eye.bezierX1, eye.bezierBotY, eye.bezierX2, eye.bezierBotY, eye.rightX, eye.y);
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
        ctx.bezierCurveTo(eye.bezierX1, eye.bezierTopY, eye.bezierX2, eye.bezierTopY, eye.rightX, eye.y);
        ctx.quadraticCurveTo(eye.quadX, eye.blinkingPoint, eye.leftX, eye.y);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.lineWidth = 0.5;
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#d6d4e0'
        ctx.stroke();
        ctx.closePath();
    }

    update() {
        this.draw(this.ctx, this.lefteye);
        this.draw(this.ctx, this.righteye);
        this.eyeBlink();
        this.eyeBall.update(this.lefteye.quadX, this.lefteye.y, this.righteye.quadX, this.righteye.y);
    }

    eyeBlink() {
        if ((this.lefteye.blinkingPoint < this.lefteye.quadBotY - 3 ) && (this.leftCount % 2 === 1)) {
            this.lefteye.blinkingPoint += this.velocityL;
            this.velocityL += 0.05 ;
        
        } else if ((this.lefteye.blinkingPoint > this.lefteye.quadTopY + 4) && (this.leftCount % 2 === 0)) {
            this.lefteye.blinkingPoint -= this.velocityL ;
            this.velocityL += 0.05 ;
        } 

        if ((this.righteye.blinkingPoint < this.righteye.quadBotY - 3 ) && (this.rightCount % 2 === 1)) {
            this.righteye.blinkingPoint += this.velocityR;
            this.velocityR += 0.05 ;
        
        } else if ((this.righteye.blinkingPoint > this.righteye.quadTopY + 4) && (this.rightCount % 2 === 0)) {
            this.righteye.blinkingPoint -= this.velocityR ;
            this.velocityR += 0.05 ;
        } 
    }

    getCount(event) { 
        this.lefteye.getMousePos(event)
        this.lefteye.getYrange();
        if((0 <= this.lefteye.mouseX && this.lefteye.mouseX <= 225 ) && (this.lefteye.yTop <= this.lefteye.mouseY && this.lefteye.mouseY <= this.lefteye.yBottom)){
            this.leftCount++;
            this.velocityL = 0.03; 
            console.log(this.leftCount);
            console.log(this.velocityL);
            console.log(this.lefteye.mouseX);
            console.log(this.lefteye.mouseY);
            console.log(this.lefteye.yTop);
            console.log(this.lefteye.yBottom);
        }

        this.righteye.getMousePos(event);
        this.righteye.getYrange();
        if((0 <= this.righteye.mouseX && this.righteye.mouseX <= 225 ) && (this.righteye.yTop <= this.righteye.mouseY && this.righteye.mouseY <= this.righteye.yBottom)){
            this.rightCount++;  
            this.velocityR = 0.03; 
            console.log(this.rightCount);
            console.log(this.velocityR);
            console.log(this.righteye.mouseX);
            console.log(this.righteye.mouseY);
            console.log(this.righteye.yTop);
            console.log(this.righteye.yBottom);
    }
}
}
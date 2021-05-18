export class EyeStructure {
    constructor(stageWidth, stageHeight, yRatio, isRightEye ) {
        const widthCenter = stageWidth / 2 ;
        
        this.leftX = widthCenter - 240 ;
        this.rightX = this.leftX + 225;
        this.y = stageHeight * yRatio ;
        
        if (isRightEye) {
            this.leftX = this.rightX + 30;
            this.rightX = this.leftX + 225;
        }

        this.quadX = (this.leftX + this.rightX) / 2;
        this.quadTopY = this.y - 112.5;
        this.quadBotY = this.y + 112.5;
        
        this.bezierX1 = this.leftX + 45;
        this.bezierX2 = this.rightX - 45;
        this.bezierTopY = this.y - 90;
        this.bezierBotY = this.y + 90;
        
        this.blinkingPoint = this.quadTopY;
    }
    getMousePos(event){
        this.mouseX = event.clientX - this.leftX;
        this.mouseY = event.clientY;
    }
    getYrange() {
        this.t = this.mouseX / 225;
        this.yTop = (1-this.t)**3 * this.y + 3 * (1-this.t)**2 * this.t * this.bezierTopY + 3*(1-this.t) * this.t**2 * this.bezierTopY + this.t**3 * this.y;
        this.yBottom = (1-this.t)**3 * this.y + 3 * (1-this.t)**2 * this.t * this.bezierBotY + 3*(1-this.t) * this.t**2 * this.bezierBotY + this.t**3 * this.y;
    }
}

export class EyeBall {
    constructor(x, y, x2, y2 , ctx) {
        this.ctx = ctx;

        this.x = x;
        this.y = y;
        this.x2 = x2;
        this.y2 = y2;

        this.velocityArray = [];
        this.MoveEye();
        
        this.i = Math.floor(Math.random() * this.velocityArray.length);
    }

    drawL() {
        
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, 45 , 0, 2 * Math.PI);
        this.ctx.fillStyle = '#77C66E';
        this.ctx.fill();
        this.ctx.lineWidth = 1.5;
        this.ctx.strokeStyle = '#d6d4e0'
        this.ctx.stroke();
        this.ctx.closePath();

        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, 23.34 , 0, 2 * Math.PI);
        this.ctx.fillStyle = 'black';
        this.ctx.fill();
        this.ctx.closePath();

        this.ctx.beginPath();
        this.ctx.arc(this.x + 10, this.y - 7, 8.34 , 0, 2 * Math.PI);
        this.ctx.fillStyle = 'white';
        this.ctx.fill();
        this.ctx.closePath();
    }
    
    drawR() {
        
        this.ctx.beginPath();
        this.ctx.arc(this.x2, this.y2, 45 , 0, 2 * Math.PI);
        this.ctx.fillStyle = '#77C66E';
        this.ctx.fill();
        this.ctx.lineWidth = 1.5;
        this.ctx.strokeStyle = '#d6d4e0'
        this.ctx.stroke();
        this.ctx.closePath();

        this.ctx.beginPath();
        this.ctx.arc(this.x2, this.y2, 23.34 , 0, 2 * Math.PI);
        this.ctx.fillStyle = 'black';
        this.ctx.fill();
        this.ctx.closePath();

        this.ctx.beginPath();
        this.ctx.arc(this.x2 + 10, this.y2 - 7, 8.34 , 0, 2 * Math.PI);
        this.ctx.fillStyle = 'white';
        this.ctx.fill();
        this.ctx.closePath();
    }

    update(eyex, eyey ,eyex2, eyey2) {
        const xRange = this.x - eyex;
        const yRange = this.y - eyey;
        const xRange2 = this.x2 - eyex2;
        const yRange2 = this.y2 - eyey2;

        if((Math.sqrt(xRange**2 + yRange**2) > 20) && (Math.sqrt(xRange2**2 + yRange2**2) > 20) ) {
            if(this.i >= 8) {
                this.i = this.i - 8;
            } else if(this.i < 8) {
                this.i = this.i + 8;
            }
        } else if ((Math.sqrt(xRange**2 + yRange**2) <= 0) && (Math.sqrt(xRange2**2 + yRange2**2) <= 0) ) {
            this.i = Math.floor(Math.random() * this.velocityArray.length)
        }
        
        this.drawL();
        this.x += this.velocityArray[this.i].x ;  
        this.y += this.velocityArray[this.i].y ;

        this.drawR();
        this.x2 += this.velocityArray[this.i].x ;
        this.y2 += this.velocityArray[this.i].y ;
    }

    MoveEye() {

        for(let i = 0; i < 16; i++) {
            const radian = (Math.PI * 2) / 16;

            this.velocityArray.push(
                {
                    x: Math.cos(radian * i) / 10 ,
                    y: Math.sin(radian * i)  /10 ,
                }
            )

            
        }
    }

}
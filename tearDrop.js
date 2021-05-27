

export class TearDrop {
    constructor(x, y, velocity, ctx) {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.velocity = velocity;

        this.ctx = ctx;
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = '#a7d0f0';
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
    update() {
        this.draw(this.ctx);

        if(this.radius <= 8) {
            this.radius += 0.05;
        } 

        if(this.radius >= 7) {
            this.y += this.velocity;
            this.velocity += 0.15;
        }
    }
}
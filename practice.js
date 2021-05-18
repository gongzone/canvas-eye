class App {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);

        this.waveGroup = new WaveGroup();
        
        window.addEventListener('resize', this.resize.bind(this), false); //callback 함수로 어떤 객체의 메서드를 전달하게 되면, 더 이상 그 객체의 정보는 남아있지 않게됨, this를 APP 객체가 아닌 window 같은 전역 객체로 인식하는 것을 방지하기 위해 bind를 사용
        this.resize();
        
        requestAnimationFrame(this.animate.bind(this));
    }

    resize() {
        this.stageWidth = document.body.clientWidth;
        this.stageHeight = document.body.clientHeight;
        //캔버스 크기를 두배로 만들어서 고품질 화면 표현(CSS는 100%) =>화면압축
        this.canvas.width = this.stageWidth * 2;
        this.canvas.height = this.stageHeight * 2;
        this.ctx.scale(2, 2); //무언가 그릴때 두배의 크기로 그리게함.\

        this.waveGroup.resize(this.stageWidth, this.stageHeight);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
        this.waveGroup.draw(this.ctx);
    }
}

class Point {
    constructor(index, x, y) {
        this.x = x;
        this.y = y;
        this.fixedY = y;
        this.cur = index;
        this.speed = 0.1;
        this.max = Math.random() * 100 ;
    }

    update() {
        this.cur += this.speed;
        this.y = this.fixedY + (Math.sin(this.cur) * this.max);
    }
}

class Wave {
    constructor(index, totalPoints, color) {
        this.index = index;
        this.totalPoints = totalPoints;
        this.color = color;
        this.points = [];
    }

    resize(stageWidth, stageHeight) {
        this.stageWidth = stageWidth;
        this.stageHeight = stageHeight;

        this.centerX = stageWidth / 2;
        this.centerY = stageHeight / 2;

        this.pointGap = this.stageWidth / (this.totalPoints - 1);

        this.init();
    }

    init() {
        this.points = [];

        for(let i = 0; i < this.totalPoints; i++) {
            const point = new Point(
                this.index + i,
                this.pointGap * i,
                this.centerY,
                );
            this.points[i] = point;
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.color;

        let prevX = this.points[0].x;
        let prevY = this.points[0].y;

        ctx.moveTo(prevX, prevY);

        for(let i = 1; i < this.totalPoints; i++) {
            if(i < this.totalPoints -1) {
                this.points[i].update();
            }
            const cx = (prevX + this.points[i].x) /2;
            const cy = (prevY + this.points[i].y) /2;

            ctx.quadraticCurveTo(prevX, prevY, cx, cy);

            prevX = this.points[i].x;
            prevY = this.points[i].y;
        }
        ctx.lineTo(prevX,prevY);
        ctx.lineTo(this.stageWidth, this.stageHeight);
        ctx.lineTo(this.points[0].x, this.stageHeight);
        ctx.fill();
        ctx.closePath();
}
}

class WaveGroup {
    constructor() {
        this.totalWaves = 3;
        this.totalPoints = 6;

        this.color = ['rgba(15, 94, 156, 0.4)', 'rgba(35, 137, 218, 0.4)', 'rgba(28,163,236,0.4)']

        this.waves = [];

        for(let i = 0; i < this.totalWaves; i++){
            const wave = new Wave(
                i,
                this.totalPoints,
                this.color[i],
            );
            this.waves[i] = wave;
        }
    }
    
    resize(stageWidth, stageHeight) {
        for(let i = 0; i < this.totalWaves; i++){
            const wave = this.waves[i];
            wave.resize(stageWidth, stageHeight);
        }
    }

    draw(ctx) {
        for(let i = 0; i < this.totalWaves; i++){
            const wave = this.waves[i];
            wave.draw(ctx);
        }

    }
}

window.onload = () => {
    new App();
};




import { Eyes } from './eyes copy.js';
import { Wave } from './tear.js';

class App {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);
        
        this.eyes = new Eyes(this.canvas, this.ctx);
        this.wave = new Wave();
        
        window.addEventListener('resize', this.resize.bind(this), false); //callback 함수로 어떤 객체의 메서드를 전달하게 되면, 더 이상 그 객체의 정보는 남아있지 않게됨, this를 APP 객체가 아닌 window 같은 전역 객체로 인식하는 것을 방지하기 위해 bind를 사용
        this.resize();
        
        this.onClick();
        requestAnimationFrame(this.animate.bind(this));
    }

    resize() {
        this.stageWidth = document.body.clientWidth;
        this.stageHeight = document.body.clientHeight;
        //캔버스 크기를 두배로 만들어서 고품질 화면 표현(CSS는 100%) =>화면압축
        this.canvas.width = this.stageWidth * 2;
        this.canvas.height = this.stageHeight * 2;
        this.ctx.scale(2, 2); //무언가 그릴때 두배의 크기로 그리게함.\

        this.eyes.resize(this.stageWidth, this.stageHeight);
        this.wave.resize(this.stageWidth, this.stageHeight)
    }

    animate() {
        this.animateId = requestAnimationFrame(this.animate.bind(this));
        this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

        this.eyes.update();
        this.wave.draw1(this.ctx);
        this.wave.draw2(this.ctx);

    }
    
    onClick() {
        this.canvas.addEventListener('click', (event) => {
        cancelAnimationFrame(this.animateId);
        this.eyes.getCount(event);
        this.animate();
        })
    }
}

window.onload = () => {
    new App();
};
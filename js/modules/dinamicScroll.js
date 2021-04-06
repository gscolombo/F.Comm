import AnimateOnScroll from './animateOnScroll.js';

export default class DinamicScroll extends AnimateOnScroll {
    changeMenuBg() {
        const logoContainer = document.querySelector('.logo-container');
        const menu = document.querySelector('.menu');
        if (pageYOffset >= this.offset[1].offset) {
            logoContainer.classList.add('bg-set');
            menu.classList.add('bg-set');
        } else {
            logoContainer.classList.remove('bg-set');
            menu.classList.remove('bg-set');
        }
    }

    pointSection(){
        const sectionArr = [];
        this.offset.forEach(obj => {
            if (!(pageYOffset < obj.offset + (innerHeight * 0.3))){
                sectionArr.push(obj.section.classList.value);
            }
        })
        const lastSection = sectionArr[sectionArr.length - 1];
        const selector = lastSection + '-opt';
        this.options.forEach(option => {
            if (option.classList.contains(selector)) {
                option.classList.add('visible');
            } else {
                option.classList.remove('visible');
            }
        });
    }

    startFunctions(){
        this.changeMenuBg();
        this.pointSection();
        document.querySelector('.menu').classList.remove('active');
    }

    init(){
        this.getOffsetDistance();
        this.startFunctions = this.startFunctions.bind(this);
        this.options = document.querySelectorAll('.menu nav li a');
        this.options[0].classList.add('visible');

        window.addEventListener('scroll', this.startFunctions);
        return this;
    }
}
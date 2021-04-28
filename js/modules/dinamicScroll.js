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
            if (!(window.pageYOffset < obj.offset + (window.innerHeight * 0.3))){
                sectionArr.push(obj.section.classList.value);
            }
        });

        console.log(this.offset);

        const lastSection = sectionArr[sectionArr.length - 1];

        if (this.isIndex) {
            const selector = lastSection + '-opt';
            this.options.forEach(option => {
                if (option.classList.contains(selector)) {
                    option.setAttribute('data-js', 'visible');
                } else {
                    option.removeAttribute('data-js');
                }
            });
        }
    }

    startFunctions(){
        this.changeMenuBg();
        this.pointSection();
        document.querySelector('.menu').classList.remove('active');
    }

    init(){
        this.getOffsetDistance();

        console.log(this.offset);
        
        if (this.sections.length && this.offset.length) {
            this.startFunctions = this.startFunctions.bind(this);
    
            if (this.isIndex) {
                this.options = document.querySelectorAll('.menu nav li a');
                this.options[0].setAttribute('data-js', 'visible');
            }
    
            window.addEventListener('scroll', this.startFunctions);
            return this;
        }
    }
}
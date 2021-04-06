import AnimateOnScroll from './animateOnScroll.js';

export default class DinamicScroll extends AnimateOnScroll {
    changeMenuBg() {
        const logoContainer = document.querySelector('.logo-container');
        this.getOffsetDistance();
        if (pageYOffset >= this.offset[1].offset * 1.667) {
            logoContainer.classList.add('bg-set');
        } else {
            logoContainer.classList.remove('bg-set');
        }
    }

    init(){
        this.changeMenuBg = this.changeMenuBg.bind(this);
        window.addEventListener('scroll', this.changeMenuBg);
        return this;
    }
}
import menuControl from './modules/menuControl.js';
import AnimateOnScroll from './modules/animateOnScroll.js'
import DinamicScroll from './modules/dinamicScroll.js';
import SlideWithScrollbar from './modules/slideWithScrollbar.js';

window.onload = () => {
    const animateOnScroll = new AnimateOnScroll('section', '[data-js="animate"]');
    animateOnScroll.init();
    
    const dinamicScroll = new DinamicScroll('section');
    dinamicScroll.init();
    
    menuControl();
    
    const scrollbarSelector = '.custom-scrollbar .thumb';
    const scrollbarWidth =  document.querySelector(scrollbarSelector).clientWidth;

    const slide = new SlideWithScrollbar('.slide-container .slide', scrollbarSelector, scrollbarWidth, 12, 3, 5, 5, 2);
    slide.init();
}







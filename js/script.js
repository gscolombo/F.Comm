import menuControl from './modules/menuControl.js';
import AnimateOnScroll from './modules/animateOnScroll.js'
import DinamicScroll from './modules/dinamicScroll.js';
import gridMenu from './modules/gridMenu.js';
import SlideWithScrollbar from './modules/slideWithScrollbar.js';
import textWriter from './modules/textWriter.js';

window.addEventListener('load', () => {
    const animateOnScroll = new AnimateOnScroll('section', '[data-js="animate"]');
    animateOnScroll.init();
    
    const dinamicScroll = new DinamicScroll('section');
    dinamicScroll.init();
    
    menuControl();
    
    gridMenu();
    
    const scrollbar = '.custom-scrollbar .thumb';
    const servicesSlide = new SlideWithScrollbar('.services .slide', scrollbar, 10, 1, 2, 3);
    servicesSlide.init();
    
    const clientsSlide = new SlideWithScrollbar('.clients .slide', scrollbar, 20, 3, 5, 5, 3);
    clientsSlide.init();
    
    const socialMediaSlide = new SlideWithScrollbar('.social-media .slide', scrollbar, 20, 1, 2, 3);
    socialMediaSlide.init();
    
    const phrases = [
        'De gente que acredita no que faz',
        'Batatinha batatão, esparrama pelo chão',
        'Se o rei tem dor nas costas, quem vai comer a torta?'
    ]
    textWriter('.home h1', phrases, 80, 3000);
});




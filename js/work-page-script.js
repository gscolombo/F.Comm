import menuControl from './modules/menuControl.js';
import AnimateOnScroll from './modules/animateOnScroll.js'
import DinamicScroll from './modules/dinamicScroll.js';
import SlideWithScrollbar from './modules/slideWithScrollbar.js';

const animateOnScroll = new AnimateOnScroll('section', '[data-js="animate"]');
animateOnScroll.init();

const dinamicScroll = new DinamicScroll('section');
dinamicScroll.init();

menuControl();

const scrollbar = '.custom-scrollbar .thumb';
const slide = new SlideWithScrollbar('.slide-container .slide', scrollbar, 12, 3, 3, 5);
slide.init();





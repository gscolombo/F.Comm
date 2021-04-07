import menuControl from './modules/menuControl.js';
import AnimateOnScroll from './modules/animateOnScroll.js'
import DinamicScroll from './modules/dinamicScroll.js';
import gridMenu from './modules/gridMenu.js';

const animateOnScroll = new AnimateOnScroll('section', '[data-js="animate"]');
animateOnScroll.init();

const dinamicScroll = new DinamicScroll('section');
dinamicScroll.init();

menuControl();

gridMenu();
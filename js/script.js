import menuControl from './modules/menuControl.js';
import AnimateOnScroll from './modules/animateOnScroll.js'
import DinamicScroll from './modules/dinamicScroll.js';
import gridMenu from './modules/gridMenu.js';
import Slide from './modules/slide.js';
import SlideWithScrollbar from './modules/slideWithScrollbar.js';

const animateOnScroll = new AnimateOnScroll('section', '[data-js="animate"]');
animateOnScroll.init();

const dinamicScroll = new DinamicScroll('section');
dinamicScroll.init();

menuControl();

gridMenu();

const slide = new SlideWithScrollbar('.services .slide', '.custom-scrollbar .thumb', 20, 1, 2, 3);
slide.init();

// const mobileServices = {firstIndex: 0, lastIndex: 0};
// const tabletServices = {firstIndex: 0, lastIndex: 1};
// const desktopServices = {firstIndex: 0, lastIndex: 2};

// const servicesSlide = new Slide('.services .slide', '.custom-scrollbar .thumb', 20, mobileServices, tabletServices, desktopServices);
// servicesSlide.init();


// const mobileClients = {firstIndex: 0, lastIndex: 2};
// const tabletClients = {firstIndex: 0, lastIndex: 4};
// const desktopClients = {firstIndex: 0, lastIndex: 4};

// const clientsSlide = new Slide('.clients .slide', '.custom-scrollbar .thumb', 20, mobileClients, tabletClients, desktopClients);
// clientsSlide.init();


// const mobileSM = {firstIndex: 0, lastIndex: 0};
// const tabletSM = {firstIndex: 0, lastIndex: 1};
// const desktopSM = {firstIndex: 0, lastIndex: 2};

// const socialMediaSlide = new Slide('.social-media .slide', '.custom-scrollbar .thumb', 40, mobileSM, tabletSM, desktopSM);
// socialMediaSlide.init();
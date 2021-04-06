import outclick from './outclick.js';

export default function menuControl() {
    const menu = document.querySelector('.menu');
    const sandwich = document.querySelector('.sandwich');
    const closeBtn = document.querySelector('.close');
    const options = document.querySelectorAll('.menu li');
    const events = ['click', 'touchstart'];
    
    function openMenu(e) {
        menu.classList.add('active');
        outclick('.menu', closeMenu, events);
    }
    
    function closeMenu() {
        menu.classList.remove('active');
    }
    
    
    events.forEach(event => {
        sandwich.addEventListener(event, openMenu);
        closeBtn.addEventListener(event, closeMenu);
        options.forEach(option => option.addEventListener(event, closeMenu));
    });
}
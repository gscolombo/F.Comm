import outclick from './outclick.js';

export default function menuControl() {
    const sections = document.querySelectorAll('section');
    const menu = document.querySelector('.menu');
    const sandwich = document.querySelector('.sandwich');
    const closeBtn = document.querySelector('.close');
    const options = document.querySelectorAll('.menu li');
    const events = ['click', 'touchstart'];
    
    function openMenu() {
        menu.classList.add('active');
        outclick('.menu', closeMenu, events);
    }
    
    function closeMenu() {
        menu.classList.remove('active');
    }
    

    function scrollToSection(event){
        event.preventDefault();
        const link = event.currentTarget;
        sections.forEach(section => {
           if (link.querySelector(`[class^=${section.getAttribute('id')}]`) !== null){
                const sectionHeader = section.querySelector('header');
                if (sectionHeader !== null) {
                    if (!section.classList.contains('services')) {
                        scrollTo({
                            top: sectionHeader.offsetTop - 120,
                            left: 0,
                            behavior: 'smooth',
                        });
                    } else {
                        scrollTo({
                            top: sectionHeader.offsetTop - 20,
                            left: 0,
                            behavior: 'smooth',
                        });
                    } 
                } else {
                    scrollTo({
                        top: 0,
                        left: 0,
                        behavior: 'smooth',
                    });
                }
            }
        })
    }

    events.forEach(event => {
        sandwich.addEventListener(event, openMenu);
        closeBtn.addEventListener(event, closeMenu);
        options.forEach(option => option.addEventListener(event, scrollToSection));
    });
}
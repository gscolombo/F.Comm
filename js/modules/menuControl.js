import outclick from './outclick.js';

export default function menuControl() {
    const sections = document.querySelectorAll('section');
    const menu = document.querySelector('.menu');
    const sandwich = document.querySelector('.sandwich');
    const closeBtn = document.querySelector('.close');
    const options = document.querySelectorAll('a[class$=-opt]');
    const events = ['click', 'touchend'];

    const uri = document.documentURI;
    const isIndex = !uri.includes('/works/');    
    
    function openMenu(event) {
        event.preventDefault();
        menu.classList.add('active');
        outclick('.menu', closeMenu, events);
    }
    
    function closeMenu(event) {
        if (event) event.preventDefault();
        menu.classList.remove('active');
    }
    
    function scrollToSection(event){
        event.preventDefault();
        const link = event.currentTarget;

        sections.forEach(section => {
           if (link.classList.contains((section.getAttribute('id') + '-opt'))){
                const sectionHeader = section.querySelector('header');
                console.log(sectionHeader.offsetTop);
                console.log(section.offsetTop);
                if (sectionHeader !== null) {
                    if (!section.classList.contains('services')) {
                        scrollTo({
                            top: sectionHeader.offsetTop - 80,
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

        document.querySelector('.menu').classList.remove('active');
    }

    events.forEach(event => {
        sandwich.addEventListener(event, openMenu);
        closeBtn.addEventListener(event, closeMenu);

        if (isIndex) options.forEach(option => option.addEventListener(event, scrollToSection));
    });
}
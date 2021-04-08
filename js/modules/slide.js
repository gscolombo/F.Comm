export default class Slide {
    constructor(slide, scrollbar, gutter, mobile = '', tablet = '', desktop = ''){
        this.slide = document.querySelector(slide);
        this.scrollbar = this.slide.parentElement.querySelector(scrollbar);

        this.gutter = gutter;
        this.mobile = mobile;
        this.tablet = {...tablet};
        this.desktop = {...desktop};
        
        this.startEvents = ['mousedown', 'touchstart'];
        this.moveEvents = ['mousemove', 'touchmove'];
        this.endEvents = ['mouseup', 'touchend']

        this.mousePos = {initial: 0, distance: 0, last: 0, current: 0};
        this.scrollbarPos = {initial: 0, distance: 0, last: 0, current: 0};

        this.mouseDown = this.mouseDown.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
        this.mouseMove = this.mouseMove.bind(this);
    }

    setThreshold(array, gutter, firstIndex, lastIndex) {
        let scrollLength = 0;
        array.forEach((item, index) => {
            if (index > firstIndex && index < array.length - lastIndex){
                scrollLength -= (item.offsetWidth + gutter);
            }
        });
        return scrollLength;
    }

    responsiveThreshold(){
        let threshold;

        const mobile = this.mobile;
        const tablet = this.tablet;
        const desktop = this.desktop;

        if (innerWidth > 960) {
            threshold =this.setThreshold(this.items, this.gutter, desktop.firstIndex, desktop.lastIndex);
        } else if (innerWidth < 960 && innerWidth > 768) {
            threshold =this.setThreshold(this.items, this.gutter, tablet.firstIndex, tablet.lastIndex);
        } else if (innerWidth < 768) {
            threshold =this.setThreshold(this.items, this.gutter, mobile.firstIndex, mobile.lastIndex);
        }

        return threshold;
    }

    restrictMovement(target){
        const threshold = this.responsiveThreshold();
        const mouse = this.mousePos;
        const scrollbar = this.scrollbarPos;

        if (target !== this.scrollbar) {
            if (mouse.current >= 0) {
                this.translate(0, this.items);
                this.scrollbar.style.transform = 'translateX(0)';
                mouse.current = 0;
            } else if (mouse.current <= threshold) {
                this.translate(threshold, this.items);
                this.translate(50, this.scrollbar);
                mouse.current = threshold;
            }
            mouse.last = mouse.current;
            scrollbar.last = Math.floor((mouse.last / threshold) * 50);
        } else {
            if (scrollbar.current < 0) {
                this.translate(0, this.items);
                this.translate(0, this.scrollbar);
                scrollbar.current = 0;
                scrollbar.last = 0;
                mouse.current = 0;
                mouse.last = 0;
            } else if (scrollbar.current >= 50) {
                this.translate(threshold, this.items);
                this.translate(50, this.scrollbar);
                scrollbar.current = 50;
                scrollbar.last = 50;
            }
            scrollbar.last = scrollbar.current;
            mouse.last = Math.floor((scrollbar.current / 50) * threshold);
        }
    }

    calcDistance(length, target){
        const distance = length;
        this.mousePos.distance = -(this.mousePos.initial - distance);
        this.scrollbarPos.distance = -(this.scrollbarPos.initial - distance);

        this.mousePos.current = this.mousePos.distance + this.mousePos.last;
        this.scrollbarPos.current = (this.scrollbarPos.distance) + this.scrollbarPos.last;

        if (target !== this.scrollbar){
            return this.mousePos;
        } else {
            return this.scrollbarPos;
        }
    }

    translate(distance, element){
        if (element.length) {
            element.forEach(item => {
                item.style.transform = `translateX(${distance}px)`;
            });
        } else {
            element.style.transform = `translateX(${distance}px)`;
        }
    }

    mouseDown(event){
        const target = event.currentTarget;
        const type = event.type;

        this.moveEvents.forEach(event => {
            target.addEventListener(event, this.mouseMove);
        })

        if (target !== this.scrollbar) {
            this.mousePos.initial = type !== 'touchstart' ? event.clientX : event.touches[0].clientX;
        } else {
            this.scrollbarPos.initial = type !== 'touchstart' ? event.clientX : event.touches[0].clientX;
        }
    }

    mouseMove(event){
        event.preventDefault();
        const target = event.target;
        const mouseX = event.type !== 'touchmove' ? event.clientX : event.touches[0].clientX;
    
        let mousePos;
        let scrollbarPos;

        if (target !== this.scrollbar){
            mousePos = this.calcDistance(mouseX, target);
        } else {
            scrollbarPos = this.calcDistance(mouseX, target);
        }

        const scrollLength = this.responsiveThreshold();

        if (target !== this.scrollbar) {
            const scrollbarFactor = (mousePos.current / scrollLength) * 50;

            this.translate(mousePos.current, this.items);
            this.translate(scrollbarFactor, this.scrollbar);
            this.scrollbarPos.current = scrollbarFactor;
        } else {
            const slideFactor = (scrollbarPos.current / 50) * scrollLength;

            this.translate(slideFactor, this.items);
            this.translate(scrollbarPos.current, this.scrollbar);
            this.mousePos.current = slideFactor;
        }
    }

    mouseUp(event){
        const target = event.currentTarget;

        this.moveEvents.forEach(event => {
            target.removeEventListener(event, this.mouseMove);
        })

        this.restrictMovement(target);
    }

    addEvents(){
        this.startEvents.forEach(event => {
            this.slide.addEventListener(event, this.mouseDown);
            this.scrollbar.addEventListener(event, this.mouseDown);
        })
        
        this.endEvents.forEach(event => {
            this.slide.addEventListener(event, this.mouseUp);
            this.scrollbar.addEventListener(event, this.mouseUp);
        });

        this.scrollbar.addEventListener('mouseleave', this.mouseUp);
    }

    init() {
        if (this.slide) {
            this.items = [...this.slide.children];
            this.addEvents();
        }   
    }
}

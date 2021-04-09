export default class SlideWithScrollbar{
    constructor(slide, scrollbar, gutter, mobileFactor, tabletFactor, desktopFactor){
        this.slide = document.querySelector(slide);
        this.scrollbar = this.slide.parentElement.querySelector(scrollbar);
        this.movement = {start: 0, final: 0, distance: 0, finalScrollbarPos: 0};

        this.mobileFactor = mobileFactor;
        this.tabletFactor = tabletFactor;
        this.desktopFactor = desktopFactor;

        if (innerWidth < 768) {
            this.gutter = gutter * this.mobileFactor;
        } else if (innerWidth < 960 && innerWidth >= 768) {
            this.gutter = gutter * this.tabletFactor;
        } else if (innerWidth >= 960) {
            this.gutter = this.gutter * this.desktopFactor;
        }
    }

    calcMovement(clientX, target = this.slide){
        this.movement.distance = this.movement.start - clientX;
        if (!(target === this.scrollbar)) {
            return this.movement.final - this.movement.distance;
        } else {
            return this.movement.finalScrollbarPos - this.movement.distance;
        }
    }

    moveSlide(distance){
        this.movement.lastPos = distance;
        this.items.forEach(obj => {
            obj.item.style.transform = `translate3d(${distance}px, 0, 0)`;
        });
    }

    moveScrollbar(distance){
        this.movement.lastScrollbarPos = distance;
        this.scrollbar.style.transform = `translate3d(${distance}px, 0, 0)`;

    }

    moveScrollbarWithIndex(index){
        this.movement.finalScrollbarPos = this.scrollbarPositions[index];
        this.scrollbar.style.transform = `translate3d(${this.scrollbarPositions[index]}px, 0, 0)`;
    }

    scrollSlide(distance){
        this.items.forEach(obj => {
            obj.item.style.transform = `translate3d(${distance}px, 0, 0)`;
        });
    }

    limitScrolling(){
        if (this.movement.lastScrollbarPos < 0) {
            this.scrollbar.style.transform = 'translate3d(0, 0, 0)';
            this.movement.lastScrollbarPos = 0;
            this.movement.lastPos = 0;
            this.scrollSlide(0);
        } else if (this.movement.lastScrollbarPos >= this.scrollbar.clientWidth) {
            this.scrollbar.style.transform = `translate3d(${this.scrollbar.clientWidth}px, 0, 0)`;
            this.movement.lastScrollbarPos = this.scrollbar.clientWidth;
            this.movement.lastPos = this.items[this.items.length - 1].position;
            this.scrollSlide(this.items[this.items.length - 1].position);
        }
    }

    resetIndexAfterScrolling(){
        const slideWidth = this.items[this.items.length - 1].position;
        const distance = Math.floor((this.movement.lastScrollbarPos / this.scrollbar.clientWidth) * slideWidth);
        const upperLimit = Math.floor(distance + (this.items[0].item.clientWidth / 2));
        const lowerLimit = Math.floor(distance - (this.items[0].item.clientWidth / 2));
        
        this.items.forEach(obj => {
            if (obj.position < upperLimit && obj.position > lowerLimit) {
                this.setIndexPosition(obj.index);
                setTimeout(() => {
                    this.changeSlide(obj.index);
                }, 200);
            }
        });

        this.limitScrolling();
    }

    start(event){
       let type;
       if (event.type === 'mousedown'){
           event.preventDefault();
           this.movement.start = event.clientX;
           type = 'mousemove'
       } else {
           this.movement.start = event.changedTouches[0].clientX;
           type = 'touchmove';
       }

       this.slide.addEventListener(type, this.move);
       this.scrollbar.addEventListener(type, this.move);
       this.scrollbar.addEventListener('mouseleave', this.end);

       if (event.currentTarget === this.slide) this.slide.classList.add('selected');
    }

    move(event){
        event.preventDefault();
        const pointerX = event.type === 'mousemove' ? event.clientX : event.changedTouches[0].clientX;
        const finalPos = this.calcMovement(pointerX);

        if (event.target === this.scrollbar) {
            const finalScrollPos = this.calcMovement(pointerX, this.scrollbar);
            this.moveScrollbar(finalScrollPos);

            const distance = this.convertDistances();
            this.scrollSlide(distance);
        } else {
            this.moveSlide(finalPos);
        }
    }

    end(event){
        event.preventDefault();
        const type = event.type === 'mouseup' || event.type === 'mouseleave' ? 'mousemove' : 'touchmove';
        this.slide.removeEventListener(type, this.move);
        this.scrollbar.removeEventListener(type, this.move);

        if (event.currentTarget === this.slide) {
            this.changeSlideOnEnd();
        } else {
            this.resetIndexAfterScrolling();
            this.movement.finalScrollbarPos = this.movement.lastScrollbarPos;
        }
        
        this.slide.classList.remove('selected');
    
    }

    convertDistances(){
        const slideWidth = this.items[this.items.length - 1].position;
        const factor = ((this.movement.finalScrollbarPos - this.movement.distance )/ this.scrollbar.clientWidth);
        
        this.movement.lastPos = Math.floor((this.movement.lastScrollbarPos / this.scrollbar.clientWidth) * slideWidth);
        this.movement.final = this.movement.lastPos;

        return Math.floor(factor * slideWidth);
    }

    changeSlideOnEnd(){
        let threshold;
       
        if (innerWidth < 768) {
            threshold = this.index.next !== null;
        } else if (innerWidth >= 768 && innerWidth < 960) {
            threshold = this.index.next !== this.items.length - 1;
        } else if (innerWidth >= 960) {
            threshold = this.index.next !== this.items.length - 2;
        }

        if (this.movement.distance > 100 && threshold){
            this.changeSlide(this.index.next);
        } else if (this.movement.distance < -100 && this.index.prev !== null){
            this.changeSlide(this.index.prev);
        } else {
            this.changeSlide(this.index.current);
        }
    }

    // Configurações do slide
    slideConfig() {
        this.items = [...this.slide.children].map((item, index) => {
            let offset;
            if (innerWidth < 768) {
                offset = -item.offsetLeft + ((innerWidth - (item.offsetWidth * 1) - 20) / 2);
            } else if (innerWidth >= 768 && innerWidth < 960){
                offset = -item.offsetLeft + ((innerWidth - (item.offsetWidth * 2) - 40) / 2);
            } else if (innerWidth >= 960) {
                offset = -item.offsetLeft + ((innerWidth - (item.offsetWidth * 3) - 60) / 2);
            }
            return { item, index, position: offset};
        });
    }

    scrollbarConfig(){
        let factor = 0;
        this.scrollbarPositions = this.items.map((obj, index, array) => {
            if (index !== 0) {
                if (innerWidth < 768) {
                    return factor += this.scrollbar.clientWidth / (this.items.length - 1);
                } else if (innerWidth >= 768 && innerWidth < 960) {
                    if (index <= array.length - 2)
                        return factor += Math.floor(this.scrollbar.clientWidth / (this.items.length - 2));
                } else if (innerWidth >= 960) {
                    if (index <= array.length - 3)
                        return factor += Math.floor(this.scrollbar.clientWidth / (this.items.length - 3));
                }
            }   
            else return factor = 0; 
        });
    }

    setIndexPosition(index){
        const lastIndex = this.items.length - 1;

        this.index = {
            prev: index ? index - 1 : null,
            current: index,
            next: index === lastIndex ? null : index + 1,
        };
    }

    changeSlide(index){
        const current = this.items[index];

        this.moveSlide(current.position);
        this.moveScrollbarWithIndex(index);
        this.setIndexPosition(index);
        this.movement.final = current.position;

        const slideWidth = this.items[this.items.length - 1].position;
        this.movement.finalScrollbarPos = (current.position / slideWidth) * this.scrollbar.clientWidth;

        return index;
    }
    
    onWindowResize() {
        setTimeout(() => {
          this.slideConfig();
          this.scrollbarConfig();
          console.log(this.scrollbarPositions);
          this.changeSlide(this.index.current);
        }, 800);
    }

    addEvents(){
        this.startEvents = ['mousedown', 'touchstart'];
        this.endEvents = ['mouseup', 'touchend'];

        this.startEvents.forEach(event => {
            this.slide.addEventListener(event, this.start);
            this.scrollbar.addEventListener(event, this.start);
        })
        
        this.endEvents.forEach(event => {
            this.slide.addEventListener(event, this.end);
            this.scrollbar.addEventListener(event, this.end);
        });

        window.addEventListener('resize', this.onWindowResize);
    }

    bindEvents(){
        this.start = this.start.bind(this);
        this.move = this.move.bind(this);
        this.end = this.end.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
    }

    init(){
        if (this.slide){
            this.threshold = this.slide.scrollWidth;
            this.bindEvents();
            this.addEvents();
            this.slideConfig();
            this.scrollbarConfig();
            this.changeSlide(0);
        }
    }
}
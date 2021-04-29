import debounce from "./debounce.js";

export default class SlideWithScrollbar{
    constructor(slide, scrollbar, scrollbarWidth, gutter, mobile, tablet, desktop, scrollFactor = 1){
        this.slide = document.querySelector(slide);
        this.scrollbar = this.slide.parentElement.querySelector(scrollbar);
        this.scrollbarWidth = scrollbarWidth;

        this.movement = {start: 0, final: 0, distance: 0, finalScrollbarPos: 0};

        this.gutter = gutter;
        this.mobile= mobile;
        this.tablet= tablet;
        this.desktop= desktop;

        this.scrollFactor = scrollFactor;
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
        if (index > this.scrollbarPositions.length - 1) {
            index = this.scrollbarPositions.length - 1;
        }
        
        this.movement.finalScrollbarPos = this.scrollbarPositions[index];
        this.scrollbar.style.transform = `translate3d(${this.scrollbarPositions[index]}px, 0, 0)`;
    }

    stopScrolling(){
        const moveEvents = ['mousemove', 'touchmove'];
        moveEvents.forEach(event => {
            this.scrollbar.removeEventListener(event, this.move);
        })

        this.movement.finalScrollbarPos =  this.movement.lastScrollbarPos;
    }

    limitScrolling(distance){
        if (distance < 0) {
            this.movement.lastScrollbarPos = 0;
            this.changeSlide(0);
            return 0;

        } else if (distance > this.scrollbarWidth) {
            this.changeSlide(this.index.last);
            this.movement.lastScrollbarPos = this.scrollbarWidth;
            return this.scrollbarWidth;
        }


        this.stopScrolling();

    }

    resetIndexAfterScrolling(){
        const itemWidth = this.items[0].item.clientWidth / 2;

        const distance = Math.floor((this.movement.lastScrollbarPos / this.scrollbarWidth) * this.slideWidth);
        const upperLimit = Math.floor(distance + itemWidth);
        const lowerLimit = Math.floor(distance - itemWidth);

        let scrollIndex;
        this.items.forEach(obj => {
            if (obj.position < upperLimit && obj.position > lowerLimit || obj.position > distance) {
                if (obj.index >= this.index.last) 
                    scrollIndex = this.index.last;
                else 
                    scrollIndex= obj.index;
            }
        });


        setTimeout(() => {
            this.changeSlide(scrollIndex);
        }, 100);

        this.scrollbar.removeEventListener('mouseout', this.end);
    }

    convertDistances(){
        const factor = ((this.movement.finalScrollbarPos - this.movement.distance )/ this.scrollbarWidth);
        
        this.movement.lastPos = Math.floor((this.movement.lastScrollbarPos / this.scrollbarWidth) * this.slideWidth);
        this.movement.final = this.movement.lastPos;

        return Math.floor(factor * this.slideWidth);
    }

    start(event){
        event.preventDefault();
        this.movement.lastPageYPos = window.pageYOffset;

       let type;
       if (event.type === 'mousedown'){
            event.preventDefault();
            this.movement.start = event.clientX;
            type = 'mousemove'
       } else {
            this.movement.start = event.changedTouches[0].clientX;
            this.movement.lastYPos = event.changedTouches[0].pageY;
            type = 'touchmove';
       }

       this.slide.addEventListener(type, this.move);
       this.scrollbar.addEventListener(type, this.move);
       this.scrollbar.addEventListener('mouseout', this.end);
    }

    move(event){
        event.preventDefault();
        const pointerX = event.type === 'mousemove' ? event.clientX : event.changedTouches[0].clientX;
        let finalPos = this.calcMovement(pointerX);

        if (event.target === this.scrollbar) {
            let finalScrollPos = this.calcMovement(pointerX, this.scrollbar);
            let distance = this.convertDistances();


            if (finalScrollPos > this.scrollbarWidth  || finalScrollPos < 0) {
                if (finalScrollPos > this.scrollbarWidth) {
                    distance = this.slideWidth;
                } else if (finalScrollPos < 0) {
                    distance = 0;
                }
                
                finalScrollPos = this.limitScrolling(finalScrollPos);
            }

            this.moveScrollbar(finalScrollPos);
            this.moveSlide(distance);
        } else {
            if (this.movement.distance > 10 || this.movement.distance < -10) {

                if (finalPos < this.slideWidth - 100) {
                    finalPos = this.slideWidth;
                } else if (finalPos > this.items[0].position + 100) {
                    finalPos = this.items[0].position;
                }

                this.moveSlide(finalPos);
            }
            else {
                if (event.type === 'touchmove'){
                    const scrollDistance = this.movement.lastYPos - event.changedTouches[0].clientY;
                    scroll(0, scrollDistance);
                }
            }
        }

    }

    end(event){
        event.preventDefault();
        const type = event.type === 'mouseup' || event.type === 'mouseout' ? 'mousemove' : 'touchmove';
        
        this.slide.removeEventListener(type, this.move);
        this.scrollbar.removeEventListener(type, this.move);

        if (event.currentTarget === this.slide) {
            this.changeSlideOnEnd();
        } else if (event.currentTarget === this.scrollbar) {
            if (this.movement.lastScrollbarPos > 0 && this.movement.lastScrollbarPos < this.scrollbarWidth) {
                this.resetIndexAfterScrolling();
            }
                
            
            this.movement.finalScrollbarPos = this.movement.lastScrollbarPos;
            this.movement.final = this.movement.lastPos;
        }
    }

    changeSlideOnEnd(){
        if (this.movement.distance > 50 && this.index.next !== null){
            if (this.index.next < this.index.last) {
                this.changeSlide(this.index.next);
            } else {
                if (!(this.index.current < this.index.last)) {
                    this.changeSlide(this.index.current);
                } else {
                    this.changeSlide(this.index.last)
                }
            }

        } else if (this.movement.distance < -50 && this.index.prev !== null){
            if (this.index.prev > 0) {
                this.changeSlide(this.index.prev);
            } else {
                this.changeSlide(0);
            }

        } else {
            this.changeSlide(this.index.current);
        }
    }

    // Configurações do slide
    setThreshold(){
        let threshold;
        this.pageWidth = document.documentElement.clientWidth;
        
        if (this.pageWidth < 768) {
            threshold = this.mobile;
        } else if (this.pageWidth >= 768 && this.pageWidth < 960) {
            threshold = this.tablet;
        } else if (this.pageWidth >= 960) {
            threshold = this.desktop;
        }
        return threshold;
    }

    slideConfig() {
        const threshold = this.setThreshold();
        let offset;
        let difference;

        this.items = [...this.slide.children].map((item, index, array) => {
            
            if (this.pageWidth < 768) {
                if (this.mobile === 1)
                    this.gutter = 0;  
                difference = this.pageWidth - ((item.clientWidth +  this.gutter) * this.mobile);
            } else if (this.pageWidth >= 768 && this.pageWidth < 960){
                difference = this.pageWidth - ((item.clientWidth +  this.gutter) * this.tablet);
            } else if (this.pageWidth >= 960) {
                difference = this.pageWidth - ((item.clientWidth +  this.gutter) * this.desktop);
            }

            if (index <= (array.length - threshold)) 
                offset = Math.round(-item.offsetLeft + (difference / 2));
            
            return { item, index, position: offset};
        });

        this.slideWidth = this.items[this.items.length - 1].position;
    }

    scrollbarConfig(){
        const threshold = this.setThreshold();
        const factor = this.items.length - threshold;


        this.scrollbarPositions = [];
        const distance = Math.round(this.scrollbarWidth / factor);

        let position = 0;
        for (let i = 0; i < this.items.length - (threshold - 1); i++){

            this.scrollbarPositions.push(position);
            position += distance;
        }
    }

    setIndexPosition(index){
        const threshold = this.setThreshold();
        let lastIndex;
       
        if (this.scrollFactor > 1) {
            lastIndex = this.items.length - (threshold - 1);
        } else {
            lastIndex = this.items.length - threshold;
        }

        this.index = {
            prev: index ? index - this.scrollFactor : null,
            current: index,
            next: index >= lastIndex ? null : index + this.scrollFactor,
            last: lastIndex,
        };

    }

    changeSlide(index){
        if (index < this.items.length){
            const current = this.items[index];

            this.moveSlide(current.position);
            this.moveScrollbarWithIndex(index);
            this.setIndexPosition(index);
            this.movement.final = current.position;

            this.movement.lastScrollbarPos = this.scrollbarPositions[index];
            
            return index;
        }
    }
    
    onWindowResize() {
        setTimeout(() => {
          this.slideConfig();
          this.scrollbarConfig();
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
        this.onWindowResize = debounce(this.onWindowResize.bind(this), 50);
    }

    init(){
        if (this.slide && this.scrollbar && this.scrollbarWidth){
            this.slideConfig();
            this.scrollbarConfig();

            if (this.scrollbarPositions.length) {
                this.scrollbarWidth = this.scrollbarPositions[this.scrollbarPositions.length - 1];
                this.bindEvents();
                this.addEvents();
                this.changeSlide(0);
            }
        }
    }
}
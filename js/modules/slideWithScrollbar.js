export default class SlideWithScrollbar{
    constructor(slide, scrollbar, gutter, mobile, tablet, desktop, scrollFactor = 1){
        this.slide = document.querySelector(slide);
        this.scrollbar = this.slide.parentElement.querySelector(scrollbar);
        this.movement = {start: 0, final: 0, distance: 0, finalScrollbarPos: 0};

        this.mobile= mobile;
        this.tablet= tablet;
        this.desktop= desktop;

        this.scrollFactor = scrollFactor;

        if (innerWidth < 768) {
            this.gutter = gutter * this.mobile;
        } else if (innerWidth < 960 && innerWidth >= 768) {
            this.gutter = gutter * this.tablet;
        } else if (innerWidth >= 960) {
            this.gutter = gutter * this.desktop;
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
        const threshold = this.setThreshold();
        const lastPosition = this.items.length - (threshold - 1);
        
        if (index === lastPosition){
            index = index - 1;
        };

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

            let factor;
            if (innerWidth < 768) {
                factor = this.mobile;
            } else if (innerWidth < 960 && innerWidth >= 768) {
                factor = this.tablet;
            } else if (innerWidth >= 960) {
                factor= this.desktop;
            }

            this.movement.lastPos = this.items[this.items.length - factor].position;
            this.movement.final = this.movement.lastPos;
            this.scrollSlide(this.items[this.items.length - factor].position);
        }
    }

    resetIndexAfterScrolling(){
        const slideWidth = this.items[this.items.length - 1].position;
        const itemWidth = this.items[0].item.clientWidth / 2;

        const distance = Math.floor((this.movement.lastScrollbarPos / this.scrollbar.clientWidth) * slideWidth);
        const upperLimit = Math.floor(distance + (itemWidth / 2));
        const lowerLimit = Math.floor(distance - (itemWidth / 2));
        
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

    convertDistances(){
        const slideWidth = this.items[this.items.length - 1].position;
        const factor = ((this.movement.finalScrollbarPos - this.movement.distance )/ this.scrollbar.clientWidth);
        
        this.movement.lastPos = Math.floor((this.movement.lastScrollbarPos / this.scrollbar.clientWidth) * slideWidth);
        this.movement.final = this.movement.lastPos;

        return Math.floor(factor * slideWidth);
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

       if (event.currentTarget === this.scrollbar) this.scrollbar.addEventListener('mouseleave', this.end);
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
            this.scrollbar.removeEventListener('mouseleave', this.end);
            this.changeSlideOnEnd();
        } else {
            this.resetIndexAfterScrolling();
            this.limitScrolling();
            this.movement.finalScrollbarPos = this.movement.lastScrollbarPos;
            this.movement.final = this.movement.lastPos;
        }
    }

    changeSlideOnEnd(){
        if (this.movement.distance > 50 && this.index.next !== null){
            if (this.index.next <= this.index.last) {
                this.changeSlide(this.index.next);
            } else {
                this.changeSlide(this.index.last);
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

    setThreshold(gutter){
        let threshold;
        
        if (innerWidth < 768) {
            threshold = this.mobile;
        } else if (innerWidth >= 768 && innerWidth < 960) {
            threshold = this.tablet;
        } else if (innerWidth >= 960) {
            threshold = this.desktop;
        }
        return threshold;
    }

    slideConfig() {
        let offset;
        const threshold = this.setThreshold();

        this.items = [...this.slide.children].map((item, index, array) => {
            if (index <= (array.length - threshold)) {
                if (innerWidth < 768) {
                    offset = Math.floor(-item.offsetLeft + ((innerWidth - (item.offsetWidth * this.mobile) - this.gutter) / 2));
                } else if (innerWidth >= 768 && innerWidth < 960){
                    offset = Math.floor(-item.offsetLeft + ((innerWidth - (item.offsetWidth * this.tablet) - this.gutter) / 2));
                } else if (innerWidth >= 960) {
                    offset = Math.floor(-item.offsetLeft + ((innerWidth - (item.offsetWidth * this.desktop) - this.gutter) / 2));
                }
            }
            
            return { item, index, position: offset};
        });
    }

    scrollbarConfig(){
        const threshold = this.setThreshold();
        const factor = this.items.length - threshold;

        this.scrollbarPositions = [];
        const distance = Math.fround(this.scrollbar.clientWidth / factor);
        let position = 0;
        for (let i = 0; i < this.items.length - (threshold - 1); i++){
            this.scrollbarPositions.push(position);
            position += distance;
        }
    }

    setIndexPosition(index){
        const threshold = this.setThreshold();
        let lastIndex;
       
        if (this.scrollFactor !== 0) {
            lastIndex = this.items.length - (threshold - 1);
        } else {
            lastIndex = this.items.length - 1;
        }

        this.index = {
            prev: index ? index - this.scrollFactor : null,
            current: index,
            next: index === lastIndex ? null : index + this.scrollFactor,
            last: lastIndex,
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
            this.slideConfig();
            this.scrollbarConfig();
            this.bindEvents();
            this.addEvents();
            this.changeSlide(0);
        }
    }
}
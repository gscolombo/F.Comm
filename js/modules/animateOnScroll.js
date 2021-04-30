import debounce from './debounce.js';

export default class AnimateOnScroll {
    constructor(section, selector) {
        this.sections = document.querySelectorAll(section);
        this.selector = selector;
        this.checkDistance = debounce(this.checkDistance.bind(this), 50);
        this.isIndex = !document.documentURI.includes('/projects/');
    }

    addClass(el, selector) {
        const containSelector = el.querySelectorAll(selector).length !== 0;
        if (containSelector) {
            const element = [...el.querySelectorAll(selector)];
            element.forEach(el => {
                if (!el.classList.contains('active'))
                    el.classList.add('active');
            });
        } 
    }

    getOffsetDistance() {
        const halfPage = window.innerHeight * 0.6;
        this.offset = [...this.sections].map(section => {
            const sectionOffset = section.offsetTop;
            return {
                section: section,
                offset: Math.floor(sectionOffset - halfPage),
            };
        })
    }

    checkDistance() {
        const lastSection = this.offset[this.offset.length - 1];
        this.offset.forEach(offset => {
            if (window.pageYOffset >= offset.offset) {
                this.addClass(offset.section, this.selector);
            }
        });


        if (window.pageYOffset >= lastSection.offset) {
            window.removeEventListener('scroll', this.checkDistance);
        } else if (window.pageYOffset === window.scrollY) {
            this.addClass(lastSection.section, this.selector);
        }
            
    }

    init() {
        if (this.sections.length) {
            this.getOffsetDistance();
            window.addEventListener('scroll', this.checkDistance);
        } 
        return this;
    }
}
export default class AnimateOnScroll {
    constructor(section, selector) {
        this.sections = document.querySelectorAll(section);
        this.selector = selector;
        this.checkDistance = this.checkDistance.bind(this);
        this.isIndex = !document.documentURI.includes('/works/');
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
        const lastSection = this.offset[this.offset.length - 1].offset;
        this.offset.forEach(offset => {
            if (window.pageYOffset >= offset.offset) {
                this.addClass(offset.section, this.selector);
            }
        })
        if (window.pageYOffset >= lastSection)
            window.removeEventListener('scroll', this.checkDistance);
    }

    init() {
        if (this.sections.length) {
            this.getOffsetDistance();
            window.addEventListener('scroll', this.checkDistance);
        } 
        return this;
    }
}
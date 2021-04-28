export default function outClick(selector, f, eventArr) {
    const html = document.documentElement;
    const element = document.querySelector(selector);
    const events = [...eventArr];

    function close(event) {
        const target = event.target;
        if (!element.contains(target)) {
            events.forEach(event => {
                f(event);
                html.removeEventListener(event, close);
            })
        }
    }
    
    events.forEach(event => {
        html.addEventListener(event, close);
    })
}
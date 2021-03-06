export default function outClick(selector, f, eventArr) {
    const html = document.documentElement;
    const element = document.querySelector(selector);
    const events = [...eventArr];

    function close(event) {
        const target = event.target;
        if (!element.contains(target)) {
            f();
            events.forEach(event => {
                html.removeEventListener(event, close);
            })
        }
    }
    
    events.forEach(event => {
        html.addEventListener(event, close);
    })
}
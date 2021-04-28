export default function debounce(f, delay) {
    let timer;

    return (...args) => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            f(...args);
        }, delay);
    }
}
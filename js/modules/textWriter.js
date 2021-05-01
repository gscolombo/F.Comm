export default function textWriter(container, phrases, timer, interval){
    const titleContainer = document.querySelector(container);
    titleContainer.textContent = '';

    const phraseList = phrases;

    let index = 0;
    let chars = [...phraseList[index]];
    let text = [];
    let n = 0;

    let writeTimer = setInterval(writeText, timer);
    let endTimer;


    function selectPhrase(){
        n = 0;
        if (index === phraseList.length - 1){
            index = 0;
        } else {
            index++;
        }
        chars = [...phraseList[index]];
    }

    function eraseText(){
        if (n >= 0){
            const preText = text.join('').trim();
            [...preText].pop();
            text = [...preText];
            text.pop();

            const finalText = text.join('');
            titleContainer.textContent = finalText;
            n--;
        } else {
            clearInterval(endTimer);
            selectPhrase();
            writeTimer = setInterval(writeText, timer);
        }

    }

    function writeText(){
        if (n <= chars.length - 1) {
            const char = chars[n];
            if (char === ' ') {
                text.push(' ');
                text.push(chars[n + 1]);
                n++;
            } else {
                text.push(char);
            }
            const finalText = text.join('');
            titleContainer.textContent = finalText;
            n++;
        } else {
            clearInterval(writeTimer);
            setTimeout(() => {
                endTimer = setInterval(eraseText, timer);
            }, interval);
        }
}
}
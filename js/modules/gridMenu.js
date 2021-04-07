export default function gridMenu(){
    const menu = document.querySelector('.portfolio .list nav');
    const options = menu.querySelectorAll('button[data-port]');
    const openBtn = menu.querySelector('.open');
    const works = document.querySelectorAll('.portfolio .works ul [data-port]');
    const events = ['click', 'touchstart'];

    function timer(f, args, timer) {
        setTimeout( () => {
            f(...args)
        }, timer);
    }

    function sortItems(){
        const alphabet = 'abcdfeghijklmnopqrstuvwyxz'.split('');
        const items = [];
        works.forEach(work => {
            if (work.classList.contains('selected')){
                items.unshift(work);
            } else if (work.classList.contains('hidden')) {
                items.push(work);
            }
        });

        for (let i = 0; i < items.length & i <= 10; i++) {
            items[i].style.gridArea = `${alphabet[i]}`;
        };
    }

    function selectItems(element, attr){
        const attribute = element.getAttribute(attr);
        works.forEach(work => {
            work.classList.remove('selected', 'hidden', 'waiting');
            if (work.getAttribute(attr) === attribute){
                work.classList.add('selected');
            } else if (attribute === 'all') {
                work.classList.add('selected');
            } else {
                work.classList.add('hidden');
            }
        });
        events.forEach(event => {
            options.forEach(btn => btn.addEventListener(event, select));
        })
    }
    
    function select(event){
        options.forEach(btn => {
            btn.classList.remove('selected', 'hidden');
            btn.removeEventListener(event.type, select);
        });
        works.forEach(work => {
            work.classList.add('waiting');
            work.classList.remove('selected', 'hidden');
        });

        const btn = event.currentTarget;
        btn.classList.add('selected');
        
        options.forEach(btn => {
            if (!btn.classList.contains('selected')){
                btn.classList.add('hidden');
            }
        });
        openBtn.classList.remove('active');
        
        timer(selectItems, [btn, 'data-port'], 500);

        if (btn.getAttribute('data-port') !== 'all') {
            timer(sortItems, '', 500);
        }
    }

    // Para lista na versão mobile
    function openList(){
        if (!openBtn.classList.contains('active')){
            openBtn.classList.add('active');
            options.forEach(btn => {
                if (!btn.classList.contains('selected')) {
                    btn.classList.remove('hidden');
                }   
            })
        } else {
            openBtn.classList.remove('active');
            options.forEach(btn => {
                if (!btn.classList.contains('selected')){
                    btn.classList.add('hidden');
                }
            })
        }  
    }


    openBtn.addEventListener('touchstart', openList);
    events.forEach(event => {
        options.forEach(btn => btn.addEventListener(event, select));
    })
}
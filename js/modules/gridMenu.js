export default function gridMenu(){
    const menu = document.querySelector('.portfolio .list nav');
    const options = menu.querySelectorAll('button[data-port]');
    const openBtn = menu.querySelector('.open');
    const works = [...document.querySelectorAll('.portfolio .works ul [data-port]')];
    const workGrid = document.querySelector('.portfolio .works ul');

    const events = ['click', 'touchend'];    

    function timer(f, args, timer) {
        setTimeout( () => {
            f(...args)
        }, timer);
    }

    function sortItems(){
        const alphabet = 'abcdfeghijklmnopqrstuvwyxz'.split('');
        const items = [];

        
        let gridArea = '';
        let gridAreaString = '';
        const desktopRegexp = /\w{1,5}/g;
        const mobileRegexp = /\w{1,2}/g;

        works.forEach((work, index) => {
            if (work.classList.contains('selected')){
                items.unshift(work);
            } else if (work.classList.contains('hidden')) {
                items.push(work);
            }

            gridAreaString += alphabet[index];
        });

        let gridAreaRows;
        if (window.innerWidth > 768) {
            gridAreaRows = gridAreaString.match(desktopRegexp);
            gridAreaRows.forEach(row => {
                while (row.length < 5) {
                    row += '.';
                }
    
                row = row.split('').join(' ');
                gridArea += `"${row}"\n`;
            })
        } else {
            gridAreaRows = gridAreaString.match(mobileRegexp);
            gridAreaRows.forEach(row => {
                while (row.length < 2) {
                    row += '.';
                }
    
                row = row.split('').join(' ');
                gridArea += `"${row}"\n`;
            })
        }

        workGrid.style.gridTemplateAreas = gridArea;

        items.forEach((item, index) => {
            item.style.gridArea = alphabet[index];
        })
    }

    function selectItems(element, attr){
        const attribute = element.getAttribute(attr);
        works.forEach(work => {
            work.classList.remove('selected', 'hidden', 'waiting');
            if (work.getAttribute(attr) === attribute){
                work.classList.add('selected');
            } else if (attribute === 'all') {
                work.classList.remove('selected');
            } else {
                work.classList.add('hidden');
            }
        });
        events.forEach(event => {
            options.forEach(btn => btn.addEventListener(event, select));
        })
    }
    
    function select(event){
        event.preventDefault();
        options.forEach(btn => {
            btn.classList.remove('selected', 'hidden');
            btn.removeEventListener(event.type, select);
        });

        const btn = event.currentTarget;
        btn.classList.add('selected');
        btn.removeAttribute('disabled');

        works.forEach(work => {
            if (btn.getAttribute('data-port') !== 'all') {
                work.classList.add('waiting');
            }
            work.classList.remove('hidden');
        });
        
        options.forEach(btn => {
            if (!btn.classList.contains('selected')){
                btn.classList.add('hidden');
                if (innerWidth < 768) {
                    btn.setAttribute('disabled', 'true');
                }
            }
        });
        openBtn.classList.remove('active');
        
        timer(selectItems, [btn, 'data-port'], 300);

        if (btn.getAttribute('data-port') !== 'all') {
            timer(sortItems, '', 300);
        }
    }

    // Para lista na versão mobile
    function openList(){
        if (!openBtn.classList.contains('active')){
            openBtn.classList.add('active');
            options.forEach(btn => {
                btn.removeAttribute('disabled');
                if (!btn.classList.contains('selected')) {
                    btn.classList.remove('hidden');
                }   
            })
        } else {
            openBtn.classList.remove('active');
            options.forEach(btn => {
                btn.setAttribute('disabled', 'true');
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
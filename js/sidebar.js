let sideMenuItem = document.querySelectorAll('.sidemenu-item');

sideMenuItem.forEach((i) => {
    i.addEventListener('click', () => {
        sideMenuItem.forEach((j) => {
            j.querySelector('.submenu-list').classList.remove('submenu-active');
        })
        i.querySelector('.submenu-list').classList.add('submenu-active');  
    })
})
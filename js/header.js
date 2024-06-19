let headerMenu = document.querySelector('.main-menu').children;

for(const menu of headerMenu) {
    if(window.location.href.includes(menu.querySelector('a').getAttribute('href'))) {
        menu.classList.add('header-menu_active');
    }
}

//Funktion: Logik für das BurgerIcon
const menuIcon = document.getElementById('menu-icon');
const navList = document.getElementById('nav-list');

if (menuIcon && navList) {
    menuIcon.onclick = () => {
        navList.classList.toggle('active');
    };

    navList.onclick = () => {
        navList.classList.remove('active');
    };
}
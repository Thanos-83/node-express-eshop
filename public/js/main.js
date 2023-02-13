const dropDownButton = document.querySelector('#menu-button');
const dropDownMenu = document.querySelector("div[role='menu']");

const shortMenuButton = document.querySelector('#short-menu-button');
const shortProductsMenu = document.querySelector('#short-menu');

const filtersSidebar = document.querySelector('.filters');
const filtersBackdrop = document.querySelector('.filters_backdrop');
const filtersOpenButton = document.querySelector('#filtersOpen_button');
const filtersCloseButton = document.querySelector('#filtersClose_button');

function handleDropDown() {
  dropDownMenu.classList.toggle('active');
}

if (dropDownButton) {
  dropDownButton.addEventListener('click', handleDropDown);
}

shortMenuButton.addEventListener('click', () => {
  shortProductsMenu.classList.toggle('active');
});

filtersOpenButton.addEventListener('click', () => {
  filtersBackdrop.classList.add('active');
  filtersSidebar.classList.add('active');
  document.querySelector('body').classList.add('disable_scrolling');
});

filtersCloseButton.addEventListener('click', () => {
  filtersBackdrop.classList.remove('active');
  filtersSidebar.classList.remove('active');
  document.querySelector('body').classList.remove('disable_scrolling');
});

filtersBackdrop.addEventListener('click', () => {
  filtersBackdrop.classList.remove('active');
  filtersSidebar.classList.remove('active');
});

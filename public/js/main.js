const backdrop = document.querySelector('.backdrop');
const sideDrawer = document.querySelector('.mobile-nav');
const menuToggle = document.querySelector('#side-menu-toggle');

function backdropClickHandler() {
  backdrop.style.display = 'none';
  sideDrawer.classList.remove('open');
}

function menuToggleClickHandler() {
  backdrop.style.display = 'block';
  sideDrawer.classList.add('open');
}

backdrop.addEventListener('click', backdropClickHandler);
menuToggle.addEventListener('click', menuToggleClickHandler);

const resetPasswordBtn = document.querySelector('#resetPasswordBtn');
const resetPasswordInput = document.querySelector(
  '.resetPasswordPage input#email '
);

resetPasswordBtn.addEventListener('click', () => {
  console.log('input value:', resetPasswordInput.value);
  alert('button clicked');
});

// Drop down navigation menu

const dropDownButton = document.querySelector('#menu-button');
const body = document.querySelector('body');
const dropDownMenu = document.querySelector("div[role='menu']");

dropDownButton.addEventListener('click', () => {
  alert('menu clicked....');
});

body.addEventListener('click', () => {
  alert('menu clicked....');
});

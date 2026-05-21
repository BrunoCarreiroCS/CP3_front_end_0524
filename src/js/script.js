const yearElements = document.querySelectorAll('[data-current-year]');

yearElements.forEach((element) => {
  element.textContent = new Date().getFullYear();
});

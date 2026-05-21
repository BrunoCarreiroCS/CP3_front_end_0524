const yearElements = document.querySelectorAll('[data-current-year]');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const filterButtons = document.querySelectorAll('[data-filter]');
const productCards = document.querySelectorAll('[data-category]');
const contactForm = document.querySelector('#contactForm');
const formFeedback = document.querySelector('#formFeedback');
const productButtons = document.querySelectorAll('.product-card button');

yearElements.forEach((element) => {
  element.textContent = new Date().getFullYear();
});

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.textContent = isOpen ? 'Fechar' : 'Menu';
  });
}

const currentPath = window.location.pathname.split('/').pop() || 'index.html';

document.querySelectorAll('.nav-links a').forEach((link) => {
  const linkPath = link.getAttribute('href').split('/').pop();

  if (linkPath === currentPath) {
    link.classList.add('active');
  }
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const selectedCategory = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');

    productCards.forEach((card) => {
      const shouldShow = selectedCategory === 'todos' || card.dataset.category === selectedCategory;
      card.hidden = !shouldShow;
    });
  });
});

productButtons.forEach((button) => {
  const originalLabel = button.textContent;

  button.addEventListener('click', () => {
    const productName = button.closest('.product-card').querySelector('h3').textContent;
    button.textContent = `${productName} selecionado`;

    window.setTimeout(() => {
      button.textContent = originalLabel;
    }, 1800);
  });
});

if (contactForm && formFeedback) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();
    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    formFeedback.className = 'form-feedback';

    if (!name || !email || !message) {
      formFeedback.textContent = 'Preencha todos os campos antes de enviar.';
      formFeedback.classList.add('error');
      return;
    }

    if (!emailIsValid) {
      formFeedback.textContent = 'Digite um e-mail válido para receber o retorno da loja.';
      formFeedback.classList.add('error');
      return;
    }

    formFeedback.textContent = 'Mensagem enviada com sucesso! A FPS entrará em contato em breve.';
    formFeedback.classList.add('success');
    contactForm.reset();
  });
}

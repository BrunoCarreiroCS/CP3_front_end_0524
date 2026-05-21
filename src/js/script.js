const yearElements = document.querySelectorAll('[data-current-year]');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const filterButtons = document.querySelectorAll('[data-filter]');
const productCards = document.querySelectorAll('[data-category], .featured-products .product-card');
const contactForm = document.querySelector('#contactForm');
const formFeedback = document.querySelector('#formFeedback');
const cartStorageKey = 'fps-cart-items';
const currentPath = window.location.pathname.split('/').pop() || 'index.html';
const contactLink = currentPath === 'contato.html'
  ? '#contactForm'
  : currentPath === 'index.html'
    ? 'pages/contato.html'
    : 'contato.html';

const formatCurrency = (value) => value.toLocaleString('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const parsePrice = (priceText) => {
  const normalizedPrice = priceText.replace(/[^\d,]/g, '').replace(',', '.');
  return Number(normalizedPrice);
};

const getCart = () => JSON.parse(localStorage.getItem(cartStorageKey)) || [];

const saveCart = (items) => {
  localStorage.setItem(cartStorageKey, JSON.stringify(items));
};

const createCartPanel = () => {
  const panel = document.createElement('aside');
  panel.className = 'cart-panel';
  panel.setAttribute('aria-label', 'Carrinho de compras');
  panel.innerHTML = `
    <div class="cart-panel-header">
      <div>
        <span class="eyebrow">Carrinho</span>
        <h2>Seu pedido</h2>
      </div>
      <button class="cart-close" type="button" aria-label="Fechar carrinho">Fechar</button>
    </div>
    <div class="cart-items" data-cart-items></div>
    <div class="cart-panel-footer">
      <div class="cart-total-line">
        <span>Total</span>
        <strong data-cart-total>R$ 0,00</strong>
      </div>
      <button class="cart-clear" type="button">Limpar carrinho</button>
      <a class="btn btn-primary cart-checkout" href="${contactLink}">Finalizar pedido</a>
    </div>
  `;
  document.body.appendChild(panel);
  return panel;
};

const createCartButton = () => {
  const navbar = document.querySelector('.navbar');
  const button = document.createElement('button');
  button.className = 'cart-open';
  button.type = 'button';
  button.setAttribute('aria-label', 'Abrir carrinho');
  button.innerHTML = `Carrinho <span data-cart-count>0</span>`;

  if (navbar && menuToggle) {
    navbar.insertBefore(button, menuToggle);
  }

  return button;
};

const cartPanel = createCartPanel();
const cartOpenButton = createCartButton();
const cartCloseButton = cartPanel.querySelector('.cart-close');
const cartClearButton = cartPanel.querySelector('.cart-clear');
const cartItemsContainer = cartPanel.querySelector('[data-cart-items]');
const cartTotalElement = cartPanel.querySelector('[data-cart-total]');
const cartCountElement = document.querySelector('[data-cart-count]');

const openCart = () => {
  cartPanel.classList.add('is-open');
};

const closeCart = () => {
  cartPanel.classList.remove('is-open');
};

const renderCart = () => {
  const cartItems = getCart();
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  cartCountElement.textContent = totalQuantity;
  cartTotalElement.textContent = formatCurrency(totalPrice);

  if (!cartItems.length) {
    cartItemsContainer.innerHTML = '<p class="cart-empty">Seu carrinho está vazio.</p>';
    return;
  }

  cartItemsContainer.innerHTML = cartItems.map((item) => `
    <article class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div>
        <h3>${item.name}</h3>
        <p>${formatCurrency(item.price)} x ${item.quantity}</p>
        <button type="button" data-remove-cart="${item.id}">Remover</button>
      </div>
    </article>
  `).join('');
};

const addToCart = (card) => {
  const name = card.querySelector('h3').textContent.trim();
  const price = parsePrice(card.querySelector('strong').textContent);
  const image = card.querySelector('img').getAttribute('src');
  const id = name.toLowerCase().replace(/\s+/g, '-');
  const cartItems = getCart();
  const existingItem = cartItems.find((item) => item.id === id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push({ id, name, price, image, quantity: 1 });
  }

  saveCart(cartItems);
  renderCart();
  openCart();
};

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
      if (!card.dataset.category) {
        return;
      }

      const shouldShow = selectedCategory === 'todos' || card.dataset.category === selectedCategory;
      card.hidden = !shouldShow;
    });
  });
});

document.querySelectorAll('[data-cart-action]').forEach((button) => {
  button.addEventListener('click', () => {
    addToCart(button.closest('.product-card'));
  });
});

cartOpenButton.addEventListener('click', openCart);
cartCloseButton.addEventListener('click', closeCart);

cartItemsContainer.addEventListener('click', (event) => {
  const removeButton = event.target.closest('[data-remove-cart]');

  if (!removeButton) {
    return;
  }

  const cartItems = getCart().filter((item) => item.id !== removeButton.dataset.removeCart);
  saveCart(cartItems);
  renderCart();
});

cartClearButton.addEventListener('click', () => {
  saveCart([]);
  renderCart();
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

renderCart();

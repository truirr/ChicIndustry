// Смена картинок
const underImg = document.querySelector('.underimg');
const images = [
  './JPGPNG/unger_img1.png',
  './JPGPNG/unger_img2.png',
  './JPGPNG/unger_img3.png'
];
let index = 0;
underImg.style.backgroundImage = `url('${images[index]}')`;
setInterval(() => {
  index = (index + 1) % images.length;
  underImg.style.backgroundImage = `url('${images[index]}')`;
}, 2000);

// Табы
document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab-item');
  const contents = document.querySelectorAll('.tab-content');
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      const isActive = tab.classList.contains('active');
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => {
        c.classList.remove('active');
        c.style.maxHeight = null;
      });
      if (!isActive) {
        tab.classList.add('active');
        const content = contents[index];
        content.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 35 + 'px';
      }
    });
  });
});

// Кнопка цен
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('priceToggleBtn');
  const wrap = document.getElementById('priceWrap');
  const section = document.querySelector('.price-section');
  const COLLAPSED = 624;
  const setExpandedHeight = () => {
    wrap.style.maxHeight = wrap.scrollHeight + 'px';
  };
  btn.addEventListener('click', () => {
    const isExpanded = wrap.classList.toggle('expanded');
    if (isExpanded) {
      setExpandedHeight();
      btn.textContent = 'ЗГОРНУТИ';
      btn.setAttribute('aria-expanded', 'true');
      section.classList.add('expanded');
    } else {
      wrap.style.maxHeight = COLLAPSED + 'px';
      btn.textContent = 'ПОКАЗАТИ ВСІ ЦІНИ';
      btn.setAttribute('aria-expanded', 'false');
      section.classList.remove('expanded');
    }
  });
  window.addEventListener('resize', () => {
    if (wrap.classList.contains('expanded')) setExpandedHeight();
  });
});

// Модалка
const modal = document.getElementById('contactModal');
const openers = document.querySelectorAll('.main-button img, .why-us-button img, .footer-button img');
const closeBtn = modal.querySelector('.modal__close');
const backdrop = modal.querySelector('.modal__backdrop');
function openModal(e) {
  if (e) e.preventDefault();
  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  modal.classList.remove('is-open');
  document.body.style.overflow = '';
}
openers.forEach(btn => btn.addEventListener('click', openModal));
closeBtn.addEventListener('click', closeModal);
backdrop.addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

// ====== Отправка формы ======
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.modal__form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const body = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch('http://localhost:3001/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.ok) {
        alert('Ваше повідомлення відправлено!');
        form.reset();
        closeModal();
      } else {
        alert('Помилка: ' + (data.error || 'невідомо'));
      }
    } catch (err) {
      alert('Помилка з’єднання');
    }
  });
});

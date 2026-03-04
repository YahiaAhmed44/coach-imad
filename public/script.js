// ================= MOBILE MENU =================
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  hamburger.classList.toggle('active');
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    hamburger.classList.remove('active');
  });
});

// ================= SLIDER FUNCTIONALITY =================
let currentSlide = 0;
const slides = document.querySelectorAll('.about-slide');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

function showSlide(n) {
  // Wrap around
  if (n >= slides.length) currentSlide = 0;
  if (n < 0) currentSlide = slides.length - 1;
  
  // Hide all slides
  slides.forEach(slide => slide.classList.remove('active'));
  dots.forEach(dot => dot.classList.remove('active'));
  
  // Show current slide
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

function nextSlide() {
  currentSlide++;
  showSlide(currentSlide);
}

function prevSlide() {
  currentSlide--;
  showSlide(currentSlide);
}

// Event listeners
nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

// Dots navigation
dots.forEach(dot => {
  dot.addEventListener('click', (e) => {
    currentSlide = parseInt(e.target.dataset.slide);
    showSlide(currentSlide);
  });
});

// Auto-slide (optional)
let autoSlide = setInterval(nextSlide, 5000);

// Pause auto-slide on hover
document.querySelector('.about-slider').addEventListener('mouseenter', () => {
  clearInterval(autoSlide);
});

document.querySelector('.about-slider').addEventListener('mouseleave', () => {
  autoSlide = setInterval(nextSlide, 5000);
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') prevSlide(); // RTL
  if (e.key === 'ArrowLeft') nextSlide(); // RTL
});

// ================= SCROLL TO TOP =================
const scrollTop = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 300) {
    scrollTop.classList.add('visible');
  } else {
    scrollTop.classList.remove('visible');
  }
});

scrollTop.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// ================= HELPER: API SUBMIT =================
async function submitForm(endpoint, data, btn, successMsg) {
  const originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = '⏳ جاري الإرسال...';

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    alert(result.message || successMsg);
    return result.success; // ← أضف هذا
  } catch (err) {
    alert('حدث خطأ في الاتصال، يرجى المحاولة مرة أخرى');
    return false; // ← أضف هذا
  } finally {
    btn.disabled = false;
    btn.textContent = originalText;
  }
}

// ================= FORM SUBMISSIONS =================
document.getElementById('freeBookForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  submitForm(
    '/api/free-book',
    {
      name: form.querySelector('input[type="text"]').value,
      email: form.querySelector('input[type="email"]').value,
    },
    form.querySelector('button[type="submit"]'),
    'شكراً! سيصلك الكتاب المجاني على بريدك الإلكتروني قريباً 📧'
  ).then((success) => {
    if (success) form.reset();
  });
});

document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  submitForm(
    '/api/contact',
    {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      message: document.getElementById('message').value,
    },
    form.querySelector('button[type="submit"]'),
    'شكراً لتواصلك! سأرد عليك في أقرب وقت ممكن 💪'
  ).then((success) => {
    if (success) form.reset(); // ← يُنظّف الفورم فقط عند النجاح
  });
});

// ================= SMOOTH SCROLL =================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});
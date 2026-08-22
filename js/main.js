/* ============================================================
   SOBER LIVING ANGELS — main.js
   ------------------------------------------------------------
   All the interactive bits for the website, organised into
   numbered sections.

   1. Dark / light theme toggle
   2. Mobile menu toggle
   3. Navbar shadow on scroll
   4. Close mobile menu when a link is clicked
   5. Scroll reveal animations
   6. Contact form with EmailJS
   7. Auto-update footer year
   ============================================================ */



/* ------------------------------------------------------------
   1. DARK / LIGHT THEME TOGGLE
------------------------------------------------------------ */
const themeToggle = document.getElementById('theme-toggle');
const rootElement = document.documentElement;

function getInitialTheme() {
  const savedTheme = localStorage.getItem('sla-theme');
  if (savedTheme) return savedTheme;
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

function applyTheme(theme) {
  if (theme === 'dark') {
    rootElement.setAttribute('data-theme', 'dark');
  } else {
    rootElement.removeAttribute('data-theme');
  }
}

applyTheme(getInitialTheme());

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isDark = rootElement.getAttribute('data-theme') === 'dark';
    const nextTheme = isDark ? 'light' : 'dark';
    applyTheme(nextTheme);
    localStorage.setItem('sla-theme', nextTheme);
  });
}


/* ------------------------------------------------------------
   3. MOBILE MENU TOGGLE
------------------------------------------------------------ */
const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.getElementById('nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('navbar__links--open');
    navToggle.classList.toggle('navbar__toggle--open');
  });
}


/* ------------------------------------------------------------
   4. NAVBAR SHADOW ON SCROLL
------------------------------------------------------------ */
const navbar = document.getElementById('navbar');

if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }
  });
}


/* ------------------------------------------------------------
   5. CLOSE MOBILE MENU WHEN A LINK IS CLICKED
------------------------------------------------------------ */
document.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    if (navLinks && navToggle) {
      navLinks.classList.remove('navbar__links--open');
      navToggle.classList.remove('navbar__toggle--open');
    }
  });
});


/* ------------------------------------------------------------
   6. SCROLL REVEAL ANIMATIONS
------------------------------------------------------------ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal--visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));


/* ------------------------------------------------------------
   6. CONTACT FORM (with EmailJS only)
------------------------------------------------------------ */
const contactForm  = document.getElementById('contact-form');
const formFeedback = document.getElementById('form-feedback');

if (contactForm) {
  const submitBtn = contactForm.querySelector('button[type="submit"]');

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name    = contactForm.name.value.trim();
    const email   = contactForm.email.value.trim();
    const phone   = contactForm.phone.value.trim();
    const message = contactForm.message.value.trim();

    if (!name || !email || !message) {
      showFeedback('Please fill in your name, email and message.', 'error');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      showFeedback('Please enter a valid email address.', 'error');
      return;
    }

    // Honeypot check - reject if filled (bot detection)
    const honeypot = contactForm.website.value.trim();
    if (honeypot) {
      console.log('Bot submission blocked');
      showFeedback(`Thank you, ${name}! Your message has been sent — we'll be in touch within 24 hours.`, 'success');
      contactForm.reset();
      return;
    }

    // Disable button while loading
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      // Send email notification via EmailJS
      if (typeof emailjs !== 'undefined' && emailjs.init) {
        emailjs.init('sT8BOAO82_e7-HvFd');
      }
      
      await emailjs.send('service_psd7ic7', 'template_f4kzczf', {
        from_name: name,
        from_email: email,
        phone: phone,
        message: message
      }, 'sT8BOAO82_e7-HvFd');

      showFeedback(`Thank you, ${name}! Your message has been sent — we'll be in touch within 24 hours.`, 'success');
      contactForm.reset();

    } catch (error) {
      console.error('Error sending message:', error);
      showFeedback('Sorry, something went wrong. Please try again or call us directly.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });
}

function showFeedback(text, type) {
  if (formFeedback) {
    formFeedback.textContent = text;
    formFeedback.className = `form__feedback form__feedback--${type}`;
  }
}


/* ------------------------------------------------------------
   8. AUTO-UPDATE FOOTER YEAR
------------------------------------------------------------ */
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

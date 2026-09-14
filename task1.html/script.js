document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-item');

  if (mobileMenu && navLinks) {
    mobileMenu.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  // 2. Real-time Form Validation
  const contactForm = document.getElementById('contactForm');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');
  const formSuccess = document.getElementById('formSuccess');

  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let valid = true;

      // Reset error states
      nameError.style.display = 'none';
      emailError.style.display = 'none';
      messageError.style.display = 'none';
      formSuccess.style.display = 'none';

      // Validate Name
      if (nameInput.value.trim() === '') {
        nameError.style.display = 'block';
        valid = false;
      }

      // Validate Email
      if (!isValidEmail(emailInput.value.trim())) {
        emailError.style.display = 'block';
        valid = false;
      }

      // Validate Message Length
      if (messageInput.value.trim().length < 10) {
        messageError.style.display = 'block';
        valid = false;
      }

      // Form Submission Handling
      if (valid) {
        formSuccess.style.display = 'block';
        contactForm.reset();

        setTimeout(() => {
          formSuccess.style.display = 'none';
        }, 4000);
      }
    });
  }
});

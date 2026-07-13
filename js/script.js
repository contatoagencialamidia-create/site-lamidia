// LAMIDIA — interações do header e hero
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  const header = document.getElementById('siteHeader');

  // Menu mobile
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Fecha o menu ao clicar em um link
    mainNav.querySelectorAll('.main-nav__link').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // Header com leve sombra/opacidade extra ao rolar
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 12) {
        header.style.borderBottomColor = 'rgba(249, 240, 233, 0.18)';
      } else {
        header.style.borderBottomColor = 'rgba(249, 240, 233, 0.08)';
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
});

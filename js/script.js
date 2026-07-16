// URL pública /exec de um Google Apps Script seguro. Mantenha vazia até a integração ser publicada.
const CONTACT_FORM_ENDPOINT = '';

// LAMIDIA — interações do header, hero e formulário de contato
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

  const contactForm = document.getElementById('contactForm');
  const contactSubmit = document.getElementById('contactSubmit');
  const contactStatus = document.getElementById('contactStatus');

  if (contactForm && contactSubmit && contactStatus) {
    const setFormState = (state, message) => {
      contactStatus.classList.toggle('is-error', state === 'error');
      contactStatus.classList.toggle('is-success', state === 'success');
      contactStatus.textContent = message;
      contactSubmit.disabled = state === 'sending';
      contactSubmit.textContent = state === 'sending' ? 'Enviando…' : 'Enviar mensagem';
    };

    contactForm.addEventListener('submit', async event => {
      event.preventDefault();
      setFormState('idle', '');

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        setFormState('error', 'Revise os campos obrigatórios antes de continuar.');
        return;
      }

      if (!CONTACT_FORM_ENDPOINT) {
        setFormState('error', 'O envio pelo site ainda não está disponível. Fale conosco pelo WhatsApp.');
        return;
      }

      setFormState('sending', 'Enviando sua mensagem…');

      try {
        const response = await fetch(CONTACT_FORM_ENDPOINT, {
          method: 'POST',
          body: new URLSearchParams(new FormData(contactForm))
        });
        const result = await response.json();

        if (!response.ok || result.ok !== true) {
          throw new Error('O endpoint não confirmou o recebimento.');
        }

        contactForm.reset();
        setFormState('success', 'Mensagem enviada. Em breve entraremos em contato.');
      } catch (error) {
        console.error('Falha ao enviar o formulário de contato:', error);
        setFormState('error', 'Não foi possível enviar agora. Tente novamente ou fale conosco pelo WhatsApp.');
      }
    });
  }
});

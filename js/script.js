// Mesmo Web App (/exec) do Apps Script usado pela landing page (lp-estrategia-lamidia/script.js).
// O campo "origem" no payload é o que permite ao Apps Script rotear para a aba
// "Leads - Site Institucional" em vez da aba da landing page.
const CONTACT_FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwwVLFfCN-B_tGcHTOBKqoXu52tEJqPTSYPMzKtCogO4blj8R73cUAflZ1IW60rDiyIng/exec';

function fillUtmFields(form) {
  const params = new URLSearchParams(window.location.search);
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach((key) => {
    if (form[key]) form[key].value = params.get(key) || '';
  });
}

function generateEventId() {
  if (window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function trackContactLead() {
  if (typeof fbq === 'function') {
    fbq('track', 'Lead', {}, { eventID: generateEventId() });
  }
}

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
    fillUtmFields(contactForm);

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

      const payload = {
        origem: 'site-institucional',
        nome: contactForm.nome.value.trim(),
        empresa: contactForm.empresa.value.trim(),
        telefone: contactForm.telefone.value.trim(),
        email: contactForm.email.value.trim(),
        mensagem: contactForm.mensagem.value.trim(),
        utm_source: contactForm.utm_source.value,
        utm_medium: contactForm.utm_medium.value,
        utm_campaign: contactForm.utm_campaign.value,
        utm_term: contactForm.utm_term.value,
        utm_content: contactForm.utm_content.value,
      };

      setFormState('sending', 'Enviando sua mensagem…');

      try {
        // mode: 'no-cors' porque o Apps Script Web App não devolve headers CORS;
        // a resposta fica opaca (não dá pra ler o corpo), então sucesso aqui só
        // significa "o request saiu", igual ao comportamento já usado na landing page.
        await fetch(CONTACT_FORM_ENDPOINT, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload),
        });

        trackContactLead();
        contactForm.reset();
        fillUtmFields(contactForm);
        setFormState('success', 'Mensagem enviada. Em breve entraremos em contato.');
      } catch (error) {
        console.error('Falha ao enviar o formulário de contato:', error);
        setFormState('error', 'Não foi possível enviar agora. Tente novamente ou fale conosco pelo WhatsApp.');
      }
    });
  }
});

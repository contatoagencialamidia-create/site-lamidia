// LAMIDIA — carrossel de presença digital (páginas de case)
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.case-carousel').forEach(carousel => {
    const track = carousel.querySelector('.case-carousel__track');
    const prev = carousel.querySelector('.case-carousel__nav--prev');
    const next = carousel.querySelector('.case-carousel__nav--next');
    if (!track) return;

    const scrollAmount = () => track.clientWidth * 0.7;

    prev?.addEventListener('click', () => {
      track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
    });
    next?.addEventListener('click', () => {
      track.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
    });
  });
});

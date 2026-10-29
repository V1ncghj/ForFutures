const progressBar = document.querySelector('#scroll-progress-bar');
let ticking = false;

function updateScrollProgress() {
  const y = window.scrollY;
  const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  progressBar.style.transform = `scaleX(${Math.min(y / scrollable, 1)})`;
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(updateScrollProgress);
    ticking = true;
  }
}, { passive: true });
updateScrollProgress();

const navLinks = [...document.querySelectorAll('.desktop-nav a')];
const observedSections = navLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => {
      const active = link.getAttribute('href') === `#${entry.target.id}`;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  });
}, { rootMargin: '-28% 0px -58% 0px', threshold: 0 });
observedSections.forEach((section) => sectionObserver.observe(section));

const menu = document.querySelector('#mobile-menu');
const menuOpen = document.querySelector('#menu-open');
const menuClose = document.querySelector('#menu-close');
let menuReturnFocus = null;

function getMenuFocusable() {
  return [...menu.querySelectorAll('a, button')].filter((element) => !element.hidden);
}

function openMenu() {
  menuReturnFocus = document.activeElement;
  menu.hidden = false;
  menuOpen.setAttribute('aria-expanded', 'true');
  document.body.classList.add('menu-open');
  menuClose.focus();
}

function closeMenu(restoreFocus = true) {
  if (menu.hidden) return;
  menu.hidden = true;
  menuOpen.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
  if (restoreFocus && menuReturnFocus) menuReturnFocus.focus();
}

menuOpen.addEventListener('click', openMenu);
menuClose.addEventListener('click', () => closeMenu());
menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => closeMenu(false)));
menu.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    event.preventDefault();
    closeMenu();
  }
  if (event.key !== 'Tab') return;
  const focusable = getMenuFocusable();
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 820) closeMenu(false);
});


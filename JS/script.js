// Production clean URLs: /aboutus instead of /aboutus.html.
// Local files and localhost keep the explicit .html URLs for simple previewing.
const isProduction = !['localhost', '127.0.0.1', ''].includes(window.location.hostname);
if (isProduction && window.location.pathname.endsWith('.html')) {
  const cleanPath = window.location.pathname.replace(/\.html$/, '');
  window.history.replaceState(null, '', `${cleanPath}${window.location.search}${window.location.hash}`);
}

if (isProduction) {
  document.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || /^(?:[a-z]+:|\/\/|#)/i.test(href)) return;
    const [path, suffix = ''] = href.split(/(?=[?#])/);
    if (path.endsWith('.html')) link.setAttribute('href', `${path.slice(0, -5)}${suffix}`);
  });
}

const menuButton = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');

function setMenu(open) {
  if (!menuButton || !siteNav) return;
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  siteNav.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
}

menuButton?.addEventListener('click', () => {
  setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
});
siteNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenu(false);
});

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

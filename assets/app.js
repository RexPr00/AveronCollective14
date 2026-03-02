(() => {
  const body = document.body;
  const langMenus = document.querySelectorAll('.lang-menu');
  langMenus.forEach(menu => {
    const btn = menu.querySelector('.lang-toggle');
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      langMenus.forEach(m => m !== menu && m.classList.remove('open'));
      menu.classList.toggle('open');
    });
  });
  document.addEventListener('click', () => langMenus.forEach(m => m.classList.remove('open')));

  const drawer = document.getElementById('mobileDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerOpen = document.getElementById('drawerOpen');
  const drawerClose = document.getElementById('drawerClose');
  const focusableSel = 'a[href], button:not([disabled]), input:not([disabled])';
  let trapRoot = null;

  const lockScroll = (lock) => body.style.overflow = lock ? 'hidden' : '';
  const setDrawer = (open) => {
    body.classList.toggle('drawer-open', open);
    lockScroll(open);
    if (open) {
      trapRoot = drawer;
      const f = drawer.querySelector(focusableSel);
      f && f.focus();
    } else {
      trapRoot = null;
      drawerOpen && drawerOpen.focus();
    }
  };
  drawerOpen && drawerOpen.addEventListener('click', () => setDrawer(true));
  drawerClose && drawerClose.addEventListener('click', () => setDrawer(false));
  drawerBackdrop && drawerBackdrop.addEventListener('click', () => setDrawer(false));

  const faqs = document.querySelectorAll('.faq-item');
  faqs.forEach(item => {
    const btn = item.querySelector('.faq-q');
    const panel = item.querySelector('.faq-answer');
    btn.addEventListener('click', () => {
      faqs.forEach(other => {
        if (other !== item) {
          other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
          other.querySelector('.faq-answer').style.maxHeight = null;
        }
      });
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      panel.style.maxHeight = open ? null : `${panel.scrollHeight}px`;
    });
  });

  const modalWrap = document.getElementById('privacyModal');
  const openModal = document.querySelectorAll('[data-open-privacy]');
  const closeModal = document.querySelectorAll('[data-close-privacy]');
  const setModal = (open) => {
    modalWrap.classList.toggle('open', open);
    lockScroll(open || body.classList.contains('drawer-open'));
    trapRoot = open ? modalWrap.querySelector('.modal') : (body.classList.contains('drawer-open') ? drawer : null);
    if (open) modalWrap.querySelector('[data-close-privacy]').focus();
  };
  openModal.forEach(el => el.addEventListener('click', (e) => { e.preventDefault(); setModal(true); }));
  closeModal.forEach(el => el.addEventListener('click', () => setModal(false)));
  modalWrap && modalWrap.querySelector('.modal-backdrop').addEventListener('click', () => setModal(false));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (modalWrap.classList.contains('open')) setModal(false);
      else if (body.classList.contains('drawer-open')) setDrawer(false);
      langMenus.forEach(m => m.classList.remove('open'));
    }
    if (e.key === 'Tab' && trapRoot) {
      const nodes = [...trapRoot.querySelectorAll(focusableSel)];
      if (!nodes.length) return;
      const first = nodes[0], last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  const reveal = document.querySelectorAll('[data-reveal]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  reveal.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity .4s ease, transform .4s ease';
    io.observe(el);
  });
})();

// Common utilities loaded on every page

// wait for dom ready
function initCommon() {
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.getElementById('navList');
  const currentPath = window.location.pathname;

  if (navToggle && navList) {
    // add a little <div> inside button for hamburger lines
    if (!navToggle.querySelector('div'))
      navToggle.appendChild(document.createElement('div'));

    // backdrop for closing by clicking outside the drawer
    const backdrop = document.querySelector('.nav-backdrop');

    function closeMenu() {
      navList.classList.remove('open');
      navToggle.classList.remove('open');
      if (backdrop) backdrop.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }

    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.addEventListener('click', () => {
      // use "open" class on the list so CSS responsive rules apply
      const expanded = navList.classList.toggle('open');
      navToggle.classList.toggle('open', expanded);
      if (backdrop) backdrop.classList.toggle('open', expanded);
      navToggle.setAttribute('aria-expanded', expanded);
    });

    // close the menu when a navigation link is tapped
    navList.querySelectorAll('a').forEach((a) => {
      // set active class on current link
      if (a.pathname === currentPath) {
        a.classList.add('active');
      }

      a.addEventListener('click', () => {
        closeMenu();
        navList
          .querySelectorAll('a')
          .forEach((link) => link.classList.remove('active'));
        a.classList.add('active');
      });
    });

    // clicking backdrop closes drawer
    if (backdrop) {
      backdrop.addEventListener('click', closeMenu);
    }
  }

  const deviceIdEl = document.getElementById('device-id');
  if (deviceIdEl) {
    fetch('/device-id')
      .then((res) => {
        if (!res.ok) throw new Error('network');
        return res.text();
      })
      .then((text) => {
        deviceIdEl.textContent = text;
      })
      .catch((err) => {
        console.error('could not fetch device id', err);
      });
  }
}

document.addEventListener('DOMContentLoaded', initCommon);

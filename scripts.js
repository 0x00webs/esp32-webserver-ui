// Common utilities loaded on every page

// wait for dom ready
function initCommon() {
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.getElementById('navList');

  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      navList.classList.toggle('active');
    });
  }

  const deviceIdEl = document.getElementById('device-id');
  if (deviceIdEl) {
    fetch('/device-id')
      .then(res => {
        if (!res.ok) throw new Error('network');
        return res.text();
      })
      .then(text => {
        deviceIdEl.textContent = text;
      })
      .catch(err => {
        console.error('could not fetch device id', err);
      });
  }
}

document.addEventListener('DOMContentLoaded', initCommon);

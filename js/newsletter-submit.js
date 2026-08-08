(function () {
  const _msg = new URLSearchParams(window.location.search).get('msg');
  if (_msg) {
    document.getElementById('access-form').style.display = 'none';
    const el = _msg.toLowerCase().includes('confirmed')
      ? document.getElementById('success-msg')
      : document.getElementById('error-msg');
    el.style.display = 'block';
  }

  function handleSubmit() {
    const email = document.getElementById('access-email').value.trim();
    if (!email || !email.includes('@')) return;
    document.getElementById('modal-error').style.display = 'none';
    document.getElementById('modal-meta').classList.add('active');
    document.getElementById('meta-name').focus();
  }

  function closeModal() {
    document.getElementById('modal-meta').classList.remove('active');
    const btn = document.getElementById('access-btn');
    btn.disabled = false;
    btn.textContent = 'Request';
  }

  function closeConfirm() {
    document.getElementById('modal-confirm').classList.remove('active');
    document.getElementById('access-form').style.display = 'none';
    document.getElementById('success-msg').style.display = 'block';
  }

  async function submitMeta() {
    const btn = document.getElementById('meta-submit');
    btn.disabled = true;
    btn.textContent = '...';
    document.getElementById('modal-error').style.display = 'none';

    const params = new URLSearchParams({
      email:    document.getElementById('access-email').value.trim(),
      name:     document.getElementById('meta-name').value.trim(),
      signal:   document.getElementById('meta-signal').value.trim(),
      interest: document.getElementById('meta-interest').value.trim(),
      referrer: document.referrer || '',
      utm_source:   new URLSearchParams(location.search).get('utm_source')   || '',
      utm_medium:   new URLSearchParams(location.search).get('utm_medium')   || '',
      utm_campaign: new URLSearchParams(location.search).get('utm_campaign') || '',
      source: location.hostname,
    });

    try {
      const res = await fetch('https://script.google.com/macros/s/AKfycbys7jnM9zQ_B6qirWBiqc8baRN6T7o9mPuW0uclyuvmiQMxVW-4fCnemZ5-9n6zzwEX3A/exec', {
        method: 'POST',
        body: params
      });
      const data = JSON.parse(await res.text());
      if (data.ok) {
        document.getElementById('modal-meta').classList.remove('active');
        document.getElementById('modal-confirm').classList.add('active');
      } else {
        document.getElementById('modal-error').style.display = 'block';
        btn.disabled = false;
        btn.textContent = 'Proceed';
      }
    } catch (err) {
      console.error(err);
      document.getElementById('modal-error').style.display = 'block';
      btn.disabled = false;
      btn.textContent = 'Proceed';
    }
  }

  document.getElementById('modal-meta').addEventListener('keydown', e => {
    if (e.key === 'Enter') submitMeta();
    if (e.key === 'Escape') closeModal();
  });

  window.handleSubmit = handleSubmit;
  window.closeModal = closeModal;
  window.closeConfirm = closeConfirm;
  window.submitMeta = submitMeta;
})();

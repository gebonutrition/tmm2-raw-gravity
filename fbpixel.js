(function () {
  const params = new URLSearchParams(window.location.search);
  const fbPixelId = params.get('fbpixel');

  if (!fbPixelId) {
    return;
  }

  !function (f, b, e, v, n, t, s) {
    if (f.fbq) return;

    n = f.fbq = function () {
      n.callMethod
        ? n.callMethod.apply(n, arguments)
        : n.queue.push(arguments);
    };

    if (!f._fbq) f._fbq = n;

    n.push = n;
    n.loaded = true;
    n.version = '2.0';
    n.queue = [];

    t = b.createElement(e);
    t.async = true;
    t.src = v;

    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);

  }(
    window,
    document,
    'script',
    'https://connect.facebook.net/en_US/fbevents.js'
  );

  window.fbq('init', fbPixelId);
  window.fbq('track', 'PageView');

  let leadTracked = false;

  window.rawGravityTrackMetaLead = function () {
    if (leadTracked) return;

    leadTracked = true;

    if (window.fbq) {
      window.fbq('track', 'Lead');
      window.fbq('track', 'Contact');
    }
  };
})();
(function () {
  const params = new URLSearchParams(window.location.search);
  const pixelId = params.get('pixel');

  if (!pixelId) {
    return;
  }

  !function (w, d, t) {
    w.TiktokAnalyticsObject = t;

    const ttq = w[t] = w[t] || [];

    ttq.methods = [
      'page',
      'track',
      'identify',
      'instances',
      'debug',
      'on',
      'off',
      'once',
      'ready',
      'alias',
      'group',
      'enableCookie',
      'disableCookie'
    ];

    ttq.setAndDefer = function (t, e) {
      t[e] = function () {
        t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
      };
    };

    for (let i = 0; i < ttq.methods.length; i++) {
      ttq.setAndDefer(ttq, ttq.methods[i]);
    }

    ttq.instance = function (id) {
      const instance = ttq._i[id] || [];

      for (let i = 0; i < ttq.methods.length; i++) {
        ttq.setAndDefer(instance, ttq.methods[i]);
      }

      return instance;
    };

    ttq.load = function (id, options) {
      const src =
        'https://analytics.tiktok.com/i18n/pixel/events.js';

      ttq._i = ttq._i || {};
      ttq._i[id] = [];
      ttq._i[id]._u = src;

      ttq._t = ttq._t || {};
      ttq._t[id] = +new Date;

      ttq._o = ttq._o || {};
      ttq._o[id] = options || {};

      const script = d.createElement('script');
      script.async = true;
      script.src = src + '?sdkid=' + id + '&lib=' + t;

      const first = d.getElementsByTagName('script')[0];
      first.parentNode.insertBefore(script, first);
    };

    ttq.load(pixelId);
    ttq.page();

  }(window, document, 'ttq');

  let leadTracked = false;

  window.rawGravityTrackTikTokLead = function () {
    if (leadTracked) return;

    leadTracked = true;

    if (window.ttq) {
      window.ttq.track('SubmitForm');
      window.ttq.track('Contact');
    }
  };
})();
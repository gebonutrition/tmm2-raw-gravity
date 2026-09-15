(function () {
  const agencyPixelId = "1632582321547641";
  const queryPixelId = new URLSearchParams(window.location.search).get("fbpixel");

  const pixelIds = [agencyPixelId, queryPixelId]
    .filter(Boolean)
    .filter((id, index, arr) => arr.indexOf(id) === index);

  if (!pixelIds.length) return;

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
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = true;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  }(
    window,
    document,
    "script",
    "https://connect.facebook.net/en_US/fbevents.js"
  );

  pixelIds.forEach((pixelId) => {
    fbq("init", pixelId);
    fbq("trackSingle", pixelId, "PageView");
  });

  let leadTracked = false;

  window.rawGravityTrackMetaLead = function () {
    if (leadTracked) return;
    leadTracked = true;

    if (!queryPixelId || typeof fbq !== "function") return;

    fbq("trackSingle", queryPixelId, "Lead", {
      content_name: "25% OFF Promo Code",
      currency: "USD",
      value: 0
    });

    fbq("trackSingle", queryPixelId, "Contact");
  };
})();
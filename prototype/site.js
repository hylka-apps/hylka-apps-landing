/* ============================================================
   site.js — shared chrome for every Hylka Apps page
   - Locale handling (?lang=en|uk, default en, EN fallback)
   - Header (brand, nav, language switcher, CTA, hamburger)
   - Mobile drawer
   - Footer
   - Contact modal (intent tabs + form, reused on every page)
   - Tiny Markdown renderer (Terms / Privacy)
   Each page sets window.HILKA_PAGE = { active: 'apps'|'about'|... }
   before this script loads (optional).
   ============================================================ */
(function () {
  "use strict";

  /* ---------------- locale ---------------- */
  var params = new URLSearchParams(location.search);
  var LANG = params.get("lang") === "uk" ? "uk" : "en";
  document.documentElement.lang = LANG;

  var I18N = window.HILKA_I18N || { en: {}, uk: {} };
  function t(key) {
    var v = (I18N[LANG] && I18N[LANG][key]);
    if (v == null) v = (I18N.en && I18N.en[key]); // EN fallback
    return v == null ? "" : v;
  }
  // expose for pages
  window.HILKA = { lang: LANG, t: t };

  // build a same-page link that preserves the chosen locale
  function withLang(href) {
    if (LANG === "en") return href;
    if (href.indexOf("#") === 0) return href; // pure anchor
    var hashIdx = href.indexOf("#");
    var hash = "";
    if (hashIdx >= 0) { hash = href.slice(hashIdx); href = href.slice(0, hashIdx); }
    var sep = href.indexOf("?") >= 0 ? "&" : "?";
    return href + sep + "lang=uk" + hash;
  }
  window.HILKA.withLang = withLang;

  /* ---------------- apply data-i18n on existing DOM ---------------- */
  function applyI18n(root) {
    (root || document).querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var v = (I18N[LANG] && I18N[LANG][key]);
      if (v == null) return; // keep EN text already in HTML (fallback)
      el.textContent = v;
    });
    (root || document).querySelectorAll("[data-i18n-ph]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-ph");
      var v = (I18N[LANG] && I18N[LANG][key]);
      if (v != null) el.setAttribute("placeholder", v);
    });
  }

  /* ---------------- header ---------------- */
  var PAGE = window.HILKA_PAGE || {};
  var active = PAGE.active || "";

  function navLinks(prefix) {
    var items = [
      { key: "nav.apps", href: "index.html#apps", id: "apps" },
      { key: "nav.more", href: "more.html", id: "more" },
      { key: "nav.about", href: "about.html", id: "about" },
      { key: "nav.contact", href: "contact.html", id: "contact" }
    ];
    return items.map(function (it) {
      var cls = (active === it.id) ? ' class="active"' : "";
      return '<a href="' + withLang(it.href) + '"' + cls + ' data-i18n="' + it.key + '">' + t(it.key) + "</a>";
    }).join(prefix || "");
  }

  function headerHTML() {
    return '' +
      '<header class="site-header"><div class="wrap">' +
        '<a class="brand" href="' + withLang("index.html") + '" aria-label="Hylka Apps home">' +
          '<span class="logo-mark">H</span><span>Hylka Apps</span>' +
        '</a>' +
        '<nav class="nav" aria-label="Primary">' + navLinks() + '</nav>' +
        '<div class="header-right">' +
          '<div class="lang" id="langWrap">' +
            '<button class="lang-btn" id="langBtn" aria-haspopup="true" aria-expanded="false">' +
              '<span class="flag">' + (LANG === "uk" ? "🇺🇦" : "🇬🇧") + '</span>' +
              '<span>' + (LANG === "uk" ? "UK" : "EN") + '</span>' +
              '<svg class="chev" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
            '</button>' +
            '<div class="lang-menu" role="menu">' +
              '<button data-setlang="en" class="' + (LANG === "en" ? "sel" : "") + '"><span class="flag">🇬🇧</span> English</button>' +
              '<button data-setlang="uk" class="' + (LANG === "uk" ? "sel" : "") + '"><span class="flag">🇺🇦</span> Українська</button>' +
            '</div>' +
          '</div>' +
          '<a class="btn btn-primary btn-sm header-cta-desktop" href="' + withLang("index.html#apps") + '" data-i18n="header.cta">' + t("header.cta") + '</a>' +
          '<button class="hamburger" id="hamburger" aria-label="Open menu"><span></span></button>' +
        '</div>' +
      '</div></header>' +
      drawerHTML();
  }

  function drawerHTML() {
    return '' +
      '<div class="drawer-overlay" id="drawerOverlay"></div>' +
      '<aside class="drawer" id="drawer" aria-hidden="true">' +
        '<div class="drawer-top">' +
          '<a class="brand" href="' + withLang("index.html") + '"><span class="logo-mark">H</span><span>Hylka Apps</span></a>' +
          '<button class="drawer-close" id="drawerClose" aria-label="Close menu">✕</button>' +
        '</div>' +
        '<nav>' + navLinks("") + '</nav>' +
        '<div class="drawer-foot">' +
          '<a class="btn btn-primary" href="' + withLang("index.html#apps") + '" data-i18n="header.cta">' + t("header.cta") + '</a>' +
          '<div class="drawer-langs">' +
            '<button data-setlang="en" class="' + (LANG === "en" ? "sel" : "") + '">🇬🇧 EN</button>' +
            '<button data-setlang="uk" class="' + (LANG === "uk" ? "sel" : "") + '">🇺🇦 UK</button>' +
          '</div>' +
        '</div>' +
      '</aside>';
  }

  /* ---------------- footer ---------------- */
  function footerHTML() {
    function L(href, key) { return '<a href="' + withLang(href) + '" data-i18n="' + key + '">' + t(key) + "</a>"; }
    return '' +
      '<footer class="site-footer">' +
        '<div class="wrap"><div class="footer-grid">' +
          '<div class="footer-brand">' +
            '<a class="brand" href="' + withLang("index.html") + '"><span class="logo-mark">H</span><span>Hylka Apps</span></a>' +
            '<p data-i18n="footer.tagline">Small, considered iOS apps.</p>' +
          '</div>' +
          '<div class="footer-col"><h4 data-i18n="footer.col.apps">Apps</h4><ul>' +
            '<li><a href="' + withLang("focusly.html") + '">Focusly</a></li>' +
          '</ul></div>' +
          '<div class="footer-col"><h4 data-i18n="footer.col.company">Company</h4><ul>' +
            '<li>' + L("about.html", "footer.link.about") + '</li>' +
            '<li>' + L("more.html", "footer.link.more") + '</li>' +
            '<li>' + L("contact.html", "footer.link.contact") + '</li>' +
          '</ul></div>' +
          '<div class="footer-col"><h4 data-i18n="footer.col.legal">Legal</h4><ul>' +
            '<li>' + L("terms.html", "footer.link.terms") + '</li>' +
            '<li>' + L("privacy.html", "footer.link.privacy") + '</li>' +
            '<li><a href="mailto:hello@hilkaaps.com">hello@hilkaaps.com</a></li>' +
          '</ul></div>' +
        '</div></div>' +
        '<div class="footer-bottom"><div class="wrap">' +
          '<p data-i18n="footer.copyright">© 2026 Hylka Apps · All rights reserved.</p>' +
          '<p data-i18n="footer.legalnote">Made with care for the things that matter.</p>' +
        '</div></div>' +
      '</footer>';
  }

  /* ---------------- contact modal (shared) ---------------- */
  function modalHTML() {
    return '' +
      '<div class="modal-overlay" id="contactModal">' +
        '<div class="modal" role="dialog" aria-modal="true" aria-label="Get in touch">' +
          '<button class="modal-close" id="modalClose" aria-label="Close">✕</button>' +
          '<h2>Get in touch</h2>' +
          '<p class="modal-sub">Have an idea or hit a snag? Tell us — we read everything.</p>' +
          '<div id="modalFormHost"></div>' +
        '</div>' +
      '</div>';
  }

  // Build the intent-tabs + form markup; `idp` prefixes ids so the
  // page form and modal form don't collide.
  window.HILKA.contactFormHTML = function (idp) {
    idp = idp || "";
    return '' +
      '<div class="intent-tabs" data-intents>' +
        '<button type="button" class="intent sel" data-intent="suggestion">' +
          '<span class="ic" style="background:rgba(0,136,255,.12);color:#0088FF">💡</span>' +
          '<span><span class="t">Suggest a feature</span><span class="d">Share an idea to make it better.</span></span>' +
        '</button>' +
        '<button type="button" class="intent" data-intent="complaint">' +
          '<span class="ic" style="background:rgba(229,84,75,.12);color:#E5544B">⚠️</span>' +
          '<span><span class="t">Report a problem</span><span class="d">Something not working? Let us know.</span></span>' +
        '</button>' +
      '</div>' +
      '<form class="form" novalidate data-contact>' +
        '<input type="hidden" name="type" value="suggestion">' +
        '<div class="honeypot" aria-hidden="true"><label>Leave this empty<input type="text" name="company" tabindex="-1" autocomplete="off"></label></div>' +
        '<div class="field" data-field="name"><label>Name <span class="req">*</span></label>' +
          '<input type="text" name="name" placeholder="Your name" autocomplete="name"><span class="err-msg">Please enter your name.</span></div>' +
        '<div class="field" data-field="email"><label>Email <span class="req">*</span></label>' +
          '<input type="email" name="email" placeholder="you@example.com" autocomplete="email"><span class="err-msg">Please enter a valid email.</span></div>' +
        '<div class="field" data-field="subject"><label>Subject</label>' +
          '<input type="text" name="subject" placeholder="Short summary"></div>' +
        '<div class="field" data-field="message"><label>Message <span class="req">*</span></label>' +
          '<textarea name="message" maxlength="500" placeholder="Tell us more…"></textarea>' +
          '<div class="counter"><span data-count>0</span>/500</div>' +
          '<span class="err-msg">Please write a short message.</span></div>' +
        '<button type="submit" class="btn btn-primary btn-lg">Send message</button>' +
        '<div class="form-status" role="status"></div>' +
        '<p class="form-note">Prefer email? Reach us at <a class="textlink" href="mailto:hello@hilkaaps.com">hello@hilkaaps.com</a>.</p>' +
      '</form>';
  };

  // Wire a contact form's behaviour (intent tabs, counter, validation, submit)
  window.HILKA.wireContactForm = function (scope) {
    var form = scope.querySelector("[data-contact]");
    if (!form) return;
    var typeInput = form.querySelector('input[name="type"]');

    // intent tabs
    var tabs = scope.querySelectorAll("[data-intents] .intent");
    tabs.forEach(function (btn) {
      btn.addEventListener("click", function () {
        tabs.forEach(function (b) { b.classList.remove("sel"); });
        btn.classList.add("sel");
        if (typeInput) typeInput.value = btn.getAttribute("data-intent");
      });
    });

    // char counter
    var ta = form.querySelector('textarea[name="message"]');
    var count = form.querySelector("[data-count]");
    if (ta && count) ta.addEventListener("input", function () { count.textContent = ta.value.length; });

    // clear error on input
    form.querySelectorAll("input, textarea").forEach(function (el) {
      el.addEventListener("input", function () {
        var f = el.closest(".field"); if (f) f.classList.remove("err");
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.querySelector(".form-status");
      status.className = "form-status";

      // honeypot — silently "succeed" for bots
      if (form.querySelector('input[name="company"]').value.trim() !== "") {
        status.classList.add("ok"); status.textContent = "Thanks! Your message is on its way to us.";
        return;
      }

      var ok = true;
      function check(name, valid) {
        var f = form.querySelector('[data-field="' + name + '"]');
        if (!valid) { f.classList.add("err"); ok = false; } else { f.classList.remove("err"); }
      }
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var msg = form.message.value.trim();
      check("name", name.length > 0);
      check("email", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
      check("message", msg.length > 0);

      if (!ok) {
        status.classList.add("bad");
        status.textContent = "Something went wrong — please check the highlighted fields.";
        return;
      }

      // simulate a POST to the form endpoint → hello@hilkaaps.com
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true; btn.style.opacity = ".6"; btn.textContent = "Sending…";
      setTimeout(function () {
        btn.disabled = false; btn.style.opacity = ""; btn.textContent = "Send message";
        status.classList.add("ok");
        status.textContent = "Thanks! Your message is on its way to us.";
        form.reset();
        var c = form.querySelector("[data-count]"); if (c) c.textContent = "0";
      }, 800);
    });
  };

  /* ---------------- tiny markdown renderer ---------------- */
  // Supports: # / ## headings, paragraphs, - lists, links [t](u),
  // _em_ / *em*, **strong**, inline `code`. Enough for legal docs.
  window.HILKA.renderMarkdown = function (md) {
    function inline(s) {
      s = s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      s = s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      s = s.replace(/`([^`]+?)`/g, "<code>$1</code>");
      s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
      s = s.replace(/(^|[^*])\*([^*]+?)\*/g, "$1<em>$2</em>");
      s = s.replace(/_([^_]+?)_/g, "<em>$1</em>");
      return s;
    }
    var lines = md.replace(/\r/g, "").split("\n");
    var out = [], list = null, toc = [], i, line, txt, id;
    function flush() { if (list) { out.push("<ul>" + list.join("") + "</ul>"); list = null; } }
    for (i = 0; i < lines.length; i++) {
      line = lines[i];
      if (/^\s*$/.test(line)) { flush(); continue; }
      if (/^#\s+/.test(line)) { flush(); out.push("<h1>" + inline(line.replace(/^#\s+/, "")) + "</h1>"); }
      else if (/^##\s+/.test(line)) {
        flush(); txt = line.replace(/^##\s+/, ""); id = txt.toLowerCase().replace(/[^\w]+/g, "-").replace(/^-|-$/g, "");
        toc.push({ id: id, txt: txt });
        out.push('<h2 id="' + id + '">' + inline(txt) + "</h2>");
      }
      else if (/^_.*_$/.test(line.trim())) { flush(); out.push('<p class="updated">' + inline(line.trim().replace(/^_|_$/g, "")) + "</p>"); }
      else if (/^[-*]\s+/.test(line)) { if (!list) list = []; list.push("<li>" + inline(line.replace(/^[-*]\s+/, "")) + "</li>"); }
      else { flush(); out.push("<p>" + inline(line) + "</p>"); }
    }
    flush();
    return { html: out.join("\n"), toc: toc };
  };

  /* ---------------- mount + wire ---------------- */
  function mount() {
    var h = document.getElementById("site-header");
    if (h) h.innerHTML = headerHTML();
    var f = document.getElementById("site-footer");
    if (f) f.innerHTML = footerHTML();

    // modal host (append once)
    var modalHost = document.createElement("div");
    modalHost.innerHTML = modalHTML();
    document.body.appendChild(modalHost.firstChild);
    var modalFormHost = document.getElementById("modalFormHost");
    if (modalFormHost) {
      modalFormHost.innerHTML = window.HILKA.contactFormHTML("m");
      window.HILKA.wireContactForm(modalFormHost);
    }

    applyI18n(document);
    rewriteLocalLinks();
    wireChrome();
  }

  // Preserve the chosen locale across in-content links to local pages.
  function rewriteLocalLinks() {
    if (LANG === "en") return;
    var localPages = /(^|\/)(index|focusly|more|about|contact|terms|privacy)\.html(\?|#|$)/;
    document.querySelectorAll("main a[href], .modal a[href]").forEach(function (a) {
      var href = a.getAttribute("href");
      if (!href) return;
      if (/^(https?:|mailto:|tel:)/.test(href)) return;
      if (href.indexOf("#") === 0) return; // pure anchor stays
      if (a.getAttribute("data-no-lang") != null) return;
      if (localPages.test(href) && href.indexOf("lang=") === -1) {
        a.setAttribute("href", withLang(href));
      }
    });
  }

  function wireChrome() {
    // language switching
    document.querySelectorAll("[data-setlang]").forEach(function (b) {
      b.addEventListener("click", function () {
        var lang = b.getAttribute("data-setlang");
        var url = new URL(location.href);
        if (lang === "en") url.searchParams.delete("lang");
        else url.searchParams.set("lang", "uk");
        location.href = url.toString();
      });
    });

    // lang dropdown
    var langWrap = document.getElementById("langWrap");
    var langBtn = document.getElementById("langBtn");
    if (langBtn) {
      langBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        langWrap.classList.toggle("open");
        langBtn.setAttribute("aria-expanded", langWrap.classList.contains("open"));
      });
      document.addEventListener("click", function () { langWrap.classList.remove("open"); });
    }

    // drawer
    var drawer = document.getElementById("drawer");
    var overlay = document.getElementById("drawerOverlay");
    function openDrawer() { drawer.classList.add("open"); overlay.classList.add("open"); drawer.setAttribute("aria-hidden", "false"); }
    function closeDrawer() { drawer.classList.remove("open"); overlay.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); }
    var hb = document.getElementById("hamburger");
    if (hb) hb.addEventListener("click", openDrawer);
    var dc = document.getElementById("drawerClose");
    if (dc) dc.addEventListener("click", closeDrawer);
    if (overlay) overlay.addEventListener("click", closeDrawer);
    drawer && drawer.querySelectorAll("nav a").forEach(function (a) { a.addEventListener("click", closeDrawer); });

    // contact modal open/close (any [data-open-contact])
    var modal = document.getElementById("contactModal");
    function openModal() { modal.classList.add("open"); document.body.style.overflow = "hidden"; }
    function closeModal() { modal.classList.remove("open"); document.body.style.overflow = ""; }
    document.querySelectorAll("[data-open-contact]").forEach(function (b) {
      b.addEventListener("click", function (e) { e.preventDefault(); openModal(); });
    });
    var mClose = document.getElementById("modalClose");
    if (mClose) mClose.addEventListener("click", closeModal);
    if (modal) modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();

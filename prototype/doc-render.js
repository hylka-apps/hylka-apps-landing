/* Render the stored Markdown (#md-source) into #doc, build the TOC,
   and highlight the active section on scroll. Shared by terms + privacy. */
(function () {
  var src = document.getElementById("md-source");
  var doc = document.getElementById("doc");
  var tocEl = document.getElementById("toc");
  if (!src || !doc || !window.HILKA) return;

  var rendered = window.HILKA.renderMarkdown(src.textContent.trim());
  doc.innerHTML = rendered.html;

  // table of contents from H2s
  tocEl.innerHTML = rendered.toc.map(function (h) {
    return '<li><a href="#' + h.id + '">' + h.txt + "</a></li>";
  }).join("");

  // smooth-scroll TOC links + active highlight
  var links = Array.prototype.slice.call(tocEl.querySelectorAll("a"));
  links.forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      var target = document.getElementById(a.getAttribute("href").slice(1));
      if (target) window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 90, behavior: "smooth" });
    });
  });

  var headings = rendered.toc.map(function (h) { return document.getElementById(h.id); }).filter(Boolean);
  function onScroll() {
    var pos = window.scrollY + 110, current = null;
    headings.forEach(function (h) { if (h.offsetTop <= pos) current = h.id; });
    links.forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + current); });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

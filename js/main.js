/* ジンジの自動化ラボ — main.js（依存なし） */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1. スクロールで要素をふわっと出す */
  var items = document.querySelectorAll('[data-reveal]');
  // 同じ親の中で順番に少しずつ遅らせる
  items.forEach(function (el) {
    var sibs = Array.prototype.filter.call(el.parentElement.children, function (c) { return c.hasAttribute('data-reveal'); });
    var i = sibs.indexOf(el);
    if (i > 0) el.style.setProperty('--d', Math.min(i * 0.08, 0.4) + 's');
  });

  // ヒーローは最初の画面なので、スクロールを待たずに順番に表示する
  var heroItems = document.querySelectorAll('.hero [data-reveal]');
  heroItems.forEach(function (el, i) {
    el.style.setProperty('--d', (0.1 + i * 0.08).toFixed(2) + 's');
    requestAnimationFrame(function () { el.classList.add('is-in'); });
  });
  items = Array.prototype.filter.call(items, function (el) { return !el.closest('.hero'); });

  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* 2. ヘッダーの背景と、進め方の線をスクロールに合わせる */
  var header = document.querySelector('.site-header');
  var flow = document.querySelector('.flow');
  var steps = flow ? flow.querySelectorAll('.step') : [];
  var heroText = document.querySelector('[data-parallax="text"]');
  var heroVisual = document.querySelector('[data-parallax="visual"]');
  var ticking = false;

  function update() {
    ticking = false;
    var y = window.scrollY || window.pageYOffset;
    header.classList.toggle('is-scrolled', y > 24);

    if (flow) {
      var r = flow.getBoundingClientRect();
      var vh = window.innerHeight;
      var p = (vh * 0.7 - r.top) / r.height;
      p = Math.max(0, Math.min(1, p));
      flow.style.setProperty('--p', p.toFixed(3));
      // 線が届いた番号から色をつける
      var lineY = r.top + r.height * p;
      steps.forEach(function (st) {
        var n = st.querySelector('.step__no').getBoundingClientRect();
        st.classList.toggle('is-on', p > 0 && n.top + n.height / 2 <= lineY + 1);
      });
    }

    // ヒーローだけ、ほんの少し奥行きを出す（文字と図で速度を変える）
    if (!reduce && heroText && y < window.innerHeight * 1.2) {
      heroText.style.transform = 'translate3d(0,' + (y * 0.12).toFixed(1) + 'px,0)';
      heroText.style.opacity = Math.max(0, 1 - y / (window.innerHeight * 0.9)).toFixed(3);
      if (heroVisual) heroVisual.style.transform = 'translate3d(0,' + (y * -0.06).toFixed(1) + 'px,0)';
    }
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
})();

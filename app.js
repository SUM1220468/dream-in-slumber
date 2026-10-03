(function () {
  'use strict';

  /* ===== 路由：hash 切换页面 ===== */
  var routes = ['home', 'rules', 'beginner', 'squad', 'warframes', 'weapons', 'slang'];
  var pages = {};
  var navItems = {};

  function currentRoute() {
    var h = location.hash.replace(/^#\/?/, '');
    var base = h.split('-')[0];
    return routes.indexOf(base) !== -1 ? base : 'home';
  }

  function activate(route) {
    routes.forEach(function (r) {
      var page = document.getElementById('page-' + r);
      var nav = document.querySelector('.nav-item[data-route="' + r + '"]');
      if (!page) return;
      if (r === route) {
        page.classList.add('active');
        if (nav) nav.classList.add('active');
      } else {
        page.classList.remove('active');
        if (nav) nav.classList.remove('active');
      }
    });
    // 页面内锚点滚动（若 hash 指向子锚点）
    var h = location.hash.replace(/^#\/?/, '');
    if (h.indexOf('-') !== -1) {
      var anchor = document.getElementById(h);
      if (anchor) {
        setTimeout(function () {
          var top = anchor.getBoundingClientRect().top + window.scrollY - 86;
          window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
        }, 80);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  window.addEventListener('hashchange', function () {
    activate(currentRoute());
  });

  // 初始化
  document.querySelectorAll('.page').forEach(function (p) {
    pages[p.dataset.route] = p;
  });
  document.querySelectorAll('.nav-item').forEach(function (n) {
    navItems[n.dataset.route] = n;
  });
  activate(currentRoute());

  /* ===== 虚空星座动态背景 ===== */
  var canvas = document.getElementById('voidField');
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var W, H;
    var nodes = [];
    var links = [];
    var MAX_NODES = 70;
    var linkDist = 150;

    function resize() {
      var dpr = window.devicePixelRatio || 1;
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function makeNode(x, y) {
      return {
        x: x, y: y,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.6 + 0.6,
        phase: Math.random() * Math.PI * 2
      };
    }

    function initNodes() {
      nodes = [];
      for (var i = 0; i < MAX_NODES; i++) {
        nodes.push(makeNode(Math.random() * W, Math.random() * H));
      }
    }

    function frame(t) {
      ctx.clearRect(0, 0, W, H);

      nodes.forEach(function (n) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      });

      // 连线
      ctx.lineWidth = 0.6;
      for (var i = 0; i < nodes.length; i++) {
        for (var j = i + 1; j < nodes.length; j++) {
          var a = nodes[i], b = nodes[j];
          var dx = a.x - b.x, dy = a.y - b.y;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d < linkDist) {
            var alpha = (1 - d / linkDist) * 0.16;
            ctx.strokeStyle = 'rgba(111,227,240,' + alpha.toFixed(3) + ')';
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // 节点
      var tt = t / 1000;
      nodes.forEach(function (n) {
        var pulse = 0.45 + 0.55 * Math.sin(tt * 1.2 + n.phase);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(168,240,247,' + (0.25 + pulse * 0.25).toFixed(3) + ')';
        ctx.fill();
      });

      requestAnimationFrame(frame);
    }

    resize();
    initNodes();
    requestAnimationFrame(frame);
    window.addEventListener('resize', function () {
      resize();
      initNodes();
    });
  }
})();

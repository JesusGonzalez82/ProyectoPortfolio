(function () {
  "use strict";

  /* ===== Theme toggle ===== */
  var root = document.documentElement;
  var themeToggle = document.getElementById("theme-toggle");

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }

  themeToggle.addEventListener("click", function () {
    var current = root.getAttribute("data-theme");
    applyTheme(current === "dark" ? "light" : "dark");
  });

  /* ===== Language toggle ===== */
  var langButtons = document.querySelectorAll("[data-lang-btn]");

  function applyLang(lang) {
    root.setAttribute("lang", lang);
    localStorage.setItem("lang", lang);
    langButtons.forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-lang-btn") === lang);
    });
    themeToggle.setAttribute("aria-label", lang === "es" ? "Cambiar tema" : "Toggle theme");
    navToggle.setAttribute(
      "aria-label",
      navToggle.getAttribute("aria-expanded") === "true"
        ? lang === "es" ? "Cerrar menú" : "Close menu"
        : lang === "es" ? "Abrir menú" : "Open menu"
    );
    runTerminal(lang);
  }

  langButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      applyLang(btn.getAttribute("data-lang-btn"));
    });
  });

  /* ===== Mobile nav ===== */
  var navToggle = document.getElementById("nav-toggle");
  var navLinks = document.getElementById("nav-links");

  navToggle.addEventListener("click", function () {
    var isOpen = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  navLinks.querySelectorAll(".nav-link").forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ===== Terminal typewriter ===== */
  var terminalBody = document.getElementById("terminal-body");
  var terminalTimer = null;
  var terminalRunId = 0;

  var terminalScript = {
    es: [
      { prompt: "$ whoami", output: "jesus_gonzalez_blanco" },
      { prompt: "$ cat role.txt", output: "DevOps Engineer · Full Stack Developer" },
      { prompt: "$ ls stack/", output: "devops/  frontend/  backend/  bbdd/  infra/  seguridad/" },
      { prompt: "$ ./deploy.sh --env=production", output: "✓ Deploy completado" }
    ],
    en: [
      { prompt: "$ whoami", output: "jesus_gonzalez_blanco" },
      { prompt: "$ cat role.txt", output: "DevOps Engineer · Full Stack Developer" },
      { prompt: "$ ls stack/", output: "devops/  frontend/  backend/  database/  infra/  security/" },
      { prompt: "$ ./deploy.sh --env=production", output: "✓ Deploy completed" }
    ]
  };

  function typeLine(text, el, speed, callback) {
    var i = 0;
    (function tick() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        i++;
        setTimeout(tick, speed);
      } else if (callback) {
        callback();
      }
    })();
  }

  function runTerminal(lang) {
    var runId = ++terminalRunId;
    clearTimeout(terminalTimer);
    terminalBody.innerHTML = "";
    var lines = terminalScript[lang] || terminalScript.es;
    var index = 0;

    function nextLine() {
      if (runId !== terminalRunId) return;
      if (index >= lines.length) {
        terminalTimer = setTimeout(function () {
          if (runId === terminalRunId) runTerminal(lang);
        }, 2500);
        return;
      }
      var line = lines[index];
      var lineEl = document.createElement("div");
      lineEl.className = "terminal-line";
      var promptEl = document.createElement("span");
      promptEl.className = "terminal-prompt";
      lineEl.appendChild(promptEl);
      terminalBody.appendChild(lineEl);

      typeLine(line.prompt, promptEl, 35, function () {
        if (runId !== terminalRunId) return;
        var outputEl = document.createElement("div");
        outputEl.className = "terminal-line terminal-output";
        terminalBody.appendChild(outputEl);
        typeLine("  " + line.output, outputEl, 18, function () {
          index++;
          terminalTimer = setTimeout(nextLine, 500);
        });
      });
    }

    nextLine();
  }

  /* ===== Footer year ===== */
  document.getElementById("footer-year").textContent = new Date().getFullYear();

  /* ===== Init ===== */
  applyLang(root.getAttribute("lang") || "es");
})();

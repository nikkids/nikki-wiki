/* ==========================================================================
   THE GHIFFARI GAZETTE — interactivity & synthesized audio
   ========================================================================== */

(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  /* ------------------------------- dates -------------------------------- */

  var dateEl = document.getElementById('today-date');

  if (dateEl) {
    var today = new Date();

    var formatted = today.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    dateEl.textContent = formatted.toUpperCase();
  }

  var yearEl = document.getElementById('year');

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* --------------------------- mini-me waving avatar --------------------------- */

  var miniMeFrames = [
    {
      src: 'assets/Avatar 4.png',
      caption: 'Hi there!',
    },
    {
      src: 'assets/Avatar 3.png',
      caption: 'Have a look around!',
    },
  ];

  var miniMeImg = document.getElementById('mini-me-img');
  var miniMeCaption = document.getElementById('mini-me-caption');

  if (miniMeImg && miniMeCaption && !prefersReducedMotion) {
    var miniMeIndex = 0;

    setInterval(function () {
      miniMeIndex =
        (miniMeIndex + 1) % miniMeFrames.length;

      var frame = miniMeFrames[miniMeIndex];

      miniMeImg.src = frame.src;

      miniMeImg.alt =
        'Avatar frame ' +
        (miniMeIndex + 1) +
        ' of ' +
        miniMeFrames.length;

      miniMeCaption.textContent = frame.caption;
    }, 3000);
  }

  /* ============================== AUDIO ENGINE =============================== */

  var AudioEngine = (function () {
    var ctx = null;
    var masterGain = null;

    function ensureContext() {
      if (!ctx) {
        var AC =
          window.AudioContext ||
          window.webkitAudioContext;

        if (!AC) return null;

        ctx = new AC();

        masterGain = ctx.createGain();
        masterGain.gain.value = 1;

        masterGain.connect(ctx.destination);
      }

      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      return ctx;
    }

    function makeNoiseBuffer(context, seconds) {
      var length = Math.max(
        1,
        Math.floor(context.sampleRate * seconds)
      );

      var buffer = context.createBuffer(
        1,
        length,
        context.sampleRate
      );

      var data = buffer.getChannelData(0);

      for (var i = 0; i < length; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      return buffer;
    }

    function playClick() {
      var c = ensureContext();

      if (!c) return;

      var buffer = makeNoiseBuffer(c, 0.04);

      var src = c.createBufferSource();
      src.buffer = buffer;

      var bandpass = c.createBiquadFilter();

      bandpass.type = 'bandpass';
      bandpass.frequency.value = 2600;
      bandpass.Q.value = 1.2;

      var gain = c.createGain();

      gain.gain.setValueAtTime(
        0.05,
        c.currentTime
      );

      gain.gain.exponentialRampToValueAtTime(
        0.001,
        c.currentTime + 0.05
      );

      src
        .connect(bandpass)
        .connect(gain)
        .connect(masterGain);

      src.start();

      src.stop(c.currentTime + 0.06);
    }

    function playFlip() {
      var c = ensureContext();

      if (!c) return;

      var buffer = makeNoiseBuffer(c, 0.35);

      var src = c.createBufferSource();
      src.buffer = buffer;

      var filter = c.createBiquadFilter();

      filter.type = 'bandpass';

      filter.frequency.setValueAtTime(
        600,
        c.currentTime
      );

      filter.frequency.exponentialRampToValueAtTime(
        3200,
        c.currentTime + 0.3
      );

      filter.Q.value = 0.7;

      var gain = c.createGain();

      gain.gain.setValueAtTime(
        0.0001,
        c.currentTime
      );

      gain.gain.exponentialRampToValueAtTime(
        0.06,
        c.currentTime + 0.08
      );

      gain.gain.exponentialRampToValueAtTime(
        0.001,
        c.currentTime + 0.32
      );

      src
        .connect(filter)
        .connect(gain)
        .connect(masterGain);

      src.start();

      src.stop(c.currentTime + 0.36);
    }

    function playTypeKey() {
      var c = ensureContext();

      if (!c) return;

      var buffer = makeNoiseBuffer(c, 0.02);

      var src = c.createBufferSource();
      src.buffer = buffer;

      var bandpass = c.createBiquadFilter();

      bandpass.type = 'bandpass';

      bandpass.frequency.value =
        3400 + Math.random() * 1200;

      bandpass.Q.value = 2.2;

      var gain = c.createGain();

      gain.gain.setValueAtTime(
        0.05,
        c.currentTime
      );

      gain.gain.exponentialRampToValueAtTime(
        0.001,
        c.currentTime + 0.03
      );

      src
        .connect(bandpass)
        .connect(gain)
        .connect(masterGain);

      src.start();

      src.stop(c.currentTime + 0.035);
    }

    function playBell() {
      var c = ensureContext();

      if (!c) return;

      var osc = c.createOscillator();

      osc.type = 'triangle';

      osc.frequency.setValueAtTime(
        2000,
        c.currentTime
      );

      var gain = c.createGain();

      gain.gain.setValueAtTime(
        0.0001,
        c.currentTime
      );

      gain.gain.exponentialRampToValueAtTime(
        0.11,
        c.currentTime + 0.015
      );

      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        c.currentTime + 0.5
      );

      osc
        .connect(gain)
        .connect(masterGain);

      osc.start();

      osc.stop(c.currentTime + 0.55);
    }

    return {
      playClick: playClick,
      playFlip: playFlip,
      playTypeKey: playTypeKey,
      playBell: playBell,
      unlock: ensureContext,
    };
  })();

  /* ------------------------------ masthead typewriter ------------------------------ */

  var mastheadTitle =
    document.querySelector('.masthead-title');

  if (mastheadTitle) {
    if (prefersReducedMotion) {
      mastheadTitle.classList.add(
        'typewriter-done'
      );
    } else {
      var fullTitleText =
        mastheadTitle.textContent;

      mastheadTitle.textContent = '';

      mastheadTitle.classList.add(
        'typewriter-typing'
      );

      (function typeMastheadTitle() {
        var charIndex = 0;

        function typeNextChar() {
          if (charIndex < fullTitleText.length) {
            var ch =
              fullTitleText.charAt(charIndex);

            mastheadTitle.textContent += ch;

            if (ch !== ' ') {
              AudioEngine.playTypeKey();
            }

            charIndex++;

            var jitter =
              48 + Math.random() * 55;

            window.setTimeout(
              typeNextChar,
              jitter
            );
          } else {
            mastheadTitle.classList.remove(
              'typewriter-typing'
            );

            mastheadTitle.classList.add(
              'typewriter-done'
            );

            AudioEngine.playBell();
          }
        }

        window.setTimeout(
          typeNextChar,
          260
        );
      })();
    }
  }

  /* ------------------------------ background music ------------------------------ */

  var RADIO_STORAGE_KEY =
    'nikkiWikiRadioState';

  function readRadioState() {
    try {
      var raw =
        window.localStorage.getItem(
          RADIO_STORAGE_KEY
        );

      if (!raw) return null;

      var parsed = JSON.parse(raw);

      return typeof parsed.enabled === 'boolean'
        ? parsed
        : null;
    } catch (e) {
      return null;
    }
  }

  function writeRadioState(enabled, time) {
    try {
      window.localStorage.setItem(
        RADIO_STORAGE_KEY,
        JSON.stringify({
          enabled: enabled,
          time: time || 0,
          savedAt: Date.now(),
        })
      );
    } catch (e) {
      /* Storage may be disabled. */
    }
  }

  var bgMusic =
    document.getElementById('bg-music');

  var gramophoneBtn =
    document.getElementById(
      'gramophone-btn'
    );

  var radioImage =
    document.getElementById(
      'radio-image'
    );

  var radioStateOff =
    document.getElementById(
      'radio-state-off'
    );

  var radioStateOn =
    document.getElementById(
      'radio-state-on'
    );

  var storedRadioState =
    readRadioState();

  var musicEnabled =
    storedRadioState
      ? storedRadioState.enabled
      : false;

  if (radioImage) {
    radioImage.addEventListener(
      'error',
      function () {
        var fallback =
          document.createElement('span');

        fallback.id =
          'radio-image';

        fallback.className =
          'radio-toggle-image radio-image-fallback';

        fallback.setAttribute(
          'aria-hidden',
          'true'
        );

        fallback.textContent = '📻';

        radioImage.replaceWith(
          fallback
        );

        radioImage = fallback;
      },
      { once: true }
    );
  }

  if (bgMusic) {
    bgMusic.loop = true;

    bgMusic.preload = 'auto';

    bgMusic.volume = 0.4;

    bgMusic.addEventListener(
      'playing',
      function () {
        if (gramophoneBtn) {
          gramophoneBtn.classList.add(
            'audio-active'
          );
        }
      }
    );

    [
      'pause',
      'ended',
      'stalled',
      'emptied',
      'error',
    ].forEach(function (evt) {
      bgMusic.addEventListener(
        evt,
        function () {
          if (gramophoneBtn) {
            gramophoneBtn.classList.remove(
              'audio-active'
            );
          }
        }
      );
    });

    window.setInterval(
      function () {
        if (!bgMusic.paused) {
          writeRadioState(
            true,
            bgMusic.currentTime
          );
        }
      },
      2000
    );

    var resumeFromSavedState =
      function () {
        if (
          !storedRadioState ||
          !storedRadioState.enabled
        ) {
          return;
        }

        var resumeTime =
          storedRadioState.time || 0;

        if (
          bgMusic.duration &&
          isFinite(bgMusic.duration)
        ) {
          var elapsed =
            (Date.now() -
              storedRadioState.savedAt) /
            1000;

          if (
            elapsed > 0 &&
            elapsed < 30
          ) {
            resumeTime += elapsed;
          }

          resumeTime =
            resumeTime %
            bgMusic.duration;
        }

        try {
          bgMusic.currentTime =
            resumeTime;
        } catch (e) {}

        startMusic();
      };

    if (bgMusic.readyState >= 1) {
      resumeFromSavedState();
    } else {
      bgMusic.addEventListener(
        'loadedmetadata',
        resumeFromSavedState,
        {
          once: true,
        }
      );
    }
  }

  function updateMusicUI() {
    if (radioStateOff) {
      radioStateOff.classList.toggle(
        'active',
        !musicEnabled
      );
    }

    if (radioStateOn) {
      radioStateOn.classList.toggle(
        'active',
        musicEnabled
      );
    }

    if (gramophoneBtn) {
      gramophoneBtn.classList.toggle(
        'on',
        musicEnabled
      );

      gramophoneBtn.setAttribute(
        'aria-checked',
        String(musicEnabled)
      );

      gramophoneBtn.setAttribute(
        'aria-label',
        musicEnabled
          ? 'Turn off the radio'
          : 'Turn on the radio'
      );
    }

    if (radioImage) {
      radioImage.src = musicEnabled
        ? 'assets/RadioON.png'
        : 'assets/RadioOFF.png';

      radioImage.alt = musicEnabled
        ? 'Radio on'
        : 'Radio off';
    }
  }

  function startMusic() {
    if (
      !bgMusic ||
      !musicEnabled
    ) {
      return;
    }

    bgMusic.volume = 0.4;

    var promise =
      bgMusic.play();

    if (
      promise &&
      typeof promise.catch === 'function'
    ) {
      promise.catch(function () {
        /*
          Browser autoplay policy may block
          playback until the user interacts.
        */
      });
    }
  }

  updateMusicUI();

  if (gramophoneBtn) {
    gramophoneBtn.addEventListener(
      'click',
      function (event) {
        event.stopPropagation();

        if (!bgMusic) {
          console.error(
            '#bg-music was not found.'
          );
          return;
        }

        if (
          typeof navigator.vibrate ===
          'function'
        ) {
          navigator.vibrate(12);
        }

        if (!bgMusic.paused) {
          musicEnabled = false;

          bgMusic.pause();

          writeRadioState(
            false,
            bgMusic.currentTime
          );
        } else {
          musicEnabled = true;

          startMusic();

          writeRadioState(
            true,
            bgMusic.currentTime
          );
        }

        updateMusicUI();
      }
    );
  }

  [
    'pagehide',
    'beforeunload',
  ].forEach(function (evt) {
    window.addEventListener(
      evt,
      function () {
        if (bgMusic) {
          writeRadioState(
            musicEnabled,
            bgMusic.currentTime
          );
        }
      }
    );
  });

  /* -------------------------- headline TV signal buzz -------------------------- */

  var headlineTvScreen =
    document.querySelector(
      '.headline-tv-screen'
    );

  if (
    headlineTvScreen &&
    !window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
  ) {
    var triggerHeadlineBuzz =
      function () {
        headlineTvScreen.classList.remove(
          'headline-tv-buzz'
        );

        void headlineTvScreen.offsetWidth;

        headlineTvScreen.classList.add(
          'headline-tv-buzz'
        );

        window.setTimeout(
          function () {
            headlineTvScreen.classList.remove(
              'headline-tv-buzz'
            );
          },
          760
        );
      };

    window.setTimeout(
      triggerHeadlineBuzz,
      1800
    );

    window.setInterval(
      triggerHeadlineBuzz,
      4200
    );
  }

  /* ------------------------------ button sounds ------------------------------ */

  document
    .querySelectorAll('button')
    .forEach(function (button) {
      if (button === gramophoneBtn)
        return;

      if (
        button ===
        document.getElementById(
          'unfold-btn'
        )
      ) {
        return;
      }

      if (
        button.classList.contains(
          'dossier-open-btn'
        )
      ) {
        return;
      }

      if (
        button.classList.contains(
          'dossier-close'
        )
      ) {
        return;
      }

      if (
        button.classList.contains(
          'project-nav'
        )
      ) {
        return;
      }

      button.addEventListener(
        'click',
        function () {
          AudioEngine.playClick();
        }
      );
    });

  /* ------------------------------ logo fallback ------------------------------ */

  document
    .querySelectorAll('.org-favicon')
    .forEach(function (img) {
      img.addEventListener(
        'error',
        function () {
          var domain = '';

          try {
            domain = new URL(
              img.src
            ).hostname;
          } catch (e) {}

          var initials = '•';

          if (
            domain.indexOf('bps') !== -1
          ) {
            initials = 'BPS';
          } else if (
            domain.indexOf('telkom') !== -1
          ) {
            initials = 'TU';
          } else if (
            domain.indexOf('dbs') !== -1
          ) {
            initials = 'DBS';
          } else if (
            domain.indexOf('gaotek') !== -1
          ) {
            initials = 'G';
          } else if (
            domain.indexOf('aiesec') !== -1
          ) {
            initials = 'A';
          } else if (
            domain.indexOf('ieee') !== -1
          ) {
            initials = 'IEEE';
          } else if (
            domain.indexOf('odoo') !== -1
          ) {
            initials = 'O';
          } else if (
            domain.indexOf('ferbos') !== -1
          ) {
            initials = 'F';
          }

          var fallback =
            document.createElement(
              'span'
            );

          fallback.textContent =
            initials;

          fallback.setAttribute(
            'aria-hidden',
            'true'
          );

          fallback.style.display =
            'inline-flex';

          fallback.style.alignItems =
            'center';

          fallback.style.justifyContent =
            'center';

          fallback.style.width =
            img.width + 'px';

          fallback.style.height =
            img.height + 'px';

          fallback.style.fontFamily =
            'var(--font-type)';

          fallback.style.fontSize =
            '0.55rem';

          fallback.style.fontWeight =
            '700';

          fallback.style.border =
            '1px solid currentColor';

          fallback.style.borderRadius =
            '3px';

          img.replaceWith(
            fallback
          );
        },
        { once: true }
      );
    });

  /* --------------------------------- section nav -------------------------------- */

  var navTabs = Array.prototype.slice.call(
    document.querySelectorAll(
      '.nav-tab'
    )
  );

  var sections = navTabs
    .map(function (tab) {
      return document.getElementById(
        tab.getAttribute(
          'data-target'
        )
      );
    })
    .filter(Boolean);

  navTabs.forEach(function (tab) {
    tab.addEventListener(
      'click',
      function () {
        AudioEngine.playClick();

        var target =
          document.getElementById(
            tab.getAttribute(
              'data-target'
            )
          );

        if (target) {
          var sectionNav =
            document.getElementById(
              'section-nav'
            );

          var navHeight =
            sectionNav
              ? sectionNav.offsetHeight
              : 0;

          var ticker =
            document.querySelector(
              '.ticker-tape'
            );

          var tickerHeight =
            ticker
              ? ticker.offsetHeight
              : 0;

          var top =
            target.getBoundingClientRect()
              .top +
            window.pageYOffset -
            navHeight -
            tickerHeight -
            8;

          window.scrollTo({
            top: top,
            behavior:
              prefersReducedMotion
                ? 'auto'
                : 'smooth',
          });
        }
      }
    );
  });

  function setActiveTabById(id) {
    navTabs.forEach(function (tab) {
      var isActive =
        tab.getAttribute(
          'data-target'
        ) === id;

      tab.classList.toggle(
        'active',
        isActive
      );

      if (
        isActive &&
        typeof tab.scrollIntoView ===
          'function'
      ) {
        tab.scrollIntoView({
          behavior:
            prefersReducedMotion
              ? 'auto'
              : 'smooth',
          inline: 'center',
          block: 'nearest',
        });
      }
    });
  }

  if (
    'IntersectionObserver' in window &&
    sections.length
  ) {
    var observer =
      new IntersectionObserver(
        function (entries) {
          entries.forEach(
            function (entry) {
              if (
                entry.isIntersecting
              ) {
                setActiveTabById(
                  entry.target.id
                );
              }
            }
          );
        },
        {
          rootMargin:
            '-40% 0px -50% 0px',
          threshold: 0,
        }
      );

    sections.forEach(
      function (section) {
        observer.observe(section);
      }
    );
  }

  /* ------------------------------- story accordions ------------------------------ */

  var storyCards =
    Array.prototype.slice.call(
      document.querySelectorAll(
        '[data-expandable]'
      )
    );

  storyCards.forEach(function (card) {
    var btn =
      card.querySelector(
        '.read-more'
      );

    if (!btn) return;

    btn.dataset.label =
      btn.textContent;

    btn.addEventListener(
      'click',
      function () {
        var willOpen =
          !card.classList.contains(
            'open'
          );

        card.classList.toggle(
          'open',
          willOpen
        );

        btn.textContent = willOpen
          ? 'Fold this back up ↑'
          : btn.dataset.label;

        AudioEngine.playClick();
      }
    );
  });

  /* ------------------------------- unfold everything ------------------------------ */

  var unfoldBtn =
    document.getElementById(
      'unfold-btn'
    );

  var unfolded = false;

  if (unfoldBtn) {
    unfoldBtn.addEventListener(
      'click',
      function () {
        unfolded = !unfolded;

        AudioEngine.playFlip();

        storyCards.forEach(
          function (card, index) {
            var btn =
              card.querySelector(
                '.read-more'
              );

            setTimeout(
              function () {
                card.classList.toggle(
                  'open',
                  unfolded
                );

                if (btn) {
                  btn.textContent =
                    unfolded
                      ? 'Fold this back up ↑'
                      : btn.dataset.label;
                }
              },
              prefersReducedMotion
                ? 0
                : index * 40
            );
          }
        );

        unfoldBtn.innerHTML =
          unfolded
            ? 'Fold Back Edition &#9652;'
            : 'Unfold Full Edition &#9662;';
      }
    );
  }

  /* --------------------------------- classifieds search --------------------------- */

  var searchInput =
    document.getElementById(
      'classified-search'
    );

  var classifiedAds =
    Array.prototype.slice.call(
      document.querySelectorAll(
        '.classified-ad'
      )
    );

  var emptyState =
    document.getElementById(
      'classifieds-empty'
    );

  if (searchInput) {
    searchInput.addEventListener(
      'input',
      function () {
        var query =
          searchInput.value
            .trim()
            .toLowerCase();

        var visibleCount = 0;

        classifiedAds.forEach(
          function (ad) {
            var haystack =
              (
                ad.getAttribute(
                  'data-cat'
                ) +
                ' ' +
                ad.textContent
              ).toLowerCase();

            var match =
              query === '' ||
              haystack.indexOf(
                query
              ) !== -1;

            ad.classList.toggle(
              'is-hidden',
              !match
            );

            if (match) {
              visibleCount++;
            }
          }
        );

        if (emptyState) {
          emptyState.hidden =
            visibleCount !== 0;
        }
      }
    );
  }

  /* ------------------------------------ back to top -------------------------------- */

  var backToTop =
    document.getElementById(
      'back-to-top'
    );

  if (backToTop) {
    backToTop.addEventListener(
      'click',
      function () {
        AudioEngine.playClick();

        window.scrollTo({
          top: 0,
          behavior:
            prefersReducedMotion
              ? 'auto'
              : 'smooth',
        });
      }
    );
  }

  /* -------------------------- generic click sound on cards/links ------------------- */

  document
    .querySelectorAll(
      '.honor-card, .letter-line a'
    )
    .forEach(function (el) {
      el.addEventListener(
        'click',
        function () {
          AudioEngine.playClick();
        }
      );
    });

  /* ------------------------- paper sound on "Full Story" links ------------------------- */

  document
    .querySelectorAll(
      '.cta-button:not(.dossier-open-btn)'
    )
    .forEach(function (link) {
      link.addEventListener(
        'click',
        function (event) {
          var href =
            link.getAttribute(
              'href'
            );

          if (
            !href ||
            event.defaultPrevented ||
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey ||
            link.target === '_blank'
          ) {
            return;
          }

          event.preventDefault();

          AudioEngine.playFlip();

          window.setTimeout(
            function () {
              window.location.href =
                href;
            },
            220
          );
        }
      );
    });

  /* ========================================================================
     PROJECT CAROUSEL
     ======================================================================== */

  var projectCarousel =
    document.getElementById(
      'project-carousel'
    );

  var projectViewport =
    document.getElementById(
      'project-viewport'
    );

  var projectTrack =
    document.getElementById(
      'project-track'
    );

  var projectPrevBtn =
    document.getElementById(
      'project-prev'
    );

  var projectNextBtn =
    document.getElementById(
      'project-next'
    );

  var projectDotsWrap =
    document.getElementById(
      'project-dots'
    );

  if (
    projectViewport &&
    projectTrack &&
    projectTrack.children.length
  ) {
    var projectCards =
      Array.prototype.slice.call(
        projectTrack.children
      );

    /*
      IMPORTANT FIX:

      Desktop:
        2 cards per view

      Mobile:
        1 card per view

      768px is used instead of 640px so normal
      mobile/tablet portrait widths don't accidentally
      remain in the two-card desktop layout.
    */
    function getVisiblePerPage() {
      return window.innerWidth <= 768
        ? 1
        : 2;
    }

    var visiblePerPage =
      getVisiblePerPage();

    var totalPages = Math.max(
      1,
      Math.ceil(
        projectCards.length /
          visiblePerPage
      )
    );

    var currentPage = 0;

    var trackGap = 0;

    var maxShift = 0;

    var projectWasDragged = false;

    var projectDots = [];

    /* --------------------------- dots --------------------------- */

    function buildProjectDots() {
      if (!projectDotsWrap) {
        projectDots = [];
        return;
      }

      projectDotsWrap.innerHTML = '';

      if (totalPages <= 1) {
        projectDots = [];
        return;
      }

      for (
        var p = 0;
        p < totalPages;
        p++
      ) {
        var dot =
          document.createElement(
            'button'
          );

        dot.type = 'button';

        dot.className =
          'project-dot';

        dot.setAttribute(
          'aria-label',
          'Show case files, page ' +
            (p + 1) +
            ' of ' +
            totalPages
        );

        dot.setAttribute(
          'data-page',
          String(p)
        );

        projectDotsWrap.appendChild(
          dot
        );
      }

      projectDots =
        Array.prototype.slice.call(
          projectDotsWrap.querySelectorAll(
            '.project-dot'
          )
        );
    }

    /* --------------------------- measurements --------------------------- */

    function measureProjectCarousel() {
      /*
        Recalculate this every time the viewport
        changes. This is the important part that
        fixes mobile.
      */
      visiblePerPage =
        getVisiblePerPage();

      totalPages = Math.max(
        1,
        Math.ceil(
          projectCards.length /
            visiblePerPage
        )
      );

      var viewportWidth =
        projectViewport.clientWidth;

      trackGap =
        parseFloat(
          getComputedStyle(
            projectTrack
          ).columnGap
        ) || 0;

      /*
        Calculate exact card width.

        1 card on mobile:
          viewportWidth

        2 cards on desktop:
          (viewportWidth - gap) / 2
      */
      var cardWidth =
        (
          viewportWidth -
          trackGap *
            (visiblePerPage - 1)
        ) /
        visiblePerPage;

      projectCards.forEach(
        function (card) {
          card.style.width =
            cardWidth + 'px';
          card.style.flex =
            '0 0 ' +
            cardWidth +
            'px';
        }
      );

      var trackWidth =
        cardWidth *
          projectCards.length +
        trackGap *
          (projectCards.length - 1);

      projectTrack.style.width =
        trackWidth + 'px';

      maxShift = Math.max(
        0,
        trackWidth -
          viewportWidth
      );
    }

    /* --------------------------- navigation UI --------------------------- */

    function updateProjectNav() {
      if (projectDots.length) {
        projectDots.forEach(
          function (dot, i) {
            dot.classList.toggle(
              'active',
              i === currentPage
            );
          }
        );
      }

      if (projectPrevBtn) {
        projectPrevBtn.disabled =
          totalPages <= 1;
      }

      if (projectNextBtn) {
        projectNextBtn.disabled =
          totalPages <= 1;
      }
    }

    function shiftForPage(page) {
      var raw =
        totalPages > 1
          ? (page /
              (totalPages - 1)) *
            maxShift
          : 0;

      return Math.min(
        maxShift,
        Math.max(0, raw)
      );
    }

    function goToPage(
      page,
      skipAnimation
    ) {
      if (totalPages <= 1) {
        currentPage = 0;
      } else {
        currentPage =
          ((page % totalPages) +
            totalPages) %
          totalPages;
      }

      var shift =
        shiftForPage(
          currentPage
        );

      if (skipAnimation) {
        projectTrack.classList.add(
          'dragging'
        );
      }

      projectTrack.style.transform =
        'translateX(' +
        -shift +
        'px)';

      if (skipAnimation) {
        void projectTrack.offsetWidth;

        projectTrack.classList.remove(
          'dragging'
        );
      }

      updateProjectNav();
    }

    /* --------------------------- layout --------------------------- */

    function layoutProjectCarousel() {
      /*
        Important order:

        1. Recalculate mobile/desktop mode
        2. Recalculate card width
        3. Rebuild dots
        4. Recalculate current page
        5. Reposition track
      */

      visiblePerPage =
        getVisiblePerPage();

      totalPages = Math.max(
        1,
        Math.ceil(
          projectCards.length /
            visiblePerPage
        )
      );

      if (
        currentPage >= totalPages
      ) {
        currentPage =
          totalPages - 1;
      }

      buildProjectDots();

      measureProjectCarousel();

      goToPage(
        currentPage,
        true
      );
    }

    /* --------------------------- previous --------------------------- */

    if (projectPrevBtn) {
      projectPrevBtn.addEventListener(
        'click',
        function () {
          AudioEngine.playClick();

          goToPage(
            currentPage - 1
          );
        }
      );
    }

    /* --------------------------- next --------------------------- */

    if (projectNextBtn) {
      projectNextBtn.addEventListener(
        'click',
        function () {
          AudioEngine.playClick();

          goToPage(
            currentPage + 1
          );
        }
      );
    }

    /* --------------------------- dots --------------------------- */

    if (projectDotsWrap) {
      projectDotsWrap.addEventListener(
        'click',
        function (event) {
          var dot =
            event.target &&
            event.target.closest
              ? event.target.closest(
                  '.project-dot'
                )
              : null;

          if (!dot) return;

          AudioEngine.playClick();

          goToPage(
            parseInt(
              dot.getAttribute(
                'data-page'
              ),
              10
            ) || 0
          );
        }
      );
    }

    /* --------------------------- keyboard --------------------------- */

    if (projectCarousel) {
      projectCarousel.addEventListener(
        'keydown',
        function (event) {
          if (
            event.key ===
            'ArrowLeft'
          ) {
            goToPage(
              currentPage - 1
            );
          } else if (
            event.key ===
            'ArrowRight'
          ) {
            goToPage(
              currentPage + 1
            );
          }
        }
      );
    }

    /* ====================================================================
       DRAG / SWIPE
       ==================================================================== */

    var dragState = null;

    projectTrack.addEventListener(
      'pointerdown',
      function (event) {
        if (totalPages <= 1)
          return;

        if (
          event.button !==
            undefined &&
          event.button !== 0
        ) {
          return;
        }

        /*
          VERY IMPORTANT:

          Do not capture pointerdown from:
          - buttons
          - links
          - inputs
          - selects
          - labels

          This prevents Open Case File from
          fighting with the drag mechanic.
        */
        var interactiveTarget =
          event.target &&
          event.target.closest
            ? event.target.closest(
                'button, a, input, textarea, select, label'
              )
            : null;

        if (interactiveTarget) {
          return;
        }

        dragState = {
          pointerId:
            event.pointerId,

          startX:
            event.clientX,

          startShift:
            -shiftForPage(
              currentPage
            ),

          moved: 0,
        };

        projectWasDragged =
          false;

        projectTrack.classList.add(
          'dragging'
        );

        try {
          projectTrack.setPointerCapture(
            event.pointerId
          );
        } catch (e) {}
      }
    );

    projectTrack.addEventListener(
      'pointermove',
      function (event) {
        if (
          !dragState ||
          event.pointerId !==
            dragState.pointerId
        ) {
          return;
        }

        var delta =
          event.clientX -
          dragState.startX;

        dragState.moved =
          Math.abs(delta);

        var next =
          dragState.startShift +
          delta;

        next = Math.max(
          -maxShift,
          Math.min(0, next)
        );

        projectTrack.style.transform =
          'translateX(' +
          next +
          'px)';

        if (
          dragState.moved > 6
        ) {
          projectWasDragged =
            true;
        }
      }
    );

    function endProjectDrag(
      event
    ) {
      if (
        !dragState ||
        event.pointerId !==
          dragState.pointerId
      ) {
        return;
      }

      var delta =
        event.clientX -
        dragState.startX;

      projectTrack.classList.remove(
        'dragging'
      );

      var threshold =
        Math.min(
          80,
          projectViewport.clientWidth *
            0.15
        );

      if (
        delta <= -threshold
      ) {
        goToPage(
          currentPage + 1
        );
      } else if (
        delta >= threshold
      ) {
        goToPage(
          currentPage - 1
        );
      } else {
        goToPage(
          currentPage
        );
      }

      dragState = null;
    }

    projectTrack.addEventListener(
      'pointerup',
      endProjectDrag
    );

    projectTrack.addEventListener(
      'pointercancel',
      endProjectDrag
    );

    /*
      Prevent a drag release from accidentally
      triggering a click.
    */
    projectTrack.addEventListener(
      'click',
      function (event) {
        if (projectWasDragged) {
          event.preventDefault();

          event.stopPropagation();

          projectWasDragged =
            false;
        }
      },
      true
    );

    /* --------------------------- responsive resize --------------------------- */

    var resizeTimer = null;

    window.addEventListener(
      'resize',
      function () {
        window.clearTimeout(
          resizeTimer
        );

        resizeTimer =
          window.setTimeout(
            function () {
              layoutProjectCarousel();
            },
            80
          );
      }
    );

    /* Initial layout */
    layoutProjectCarousel();
  }

  /* ------------------------- project case-file dossier ------------------------- */

  var dossierOverlay =
    document.getElementById(
      'dossier-overlay'
    );

  var dossierBackdrop =
    document.getElementById(
      'dossier-backdrop'
    );

  var dossierContentHost =
    document.getElementById(
      'dossier-note-content'
    );

  var dossierCloseBtn =
    document.getElementById(
      'dossier-close'
    );

  var dossierLastFocused = null;

  var dossierCloseTimer = null;

  function openDossier(id) {
    if (
      !dossierOverlay ||
      !dossierContentHost ||
      !id
    ) {
      return;
    }

    var source =
      document.querySelector(
        '.dossier-content[data-dossier-id="' +
          id +
          '"]'
      );

    if (!source) return;

    window.clearTimeout(
      dossierCloseTimer
    );

    dossierContentHost.innerHTML =
      source.innerHTML;

    dossierLastFocused =
      document.activeElement;

    dossierOverlay.hidden = false;

    void dossierOverlay.offsetWidth;

    dossierOverlay.classList.add(
      'open'
    );

    document.body.classList.add(
      'dossier-lock'
    );

    AudioEngine.playFlip();

    if (dossierCloseBtn) {
      dossierCloseBtn.focus();
    }
  }

  function closeDossier() {
    if (
      !dossierOverlay ||
      !dossierOverlay.classList.contains(
        'open'
      )
    ) {
      return;
    }

    dossierOverlay.classList.remove(
      'open'
    );

    document.body.classList.remove(
      'dossier-lock'
    );

    AudioEngine.playClick();

    dossierCloseTimer =
      window.setTimeout(
        function () {
          dossierOverlay.hidden =
            true;

          if (dossierContentHost) {
            dossierContentHost.innerHTML =
              '';
          }
        },
        prefersReducedMotion
          ? 0
          : 340
      );

    if (
      dossierLastFocused &&
      typeof dossierLastFocused.focus ===
        'function'
    ) {
      dossierLastFocused.focus();
    }
  }

  document
    .querySelectorAll(
      '.dossier-open-btn'
    )
    .forEach(function (btn) {
      btn.addEventListener(
        'click',
        function () {
          openDossier(
            btn.getAttribute(
              'data-dossier-target'
            )
          );
        }
      );
    });

  if (dossierCloseBtn) {
    dossierCloseBtn.addEventListener(
      'click',
      closeDossier
    );
  }

  if (dossierBackdrop) {
    dossierBackdrop.addEventListener(
      'click',
      closeDossier
    );
  }

  document.addEventListener(
    'keydown',
    function (event) {
      if (
        event.key === 'Escape' &&
        dossierOverlay &&
        dossierOverlay.classList.contains(
          'open'
        )
      ) {
        closeDossier();
      }
    }
  );

  /* ------------------------------ scroll reveal ------------------------------ */

  if (
    !prefersReducedMotion &&
    'IntersectionObserver' in window
  ) {
    var revealEls =
      Array.prototype.slice.call(
        document.querySelectorAll(
          [
            '.article-card',
            '.honor-card',
            '.project-card',
            '.gossip-entry',
            '.classified-ad',
            '.telegram-card',
            '.citation-card',
            '.timeline-node',
            '.postcard',
          ].join(', ')
        )
      );

    if (revealEls.length) {
      revealEls.forEach(
        function (el) {
          el.classList.add(
            'reveal-init'
          );
        }
      );

      var revealObserver =
        new IntersectionObserver(
          function (entries) {
            entries.forEach(
              function (entry) {
                if (
                  !entry.isIntersecting
                ) {
                  return;
                }

                var el =
                  entry.target;

                var delay =
                  Math.random() *
                  140;

                window.setTimeout(
                  function () {
                    el.classList.add(
                      'revealed'
                    );
                  },
                  delay
                );

                revealObserver.unobserve(
                  el
                );
              }
            );
          },
          {
            threshold: 0.12,
            rootMargin:
              '0px 0px -10% 0px',
          }
        );

      revealEls.forEach(
        function (el) {
          revealObserver.observe(
            el
          );
        }
      );
    }
  }

  /* ------------------------------ stat counter-up ------------------------------ */

  var statNums =
    Array.prototype.slice.call(
      document.querySelectorAll(
        '.stat-num'
      )
    );

  if (
    statNums.length &&
    !prefersReducedMotion &&
    'IntersectionObserver' in window
  ) {
    var statObserver =
      new IntersectionObserver(
        function (entries) {
          entries.forEach(
            function (entry) {
              if (
                !entry.isIntersecting
              ) {
                return;
              }

              animateStatNumber(
                entry.target
              );

              statObserver.unobserve(
                entry.target
              );
            }
          );
        },
        {
          threshold: 0.6,
        }
      );

    statNums.forEach(
      function (el) {
        statObserver.observe(el);
      }
    );
  }

  function animateStatNumber(
    el
  ) {
    var raw =
      el.textContent.trim();

    var match =
      raw.match(
        /^([\d.]+)(.*)$/
      );

    if (!match) return;

    var targetValue =
      parseFloat(match[1]);

    var suffix =
      match[2] || '';

    var decimals =
      match[1].indexOf('.') !==
      -1
        ? match[1]
            .split('.')[1]
            .length
        : 0;

    var duration = 1100;

    var startTime = null;

    function step(timestamp) {
      if (startTime === null) {
        startTime = timestamp;
      }

      var progress =
        Math.min(
          (timestamp -
            startTime) /
            duration,
          1
        );

      var eased =
        1 -
        Math.pow(
          1 - progress,
          3
        );

      var current =
        targetValue *
        eased;

      el.textContent =
        current.toFixed(
          decimals
        ) + suffix;

      if (progress < 1) {
        window.requestAnimationFrame(
          step
        );
      } else {
        el.textContent =
          match[1] + suffix;
      }
    }

    window.requestAnimationFrame(
      step
    );
  }
})();

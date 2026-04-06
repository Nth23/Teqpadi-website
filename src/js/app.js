// ─── CONFIG ───────────────────────────────────────────
const API =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "https://teqpadi-api-production.up.railway.app/";

// ─── MOBILE NAV ───────────────────────────────────────
const hamburger = document.getElementById("hamburger");
const mobileNav = document.getElementById("mobile-nav");
hamburger.addEventListener("click", () => mobileNav.classList.toggle("open"));
function closeMobileNav() {
  mobileNav.classList.remove("open");
}

// ─── NAV SCROLL SHRINK ────────────────────────────────
window.addEventListener(
  "scroll",
  () => {
    document.getElementById("main-nav").style.padding =
      window.scrollY > 60 ? ".6rem var(--gap)" : ".9rem var(--gap)";
  },
  { passive: true },
);

// ─── CONDITION BUTTONS ────────────────────────────────
document.querySelectorAll(".cond-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".cond-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

// ─── VALUE ENGINE ─────────────────────────────────────
const PRICE_MAP = {
  "Apple iPhone": { base: 120000, mult: 1.8 },
  "Samsung Galaxy": { base: 80000, mult: 1.5 },
  Tecno: { base: 35000, mult: 1.2 },
  Infinix: { base: 30000, mult: 1.2 },
  Xiaomi: { base: 55000, mult: 1.3 },
  "Google Pixel": { base: 90000, mult: 1.6 },
  OnePlus: { base: 75000, mult: 1.4 },
};
const COND = { Mint: 1, Good: 0.82, Fair: 0.62, Poor: 0.4 };
const STORE = {
  "64GB": 1,
  "128GB": 1.12,
  "256GB": 1.25,
  "512GB": 1.4,
  "1TB": 1.6,
};

function localCalc(brand, storage, condition) {
  const info = PRICE_MAP[brand] || { base: 50000, mult: 1 };
  const base = info.base * (COND[condition] || 0.7) * (STORE[storage] || 1);
  return {
    low: Math.round(base / 1000) * 1000,
    high: Math.round((base * info.mult) / 1000) * 1000,
  };
}

document
  .getElementById("check-value-btn")
  .addEventListener("click", async () => {
    const brand = document.getElementById("brand").value;
    if (!brand) {
      document.getElementById("brand").focus();
      return;
    }
    const btn = document.getElementById("check-value-btn");
    const condition =
      document.querySelector(".cond-btn.active")?.dataset.cond || "Good";
    const storage = document.getElementById("storage").value;
    btn.textContent = "Checking…";
    btn.disabled = true;
    try {
      const res = await fetch(`${API}/api/valuations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand,
          model: document.getElementById("model").value || brand,
          storage,
          ram: document.getElementById("ram").value,
          condition,
        }),
      });
      const data = await res.json();
      if (data.success)
        showResult(
          data.valueLow,
          data.valueHigh,
          `${data.condition} condition · Recommendation: ${data.recommendation}`,
        );
    } catch {
      const { low, high } = localCalc(brand, storage, condition);
      showResult(low, high, `${condition} condition (offline estimate)`);
    } finally {
      btn.textContent = "Get Estimate →";
      btn.disabled = false;
    }
  });

function showResult(low, high, hint) {
  const fmt = (n) => "₦" + n.toLocaleString("en-NG");
  document.getElementById("result-range").textContent =
    `${fmt(low)} – ${fmt(high)}`;
  document.getElementById("result-hint").textContent = hint;
  document.getElementById("result-card").classList.add("show");
  if (window.gsap)
    gsap.from("#result-range", {
      scale: 0.8,
      opacity: 0,
      duration: 0.4,
      ease: "back.out(1.4)",
    });
}

// ─── BOOKING MODAL ────────────────────────────────────
const bookingModal = document.getElementById("booking-modal");

function openBooking(service = "") {
  bookingModal.classList.add("open");
  if (service) document.getElementById("bk-service").value = service;
  if (window.gsap)
    gsap.from(".modal-box", {
      y: 30,
      opacity: 0,
      duration: 0.4,
      ease: "back.out(1.4)",
    });
}
function closeBooking() {
  bookingModal.classList.remove("open");
}
bookingModal.addEventListener("click", (e) => {
  if (e.target === bookingModal) closeBooking();
});

document.querySelectorAll('a[href="#services"]').forEach((a) => {
  if (a.textContent.includes("Repair") || a.textContent.includes("Book")) {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      openBooking("repair");
    });
  }
});

document.getElementById("bk-submit").addEventListener("click", async () => {
  const fields = {
    name: document.getElementById("bk-name").value.trim(),
    phone: document.getElementById("bk-phone").value.trim(),
    email: document.getElementById("bk-email").value.trim(),
    service: document.getElementById("bk-service").value,
    device: document.getElementById("bk-device").value.trim(),
    details: document.getElementById("bk-details").value.trim(),
  };
  const msg = document.getElementById("bk-msg");
  const btn = document.getElementById("bk-submit");
  if (!fields.name || !fields.phone || !fields.service || !fields.device) {
    showMsg(msg, "Please fill all required fields.", "#fef2f2", "#dc2626");
    return;
  }
  btn.textContent = "Sending…";
  btn.disabled = true;
  try {
    const res = await fetch(`${API}/api/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });
    const data = await res.json();
    if (data.success) {
      showMsg(msg, "✅ " + data.message, "#f0fdf4", "#16a34a");
      btn.style.display = "none";
      setTimeout(closeBooking, 3000);
    } else {
      showMsg(
        msg,
        (data.errors || [data.message]).join(", "),
        "#fef2f2",
        "#dc2626",
      );
    }
  } catch {
    const wa = `https://wa.me/2348053283754?text=Hi Teqpadi!%0AName: ${fields.name}%0APhone: ${fields.phone}%0AService: ${fields.service}%0ADevice: ${fields.device}%0ADetails: ${fields.details}`;
    showMsg(
      msg,
      "API offline — opening WhatsApp instead…",
      "#fffbeb",
      "#d97706",
    );
    setTimeout(() => window.open(wa, "_blank"), 1200);
  } finally {
    btn.textContent = "Submit Booking";
    btn.disabled = false;
  }
});

function showMsg(el, text, bg, color) {
  el.textContent = text;
  el.style.cssText = `display:block;background:${bg};color:${color};border:1px solid ${color}33`;
}

// ─── LIVE STATS ───────────────────────────────────────
async function loadStats() {
  try {
    const { stats } = await fetch(`${API}/api/testimonials/stats`).then((r) =>
      r.json(),
    );
    const els = document.querySelectorAll("[data-target]");
    if (els[0]) els[0].dataset.target = stats.repairs;
    if (els[1]) els[1].dataset.target = stats.customers;
    if (els[2]) els[2].dataset.target = stats.satisfaction;
  } catch {
    /* use HTML defaults */
  }
}

// ─── LIVE TESTIMONIALS ────────────────────────────────
async function loadTestimonials() {
  try {
    const { testimonials } = await fetch(`${API}/api/testimonials`).then((r) =>
      r.json(),
    );
    if (!testimonials?.length) return;
    const stars = (n) => "★".repeat(n) + "☆".repeat(5 - n);
    const grid = document.getElementById("testi-grid");
    grid.innerHTML = testimonials
      .map(
        (t) => `
      <div class="testi-card">
        <div class="stars">${stars(t.rating)}</div>
        <div class="testi-quote">"</div>
        <div class="testi-text">${t.text}</div>
        <div class="testi-author">
          <div class="testi-avatar">${t.initials || t.name[0]}</div>
          <div>
            <div class="testi-name">${t.name}</div>
            <div class="testi-role">${t.role || ""}</div>
          </div>
        </div>
      </div>`,
      )
      .join("");

    if (window.gsap && window.ScrollTrigger) {
      grid.querySelectorAll(".testi-card").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none none",
            },
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: "power2.out",
          },
        );
      });
    } else {
      grid.querySelectorAll(".testi-card").forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
    }
  } catch {
    document
      .querySelectorAll("#testi-grid .testi-card")
      .forEach((el) => el.classList.remove("reveal"));
  }
}

loadStats();
loadTestimonials();

// ─── GSAP ─────────────────────────────────────────────
window.addEventListener("load", () => {
  if (!window.gsap) return;
  gsap.registerPlugin(ScrollTrigger);

  // Hero entrance
  gsap
    .timeline({ delay: 0.2 })
    .from("#hero-badge", {
      y: 20,
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
    })
    .from(
      "#hero-h1",
      { y: 40, opacity: 0, duration: 0.7, ease: "power3.out" },
      "-=.2",
    )
    .from(
      "#hero-sub",
      { y: 25, opacity: 0, duration: 0.5, ease: "power2.out" },
      "-=.3",
    )
    .from(
      "#hero-actions",
      { y: 20, opacity: 0, duration: 0.4, ease: "power2.out" },
      "-=.2",
    )
    .from(
      "#hero-stats .stat-item",
      { y: 20, opacity: 0, stagger: 0.12, duration: 0.5, ease: "power2.out" },
      "-=.1",
    );

  // Hero right panel
  const hr = document.getElementById("hero-right");
  if (hr) {
    gsap.from("#hero-phone", {
      y: 80,
      opacity: 0,
      duration: 1,
      ease: "back.out(1.4)",
      delay: 0.6,
    });
    ["#fc1", "#fc2", "#fc3", "#fc4"].forEach((id, i) => {
      gsap.from(id, {
        x: i % 2 === 0 ? -50 : 50,
        opacity: 0,
        duration: 0.7,
        ease: "back.out(1.6)",
        delay: 0.9 + i * 0.15,
      });
      gsap.to(id, {
        y: [-12, 10, -8, 14][i],
        duration: [3.2, 2.8, 3.5, 3][i],
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.3,
      });
    });
    gsap.to("#hero-phone", {
      y: -10,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 0.6,
    });
    gsap.to(".orb-r1", {
      rotation: 360,
      duration: 20,
      repeat: -1,
      ease: "none",
      transformOrigin: "center center",
    });
    gsap.to(".orb-r3", {
      rotation: -360,
      duration: 30,
      repeat: -1,
      ease: "none",
      transformOrigin: "center center",
    });
    gsap.to(".hero-orb", {
      boxShadow: "0 0 80px rgba(124,61,214,.5)",
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }

  // Counters
  setTimeout(() => {
    document.querySelectorAll("[data-target]").forEach((el) => {
      const hasPct = el
        .closest(".stat-item")
        .querySelector(".label")
        .textContent.includes("%");
      gsap.to(
        { val: 0 },
        {
          val: +el.dataset.target,
          duration: 2,
          ease: "power2.out",
          onUpdate: function () {
            el.textContent =
              Math.round(this.targets()[0].val) + (hasPct ? "%" : "+");
          },
        },
      );
    });
  }, 600);

  // Scroll reveals
  document.querySelectorAll(".reveal").forEach((el) => {
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        toggleActions: "play none none none",
      },
      y: 0,
      opacity: 1,
      duration: 0.65,
      ease: "power2.out",
    });
  });
  document.querySelectorAll(".reveal-left").forEach((el) => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: "top 88%" },
      x: 0,
      opacity: 1,
      duration: 0.7,
      ease: "power2.out",
    });
  });
  document.querySelectorAll(".reveal-right").forEach((el) => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: "top 88%" },
      x: 0,
      opacity: 1,
      duration: 0.7,
      ease: "power2.out",
    });
  });
  document.querySelectorAll(".reveal-scale").forEach((el) => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: "top 88%" },
      scale: 1,
      opacity: 1,
      duration: 0.6,
      ease: "back.out(1.5)",
    });
  });

  // Service card hover
  document.querySelectorAll(".service-card").forEach((card) => {
    card.addEventListener("mouseenter", () =>
      gsap.to(card, { y: -6, duration: 0.3, ease: "power2.out" }),
    );
    card.addEventListener("mouseleave", () =>
      gsap.to(card, { y: 0, duration: 0.3, ease: "power2.inOut" }),
    );
  });

  // Kente stripe scroll
  gsap.to(".kente-stripe", {
    backgroundPositionX: "80px",
    duration: 2,
    repeat: -1,
    ease: "none",
  });
});

// ─── PWA ──────────────────────────────────────────────
if ("serviceWorker" in navigator)
  navigator.serviceWorker.register("sw.js").catch(() => {});

let deferredPrompt;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  setTimeout(
    () => document.getElementById("install-banner").classList.add("visible"),
    3000,
  );
});
document.getElementById("install-btn").addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === "accepted")
    document.getElementById("install-banner").classList.remove("visible");
  deferredPrompt = null;
});
document.getElementById("close-banner").addEventListener("click", () => {
  document.getElementById("install-banner").classList.remove("visible");
});

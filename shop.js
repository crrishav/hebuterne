(function () {
  const S = window.SHOP;
  const P = window.PRODUCTS;
  const byId = Object.fromEntries(P.map(p => [p.id, p]));
  const $ = s => document.querySelector(s);
  const MAX_QTY = 5;
  const isDev = location.hostname === "localhost" || location.hostname === "127.0.0.1";

  const CFG = {
    clarity: document.body.dataset.clarityId || "",
    gtag: document.body.dataset.gtagId || "",
    plausible: document.body.dataset.plausibleDomain || ""
  };

  function loadThirdParty() {
    if (CFG.clarity) {
      (function (c, l, a, r, i) {
        c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
        const t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
        const y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
      })(window, document, "clarity", "script", CFG.clarity);
    }
    if (CFG.gtag) {
      const s = document.createElement("script");
      s.async = true;
      s.src = "https://www.googletagmanager.com/gtag/js?id=" + CFG.gtag;
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag("js", new Date());
      window.gtag("config", CFG.gtag);
    }
    if (CFG.plausible) {
      const s = document.createElement("script");
      s.defer = true;
      s.dataset.domain = CFG.plausible;
      s.src = "https://plausible.io/js/script.js";
      document.head.appendChild(s);
      window.plausible = window.plausible || function () { (window.plausible.q = window.plausible.q || []).push(arguments); };
    }
  }

  function track(name, props) {
    const p = props || {};
    try {
      if (window.va) window.va("event", { name, data: p });
      if (window.clarity) window.clarity("event", name);
      if (window.gtag) window.gtag("event", name, p);
      if (window.plausible) window.plausible(name, { props: p });
    } catch {}
    if (isDev) console.debug("track", name, p);
  }

  const money = n => S.currency + n;
  const backdrop = $("[data-backdrop]");
  const lines = $("[data-bag-lines]");
  const foot = $("[data-bag-foot]");
  const panels = { menu: $("#menu"), bag: $("#bag") };
  const triggers = { menu: $("[data-open='menu']"), bag: $("[data-open='bag']") };
  let open = null;

  function read() {
    try {
      const v = JSON.parse(localStorage.getItem(S.storageKey)) || [];
      return v.filter(l => byId[l.id] && S.sizes.includes(l.size) && l.qty > 0).map(l => ({
        id: l.id,
        size: l.size,
        colour: (byId[l.id].colours.find(c => c.key === l.colour) || byId[l.id].colours[0]).key,
        qty: Math.min(MAX_QTY, l.qty)
      }));
    } catch { return []; }
  }
  function write() { localStorage.setItem(S.storageKey, JSON.stringify(bag)); }
  function getRef() {
    try { return localStorage.getItem(S.refKey) || ""; } catch { return ""; }
  }
  let bag = read();
  const count = () => bag.reduce((n, l) => n + l.qty, 0);
  const total = () => bag.reduce((n, l) => n + l.qty * byId[l.id].price, 0);

  function render() {
    const n = String(count()).padStart(2, "0");
    document.querySelectorAll("[data-bag-count]").forEach(el => el.textContent = n);
    if (!lines) return;
    if (!bag.length) {
      lines.innerHTML = '<p class="bag-empty">Your bag is empty.</p>';
      if (foot) foot.innerHTML = "";
      return;
    }
    lines.innerHTML = bag.map(l => {
      const p = byId[l.id];
      const c = p.colours.find(x => x.key === l.colour) || p.colours[0];
      const key = `${l.id}:${l.size}:${l.colour}`;
      const label = p.colours.length > 1 ? `${p.name}, ${c.label}, UK ${l.size}` : `${p.name}, UK ${l.size}`;
      return `<div class="line">
        <span>${label}</span>
        <span>${money(p.price * l.qty)}</span>
        <div class="line-qty">
          <button type="button" data-qty="${key}" data-d="-1" aria-label="Fewer">&minus;</button>
          <span>${l.qty}</span>
          <button type="button" data-qty="${key}" data-d="1" aria-label="More">+</button>
        </div>
        <button type="button" class="line-remove" data-remove="${key}">Remove</button>
      </div>`;
    }).join("");
    foot.innerHTML = `<div class="bag-total"><span>Total</span><span>${money(total())}</span></div>
      <button type="button" class="btn" data-checkout>Checkout</button>
      <p class="hint">Apple Pay and Link supported at checkout.</p>
      <p class="msg" data-bag-msg></p>`;
  }

  function show(name) {
    if (!panels[name]) return;
    if (open && open !== name) hide();
    open = name;
    panels[name].classList.add("is-open");
    backdrop.classList.add("is-on");
    document.body.classList.add("is-locked");
    triggers[name].setAttribute("aria-expanded", "true");
    if (name === "menu") track("menu_open");
    if (name === "bag") track("open_bag");
    requestAnimationFrame(() => panels[name].querySelector("[data-close]").focus());
  }
  function hide() {
    if (!open) return;
    const name = open;
    open = null;
    panels[name].classList.remove("is-open");
    backdrop.classList.remove("is-on");
    document.body.classList.remove("is-locked");
    triggers[name].setAttribute("aria-expanded", "false");
    triggers[name].focus({ preventScroll: true });
  }

  function setQty(id, size, colour, d) {
    const line = bag.find(l => l.id === id && l.size === size && l.colour === colour);
    if (!line) return;
    line.qty = Math.min(MAX_QTY, line.qty + d);
    if (line.qty <= 0) bag = bag.filter(l => l !== line);
    write();
    render();
  }
  function removeLine(id, size, colour) { bag = bag.filter(l => !(l.id === id && l.size === size && l.colour === colour)); write(); render(); }

  function add(id, size, colour) {
    const p = byId[id];
    if (!p || p.status !== "available") return false;
    const c = colour || p.colours[0].key;
    const line = bag.find(l => l.id === id && l.size === size && l.colour === c);
    if (line) line.qty = Math.min(MAX_QTY, line.qty + 1); else bag.push({ id, size, colour: c, qty: 1 });
    write();
    render();
    track("add_to_bag", { id, size, colour: c, price: p.price });
    show("bag");
    return true;
  }

  async function checkout(btn) {
    const m = $("[data-bag-msg]");
    btn.disabled = true;
    if (m) m.textContent = "";
    const ref = getRef();
    const body = { brand: S.brand, items: bag.map(l => ({ id: l.id, size: l.size, colour: l.colour, qty: l.qty })) };
    if (ref) body.code = ref;
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = res.ok ? await res.json() : null;
      if (data && data.url) {
        track("checkout_start", { items: bag.map(l => l.id + ":" + l.size + ":" + l.colour).join(","), code: ref || undefined });
        location.href = data.url;
        return;
      }
      throw new Error();
    } catch {
      if (m) m.textContent = "Checkout is not open yet. Your bag is saved on this device.";
      btn.disabled = false;
    }
  }

  function copyReferral(btn) {
    const referralLink = $("[data-referral-link]");
    if (!referralLink || !referralLink.value || !navigator.clipboard) return;
    navigator.clipboard.writeText(referralLink.value).then(() => {
      track("referral_copy");
      btn.textContent = "Copied";
      setTimeout(() => { btn.textContent = "Copy"; }, 1500);
    }).catch(() => {});
  }

  async function loadReferral(sessionId) {
    const referralBox = $("[data-referral]");
    const referralLink = $("[data-referral-link]");
    const referralMsg = $("[data-referral-msg]");
    if (!referralBox) return;
    try {
      const res = await fetch("/api/referral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId })
      });
      if (res.status === 503) {
        referralBox.hidden = false;
        referralLink.value = location.origin + "/";
        referralMsg.textContent = "Your code is on its way.";
        return;
      }
      const data = res.ok ? await res.json() : null;
      if (!data || !data.code) { referralBox.hidden = true; return; }
      referralBox.hidden = false;
      referralLink.value = data.link || (location.origin + "/?ref=" + data.code);
      referralMsg.textContent = "";
    } catch {
      referralBox.hidden = true;
    }
  }

  document.addEventListener("click", e => {
    const t = e.target.closest("[data-open],[data-close],[data-qty],[data-remove],[data-checkout],[data-referral-copy]");
    if (!t) return;
    if (t.dataset.open) show(t.dataset.open);
    else if (t.hasAttribute("data-close")) hide();
    else if (t.dataset.qty) { const [id, size, colour] = t.dataset.qty.split(":"); setQty(id, size, colour, Number(t.dataset.d)); }
    else if (t.dataset.remove) { const [id, size, colour] = t.dataset.remove.split(":"); removeLine(id, size, colour); }
    else if (t.hasAttribute("data-checkout")) checkout(t);
    else if (t.hasAttribute("data-referral-copy")) copyReferral(t);
  });

  document.addEventListener("keydown", e => {
    if (!open) return;
    if (e.key === "Escape") { hide(); return; }
    if (e.key !== "Tab") return;
    const f = [...panels[open].querySelectorAll("a[href],button:not([disabled]),input:not([tabindex='-1'])")].filter(el => !el.closest("[hidden]"));
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  let scrolledHalf = false, scrolledFull = false;
  window.addEventListener("scroll", () => {
    const h = document.documentElement;
    const pct = h.scrollHeight > h.clientHeight ? (h.scrollTop + h.clientHeight) / h.scrollHeight : 1;
    if (!scrolledHalf && pct >= 0.5) { scrolledHalf = true; track("scroll_50"); }
    if (!scrolledFull && pct >= 0.99) { scrolledFull = true; track("scroll_100"); }
  }, { passive: true });

  const pageStart = Date.now();
  window.addEventListener("pagehide", () => {
    track("time_on_page", { seconds: Math.round((Date.now() - pageStart) / 1000) });
  });

  const refParam = new URLSearchParams(location.search).get("ref");
  if (refParam && /^[A-Z0-9-]{1,20}$/i.test(refParam)) {
    localStorage.setItem(S.refKey, refParam.toUpperCase());
  }
  const refNote = $("[data-ref-note]");
  if (refNote) refNote.hidden = !getRef();

  const params = new URLSearchParams(location.search);
  const flag = params.get("checkout");
  const sessionId = params.get("session_id");
  const notice = $("[data-notice]");
  if (flag && notice) {
    if (flag === "success") {
      bag = []; write();
      track("checkout_success", sessionId ? { session_id: sessionId } : {});
      if (sessionId) loadReferral(sessionId);
    } else if (flag === "cancel") {
      track("checkout_cancel");
    }
    notice.textContent = flag === "success" ? "Paid. Thank you." : "Checkout cancelled.";
    notice.hidden = false;
  }
  if (flag || refParam) history.replaceState(null, "", location.pathname);

  loadThirdParty();
  render();
  track("page_view", { path: location.pathname, referrer: document.referrer });
  if (document.body.dataset.page === "info") track("info_view");

  window.Shop = { products: P, byId, money, add, track, getRef };
})();

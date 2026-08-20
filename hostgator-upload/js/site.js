const nextStamp = "2026-08-29T12:00:00-04:00";
function pad(n){return String(n).padStart(2,"0")}
function tick(){
  const root = document.querySelectorAll("[data-countdown]");
  const target = new Date(nextStamp).getTime();
  let s = Math.max(0, Math.floor((target - Date.now())/1000));
  const d = Math.floor(s/86400); s %= 86400;
  const h = Math.floor(s/3600); s %= 3600;
  const m = Math.floor(s/60); s %= 60;
  const vals = [pad(d), pad(h), pad(m), pad(s)];
  root.forEach(el => { el.querySelectorAll("b").forEach((b,i)=>{ b.textContent = vals[i]; }); });
}
tick();
setInterval(tick, 1000);

const header = document.querySelector(".header");
const onHome = document.body.dataset.page === "home";
function solid(){
  if (!header) return;
  if (!onHome || window.scrollY > 16) header.classList.add("is-solid");
  else header.classList.remove("is-solid");
}
solid();
window.addEventListener("scroll", solid, { passive: true });

const toggle = document.querySelector("[data-menu]");
const drawer = document.querySelector(".mobile-nav");
toggle?.addEventListener("click", () => {
  const open = drawer.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open ? "true" : "false");
  document.body.style.overflow = open ? "hidden" : "";
  if (open) header?.classList.add("is-solid");
  else solid();
});

const packKey = "tt-pack";
let packed = [];
try { packed = JSON.parse(localStorage.getItem(packKey) || "[]"); } catch(e) {}
document.querySelectorAll("[data-pack]").forEach(btn => {
  const id = btn.getAttribute("data-pack");
  if (packed.includes(id)) btn.classList.add("on");
  btn.addEventListener("click", () => {
    packed = packed.includes(id) ? packed.filter(x => x !== id) : packed.concat(id);
    localStorage.setItem(packKey, JSON.stringify(packed));
    btn.classList.toggle("on", packed.includes(id));
  });
});

document.querySelectorAll("[data-filter]").forEach(btn => {
  btn.addEventListener("click", () => {
    const f = btn.getAttribute("data-filter");
    document.querySelectorAll("[data-filter]").forEach(b => b.className = "btn btn-outline btn-sm");
    btn.className = "btn btn-gold btn-sm";
    document.querySelectorAll("[data-game]").forEach(card => {
      const show = f === "all" || card.getAttribute("data-game").includes(f);
      card.style.display = show ? "" : "none";
    });
    document.querySelector("[data-byes]")?.style && (document.querySelector("[data-byes]").style.display = f === "all" ? "" : "none");
  });
});

document.querySelectorAll("[data-copy]").forEach(btn => {
  btn.addEventListener("click", async () => {
    const text = btn.getAttribute("data-copy");
    try {
      await navigator.clipboard.writeText(text);
      const prev = btn.textContent;
      btn.textContent = "Copied";
      setTimeout(() => { btn.textContent = prev; }, 1600);
    } catch(e) {}
  });
});

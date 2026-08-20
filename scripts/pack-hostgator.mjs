#!/usr/bin/env node
import { cpSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = "/workspace";
const OUT = join(ROOT, "hostgator-upload");
const BUILD = "21";
const ZIP = `/tmp/TailgateTribe-VERIFIED-build${BUILD}.zip`;
const LAT = 30.4390911;
const LNG = -84.3011454;
const GMAPS = `https://www.google.com/maps/search/?api=1&query=${LAT},${LNG}`;

rmSync(OUT, { recursive: true, force: true });
mkdirSync(join(OUT, "css"), { recursive: true });
mkdirSync(join(OUT, "js"), { recursive: true });
mkdirSync(join(OUT, "photos"), { recursive: true });
mkdirSync(join(OUT, "fonts"), { recursive: true });
mkdirSync(join(OUT, "calendar"), { recursive: true });

cpSync(join(ROOT, "public/photos"), join(OUT, "photos"), { recursive: true });
cpSync(join(ROOT, "public/fonts"), join(OUT, "fonts"), { recursive: true });
cpSync(join(ROOT, "public/vendor"), join(OUT, "vendor"), { recursive: true });
cpSync(join(ROOT, "public/favicon.svg"), join(OUT, "favicon.svg"));
cpSync(join(ROOT, "public/og.jpg"), join(OUT, "og.jpg"));

const css = `@font-face{font-family:"Oswald";font-style:normal;font-weight:400 700;font-display:swap;src:url("../fonts/oswald.woff2") format("woff2")}
@font-face{font-family:"Figtree";font-style:normal;font-weight:400 700;font-display:swap;src:url("../fonts/figtree.woff2") format("woff2")}
@font-face{font-family:"Figtree";font-style:italic;font-weight:400 700;font-display:swap;src:url("../fonts/figtree-italic.woff2") format("woff2")}
:root {
  --garnet:#782f40; --garnet-deep:#2a0f16; --garnet-dark:#4a1c28;
  --gold:#ceb888; --gold-bright:#e4d4a8; --cream:#f3ebdc;
  --ink:#14080c; --surface:#1c0c12; --surface-2:#261017;
  --muted:#c4b6a6; --border:#ceb88838;
  --display:"Oswald",sans-serif; --sans:"Figtree",sans-serif;
}
*{box-sizing:border-box}
html{background:var(--ink);color:var(--cream);-webkit-font-smoothing:antialiased;font-synthesis:none}
body{margin:0;font-family:var(--sans);line-height:1.55;background:var(--ink);color:var(--cream)}
img{max-width:100%;display:block}
a{color:inherit}
h1,h2,h3{font-family:var(--display);letter-spacing:.04em;line-height:.95;text-wrap:balance;margin:0}
p{text-wrap:pretty}
button{font-family:inherit;cursor:pointer}
.wrap{width:min(72rem,calc(100% - 2rem));margin-inline:auto}
.kicker{font-family:var(--display);font-size:.75rem;letter-spacing:.28em;text-transform:uppercase;color:var(--gold);font-weight:500;white-space:nowrap}
.stripe{display:flex;height:8px}
.stripe .grow{flex:1;background:var(--garnet)}
.stripe .gold{width:10px;background:var(--gold)}
.stripe .gap{width:6px;background:var(--garnet)}
.header{position:fixed;inset:0 0 auto;z-index:40}
.header-bar{display:flex;align-items:center;justify-content:space-between;gap:1rem;width:min(72rem,calc(100% - 2rem));margin-inline:auto;height:3.5rem}
.header.is-solid{background:var(--ink);border-bottom:1px solid var(--border)}
.brand{display:flex;align-items:center;gap:.75rem;text-decoration:none;color:var(--cream);font-family:var(--display);text-transform:uppercase;letter-spacing:.04em;font-size:1.35rem}
nav.desk{display:none;gap:1.5rem}
nav.desk a{text-decoration:none;color:rgb(243 235 220 / .8);font-size:.9rem;font-weight:500}
nav.desk a.active,nav.desk a:hover{color:var(--gold)}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;height:2.75rem;min-height:2.75rem;padding:0 1.25rem;border-radius:.75rem;text-decoration:none;font-weight:500;font-size:.875rem;border:1px solid transparent;transition:150ms ease;background:transparent;color:inherit;white-space:nowrap;flex-shrink:0;box-sizing:border-box}
.btn svg{width:1rem;height:1rem;flex-shrink:0}
.btn-gold{background:var(--gold);color:var(--ink)}
.btn-gold:hover{background:var(--gold-bright)}
.btn-outline{border-color:var(--gold);color:var(--gold)}
.btn-outline:hover{background:var(--gold);color:var(--ink)}
.btn-cream{background:var(--cream);color:var(--ink)}
.btn-sm{height:2.25rem;min-height:2.25rem;padding:0 .875rem;font-size:.875rem}
.icon-btn{width:2.75rem;height:2.75rem;border:0;background:transparent;color:var(--cream);display:grid;place-items:center}
.mobile-nav{display:none;position:fixed;inset:3.5rem 0 0;background:var(--ink);padding:2rem 1.5rem;z-index:40}
.mobile-nav.open{display:flex;flex-direction:column;gap:.5rem}
.mobile-nav a{font-family:var(--display);font-size:2rem;text-transform:uppercase;text-decoration:none;color:var(--cream);padding:.75rem .5rem}
.hero{position:relative;min-height:100svh;display:flex;align-items:flex-end}
.hero img.bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.hero .veil{position:absolute;inset:0;background:linear-gradient(to bottom,rgb(20 8 12 / .25),rgb(20 8 12 / .45),var(--ink))}
.hero-copy{position:relative;padding:7rem 0 3rem}
.display{font-size:clamp(3.2rem,12vw,8rem);text-transform:uppercase;color:var(--cream)}
.lede{max-width:36rem;font-size:1.15rem;color:rgb(243 235 220 / .9)}
.panel{margin-top:2.5rem;max-width:40rem;border:1px solid var(--border);background:rgb(20 8 12 / .55);border-radius:1rem;padding:1.25rem 1.5rem;backdrop-filter:blur(8px)}
.count{display:flex;flex-wrap:wrap;gap:.75rem;margin-top:1rem}
.count div{min-width:4.5rem;text-align:center;border:1px solid var(--border);background:rgb(20 8 12 / .5);border-radius:.5rem;padding:.5rem .75rem}
.count b{display:block;font-family:var(--display);font-size:2.5rem;color:var(--gold);font-weight:500;font-variant-numeric:tabular-nums;line-height:1}
.count span{font-family:var(--display);font-size:.7rem;letter-spacing:.28em;text-transform:uppercase;color:var(--muted)}
.wx{display:inline-flex;align-items:center;gap:.5rem;height:2.25rem;min-height:2.25rem;border:1px solid var(--border);border-radius:999px;padding:0 .85rem;font-size:.875rem;color:var(--cream);background:rgb(20 8 12 / .4);white-space:nowrap;flex-shrink:0;box-sizing:border-box}
.wx svg{width:1rem;height:1rem;flex-shrink:0;color:var(--gold)}
.cta-row{display:flex;flex-wrap:wrap;align-items:center;gap:.75rem;margin-top:2rem}
.section{padding:4.5rem 0;border-top:1px solid var(--border)}
.surface{background:var(--surface)}
.grid-3{display:grid;gap:1rem}
.grid-2{display:grid;gap:1rem}
.grid-5{display:grid;gap:1rem}
.card{border:1px solid var(--border);background:var(--surface);border-radius:1rem;padding:1.5rem}
.card h3{color:var(--gold);font-size:1.5rem;text-transform:uppercase}
.muted{color:var(--muted)}
.game{display:grid;gap:1.25rem;border:1px solid var(--border);background:var(--surface);border-radius:1rem;padding:1.25rem;margin-bottom:1rem}
.game-cta{display:flex;flex-direction:column;gap:.5rem;justify-content:center}
.game-cta .btn{width:100%}
.game.featured{border-color:rgb(206 184 136 / .5);background:var(--surface-2)}
.datecol .mo{font-family:var(--display);letter-spacing:.28em;color:var(--gold);font-size:.75rem}
.datecol .dy{font-family:var(--display);font-size:3rem;line-height:1}
.chips{display:flex;flex-wrap:wrap;gap:.4rem}
.chip{font-size:.7rem;font-weight:600;letter-spacing:.04em;text-transform:uppercase;padding:.25rem .6rem;border-radius:999px}
.chip-gold{background:var(--gold);color:var(--ink)}
.chip-garnet{background:var(--garnet);color:var(--cream)}
.chip-mute{border:1px solid var(--border);color:var(--muted)}
.mosaic{display:grid;grid-template-columns:1fr 1fr;gap:.75rem}
.mosaic img{width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:.75rem}
.band{background:var(--garnet);text-align:center;padding:4rem 1rem}
.footer{background:var(--surface)}
.footer-grid{display:grid;gap:2rem;padding:3.5rem 0 0}
.legal{border-top:1px solid var(--border);margin-top:2.5rem;padding:1.1rem 0;font-size:.75rem;color:var(--muted);display:flex;flex-direction:column;gap:.35rem}
.page-head{padding:6.5rem 0 2rem}
.split{display:grid;gap:1rem}
.map-frame{min-height:24rem;height:24rem;border-radius:1rem;overflow:hidden;border:1px solid var(--border);background:var(--surface)}
.map-frame.leaflet-container,.map-frame .leaflet-container{width:100%;height:24rem;background:var(--surface)}
.tribe-pin{background:transparent !important;border:0 !important}
.steps{display:grid;gap:1rem}
.pack button{width:100%;display:flex;align-items:center;gap:.75rem;text-align:left;background:var(--surface);color:var(--cream);border:1px solid var(--border);border-radius:.5rem;padding:.9rem 1rem;margin-bottom:.5rem}
.pack button.on{border-color:var(--gold);background:rgb(74 28 40 / .6)}
.box{width:1.4rem;height:1.4rem;border:1px solid var(--gold);border-radius:.25rem;display:grid;place-items:center;color:transparent;flex-shrink:0}
.pack button.on .box{background:var(--gold);color:var(--ink)}
details{border-bottom:1px solid var(--border);padding:1.1rem 0}
details summary{font-family:var(--display);font-size:1.25rem;cursor:pointer;list-style:none;display:flex;justify-content:space-between;gap:1rem}
details summary::-webkit-details-marker{display:none}
details p{color:var(--muted);margin:.75rem 0 0}
.filter{display:flex;flex-wrap:wrap;gap:.5rem;margin:1.5rem 0 2rem}
.photo-cover{position:relative;overflow:hidden}
.photo-cover img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.photo-cover .veil{position:absolute;inset:0;background:rgb(20 8 12 / .75)}
.hero-inner{position:relative;padding:5rem 0}
.ticker{overflow-x:hidden;border-top:1px solid var(--border);border-bottom:1px solid var(--border);background:var(--garnet-deep);scrollbar-width:none}
.ticker::-webkit-scrollbar{display:none}
.ticker-row{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:.4rem .5rem;width:100%;padding:.7rem 1rem;min-width:0}
.ticker a{display:inline-flex;align-items:center;gap:.4rem;min-height:2.5rem;padding:.3rem .65rem;border:1px solid var(--border);border-radius:999px;text-decoration:none;color:var(--cream);white-space:nowrap;font-size:.85rem;font-weight:500;flex:0 0 auto}
.ticker a span{font-family:var(--display);font-size:.7rem;letter-spacing:.06em;text-transform:uppercase}
.ticker a.next{background:var(--gold);color:var(--ink);border-color:var(--gold)}
.play{display:grid;gap:1rem}
.between{display:flex;flex-wrap:wrap;align-items:end;justify-content:space-between;gap:1rem}
@media (min-width:900px){
  .ticker-row{flex-wrap:nowrap;justify-content:center;padding:.7rem 1.25rem;gap:.5rem}
  nav.desk{display:flex}
  .icon-btn{display:none}
  .grid-3{grid-template-columns:repeat(3,1fr)}
  .grid-2{grid-template-columns:1fr 1fr}
  .grid-5{grid-template-columns:repeat(5,1fr)}
  .game{grid-template-columns:6rem 1fr 12rem;align-items:center}
  .mosaic{grid-template-columns:repeat(3,1fr)}
  .footer-grid{grid-template-columns:2fr 1fr 1fr}
  .split{grid-template-columns:3fr 2fr}
  .steps{grid-template-columns:1fr 1fr}
  .legal{flex-direction:row;justify-content:space-between}
  .hide-desk-cta{display:inline-flex}
}
@media (max-width:899px){.hide-desk-cta{display:none}}
@media (prefers-reduced-motion:reduce){*{transition:none !important}}
`;

writeFileSync(join(OUT, "css/site.css"), css);

const js = `const nextStamp = "2026-08-29T12:00:00-04:00";
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
`;
writeFileSync(join(OUT, "js/site.js"), js);

const tent = `<svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true"><rect width="32" height="32" rx="6" fill="#782F40"/><path d="M16 3c1.7 2.3 3.1 3.3 3.1 5.2 0 1.7-1.4 3-3.1 3s-3.1-1.3-3.1-3c0-1.9 1.4-2.9 3.1-5.2Z" fill="#CEB888"/><rect x="15" y="11" width="2.2" height="8" rx=".6" fill="#CEB888"/><path d="M16 29 L9.5 17.5 H22.5 Z" fill="#CEB888"/><path d="M16 25 L12 19 H20 Z" fill="#4A1C28"/></svg>`;
const stripe = `<div class="stripe" aria-hidden="true"><span class="grow"></span><span class="gold"></span><span class="gap"></span><span class="gold"></span><span class="gap"></span><span class="gold"></span><span class="grow"></span></div>`;

function header(active) {
  const item = (href, label, key) =>
    `<a href="${href}" class="${active === key ? "active" : ""}">${label}</a>`;
  return `<header class="header">
  ${stripe}
  <div class="header-bar">
    <a class="brand" href="index.html">${tent} Tailgate Tribe</a>
    <nav class="desk" aria-label="Primary">
      ${item("index.html", "Home", "home")}
      ${item("schedule.html", "Schedule", "schedule")}
      ${item("gameday.html", "Gameday", "gameday")}
      ${item("find-us.html", "Find us", "find")}
      ${item("the-tribe.html", "The Tribe", "tribe")}
    </nav>
    <div>
      <a class="btn btn-gold hide-desk-cta" href="https://www.facebook.com/groups/tailgatetribe/" target="_blank" rel="noreferrer">Join the group</a>
      <button class="icon-btn" data-menu aria-label="Open menu" aria-expanded="false">☰</button>
    </div>
  </div>
</header>
<div class="mobile-nav">
  <a href="index.html">Home</a>
  <a href="schedule.html">Schedule</a>
  <a href="gameday.html">Gameday</a>
  <a href="find-us.html">Find us</a>
  <a href="the-tribe.html">The Tribe</a>
  <a class="btn btn-gold" href="https://www.facebook.com/groups/tailgatetribe/" target="_blank" rel="noreferrer">Join the Facebook group</a>
</div>`;
}

const footer = `<footer class="footer">
  ${stripe}
  <div class="wrap footer-grid">
    <div>
      <div class="brand">${tent} Tailgate Tribe</div>
      <p class="muted">Gameday fellowship for Seminole fans at every home football game. Free, family-friendly, and fun under the inflatable tent.</p>
    </div>
    <div>
      <p class="kicker">On the lot</p>
      <p><a href="schedule.html">2026 schedule</a><br><a href="gameday.html">First-timer playbook</a><br><a href="find-us.html">Find the tent</a><br><a href="the-tribe.html">FAQ & what to bring</a></p>
    </div>
    <div>
      <p class="kicker">The group</p>
      <p><a href="https://www.facebook.com/groups/tailgatetribe/" target="_blank" rel="noreferrer">Facebook group</a><br>
      <a href="https://www.facebook.com/share/g/1Dp7rGwiKw/" target="_blank" rel="noreferrer">Event listings</a><br>
      Tallahassee, Florida</p>
    </div>
  </div>
  <div class="wrap legal">
    <span>Independent fan gathering. Not affiliated with Florida State University or Seminole Athletics.</span>
    <span>© 2026 Tailgate Tribe</span>
  </div>
</footer>
<script src="js/site.js?v=8"></script>
<script>
(function(){
  document.querySelectorAll("[data-weather]").forEach(function(el){
    var date = el.getAttribute("data-weather");
    var icon = (el.querySelector("svg") && el.querySelector("svg").outerHTML) || "";
    function paint(json){
      var d = json && json.daily;
      if (!d || !d.temperature_2m_max || !d.temperature_2m_max.length) throw new Error("empty");
      var high = Math.round(d.temperature_2m_max[0]);
      var low = Math.round(d.temperature_2m_min[0]);
      var rain = (d.precipitation_probability_max && d.precipitation_probability_max[0]) || 0;
      var parts = date.split("-");
      var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      var when = months[+parts[1]-1] + " " + (+parts[2]);
      el.innerHTML = icon + " " + when + " · Tallahassee · " + high + "° / " + low + "°" + (rain >= 30 ? " · " + rain + "% rain" : "");
    }
    function fail(){ el.innerHTML = icon + " Tallahassee forecast unavailable"; }
    var remote = "https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LNG}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&temperature_unit=fahrenheit&timezone=America%2FNew_York&start_date=" + date + "&end_date=" + date;
    fetch("weather.php?date=" + encodeURIComponent(date))
      .then(function(r){ if (!r.ok) throw new Error("php"); return r.json(); })
      .then(paint)
      .catch(function(){
        return fetch(remote).then(function(r){ if (!r.ok) throw new Error("wx"); return r.json(); }).then(paint);
      })
      .catch(fail);
  });
})();
</script>`;

function shell({ title, desc, active, body, page, extraHead = "" }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<!-- tt-build:21 -->
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${title}</title>
<meta name="description" content="${desc}"/>
<meta name="theme-color" content="#782F40"/>
<meta property="og:title" content="Tailgate Tribe"/>
<meta property="og:description" content="${desc}"/>
<meta property="og:image" content="https://www.tailgatetribe.com/og.jpg"/>
<meta property="og:type" content="website"/>
<meta name="twitter:card" content="summary_large_image"/>
<link rel="icon" href="favicon.svg" type="image/svg+xml"/>
<link rel="preload" href="fonts/oswald.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="fonts/figtree.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="css/site.css?v=16"/>
${extraHead}
</head>
<body data-page="${page}">
${header(active)}
${body}
${footer}
</body>
</html>`;
}

const games = [
  ["tribe home", "AUG", "29", "New Mexico State", "Sat, Aug 29 · Noon tailgate · 7:00 PM kickoff · The CW", "https://www.facebook.com/share/1BsfnyKz7a/", true, "calendar/nmsu.ics"],
  ["tribe home", "SEP", "07", "SMU", "Mon, Sep 7 · Labor Day Monday · Noon tailgate · 7:30 PM kickoff · ESPN", "https://www.facebook.com/share/1L7URfxUqV/", false, "calendar/smu.ics"],
  ["tribe", "SEP", "19", "Alabama", "Sat, Sep 19 · Road gathering · 8:00 AM · 3:30 PM kickoff · ABC", "https://www.facebook.com/share/1CG9AQDxCs/", false, "calendar/alabama.ics"],
  ["tribe home", "SEP", "26", "Central Arkansas", "Sat, Sep 26 · Tailgate time TBA", "https://www.facebook.com/share/18dvwR5sF9/", false, "calendar/cark.ics"],
  ["tribe home", "OCT", "03", "Virginia", "Sat, Oct 3 · Jefferson–Eppes Trophy · Tailgate time TBA", "https://www.facebook.com/share/1EN998erJo/", false, "calendar/virginia.ics"],
  ["all", "OCT", "09", "Louisville", "Fri, Oct 9 · Away · 7:00 PM · ESPN — no Tribe tent", "", false, ""],
  ["all", "OCT", "17", "Miami", "Sat, Oct 17 · Away — no Tribe tent", "", false, ""],
  ["tribe home", "OCT", "31", "Clemson", "Sat, Oct 31 · Tailgate time TBA", "https://www.facebook.com/share/1BQ7zTaraq/", false, "calendar/clemson.ics"],
  ["all", "NOV", "07", "Boston College", "Sat, Nov 7 · Away — no Tribe tent", "", false, ""],
  ["all", "NOV", "13", "Pittsburgh", "Fri, Nov 13 · Away · 7:00 PM · ESPN — no Tribe tent", "", false, ""],
  ["tribe home", "NOV", "21", "NC State", "Sat, Nov 21 · Tailgate time TBA", "https://www.facebook.com/share/14fyNw3FkwR/", false, "calendar/ncstate.ics"],
  ["tribe home", "NOV", "27", "Florida (Floriduh)", "Fri, Nov 27 · 10:30 AM tailgate · 3:30 PM kickoff · ABC", "https://www.facebook.com/share/1CXZNhpbVH/", false, "calendar/florida.ics"],
];

const icoExt = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>`;
const icoCal = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M8 2v4"/><path d="M16 2v4"/><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18"/><path d="M10 14h4"/><path d="M12 12v4"/></svg>`;

function gameCard(g) {
  const [flags, mo, dy, name, meta, fb, featured, ics] = g;
  const chips = [];
  if (featured) chips.push(`<span class="chip chip-gold">Next up</span>`);
  if (flags.includes("tribe")) chips.push(`<span class="chip chip-garnet">Tribe tent</span>`);
  else chips.push(`<span class="chip chip-mute">Road game</span>`);
  if (flags.includes("home")) chips.push(`<span class="chip chip-mute">Home</span>`);
  else chips.push(`<span class="chip chip-mute">Away</span>`);
  const cta = fb
    ? `<a class="btn btn-gold" href="${fb}" target="_blank" rel="noreferrer">Event details ${icoExt}</a>`
    : `<p class="muted">No Tribe tent this week.</p>`;
  const cal = ics ? `<a class="btn btn-outline btn-sm" href="${ics}">${icoCal} Add to calendar</a>` : "";
  return `<article class="game${featured ? " featured" : ""}" data-game="${flags}">
    <div class="datecol"><div class="mo">${mo}</div><div class="dy">${dy}</div></div>
    <div>
      <div class="chips">${chips.join("")}</div>
      <h3 style="color:var(--cream);font-size:1.85rem;text-transform:uppercase;margin-top:.4rem">${name}</h3>
      <p class="muted">${meta}</p>
    </div>
    <div class="game-cta">${cta}${cal}</div>
  </article>`;
}

const desc =
  "Free, family-friendly gameday fellowship for Florida State fans at every home football game. Look for the inflatable tent east of Lot 8.";

const ticker = `<div class="ticker">
  <div class="ticker-row">
    <p class="kicker">2026 tent dates</p>
    <a class="next" href="schedule.html"><span>AUG 29</span> NMSU</a>
    <a href="schedule.html"><span>SEP 07</span> SMU</a>
    <a href="schedule.html"><span>SEP 19</span> Bama</a>
    <a href="schedule.html"><span>SEP 26</span> UCA</a>
    <a href="schedule.html"><span>OCT 03</span> UVA</a>
    <a href="schedule.html"><span>OCT 31</span> Clemson</a>
    <a href="schedule.html"><span>NOV 21</span> NCST</a>
    <a href="schedule.html"><span>NOV 27</span> Floriduh</a>
  </div>
</div>`;

const icoWx = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;
const weatherChip = `<p class="wx" data-weather="2026-08-29">${icoWx} Checking Tallahassee…</p>`;
const countdown = `<div class="count" data-countdown>
  <div><b>--</b><span>Days</span></div>
  <div><b>--</b><span>Hrs</span></div>
  <div><b>--</b><span>Min</span></div>
  <div><b>--</b><span>Sec</span></div>
</div>`;

writeFileSync(
  join(OUT, "index.html"),
  shell({
    title: "Tailgate Tribe",
    desc,
    active: "home",
    page: "home",
    body: `<main>
<section class="hero">
  <img class="bg" src="photos/hero.jpg" alt="The Tailgate Tribe inflatable canopy at golden hour"/>
  <div class="veil"></div>
  <div class="wrap hero-copy">
    <p class="kicker">2026 season · Tallahassee</p>
    <h1 class="display">Tailgate<br/>Tribe</h1>
    <p class="lede">Gameday fellowship for Seminole fans — every home football game, under the inflatable tent. No tailgate tickets. No catch. Just Noles.</p>
    <div class="panel">
      <p class="kicker">Next tent raise</p>
      <h2 style="font-size:1.8rem;text-transform:uppercase;margin:.4rem 0">vs New Mexico State</h2>
      <p class="muted">Saturday, August 29 · Noon tailgate · 7:00 PM kickoff · The CW</p>
      ${countdown}
      <div class="cta-row" style="margin-top:1rem">
        ${weatherChip}
        <a class="btn btn-outline btn-sm" href="calendar/nmsu.ics">${icoCal} Add to calendar</a>
      </div>
    </div>
    <div class="cta-row">
      <a class="btn btn-gold" href="find-us.html">Find the tent</a>
      <a class="btn btn-outline" href="gameday.html">First-timer playbook</a>
    </div>
  </div>
</section>
${ticker}
<section class="section">
  <div class="wrap">
    <p class="kicker">01 — Who we are</p>
    <h2 class="display" style="font-size:clamp(2rem,6vw,3.2rem);margin:1rem 0">A place to land on gameday</h2>
    <p class="lede">Seminole faithful who get together for each home football game. We aren’t trying to sell you anything. If you don’t have a tailgate of your own, you do now.</p>
    <div class="grid-3" style="margin-top:2rem">
      <article class="card"><h3>Free, always</h3><p class="muted">No tickets, no wristbands, no pitch. We just want Noles to have a place to land on gameday.</p></article>
      <article class="card"><h3>Family friendly</h3><p class="muted">Kids are welcome. Tomahawk toss, chairs, and a laid-back tent. There is alcohol on site, and we keep the atmosphere respectful.</p></article>
      <article class="card"><h3>You already belong</h3><p class="muted">Don’t have a tailgate of your own? You do now. Pull up a chair. Stay for ten minutes or stay until you head inside.</p></article>
    </div>
  </div>
</section>
<section class="section surface">
  <div class="wrap">
    <p class="kicker">02 — Under the tent</p>
    <h2 class="display" style="font-size:clamp(2rem,6vw,3.2rem);margin:1rem 0 1.5rem">What you actually get</h2>
    <div class="grid-2">
      <article class="card"><h3 style="color:var(--cream)">The inflatable canopy</h3><p class="muted">Black arches, a garnet sail, and our spear on the front. Shade, a landmark, and the living room — chairs, couches, and TVs for the rest of gameday. The FSU game itself is inside Doak.</p></article>
      <article class="card"><h3 style="color:var(--cream)">Tomahawk toss</h3><p class="muted">An inflatable axe-throw next to the tent. Kids and grown-ups both get a turn.</p></article>
      <article class="card"><h3 style="color:var(--cream)">BYOB is welcome</h3><p class="muted">Bring whatever you want to drink and keep it for yourself. Nobody expects you to stock the tent. Punch is on the table if you want a cup.</p></article>
      <article class="card"><h3 style="color:var(--cream)">Garnet and gold punch</h3><p class="muted">Two dispensers on the table — one red, one gold. Cups next to them. Help yourself.</p></article>
    </div>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <div class="between">
      <div>
        <p class="kicker">03 — The slate</p>
        <h2 class="display" style="font-size:clamp(2rem,6vw,3.2rem);margin:1rem 0">When the tent is up</h2>
      </div>
      <a class="btn btn-outline" href="schedule.html">Full 2026 schedule</a>
    </div>
    <div style="margin-top:1.5rem">
      ${games.filter((g) => g[0].includes("tribe")).slice(0, 4).map(gameCard).join("")}
    </div>
  </div>
</section>
<section class="section photo-cover" style="min-height:28rem">
  <img src="photos/tent.jpg" alt="The Tailgate Tribe canopy: black arches and garnet sail"/>
  <div class="veil"></div>
  <div class="wrap hero-inner">
    <p class="kicker">04 — Find us</p>
    <h2 class="display" style="font-size:clamp(2rem,6vw,3.2rem);margin:1rem 0">East of Lot 8</h2>
    <p class="lede">NW corner of Pensacola Street and Varsity Drive. Grassy area east of Lot 8. Black inflatable arch, garnet sail, Tailgate Tribe on the front — you can’t miss it.</p>
    <a class="btn btn-gold" href="find-us.html" style="margin-top:1.5rem">Map & landmark</a>
  </div>
</section>
<section class="section surface">
  <div class="wrap">
    <div class="between">
      <div>
        <p class="kicker">05 — First time?</p>
        <h2 class="display" style="font-size:clamp(2rem,6vw,3.2rem);margin:1rem 0">How a Tribe Saturday goes</h2>
      </div>
      <a class="btn btn-outline" href="gameday.html">Full playbook</a>
    </div>
    <div class="grid-5" style="margin-top:2rem">
      <article class="card"><p class="kicker">01</p><h3 style="color:var(--cream)">Tent goes up</h3><p class="muted">We raise the inflatable at the published tailgate time.</p></article>
      <article class="card"><p class="kicker">02</p><h3 style="color:var(--cream)">Walk up</h3><p class="muted">No gate, no list. Say hey. Grab a chair.</p></article>
      <article class="card"><p class="kicker">03</p><h3 style="color:var(--cream)">The hang</h3><p class="muted">Punch, tomahawk toss, TVs on other games. The Noles play inside Doak.</p></article>
      <article class="card"><p class="kicker">04</p><h3 style="color:var(--cream)">Heritage Walk</h3><p class="muted">Optional. Players walk into Doak from Heritage Fountain. Cheer them in — we don’t move as a pack.</p></article>
      <article class="card"><p class="kicker">05</p><h3 style="color:var(--cream)">Skull Session</h3><p class="muted">Marching Chiefs at Dick Howser after the walk. Then inside for kickoff.</p></article>
    </div>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <p class="kicker">06 — The feel</p>
    <h2 class="display" style="font-size:clamp(2rem,6vw,3.2rem);margin:1rem 0 1.5rem">How gameday looks from here</h2>
    <div class="mosaic">
      <img src="photos/tent.jpg" alt="The Tailgate Tribe inflatable canopy"/>
      <img src="photos/canopy-lounge-43.jpg" alt="Inside the canopy: chairs, couches, and a screen"/>
      <img src="photos/tomahawk.jpg" alt="Inflatable tomahawk toss"/>
      <img src="photos/canopy-inside.jpg" alt="Looking out from under the canopy"/>
      <img src="photos/feast.jpg" alt="Shared tailgate food"/>
      <img src="photos/punch.jpg" alt="Two punch dispensers, one red and one gold"/>
    </div>
  </div>
</section>
<section class="band">
  ${stripe}
  <p class="kicker" style="margin-top:1.5rem">Pull up a chair</p>
  <h2 class="display" style="font-size:clamp(2rem,6vw,3.2rem);margin:1rem 0">Tell us you’re coming</h2>
  <p class="lede" style="margin-inline:auto">RSVP on each game’s Facebook event if you can — it helps us plan. Walking up without one is still welcome.</p>
  <div class="cta-row" style="justify-content:center">
    <a class="btn btn-cream" href="https://www.facebook.com/groups/tailgatetribe/" target="_blank" rel="noreferrer">Open the Facebook group</a>
    <a class="btn btn-outline" href="https://www.facebook.com/share/g/1Dp7rGwiKw/" target="_blank" rel="noreferrer">Tribe events</a>
  </div>
</section>
</main>`,
  }),
);

writeFileSync(
  join(OUT, "schedule.html"),
  shell({
    title: "2026 Schedule · Tailgate Tribe",
    desc,
    active: "schedule",
    page: "schedule",
    body: `<main>
<section class="page-head wrap">
  <p class="kicker">2026 football</p>
  <h1 class="display">The season</h1>
  <p class="lede">The Tribe raises the tent for every home game — plus the Alabama road gathering.</p>
  <div class="panel">
    <p class="kicker">Counting down</p>
    <h2 style="font-size:1.8rem;text-transform:uppercase;margin:.4rem 0">vs New Mexico State</h2>
    ${countdown}
    <div class="cta-row" style="margin-top:1rem">
      ${weatherChip}
      <a class="btn btn-outline btn-sm" href="calendar/nmsu.ics">${icoCal} Add NMSU</a>
      <a class="btn btn-outline btn-sm" href="calendar/tribe-2026.ics">${icoCal} Add season</a>
    </div>
  </div>
  <div class="filter">
    <button class="btn btn-gold btn-sm" data-filter="tribe" type="button">Tribe dates</button>
    <button class="btn btn-outline btn-sm" data-filter="home" type="button">Home games</button>
    <button class="btn btn-outline btn-sm" data-filter="all" type="button">Full slate</button>
  </div>
  ${games.map(gameCard).join("")}
  <div data-byes style="display:none;margin-top:2rem">
    <p class="kicker">Open dates</p>
    <div class="grid-2" style="margin-top:1rem">
      <article class="card"><h3 style="color:var(--cream)">SEP 12</h3><p class="muted">Open date — no game</p></article>
      <article class="card"><h3 style="color:var(--cream)">OCT 24</h3><p class="muted">Open date — no game</p></article>
    </div>
  </div>
</section>
</main>`,
  }),
);

writeFileSync(
  join(OUT, "gameday.html"),
  shell({
    title: "Gameday Playbook · Tailgate Tribe",
    desc,
    active: "gameday",
    page: "gameday",
    body: `<main>
<section class="photo-cover" style="min-height:28rem">
  <img src="photos/canopy-lounge.jpg" alt="Inside the Tailgate Tribe canopy"/>
  <div class="veil"></div>
  <div class="wrap hero-inner" style="padding-top:8rem">
    <p class="kicker">First-timer playbook</p>
    <h1 class="display" style="font-size:clamp(2.4rem,8vw,4.5rem)">Punch, then inside</h1>
    <p class="lede">You don’t need a booster pass, a pop-up, or a cousin who already knows everyone. Pour a cup, catch the Heritage Walk and Skull Session if you want, then head inside for the Noles.</p>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <p class="kicker">The day</p>
    <h2 class="display" style="font-size:clamp(2rem,6vw,3rem);margin:1rem 0 2rem">How a Tribe Saturday goes</h2>
    <article class="card" style="margin-bottom:1rem"><p class="kicker">01</p><h3 style="color:var(--cream)">Tent goes up</h3><p class="muted">We raise the inflatable at the published tailgate time. East of Lot 8, NW corner of Pensacola and Varsity.</p></article>
    <article class="card" style="margin-bottom:1rem"><p class="kicker">02</p><h3 style="color:var(--cream)">Walk up like you belong</h3><p class="muted">No gate, no list, no handshake password. Say hey. Grab a chair. Stay ten minutes or stay until you head inside.</p></article>
    <article class="card" style="margin-bottom:1rem"><p class="kicker">03</p><h3 style="color:var(--cream)">The hang</h3><p class="muted">Punch, tomahawk toss, TVs on other games. New faces, old friends. The Noles play inside Doak — not on our screens.</p></article>
    <article class="card" style="margin-bottom:1rem"><p class="kicker">04</p><h3 style="color:var(--cream)">Heritage Walk</h3><p class="muted">Optional. Players walk into Doak from Heritage Fountain, usually a couple of hours before kickoff. Cheer them in, then peel off — we don’t move as a pack.</p></article>
    <article class="card"><p class="kicker">05</p><h3 style="color:var(--cream)">Skull Session, then inside</h3><p class="muted">The Marching Chiefs play at Dick Howser right after the walk — section cheers and a peek at halftime. Then kickoff is in the stadium. See you next home game.</p></article>
  </div>
</section>
<section class="section surface">
  <div class="wrap">
    <p class="kicker">Traditions</p>
    <h2 class="display" style="font-size:clamp(2rem,6vw,3rem);margin:1rem 0 1.5rem">How we do gameday</h2>
    <div class="grid-2">
      <article class="card"><h3>The tent is the landmark</h3><p class="muted">Black inflatable arch, garnet sail, Tailgate Tribe on the front, grassy patch east of Lot 8.</p></article>
      <article class="card"><h3>Heritage Walk</h3><p class="muted">Players walk into Doak from Heritage Fountain. Catch it if you want. We don’t expect the tent to empty as a group.</p></article>
      <article class="card"><h3>Skull Session</h3><p class="muted">Marching Chiefs at Dick Howser, right after the walk. Then inside for kickoff.</p></article>
      <article class="card"><h3>Tomahawk toss</h3><p class="muted">The inflatable axe-throw is part of the tent. Take a turn. Cheer for the kid in front of you.</p></article>
      <article class="card"><h3>The War Chant</h3><p class="muted">When it starts, the tent gets loud. If you’re new, watch the people next to you and join in.</p></article>
    </div>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <p class="kicker">The setup</p>
    <h2 class="display" style="font-size:clamp(2rem,6vw,3rem);margin:1rem 0 1.5rem">Shade, seats, and a tomahawk toss</h2>
    <div class="grid-2">
      <img src="photos/canopy-lounge.jpg" alt="Inside the canopy: chairs, inflatable couches, and a screen" style="width:100%;border-radius:1rem;aspect-ratio:4/3;object-fit:cover"/>
      <img src="photos/tomahawk.jpg" alt="Inflatable tomahawk toss" style="width:100%;border-radius:1rem;aspect-ratio:4/3;object-fit:cover"/>
    </div>
  </div>
</section>
<section class="section surface">
  <div class="wrap">
    <p class="kicker">Under the tent</p>
    <h2 class="display" style="font-size:clamp(2rem,6vw,3rem);margin:1rem 0 1.5rem">What’s waiting</h2>
    <div class="grid-2">
      <article class="card"><h3>The inflatable canopy</h3><p class="muted">Black arches, a garnet sail, and our spear on the front. Shade, a landmark, and the living room — chairs, couches, and TVs for the rest of gameday. The FSU game itself is inside Doak.</p></article>
      <article class="card"><h3>Tomahawk toss</h3><p class="muted">An inflatable axe-throw next to the tent. Kids and grown-ups both get a turn.</p></article>
      <article class="card"><h3>BYOB is welcome</h3><p class="muted">Bring whatever you want to drink and keep it for yourself. Nobody expects you to stock the tent. Punch is on the table if you want a cup.</p></article>
      <article class="card"><h3>Garnet and gold punch</h3><p class="muted">Two dispensers on the table — one red, one gold. Cups next to them. Help yourself.</p></article>
    </div>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <p class="kicker">Pack the bag</p>
    <h2 class="display" style="font-size:clamp(2rem,6vw,3rem);margin:1rem 0">Tap what you’re bringing</h2>
    <div class="pack" style="margin-top:1.5rem">
      ${[
        ["chair", "A tailgate chair if you’re staying a while"],
        ["drink", "Your own drinks if you want them — BYOB is welcome"],
        ["colors", "Garnet and gold"],
        ["sun", "Hat, sunscreen, or a light layer"],
        ["kids", "Kid gear, if little Noles are coming"],
        ["kind", "A friendly attitude"],
      ]
        .map(([id, label]) => `<button type="button" data-pack="${id}"><span class="box">✓</span>${label}</button>`)
        .join("")}
    </div>
    <div class="cta-row">
      <a class="btn btn-gold" href="find-us.html">Find the tent</a>
      <a class="btn btn-outline" href="https://www.facebook.com/groups/tailgatetribe/" target="_blank" rel="noreferrer">Tell us you’re coming</a>
    </div>
  </div>
</section>
</main>`,
  }),
);

writeFileSync(
  join(OUT, "find-us.html"),
  shell({
    title: "Find Us · Tailgate Tribe",
    desc,
    active: "find",
    page: "find",
    extraHead: `<link rel="stylesheet" href="vendor/leaflet.css"/>`,
    active: "find",
    page: "find",
    body: `<main>
<section class="page-head wrap">
  <p class="kicker">Landmark</p>
  <h1 class="display">Find the tent</h1>
  <p class="lede">Look for us at the NW corner of Pensacola Street and Varsity Drive. Our tailgate is in the grassy area to the east of Lot 8. We have a black inflatable canopy with our name and spear on the sail — you can’t miss it.</p>
  <p class="muted" style="font-family:ui-monospace,monospace;margin-top:.5rem">${LAT}, ${LNG}</p>
  <div class="cta-row">
    <a class="btn btn-gold" href="${GMAPS}" target="_blank" rel="noreferrer">Open in Google Maps</a>
    <button class="btn btn-outline" type="button" data-copy="NW corner of Pensacola Street and Varsity Drive, Tallahassee, Florida. East of Lot 8. Pin: ${LAT}, ${LNG}">Copy address</button>
  </div>
</section>
<section class="wrap">
  <div id="lot-map" class="map-frame" role="region" aria-label="Map to Tailgate Tribe"></div>
  <script src="vendor/leaflet.js"></script>
  <script>
  (function(){
    if (!window.L) return;
    var map = L.map("lot-map", { scrollWheelZoom: false });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap"
    }).addTo(map);
    map.fitBounds([[30.436, -84.3065],[30.4412, -84.2988]], { padding: [12, 12] });
    var icon = L.divIcon({
      className: "tribe-pin",
      html: '<svg xmlns="http://www.w3.org/2000/svg" width="36" height="48" viewBox="0 0 36 48"><path fill="#782F40" stroke="#CEB888" stroke-width="2.2" d="M18 2.4c-8.1 0-14.6 6.5-14.6 14.6 0 10.4 14.6 28.2 14.6 28.2S32.6 27.4 32.6 17C32.6 8.9 26.1 2.4 18 2.4z"/><circle cx="18" cy="16.6" r="5.6" fill="#CEB888"/></svg>',
      iconSize: [36, 48],
      iconAnchor: [18, 46]
    });
    L.marker([${LAT}, ${LNG}], { icon: icon, title: "Tailgate Tribe" })
      .addTo(map)
      .bindPopup("Tailgate Tribe · east of Lot 8");
    setTimeout(function(){ map.invalidateSize(); }, 250);
  })();
  </script>
</section>
<section class="wrap split" style="margin-top:1.5rem">
  <img src="photos/tent.jpg" alt="The Tailgate Tribe inflatable canopy" style="width:100%;border-radius:1rem;object-fit:cover;min-height:20rem"/>
  <div style="position:relative;min-height:20rem;border-radius:1rem;overflow:hidden;border:1px solid var(--border)">
    <img src="photos/canopy-lounge.jpg" alt="Inside the canopy" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"/>
    <div style="position:absolute;inset:auto 0 0;padding:1.25rem;background:linear-gradient(to top, #14080c, transparent)">
      <p class="kicker">Pin this</p>
      <h3 style="color:var(--cream)">Pensacola & Varsity</h3>
      <p class="muted">East of Lot 8 · Tallahassee, Florida</p>
    </div>
  </div>
</section>
<section class="section">
  <div class="wrap steps">
    <article class="card"><p class="kicker">01</p><h3>Get to the corner</h3><p class="muted">NW corner of Pensacola Street and Varsity Drive, on the Florida State campus in Tallahassee.</p></article>
    <article class="card"><p class="kicker">02</p><h3>Look east of Lot 8</h3><p class="muted">Lot 8 itself is reserved booster parking. We set up on the grass just east of it — not in a numbered stall.</p></article>
    <article class="card"><p class="kicker">03</p><h3>Spot the inflatable canopy</h3><p class="muted">Black arched tubes, a garnet sail, Tailgate Tribe and the spear on the front. If you can see that, you’re in the right place.</p></article>
    <article class="card"><p class="kicker">04</p><h3>Walk up</h3><p class="muted">No gate, no list. Say hey, grab a chair, stay as long as you like.</p></article>
  </div>
  <div class="wrap" style="margin-top:2rem">
    <p class="muted" style="max-width:40rem">Follow official FSU gameday parking rules. Don’t park in reserved booster stalls. The tent is the landmark, not a parking pass.</p>
  </div>
</section>
</main>`,
  }),
);

writeFileSync(
  join(OUT, "the-tribe.html"),
  shell({
    title: "The Tribe · Tailgate Tribe",
    desc,
    active: "tribe",
    page: "tribe",
    body: `<main>
<section class="photo-cover" style="min-height:28rem">
  <img src="photos/canopy-lounge.jpg" alt="Inside the Tailgate Tribe canopy"/>
  <div class="veil"></div>
  <div class="wrap hero-inner" style="padding-top:8rem">
    <p class="kicker">The people</p>
    <h1 class="display" style="font-size:clamp(2.4rem,8vw,4.5rem)">Friends first. Football second. Stress nowhere.</h1>
  </div>
</section>
<section class="section">
  <div class="wrap" style="display:grid;gap:2rem">
    <div>
      <p class="kicker">What to bring</p>
      <h2 class="display" style="font-size:clamp(2rem,6vw,3rem);margin:1rem 0">Your chair, your colors, your people</h2>
      <p class="muted">Punch is on the table and there are some seats. BYOB is welcome if you want your own drinks — no need to bring extra to share. Tap what you’re packing. It stays on this device only.</p>
    </div>
    <div class="pack">
      ${[
        ["chair", "A tailgate chair if you’re staying a while"],
        ["drink", "Your own drinks if you want them — BYOB is welcome"],
        ["colors", "Garnet and gold"],
        ["sun", "Hat, sunscreen, or a light layer"],
        ["kids", "Kid gear, if little Noles are coming"],
        ["kind", "A friendly attitude"],
      ]
        .map(([id, label]) => `<button type="button" data-pack="${id}"><span class="box">✓</span>${label}</button>`)
        .join("")}
    </div>
  </div>
</section>
<section class="section surface">
  <div class="wrap">
    <p class="kicker">House rules</p>
    <h2 class="display" style="font-size:clamp(2rem,6vw,3rem);margin:1rem 0 1.5rem">FAQ</h2>
    <details><summary>Who are you?</summary><p>Seminole faithful fans who get together for each home football game. We aren’t trying to sell you anything or get your money — we just want a fun, family-friendly environment for Seminole fans without a tailgate of their own.</p></details>
    <details><summary>Where are you?</summary><p>Look for us at the NW corner of Pensacola Street and Varsity Drive. Our tailgate is in the grassy area to the east of Lot 8. We have a black inflatable canopy with our name and spear on the sail — you can’t miss it.</p></details>
    <details><summary>What should I bring?</summary><p>We’ll have punch on the table and some places to sit. Bring a tailgate chair if you plan to hang out. BYOB is welcome if you want your own drinks — you don’t need to bring extra to share.</p></details>
    <details><summary>Who is welcome?</summary><p>Everyone is welcome as long as they are respectful and following the rules set forth by Florida State University. We’ll have alcoholic drinks on site, and we intend to keep the tailgate family-friendly, laid back, and fun.</p></details>
    <details><summary>Do I need reservations?</summary><p>No reservation required. RSVP on the Facebook event for that game if you can — it helps us plan. Walking up without one is still welcome.</p></details>
    <details><summary>Can I sell or advertise at the tailgate?</summary><p>No. Florida State has a strong set of rules against commercial sales and advertising for anyone that is not an official partner or sponsor of Seminole Athletics.</p></details>
    <details><summary>Is this an official FSU event?</summary><p>No. Tailgate Tribe is an independent gathering of fans. We follow FSU gameday rules, but we are not affiliated with Florida State University or Seminole Athletics.</p></details>
    <details><summary>Where should I park?</summary><p>Not in Lot 8 — that’s reserved booster parking. Use public or game-day lots and walk over. The inflatable tent is the landmark, not a parking pass.</p></details>
  </div>
</section>
<section class="band">
  <p class="kicker">See you under the tent</p>
  <h2 class="display" style="font-size:clamp(2rem,6vw,3rem);margin:1rem 0">Drop a note if you’re joining</h2>
  <a class="btn btn-cream" href="https://www.facebook.com/groups/tailgatetribe/" target="_blank" rel="noreferrer">Message the Tribe on Facebook</a>
</section>
</main>`,
  }),
);

function icsEvent({ uid, start, end, allDay, summary, description, location, geo }) {
  const timing = allDay
    ? `DTSTART;VALUE=DATE:${start}\nDTEND;VALUE=DATE:${end}`
    : `DTSTART;TZID=America/New_York:${start}\nDTEND;TZID=America/New_York:${end}`;
  const geoLine = geo ? `\nGEO:${geo}` : "";
  return `BEGIN:VEVENT
UID:${uid}
${timing}
SUMMARY:${summary}
DESCRIPTION:${description}
LOCATION:${location}${geoLine}
END:VEVENT`;
}

function icsFile(name, events) {
  const body = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Tailgate Tribe//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:${name}
X-WR-TIMEZONE:America/New_York
${events.join("\n")}
END:VCALENDAR
`.replaceAll("\n", "\r\n");
  return body;
}

const locHome = "NW corner of Pensacola Street and Varsity Drive, Tallahassee, Florida";
const geoHome = `${LAT};${LNG}`;
const events = {
  nmsu: icsEvent({
    uid: "nmsu-2026@tailgatetribe.com",
    start: "20260829T120000",
    end: "20260829T190000",
    summary: "Tailgate Tribe vs New Mexico State",
    description: "Noon tailgate east of Lot 8. Kickoff 7:00 PM on The CW.",
    location: locHome,
    geo: geoHome,
  }),
  smu: icsEvent({
    uid: "smu-2026@tailgatetribe.com",
    start: "20260907T120000",
    end: "20260907T193000",
    summary: "Tailgate Tribe vs SMU",
    description: "Labor Day Monday. Noon tailgate. Kickoff 7:30 PM on ESPN.",
    location: locHome,
    geo: geoHome,
  }),
  alabama: icsEvent({
    uid: "alabama-2026@tailgatetribe.com",
    start: "20260919T080000",
    end: "20260919T153000",
    summary: "Tailgate Tribe at Alabama",
    description: "Road gathering — check Facebook for where the Tribe is meeting. Kickoff 3:30 PM on ABC.",
    location: "Bryant-Denny Stadium, Tuscaloosa",
  }),
  florida: icsEvent({
    uid: "florida-2026@tailgatetribe.com",
    start: "20261127T103000",
    end: "20261127T153000",
    summary: "Tailgate Tribe vs Florida",
    description: "Friday rivalry. 10:30 AM tailgate. Kickoff 3:30 PM on ABC.",
    location: locHome,
    geo: geoHome,
  }),
  cark: icsEvent({
    uid: "cark-2026@tailgatetribe.com",
    allDay: true,
    start: "20260926",
    end: "20260927",
    summary: "Tailgate Tribe vs Central Arkansas",
    description: "Tailgate time TBA — we’ll post it in the Facebook group.",
    location: locHome,
    geo: geoHome,
  }),
  virginia: icsEvent({
    uid: "virginia-2026@tailgatetribe.com",
    allDay: true,
    start: "20261003",
    end: "20261004",
    summary: "Tailgate Tribe vs Virginia",
    description: "Jefferson–Eppes Trophy. Tailgate time TBA.",
    location: locHome,
    geo: geoHome,
  }),
  clemson: icsEvent({
    uid: "clemson-2026@tailgatetribe.com",
    allDay: true,
    start: "20261031",
    end: "20261101",
    summary: "Tailgate Tribe vs Clemson",
    description: "Tailgate time TBA — we’ll post it in the Facebook group.",
    location: locHome,
    geo: geoHome,
  }),
  ncstate: icsEvent({
    uid: "ncstate-2026@tailgatetribe.com",
    allDay: true,
    start: "20261121",
    end: "20261122",
    summary: "Tailgate Tribe vs NC State",
    description: "Tailgate time TBA — we’ll post it in the Facebook group.",
    location: locHome,
    geo: geoHome,
  }),
};

writeFileSync(join(OUT, "calendar/nmsu.ics"), icsFile("Tribe vs New Mexico State", [events.nmsu]));
writeFileSync(join(OUT, "calendar/smu.ics"), icsFile("Tribe vs SMU", [events.smu]));
writeFileSync(join(OUT, "calendar/alabama.ics"), icsFile("Tribe at Alabama", [events.alabama]));
writeFileSync(join(OUT, "calendar/florida.ics"), icsFile("Tribe vs Florida", [events.florida]));
writeFileSync(join(OUT, "calendar/cark.ics"), icsFile("Tribe vs Central Arkansas", [events.cark]));
writeFileSync(join(OUT, "calendar/virginia.ics"), icsFile("Tribe vs Virginia", [events.virginia]));
writeFileSync(join(OUT, "calendar/clemson.ics"), icsFile("Tribe vs Clemson", [events.clemson]));
writeFileSync(join(OUT, "calendar/ncstate.ics"), icsFile("Tribe vs NC State", [events.ncstate]));
writeFileSync(
  join(OUT, "calendar/tribe-2026.ics"),
  icsFile("Tailgate Tribe 2026", [
    events.nmsu,
    events.smu,
    events.alabama,
    events.cark,
    events.virginia,
    events.clemson,
    events.ncstate,
    events.florida,
  ]),
);

writeFileSync(
  join(OUT, "weather.php"),
  `<?php
header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: public, max-age=600");
$date = isset($_GET["date"]) ? $_GET["date"] : "";
if (!preg_match('/^\\d{4}-\\d{2}-\\d{2}$/', $date)) {
  http_response_code(400);
  echo '{"error":"bad date"}';
  exit;
}
$lat = "${LAT}";
$lng = "${LNG}";
$url = "https://api.open-meteo.com/v1/forecast?latitude={$lat}&longitude={$lng}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&temperature_unit=fahrenheit&timezone=America%2FNew_York&start_date={$date}&end_date={$date}";
function tt_fetch($url) {
  if (function_exists("curl_init")) {
    $ch = curl_init($url);
    curl_setopt_array($ch, array(
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_TIMEOUT => 8,
      CURLOPT_USERAGENT => "TailgateTribe/1.0",
    ));
    $out = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($out !== false && $code >= 200 && $code < 300) return $out;
  }
  $ctx = stream_context_create(array("http" => array("timeout" => 8, "header" => "User-Agent: TailgateTribe/1.0\\r\\n")));
  $out = @file_get_contents($url, false, $ctx);
  return $out !== false ? $out : null;
}
$body = tt_fetch($url);
if ($body === null) {
  http_response_code(502);
  echo '{"error":"forecast unavailable"}';
  exit;
}
echo $body;
`,
);
writeFileSync(
  join(OUT, ".htaccess"),
  `Options -Indexes
AddType font/woff2 .woff2
AddType text/calendar .ics
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME}.html -f
RewriteRule ^(.*)$ $1.html [L]
ErrorDocument 404 /index.html
`,
);

writeFileSync(
  join(OUT, "UPLOAD.txt"),
  `Tailgate Tribe — HostGator upload
=================================

These files are a complete static website. No PHP, WordPress, or Node required.
They will run on any HostGator shared plan (Apache + public_html).

How to replace www.tailgatetribe.com
1. Log into HostGator cPanel.
2. Open File Manager → public_html (the folder that currently holds the old site).
3. Download a backup of the current site first (select all → Compress → download).
4. Upload TailgateTribe-HostGator.zip, then Extract it into public_html.
   Or upload EVERYTHING in this folder:
   index.html, schedule.html, gameday.html, find-us.html, the-tribe.html,
   css/, js/, photos/, fonts/, calendar/, favicon.svg, og.jpg, .htaccess
5. If cPanel hides dotfiles, turn on "Show Hidden Files" so .htaccess uploads.
6. If the old site was WordPress, delete or move the WordPress files
   (wp-admin, wp-content, wp-includes, index.php) so index.html is the homepage.
7. Visit tailgatetribe.com and hard-refresh.

That’s it. Calendar files live in /calendar and work as downloads.


How to change photos later (no rebuild needed)
==============================================
1. In cPanel File Manager, open public_html/photos.
2. Upload a new JPG with the SAME filename as the photo you want to replace.
   Overwrite when asked. Keep it a .jpg (not .jpeg / .png / .heic).
3. Hard-refresh the site (or wait a few minutes if HostGator caches).

Which file is which:
  hero.jpg              Homepage full-screen background
  tent.jpg              Front of the canopy (Find us + home “east of Lot 8” band)
  canopy-lounge.jpg     Inside the tent — chairs, couches, screen (Gameday / Tribe)
  canopy-lounge-43.jpg  Same lounge shot, cropped for the homepage gallery
  canopy-inside.jpg     Other tent angle (gallery)
  tomahawk.jpg          Tomahawk toss
  punch.jpg             Red + gold punch dispensers
  feast.jpg             Food / snacks on the table

Tips: wider shots work better as hero.jpg. Square-ish or tall shots work
better in the gallery. Aim under ~1.5 MB per photo.


How to change wording later
===========================
Open the matching page in File Manager and click Edit:

  index.html       Home — intro, punch/tent copy, FAQs
  schedule.html    2026 games and kickoff times
  gameday.html     Playbook, traditions, what’s under the tent
  find-us.html     Address, map pin, how to spot the canopy
  the-tribe.html   Packing list + full FAQ

Change the sentences you see. Don’t delete the <tags> around the words
(the bits in <angle brackets>) or the layout will break.

The map pin is the Google Maps / OpenStreetMap link on find-us.html.
Search that file for 30.4390911 to change coordinates.

Kickoff times also live in the .ics files under calendar/. If you change
a time on schedule.html, update the matching .ics too — or just ask for
a fresh zip.

Facebook group link appears on every page; search for facebook.com/groups.


Easier option
=============
Send new photos or a note about the wording change and have the site
rebuilt, then re-upload the zip over public_html. Same 7 steps as above.
`,
);

writeFileSync(
  join(OUT, "OPEN-ME-FIRST.txt"),
  `tt-build:${BUILD}

If this file does not say tt-build:${BUILD}, you opened an old zip.

Hero line:
  No tailgate tickets. No catch. Just Noles.

Footer line:
  Free, family-friendly, and fun under the inflatable tent.

Then open index.html and search for those two phrases.
`,
);
spawnSync(
  "python3",
  [
    "-c",
    `import zipfile, os, shutil
root = ${JSON.stringify(OUT)}
zip_path = ${JSON.stringify(ZIP)}
os.makedirs(os.path.dirname(zip_path) or ".", exist_ok=True)
if os.path.exists(zip_path):
    os.remove(zip_path)
with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
    for dirpath, dirnames, filenames in os.walk(root):
        for name in filenames:
            if name == ".DS_Store":
                continue
            full = os.path.join(dirpath, name)
            z.write(full, os.path.relpath(full, root))
html = zipfile.ZipFile(zip_path).read("index.html").decode()
checks = [
    ("tt-build:${BUILD}" in html, "missing tt-build:${BUILD}"),
    ("8 Tribe dates" not in html, "still has 8 Tribe dates"),
    ("No tailgate tickets" in html, "missing No tailgate tickets"),
    ("fun under the inflatable tent" in html, "missing fun under"),
]
for ok, msg in checks:
    if not ok:
        raise SystemExit("ZIP VERIFY FAILED: " + msg)
print("VERIFIED", zip_path, "bytes", os.path.getsize(zip_path))
for dest in [
    "/home/workdir/artifacts/TailgateTribe-VERIFIED-build${BUILD}.zip",
    "/workspace/TailgateTribe-VERIFIED-build${BUILD}.zip",
]:
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    shutil.copy2(zip_path, dest)
    print("copied", dest)
`,
  ],
  { stdio: "inherit" },
);

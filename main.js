const grid = document.getElementById("grid");
const filters = document.getElementById("filters");
let active = "all";

function el(tag, attrs = {}, children = []) {
  const n = document.createElement(tag);
  Object.assign(n, attrs);
  children.forEach((c) => n.append(c));
  return n;
}

function renderFilters() {
  const tags = ["all", ...new Set(PROJECTS.flatMap((p) => p.tags))];
  filters.replaceChildren(
    ...tags.map((t) =>
      el("button", {
        className: "chip" + (t === active ? " active" : ""),
        textContent: t,
        onclick: () => { active = t; renderFilters(); renderGrid(); },
      })
    )
  );
}

function renderGrid() {
  const shown = PROJECTS.filter((p) => active === "all" || p.tags.includes(active));
  grid.replaceChildren(
    ...shown.map((p) =>
      el("article", { className: "card" }, [
        el("h3", { textContent: p.title }),
        el("p", { textContent: p.description }),
        el("div", { className: "tags" }, p.tags.map((t) => el("span", { textContent: t }))),
        el("div", { className: "links" }, [
          p.links.demo && el("a", { href: p.links.demo, textContent: "Live demo →" }),
          p.links.code && el("a", { href: p.links.code, textContent: "Code →" }),
        ].filter(Boolean)),
      ])
    )
  );
}

// Theme: follow system, allow manual override
const root = document.documentElement;
const saved = (() => { try { return localStorage.getItem("theme"); } catch { return null; } })();
if (saved) root.dataset.theme = saved;
document.getElementById("theme-toggle").onclick = () => {
  const dark = root.dataset.theme
    ? root.dataset.theme === "dark"
    : matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme = dark ? "light" : "dark";
  try { localStorage.setItem("theme", root.dataset.theme); } catch {}
};

document.getElementById("year").textContent = new Date().getFullYear();
renderFilters();
renderGrid();

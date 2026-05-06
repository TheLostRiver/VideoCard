import { BRANDS } from "../../data/constants.js";

const BRAND_COLORS = Object.fromEntries(
  Object.entries(BRANDS).map(([key, meta]) => [key, meta.color])
);
const DEFAULT_BRAND_COLOR = "#5a6d80";

export function renderHardwareList(items = [], options = {}) {
  if (!items.length) {
    return `<div class="hardware-list-empty">没有匹配的硬件</div>`;
  }

  const maxScore = computeMaxScore(items, options.activeBenchmark);
  return items.map((item) => renderHardwareListItem(item, { ...options, maxScore })).join("");
}

function computeMaxScore(items, activeBenchmark) {
  let max = 0;
  for (const item of items) {
    const score = resolveActiveScore(item, activeBenchmark);
    if (score.hasValue && typeof score.value === "number" && score.value > max) {
      max = score.value;
    }
  }
  return max || 1;
}

export function renderHardwareListItem(item, options = {}) {
  const isSelected = options.selectedId === item.id;
  const selectedClass = isSelected ? " is-selected" : "";
  const subtitle = (item.facts || []).map((f) => f.displayValue).filter(Boolean).join(" · ");
  const brandKey = extractBrand(item);
  const brandColor = BRAND_COLORS[brandKey] || DEFAULT_BRAND_COLOR;
  const activeScore = resolveActiveScore(item, options.activeBenchmark);

  return `
    <article class="hardware-list-item${selectedClass}" data-hardware-id="${escapeHtml(item.id)}" style="--brand:${brandColor}" role="option" aria-selected="${isSelected ? "true" : "false"}">
      <div class="hardware-list-main">
        <strong>${escapeHtml(item.title)}</strong>
        ${subtitle ? `<span class="hardware-list-subtitle">${escapeHtml(subtitle)}</span>` : ""}
      </div>
      ${renderBadges(item.badges)}
      ${activeScore.hasValue ? renderScoreWithBar(activeScore, options.maxScore) : renderPendingScore()}
      ${renderPower(item.power)}
    </article>
  `;
}

function resolveActiveScore(item, activeBenchmark) {
  if (activeBenchmark && item.benchmarkScores?.length) {
    const match = item.benchmarkScores.find((s) => s.id === activeBenchmark);
    if (match) {
      return { ...match, hasValue: match.value != null };
    }
  }
  const ps = item.primaryScore;
  const hasValue = ps && ps.displayValue && ps.displayValue !== "待补充";
  return { value: ps?.value, displayValue: ps?.displayValue || "—", label: ps?.label || "", hasValue };
}

function extractBrand(item) {
  const brandFact = (item.facts || []).find((f) => f.id === "brand");
  return brandFact ? String(brandFact.displayValue || "").toLowerCase() : "";
}

function renderBadges(badges = []) {
  if (!badges.length) return "";

  return `
    <div class="hardware-list-badges">
      ${badges.map((badge) => `<span class="hardware-list-badge" data-badge-id="${escapeHtml(badge.id)}">${escapeHtml(badge.label)}</span>`).join("")}
    </div>
  `;
}

function renderFacts(facts = []) {
  if (!facts.length) return "";

  return `
    <div class="hardware-list-facts">
      ${facts.map((fact) => `
        <span class="hardware-list-fact">
          <span>${escapeHtml(fact.label)}</span>
          <strong>${escapeHtml(fact.displayValue)}</strong>
        </span>
      `).join("")}
    </div>
  `;
}

/* renderFacts is preserved for potential future use; list items now use subtitle format */

function renderScoreWithBar(score, maxScore) {
  if (!score) return "";
  const numericValue = parseFloat(score.value);
  const barPct = (!isNaN(numericValue) && maxScore > 0) ? Math.min(100, Math.max(5, (numericValue / maxScore) * 100)) : 0;

  return `
    <div class="hardware-list-perf">
      <strong>${escapeHtml(score.displayValue)}</strong>
      ${barPct > 0 ? `<div class="perf-track"><div style="width:${barPct}%"></div></div>` : ""}
    </div>
  `;
}

function renderPendingScore() {
  return `<div class="hardware-list-perf is-pending"><span>—</span><div class="perf-track"><div style="width:0%"></div></div></div>`;
}

function renderPower(power) {
  if (!power || !power.displayValue || power.displayValue === "待补充") return "";
  return `<span class="hardware-list-power">${escapeHtml(power.displayValue)}</span>`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

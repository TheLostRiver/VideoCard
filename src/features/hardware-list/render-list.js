import { BRANDS } from "../../data/constants.js";

const BRAND_COLORS = Object.fromEntries(
  Object.entries(BRANDS).map(([key, meta]) => [key, meta.color])
);
const DEFAULT_BRAND_COLOR = "#5a6d80";

export function renderHardwareList(items = [], options = {}) {
  if (!items.length) {
    return `<div class="hardware-list-empty">没有匹配的硬件</div>`;
  }

  return items.map((item) => renderHardwareListItem(item, options)).join("");
}

export function renderHardwareListItem(item, options = {}) {
  const isSelected = options.selectedId === item.id;
  const selectedClass = isSelected ? " is-selected" : "";
  const subtitle = (item.facts || []).map((f) => f.displayValue).filter(Boolean).join(" · ");
  const hasScore = item.primaryScore && item.primaryScore.displayValue && item.primaryScore.displayValue !== "待补充";
  const brandKey = extractBrand(item);
  const brandColor = BRAND_COLORS[brandKey] || DEFAULT_BRAND_COLOR;

  return `
    <article class="hardware-list-item${selectedClass}" data-hardware-id="${escapeHtml(item.id)}" style="--brand:${brandColor}" role="option" aria-selected="${isSelected ? "true" : "false"}">
      <div class="hardware-list-main">
        <strong>${escapeHtml(item.title)}</strong>
        ${subtitle ? `<span class="hardware-list-subtitle">${escapeHtml(subtitle)}</span>` : ""}
      </div>
      ${renderBadges(item.badges)}
      ${hasScore ? renderScoreWithBar(item.primaryScore) : renderPendingScore()}
      ${renderPower(item.power)}
    </article>
  `;
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

function renderScoreWithBar(score) {
  if (!score) return "";
  const numericValue = parseFloat(score.value);
  const barWidth = !isNaN(numericValue) ? Math.min(100, Math.max(8, numericValue)) : 0;

  return `
    <div class="hardware-list-perf">
      <strong>${escapeHtml(score.displayValue)}</strong>
      ${barWidth > 0 ? `<div class="perf-track"><div style="width:${barWidth}%"></div></div>` : ""}
    </div>
  `;
}

function renderPendingScore() {
  return `<div class="hardware-list-perf is-pending"><span>—</span></div>`;
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

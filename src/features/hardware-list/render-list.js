export function renderHardwareList(items = [], options = {}) {
  if (!items.length) {
    return `<div class="hardware-list-empty">没有匹配的硬件</div>`;
  }

  return items.map((item) => renderHardwareListItem(item, options)).join("");
}

export function renderHardwareListItem(item, options = {}) {
  const isSelected = options.selectedId === item.id;
  const selectedClass = isSelected ? " is-selected" : "";

  return `
    <article class="hardware-list-item${selectedClass}" data-hardware-id="${escapeHtml(item.id)}" role="option" aria-selected="${isSelected ? "true" : "false"}">
      <div class="hardware-list-main">
        <strong>${escapeHtml(item.title)}</strong>
        ${renderFacts(item.facts)}
      </div>
      ${renderBadges(item.badges)}
      ${renderScore(item.primaryScore)}
    </article>
  `;
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

function renderScore(score) {
  if (!score) return "";

  return `
    <div class="hardware-list-score">
      <span>${escapeHtml(score.label)}</span>
      <strong>${escapeHtml(score.displayValue)}</strong>
    </div>
  `;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

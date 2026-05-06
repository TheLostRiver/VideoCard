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
  const facts = item.facts || [];
  const subtitleParts = facts
    .filter((f) => f.displayValue)
    .map((f) => `<span class="hardware-list-fact-inline"${f.label ? ` aria-label="${escapeHtml(f.label)}"` : ""}>${escapeHtml(f.displayValue)}</span>`);
  const subtitle = subtitleParts.length ? subtitleParts.join(" · ") : "";
  const factLabelsAttr = facts.map((f) => f.label).filter(Boolean).join(", ");
  const activeScore = resolveActiveScore(item, options.activeBenchmark);

  return `
    <article class="hardware-list-item${selectedClass}" data-hardware-id="${escapeHtml(item.id)}" role="option" aria-selected="${isSelected ? "true" : "false"}"${factLabelsAttr ? ` data-fact-labels="${escapeHtml(factLabelsAttr)}"` : ""}>
      <div class="hardware-list-main">
        <strong>${escapeHtml(item.title)}</strong>
        ${subtitle ? `<span class="hardware-list-subtitle">${subtitle}</span>` : ""}
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
  const labelAttr = score.label ? ` aria-label="${escapeHtml(score.label)}"` : "";

  return `
    <div class="hardware-list-perf"${labelAttr}>
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

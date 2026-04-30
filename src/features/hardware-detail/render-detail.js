export function renderHardwareDetail(viewModel) {
  if (!viewModel) {
    return `<p class="hardware-detail-empty">请选择硬件</p>`;
  }

  return `
    <article class="hardware-detail" data-hardware-id="${escapeHtml(viewModel.item?.id)}">
      <header class="hardware-detail-heading">
        <h2>${escapeHtml(viewModel.item?.name)}</h2>
      </header>
      ${renderWarnings(viewModel.warnings)}
      ${(viewModel.groups || []).map(renderHardwareDetailGroup).join("")}
    </article>
  `;
}

export function renderHardwareDetailGroup(group) {
  return `
    <section class="hardware-detail-section" data-group-id="${escapeHtml(group.id)}">
      <h3>${escapeHtml(group.title)}</h3>
      ${(group.rows || []).map(renderHardwareDetailRow).join("")}
    </section>
  `;
}

function renderHardwareDetailRow(row) {
  return `
    <div class="hardware-detail-row" data-metric-id="${escapeHtml(row.metricId || row.id)}">
      <span>${escapeHtml(row.label)}</span>
      <strong>${escapeHtml(row.displayValue || "待补充")}</strong>
    </div>
  `;
}

function renderWarnings(warnings = []) {
  if (!warnings.length) return "";

  return `
    <div class="hardware-detail-warnings">
      ${warnings.map((warning) => `
        <p class="hardware-detail-warning ${escapeHtml(warning.severity || "warning")}" data-warning-id="${escapeHtml(warning.id)}">
          ${escapeHtml(warning.message)}
        </p>
      `).join("")}
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

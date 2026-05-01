export function renderCompareTable(viewModel) {
  if (!viewModel || !viewModel.groups || viewModel.groups.length === 0) {
    return '<div class="compare-empty">无可比数据</div>';
  }

  const columns = viewModel.itemIds || [];
  const html = [];

  html.push('<table class="compare-table">');
  html.push("<thead><tr>");
  html.push('<th class="compare-label-col">参数</th>');
  for (const itemId of columns) {
    html.push(`<th class="compare-item-col">${escapeHtml(itemId)}</th>`);
  }
  html.push("</tr></thead>");

  html.push("<tbody>");
  for (const group of viewModel.groups) {
    html.push(`<tr class="compare-group-row"><th colspan="${columns.length + 1}">${escapeHtml(group.title)}</th></tr>`);
    for (const row of group.rows) {
      html.push("<tr>");
      html.push(`<td class="compare-label">${escapeHtml(row.label)}</td>`);
      for (const value of row.values) {
        const cls = value.isBest ? " class=\"compare-value is-best\"" : " class=\"compare-value\"";
        html.push(`<td${cls}>${escapeHtml(value.displayValue)}</td>`);
      }
      html.push("</tr>");
    }
  }
  html.push("</tbody>");
  html.push("</table>");

  return html.join("");
}

function escapeHtml(text) {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

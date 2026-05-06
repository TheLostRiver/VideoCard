const YEAR_RE = /\b(19|20)\d{2}\b/;
const MONTH_NAMES = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
};

export function extractYear(value) {
  if (value == null) return null;
  const str = String(value).trim();
  if (!str) return null;

  // "2023-04" or "2023"
  const direct = str.match(/^(19|20)\d{2}/);
  if (direct) return Number(direct[0]);

  // "Sep 1st, 2004" / "Aug 17th, 2011" / "Mar 16th, 2021"
  const mdy = str.match(/([A-Za-z]+)\s+\d{1,2}(?:st|nd|rd|th)?,?\s*(\d{4})/);
  if (mdy) return Number(mdy[2]);

  // Fallback: any 4-digit year
  const fallback = str.match(YEAR_RE);
  return fallback ? Number(fallback[0]) : null;
}

export function getAvailableYears(items, getReleaseDate) {
  const years = new Set();
  for (const item of items) {
    const year = extractYear(getReleaseDate(item));
    if (year != null) years.add(year);
  }
  return [...years].sort((a, b) => b - a);
}

export function filterByYears(items, selectedYears, showUnknown, getReleaseDate) {
  if (!selectedYears.size && !showUnknown) return items;

  return items.filter((item) => {
    const year = extractYear(getReleaseDate(item));
    const isUnknown = year == null;
    if (isUnknown) return showUnknown;
    if (!selectedYears.size) return true;
    return selectedYears.has(year);
  });
}

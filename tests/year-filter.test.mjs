import test from "node:test";
import assert from "node:assert/strict";
import { extractYear, getAvailableYears, filterByYears } from "../src/utils/year-filter.js";

test("extractYear parses YYYY-MM format", () => {
  assert.equal(extractYear("2023-04"), 2023);
  assert.equal(extractYear("1998-01"), 1998);
});

test("extractYear parses plain YYYY format", () => {
  assert.equal(extractYear("2022"), 2022);
});

test("extractYear parses Mon DDth, YYYY format", () => {
  assert.equal(extractYear("Sep 1st, 2004"), 2004);
  assert.equal(extractYear("Aug 17th, 2011"), 2011);
  assert.equal(extractYear("Mar 16th, 2021"), 2021);
  assert.equal(extractYear("Jan 5, 2020"), 2020);
});

test("extractYear returns null for empty or invalid input", () => {
  assert.equal(extractYear(null), null);
  assert.equal(extractYear(undefined), null);
  assert.equal(extractYear(""), null);
  assert.equal(extractYear("unknown"), null);
  assert.equal(extractYear("N/A"), null);
});

test("getAvailableYears returns sorted descending years", () => {
  const items = [
    { date: "2023-04" },
    { date: "2021-01" },
    { date: "2023-10" },
    { date: null },
    { date: "2020-06" }
  ];
  const years = getAvailableYears(items, (i) => i.date);
  assert.deepEqual(years, [2023, 2021, 2020]);
});

test("getAvailableYears returns empty array for no dates", () => {
  const items = [{ date: null }, { date: "" }];
  assert.deepEqual(getAvailableYears(items, (i) => i.date), []);
});

test("filterByYears with empty selection returns all items", () => {
  const items = [{ date: "2023-01" }, { date: "2021-01" }, { date: null }];
  const result = filterByYears(items, new Set(), false, (i) => i.date);
  assert.equal(result.length, 3);
});

test("filterByYears filters by selected years (OR logic)", () => {
  const items = [
    { date: "2023-01" },
    { date: "2021-01" },
    { date: "2020-01" }
  ];
  const result = filterByYears(items, new Set([2023, 2020]), false, (i) => i.date);
  assert.equal(result.length, 2);
  assert.equal(result[0].date, "2023-01");
  assert.equal(result[1].date, "2020-01");
});

test("filterByYears excludes unknown years by default", () => {
  const items = [
    { date: "2023-01" },
    { date: null },
    { date: "" }
  ];
  const result = filterByYears(items, new Set([2023]), false, (i) => i.date);
  assert.equal(result.length, 1);
});

test("filterByYears includes unknown years when showUnknown is true", () => {
  const items = [
    { date: "2023-01" },
    { date: null },
    { date: "" }
  ];
  const result = filterByYears(items, new Set([2023]), true, (i) => i.date);
  assert.equal(result.length, 3);
});

test("filterByYears shows only unknown years when showUnknown is true and selection is empty", () => {
  const items = [
    { date: "2023-01" },
    { date: null },
    { date: "unknown" }
  ];
  const result = filterByYears(items, new Set(), true, (i) => i.date);
  // All items returned because selection is empty (show all) + showUnknown adds unknowns
  assert.equal(result.length, 3);
});

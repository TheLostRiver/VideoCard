import test from "node:test";
import assert from "node:assert/strict";
import {
  parseExternalDate,
  parseNumber,
  parseTdp,
  parseFrequency,
  parseCacheSize,
  parseCoresField,
  parseMemoryField,
  parseShadersField,
  parseClockRange,
  generateId,
  convertToProjectGpu,
  convertFromCpusJson,
  convertFromBenchmarkCsv,
  convertFromTpuCsv,
  mergeCpuRecords
} from "../scripts/import-external-data.mjs";

// ── parseExternalDate ──

test("parseExternalDate handles YYYY-MM format", () => {
  assert.equal(parseExternalDate("2023-04"), "2023-04");
});

test("parseExternalDate handles plain YYYY", () => {
  assert.equal(parseExternalDate("2022"), "2022-01");
});

test("parseExternalDate handles Mon DDth, YYYY", () => {
  assert.equal(parseExternalDate("Sep 1st, 2004"), "2004-09");
  assert.equal(parseExternalDate("Aug 17th, 2011"), "2011-08");
  assert.equal(parseExternalDate("Mar 16th, 2021"), "2021-03");
  assert.equal(parseExternalDate("Jan 5, 2020"), "2020-01");
});

test("parseExternalDate returns null for empty/invalid", () => {
  assert.equal(parseExternalDate(null), null);
  assert.equal(parseExternalDate(""), null);
  assert.equal(parseExternalDate("N/A"), null);
});

// ── parseNumber ──

test("parseNumber parses integers and floats", () => {
  assert.equal(parseNumber("108822"), 108822);
  assert.equal(parseNumber("12.1"), 12.1);
  assert.equal(parseNumber("1,234"), 1234);
});

test("parseNumber returns null for invalid", () => {
  assert.equal(parseNumber(null), null);
  assert.equal(parseNumber(""), null);
  assert.equal(parseNumber("N/A"), null);
});

// ── parseTdp ──

test("parseTdp extracts wattage", () => {
  assert.equal(parseTdp("65 W"), 65);
  assert.equal(parseTdp("280"), 280);
  assert.equal(parseTdp("125W"), 125);
});

test("parseTdp returns null for empty", () => {
  assert.equal(parseTdp(null), null);
  assert.equal(parseTdp(""), null);
});

// ── parseFrequency ──

test("parseFrequency handles GHz and MHz", () => {
  assert.equal(parseFrequency("4.1 GHz"), 4100);
  assert.equal(parseFrequency("500 MHz"), 500);
  assert.equal(parseFrequency("3500"), 3500);
});

test("parseFrequency returns null for invalid", () => {
  assert.equal(parseFrequency(null), null);
  assert.equal(parseFrequency(""), null);
});

// ── parseCacheSize ──

test("parseCacheSize handles MB and GB", () => {
  assert.equal(parseCacheSize("4MB"), 4);
  assert.equal(parseCacheSize("32 MB"), 32);
  assert.equal(parseCacheSize("1 GB"), 1024);
});

test("parseCacheSize returns null for empty", () => {
  assert.equal(parseCacheSize(null), null);
  assert.equal(parseCacheSize(""), null);
});

// ── parseCoresField ──

test("parseCoresField splits physical / logical", () => {
  const result = parseCoresField("6 / 12");
  assert.equal(result.count, 6);
  assert.equal(result.threads, 12);
});

test("parseCoresField handles single value", () => {
  const result = parseCoresField("4");
  assert.equal(result.count, 4);
  assert.equal(result.threads, 4);
});

test("parseCoresField returns null for empty", () => {
  const result = parseCoresField(null);
  assert.equal(result.count, null);
  assert.equal(result.threads, null);
});

// ── parseMemoryField ──

test("parseMemoryField parses size, type, bus width", () => {
  const result = parseMemoryField("2 GB, GDDR5, 128 bit");
  assert.equal(result.size, 2048);
  assert.equal(result.type, "GDDR5");
  assert.equal(result.busWidth, 128);
});

test("parseMemoryField handles MB", () => {
  const result = parseMemoryField("128 MB, DDR, 128 bit");
  assert.equal(result.size, 128);
  assert.equal(result.type, "DDR");
  assert.equal(result.busWidth, 128);
});

test("parseMemoryField handles slash separator", () => {
  const result = parseMemoryField("16 GB / GDDR6 / 128 bit");
  assert.equal(result.size, 16384);
  assert.equal(result.type, "GDDR6");
  assert.equal(result.busWidth, 128);
});

test("parseMemoryField returns nulls for empty", () => {
  const result = parseMemoryField(null);
  assert.equal(result.size, null);
  assert.equal(result.type, null);
  assert.equal(result.busWidth, null);
});

// ── parseShadersField ──

test("parseShadersField splits pipeline counts", () => {
  const result = parseShadersField("640 / 40 / 16");
  assert.equal(result.shaders, 640);
  assert.equal(result.tmus, 40);
  assert.equal(result.rops, 16);
});

test("parseShadersField handles 4-part format", () => {
  const result = parseShadersField("4 / 2 / 4 / 4");
  assert.equal(result.shaders, 4);
  assert.equal(result.tmus, 2);
  assert.equal(result.rops, 4);
});

test("parseShadersField returns nulls for empty", () => {
  const result = parseShadersField(null);
  assert.equal(result.shaders, null);
});

// ── parseClockRange ──

test("parseClockRange handles range format", () => {
  const result = parseClockRange("2.1 to 2.4 GHz");
  assert.equal(result.base, 2100);
  assert.equal(result.boost, 2400);
});

test("parseClockRange handles single value", () => {
  const result = parseClockRange("3.5 GHz");
  assert.equal(result.base, 3500);
  assert.equal(result.boost, 3500);
});

// ── generateId ──

test("generateId creates kebab-case ids", () => {
  assert.equal(generateId("GeForce RTX 4090"), "geforce-rtx-4090");
  assert.equal(generateId("AMD Ryzen 9 7950X"), "amd-ryzen-9-7950x");
  assert.equal(generateId("Intel® Core™ i9-13900K"), "intel-core-i9-13900k");
});

test("generateId handles empty input", () => {
  assert.equal(generateId(null), "");
  assert.equal(generateId(""), "");
});

// ── convertToProjectGpu ──

test("convertToProjectGpu converts external GPU record", () => {
  const input = {
    Product_Name: "GeForce RTX 4090",
    GPU_Chip: "AD102",
    Released: "Oct 12th, 2022",
    Bus: "PCIe 4.0 x16",
    Memory: "24 GB, GDDR6X, 384 bit",
    GPU_clock: "2235 MHz",
    Memory_clock: "1313 MHz",
    Shaders_TMUs_ROPs: "16384 / 512 / 176"
  };
  const result = convertToProjectGpu(input);
  assert.equal(result.id, "geforce-rtx-4090");
  assert.equal(result.name, "GeForce RTX 4090");
  assert.equal(result.releaseDate, "2022-10");
  assert.equal(result.specs.cores, 16384);
  assert.equal(result.specs.memorySizeGB, 24);
  assert.equal(result.specs.memoryType, "GDDR6X");
  assert.equal(result.specs.memoryBusBit, 384);
  assert.equal(result._chip, "AD102");
  assert.equal(result._bus, "PCIe 4.0 x16");
  assert.equal(result._tmus, 512);
  assert.equal(result._rops, 176);
});

// ── convertFromCpusJson ──

test("convertFromCpusJson converts CPU JSON record", () => {
  const input = {
    Name: "Pentium Gold G6405",
    Codename: "Comet Lake-R",
    Cores: "2 / 4",
    Clock: "4.1 GHz",
    Socket: "Socket 1200",
    Process: "14 nm",
    "L3 Cache": "4MB",
    TDP: "65 W",
    Released: "Mar 16th, 2021"
  };
  const result = convertFromCpusJson(input);
  assert.equal(result.id, "pentium-gold-g6405");
  assert.equal(result.cores, 2);
  assert.equal(result.threads, 4);
  assert.equal(result.baseClock, 4100);
  assert.equal(result.socket, "Socket 1200");
  assert.equal(result.process, "14 nm");
  assert.equal(result.cacheL3, 4);
  assert.equal(result.tdp, 65);
  assert.equal(result.releaseDate, "2021-03");
});

// ── convertFromBenchmarkCsv ──

test("convertFromBenchmarkCsv converts benchmark CSV record", () => {
  const input = {
    cpuName: "AMD Ryzen Threadripper PRO 5995WX",
    price: "7299.99",
    cpuMark: "108822",
    cpuValue: "12.1",
    threadMark: "3330",
    threadValue: "0.36",
    TDP: "280",
    powerPerf: "388.65",
    cores: "64",
    testDate: "2022",
    socket: "sWRX8",
    category: "Desktop"
  };
  const result = convertFromBenchmarkCsv(input);
  assert.equal(result.id, "amd-ryzen-threadripper-pro-5995wx");
  assert.equal(result.cpuMark, 108822);
  assert.equal(result.threadMark, 3330);
  assert.equal(result.price, 7299.99);
  assert.equal(result.tdp, 280);
  assert.equal(result.releaseDate, "2022-01");
  assert.equal(result.cores, 64);
});

// ── mergeCpuRecords ──

test("mergeCpuRecords deduplicates by id", () => {
  const records = [
    { id: "cpu-a", name: "CPU A", cores: 4, tdp: 65, cpuMark: null },
    { id: "cpu-a", name: "CPU A", cores: null, tdp: null, cpuMark: 1000 },
    { id: "cpu-b", name: "CPU B", cores: 8, tdp: 125, cpuMark: 2000 }
  ];
  const result = mergeCpuRecords(records);
  assert.equal(result.length, 2);
  const cpuA = result.find((r) => r.id === "cpu-a");
  assert.equal(cpuA.cores, 4);
  assert.equal(cpuA.cpuMark, 1000);
});

test("mergeCpuRecords preserves first non-null value", () => {
  const records = [
    { id: "cpu-x", name: "CPU X", cores: 4, tdp: 65 },
    { id: "cpu-x", name: "CPU X", cores: 8, tdp: 125 }
  ];
  const result = mergeCpuRecords(records);
  assert.equal(result[0].cores, 4); // First non-null wins
  assert.equal(result[0].tdp, 65);
});

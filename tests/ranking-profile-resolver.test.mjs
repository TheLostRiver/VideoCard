import test from "node:test";
import assert from "node:assert/strict";
import { createBenchmarkSuiteRegistry } from "../src/application/benchmark-suite-registry.js";
import { createRankingProfileResolver } from "../src/application/ranking-profile-resolver.js";

const suiteData = {
  suites: [
    {
      id: "geekbench6",
      label: "Geekbench 6",
      shortLabel: "GB6",
      scores: [
        { id: "single", label: "GB6 单核", biggerIsBetter: true },
        { id: "multi", label: "GB6 多核", biggerIsBetter: true }
      ]
    }
  ]
};

const sampleCategory = {
  id: "mobile-soc",
  listView: { scoreField: "soc.performance.index" },
  rankingProfiles: {
    default: "composite",
    profiles: [
      {
        id: "composite",
        label: "综合得分",
        kind: "composite",
        components: [
          { metricId: "soc.benchmark.geekbenchSingle", weight: 0.4, reference: 2500 },
          { metricId: "soc.benchmark.geekbenchMulti", weight: 0.6, reference: 8000 }
        ]
      },
      {
        id: "gb6-single",
        kind: "metric",
        metricId: "soc.benchmark.geekbenchSingle",
        suiteRef: "geekbench6.single"
      },
      {
        id: "gb6-multi",
        kind: "metric",
        metricId: "soc.benchmark.geekbenchMulti",
        suiteRef: "geekbench6.multi",
        label: "覆盖标签"
      }
    ]
  }
};

const sampleDetail = {
  item: { id: "demo", categoryId: "mobile-soc" },
  metricValues: [
    { metricId: "soc.benchmark.geekbenchSingle", valueNumber: 2200 },
    { metricId: "soc.benchmark.geekbenchMulti", valueNumber: 7000 }
  ],
  rankingScore: { score: 210 }
};

function createResolverFor(category) {
  const suiteRegistry = createBenchmarkSuiteRegistry(suiteData);
  return createRankingProfileResolver({ category, suiteRegistry });
}

test("listProfiles returns id/label/biggerIsBetter from schema", () => {
  const resolver = createResolverFor(sampleCategory);
  const profiles = resolver.listProfiles();
  assert.equal(profiles.length, 3);
  assert.deepEqual(
    profiles.map((p) => p.id),
    ["composite", "gb6-single", "gb6-multi"]
  );
  assert.equal(profiles[0].label, "综合得分");
  assert.equal(profiles[1].label, "GB6 单核", "should resolve label from suiteRef");
  assert.equal(profiles[2].label, "覆盖标签", "explicit label wins over suiteRef");
  for (const p of profiles) assert.equal(p.biggerIsBetter, true);
});

test("getDefaultProfileId returns rankingProfiles.default", () => {
  const resolver = createResolverFor(sampleCategory);
  assert.equal(resolver.getDefaultProfileId(), "composite");
});

test("compute(metric) reads valueNumber from metricValues", () => {
  const resolver = createResolverFor(sampleCategory);
  assert.equal(resolver.compute("gb6-single", sampleDetail), 2200);
  assert.equal(resolver.compute("gb6-multi", sampleDetail), 7000);
});

test("compute(metric) reads rankingScore.score when metricId equals listView.scoreField", () => {
  const category = {
    ...sampleCategory,
    rankingProfiles: {
      default: "perf",
      profiles: [
        { id: "perf", kind: "metric", metricId: "soc.performance.index", label: "性能指数" }
      ]
    }
  };
  const resolver = createResolverFor(category);
  assert.equal(resolver.compute("perf", sampleDetail), 210);
});

test("compute(composite) uses weighted sum of (value/reference)*100", () => {
  const resolver = createResolverFor(sampleCategory);
  const value = resolver.compute("composite", sampleDetail);
  const expected = Math.round(((2200 / 2500) * 100 * 0.4 + (7000 / 8000) * 100 * 0.6) / 1.0);
  assert.equal(value, expected);
});

test("compute(composite) skips missing components and renormalizes", () => {
  const resolver = createResolverFor(sampleCategory);
  const partialDetail = {
    metricValues: [
      { metricId: "soc.benchmark.geekbenchMulti", valueNumber: 8000 }
    ]
  };
  const value = resolver.compute("composite", partialDetail);
  const expected = Math.round(((8000 / 8000) * 100 * 0.6) / 0.6);
  assert.equal(value, expected, "should still produce a score from available components");
});

test("compute returns null for unknown profile or empty data", () => {
  const resolver = createResolverFor(sampleCategory);
  assert.equal(resolver.compute("unknown", sampleDetail), null);
  assert.equal(resolver.compute("composite", { metricValues: [] }), null);
});

test("compute supports derived ratio with numerator/denominator metricIds and range fallback", () => {
  const category = {
    id: "gpu",
    listView: { scoreField: "gpu.performance.index" },
    rankingProfiles: {
      default: "performance",
      profiles: [
        { id: "performance", kind: "metric", metricId: "gpu.performance.index" },
        {
          id: "efficiency",
          label: "能效",
          kind: "derived",
          formula: "ratio",
          numerator: { metricId: "gpu.performance.index" },
          denominator: { metricIds: ["gpu.power.board", "gpu.power.tgpRange"], rangeAggregation: "max" }
        }
      ]
    }
  };
  const resolver = createResolverFor(category);

  const desktopDetail = {
    metricValues: [{ metricId: "gpu.power.board", valueNumber: 200 }],
    rankingScore: { score: 100 }
  };
  assert.equal(resolver.compute("efficiency", desktopDetail), 0.5);

  const laptopDetail = {
    metricValues: [
      { metricId: "gpu.power.tgpRange", valueMin: 80, valueMax: 100 }
    ],
    rankingScore: { score: 90 }
  };
  assert.equal(resolver.compute("efficiency", laptopDetail), 0.9);

  const noPower = { metricValues: [], rankingScore: { score: 100 } };
  assert.equal(resolver.compute("efficiency", noPower), null);
});

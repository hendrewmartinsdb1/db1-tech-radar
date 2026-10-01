import { ConfigData } from "../../config";
import { segmentAngles, slotOf, segmentCount } from "./geometry";

const Ns = [3, 4, 5, 6];

describe("segmentAngles", () => {
  it.each(Ns)(
    "should split 360° into %i contiguous, non-overlapping sectors",
    (N) => {
      const increment = 360 / N;

      for (let slot = 1; slot <= N; slot++) {
        const { startAngle, endAngle, angleIncrement } = segmentAngles(slot, N);
        expect(startAngle).toBeCloseTo((slot - 1) * increment);
        expect(endAngle).toBeCloseTo(slot * increment);
        expect(angleIncrement).toBeCloseTo(increment);
      }

      for (let slot = 1; slot < N; slot++) {
        expect(segmentAngles(slot + 1, N).startAngle).toBeCloseTo(
          segmentAngles(slot, N).endAngle
        );
      }

      expect(segmentAngles(1, N).startAngle).toBeCloseTo(0);
      expect(segmentAngles(N, N).endAngle).toBeCloseTo(360);
    }
  );

  it.each(Ns)("should only produce finite values for N=%i", (N) => {
    for (let slot = 1; slot <= N; slot++) {
      const { startAngle, endAngle, angleIncrement } = segmentAngles(slot, N);
      [startAngle, endAngle, angleIncrement].forEach((v) =>
        expect(Number.isFinite(v)).toBe(true)
      );
    }
  });
});

describe("backward compatibility (N=4)", () => {
  const publishedLayout: Record<string, { order: number; start: number; end: number }> = {
    "methods-and-patterns": { order: 1, start: 0, end: 90 },
    "tools": { order: 2, start: 90, end: 180 },
    "platforms-and-operations": { order: 3, start: 180, end: 270 },
    "languages-and-frameworks": { order: 4, start: 270, end: 360 },
  };

  it.each(Object.entries(publishedLayout))(
    "should keep %s in its published angular range",
    (_slug, { order, start, end }) => {
      const { startAngle, endAngle } = segmentAngles(order, 4);
      expect(startAngle).toBeCloseTo(start);
      expect(endAngle).toBeCloseTo(end);
    }
  );
});

describe("slotOf", () => {
  it("should use `order` when present", () => {
    expect(slotOf({ position: 1, order: 4 })).toBe(4);
  });

  it("should fall back to `position` when `order` is missing", () => {
    expect(slotOf({ position: 2 })).toBe(2);
  });
});

describe("segmentCount", () => {
  it("should count the quadrants in quadrantsMap", () => {
    const config = {
      quadrantsMap: { a: {}, b: {}, c: {} },
    } as unknown as ConfigData;
    expect(segmentCount(config)).toBe(3);
  });
});

import { ConfigData } from "../../config";
import { segmentAngles, slotOf, segmentCount } from "./geometry";

const Ns = [3, 4, 5, 6];

describe("segmentAngles", () => {
  it.each(Ns)(
    "N=%i: setores contíguos, sem sobreposição, somando 360°",
    (N) => {
      const increment = 360 / N;

      for (let slot = 1; slot <= N; slot++) {
        const { startAngle, endAngle, angleIncrement } = segmentAngles(slot, N);
        expect(startAngle).toBeCloseTo((slot - 1) * increment);
        expect(endAngle).toBeCloseTo(slot * increment);
        expect(angleIncrement).toBeCloseTo(increment);
      }

      // contiguidade: o fim de um setor é o começo do próximo
      for (let slot = 1; slot < N; slot++) {
        expect(segmentAngles(slot + 1, N).startAngle).toBeCloseTo(
          segmentAngles(slot, N).endAngle
        );
      }

      // o primeiro setor começa em 0° e o último fecha em 360°
      expect(segmentAngles(1, N).startAngle).toBeCloseTo(0);
      expect(segmentAngles(N, N).endAngle).toBeCloseTo(360);
    }
  );

  it.each(Ns)("N=%i: nunca produz NaN ou valor não finito", (N) => {
    for (let slot = 1; slot <= N; slot++) {
      const { startAngle, endAngle, angleIncrement } = segmentAngles(slot, N);
      [startAngle, endAngle, angleIncrement].forEach((v) =>
        expect(Number.isFinite(v)).toBe(true)
      );
    }
  });
});

describe("trava de retrocompatibilidade (N=4)", () => {
  // Layout publicado hoje, em graus na convenção 0 = 12h, sentido horário.
  // Deriva da antiga tabela `arcAngel` do QuadrantRings.tsx e do campo `order`
  // definido no public/config.json. Se este teste quebrar, o radar publicado
  // rotacionou (regressão visual total).
  const layoutAtual: Record<string, { order: number; start: number; end: number }> = {
    "methods-and-patterns": { order: 1, start: 0, end: 90 },
    "tools": { order: 2, start: 90, end: 180 },
    "platforms-and-operations": { order: 3, start: 180, end: 270 },
    "languages-and-frameworks": { order: 4, start: 270, end: 360 },
  };

  it.each(Object.entries(layoutAtual))(
    "%s permanece na mesma faixa angular de hoje",
    (_slug, { order, start, end }) => {
      const { startAngle, endAngle } = segmentAngles(order, 4);
      expect(startAngle).toBeCloseTo(start);
      expect(endAngle).toBeCloseTo(end);
    }
  );
});

describe("slotOf", () => {
  it("usa `order` quando presente", () => {
    expect(slotOf({ position: 1, order: 4 })).toBe(4);
  });

  it("cai para `position` quando `order` está ausente", () => {
    expect(slotOf({ position: 2 })).toBe(2);
  });
});

describe("segmentCount", () => {
  it("conta os quadrantes do quadrantsMap", () => {
    const config = {
      quadrantsMap: { a: {}, b: {}, c: {} },
    } as unknown as ConfigData;
    expect(segmentCount(config)).toBe(3);
  });
});

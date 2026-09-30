import { ConfigData } from "../../config";

/**
 * Fonte única de verdade da geometria angular do radar.
 *
 * Convenção: graus, 0 = 12 horas, sentido horário. É exatamente a convenção do
 * d3.arc() (usado nos arcos dos anéis), só que o d3 trabalha em radianos — a
 * conversão é apenas `graus * DEG_TO_RAD`. Arcos e blips devem consumir estas
 * mesmas funções, para nunca haver duas convenções reconciliadas à mão.
 *
 * Procedência: algoritmo portado da branch `v5` do upstream
 * `AOEpeople/aoe_technology_radar` (Apache-2.0, mesma origem deste fork).
 */

export const DEG_TO_RAD = Math.PI / 180;

/** Quantidade de quadrantes configurados. */
export const segmentCount = (config: ConfigData): number =>
  Object.keys(config.quadrantsMap).length;

/**
 * Slot ocupado na tela (1..N, horário a partir das 12h).
 *
 * `order` é o slot visual; `position` é só o número do rótulo "QUADRANTE N".
 * Quando `order` não é informado, o slot cai para `position`.
 */
export const slotOf = (q: { position: number; order?: number }): number =>
  q.order ?? q.position;

/**
 * Faixa angular (em graus) de um setor, dada a posição na tela (`slot`) e o
 * número total de segmentos. A fórmula é sequencial: o setor `slot` começa em
 * `(slot - 1) * 360 / N`.
 */
export function segmentAngles(slot: number, numSegments: number) {
  const angleIncrement = 360 / numSegments;
  const startAngle = (slot - 1) * angleIncrement;
  return { startAngle, endAngle: startAngle + angleIncrement, angleIncrement };
}

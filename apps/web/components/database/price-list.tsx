import { Fragment } from "react";

import {
  formatPrice,
  formatPricePerGram,
  type PowderSize,
} from "@/lib/powders";

/**
 * What a powder costs, one row per tin it is sold in.
 *
 * A description list rather than a table or a stack of paragraphs, because that
 * is what this is: a weight, and the price of that weight. The per-gram figure
 * is the reason the rows sit together — the 100g tin is almost always cheaper
 * per gram than the 20g one, and reading the gap is the whole point of listing
 * both. It is derived, never stored: see `formatPricePerGram`.
 *
 * Two auto columns rather than a flex row per size, so the prices line up under
 * each other however wide the weights are — 20 g and 200 g in the same list
 * would otherwise stagger the column. Mono with tabular figures for the same
 * reason: the point of a column of numbers is that you can read down it.
 *
 * Weights are quiet and prices are not. Both are facts, but the price is what
 * is being looked up and the weight is what qualifies it.
 */
export function PriceList({ sizes }: { sizes: PowderSize[] }) {
  return (
    <dl className="data-md grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
      {sizes.map((size) => (
        <Fragment key={size.grams}>
          <dt className="text-right text-clay">{size.grams} g</dt>
          <dd>
            {formatPrice(size)}{" "}
            <span className="text-clay">({formatPricePerGram(size)})</span>
          </dd>
        </Fragment>
      ))}
    </dl>
  );
}

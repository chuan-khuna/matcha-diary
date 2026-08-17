/**
 * Required here, at the app root, and nowhere else.
 *
 * `@next/mdx` compiles every MDX file against a provider it resolves by path —
 * `private-next-root-dir/src/mdx-components`, then
 * `private-next-root-dir/mdx-components` — so this file's *location* is the API.
 * Moving it into `components/` does not relocate the convention; it breaks it,
 * and App Router refuses to compile MDX at all.
 *
 * So the file stays and the content moves: the actual element map lives with the
 * pages it dresses, in `components/cultivars/`, alongside the card and the index
 * it shares a design vocabulary with. This is the doorway between the two.
 */
export { useMDXComponents } from "@/components/cultivars/mdx-components";

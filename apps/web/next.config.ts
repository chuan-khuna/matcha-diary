import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `md` and `mdx` are added so the MDX loader claims those files. Nothing in
  // `app/` uses either extension — the cultivar records live in `content/` and
  // are pulled in by dynamic import — but the option is what switches the
  // loader on at all, so it is not optional.
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
};

const withMDX = createMDX({
  // Default is `/\.mdx$/`. The cultivar records are plain `.md`, so widen it.
  extension: /\.mdx?$/,
  options: {
    // Every record opens with a YAML block. MDX has no concept of frontmatter,
    // so without this plugin the `---` fences render as horizontal rules and
    // the whole record's metadata prints as a paragraph above the prose.
    // The plugin only strips it from the document — the *values* are read
    // separately by `lib/cultivar-data.ts`, which needs them for the index page
    // and the lineage cross-links, neither of which can wait for a render.
    //
    // Named as a string rather than imported: Turbopack hands plugins across to
    // Rust, which cannot take a JavaScript function.
    remarkPlugins: ["remark-frontmatter"],
  },
});

export default withMDX(nextConfig);

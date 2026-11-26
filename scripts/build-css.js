const { compile } = require("@tailwindcss/node");
const { Scanner } = require("@tailwindcss/oxide");
const fs = require("fs");
const path = require("path");

async function buildCss() {
  const rootDir = path.resolve(__dirname, "..");
  const srcCssPath = path.join(rootDir, "styles", "globals.src.css");
  const outCssPath = path.join(rootDir, "app", "globals.css");

  const css = fs.readFileSync(srcCssPath, "utf8");

  const compiler = await compile(css, {
    base: rootDir,
    from: srcCssPath,
    onDependency: () => {},
  });

  const scanner = new Scanner({
    sources: [
      { base: rootDir, pattern: "app/**/*", negated: false },
      { base: rootDir, pattern: "components/**/*", negated: false },
      { base: rootDir, pattern: "lib/**/*", negated: false },
      { base: rootDir, pattern: "styles/**/*", negated: false },
    ],
  });

  const candidates = scanner.scan();
  const builtCss = compiler.build(candidates);

  const header = `/**
 * DEVCORE SOLUTIONS — GLOBAL THEME DESIGN TOKENS
 *
 * LIGHT MODE (Photo 1 Palette):
 *   --bg-canvas: #F4F6F7         (Page Background)
 *   --bg-surface: #E6EAEB        (Card / Surface)
 *   --border-subtle: #CCD0CF     (Borders & Dividers)
 *   --border-strong: #9BA8AB     (Subtle / Decorative)
 *   --text-secondary: #4A5C6A    (Muted Text)
 *   --brand-primary: #253745     (Primary Brand Accent)
 *
 * DARK MODE (Photo 2 Palette):
 *   --bg-canvas: #06141B         (1st from top: Page Background)
 *   --bg-surface: #11212D        (2nd from top: Card / Surface)
 *   --brand-primary: #253745     (3rd from top: Primary Button / Brand Accent)
 *   --border-strong: #4A5C6A     (4th from top: Borders & Dividers / Decorative)
 *   --text-secondary: #9BA8AB    (5th from top: Muted Text / Secondary Text)
 *   --text-primary: #CCD0CF      (6th from top: Primary Text / Foreground)
 */\n\n`;

  fs.writeFileSync(outCssPath, header + builtCss, "utf8");
  console.log(`[build-css] Successfully built ${(header + builtCss).length} bytes to ${outCssPath}`);
}

buildCss().catch((err) => {
  console.error("[build-css] Error:", err);
  process.exit(1);
});

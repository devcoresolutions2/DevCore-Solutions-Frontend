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

  fs.writeFileSync(outCssPath, builtCss, "utf8");
  console.log(`[build-css] Successfully built ${builtCss.length} bytes to ${outCssPath}`);
}

buildCss().catch((err) => {
  console.error("[build-css] Error:", err);
  process.exit(1);
});

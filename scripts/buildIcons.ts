import { readdir } from "node:fs/promises";
import path from "node:path";

(async () => {
  const [_, __, inputDir, outputDir] = process.argv;

  if (!inputDir || !outputDir) {
    console.log("Usage: bun buildIcons.ts <inputDir> <outputDir>");
    return;
  }

  const componentNames: string[] = [];
  (await readdir(inputDir))
    .filter((file) => file.endsWith(".svg"))
    .forEach(async (svgFileName) => {
      generateComponent(inputDir, outputDir, svgFileName);
      componentNames.push(toPascalCase(svgFileName.replace(/\.svg$/, "")));
    });

  generateIndex(outputDir, componentNames);
})();

async function generateIndex(outputDir: string, componentNames: string[]) {
  Bun.write(
    path.join(outputDir, "index.ts"),
    componentNames
      .toSorted()
      .map(
        (component) =>
          `export { default as ${component} } from "./${component}.svelte";\n`,
      ),
  );
}

async function generateComponent(
  inputDir: string,
  outputDir: string,
  svgFileName: string,
) {
  const svgContent = await Bun.file(path.join(inputDir, svgFileName), {
    type: "image/svg+xml",
  }).text();

  const content = svgContent
    .match(/svg.*?>(?<content>.*)<\/svg>/s)
    ?.groups?.content?.trim();

  const iconName = svgFileName.replace(/\.svg$/, "");
  const fileName = `${toPascalCase(iconName)}.svelte`;

  Bun.write(
    path.join(outputDir, fileName),
    `<script lang="ts">
  import BaseIcon from "../BaseIcon.svelte";
  import type { IconProps } from "../types.js";

  const props: IconProps = $props();
</script>

<BaseIcon iconName="${iconName}" {...props}>
  ${content}
</BaseIcon>
`,
  );
}

function toPascalCase(str: string) {
  return str.replace(/(^\w|-\w)/g, (match) =>
    match.replace("-", "").toUpperCase(),
  );
}

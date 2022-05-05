import {
  concat,
  Context,
  getTotalTime,
  GlitchStyle,
  initTmpDir,
  mapTimes,
  pickRandom,
} from "./helpers";

import {
  barDrillLight,
  barDrillMedium,
  barNormal,
  barNormalReverseLastBeat,
  barReorder,
} from "./patterns";

(async () => {
  const wav = "./data/dl.wav";
  const totalTime = await getTotalTime(wav);
  const targetBarCount = 8;
  const ctx: Context = {
    wav,
    output: "./data/output.wav",
    tmpdir: await initTmpDir(),
    barCount: 2,
    beatPerBar: 4,
    glitchStyle: GlitchStyle.JungleGlitch,
    totalTime,
  };
  const bars = await Promise.all(
    mapTimes(targetBarCount, async (targetBar) => {
      const bar = targetBar % ctx.barCount;
      if (ctx.glitchStyle === GlitchStyle.JungleGlitch) {
        if (targetBar === 0) return barNormal(bar, ctx);
        if (bar % 2 === 0)
          return pickRandom([
            barNormal,
            barDrillLight,
            barReorder,
            barNormalReverseLastBeat,
          ])(bar, ctx);
        return pickRandom([
          barDrillLight,
          barReorder,
          barDrillMedium,
          barNormalReverseLastBeat,
        ])(bar, ctx);
      } else {
        throw new Error("Not implemented");
      }
    })
  );
  const result = await concat(bars, ctx.output);
  console.log(result);
})();

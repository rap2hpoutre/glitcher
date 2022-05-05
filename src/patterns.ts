import {
  concat,
  Context,
  drill,
  filename,
  Length,
  mapTimes,
  pickRandom,
  reverse,
  shuffleArray,
  slice,
} from "./helpers";

export async function barReorder(bar: number, ctx: Context): Promise<string> {
  return concat(
    shuffleArray([
      await slice({ length: Length.Beat, beat: 0, bar }, ctx),
      await slice({ length: Length.Beat, beat: 1, bar }, ctx),
      await slice({ length: Length.Beat, beat: 2, bar }, ctx),
      await slice({ length: Length.Beat, beat: 3, bar }, ctx),
    ]),
    filename(`${bar}-reorder`, ctx)
  );
}

export async function barNormal(bar: number, ctx: Context): Promise<string> {
  return slice({ length: Length.Beat * ctx.beatPerBar, beat: 0, bar }, ctx);
}

export async function barDrillLight(
  bar: number,
  ctx: Context
): Promise<string> {
  const length = [
    Length.Beat,
    Length.HalfBeat,
    Length.HalfBeat,
    Length.QuarterBeat,
    Length.QuarterBeat,
    Length.EighthBeat,
    Length.SixteenthBeat,
  ];
  const slices = await Promise.all(
    mapTimes(ctx.beatPerBar, (beat) =>
      drill({ length: pickRandom(length), beat, bar }, ctx)
    )
  );
  return concat(slices, filename(`${bar}-drill-light`, ctx));
}

export async function barDrillMedium(
  bar: number,
  ctx: Context
): Promise<string> {
  const length = [
    Length.Beat,
    Length.HalfBeat,
    Length.HalfBeat,
    Length.ThirdBeat,
    Length.ThirdBeat,
    Length.QuarterBeat,
    Length.QuarterBeat,
    Length.SixthBeat,
    Length.SixthBeat,
    Length.EighthBeat,
    Length.SixteenthBeat,
    Length.TwentyFourthBeat,
  ];
  const slices = await Promise.all(
    mapTimes(ctx.beatPerBar, (beat) =>
      drill({ length: pickRandom(length), beat, bar }, ctx)
    )
  );
  return concat(slices, filename(`${bar}-drill-medium`, ctx));
}

export async function barNormalReverseLastBeat(
  bar: number,
  ctx: Context
): Promise<string> {
  return concat(
    [
      await slice({ length: Length.Beat * 3, beat: 0, bar }, ctx),
      await reverse({ length: Length.Beat, beat: 3, bar }, ctx),
    ],
    filename(`${bar}-normal-reverse-last-beat`, ctx)
  );
}

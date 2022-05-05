import fs from "fs";
import os from "os";
import path from "path";
import { exec } from "child_process";

export enum GlitchStyle {
  Breakcore = "breakcore",
  JungleGlitch = "jungle_glitch",
}

export enum Length {
  Beat = 1,
  HalfBeat = 1 / 2,
  ThirdBeat = 1 / 3,
  QuarterBeat = 1 / 4,
  SixthBeat = 1 / 6,
  EighthBeat = 1 / 8,
  SixteenthBeat = 1 / 16,
  TwentyFourthBeat = 1 / 24,
}

export interface SliceOptions {
  length: Length;
  beat: number;
  bar: number;
}

export interface Context {
  wav: string;
  output: string;
  tmpdir: string;
  barCount: number;
  beatPerBar: number;
  glitchStyle: GlitchStyle;
  totalTime: number;
}

function tmpDir(): string {
  return path.join(os.tmpdir(), "glitch-wav");
}

export function initTmpDir(): string {
  const t = tmpDir();
  if (!fs.existsSync(t)) {
    fs.mkdirSync(t);
  }
  return t;
}

export function execCommandAndGetOutput(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    console.log(command);
    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        reject(err);
      }
      resolve(stdout || stderr);
    });
  });
}

export async function getTotalTime(wav: string): Promise<number> {
  const output = await execCommandAndGetOutput(
    `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${wav}`
  );
  return Number(output);
}

export async function slice(
  options: SliceOptions,
  ctx: Context
): Promise<string> {
  const { length, beat, bar } = options;
  const output = filename(`${bar}-${beat}-${length}`, ctx);
  if (fs.existsSync(output)) return output;
  const beatTime = lengthToTimeLength(Length.Beat, ctx);
  const timePositionStart = beatTime * bar * ctx.beatPerBar + beatTime * beat;
  const duration = beatTime * length;
  const command = `ffmpeg -i ${ctx.wav} -ss ${timePositionStart} -t ${duration} -y ${output}`;
  await execCommandAndGetOutput(command);
  return output;
}

function lengthToTimeLength(length: Length, ctx: Context): number {
  return (ctx.totalTime / ctx.barCount / ctx.beatPerBar) * length;
}

export function filename(name: string, ctx: Context): string {
  return path.join(ctx.tmpdir, `${name}.wav`);
}

export async function drill(
  options: SliceOptions,
  ctx: Context
): Promise<string> {
  const { length, beat, bar } = options;
  const initialSample = await slice(options, ctx);
  const repeat = 1 / length;
  const output = filename(`${bar}-${beat}-${length}-drill`, ctx);
  return concat(Array(repeat).fill(initialSample), output);
}

export async function reverse(
  options: SliceOptions,
  ctx: Context
): Promise<string> {
  const { length, beat, bar } = options;
  const initialSample = await slice(options, ctx);
  const output = filename(`${bar}-${beat}-${length}-reverse`, ctx);
  const command = `ffmpeg -i ${initialSample} -filter_complex "areverse" ${output}`;
  await execCommandAndGetOutput(command);
  return output;
}

export async function concat(files: string[], output: string): Promise<string> {
  if (files.length === 0) throw new Error("No files to concat");
  if (files.length === 1) return files[0];
  const command = `ffmpeg -y ${files
    .map((f) => `-i ${f}`)
    .join(" ")} -filter_complex '${files
    .map((v, k) => `[${k}:0]`)
    .join("")}concat=n=${files.length}:v=0:a=1[out]' -map '[out]' ${output}`;
  await execCommandAndGetOutput(command);
  return output;
}

export function shuffleArray<T>(array: T[]): T[] {
  const newArr = array.slice();
  for (let i = newArr.length - 1; i > 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
  }
  return newArr;
}

export function mapTimes<T>(n: number, fn: (i: number) => T): T[] {
  return Array(n)
    .fill(0)
    .map((_, i) => fn(i));
}

export function pickRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

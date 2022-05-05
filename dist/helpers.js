"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickRandom = exports.mapTimes = exports.shuffleArray = exports.concat = exports.reverse = exports.drill = exports.filename = exports.slice = exports.getTotalTime = exports.execCommandAndGetOutput = exports.initTmpDir = exports.Length = exports.GlitchStyle = void 0;
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
var GlitchStyle;
(function (GlitchStyle) {
    GlitchStyle["Breakcore"] = "breakcore";
    GlitchStyle["JungleGlitch"] = "jungle_glitch";
})(GlitchStyle = exports.GlitchStyle || (exports.GlitchStyle = {}));
var Length;
(function (Length) {
    Length[Length["Beat"] = 1] = "Beat";
    Length[Length["HalfBeat"] = 0.5] = "HalfBeat";
    Length[Length["ThirdBeat"] = 0.3333333333333333] = "ThirdBeat";
    Length[Length["QuarterBeat"] = 0.25] = "QuarterBeat";
    Length[Length["SixthBeat"] = 0.16666666666666666] = "SixthBeat";
    Length[Length["EighthBeat"] = 0.125] = "EighthBeat";
    Length[Length["SixteenthBeat"] = 0.0625] = "SixteenthBeat";
    Length[Length["TwentyFourthBeat"] = 0.041666666666666664] = "TwentyFourthBeat";
})(Length = exports.Length || (exports.Length = {}));
function tmpDir() {
    return path_1.default.join(os_1.default.tmpdir(), "glitch-wav");
}
function initTmpDir() {
    const t = tmpDir();
    if (!fs_1.default.existsSync(t)) {
        fs_1.default.mkdirSync(t);
    }
    return t;
}
exports.initTmpDir = initTmpDir;
function execCommandAndGetOutput(command) {
    return new Promise((resolve, reject) => {
        console.log(command);
        (0, child_process_1.exec)(command, (err, stdout, stderr) => {
            if (err) {
                console.error(err);
                reject(err);
            }
            resolve(stdout || stderr);
        });
    });
}
exports.execCommandAndGetOutput = execCommandAndGetOutput;
function getTotalTime(wav) {
    return __awaiter(this, void 0, void 0, function* () {
        const output = yield execCommandAndGetOutput(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${wav}`);
        return Number(output);
    });
}
exports.getTotalTime = getTotalTime;
function slice(options, ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const { length, beat, bar } = options;
        const output = filename(`${bar}-${beat}-${length}`, ctx);
        if (fs_1.default.existsSync(output))
            return output;
        const beatTime = lengthToTimeLength(Length.Beat, ctx);
        const timePositionStart = beatTime * bar * ctx.beatPerBar + beatTime * beat;
        const duration = beatTime * length;
        const command = `ffmpeg -i ${ctx.wav} -ss ${timePositionStart} -t ${duration} -y ${output}`;
        yield execCommandAndGetOutput(command);
        return output;
    });
}
exports.slice = slice;
function lengthToTimeLength(length, ctx) {
    return (ctx.totalTime / ctx.barCount / ctx.beatPerBar) * length;
}
function filename(name, ctx) {
    return path_1.default.join(ctx.tmpdir, `${name}.wav`);
}
exports.filename = filename;
function drill(options, ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const { length, beat, bar } = options;
        const initialSample = yield slice(options, ctx);
        const repeat = 1 / length;
        const output = filename(`${bar}-${beat}-${length}-drill`, ctx);
        return concat(Array(repeat).fill(initialSample), output);
    });
}
exports.drill = drill;
function reverse(options, ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const { length, beat, bar } = options;
        const initialSample = yield slice(options, ctx);
        const output = filename(`${bar}-${beat}-${length}-reverse`, ctx);
        const command = `ffmpeg -i ${initialSample} -filter_complex "areverse" ${output}`;
        yield execCommandAndGetOutput(command);
        return output;
    });
}
exports.reverse = reverse;
function concat(files, output) {
    return __awaiter(this, void 0, void 0, function* () {
        if (files.length === 0)
            throw new Error("No files to concat");
        if (files.length === 1)
            return files[0];
        const command = `ffmpeg -y ${files
            .map((f) => `-i ${f}`)
            .join(" ")} -filter_complex '${files
            .map((v, k) => `[${k}:0]`)
            .join("")}concat=n=${files.length}:v=0:a=1[out]' -map '[out]' ${output}`;
        yield execCommandAndGetOutput(command);
        return output;
    });
}
exports.concat = concat;
function shuffleArray(array) {
    const newArr = array.slice();
    for (let i = newArr.length - 1; i > 0; i--) {
        const rand = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
    }
    return newArr;
}
exports.shuffleArray = shuffleArray;
function mapTimes(n, fn) {
    return Array(n)
        .fill(0)
        .map((_, i) => fn(i));
}
exports.mapTimes = mapTimes;
function pickRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}
exports.pickRandom = pickRandom;

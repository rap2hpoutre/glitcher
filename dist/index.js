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
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./helpers");
const patterns_1 = require("./patterns");
(() => __awaiter(void 0, void 0, void 0, function* () {
    const wav = "./data/dl.wav";
    const totalTime = yield (0, helpers_1.getTotalTime)(wav);
    const targetBarCount = 8;
    const ctx = {
        wav,
        output: "./data/output.wav",
        tmpdir: yield (0, helpers_1.initTmpDir)(),
        barCount: 2,
        beatPerBar: 4,
        glitchStyle: helpers_1.GlitchStyle.JungleGlitch,
        totalTime,
    };
    const bars = yield Promise.all((0, helpers_1.mapTimes)(targetBarCount, (targetBar) => __awaiter(void 0, void 0, void 0, function* () {
        const bar = targetBar % ctx.barCount;
        if (ctx.glitchStyle === helpers_1.GlitchStyle.JungleGlitch) {
            if (targetBar === 0)
                return (0, patterns_1.barNormal)(bar, ctx);
            if (bar % 2 === 0)
                return (0, helpers_1.pickRandom)([
                    patterns_1.barNormal,
                    patterns_1.barDrillLight,
                    patterns_1.barReorder,
                    patterns_1.barNormalReverseLastBeat,
                ])(bar, ctx);
            return (0, helpers_1.pickRandom)([
                patterns_1.barDrillLight,
                patterns_1.barReorder,
                patterns_1.barDrillMedium,
                patterns_1.barNormalReverseLastBeat,
            ])(bar, ctx);
        }
        else {
            throw new Error("Not implemented");
        }
    })));
    const result = yield (0, helpers_1.concat)(bars, ctx.output);
    console.log(result);
}))();

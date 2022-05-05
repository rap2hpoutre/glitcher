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
exports.barNormalReverseLastBeat = exports.barDrillMedium = exports.barDrillLight = exports.barNormal = exports.barReorder = void 0;
const helpers_1 = require("./helpers");
function barReorder(bar, ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, helpers_1.concat)((0, helpers_1.shuffleArray)([
            yield (0, helpers_1.slice)({ length: helpers_1.Length.Beat, beat: 0, bar }, ctx),
            yield (0, helpers_1.slice)({ length: helpers_1.Length.Beat, beat: 1, bar }, ctx),
            yield (0, helpers_1.slice)({ length: helpers_1.Length.Beat, beat: 2, bar }, ctx),
            yield (0, helpers_1.slice)({ length: helpers_1.Length.Beat, beat: 3, bar }, ctx),
        ]), (0, helpers_1.filename)(`${bar}-reorder`, ctx));
    });
}
exports.barReorder = barReorder;
function barNormal(bar, ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, helpers_1.slice)({ length: helpers_1.Length.Beat * ctx.beatPerBar, beat: 0, bar }, ctx);
    });
}
exports.barNormal = barNormal;
function barDrillLight(bar, ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const length = [
            helpers_1.Length.Beat,
            helpers_1.Length.HalfBeat,
            helpers_1.Length.HalfBeat,
            helpers_1.Length.QuarterBeat,
            helpers_1.Length.QuarterBeat,
            helpers_1.Length.EighthBeat,
            helpers_1.Length.SixteenthBeat,
        ];
        const slices = yield Promise.all((0, helpers_1.mapTimes)(ctx.beatPerBar, (beat) => (0, helpers_1.drill)({ length: (0, helpers_1.pickRandom)(length), beat, bar }, ctx)));
        return (0, helpers_1.concat)(slices, (0, helpers_1.filename)(`${bar}-drill-light`, ctx));
    });
}
exports.barDrillLight = barDrillLight;
function barDrillMedium(bar, ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const length = [
            helpers_1.Length.Beat,
            helpers_1.Length.HalfBeat,
            helpers_1.Length.HalfBeat,
            helpers_1.Length.ThirdBeat,
            helpers_1.Length.ThirdBeat,
            helpers_1.Length.QuarterBeat,
            helpers_1.Length.QuarterBeat,
            helpers_1.Length.SixthBeat,
            helpers_1.Length.SixthBeat,
            helpers_1.Length.EighthBeat,
            helpers_1.Length.SixteenthBeat,
            helpers_1.Length.TwentyFourthBeat,
        ];
        const slices = yield Promise.all((0, helpers_1.mapTimes)(ctx.beatPerBar, (beat) => (0, helpers_1.drill)({ length: (0, helpers_1.pickRandom)(length), beat, bar }, ctx)));
        return (0, helpers_1.concat)(slices, (0, helpers_1.filename)(`${bar}-drill-medium`, ctx));
    });
}
exports.barDrillMedium = barDrillMedium;
function barNormalReverseLastBeat(bar, ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, helpers_1.concat)([
            yield (0, helpers_1.slice)({ length: helpers_1.Length.Beat * 3, beat: 0, bar }, ctx),
            yield (0, helpers_1.reverse)({ length: helpers_1.Length.Beat, beat: 3, bar }, ctx),
        ], (0, helpers_1.filename)(`${bar}-normal-reverse-last-beat`, ctx));
    });
}
exports.barNormalReverseLastBeat = barNormalReverseLastBeat;

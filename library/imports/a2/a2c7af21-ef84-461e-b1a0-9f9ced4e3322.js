"use strict";
cc._RF.push(module, 'a2c7a8h74RGHrGgn5ztTjMi', 'perlinNoise');
// scripts/base/perlinNoise.js

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = PerlinNoise;
var persistence = 0.50;
var Number_Of_Octaves = 4;

function Noise(x, y) // 根据(x,y)获取一个初步噪声值
{
    var n = x + y * 57;
    n = n << 13 ^ n;
    return 1.0 - (n * (n * n * 15731 + 789221) + 1376312589 & 0x7fffffff) / 1073741824.0;
}

function SmoothedNoise(x, y) // 光滑噪声
{
    var corners = (Noise(x - 1, y - 1) + Noise(x + 1, y - 1) + Noise(x - 1, y + 1) + Noise(x + 1, y + 1)) / 16;
    var sides = (Noise(x - 1, y) + Noise(x + 1, y) + Noise(x, y - 1) + Noise(x, y + 1)) / 8;
    var center = Noise(x, y) / 4;
    return corners + sides + center;
}

function Cosine_Interpolate(a, b, x) // 余弦插值
{
    var ft = x * Math.PI;
    var f = (1 - Math.cos(ft)) * 0.5;
    return a * (1 - f) + b * f;
}

function InterpolatedNoise(x, y) // 获取插值噪声
{
    var integer_X = parseInt(x);
    var fractional_X = x - integer_X;
    var integer_Y = parseInt(y);
    var fractional_Y = y - integer_Y;
    var v1 = SmoothedNoise(integer_X, integer_Y);
    var v2 = SmoothedNoise(integer_X + 1, integer_Y);
    var v3 = SmoothedNoise(integer_X, integer_Y + 1);
    var v4 = SmoothedNoise(integer_X + 1, integer_Y + 1);
    var i1 = Cosine_Interpolate(v1, v2, fractional_X);
    var i2 = Cosine_Interpolate(v3, v4, fractional_X);
    return Cosine_Interpolate(i1, i2, fractional_Y);
}

function PerlinNoise(x, y) // 最终调用：根据(x,y)获得其对应的PerlinNoise值
{
    var total = 0;
    var p = persistence;
    for (var i = 0; i < Number_Of_Octaves; i++) {
        var frequency = Math.pow(2, i);
        var amplitude = Math.pow(p, i);
        total += InterpolatedNoise(x * frequency, y * frequency) * amplitude;
    }

    //console.log("perlin", total)

    return total * 1000;
}
module.exports = exports["default"];

cc._RF.pop();
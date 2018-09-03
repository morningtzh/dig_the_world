const persistence = 0.50;
const Number_Of_Octaves = 4;

function Noise(x, y) // 根据(x,y)获取一个初步噪声值
{
    let n = x + y * 57;
    n = (n << 13) ^ n;
    return (1.0 - ((n * (n * n * 15731 + 789221) + 1376312589) & 0x7fffffff) / 1073741824.0);
}

function SmoothedNoise(x, y) // 光滑噪声
{
    const corners = (Noise(x - 1, y - 1) + Noise(x + 1, y - 1) + Noise(x - 1, y + 1) + Noise(x + 1, y + 1)) / 16;
    const sides = (Noise(x - 1, y) + Noise(x + 1, y) + Noise(x, y - 1) + Noise(x, y + 1)) / 8;
    const center = Noise(x, y) / 4;
    return corners + sides + center;
}

function Cosine_Interpolate(a, b, x) // 余弦插值
{
    const ft = x * Math.PI;
    const f = (1 - Math.cos(ft)) * 0.5;
    return a * (1 - f) + b * f;
}

function InterpolatedNoise(x, y) // 获取插值噪声
{
    const integer_X = parseInt(x);
    const fractional_X = x - integer_X;
    const integer_Y = parseInt(y);
    const fractional_Y = y - integer_Y;
    const v1 = SmoothedNoise(integer_X, integer_Y);
    const v2 = SmoothedNoise(integer_X + 1, integer_Y);
    const v3 = SmoothedNoise(integer_X, integer_Y + 1);
    const v4 = SmoothedNoise(integer_X + 1, integer_Y + 1);
    const i1 = Cosine_Interpolate(v1, v2, fractional_X);
    const i2 = Cosine_Interpolate(v3, v4, fractional_X);
    return Cosine_Interpolate(i1, i2, fractional_Y);
}

module.exports =  function PerlinNoise(x, y) // 最终调用：根据(x,y)获得其对应的PerlinNoise值
{
    let total = 0;
    const p = persistence;
    for (let i = 0; i < Number_Of_Octaves; i++) {
        const frequency = 2 ** i;
        const amplitude = p ** i;
        total += InterpolatedNoise(x * frequency, y * frequency) * amplitude;
    }

    //console.log("perlin", total)

    return total * 1000;
}

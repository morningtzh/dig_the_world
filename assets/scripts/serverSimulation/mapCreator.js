
const util = require("../base/util");
const perlinNosie = require("../base/perlinNoise");
const MapDataChunk = require("./map_data_chunk");

class MapCreator {

    constructor() {
        this.loadedMap = {};
        this.loadedMapRaw = {};

        this.perlin = {};

    }

    getPerlin(x) {
        let h = this.perlin[`${x}`];
        if (null === h || undefined === h) {
            h = parseInt(perlinNosie(x * 0.001, 1.234));
            this.perlin[`${x}`] = h;
        }

        return h;
    }

    loadData(name) {
        cc.sys.localStorage.getItem(name);

        
    }

    saveData(name, data) {
        cc.sys.localStorage.setItem(name, data);
    }

    loadChunk(x, y, ifRaw) {
        let chunkName = `${x}|${y}`;

        //cc.log(`loadChunk ${chunkName} ${ifRaw ? "Raw":"Object"}`);

        let rawChunk = this.loadedMapRaw[chunkName];
        let chunk = this.loadedMap[chunkName];

        /* 先獲取原始數據，獲取不到則創建 */
        if (!rawChunk) {

            /* 嘗試從存儲數據中獲取 */
            rawChunk = this.loadData(`chunk_${chunkName}`);
            if (!rawChunk) {

                chunk = new MapDataChunk(x, y, null, this);
                rawChunk = chunk.dump();

                this.loadedMap[chunkName] = chunk;
                this.loadedMapRaw[chunkName] = rawChunk;

                /* 生成好后需要存儲數據 */
                this.saveData(`chunk_${chunkName}`, rawChunk);
            }
        }

        /* 如果指定需要非原始數據，則探測，若沒有則從原始數據生成 */
        if (!ifRaw && !chunk) {
            chunk = new MapDataChunk(x, y, rawChunk, this);
        }

        //cc.log("cccccc", chunk, rawChunk);

        if (ifRaw)
            return rawChunk;
        else
            return chunk;
    }

    getMap(pixelX, pixelY, pixelWidth, pixelHeight) {
        let chunks = [];

        let chunkXMin = util.pixel2ChunkId_W(pixelX - pixelWidth / 2);
        let chunkXMax = util.pixel2ChunkId_W(pixelX + pixelWidth / 2);
        let chunkYMin = util.pixel2ChunkId_H(pixelY - pixelHeight / 2);
        let chunkYMax = util.pixel2ChunkId_H(pixelY + pixelHeight / 2);

        for (let _x = chunkXMin; _x <= chunkXMax; _x++) {
            for (let _y = chunkYMin; _y <= chunkYMax; _y++) {
                chunks.push(this.loadChunk(_x, _y, false));
            }
        }

        return chunks;
    }

    getMapRaw(pixelX, pixelY, pixelWidth, pixelHeight) {
        let chunks = [];
        let chunkXMin = util.pixel2ChunkId_W(pixelX - pixelWidth / 2) - 1;
        let chunkXMax = util.pixel2ChunkId_W(pixelX + pixelWidth / 2) + 1;
        let chunkYMin = util.pixel2ChunkId_H(pixelY - pixelHeight / 2) - 1;
        let chunkYMax = util.pixel2ChunkId_H(pixelY + pixelHeight / 2) + 1;
        cc.log(chunkXMin, chunkXMax, chunkYMin, chunkYMax);
        for (let _x = chunkXMin; _x <= chunkXMax; _x++) {
            for (let _y = chunkYMin; _y <= chunkYMax; _y++) {
                chunks.push(this.loadChunk(_x, _y, true));
            }
        }

        return chunks;
    }

}

module.exports = new MapCreator();
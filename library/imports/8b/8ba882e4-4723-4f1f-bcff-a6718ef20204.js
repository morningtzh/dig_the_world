"use strict";
cc._RF.push(module, '8ba88LkRyNPH7z/pnGO8gIE', 'mapCreator');
// scripts/serverSimulation/mapCreator.js

"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var util = require("../base/util");
var perlinNosie = require("../base/perlinNoise");
var MapDataChunk = require("./map_data_chunk");

var MapCreator = function () {
    function MapCreator() {
        _classCallCheck(this, MapCreator);

        this.loadedMap = {};
        this.loadedMapRaw = {};

        this.perlin = {};
    }

    _createClass(MapCreator, [{
        key: "getPerlin",
        value: function getPerlin(x) {
            var h = this.perlin["" + x];
            if (null === h || undefined === h) {
                h = parseInt(perlinNosie(x * 0.001, 1.234));
                this.perlin["" + x] = h;
            }

            return h;
        }
    }, {
        key: "loadData",
        value: function loadData(name) {
            cc.sys.localStorage.getItem(name);
        }
    }, {
        key: "saveData",
        value: function saveData(name, data) {
            cc.sys.localStorage.setItem(name, data);
        }
    }, {
        key: "loadChunk",
        value: function loadChunk(x, y, ifRaw) {
            var chunkName = x + "|" + y;

            //cc.log(`loadChunk ${chunkName} ${ifRaw ? "Raw":"Object"}`);

            var rawChunk = this.loadedMapRaw[chunkName];
            var chunk = this.loadedMap[chunkName];

            /* 先獲取原始數據，獲取不到則創建 */
            if (!rawChunk) {

                /* 嘗試從存儲數據中獲取 */
                rawChunk = this.loadData("chunk_" + chunkName);
                if (!rawChunk) {

                    chunk = new MapDataChunk(x, y, null, this);
                    rawChunk = chunk.dump();

                    this.loadedMap[chunkName] = chunk;
                    this.loadedMapRaw[chunkName] = rawChunk;

                    /* 生成好后需要存儲數據 */
                    this.saveData("chunk_" + chunkName, rawChunk);
                }
            }

            /* 如果指定需要非原始數據，則探測，若沒有則從原始數據生成 */
            if (!ifRaw && !chunk) {
                chunk = new MapDataChunk(x, y, rawChunk, this);
            }

            //cc.log("cccccc", chunk, rawChunk);

            if (ifRaw) return rawChunk;else return chunk;
        }
    }, {
        key: "getMap",
        value: function getMap(pixelX, pixelY, pixelWidth, pixelHeight) {
            var chunks = [];

            var chunkXMin = util.pixel2ChunkId_W(pixelX - pixelWidth / 2);
            var chunkXMax = util.pixel2ChunkId_W(pixelX + pixelWidth / 2);
            var chunkYMin = util.pixel2ChunkId_H(pixelY - pixelHeight / 2);
            var chunkYMax = util.pixel2ChunkId_H(pixelY + pixelHeight / 2);

            for (var _x = chunkXMin; _x <= chunkXMax; _x++) {
                for (var _y = chunkYMin; _y <= chunkYMax; _y++) {
                    chunks.push(this.loadChunk(_x, _y, false));
                }
            }

            return chunks;
        }
    }, {
        key: "getMapRaw",
        value: function getMapRaw(pixelX, pixelY, pixelWidth, pixelHeight) {
            var chunks = [];
            var chunkXMin = util.pixel2ChunkId_W(pixelX - pixelWidth / 2) - 1;
            var chunkXMax = util.pixel2ChunkId_W(pixelX + pixelWidth / 2) + 1;
            var chunkYMin = util.pixel2ChunkId_H(pixelY - pixelHeight / 2) - 1;
            var chunkYMax = util.pixel2ChunkId_H(pixelY + pixelHeight / 2) + 1;
            cc.log(chunkXMin, chunkXMax, chunkYMin, chunkYMax);
            for (var _x = chunkXMin; _x <= chunkXMax; _x++) {
                for (var _y = chunkYMin; _y <= chunkYMax; _y++) {
                    chunks.push(this.loadChunk(_x, _y, true));
                }
            }

            return chunks;
        }
    }]);

    return MapCreator;
}();

module.exports = new MapCreator();

cc._RF.pop();
(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/map_manager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '3514ecBrhdAlo/zczXA/VGW', 'map_manager', __filename);
// scripts/map_manager.js

"use strict";

// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var util = require("./base/util");
var mapDateManager = require("./serverSimulation/mapCreator");
var RenderChunk = require("./map/render_chunk");

cc.Class({
    extends: cc.Component,

    properties: {
        blockPrefab: {
            default: null,
            type: cc.Prefab
        },

        chunkRange: [0, 0]
    },

    getBlockInPool: function getBlockInPool() {
        var block = null;
        if (this.blockPool.size() > 0) {
            // 通过 size 接口判断对象池中是否有空闲的对象
            block = this.blockPool.get();
        } else {
            // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            block = cc.instantiate(this.blockPrefab);
            //cc.log(`create new block `)
        }

        return block;
    },
    putBlockToPool: function putBlockToPool(block) {
        this.blockPool.put(block);
    },
    getChunkInPool: function getChunkInPool() {
        var chunk = null;
        if (this.chunkPool.size() > 0) {
            // 通过 size 接口判断对象池中是否有空闲的对象
            chunk = this.chunkPool.get();
        } else {
            // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            chunk = new RenderChunk();
            chunk.init(this);
            cc.log("create new chunk ");
        }

        return chunk;
    },
    putChunkToPool: function putChunkToPool(chunk) {
        this.chunkPool.put(chunk);
    },
    untargetAllRenderedChunks: function untargetAllRenderedChunks() {
        for (var chunkIndex in this.renderedChunks) {
            this.renderedChunks[chunkIndex].rendered = false;
        }
    },
    clearUnrenderedChunks: function clearUnrenderedChunks() {
        for (var chunkIndex in this.renderedChunks) {
            var chunk = this.renderedChunks[chunkIndex];
            if (chunk.rendered === false) {
                cc.log("RenderChunk " + chunk.chunkX + "|" + chunk.chunkY + " will clear");

                //this.chunkPool.put(chunk);
                chunk.destroy();
                delete this.renderedChunks[chunkIndex];
            }
        }
    },
    disChunk: function disChunk(chunks) {

        this.untargetAllRenderedChunks();

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = chunks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var chunk = _step.value;


                if (this.renderedChunks[chunk.x + "|" + chunk.y]) {

                    this.renderedChunks[chunk.x + "|" + chunk.y].rendered = true;
                    cc.log("RenderChunk " + chunk.x + "|" + chunk.y + " need not rerender");
                    continue;
                }

                cc.log("RenderChunk " + chunk.x + "|" + chunk.y + " created");
                var renderChunk = this.getChunkInPool();
                renderChunk.parent = this.node;
                renderChunk.load(chunk);
                renderChunk.rendered = true;

                this.renderedChunks[chunk.x + "|" + chunk.y] = renderChunk;

                //cc.log("dischunk:", renderChunk);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        this.clearUnrenderedChunks();
    },
    reflushMap: function reflushMap(x, y) {

        var willRenderChunks = mapDateManager.getMapRaw(this.player.x, this.player.y, x ? x : cc.winSize.width, y ? y : cc.winSize.height);

        //cc.log("willRenderChunks", willRenderChunks);

        if (0 < willRenderChunks.length) {
            cc.log("map will reflush.");
            this.disChunk(willRenderChunks);
        }
    },
    onLoad: function onLoad() {
        var _this = this;

        cc.log(cc);
        cc.log("Map onLoad");
        this.node.setContentSize(this.node.parent.getContentSize());
        this.node.setAnchorPoint(0.5, 0.5);
        this.node.zIndex = cc.macro.MIN_ZINDEX;

        this.player = this.node.getChildByName("player");
        cc.log(this.node.children);
        this.player.map = this;
        this.player.reflushMap = this.reflushMap.bind(this);

        this.player.gamePosition = [0, 150];
        this.player.currChunk = [this.player.gamePosition[0] / util.BLOCK_PER_CHUNK_WIDTH, this.player.gamePosition[1] / util.BLOCK_PER_CHUNK_HEIGHT];

        this.perlin = {};

        this.player.setPosition(this.player.gamePosition[0] * util.BLOCK_WIDTH, this.player.gamePosition[1] * util.BLOCK_HEIGHT);

        this.blockPool = new cc.NodePool();
        this.chunkPool = new cc.NodePool();

        this.renderedChunks = {};
        this.chunkRange = [parseInt(this.node.width / util.BLOCK_WIDTH / util.BLOCK_PER_CHUNK_WIDTH) + 2, parseInt(this.node.height / util.BLOCK_HEIGHT / util.BLOCK_PER_CHUNK_HEIGHT) + 2];

        this.reflushMap(20 * util.CHUNK_WIDTH, 5 * util.CHUNK_WIDTH);

        cc.log("type of blockPrefab:", this.blockPrefab);

        var point = [[-128, -128], [-128, 0], [-128, 128], [0, -128], [0, 0], [0, 128], [128, -128], [128, -0], [128, 128]];
        point.forEach(function (point) {
            var blockA = _this.getBlockInPool();
            blockA.color = cc.Color.RED;
            blockA.x = point[0];
            blockA.y = point[1];
            blockA.parent = _this.node;
        });
    },
    start: function start() {}
}

// update(dt) {
// },
);

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=map_manager.js.map
        
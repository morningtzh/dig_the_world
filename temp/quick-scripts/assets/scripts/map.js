(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/map.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '6d972COG4JLyqlzpLjHpWsI', 'map', __filename);
// scripts/map.js

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

var perlinNosie = require("./base/perlinNoise");
var util = require("./base/util");

cc.Class({
    extends: cc.Component,

    properties: {
        // 这个属性引用了星星预制资源
        blockPrefab: {
            default: null,
            type: cc.Prefab
        },

        chunkRange: [0, 0]
        //worldMap: {},
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

        // 将生成的方塊加入节点树
        this.node.addChild(block);
        //block.zIndex = cc.macro.MIN_ZINDEX;
        //cc.log(block.zIndex);
        return block;
    },
    createNewChunk: function createNewChunk(id, centerPoint) {

        cc.log("create new map chunk " + id);
        var chunk = {};
        chunk.centerPoint = centerPoint;
        chunk.id = id;

        for (var i = -util.BLOCK_PER_CHUNK_WIDTH / 2; i < util.BLOCK_PER_CHUNK_WIDTH / 2; i++) {

            var h = this.perlin["" + (centerPoint[0] + i)];
            if (null === h || undefined === h) {
                h = parseInt(perlinNosie((centerPoint[0] + i) * 0.001, 1.234));
                this.perlin["" + (centerPoint[0] + i)] = h;
                //cc.log("h", h, `${(centerPoint[0] + i)}`, (centerPoint[0] + i) * 0.01);
            }

            for (var j = -util.BLOCK_PER_CHUNK_HEIGHT / 2; j < util.BLOCK_PER_CHUNK_HEIGHT / 2; j++) {
                //cc.log("xxx", i,j);
                var block = {};
                block.x = i;
                block.y = j;

                block.type = 0;
                block.entity = 0;

                if (centerPoint[1] + j <= h) {
                    block.type = 1;
                };

                // 边缘方块需要碰撞检测
                if (centerPoint[1] + j === h || i === -util.BLOCK_PER_CHUNK_WIDTH / 2 || i === util.BLOCK_PER_CHUNK_WIDTH / 2 - 1 || j === -util.BLOCK_PER_CHUNK_HEIGHT / 2 || j === util.BLOCK_PER_CHUNK_HEIGHT / 2 - 1) {
                    // 只有非空方块才能有碰撞检测
                    if (1 === block.type) {
                        block.entity = 1;
                    }
                };

                chunk[i + "|" + j] = block;
            }
        }
        this.worldMap["" + id] = chunk;

        return chunk;
    },
    initMap: function initMap() {
        cc.log("Start to init map, will create 32 * 8 chunks");
        this.worldMap = this.worldMap ? this.worldMap : {};

        for (var i = -16; i < 16; i++) {
            for (var j = -4; j < 4; j++) {
                this.createNewChunk(i + "|" + j, [i * util.BLOCK_PER_CHUNK_WIDTH, j * util.BLOCK_PER_CHUNK_HEIGHT]);
            }
        }
        //cc.log("chunk", this.worldMap);
    },
    getChunk: function getChunk(playerCurrChunk) {
        var chunks = [];
        var chunkX = playerCurrChunk[0];
        var chunkY = playerCurrChunk[1];

        //cc.log(playerGamePosition)

        //for (let i =  - 1; i <=  1; i++) {
        for (var i = -this.chunkRange[0] / 2 - 1; i <= this.chunkRange[0] / 2 + 1; i++) {
            //let j = 0;
            for (var j = -this.chunkRange[1] / 2 - 1; j <= this.chunkRange[1] / 2 + 1; j++) {
                var x = parseInt(i);
                var y = parseInt(j);
                //cc.log(x, y)

                var chunk = this.worldMap[chunkX + x + "|" + (chunkY + y)];
                if (!chunk) {
                    chunk = this.createNewChunk(chunkX + x + "|" + (chunkY + y), [(chunkX + x) * util.BLOCK_PER_CHUNK_WIDTH, (chunkY + y) * util.BLOCK_PER_CHUNK_HEIGHT]);
                }

                chunks.push(chunk);
            }
        }

        return chunks;
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
                cc.log("RenderChunk " + chunk.centerPoint[0] + "|" + chunk.centerPoint[1] + " will clear");
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = chunk.renderBlocks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var block = _step.value;

                        if (1 === block.type) {
                            this.blockPool.put(block.block);
                        }
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

                delete this.renderedChunks[chunkIndex];
            }
        }
    },
    disChunk: function disChunk(chunks) {

        this.untargetAllRenderedChunks();

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = chunks[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var chunk = _step2.value;

                //cc.log("dischunk c", chunk);

                if (this.renderedChunks[chunk.centerPoint[0] + "|" + chunk.centerPoint[1]]) {

                    this.renderedChunks[chunk.centerPoint[0] + "|" + chunk.centerPoint[1]].rendered = true;

                    //cc.log(`RenderChunk ${chunk.centerPoint[0]}|${chunk.centerPoint[1]} need not rerender`);
                    continue;
                }

                this.renderedChunks[chunk.centerPoint[0] + "|" + chunk.centerPoint[1]] = {};
                cc.log("RenderChunk " + chunk.centerPoint[0] + "|" + chunk.centerPoint[1] + " created");

                var renderChunk = this.renderedChunks[chunk.centerPoint[0] + "|" + chunk.centerPoint[1]];
                renderChunk.rendered = true;
                renderChunk.renderBlocks = [];
                renderChunk.centerPoint = chunk.centerPoint;

                for (var i = -util.BLOCK_PER_CHUNK_WIDTH / 2; i < util.BLOCK_PER_CHUNK_WIDTH / 2; i++) {
                    for (var j = -util.BLOCK_PER_CHUNK_HEIGHT / 2; j < util.BLOCK_PER_CHUNK_HEIGHT / 2; j++) {

                        var block = chunk[i + "|" + j];
                        var renderBlock = {};

                        renderBlock.type = block.type;
                        renderBlock.position = [i, j];
                        renderBlock.chunkPosition = chunk.centerPoint;

                        if (1 === renderBlock.type) {

                            var newBlock = this.getBlockInPool();
                            newBlock.x = (block.x + chunk.centerPoint[0]) * util.BLOCK_WIDTH;
                            newBlock.y = (block.y + chunk.centerPoint[1]) * util.BLOCK_HEIGHT;
                            newBlock.getComponent("block").map = this;

                            if (block.entity) {
                                newBlock.getComponent(cc.PhysicsCollider).enabled = true;
                            } else {
                                newBlock.getComponent(cc.PhysicsCollider).enabled = false;
                            }

                            renderBlock.block = newBlock;
                        }

                        renderChunk.renderBlocks.push(renderBlock);
                    }
                }
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }

        this.clearUnrenderedChunks();
    },
    reflushMap: function reflushMap() {
        var willRenderChunks = this.getChunk(this.player.currChunk);
        if (0 < willRenderChunks.length) {
            cc.log("map will reflush.");
            this.disChunk(willRenderChunks);
        }
    },
    onLoad: function onLoad() {
        cc.log(cc);
        this.node.setContentSize(this.node.parent.getContentSize());
        this.node.setPosition(-this.node.x / 2, -this.node.y / 2);
        this.node.setAnchorPoint(0, 0);
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

        this.renderedChunks = {};
        this.chunkRange = [parseInt(this.node.width / util.BLOCK_WIDTH / util.BLOCK_PER_CHUNK_WIDTH) + 2, parseInt(this.node.height / util.BLOCK_HEIGHT / util.BLOCK_PER_CHUNK_HEIGHT) + 2];

        this.initMap();

        this.reflushMap();

        cc.log(this.node.children);
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
        //# sourceMappingURL=map.js.map
        
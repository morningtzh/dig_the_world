"use strict";
cc._RF.push(module, '66a3cVtKSpFSo22s/NmSWBs', 'render_chunk');
// scripts/map/render_chunk.js

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

var util = require("../base/util");
var RenderQuartree = require("./render_quartree");

var RenderChunk = cc.Class({
    extends: cc.Node,

    properties: {},

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start: function start() {},
    ctor: function ctor() {},
    init: function init(map) {
        this.map = map;
    },
    load: function load(data) {
        console.log("load chunk, ", data);

        this.chunkX = data.x;
        this.chunkY = data.y;
        this.width = data.pixelRect[2];
        this.height = data.pixelRect[3];
        data.name = this.name;

        /* 設置位置，為 cc.Rect 對象 */
        this.pixelRect = new cc.Rect(data.pixelRect[0] - data.pixelRect[2] / 2, data.pixelRect[1] - data.pixelRect[3] / 2, data.pixelRect[2], data.pixelRect[3]);

        this.x = data.pixelRect[0];
        this.y = data.pixelRect[1];

        /* 沒有四叉樹則創建 */
        if (!this.quartree) {
            this.quartree = new RenderQuartree();
            this.quartree.parent = this;
            this.quartree.initQuartree(data.quartree, this.map);
        } else {
            this.quartree.load(data.quartree);
        }

        this.quartree.setRigidbody();
    },
    dump: function dump() {
        var data = {};

        data.chunkX = this.x;
        data.chunkY = this.y;
        data.name = this.name;

        data.type = util.DATATYPE.CHUNK;
        data.quartree = this.quartree.dump();
        data.pixelRect = [this.pixelRect.center.x, this.pixelRect.center.y, this.pixelRect.width, this.pixelRect.height];
    },
    childBroken: function childBroken() {
        /* 不應該會通知到 chunk 節點 */
        cc.log("Chunk be notice Child Broken!!!! ERROR!");
    }

    // update (dt) {},

});

module.exports = RenderChunk;

cc._RF.pop();
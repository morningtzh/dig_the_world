(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/map/render_quartree.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'c4c23BnlHxC4KDQhTFR4b+E', 'render_quartree', __filename);
// scripts/map/render_quartree.js

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

var RenderQuartree = cc.Class({
    extends: cc.Node,

    properties: {},

    // LIFE-CYCLE CALLBACKS:
    start: function start() {},


    // update (dt) {},

    ctor: function ctor() {},
    onLoad: function onLoad() {
        this.on("mousemove", function (event) {
            cc.log("mousemove", event.currentTarget);
            this.color = new cc.Color(cc.Color.GREEN);
        }.bind(this));

        this.on("mouseleave", function (event) {
            cc.log("mouseleave", event.currentTarget);

            this.color = new cc.Color(cc.Color.RED);
        }.bind(this));
    },
    initQuartree: function initQuartree(data, map) {

        this.map = map;

        /* 複用屬性設置 */
        this.n = data.n;
        this.anchorX = 0.5;
        this.anchorY = 0.5;
        this.width = data.pixelRect[2];
        this.height = data.pixelRect[3];
        this.group = "block";

        /* 設置剛體 */
        this.rigidbody = this.addComponent(cc.RigidBody);
        //this.rigidbody.enabled = false;
        this.rigidbody.enabledContactListener = false;
        this.rigidbody.bullut = false;
        this.rigidbody.type = cc.RigidBodyType.Static;
        this.rigidbody.allowSleep = true;
        this.rigidbody.gravityScale = 0;
        this.rigidbody.fixedRotation = false;

        /* 設置碰撞體 */
        this.collider = this.addComponent(cc.PhysicsBoxCollider);
        this.collider.enabled = false;
        this.collider.offset = new cc.Vec2(0, 0);
        this.collider.size = new cc.Size(data.pixelRect[2], data.pixelRect[3]);

        /* 設置位置，為 cc.Rect 對象 */
        this.pixelRect = new cc.Rect(data.pixelRect[0] - data.pixelRect[2] / 2, data.pixelRect[1] - data.pixelRect[3] / 2, data.pixelRect[2], data.pixelRect[3]);

        this.x = this.pixelRect.center.x - this.parent.pixelRect.center.x;
        this.y = this.pixelRect.center.y - this.parent.pixelRect.center.y;

        //cc.log(`init quertree ${this.n} on ${this.x} ${this.y} `);

        /* 生成子四叉樹 or 磚塊 */
        if (data.n > 0) {
            this.lu = new RenderQuartree();
            this.ld = new RenderQuartree();
            this.ru = new RenderQuartree();
            this.rd = new RenderQuartree();
            this.addChild(this.lu);
            this.addChild(this.ld);
            this.addChild(this.ru);
            this.addChild(this.rd);
            this.lu.initQuartree(data.lu, this.map);
            this.ld.initQuartree(data.ld, this.map);
            this.ru.initQuartree(data.ru, this.map);
            this.rd.initQuartree(data.rd, this.map);
        } else {

            /* 如果需要磚塊則創建 */
            if (data.block) {

                var newBlock = this.map.getBlockInPool();

                newBlock.x = 0;
                newBlock.y = 0;
                newBlock.enabled = true;

                this.block = newBlock;
                this.addChild(newBlock);

                //cc.log(`init block on ${newBlock.x} ${newBlock.y} `);
            }
        }

        /* 設置實體 */
        this.entity = data.entity;
    },


    /* 加載數據，用於二次數據加載 */
    load: function load(data) {
        /* 設置位置，為 cc.Rect 對象 */
        this.pixelRect = new cc.Rect(data.pixelRect[0] - data.pixelRect[2] / 2, data.pixelRect[1] - data.pixelRect[3] / 2, data.pixelRect[2], data.pixelRect[3]);

        this.x = this.pixelRect.center.x - this.parent.pixelRect.center.x;
        this.y = this.pixelRect.center.y - this.parent.pixelRect.center.y;

        /* 更新節點屬性 */
        if (data.n > 0) {
            this.lu.load(data.lu);
            this.ld.load(data.ld);
            this.ru.load(data.ru);
            this.rd.load(data.rd);
        } else {

            if (true === data.block && !this.block) {
                var newBlock = this.map.getBlockInPool();

                newBlock.x = 0;
                newBlock.y = 0;
                newBlock.enabled = true;

                this.block = newBlock;
                this.addChild(newBlock);
                //cc.log(`reload block on ${newBlock.x} ${newBlock.y} `);
            } else if (true != data.block && this.block) {
                this.map.putBlockToPool(this.block);
                delete this.block;
            }
        }

        this.entity = data.entity;
    },
    setRigidbody: function setRigidbody() {

        /* 為實體時設置剛體和碰撞，否則設置子節點 */
        //cc.log(`setRigidbody ${" ".repeat(this.n)}${this.n} ${this.pixelRect.center.x}, ${this.pixelRect.center.x} entity ${this.ifEntity()}`);

        if (this.ifEntity()) {
            //cc.log(`${" ".repeat(this.n)}${this.n} ${this.pixelRect.center.x}, ${this.pixelRect.center.x} block off`);

            this.collider.enabled = true;
        } else {
            this.collider.enabled = false;

            /* 非實體，非葉節點則往下通知 */
            if (this.n > 0) {
                this.lu.setRigidbody();
                this.ld.setRigidbody();
                this.ru.setRigidbody();
                this.rd.setRigidbody();
            }
        }
    },
    childBroken: function childBroken() {
        if (!this.entity) {
            return;
        }

        this.entity = false;

        /* 只有本節點實體生效的情況下才關閉，并通知子節點 */
        if (this.collider.enabled) {
            //this.rigidbody.enabled = false;
            this.collider.enabled = false;

            this.lu.setRigidbody();
            this.ld.setRigidbody();
            this.ru.setRigidbody();
            this.rd.setRigidbody();
        } else
            /* 不然就通知父節點 */{
                this.parent.childBroken();
            }
    },


    /* 等到用到的時候再去計算 */
    ifEntity: function ifEntity() {
        /* 判斷 entity 屬性是否存在 */
        if (null === this.entity || undefined === this.entity) {

            /* 如果不存在就去子組件中獲取 */
            if (null !== this.block && undefined !== this.block) {
                if (this.block) {
                    this.entity = true;
                } else {
                    this.entity = false;
                }
            } else {
                this.entity = this.lu.ifEntity() && this.ld.ifEntity() && this.ru.ifEntity() && this.rd.ifEntity();
            }
        }

        return this.entity;
    },
    dump: function dump() {
        var data = {};

        data.type = util.DATATYPE.QUARTREE;
        data.pixelRect = [this.pixelRect.center.x, this.pixelRect.center.y, this.pixelRect.width, this.pixelRect.height];

        data.n = this.n;
        if (this.n > 0) {
            data.lu = this.lu.dump();
            data.ld = this.ld.dump();
            data.ru = this.ru.dump();
            data.rd = this.rd.dump();
        } else {
            data.block = !!this.block;
        }

        data.entity = this.entity;

        return data;
    }
});

module.exports = RenderQuartree;

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
        //# sourceMappingURL=render_quartree.js.map
        
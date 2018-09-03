"use strict";
cc._RF.push(module, '05dbf/7Rm1KzZ5MTHPtklRa', 'player');
// scripts/player.js

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

cc.Class({
    extends: cc.Component,

    properties: {
        // 主角跳跃高度
        jumpHeight: 0,
        // 主角跳跃持续时间
        jumpDuration: 0,
        // 最大移动速度
        maxMoveSpeed: 0,
        // 加速度
        accel: 0
    },

    // LIFE-CYCLE CALLBACKS:

    onKeyDown: function onKeyDown(event) {
        // set a flag when key pressed
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                this.accLeft = true;
                break;
            case cc.macro.KEY.d:
                this.accRight = true;
                break;
            case cc.macro.KEY.w:
            case cc.macro.KEY.up:

                this.accUp = true;
                break;
            case cc.macro.KEY.s:
                this.accDown = true;
                break;
        }
    },
    onKeyUp: function onKeyUp(event) {
        // unset a flag when key released
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                this.accLeft = false;
                break;
            case cc.macro.KEY.d:
                this.accRight = false;
                break;
            case cc.macro.KEY.w:
                this.accUp = false;
                break;
            case cc.macro.KEY.s:
                this.accDown = false;
                break;
        }
    },
    onLoad: function onLoad() {
        // 初始化跳跃动作
        //this.jumpAction = this.setJumpAction();
        //this.node.runAction(this.jumpAction);

        // 加速度方向开关
        this.accLeft = false;
        this.accRight = false;
        this.accUp = false;
        this.accDown = false;

        this.jumping = false;

        this.collisionX = 0; //x轴是否碰撞，0：没有碰撞，-1：左方有碰撞，1：右方有碰撞
        this.collisionY = 0;

        this.touchingNumber = 0; //同时碰撞物体的个数

        // 主角当前水平方向速度
        this.xSpeed = 0;
        this.ySpeed = 0;

        cc.log("player onLoad:", this);

        this.rigidbody = this.node.getComponent(cc.RigidBody);
        this.rigidbody.linearDamping = 0.1;

        // 初始化键盘输入监听
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        this.node.on('direction', function (event) {
            console.log('Hello!direction');
        });

        this.node.on('attack', function (event) {
            console.log('Hello!attack');
        });

        this.label = this.node.getChildByName("dis");
    },
    start: function start() {},
    update: function update(dt) {
        // 根据当前加速度方向每帧更新速度
        // 如果没有按下则减速

        var lastLinearVelocity = this.rigidbody.linearVelocity;

        if (this.accLeft) {
            lastLinearVelocity.x -= this.accel * dt;
        } else if (this.accRight) {
            lastLinearVelocity.x += this.accel * dt;
        }

        // this.rigidbody.gravityScale = 0;
        // if (this.accUp) {
        //     lastLinearVelocity.y += this.accel * dt;
        // } else if (this.accDown) {
        //     lastLinearVelocity.y -= this.accel * dt;
        // }

        if (this.accUp && !this.jumping) {
            lastLinearVelocity.y -= cc.director.getPhysicsManager().gravity.y;
            this.jumping = true;
        }

        this.rigidbody.linearVelocity = lastLinearVelocity;

        this.label ? this.label.string = this.node.x + " \n" + this.node.y + " \n  " + this.rigidbody.linearVelocity.x + "\n " + this.rigidbody.linearVelocity.y : "";

        // 计算方位，通知 map 进行刷新
        this.node.lastGamePosition = this.node.gamePosition ? this.node.gamePosition : [0, 5];
        this.node.gamePosition = [util.pixel2AbsoluteBlockId_W(this.node.x / 16), util.pixel2AbsoluteBlockId_H(this.node.y / 16)];

        this.node.lastChunk = this.node.currChunk ? this.node.currChunk : [0, 0];
        this.node.currChunk = [util.pixel2ChunkId_W(this.node.x), util.pixel2ChunkId_W(this.node.y)];

        if (Math.abs(this.node.currChunk[0] - this.node.lastChunk[0]) > 0 || Math.abs(this.node.currChunk[1] - this.node.lastChunk[1]) > 0) {
            this.node.reflushMap();
        }
    },
    onDestroy: function onDestroy() {
        // 取消键盘输入监听
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },


    // 只在两个碰撞体开始接触时被调用一次
    onBeginContact: function onBeginContact(contact, selfCollider, otherCollider) {
        this.jumping = false;
    },


    // 只在两个碰撞体结束接触时被调用一次
    onEndContact: function onEndContact(contact, selfCollider, otherCollider) {},


    // 每次将要处理碰撞体接触逻辑时被调用
    onPreSolve: function onPreSolve(contact, selfCollider, otherCollider) {},


    // 每次处理完碰撞体接触逻辑时被调用
    onPostSolve: function onPostSolve(contact, selfCollider, otherCollider) {}
});

cc._RF.pop();
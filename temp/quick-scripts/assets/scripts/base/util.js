(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/base/util.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '26028GivI9DGbVGfupJDJve', 'util', __filename);
// scripts/base/util.js

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Util = function () {
    function Util() {
        _classCallCheck(this, Util);

        this.BLOCK_WIDTH = 16;
        this.BLOCK_HEIGHT = 16;
        this.BLOCK_PER_CHUNK_WIDTH = 16;
        this.BLOCK_PER_CHUNK_HEIGHT = 16;
        this.CHUNK_WIDTH = this.BLOCK_WIDTH * this.BLOCK_PER_CHUNK_WIDTH;
        this.CHUNK_HEIGHT = this.BLOCK_HEIGHT * this.BLOCK_PER_CHUNK_HEIGHT;
    }
    // 方块包含的像素


    // Chunk包含的方块数


    // Chunk包含的像素


    _createClass(Util, [{
        key: "pixel2ChunkId_W",
        value: function pixel2ChunkId_W(pixel) {
            return parseInt(pixel / this.CHUNK_WIDTH);
        }
    }, {
        key: "pixel2ChunkId_H",
        value: function pixel2ChunkId_H(pixel) {
            return parseInt(pixel / this.CHUNK_HEIGHT);
        }
    }, {
        key: "chunkId2Pixel_W",
        value: function chunkId2Pixel_W(chunkId) {
            return parseInt(chunkId * this.CHUNK_WIDTH);
        }
    }, {
        key: "chunkId2Pixel_H",
        value: function chunkId2Pixel_H(chunkId) {
            return parseInt(chunkId * this.CHUNK_HEIGHT);
        }
    }, {
        key: "pixel2AbsoluteBlockId_W",
        value: function pixel2AbsoluteBlockId_W(pixel) {
            return parseInt(pixel / this.BLOCK_WIDTH);
        }
    }, {
        key: "pixel2AbsoluteBlockId_H",
        value: function pixel2AbsoluteBlockId_H(pixel) {
            return parseInt(pixel / this.BLOCK_HEIGHT);
        }
    }, {
        key: "absoluteBlockId2Pixel_W",
        value: function absoluteBlockId2Pixel_W(chunkId) {
            return parseInt(chunkId * this.BLOCK_WIDTH);
        }
    }, {
        key: "absoluteBlockId2Pixel_H",
        value: function absoluteBlockId2Pixel_H(chunkId) {
            return parseInt(chunkId * this.BLOCK_HEIGHT);
        }
    }]);

    return Util;
}();

exports.default = new Util();
module.exports = exports["default"];

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
        //# sourceMappingURL=util.js.map
        
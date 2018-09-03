(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/serverSimulation/map_data_chunk.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '268ddfF8JBAf5RUo5Ws+vBz', 'map_data_chunk', __filename);
// scripts/serverSimulation/map_data_chunk.js

"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var util = require("../base/util");
var MapDataQuartree = require("./map_data_quartree");

module.exports = function () {
    function MapDataChunk(x, y, data, parent) {
        _classCallCheck(this, MapDataChunk);

        this.x = x;
        this.y = y;
        this.map = parent;
        this.name = util.getChunkName(x, y);
        this.pixelRect = util.getChunkRect(x, y);

        if (data) {
            this.load(data);
        } else {
            this.init();
        }
    }

    _createClass(MapDataChunk, [{
        key: "load",
        value: function load(data) {
            this.quartree = new MapDataQuartree(null, null, data.quartree, this, this.map);
            this.quartree.ifEntity();
        }
    }, {
        key: "dump",
        value: function dump() {
            var data = {};

            data.x = this.x;
            data.y = this.y;
            data.pixelRect = this.pixelRect;
            data.name = this.name;
            data.type = util.DATATYPE.CHUNK;
            data.quartree = this.quartree.dump();

            return data;
        }
    }, {
        key: "init",
        value: function init() {
            this.quartree = new MapDataQuartree(util.CHUNK_QUARTREE_DEPTH, this.pixelRect, null, this, this.map);
            this.quartree.ifEntity();
        }
    }]);

    return MapDataChunk;
}();

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
        //# sourceMappingURL=map_data_chunk.js.map
        
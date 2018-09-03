const util = require("../base/util");
const MapDataQuartree = require("./map_data_quartree");

module.exports = class MapDataChunk {
    constructor(x, y, data, parent) {
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

    load(data) {
        this.quartree = new MapDataQuartree(null, null, data.quartree, this, this.map);
        this.quartree.ifEntity();
    }

    dump() {
        let data = {};

        data.x = this.x;
        data.y = this.y;
        data.pixelRect = this.pixelRect;
        data.name = this.name;
        data.type = util.DATATYPE.CHUNK;
        data.quartree = this.quartree.dump();

        return data;
    }

    init() {
        this.quartree = new MapDataQuartree(util.CHUNK_QUARTREE_DEPTH, this.pixelRect ,null, this, this.map);
        this.quartree.ifEntity();
    }
};
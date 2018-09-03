const util = require("../base/util");

module.exports = class MapDateQuarTree {

    constructor(n, pixelRect, data, parent, map) {
        this.parent = parent;
        this.map = map;
        if (data) {
            this.load(data);
        }
        else {
            this.init(n, pixelRect);
        }
    }

    init(n, pixelRect) {
        this.n = n;
        this.pixelRect = pixelRect;

        if (n > 0) {
            this.lu = new MapDateQuarTree(
                n - 1,
                [
                    pixelRect[0] - pixelRect[2] / 4,
                    pixelRect[1] + pixelRect[3] / 4,
                    pixelRect[2] / 2,
                    pixelRect[3] / 2
                ],
                null,
                this,
                this.map
            );
            this.ld = new MapDateQuarTree(
                n - 1,
                [
                    pixelRect[0] - pixelRect[2] / 4,
                    pixelRect[1] - pixelRect[3] / 4,
                    pixelRect[2] / 2,
                    pixelRect[3] / 2
                ],
                null,
                this,
                this.map
            );
            this.ru = new MapDateQuarTree(
                n - 1,
                [
                    pixelRect[0] + pixelRect[2] / 4,
                    pixelRect[1] + pixelRect[3] / 4,
                    pixelRect[2] / 2,
                    pixelRect[3] / 2
                ],
                null,
                this,
                this.map
            );
            this.rd = new MapDateQuarTree(
                n - 1,
                [
                    pixelRect[0] + pixelRect[2] / 4,
                    pixelRect[1] - pixelRect[3] / 4,
                    pixelRect[2] / 2,
                    pixelRect[3] / 2
                ],
                null,
                this,
                this.map
            );

            this.entity = this.ifEntity();
        } else {
            let h = this.map.getPerlin(pixelRect[0] / util.BLOCK_WIDTH);
            if ((pixelRect[1] / util.BLOCK_HEIGHT) <= h) {
                this.block = true;
                this.entity = true;
            } else {
                this.block = false;
                this.entity = false;
            }
        }
    }

    load(data) {
        this.n = data.n;
        this.pixelRect = data.pixelRect;

        if (data.n > 0) {
            this.lu = new MapDateQuarTree(null, null, data.lu, this, this.map);
            this.ld = new MapDateQuarTree(null, null, data.ld, this, this.map);
            this.ru = new MapDateQuarTree(null, null, data.ru, this, this.map);
            this.rd = new MapDateQuarTree(null, null, data.rd, this, this.map);
        } else {
            this.entity = data.entity;
            this.block = data.block;
        }
    }

    /* 等到用到的時候再去計算 */
    ifEntity() {
        /* 判斷 entity 屬性是否存在 */
        if (null === this.entity || undefined === this.entity) {
            //cc.log(`${" ".repeat(this.n)}${this.n} ${this.pixelRect[0]}, ${this.pixelRect[1]} noentity`);
            /* 如果不存在就去子組件中獲取 */
            if (null !== this.block && undefined !== this.block) {
                if (this.block) {
                    //cc.log(`${" ".repeat(this.n)}${this.n} ${this.pixelRect[0]}, ${this.pixelRect[1]} block on`);
                    this.entity = true;
                } else {
                    //cc.log(`${" ".repeat(this.n)}${this.n} ${this.pixelRect[0]}, ${this.pixelRect[1]} block off`);

                    this.entity = false;
                }
            }
            else {
                this.entity = this.lu.ifEntity()
                    && this.ld.ifEntity()
                    && this.ru.ifEntity()
                    && this.rd.ifEntity();
                //cc.log(`${" ".repeat(this.n)}${this.n} ${this.pixelRect[0]}, ${this.pixelRect[1]} get sub ${this.entity}`);
            }
        }

        return this.entity;
    }

    dump() {
        let data = {};

        data.type = util.DATATYPE.QUARTREE;
        data.pixelRect = this.pixelRect;
        data.n = this.n;

        if (this.n > 0) {
            data.lu = this.lu.dump();
            data.ld = this.ld.dump();
            data.ru = this.ru.dump();
            data.rd = this.rd.dump();
        }
        else {
            data.block = this.block;
        }

        data.entity = this.entity;

        return data;
    }

};
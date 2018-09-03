
var Util =
{
    // 方块包含的像素
    BLOCK_WIDTH : 16,
    BLOCK_HEIGHT :16,

    // Chunk包含的方块数
    BLOCK_PER_CHUNK_WIDTH : 16,
    BLOCK_PER_CHUNK_HEIGHT : 16,

    // Chunk包含的像素
    get CHUNK_WIDTH() {
        return this.BLOCK_WIDTH * this.BLOCK_PER_CHUNK_WIDTH;
    },
    get CHUNK_HEIGHT() { 
        return this.BLOCK_HEIGHT * this.BLOCK_PER_CHUNK_HEIGHT;
    },

    // Chunk的四叉樹深度, 注意和方塊數聯動！！！！
    CHUNK_QUARTREE_DEPTH : 4,
    
    pixel2ChunkId_W (pixel) {
        return parseInt( pixel / this.CHUNK_WIDTH );
    },

    pixel2ChunkId_H (pixel) {
        return parseInt( pixel / this.CHUNK_HEIGHT );
    },

    chunkId2Pixel_W (chunkId) {
        return parseInt( chunkId * this.CHUNK_WIDTH );
    },

    chunkId2Pixel_H (chunkId) {
        return parseInt( chunkId * this.CHUNK_HEIGHT );
    },

    pixel2AbsoluteBlockId_W (pixel) {
        return parseInt( pixel / this.BLOCK_WIDTH );
    },

    pixel2AbsoluteBlockId_H (pixel) {
        return parseInt( pixel / this.BLOCK_HEIGHT );
    },

    absoluteBlockId2Pixel_W (chunkId) {
        return parseInt( chunkId * this.BLOCK_WIDTH );
    },

    absoluteBlockId2Pixel_H (chunkId) {
        return parseInt( chunkId * this.BLOCK_HEIGHT );
    },

    getChunkName(x, y) {
        return `${x}|${y}`;
    },

    getChunkRect(x, y) {
        return [
            this.chunkId2Pixel_W(x),
            this.chunkId2Pixel_H(y),
            this.CHUNK_WIDTH,
            this.CHUNK_HEIGHT
        ]
    },

    DATATYPE : {
        CHUNK : Symbol("Chunk"),
        QUARTREE : Symbol("Quartree"),
        BLOCK : Symbol("Block"),
    }

}

 module.exports =  Util
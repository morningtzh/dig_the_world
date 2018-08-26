
class Util
{
    // 方块包含的像素
    BLOCK_WIDTH = 16;
    BLOCK_HEIGHT = 16;

    // Chunk包含的方块数
    BLOCK_PER_CHUNK_WIDTH = 16;
    BLOCK_PER_CHUNK_HEIGHT = 16;

    // Chunk包含的像素
    CHUNK_WIDTH = this.BLOCK_WIDTH * this.BLOCK_PER_CHUNK_WIDTH;
    CHUNK_HEIGHT = this.BLOCK_HEIGHT * this.BLOCK_PER_CHUNK_HEIGHT;
    
    pixel2ChunkId_W (pixel) {
        return parseInt( pixel / this.CHUNK_WIDTH );
    }

    pixel2ChunkId_H (pixel) {
        return parseInt( pixel / this.CHUNK_HEIGHT );
    }

    chunkId2Pixel_W (chunkId) {
        return parseInt( chunkId * this.CHUNK_WIDTH );
    }

    chunkId2Pixel_H (chunkId) {
        return parseInt( chunkId * this.CHUNK_HEIGHT );
    }

    pixel2AbsoluteBlockId_W (pixel) {
        return parseInt( pixel / this.BLOCK_WIDTH );
    }

    pixel2AbsoluteBlockId_H (pixel) {
        return parseInt( pixel / this.BLOCK_HEIGHT );
    }

    absoluteBlockId2Pixel_W (chunkId) {
        return parseInt( chunkId * this.BLOCK_WIDTH );
    }

    absoluteBlockId2Pixel_H (chunkId) {
        return parseInt( chunkId * this.BLOCK_HEIGHT );
    }

}

export default new Util();
/**
 * 坐标表示
 */
export default class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * 创建坐标
     * @param {*} x 
     * @param {*} y 
     */
    static create(x, y) {
        return new Point(x, y);
    }

    /**
     * 坐标相加
     * @param {Point} p1 
     * @param {Point} p2 
     */
    static add(p1, p2) {
        return new Point(p1.x + p2.x, p1.y + p2.y);
    }

    /**
     * 坐标相减
     * @param {Point} p1 减数
     * @param {Point} p2 被减数
     */
    static sub(p1, p2) {
        return new Point(p1.x - p2.x, p1.y - p2.y);
    }

    /**
     * 一组坐标增加偏移量
     * @param {*} arr 
     * @param {*} offset 
     */
    static pointsAddOffset(arr, offset) {
        return arr.map(it => {
            return new Point(it.x - (offset.x || 0), it.y - (offset.y || 0));
        });
    }
}
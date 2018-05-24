export default class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static create(x, y) {
        return new Point(x, y);
    }
}
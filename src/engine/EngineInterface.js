export default class EngineInterface {
    /**
     * 绘制线段
     * @param {Point} start 起点
     * @param {Point} end 终点
     * @param {Object} options 配置项 
     */
    line (start, end, options) {};

    /**
     * 绘制圆
     * @param {Point} center 中心点
     * @param {Double} radius 半径
     * @param {Object} options 配置项 
     */
    circle (center, radius, options) {}

    /**
     * 
     * @param {Double} x 
     * @param {Double} y 
     * @param {Double} w 宽
     * @param {Double} h 高
     * @param {Object} options 配置项 
     */
    rect(x, y, w, h, options) {}

    /**
     * 
     * @param {Double} x 
     * @param {Double} y 
     * @param {Object} options 配置项 
     */
    text(x, y, text, options) {}

    /**
     * 绘制多边形
     * @param {Array} points 顶点集合 
     * @param {Object} options 配置项 
     */
    polygon (points, options) {}

    /**
     * 绘制椭圆
     * @param {Double} x 中心点
     * @param {Double} y 中心点
     * @param {Double} a 长半轴
     * @param {Double} b 短半轴
     * @param {Object} options 配置项 
     */
    ellipse(x, y, a, b, options) {}

}
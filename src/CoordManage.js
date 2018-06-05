
import Point from './Point';

/**
 * 坐标管理器
 */
export default class CoordManage {
    constructor(model) {
        this.model = model;
        // 虚拟坐标起点
        this.startPoint = Point.create(0, 0);
    }

    /**
     * 修改虚拟坐标起点
     * @param {*} p 
     */
    changeStartPoint(p) {
        this.startPoint = p;
    }

    /**
     * 将点坐标转换成画布上真实坐标
     * @param {*} p 
     */
    pointToCanvasCoord(p) {
        return Point.sub(p, this.startPoint);
    }

    /**
     * 将点坐标转换成虚拟坐标
     * @param {*} p 
     */
    pointToVirtualCoord(p) {
        return Point.add(p, this.startPoint);
    }

    /**
     * 将一组坐标转换成画布上真实坐标
     * @param {Array} arr 
     */
    pointsToCanvasCoord(arr) {
        const result = [];
        (arr || []).forEach(p => {
            result.push(Point.sub(p, this.startPoint));
        });
        return result;
    }

    /**
     * 将一组坐标转换成虚拟坐标
     * @param {Array} arr 
     */
    pointsToVirtualCoord(p) {
        const result = [];
        (arr || []).forEach(p => {
            result.push(Point.add(p, this.startPoint));
        })
        return result;
    }
}
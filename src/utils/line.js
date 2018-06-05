import Util from './index';
import inside from 'point-in-polygon';

export default {
    getLinkCtrlPoints(startPoint, endPoint, startSize, endSize) {
        const extra = 10;
        const start = {
            x: startPoint.x,
            y: startPoint.y
        };
        const end = {
            x: endPoint.x,
            y: endPoint.y
        };
        // 测试点x
        const testX = (end.x > start.x) ? start.x + 1 : start - 1;
        // 测试点y
        const testY = (end.y - start.y) / (end.x - start.x) * testX;
        // 垂直连线
        if (start.x === end.x) {
            return [[startPoint.x, startPoint.y], [endPoint.x, endPoint.y]];
        }
        const startSide = Util.getPointInRectSide(startPoint, startSize);
        const endSide = Util.getPointInRectSide(endPoint, endSize);

        const result = [[startPoint.x, startPoint.y]];
        if (startSide === 1 && endSide === 0) {
            if (end.x > start.x) {
                let lastPoint = [end.x, start.y];
                if (inside(lastPoint, Util.getPointsFromRect(endSize.x, endSize.y, endSize.w, endSize.h))) {
                    lastPoint = [endSize.x - extra, start.y];
                    result.push([lastPoint[0], lastPoint[1]]);
                    if (end.y > start.y) {
                        lastPoint = [lastPoint[0], end.y + extra];
                        result.push([lastPoint[0], lastPoint[1]]);
                        
                        lastPoint = [end.x, lastPoint[1]];
                        result.push([lastPoint[0], lastPoint[1]]);
                    } else {
                        lastPoint = [lastPoint[0], end.y - extra];
                        result.push([lastPoint[0], lastPoint[1]]);
                        
                        lastPoint = [end.x, lastPoint[1]];
                        result.push([lastPoint[0], lastPoint[1]]);
                    }
                    
                } else {
                    result.push(lastPoint);
                }
            } else {
                let lastPoint = [start.x + extra, start.y];
                result.push([lastPoint[0], lastPoint[1]]);
                if (end.y > start.y) {
                    lastPoint = [lastPoint[0], end.y - extra];
                    result.push([lastPoint[0], lastPoint[1]]);
                    result.push([end.x, end.y - extra]);
                } else {
                    lastPoint = [lastPoint[0], end.y - extra];
                    result.push([lastPoint[0], lastPoint[1]]);
                    result.push([end.x, end.y - extra]);
                }
                result.push([end.x, result[result.length - 1][1]]);
            }
        } else if (startSide === 2 && endSide === 0) {
            if (end.y > start.y) {
                let lastPoint = [start.x, start.y + extra];
                result.push([lastPoint[0], lastPoint[1]]);
                result.push([end.x, lastPoint[1]]);
            } else {
                let lastPoint = [start.x, start.y + extra];
                result.push([lastPoint[0], lastPoint[1]]);
                lastPoint = [end.x, lastPoint[1]];
                if (inside(lastPoint, Util.getPointsFromRect(endSize.x, endSize.y, endSize.w, endSize.h))) {
                    lastPoint = [endSize.x - extra, lastPoint[1]];
                    result.push([lastPoint[0], lastPoint[1]]);
                    result.push([lastPoint[0], end.y - extra]);
                    result.push([end.x, end.y - extra]);
                } else {
                    result.push([lastPoint[0], lastPoint[1]]);
                }
            }
        }

        result.push([endPoint.x, endPoint.y]);
        return result;
    }
}
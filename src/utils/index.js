const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

/**
 * 获取文本宽带
 * @param {String} text 
 * @param {String} style 
 */
function getTextWidth(text, style = '12px') {
    return ctx.measureText(text, style).width;
}

/**
 * 从矩形表示中，获取四个顶点坐标
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} w 
 * @param {Number} h 
 */
function getPointsFromRect(x, y, w, h) {
    return [
        [x, y],
        [x + w, y],
        [x + w, y + h],
        [x, y + h]
    ]
}

/**
 * 为顶点坐标结合添加偏移
 * @param {Array} points 
 * @param {Object} offset 
 */
function addOffsetToPolygon(points, offset) {
    return points.map(it => {
        it[0] += offset.x;
        it[1] += offset.y;
        return it;
    });
}

/**
 * 从矩形表示中，获取四个顶点坐标
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} w 
 * @param {Number} h 
 */
function getdiamondPoints(x, y, w, h) {
    return [
        [x, y - h / 2],
        [x + w / 2, y],
        [x, y + h / 2],
        [x - w / 2, y]
    ];
}

/**
 * 获取点在矩形的那条边
 * @param {*} point 
 * @param {*} rect 
 */
function getPointInRectSide(point, rect) {
    const x = point.x;
    const y = point.y;
    const w = rect.w;
    const h = rect.h;
    if (x > rect.x + w) {
        return false;
    }
    if (x < rect.x) {
        return false;
    }
    if (y > rect.y + h) {
        return false;
    }
    if (y < rect.y) {
        return false;
    }
    if (x > rect.x && x < rect.x + w) {
        if (y === rect.y) {
            return 0;
        } else if (y === rect.y + h) {
            return 2;
        }
    }
    if (y > rect.y && y < rect.y + h) {
        if (x === rect.x) {
            return 3;
        } else if (x === rect.x + w) {
            return 1;
        }
    }
    return false;
}

export default {
    getTextWidth,
    getPointsFromRect,
    addOffsetToPolygon,
    getdiamondPoints,
    getPointInRectSide
};
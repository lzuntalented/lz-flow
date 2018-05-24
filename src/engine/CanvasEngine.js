import EngineInterface from './EngineInterface';
export default class CanvasEngine extends EngineInterface {
    constructor(context) {
        super();
        this.ctx = context;
    }

    /**
     * 绘制线段
     * @param {Point} start 起点
     * @param {Point} end 终点
     * @param {Object} options 配置项 
     */
    line (start, end, options) {
        const ctx = this.ctx;
        this.checkOptions(options);
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        this.afterDoDraw(options);
    };

    /**
     * 绘制圆
     * @param {Point} center 中心点
     * @param {Double} radius 半径
     * @param {Object} options 配置项 
     */
    circle (center, radius, options) {
        const ctx = this.ctx;
        this.checkOptions(options);
        ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
        this.afterDoDraw(options);
    }

    /**
     * 
     * @param {Double} x 
     * @param {Double} y 
     * @param {Double} w 宽
     * @param {Double} h 高
     * @param {Object} options 配置项 
     */
    rect(x, y, w, h, options) {
        const ctx = this.ctx;
        this.checkOptions(options);
        ctx.rect(x, y, w, h);
        this.afterDoDraw(options);
    }

    /**
     * 
     * @param {Double} x 
     * @param {Double} y 
     * @param {Object} options 配置项 
     */
    text(x, y, text, options) {
        const ctx = this.ctx;
        this.checkOptions(options);
        let method = 'fillText';
        if (options.stroke) {
            method = 'strokeText';
        }
        ctx[method](x, y, text);
        this.afterDoDraw(options);
    }

    /**
     * 绘制多边形
     * @param {Array} points 顶点集合 
     * @param {Object} options 配置项 
     */
    polygon (points, options) {
        const ctx = this.ctx;
        this.checkOptions(options);
        points.forEach((it, idx) => {
            if (idx === 0) {
                ctx.moveTo(it.x, it.y);
            } else {
                ctx.lineTo(it.x, it.y);
            }
        });
        this.afterDoDraw(options);
    }

    /**
     * 绘制椭圆
     * @param {Double} x 中心点
     * @param {Double} y 中心点
     * @param {Double} a 长半轴
     * @param {Double} b 短半轴
     * @param {Object} options 配置项 
     */
    ellipse(x, y, a, b, options) {
        const context = this.ctx;
        this.checkOptions(options);
        //关键是bezierCurveTo中两个控制点的设置
        //0.5和0.6是两个关键系数（在本函数中为试验而得）
        const ox = 0.5 * a;
        const oy = 0.6 * b;

        context.save();
        context.translate(x, y);
        // context.beginPath();
        //从椭圆纵轴下端开始逆时针方向绘制
        context.moveTo(0, b); 
        context.bezierCurveTo(ox, b, a, oy, a, 0);
        context.bezierCurveTo(a, -oy, ox, -b, 0, -b);
        context.bezierCurveTo(-ox, -b, -a, -oy, -a, 0);
        context.bezierCurveTo(-a, oy, -ox, b, 0, b);
        this.afterDoDraw(options);
    }

    checkOptions(options) {
        const ctx = this.ctx;
        if (options.save !== false) {
            ctx.save();
        }
        if(options.stroke) {
            ctx.strokeStyle = options.stroke;
        }
        if(options.fill) {
            ctx.fillStyle = options.fill;
        }
        if(options.lineWidth) {
            ctx.lineWidth = options.lineWidth;
        }
        if(options.dash) {
            ctx.setLineDash(options.dash);
        }
        if(options.beginPath !== false) {
            ctx.beginPath();
        }
    }

    afterDoDraw(options) {
        const ctx = this.ctx;
        
        if(options.stroke) {
            ctx.stroke();
        }
        if(options.fill) {
            ctx.fill();
        }
        if(options.closePath !== false) {
            ctx.closePath();
        }
        if (options.restore !== false) {
            ctx.restore();
        }
    }
}
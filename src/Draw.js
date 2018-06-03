/*
 * Created on Tue May 01 2018
 *
 * Copyright (c) 2018 Your Company
 */
import inside from 'point-in-polygon';

import Constants from './Constants';
import EventHandler from './EventHandler';
import Util from './utils';
import Engine from './engine/CanvasEngine';
import CoordManage from './CoordManage';
import Point from './Point';

export default class Draw {
    constructor(container, model, height) {
        this.container = container;
        this.model = model;
        this.mCoordManage = this.model.get(Constants.instance.corrdManage);
        this.height = height;
        this.initVars();
        this.initDom();
    }

    /**
     * 初始化变量
     */
    initVars() {
        this.defautShape = [
            Constants.defautShape.rect,
            Constants.defautShape.text,
            Constants.defautShape.polygon
        ];
        this.startPoint = {
            x: 0,
            y: 0   
        };
    }

    /**
     * 初始化dom元素
     */
    initDom() {
        const width = this.container.clientWidth;
        const height = this.height || this.container.clientHeight;
        this.containerSize = {
            width,
            height
        }

        const canvasContainer = document.createElement('div');
        canvasContainer.style.position = 'relative';
        this.container.appendChild(canvasContainer);
        
        // 显示面板
        const showCanvas = document.createElement('canvas');
        // 编辑面板
        const editCanvas = document.createElement('canvas');

        showCanvas.width = width;
        showCanvas.height = height;
        editCanvas.width = width;
        editCanvas.height = height;
        editCanvas.style.position = 'absolute';
        editCanvas.style.top = '0px';
        editCanvas.style.left = '0px';

        canvasContainer.appendChild(showCanvas);
        canvasContainer.appendChild(editCanvas);

        // 设置绘画实例
        const showCtx = showCanvas.getContext('2d');
        const editCtx = editCanvas.getContext('2d');
        this.showCtx = showCtx;
        this.editCtx = editCtx;
        this.showEngine = new Engine(showCtx);
        this.editEngine = new Engine(editCtx);

        // 画布尺寸
        this.size = {
            width,
            height
        };

        // 事件系统
        this.initEventHandler(canvasContainer);
    }

    /**
     * 初始化事件系统
     * @param {} container 
     */
    initEventHandler(container) {
        this.mEventHandler = new EventHandler(container, this);
    }

    render() {
        const gm = this.model.get(Constants.instance.groupManage);
        const groups = gm.getList();
        const nodes = this.model.get(Constants.groupNodes) || {};
        // const lines = this.model.get(Constants.groupLines) || [];

        // nodes.forEach(it => {
        //     it.render(this.showCtx);
        // });
        console.log(groups);
        // 先绘制连线
        groups.forEach(it => {
            if (it.type !== Constants.groupType.line) {
                return ;
            }
            const cfg = it.config;
            const source = nodes[it.config.sourceId];
            const target = nodes[it.config.targetId];
            const sourceIdx = cfg.sourceAnchor || 0;
            const targetIdx = cfg.targetAnchor || 0;
            const startPoint = source.anchorPoints[sourceIdx];
            const endPoint = target.anchorPoints[targetIdx];
            const points = this.getLinkCtrlPoints(startPoint, endPoint, source.size, target.size);
            this.drawLinkLines(this.showCtx, points);
        });

        // 绘制节点
        groups.forEach(it => {
            if (it.type === Constants.groupType.line) {
                return ;
            }
            for(const key in it.list) {
                const value = it.list[key];
                if (this.defautShape.indexOf(key) > -1) {
                    this.drawDefaultShape(this.showEngine, key, value, it.config);
                }
            }
            this.drawAnchorPoint(this.editCtx, it.anchorPoints);
        });

        this.renderDefaultEditItem();
    }

    /**
     * 绘制编辑模式下编辑内容
     */
    renderDefaultEditItem() {
        const list = this.model.get(Constants.groupEditList, []);
        list.forEach((it, idx) => {
            for(const key in it.list) {
                const value = it.list[key];
                if (this.defautShape.indexOf(key) > -1) {
                    const config = it.config;
                    config.x = 50;
                    config.y = idx * 60 + 30;
                    this.drawDefaultShape(this.editEngine, key, value, it.config, {x: 0, y:0});
                }
            }
        });

        this.drawLine(this.editCtx, {
            x: 100,
            y: 0,
        },{
            x: 100,
            y: this.height,
        });
    }

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

    /**
     * 重定向画布中心点
     * @param {*} point 
     */
    forceCenter(point) {
        const width = this.containerSize.width;
        const height = this.containerSize.height;

        this.showCtx.clearRect(0, 0, width, height);
        this.editCtx.clearRect(0, 0, width, height);

        this.startPoint = {
            x: point.x - width / 2,
            y: point.y - height / 2
        };
    }

    clearPanel() {
        const width = this.containerSize.width;
        const height = this.containerSize.height;
        this.showCtx.clearRect(0, 0, width, height);
        this.editCtx.clearRect(0, 0, width, height);
    }

    drawRect(ctx, x, y, w, h) {
        ctx.drawRect(ctx, x, y, w, h);
    }

    /**
     * 绘制默认图形
     * @param {*} ctx 
     * @param {*} shape 
     * @param {*} config 
     * @param {*} groupConfig 
     */
    drawDefaultShape(ctx, shape, config, groupConfig, defaultStart) {
        const point = this.mCoordManage.pointToCanvasCoord(groupConfig);
        
        const groupX = defaultStart ? groupConfig.x - defaultStart.x : point.x;
        const groupY = defaultStart ? groupConfig.y - defaultStart.y : point.y;
         
        const cfg = config.attr;
        const option = Object.assign({}, config.attr);
        if (shape === Constants.defautShape.rect) {
            ctx.rect(groupX + cfg.x, groupY + cfg.y, cfg.width, cfg.height, option);
            // ctx.save();
            // ctx.beginPath();
            // ctx.strokeStyle = cfg.stroke;
            // ctx.fillStyle = cfg.fill;
            // ctx.rect(groupX + cfg.x, groupY + cfg.y, cfg.width, cfg.height);
            // ctx.closePath();
            // ctx.stroke();
            // ctx.fill();
            // ctx.restore();
        } else if (shape === Constants.defautShape.text) {
            const fontFamily = 'Arial';
            option.font = (cfg.fontSize || 12) + 'px' + (' ' + (cfg.fontFamily || fontFamily));
            ctx.text(groupX + cfg.x, groupY + cfg.y, cfg.label, option);
            // ctx.save();
            // ctx.beginPath();
            // ctx.font = (cfg.fontSize || 12) + 'px' + (' ' + (cfg.fontFamily || fontFamily));
            // ctx.strokeStyle = cfg.stroke;
            // ctx.fillStyle = cfg.fill;
            // ctx.fillText(cfg.label, groupX + cfg.x, groupY + cfg.y);
            // ctx.closePath();
            // ctx.restore();
        } else if (shape === Constants.defautShape.polygon) {
            ctx.polygon(Point.pointsAddOffset(cfg.points, Point.create(groupX, groupY)), open);
            // ctx.save();
            // ctx.beginPath();
            // ctx.strokeStyle = cfg.stroke;
            // ctx.fillStyle = cfg.fill;
            
            // const point = cfg.points;
            // point.forEach((it, idx) => {
            //     const x = it[0] + groupX;
            //     const y = it[1] + groupY;
            //     if (idx === 0) {
            //         ctx.moveTo(x, y);
            //     } else {
            //         ctx.lineTo(x, y);
            //     }
            // });
            // ctx.closePath();
            // ctx.stroke();
            // ctx.fill();
            // ctx.restore();
        }
    }

    /**
     * 绘制控制点
     * @param {*} ctx 
     * @param {*} points 
     */
    drawAnchorPoint(ctx, points) {
        const groupX = this.startPoint.x;
        const groupY = this.startPoint.y;

        ctx.save();
        ctx.strokeStyle = '';
        ctx.fillStyle = '#FFFFFF';
        const radius = 4;
        points.forEach(it => {
            ctx.beginPath();
            ctx.arc(it.x - groupX, it.y - groupY, radius, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
        });
        ctx.restore();
    }


    drawLinkLines(ctx, points) {
        const groupX = this.startPoint.x;
        const groupY = this.startPoint.y;

        ctx.save();
        ctx.strokeStyle = '#FFFFFF';
        ctx.beginPath();
        points.forEach((it, idx) => {
            const x = it[0] - groupX;
            const y = it[1] - groupY;
            if (idx === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();
        ctx.restore();
    }

    //---------使用三次贝塞尔曲线模拟椭圆1---------------------
    //此方法也会产生当lineWidth较宽，椭圆较扁时，
    //长轴端较尖锐，不平滑的现象
    drawEllipse(context, x, y, a, b){
        //关键是bezierCurveTo中两个控制点的设置
        //0.5和0.6是两个关键系数（在本函数中为试验而得）
        var ox = 0.5 * a,
            oy = 0.6 * b;

        context.save();
        context.translate(x, y);
        context.beginPath();
        //从椭圆纵轴下端开始逆时针方向绘制
        context.moveTo(0, b); 
        context.bezierCurveTo(ox, b, a, oy, a, 0);
        context.bezierCurveTo(a, -oy, ox, -b, 0, -b);
        context.bezierCurveTo(-ox, -b, -a, -oy, -a, 0);
        context.bezierCurveTo(-a, oy, -ox, b, 0, b);
        context.closePath();
        context.stroke();
        context.restore();
    }

    drawLine(ctx, start, end) {
        ctx.save();
        ctx.strokeStyle = '#cacaca';
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        ctx.restore();
    }
}
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
import { getLinkCtrlPoints, getArrowPoints } from './utils/line';

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
            Constants.defautShape.polygon,
            Constants.defautShape.ellipse
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
        this.clearPanel();

        const gm = this.model.get(Constants.instance.groupManage);
        const groups = gm.getList();
        const nodes = this.model.get(Constants.groupNodes) || {};

        // 先绘制连线
        groups.forEach(it => {
            if (it.type !== Constants.groupType.line) {
                return ;
            }
            const cfg = it.config;
            const source = nodes[it.config.sourceId];
            const target = nodes[it.config.targetId];
            if (!source || !target) return;
            const sourceIdx = cfg.sourceAnchor || 0;
            const targetIdx = cfg.targetAnchor || 0;
            const startPoint = source.anchorPoints[sourceIdx];
            const endPoint = target.anchorPoints[targetIdx];
            const points = getLinkCtrlPoints(startPoint, endPoint, source.size, target.size);
            this.drawLinkLines(this.showEngine, points);
            this.drawLinkArrow(this.showEngine, getArrowPoints(Util.arrayPointsToPoint(points)));
            // this.drawLinkValue(this.showEngine, points);
        });

        // 绘制节点
        // groups.forEach(it => {
        //     if (it.type === Constants.groupType.line) {
        //         return ;
        //     }
        //     for(const key in it.list) {
        //         const value = it.list[key];
        //         if (this.defautShape.indexOf(key) > -1) {
        //             this.drawDefaultShape(this.showEngine, key, value, it.config);
        //         }
        //     }
        //     this.drawAnchorPoint(this.editEngine, it.anchorPoints);
        // });

        // this.renderDefaultEditItem();

        this.renderActive();
    }

    /**
     * 渲染激发状态下的节点
     */
    renderActive() {
        this.clearPanel(this.editEngine);

        const gm = this.model.get(Constants.instance.groupManage);
        const groups = gm.getList();

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
            this.drawAnchorPoint(this.editEngine, it.anchorPoints);

            if (it.active) {
                const obj = it.size;
                this.drawRect(this.editEngine, obj.x, obj.y, obj.w, obj.h);
            }
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
                    it.setPosition(Point.create(config.x, config.y));
                    this.drawDefaultShape(this.editEngine, key, value, it.config, {x: 0, y:0});
                }
            }
        });

        this.drawLine(this.editEngine, {
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

    clearPanel(ctx) {
        const width = this.containerSize.width;
        const height = this.containerSize.height;
        if (ctx) {
            ctx.clearRect(0, 0, width, height);
        } else {
            this.showEngine.clearRect(0, 0, width, height);
            this.editEngine.clearRect(0, 0, width, height);
        }
    }

    drawRect(ctx, x, y, w, h) {
        ctx.rect(x, y, w, h, { stroke: 'green' });
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
        } else if (shape === Constants.defautShape.text) {
            const fontFamily = 'Arial';
            option.font = (cfg.fontSize || 12) + 'px' + (' ' + (cfg.fontFamily || fontFamily));
            ctx.text(groupX + cfg.x, groupY + cfg.y, cfg.label, option);
        } else if (shape === Constants.defautShape.polygon) {
            const ps = [];
            cfg.points.forEach(it => {
                ps.push(Util.arrayToPoint(it));
            });
            ctx.polygon(Point.pointsAddOffset(ps, Point.create(groupX, groupY)), option);
        } else if (shape === Constants.defautShape.ellipse) {
            ctx.ellipse(groupX + cfg.x, groupY + cfg.y, cfg.a, cfg.b, option);
        }
    }

    /**
     * 绘制控制点
     * @param {*} ctx 
     * @param {*} points 
     */
    drawAnchorPoint(ctx, points) {
        const radius = 4;
        const option = {
            fill: Constants.lineStroke
        };
        points.forEach(it => {
            ctx.circle(this.mCoordManage.pointToCanvasCoord(it), radius, option);
        });
    }

    /**
     * 绘制连线
     * @param {*} ctx 
     * @param {*} points 
     */
    drawLinkLines(ctx, points) {
        const option = {
            stroke: Constants.lineStroke,
            closePath: false
        };
        const ps = [];
        points.forEach(it => {
            ps.push(Util.arrayToPoint(it));
        });
        ctx.polygon(this.mCoordManage.pointsToCanvasCoord(ps), option);
    }

    /**
     * 绘制连续的箭头
     * @param {*} ctx 
     * @param {*} points 
     */
    drawLinkArrow(ctx, points) {
        const option = {
            stroke: Constants.lineStroke,
            closePath: false
        };
        const ps = points;
        ctx.polygon(this.mCoordManage.pointsToCanvasCoord(ps), option);
    }

    drawLine(ctx, start, end) {
        const option = {
            stroke: Constants.lineStroke,
            closePath: false
        };
        ctx.polygon([start, end], option);
    }

    renderEditPanel() {

    }

    renderAnchorLinkLine(start, end, anchorType = Constants.anchorStroke.default) {
        this.clearPanel(this.editEngine);

        const gm = this.model.get(Constants.instance.groupManage);
        const groups = gm.getList();

        // 绘制节点控制点
        groups.forEach(it => {
            if (it.type === Constants.groupType.line) {
                return ;
            }
            this.drawAnchorPoint(this.editEngine, it.anchorPoints);
        });

        // 绘制编辑模式控件
        this.renderDefaultEditItem();

        const ctx = this.editEngine;
        const option = {
            stroke: anchorType,
            closePath: false
        };
        ctx.polygon([start, end], option);
    }
}
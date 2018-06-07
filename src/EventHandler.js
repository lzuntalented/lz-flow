/*
 * Created on Mon Apr 30 2018
 *
 * Copyright (c) 2018 Your Company
 */
import inside from 'point-in-polygon';
import Constants from './Constants';
import Util from './utils';
import DomUtil from './utils/dom';
import CollideManage from './CollideManage';
const getElementViewTop = DomUtil.getElementViewTop;
const getElementViewLeft = DomUtil.getElementViewLeft;

export default class EventHandler {
    constructor(container, drawHandler) {
        this.container = container;
        this.drawHandler = drawHandler;
        this.mCollideManage = new CollideManage(this.drawHandler.model);

        this.addEventListener(this.container, 'click', this.onClick.bind(this));
        this.addEventListener(this.container, 'mousedown', this.onMouseDown.bind(this));
        this.addEventListener(this.container, 'mouseup', this.onMouseUp.bind(this));
        this.addEventListener(this.container, 'mousemove', this.onMouseMove.bind(this));
        // this.addEventListener(this.container, 'click', this.onClick.bind(this));

        this.draging = false;
        this.dragObject = null;
        // 鼠标点击模式
        this.mouseDownMode = Constants.eventMode.default;
        // 鼠标点击坐标
        this.mouseDownPoint = null;
        
    }

    addEventListener(dom, type, callback) {
        dom.addEventListener(type, callback);
    }

    onClick(e) {
        console.log('click');
        const clickPoint = {
            x: e.clientX,
            y: e.clientY
        };
        // console.log(clickPoint);
        // const x = getElementViewLeft(this.container);
        // const y = getElementViewTop(this.container);
        // // console.log(x, y);

        // let realX = clickPoint.x - x;
        // let realY = clickPoint.y - y;

        // // canvas点击相对于父容器坐标
        // console.log(realX, realY);

        // const parent = this.container.parentElement;
        // realX += parent.scrollLeft;
        // realY += parent.scrollTop;

        // // canvas点击的真实坐标
        // console.log(realX, realY);

        // const startPoint = this.drawHandler.startPoint;
        // realX += startPoint.x;
        // realY += startPoint.y;

        // console.log(realX, realY);
        // this.sendItemClick([realX, realY]);
        // const 

        const p = this.getPointObject(clickPoint);
        if (this.checkPointInGroup([p.coordPoint.x, p.coordPoint.y])) {
            console.log('in group');
        }
    }

    sendItemClick(point) {
        const list = this.drawHandler.model.get(Constants.groupList, []);

        let clickItem;
        for(let len = list.length, i = len - 1; i >= 0; --i) {
            const it = list[i].list;
            for (const j in it) {
                if (inside(point, it[j].polygonPoints)) {
                    clickItem = it;
                    break;
                }
            }
            if (clickItem) break;
        }
        console.log(clickItem);
    }

    /**
     * 检测点是否在控制点上
     * @param {} arrPoint 
     */
    checkPointInAnchor(arrPoint) {
        const list = this.drawHandler.model.get(Constants.groupList, []);

        let clickItem;
        for(let len = list.length, i = len - 1; i >= 0; --i) {
            const it = list[i];
            if (it.anchorPoints) {
                for(let j = 0; j < it.anchorPoints.length; ++j) {
                    if (Util.inCircle(arrPoint, it.anchorPoints[j], 4)) {
                        console.log('in anchor' , it);
                        return it;
                    }
                }
            }
        }
        return false;
    }

    /**
     * 检测点是否在节点上
     */
    checkPointInGroup(arrPoint) {
        const list = this.drawHandler.model.get(Constants.groupList, []);

        let clickItem;
        for(let len = list.length, i = len - 1; i >= 0; --i) {
            const it = list[i].list;
            for (const j in it) {
                if (inside(arrPoint, it[j].polygonPoints)) {
                    return list[i];
                    // clickItem = it;
                    // break;
                }
            }
            // if (clickItem) break;
        }
        return false;
    }

    /**
     * 获取坐标点对象
     * @param {*} point 
     */
    getPointObject(point) {
        // const result = {

        // };
        // console.log(clickPoint);
        const x = getElementViewLeft(this.container);
        const y = getElementViewTop(this.container);
        // console.log(x, y);

        let realX = point.x - x;
        let realY = point.y - y;

        // canvas点击相对于父容器坐标
        // console.log(realX, realY);

        const domPoint = {
            x: realX,
            y: realY
        }

        // const parent = this.container.parentElement;
        // realX += parent.scrollLeft;
        // realY += parent.scrollTop;


        // canvas点击的真实坐标
        // console.log(realX, realY);

        const startPoint = this.drawHandler.startPoint;
        realX += startPoint.x;
        realY += startPoint.y;

        const coordPoint = {
            x: realX,
            y: realY
        }

        return {
            domPoint,
            coordPoint
        }
    }

    onMouseDown(e) {
        const clickPoint = {
            x: e.clientX,
            y: e.clientY
        };
        this.mouseDownPoint = clickPoint;
        this.mouseDownMode = Constants.eventMode.default;
        const p = this.getPointObject(clickPoint);

        // 检测是否点击控制点
        let obj = this.mCollideManage.checkPointInAnchor(p.coordPoint);
        if (obj) {
            this.mouseDownMode = Constants.eventMode.anchor;
            this.dragObject = obj;
            console.log(obj);
            return;
        }
        // if (this.checkPointInAnchor([p.coordPoint.x, p.coordPoint.y])) {

        // }
        // 检测是否点击节点
        obj = this.mCollideManage.checkPointInGroup(p.coordPoint);
        if (obj) {
            this.dragObject = obj;
            this.mouseDownMode = Constants.eventMode.group;
            console.log(obj);
        }
        // const item = this.checkPointInGroup([p.coordPoint.x, p.coordPoint.y]);
        // if (item) {
        //     this.draging = true;
        //     this.dragObject = item;
        // }
        // console.log(p);
    }

    
    onMouseMove(e) {
        const clickPoint = {
            x: e.clientX,
            y: e.clientY
        };
        const p = this.getPointObject(clickPoint);

        if (this.mouseDownMode === Constants.eventMode.anchor) {
            this.drawHandler.renderAnchorLinkLine(this.getPointObject(this.mouseDownPoint).domPoint, p.domPoint);
        }
        const item = this.checkPointInGroup([p.coordPoint.x, p.coordPoint.y]);
        if (item) {
            console.log('in group');
        }
        if (this.draging) {
            // this.dragObject.config.x = p.coordPoint.x;
            // this.dragObject.config.y = p.coordPoint.y;
            this.dragObject.setPosition(p.coordPoint);
            const list = this.drawHandler.model.get(Constants.groupList, []);
            this.drawHandler.clearPanel();
            this.drawHandler.render(list);
            // console.log(this.dragObject);
        }
        // console.log(p);
    }

    onMouseUp(e) {
        this.draging = false;
        console.log('onMouseUp');
        const clickPoint = {
            x: e.clientX,
            y: e.clientY
        };
        const p = this.getPointObject(clickPoint);
        if (this.checkPointInGroup([p.coordPoint.x, p.coordPoint.y])) {
            console.log('in group');
        }
        // console.log(p);
        this.mouseDownMode = Constants.eventMode.default;
    }

}
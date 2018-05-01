/*
 * Created on Mon Apr 30 2018
 *
 * Copyright (c) 2018 Your Company
 */
import inside from 'point-in-polygon';
import Constants from './Constants';
import Util from './utils';
import DomUtil from './utils/dom';
const getElementViewTop = DomUtil.getElementViewTop;
const getElementViewLeft = DomUtil.getElementViewLeft;

export default class EventHandler {
    constructor(container, drawHandler) {
        this.container = container;
        this.drawHandler = drawHandler;
        this.addEventListener(this.container, 'click', this.onClick.bind(this));
    }

    addEventListener(dom, type, callback) {
        dom.addEventListener(type, callback);
    }

    onClick(e) {
        const clickPoint = {
            x: e.clientX,
            y: e.clientY
        };
        // console.log(clickPoint);
        const x = getElementViewLeft(this.container);
        const y = getElementViewTop(this.container);
        // console.log(x, y);

        let realX = clickPoint.x - x;
        let realY = clickPoint.y - y;

        // canvas点击相对于父容器坐标
        console.log(realX, realY);

        const parent = this.container.parentElement;
        realX += parent.scrollLeft;
        realY += parent.scrollTop;

        // canvas点击的真实坐标
        console.log(realX, realY);

        const startPoint = this.drawHandler.startPoint;
        realX += startPoint.x;
        realY += startPoint.y;

        console.log(realX, realY);
        this.sendItemClick([realX, realY]);
        // const 
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

}
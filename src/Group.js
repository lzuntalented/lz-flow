/*
 * Created on Mon Apr 30 2018
 *
 * Copyright (c) 2018 Your Company
 */
import LzFlow from './LzFlow';
import Constants from './Constants';
import Util from './utils';

export default class Group {
    constructor(cfg, type = Constants.groupType.node) {
        this.list = {};
        this.config = cfg;
        this.type = type;
    }

    add(name, config) {
        const cfg = config.attr;
        if (name === Constants.defautShape.text) {
            const width = Util.getTextWidth(name);
            const height = cfg.fontSize || 12;
            const x = cfg.x + this.config.x;
            const y = cfg.y + this.config.y - height;
            const points = Util.getPointsFromRect(x, y, width, height);
            config.polygonPoints = points;
        } else if (name === Constants.defautShape.rect) {
            const width = cfg.width;
            const height = cfg.height;
            const x = cfg.x + this.config.x;
            const y = cfg.y + this.config.y;
            const points = Util.getPointsFromRect(x, y, width, height);
            config.polygonPoints = points;
        } else if (name === Constants.defautShape.polygon) {
            const points = [];
            cfg.points.forEach(it => {
                points.push([it[0] + this.config.x, it[1] + this.config.y]);
            });
            config.polygonPoints = points;
        }
        this.list[name] = config;
    }

    /**
     * 解析控制点
     */
    parseAnchorPoints(anchors){
        // const achors = config.getAn
        let min = {
            x: 0, 
            y: 0
        };
        let max = {
            x: 0, 
            y: 0
        }
        let firstTag = false;
        for(const i in this.list) {
            let x = 0;
            let y = 0;
            this.list[i].polygonPoints.forEach((it, idx) => {
                if (!firstTag) {
                    firstTag = true;
                    min.x = max.x = it[0];
                    min.y = max.y = it[1];
                    return ;
                }
                min.x = Math.min(min.x, it[0]);
                min.y = Math.min(min.y, it[1]);

                max.x = Math.max(max.x, it[0]);
                max.y = Math.max(max.y, it[1]);
            });
        }
        // 图形组的尺寸
        this.size = {
            x: min.x,
            y: min.y,
            w: max.x - min.x,
            h: max.y - min.y
        };

        const result = [];
        anchors.forEach((it, idx) => {
            result.push({
                x: min.x + (max.x - min.x) * it[0],
                y: min.y + (max.y - min.y) * it[1]
            });
        });
        // 图形组的控制点
        this.anchorPoints = result;
    }

    render() {
        let map;
        if (this.type === Constants.groupType.node) {
            map = LzFlow.nodeMap;
        } else {
            map = LzFlow.lineMap;
            return;
        }

        const hooks = map[this.config.shape];
        if (!hooks) {
            console.error('can not find shape: ' + this.config.shape);
            return ;
        }

        const keyShape = hooks.draw(this.config, this);
        this.parseAnchorPoints(hooks.getAnchorPoints && hooks.getAnchorPoints() || []);
        return keyShape;
        // console.log(this.list);
    }
}
/*
 * Created on Mon Apr 30 2018
 *
 * Copyright (c) 2018 Your Company
 */
import './LzFlow';
import './nodes';
import Draw from './Draw';
import Constants from './Constants';
import Model from './Model';
import Group from './Group';

export default class Flow {
    constructor(options){
        this.config = {
            panel: ''
        };
        Object.assign(this.config, options);

        this.model = new Model();

        const cfg = this.config;
        this.drawHandler = new Draw(cfg.panel, this.model, cfg.height);
    }

    render() {
        const list = this.model.get(Constants.groupList, []);
        list.forEach(it => {
            it.render(this.drawHandler.showCtx);
        });
        this.drawHandler.render(list);
    }

    source(nodes, lines) {
        const data = [
            {
                shape: Constants.prefix + 'Produce',
                x: 100,
                y: 30,
                name: '劳动节',
                id: 1,
            },
            {
                shape: Constants.prefix + 'Produce',
                x: 200,
                y: 180,
                name: 1231,
                id: 2,
            },
            {
                shape: Constants.prefix + 'Judge',
                x: 400,
                y: 230,
                name: 1231,
                id: 3
            }
        ];
        const lineData = [
            {
                sourceId: 1, 
                targetId: 3,
                sourceAnchor: 1,
                targetAnchor: 0
            },
            {
                sourceId: 3, 
                targetId: 2,
                sourceAnchor: 1,
                targetAnchor: 0
            }
        ]
        const nodeTmp = {};
        const tmp =[];
        data.forEach(it => {
            const item = new Group(it);
            tmp.push(item);
            nodeTmp[it.id] = item;
        });
        lineData.forEach(it => {
            tmp.push(new Group(it, Constants.groupType.line));
        });
        this.model.set(Constants.groupList, tmp);
        this.model.set(Constants.groupNodes, nodeTmp);
    }

    addEventListener(type, callback) {
        this.model.set(Constants.eventTypePrefix + type, callback);
    }

    center(point) {
        this.drawHandler.forceCenter(point);
        this.render();
    }
}


const mflow = new Flow({
    panel,
    height: 700
});
mflow.source();
mflow.render();

window.lzFlow = mflow;
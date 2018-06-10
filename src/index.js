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
import GroupManage from './GroupManage';
import IDManage from './IDManage';
import CoordManage from './CoordManage';

export default class Flow {
    constructor(options){
        this.config = {
            panel: ''
        };
        Object.assign(this.config, options);

        // 初始化模型
        this.model = new Model();

        // 节点管理
        this.gm = new GroupManage(this.model);
        this.model.set(Constants.instance.groupManage, this.gm);

        // id管理器
        this.mIDManage = new IDManage();
        this.model.set(Constants.instance.idManage, this.mIDManage);

        // 坐标管理器
        const mCoordManage = new CoordManage(this.model);
        this.model.set(Constants.instance.corrdManage, mCoordManage);

        // 初始化模型数据
        this.model.set(Constants.groupList, []);
        this.model.set(Constants.groupNodes, {});
        this.model.set(Constants.groupLines, {});

        const cfg = this.config;
        this.drawHandler = new Draw(cfg.panel, this.model, cfg.height);

        this.model.setDefaultEdit();
    }

    render() {
        this.drawHandler.render();
    }

    source(nodes, lines) {
        const data = [
            {
                shape: Constants.prefix + 'Produce',
                x: 150,
                y: 30,
                name: '劳动节',
                id: 1,
            },
            {
                shape: Constants.prefix + 'Produce',
                x: 200,
                y: 180,
                name: 7898,
                id: 2,
            },
            {
                shape: Constants.prefix + 'Judge',
                x: 400,
                y: 230,
                name: 1231,
                id: 3
            },
            {
                shape: Constants.prefix + 'Start',
                x: 500,
                y: 230,
                name: '开始',
                id: 4
            },
            {
                shape: Constants.prefix + 'End',
                x: 500,
                y: 130,
                name: '结束',
                id: 5
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
        ];

        data.forEach(it => {
            this.gm.addItem(JSON.parse(JSON.stringify(it)));
        });
        lineData.forEach(it => {
            this.gm.addItem(JSON.parse(JSON.stringify(it)), Constants.groupType.line);
        });
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
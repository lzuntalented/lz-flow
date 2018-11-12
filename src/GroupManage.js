import Constants from './Constants';
import Group from './Group';

/**
 * 节点管理器
 */
export default class GroupManage {
    constructor(model) {
        this.model = model;
    }

    /**
     * 添加节点
     * @param {object} config 节点配置信息
     * @param {string} type 节点类型
     */
    addItem(config, type = Constants.groupType.node) {
        const idm = this.model.get(Constants.instance.idManage);
        // 不存在自定义id，新建唯一id
        if (config.id) {
            idm.add(config.id);            
        } else {
            config.id = idm.create();
        }
        const item = new Group (config, type);
        
        const list = this.model.get(Constants.groupList, []);
        list.push(item);

        // 节点类型
        if (type === Constants.groupType.node) {
            const nodes = this.model.get(Constants.groupNodes, {});
            nodes[config.id] = item;
        } else {
            const lines = this.model.get(Constants.groupLines, {});
            lines[config.id] = item;
        }
        return item;
    }

    /**
     * 根據配置生成
     */
    createItem(config, type = Constants.groupType.node) {
        const idm = this.model.get(Constants.instance.idManage);
        // 不存在自定义id，新建唯一id
        if (config.id) {
            idm.add(config.id);            
        } else {
            config.id = idm.create();
        }
        const item = new Group (config, type);
        return item;
    }

    deleteItem(id) {
 
    }

    /**
     * 获取节点集合
     */
    getList() {
        return this.model.get(Constants.groupList, []);
    }

    /**
     * 设置节点为触发状态
     * @param {*} obj 
     * @param {*} flag 
     */
    setActive(obj, flag = true) {
        if (flag === true) {
            // 激发状态的节点只能有一个
            const list = this.model.get(Constants.groupList, []);
            list.forEach(it => {
                if (it.type === Constants.groupType.node) {
                    it.active = false;
                }
            });
        }
        
        obj.active = flag;
    }



}
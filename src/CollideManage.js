import Constants from './Constants';

export default class CollideManage {
    constructor(model) {
        this.model = model;
    }

    /**
     * 检测点是否在节点上
     */
    checkPointInGroup(arrPoint) {
        const list = this.model.get(Constants.groupList, []);

        for(let len = list.length, i = len - 1; i >= 0; --i) {
            const it = list[i];
            if (it.pointIn(arrPoint)) {
                return it;
            }
        }
        return false;
    }

    /**
     * 检测点是否在编辑节点上
     */
    checkPointInEditGroup(arrPoint) {
        const list = this.model.get(Constants.groupEditList, []);

        for(let len = list.length, i = len - 1; i >= 0; --i) {
            const it = list[i];
            if (it.pointIn(arrPoint)) {
                return it;
            }
        }
        return false;
    }

    checkPointInAnchor(arrPoint) {
        const list = this.model.get(Constants.groupList, []);

        for(let len = list.length, i = len - 1; i >= 0; --i) {
            const it = list[i];
            const index = it.pointInAnchor(arrPoint);
            if (index >= 0) {
                return {
                    obj: it,
                    index
                };
            }
        }
        return false;
    }
}
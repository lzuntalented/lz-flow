import Util from './utils';

/**
 * 唯一id管理器
 */
export default class IDManage {
    constructor() {
        // id集合
        this.map = {};
    }

    /**
     * 添加id
     * @param {*} id 
     */
    add(id) {
        this.map[id] = true;
    }

    /**
     * 创建一个唯一id
     */
    create() {
        while(true) {
            const id = Util.randomString();
            if (this.map[id]) {
                break;
            }
            return id;
        }
    }
}
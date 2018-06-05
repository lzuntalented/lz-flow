import Constants from './Constants';
import Group from './Group';

export default class Model {
    constructor() {
        this.attrs = {};
        this.setDefaultEdit();
    }

    set(key, value) {
        this.attrs[key] = value;
    }

    get(key, defaultValue){
        return this.attrs[key] || defaultValue;
    }

    setDefaultEdit() {
        const data = [
            {
                shape: Constants.prefix + 'Start',
                x: 200,
                y: 180,
                name: '开始',
                id: 'lz-d3',
            },
            {
                shape: Constants.prefix + 'Produce',
                x: 200,
                y: 180,
                name: '步骤',
                id: 'lz-d1',
            },
            {
                shape: Constants.prefix + 'Judge',
                x: 400,
                y: 230,
                name: '判断',
                id: 'lz-d2',
            },
            {
                shape: Constants.prefix + 'End',
                x: 400,
                y: 230,
                name: '结束',
                id: 'lz-d4',
            }
        ];
        const result = [];
        data.forEach(it => {
            const item = new Group(it);
            item.render();
            result.push(item);
        });
        this.set(Constants.groupEditList, result);
    }

    
}
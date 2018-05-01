class LzFlow {
    constructor() {
        this.nodeMap = {};
        this.lineMap ={};
    }

    registerNode(name, hooks) {
        this.nodeMap[name] = hooks;
    }
    
    registerLine(name, hooks) {
        this.lineMap[name] = hooks;
    }
}

const mLzFlow = new LzFlow();
export default mLzFlow;
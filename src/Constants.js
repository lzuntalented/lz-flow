const eventTypePrefix = 'eventTypePrefix';
export default {
    prefix: 'lzFlow',
    groupNodes: 'groupNodes',
    groupLines: 'groupLines',
    groupList: 'groupList',
    groupEditList: 'groupEditList',

    groupType: {
        node: 'groupType.node',
        line: 'groupType.line'
    },

    eventTypePrefix: eventTypePrefix + '.',
    eventTypeList: {
        itemClick: eventTypePrefix + '.itemClick'
    },

    // 默认支持的图形类型
    defautShape: {
        rect: 'rect',
        text: 'text',
        polygon: 'polygon',
        ellipse: 'ellipse'
    },

    // 组件模式
    mode: {
        // 展示模式
        view: 'view',
        // 编辑模式
        edit: 'edit'
    },

    // 鼠标事件模式
    eventMode: {
        default: 'eventMode.default',
        anchor: 'eventMode.anchor',
        group: 'eventMode.group',
        editGroup: 'eventMode.editGroup'
    },

    // 控制点连线类型
    anchorType: {
        // 默认
        default: 'lightblue',
        // 可以连接
        yes: 'green',
        // 不可以连接
        no: 'red'
    },

    // 实例
    instance: {
        // 节点管理器
        groupManage: 'instance.groupManage',
        // id管理器
        idManage: 'instance.idManage',
        // 坐标管理器
        corrdManage: 'instance.corrdManage'
    },

    lineStroke: '#aab7c4'
}
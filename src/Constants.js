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

    eventMode: {
        default: 'eventMode.default',
        anchor: 'eventMode.anchor',
        group: 'eventMode.group'
    },

    // 实例
    instance: {
        // 节点管理器
        groupManage: 'instance.groupManage',
        // id管理器
        idManage: 'instance.idManage',
        // 坐标管理器
        corrdManage: 'instance.corrdManage'
    }
}
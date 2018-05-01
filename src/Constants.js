const eventTypePrefix = 'eventTypePrefix';
export default {
    prefix: 'lzFlow',
    groupNodes: 'groupNodes',
    groupLines: 'groupLines',
    groupList: 'groupList',

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
        polygon: 'polygon'
    }
}
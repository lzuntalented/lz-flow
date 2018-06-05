
import Constants from '../Constants';
import LzFlow from '../LzFlow';
import Util from '../utils';
const getdiamondPoints = Util.getdiamondPoints;

const name = `${Constants.prefix}Start`;
LzFlow.registerNode(name, {
    draw(config, group) {
        let width = Util.getTextWidth(config.name);
        const txtWidth = width;
        let height = config.fontSize || 12;
        const txtHeight = height;
        const paddingWidth = 10;
        const paddingHeight = 8;
        width += paddingWidth * 2;
        height += paddingHeight * 2;

        const points = getdiamondPoints(0, 0, width, height);
        const result = group.add('ellipse', {
            attr: {
                x: 0,
                y: 0,
                a: width / 2,
                b: height / 2,
                stroke: '#49dbff',
                fill: '#8be3fe'
            }
        });

        group.add('text', {
            attr: {
                label: config.name,
                x: -txtWidth / 2,
                y: txtHeight / 2,
                fill: '#6a6a6a'
            }
        });

        return result;
    },
    getAnchorPoints() {
        return [
            [0.5, 1]
        ]
    }
});
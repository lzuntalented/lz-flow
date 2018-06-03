/*
 * Created on Mon Apr 30 2018
 *
 * Copyright (c) 2018 Your Company
 */

import Constants from '../Constants';
import LzFlow from '../LzFlow';
import Util from '../utils';

const name = `${Constants.prefix}Produce`;
LzFlow.registerNode(name, {
    draw(config, group) {
        let width = Util.getTextWidth(config.name);
        const txtWidth = width;
        let height = config.fontSize || 12;
        const txtHeight = height;
        const padding = 8;
        width += padding * 2;
        height += padding * 2;

        const result = group.add('rect', {
            attr: {
                x: -width / 2,
                y: -height / 2,
                width,
                height,
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
            [0.5, 0],
            [0.5, 1],
        ]
    }
}); 
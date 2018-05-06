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
        let height = config.fontSize || 12;
        const padding = 8;
        width += padding * 2;
        height += padding * 2;

        const result = group.add('rect', {
            attr: {
                x: 0,
                y: 0,
                width,
                height,
                stroke: 'blue',
                fill: 'red'
            }
        });

        group.add('text', {
            attr: {
                label: config.name,
                x: padding,
                y: 12 + padding,
                fill: 'green'
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
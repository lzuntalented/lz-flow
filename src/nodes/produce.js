/*
 * Created on Mon Apr 30 2018
 *
 * Copyright (c) 2018 Your Company
 */

import Constants from '../Constants';
import LzFlow from '../LzFlow';

const name = `${Constants.prefix}Produce`;
LzFlow.registerNode(name, {
    draw(config, group) {
        const result = group.add('rect', {
            attr: {
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                stroke: 'blue',
                fill: 'red'
            }
        });

        group.add('text', {
            attr: {
                label: config.name,
                x: 0,
                y: 12,
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
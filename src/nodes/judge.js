/*
 * Created on Mon Apr 30 2018
 *
 * Copyright (c) 2018 Your Company
 */

import Constants from '../Constants';
import LzFlow from '../LzFlow';
import Util from '../utils';
const getdiamondPoints = Util.getdiamondPoints;

const name = `${Constants.prefix}Judge`;
LzFlow.registerNode(name, {
    draw(config, group) {
        let width = Util.getTextWidth(config.name);
        let height = config.fontSize || 12;
        const padding = 15;
        width += padding * 2;
        height += padding * 2;

        const points = getdiamondPoints(width / 2, height / 2, width, height);
        const result = group.add('polygon', {
            attr: {
                points,
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
            [1, 0.5],
            [0.5, 1],
        ]
    }
});
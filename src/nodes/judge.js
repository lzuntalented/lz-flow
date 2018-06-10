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
        const txtWidth = width;
        let height = config.fontSize || 12;
        const txtHeight = height;
        const padding = 15;
        width += padding * 2;
        height += padding * 2;

        const points = getdiamondPoints(0, 0, width, height);
        const result = group.add('polygon', {
            attr: {
                points,
                stroke: '#81e4de',
                fill: '#e7f8ff'
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
            [1, 0.5],
            [0.5, 1],
        ]
    }
});
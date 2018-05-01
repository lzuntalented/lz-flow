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
        const width = 80;
        const height = 60;
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
            [1, 0.5],
            [0.5, 1],
        ]
    }
});
/*
 * Created on Mon Apr 30 2018
 *
 * Copyright (c) 2018 Your Company
 */

import Constants from '../Constants';
import LzFlow from '../LzFlow';

const name = `${Constants.prefix}Rect`;
LzFlow.registerNode(name, {
    draw(config, group) {
        const result = group.add('rect', {
            attr: {
                x: 0,
                y: 0
            }
        });

        group.add('text', {
            attr: {
                label: '我们',
                x: 0,
                y: 0
            }
        });

        return result;
    }
});
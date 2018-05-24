import EngineInterface from './EngineInterface';
export default class SvgEngine extends EngineInterface {
    line (start, end, options) {};
    circle (center, radius, options) {}
    rect(x, y, w, h, options) {}
    text(x, y, options) {}
    polygon (points, options) {}
    ellipse(x, y, a, b, options) {}
}
function getElementViewLeft(element) {
    if (element.getBoundingClientRect) {
        return element.getBoundingClientRect().left;
    }

    var actualLeft = element.offsetLeft;
    var current = element.offsetParent;

    while (current !== null) {
        actualLeft += current.offsetLeft;
        current = current.offsetParent;
    }

    if (document.compatMode == "BackCompat") {
        var elementScrollLeft = document.body.scrollLeft;
    } else {
        var elementScrollLeft = document.documentElement.scrollLeft;
    }

    return actualLeft - elementScrollLeft;
}

function getElementViewTop(element) {
    if (element.getBoundingClientRect) {
        return element.getBoundingClientRect().top;
    }

    var actualTop = element.offsetTop;
    var current = element.offsetParent;

    while (current !== null) {
        actualTop += current.offsetTop;
        current = current.offsetParent;
    }

    if (document.compatMode == "BackCompat") {
        var elementScrollTop = document.body.scrollTop;
    } else {
        var elementScrollTop = document.documentElement.scrollTop;
    }

    return actualTop - elementScrollTop;
}

export default {
    getElementViewLeft,
    getElementViewTop
}
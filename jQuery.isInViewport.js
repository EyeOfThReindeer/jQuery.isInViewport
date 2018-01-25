/*
 * Main interface function, called on element jQuery object.
 * Validates the input variables and calls appropriate subfunction
 * 
 * @param {String} dimension [vertical | horizontal | both]: 
 *                      Which dimension should the function check the element's visibility for? 
 *                      Defaults to "vertical".
 * @param {jQuery object} viewport: 
 *                      Determines the scrollable element. Most likely the entire browser window.
 *                      Defaults to $(window).
 * @param {jQuery object} wrapper: 
 *                      The main content wrapper. Is required to substract its offset from the element's offset.
 *                      Defaults to $("body").
 *                
 * @returns {object}:
 *                  {
 *                      visible (bool):
 *                           True, if any part of the element is visible.
 *                      percentVisible (float):
 *                           Decimal representation of percentage of element's area that is visible.
 *                      percentOfViewport (float):
 *                           Decimal representation of percentage of viewport's visible area that is taken by the element.
 *                      details (object):
 *                          Other values, that might be interesting; variable content.
 *                  }
 *                
 *                  The values are always relative to chosen dimension.
 */

$.fn.isInViewport = function (dimension, viewport, wrapper) {
    // validate the inputs
    if (typeof (dimension) == "undefined" || ["vertical", "horizontal", "both"].indexOf(dimension) == -1) {
        dimension = "vertical";
    }
    if (typeof (viewport) == "undefined") {
        viewport = $(window);
    }
    if (typeof (wrapper) == "undefined") {
        wrapper = $("body");
    }

    // call the appropriate function
    var values = $.isInViewport.getValues(viewport, wrapper, $(this));
    return $.isInViewport[dimension](values);
};

/*
 * The functionality decomposed
 */
$.isInViewport = {};


/*
 * Get an object of all values required for further calculations
 */
$.isInViewport.getValues = function (viewport, wrapper, element) {
    var v = {element: {}, viewport: {}};

    // Dimensions of the element
    v.element.height = element.height();
    v.element.width = element.width();

    // The element's position relative to the wrapper
    v.element.top = element.position().top - wrapper.position().top; // offset of top edge from the top of wrapper element
    v.element.bottom = v.element.top + v.element.height; // offset of bottom edge from the top of wrapper element
    v.element.left = element.position().left - wrapper.position().left;  // offset of left edge from left of the wrapper element
    v.element.right = v.element.left + v.element.width; // offest of right edge from left 

    // Dimensions of the viewport
    v.viewport.height = viewport.height();
    v.viewport.width = viewport.width();

    // Edges of the viewport's visible area
    if (viewport == $(window)) { // viewport scroll on the Y axix; top edge of viewport's visible area
        v.viewport.top = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop;
    } else {
        v.viewport.top = viewport.scrollTop();
    }
    v.viewport.bottom = v.viewport.top + viewport.height(); // bottom edge of viewport's visible area

    if (viewport == $(window)) { // viewport scroll on the X axis; left edge of viewport's visible area
        v.viewport.left = window.pageXOffset || (document.documentElement || document.body.parentNode || document.body).scrollLeft;
    } else {
        v.viewport.left = viewport.scrollLeft();
    }
    v.viewport.right = v.viewport.left + viewport.width(); // right edge of viewport's visible area

    return v;
};

/*
 * If the value is smaller than zero, return zero 
 * @param {float} value
 * @returns {float}
 */
function cropFloat(value, min, max) {
    if (typeof (min) != "undefined") {
        value = (value < min) ? min : value;
    }
    if (typeof (max) != "undefined") {
        value = (value > max) ? max : value;
    }
    return value;
}
/*
 * Sub-function: Calculate vertical visibility only 
 */
$.isInViewport.vertical = function (v) {
    var rv = {visible: false, percentVisible: 0, percentOfViewport: 0, details: {elementHeight: v.element.height}}; // rv = returnValues; v = values

    // get if any part is visible
    rv.visible = v.element.bottom > v.viewport.top && v.element.top < v.viewport.bottom;

    // get nominal representation of element's area that is not visible
    rv.details.invisibleTop = cropFloat(v.viewport.top - v.element.top, 0, v.element.height); // get area of the element that is hidden above top viewport edge
    rv.details.invisibleBottom = cropFloat(v.element.bottom - v.viewport.bottom, 0, v.element.height); // get area of the element that is hidden bellow bottom viewport edge

    // total visible and invisible part
    var invisiblePart = 0;
    if (rv.details.invisibleTop > 0) {
        invisiblePart += rv.details.invisibleTop;
    }
    if (rv.details.invisibleBottom > 0) {
        invisiblePart += rv.details.invisibleBottom;
    }
    rv.details.invisiblePart = invisiblePart;
    
    rv.details.visiblePart = cropFloat(v.element.height - invisiblePart, 0);

    // distance from the viewport edges, if the element is off-viewport
    rv.details.distanceFromViewportTop = cropFloat(v.element.top - v.viewport.bottom, 0);
    rv.details.distanceFromViewportBottom = cropFloat(v.viewport.top - v.element.bottom, 0);

    // get decimal representation of percental values
    rv.percentVisible = rv.details.visiblePart / v.element.height; // percent of element that is visible
    rv.percentOfViewport = rv.details.visiblePart / v.viewport.height; // percent of viewport that is occupied by the element vertically

    return rv;
};

/*
 * Sub-function: Calculate horizontal visibility only
 */
$.isInViewport.horizontal = function (v) {
    var rv = {visible: false, percentVisible: 0, percentOfViewport: 0, details: {elementWidth: v.element.width}}; // rv = returnValues; v = values

    // get if any part is visible
    rv.visible = v.element.right > v.viewport.left && v.element.left < v.viewport.right;

    // get nominal representation of element's area that is not visible
    rv.details.invisibleLeft = cropFloat(v.viewport.left - v.element.left, 0, v.element.width); // get area of the element that is hidden above top viewport edge
    rv.details.invisibleRight = cropFloat(v.element.right - v.viewport.right, 0, v.element.width); // get area of the element that is hidden bellow bottom viewport edge

    // total visible and invisible part
    var invisiblePart = 0;
    if (rv.details.invisibleLeft > 0) {
        invisiblePart += rv.details.invisibleLeft;
    }
    if (rv.details.invisibleRight > 0) {
        invisiblePart += rv.details.invisibleRight;
    }
    rv.details.invisiblePart = invisiblePart;

    rv.details.visiblePart = cropFloat(v.element.width - invisiblePart, 0);

    // distance from the viewport edges, if the element is off-viewport
    rv.details.distanceFromViewportLeft = cropFloat(v.element.left - v.viewport.right, 0);
    rv.details.distanceFromViewportRight = cropFloat(v.viewport.left - v.element.right, 0);

    // get decimal representation of percental values
    rv.percentVisible = rv.details.visiblePart / v.element.width; // percent of element that is visible
    rv.percentOfViewport = rv.details.visiblePart / v.viewport.width; // percent of viewport that is occupied by the element vertically

    return rv;
};

/*
 * Sub-function: Calculate visibility in both dimensions; use data from both previous sub-functions
 */
$.isInViewport.both = function (values) {
    var v = $.isInViewport.vertical(values);
    var h = $.isInViewport.horizontal(values);
    
    var rv ={};
    rv.visible = v.visible && h.visible;
    rv.percentVisible = v.percentVisible * h.percentVisible;
    rv.percentOfViewport = v.percentOfViewport * h.percentOfViewport;
    var visiblePart = h.details.visiblePart * v.details.visiblePart;
    rv.details = $.extend(h.details, v.details);
    rv.details.invisiblePart = h.details.elementWidth * v.details.elementHeight - visiblePart;
    rv.details.visiblePart = visiblePart;
    
    return rv;
};
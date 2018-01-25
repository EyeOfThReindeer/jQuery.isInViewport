var viewport = $("#viewport");
var wrapper = $("#wrapper");
var element = $("#element");
var debug = $("#code");

var scrolled = function () {
    // choose the behaviour
    var dimension = element.attr("data-dimension");
    
    // use the library
    var results = element.isInViewport(dimension, viewport, wrapper);
    
    // output results
    var jsonPretty = JSON.stringify(results, null, '\t');
    debug.text(jsonPretty);
};

// initial scroll
$(document).ready(function () {
    viewport.scrollTop(300);
    viewport.scrollLeft(300);
    scrolled();
});

// scroll event
viewport.on("scroll", scrolled);

// button controlls
$(".button").on('click', function (e) {
    e.preventDefault();
    $("#element").attr("data-dimension", $(this).attr("data-dimension"));
    $(this).addClass("active");
    $(this).siblings().removeClass("active");
    scrolled();
});
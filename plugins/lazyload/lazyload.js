(function($) {
    "use strict";
    /**
     * jquery懒加载
     * author: wushain
     * time: 2016/4/7
     * @param {$} dom                   懒加载的jq节点
     * @param {String} background       默认懒加载的loading图
     * @param {String} effect           懒加载效果
     * @param {Number} distance         滚动超过dom多少距离再执行懒加载
     */
    var setOptions = function(options) {
        var defaults = {
            dom: '.lazyload',
            background: backsvg,
            effect: 'fadeIn',
            distance: 100
        };
        return $.extend(defaults, options)
    }
    var backsvg = "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABlBMVEXu7ev///9YrSB4AAAAAWJLR0QB/wIt3gAAAAd0SU1FB+EKDBEpOo4ESoAAAAAKSURBVAjXY2AAAAACAAHiIbwzAAAAAElFTkSuQmCC"
    $.extend($, {
        lazyload: function(options) {
            var opts = setOptions(options)
            // 判断初始化src
            var src = opts.background;
            $(opts.dom).css({
                width: '100%'
            }).attr('src', opts.background)
            // 窗口高度
            var winHeight = $(window).height();
            $(window).scroll(function() {
                // 滚动高度
                var winScrollTop = $(window).scrollTop();
                $(opts.dom).each(function(index, element) {
                    // 图片距离浏览器顶部高度
                    var mainOffsetTop = $(element).offset().top;
                    if (mainOffsetTop - winHeight < winScrollTop - opts.distance) {
                        // 重置src
                        var datasrc = $(element).attr('datasrc')
                        $(element).attr('src', datasrc).removeAttr('datasrc')
                    }
                })
            })
        }
    })
})($);
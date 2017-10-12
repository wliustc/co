/**
 * [drop_down_refresh]
 * @说明  jquery下拉刷新插件
 */
+ function($) {
    "use strict";

    var DDR = function(el) {
        var _self = this;
        _self.ddr = $(el);
        _self.distance = 60;
        _self.listening();
    }

    DDR.prototype.start = function(el) {
        if (this.ddr.hasClass('refreshing')) return;
        this.startPosition = $.getTouchPosition(el);
        this.diffPositionY = 0;
    };

    DDR.prototype.move = function(el) {
        var _self = this;
        if (_self.ddr.hasClass('refreshing')) return;
        if (!_self.startPosition) return;
        if (_self.ddr.scrollTop() > 0) return;
        var startPositionY = _self.startPosition.y;
        var movePositionY = $.getTouchPosition(el).y;
        _self.diffPositionY = movePositionY - startPositionY;
        if (_self.diffPositionY < 0) return;
        _self.ddr.addClass('tin-ddr-moving');
        el.preventDefault();
        el.stopPropagation();
        _self.diffPositionY = Math.pow(_self.diffPositionY, 0.8);
        _self.ddr.css("transform", "translate3d(0, " + _self.diffPositionY + "px, 0)");
        if (_self.diffPositionY < _self.distance) {
            _self.ddr.addClass('tin-ddr-downing').removeClass('tin-ddr-uping');
        } else {
            _self.ddr.addClass('tin-ddr-uping').removeClass('tin-ddr-downing');
        }
    };

    DDR.prototype.end = function(el) {
        var _self = this;
        if (_self.ddr.hasClass('refreshing') || _self.diffPositionY <= 0) return;
        _self.start = false;
        _self.ddr.removeClass('tin-ddr-moving').removeClass('tin-ddr-downing').removeClass('tin-ddr-uping');
        _self.ddr.css("transform", "");
        if (Math.abs(_self.diffPositionY) > _self.distance) {
            _self.ddr.addClass("refreshing");
            _self.ddr.trigger('tin-ddr-callback');
            _self.diffPositionY = 0;
        }
    };

    DDR.prototype.listening = function() {
        var _self = this;
        var el = _self.ddr;
        el.on($.touchEvents.start, $.proxy(_self.start, _self));
        el.on($.touchEvents.move, $.proxy(_self.move, _self));
        el.on($.touchEvents.end, $.proxy(_self.end, _self));
    };

    $.fn.dropDownRefresh = function() {
        var _self = this;
        if (_self.hasClass('tin-ddr')) {
            return _self.each(function() {
                new DDR(_self)
            });
        } else {
            return false;
        }
    };

    $.fn.dropDownRefreshOver = function() {
        this.removeClass("refreshing");
    }
}($);
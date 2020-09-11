(function(window, $){

    $.fn.promotick.loader = {
        spinners : ['plane', 'bounce-2', 'wave', 'cubes', 'pulse', 'dots', 'bounce-3', 'circle', 'grid', 'circle-fade'],
        defaults : {
            spinner : 'bounce-3'
        },
        show : function($dom, options) {
            var $elem = this._parseDom($dom);

            if ($elem === undefined || $elem === null) {
                $.fn.promotick.toast.error('Element is not defined', 'Error Loader');
                $.fn.promotick.error('Element is not defined');
                return this;
            }

            if ($elem.length === 0) {
                $.fn.promotick.toast.error('Element not found', 'Error Loader');
                $.fn.promotick.error('Element not found');
                return this;
            }

            this._create($elem, options);
        },
        hide : function($dom) {
            var $elem = this._parseDom($dom);
            $elem.toggleClass('sk-loading');
            return this;
        },
        _parseDom : function($dom) {
            if (typeof($dom) == "object") {
                return $dom;
            }
            return $($dom);
        },
        _create : function($elem, options) {
            if ($elem.find('div.sk-spinner').length === 0) {
                var settings = $.extend(true, {}, this.defaults, options);
                switch (settings.spinner) {
                    case this.spinners[0] : //Plane
                        $elem.prepend(this._makeContainer('sk-spinner sk-spinner-rotating-plane'));
                        break;
                    case this.spinners[1] : //Bounce-2
                        $elem.prepend(this._makeContainer('sk-spinner sk-spinner-double-bounce', 'sk-double-bounce', 2));
                        break;
                    case this.spinners[2] : //Wave
                        $elem.prepend(this._makeContainer('sk-spinner sk-spinner-wave', 'sk-rect', 5));
                        break;
                    case this.spinners[3] : //Cubes
                        $elem.prepend(this._makeContainer('sk-spinner sk-spinner-wandering-cubes', 'sk-cube', 2));
                        break;
                    case this.spinners[4] : //Pulse
                        $elem.prepend(this._makeContainer('sk-spinner sk-spinner-pulse'));
                        break;
                    case this.spinners[5] : //Dots
                        $elem.prepend(this._makeContainer('sk-spinner sk-spinner-chasing-dots', 'sk-dot', 2));
                        break;
                    case this.spinners[6] : //Bounce-3
                        $elem.prepend(this._makeContainer('sk-spinner sk-spinner-three-bounce', 'sk-bounce', 3));
                        break;
                    case this.spinners[7] : //Circle
                        $elem.prepend(this._makeContainer('sk-spinner sk-spinner-circle', 'sk-circle sk-circle', 12));
                        break;
                    case this.spinners[8] : //Grid
                        $elem.prepend(this._makeContainer('sk-spinner sk-spinner-cube-grid', 'sk-cube', 9, false));
                        break;
                    case this.spinners[9] : //Circle-fade
                        $elem.prepend(this._makeContainer('sk-spinner sk-spinner-fading-circle', 'sk-circle sk-circle', 12));
                        break;
                }
            }
            $elem.toggleClass('sk-loading');
        },
        _makeContainer : function (containerClass, childrenClass, iterator, correlative) {
            var $container = $('<div/>', {'class' : containerClass});
            if (childrenClass !== undefined) {
                $.each(new Array(iterator), function(n){
                    $('<div/>', {'class' : childrenClass + (correlative === undefined || correlative ? (n + 1) : '')}).appendTo($container);
                });
            }
            return $container;
        }
    };

})(window, jQuery);

(function(window, $){

    $.fn.promotick = {

        // #############################################################################
        // # LOG
        // #############################################################################
        log : function(message, options) {
            var settings = $.extend( true, {}, this.options, options);
            if (window.console && window.console.log && settings.debug) {
                console.log(message);
            }
        },
        error : function(message) {
            if (window.console && window.console.log) {
                console.error(message);
            }
        },
        init : function(component, parent) {
            switch (component) {
                case 'switchery' :

                    parent.find('input[data-plugin=switchery]').each(function(i, e) {
                        var ddd = new Switchery(e, { color: '#4cd26c', size: 'small'});
                    });
                    break;
            }
        },
        scrollTop : function(idScroll, time) {
            if (idScroll === undefined || idScroll === null) {
                idScroll = $('body');
            }
            if (time === undefined || time === null) {
                time = 500;
            }
            $([document.documentElement, document.body]).animate({
                scrollTop: idScroll.offset().top
            }, time);
        },
        options : {
            debug: false
        },
        _findDuplicates : function(array) {
            var object = {};
            var result = [];
            array.forEach(function (item) {
                if(!object[item])
                    object[item] = 0;
                object[item] += 1;
            });

            for (var prop in object) {
                if(object.hasOwnProperty(prop) && object[prop] >= 2) {
                    result.push(prop);
                }
            }
            return result;
        },

        _findDuplicateObjects : function(array, property) {
            var object = {};
            var result = [];
            $.each(array, function(i, obj){
                if (property !== undefined) {
                    $.each(obj, function(key, value){
                        if (key === property) {
                            if (!object[value])
                                object[value] = 0;
                            object[value] += 1;
                        }
                    });
                }
            });

            for (var prop in object) {
                if(object.hasOwnProperty(prop) && object[prop] >= 2) {
                    result.push(prop);
                }
            }

            return result;
        },
        _createUUID: function () {
            var d = new Date().getTime();
            if (window.performance && typeof window.performance.now === "function") {
                d += performance.now(); //use high-precision timer if available
            }
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
        }
    };

    window.Promotick = $.fn.promotick;


    if (window.$) {
        window.$.promotick = $.fn.promotick;
    }

})(window, jQuery);

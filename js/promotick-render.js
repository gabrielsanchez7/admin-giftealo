(function(window, $){

    $.fn.promotick.render = {
        defaults : {
            url : null,
            data : null,
            context : null,
            loader : null,
            before : function () {},
            success : function (response) {},
            complete : function () {}
        },
        get : function(options) {
            var self = this;
            var settings = $.extend( true, {}, this.defaults, options);

            if (self._validate(settings)) {
                Promotick.ajax.get({
                    url : settings.url,
                    contentType : 'text/html',
                    dataType : 'text',
                    before : function() {
                        self._loader(settings, true);
                        settings.before();
                    },
                    success : function(response) {
                        if (settings.context != null) {
                            settings.context.hide().html(response).fadeIn('slow');
                        }
                        settings.success(response);
                    },
                    complete : function() {
                        self._loader(settings, false);
                        settings.complete();
                    }
                });
            }
        },
        post : function(options) {
            var self = this;
            var settings = $.extend( true, {}, this.defaults, options);

            if (self._validate(settings)) {

                Promotick.ajax.post({
                    url : settings.url,
                    dataType : 'text',
                    data : settings.data,
                    before : function() {
                        self._loader(settings, true);
                        settings.before();
                    },
                    success : function(response) {
                        if (settings.context != null) {
                            settings.context.hide().html(response).fadeIn('slow');
                        }
                        settings.success(response);
                    },
                    complete : function() {
                        self._loader(settings, false);
                        settings.complete();
                    }
                });

            }
        },
        _loader : function(settings, band) {
            if (settings.loader == null) {
                settings.loader = settings.context;
            }

            if (settings.loader !== undefined && settings.loader != null){
                if (band) {
                    settings.loader.LoadingOverlay('show', Promotick.defaults.LoadingOverlay);
                } else {
                    settings.loader.LoadingOverlay('hide', true);
                }
            }
        },
        _validate : function(settings) {
            if (settings.url === undefined || settings.url === null || settings.url === '') {
                Promotick.toast.error('Render - Url no deinida');
                Promotick.error('Render - Url no deinida');
                return false;
            }
            return true;
        }
    };

})(window, jQuery);

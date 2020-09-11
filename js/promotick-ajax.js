(function(window, $){

    $.fn.promotick.ajax = {
        defaults : {
            type: null,
            url: null,
            data : null,
            async : true,
            contentType : "application/json; charset=utf-8",
            dataType : "json",
            processData : true,
            messageError : false,
            messageTitle : undefined,
            loader : null,
            context : null,
            headers : {},
            before : function() {},
            success : function(){},
            error : function(){},
            complete : function() {}
        },
        call : function (options) {
            var settings = $.extend(true, {}, this.defaults, options);

            //Logger
            $.fn.promotick.log(options.type + ': ' + settings.url);
            $.fn.promotick.log('Type: ' + settings.type);
            $.fn.promotick.log('Data: ' + settings.data);

            //Validations
            if (settings.type === undefined || settings.type === null) {
                $.fn.promotick.toast.error('Type is not defined', 'Ajax Validation');
                $.fn.promotick.error('Error validation: Type is not defined');
                return this;
            }

            if (settings.url === undefined || settings.url === null) {
                $.fn.promotick.toast.error('Url is not defined', 'Ajax Validation');
                $.fn.promotick.error('Error validation: Url is not defined');
                return this;
            }

            //Loader / Context Loader
            if (settings.loader !== null) {
                $.fn.promotick.loader.show(settings.loader);
            }

            if (settings.context !== null && settings.context.loader != null && settings.context.loader) {
                settings.context.start();
            }

            settings.before(settings);

            //Process Ajax
            $.ajax({
                type: settings.type,
                url: settings.url,
                data: settings.data,
                dataType: settings.dataType,
                contentType: settings.contentType,
                headers: settings.headers,
                async : settings.async,
                processData : settings.processData
            })
                .done(function (response) {
                    $.fn.promotick.log('Ajax Done');
                    if (settings.dataType !== 'text') {
                        $.fn.promotick.log(response);
                    }

                    if (settings.messageError && !response.status) {
                        $.fn.promotick.toast.error(response.message, settings.messageTitle);
                    }

                    settings.success(response);
                })
                .fail(function (jqXHR, exception) {
                    var msg_err = "";
                    if (jqXHR.status === 0) {
                        msg_err = "Not connect. Verify Network.";
                    } else if (jqXHR.status === 401) {
                        msg_err = "Requested page not authorizated. [401]";
                    } else if (jqXHR.status === 403) {
                        msg_err = "Requested page restricted. [403]";
                    } else if (jqXHR.status === 404) {
                        msg_err = "Requested page not found. [404]";
                    } else if (jqXHR.status === 500) {
                        msg_err = "Internal Server Error [500].";
                    } else if (exception === "parsererror") {
                        msg_err = "Requested JSON parse failed.";
                    } else if (exception === "timeout") {
                        msg_err = "Time out error.";
                    } else if (exception === "abort") {
                        msg_err = "Ajax request aborted.";
                    } else {
                        msg_err = "Uncaught Error. " + jqXHR.responseText;
                    }
                    settings.error(jqXHR.status, msg_err);

                    $.fn.promotick.error('Status: ' + jqXHR.status);
                    $.fn.promotick.error(exception);

                    if (settings.messageError) {
                        $.fn.promotick.toast.error(exception, settings.messageTitle);
                    }
                })
                .always(function () {
                    //Loader / Context Loader
                    if (settings.loader !== null) {
                        $.fn.promotick.loader.hide(settings.loader);
                    }

                    if (settings.context !== null && settings.context.loader != null && settings.context.loader) {
                        settings.context.stop();
                    }
                    settings.complete();
                });
            return this;
        },
        post : function(options) {
            options.type = 'POST';
            return this.call(options);
        },
        get : function(options) {
            options.type = 'GET';
            return this.call(options);
        }

    };

})(window, jQuery);

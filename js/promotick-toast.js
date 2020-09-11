(function(window, $){

    $.fn.promotick.toast = {
        defaults : {
            closeButton: true,
            debug: false,
            progressBar: true,
            preventDuplicates: false,
            positionClass: 'toast-bottom-right',
            showDuration: 400,
            hideDuration: 1000,
            timeOut: 8000,
            extendedTimeOut: 1000,
            showEasing: 'swing',
            hideEasing: 'linear',
            showMethod: 'fadeIn',
            hideMethod: 'fadeOut',
            onHidden : function() {},
            onShown : function() {},
            onclick : function() {},
            onCloseClick : function() {}
        },
        warning : function(message, title, options) {
            var settings = $.extend( true, {}, this.defaults, options);
            toastr.warning(message, (title === undefined ? 'Warning' : title), settings);
            return this;
        },
        success : function(message, title, options) {
            var settings = $.extend( true, {}, this.defaults, options);
            toastr.success(message, (title === undefined ? 'Success' : title), settings);
            return this;
        },
        error : function(message, title, options) {
            var settings = $.extend( true, {}, this.defaults, options);
            toastr.error(message, (title === undefined ? 'Error' : title), settings);
            return this;
        },
        remove : function() {
            toastr.remove();
            return this;
        },
        clear : function() {
            toastr.clear();
            return this;
        }
    };

})(window, jQuery);

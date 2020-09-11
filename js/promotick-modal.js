(function(window, $){

    $.fn.promotick.modal = {
        defaults : {
            id : null,
            backdrop: true,
            keyboard: true,
            focus: true,
            title : '',
            closeIcon : true,
            buttons : [],
            isLoading : false,
            content : null,
            open : function($modal) {},
            close : function($modal) {}
        },
        buttonDefaults : {
            id : null,
            text : '',
            class : 'btn-default',
            additionalClass : '',
            icon : null,
            click : function($modal, loader) {}
        },
        _buildModal : function(options) {
            var self = this;
            var settings = $.extend(true, {}, this.defaults, options);

            if (settings.id == null) {
                settings.id = $.fn.promotick._createUUID;
            }

            // create the DOM structure
            var $modal = $('<div />').attr('id', settings.id).attr('role', 'dialog').addClass('modal fade')
                .append($('<div />').addClass('modal-dialog')
                    .append($('<div />').addClass('modal-content')
                        .append($('<div />').addClass('modal-header')
                            .append($('<h4 />').addClass('modal-title').text(settings.title)))
                        .append($('<div />').addClass('modal-body')
                            .append(settings.content))
                        /*.append($('<div />').addClass('modal-footer')
                        )*/
                    )
                );

            // Make footer section
            if (settings.buttons.length > 0) {
                $modal.find('.modal-dialog>.modal-content').append($('<div />').addClass('modal-footer'));
            }

            // Dismiss function
            $modal.dismiss = function () {
                if (!settings.isLoading) {
                    $modal.modal('hide');
                }
            };

            //Make Close Icon
            if (settings.closeIcon) {
                $modal.find('.modal-header').prepend(
                    $('<button />')
                        .attr('type', 'button')
                        .addClass('close')
                        .html('&times;')
                        .click(function () {
                            $modal.dismiss()
                        })
                );
            }

            //Content
            if (settings.content != null) {
                $modal.find('.modal-body').html(settings.content);
            }

            $modal.content = function(content) {
                $modal.find('.modal-body').html(content);
            };

            //Buttons
            if (settings.buttons.length > 0) {
                // add the buttons
                var $footer = $modal.find('.modal-footer');

                var duplicates = $.fn.promotick._findDuplicateObjects(settings.buttons, 'id');
                if (duplicates.length > 0) {
                    $.fn.promotick.error('Modal Duplicate Ids: ' + duplicates);
                }

                for (var i = 0; i < settings.buttons.length; i++) {
                    (function (btn) {
                        var btnSettings = $.extend(true, {}, self.buttonDefaults, btn);
                        if (btnSettings.id == null) {
                            btnSettings.id = $.fn.promotick._createUUID;
                        }

                        $footer.append(self._buildButton(self, btnSettings, $modal));
                    })(settings.buttons[i]);
                }
            }

            $modal.on('shown.bs.modal', function (e) {
                settings.open($modal);
            });

            $modal.on('hidden.bs.modal', function (e) {
                settings.close($modal);
            });

            $modal.loader = {
                show : function() {
                    settings.isLoading = true;
                    self._buttonStatus($modal, false);
                },
                hide : function() {
                    settings.isLoading = false;
                    self._buttonStatus($modal, true);
                }
            };

            $modal.settings = settings;
            return $modal;
        },
        _buildButton : function(self, settings, $modal) {
            var $button = $('<button />').addClass('btn ' + settings.class + ' ' + settings.additionalClass)
                .attr('id', settings.id)
                .attr('type', 'button');

            //Settings Icon
            if (settings.icon != null) {
                $button.text(' ' + settings.text);
                $button.prepend($('<i/>').addClass(settings.icon));
            } else {
                $button.text(settings.text)
            }

            //Settings Loader
            $button.click(function (e) {
                e.preventDefault();

                settings.loader = Ladda.create(this);
                settings.click($modal, settings);
            });

            settings.show = function() {
                if (settings.loader !== null) {
                    settings.loader.start();
                    $modal.settings.isLoading = true;

                    self._buttonStatus($modal, false, $button);
                }
            };

            settings.hide = function() {
                if (settings.loader !== null) {
                    settings.loader.stop();
                    $modal.settings.isLoading = false;

                    self._buttonStatus($modal, true, $button);
                }
            };

            return $button;
        },
        _buttonStatus : function($modal, status, $button) {
            var id = 0;
            if ($button !== undefined) {
                id = $button.attr('id');
            }

            $modal.find('.modal-footer>button:not(#' + id + ')').each(function(i, e) {
                $(this).attr('disabled' , !status);
            });

            if (!status) {
                $modal.data('bs.modal')._config.backdrop = 'static';
                $.fn.promotick.loader.show($modal.find('.modal-body'));
            } else {
                $modal.data('bs.modal')._config.backdrop = true;
                $.fn.promotick.loader.hide($modal.find('.modal-body'));
            }
        },
        show : function(options) {
            var $modal = this._buildModal(options);
             console.log($modal);
            $modal.modal({
                show : true,
                backdrop: $modal.settings.backdrop,
                keyboard: $modal.settings.keyboard,
                focus: $modal.settings.focus
            });
            return $modal;
        }
    };


})(window, jQuery);

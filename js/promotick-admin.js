(function(window, $){

    jQuery.validator.setDefaults({
        debug: false,
        errorPlacement: function(error, element) {
            var placement = $(element).data('error');

            if (placement) {
                $(placement).append(error)
            } else {
                error.insertAfter(element);
                if (element.attr('data-is-select2')) {
                    error.addClass('errorSelect2');
                    var $select2 = error.parent().find('span.select2-container');
                    $select2.addClass('errorSelect2');
                    $select2.insertAfter(element);
                } else if (element.attr('type') === 'checkbox') {
                    element.parent().append(error);
                } else if (element.hasClass('datepicker')) {
                    element.parent().parent().append(error);
                }
            }
        }
    });

    jQuery.extend($.fn.dataTable.defaults, {
        language: {
            sProcessing:     "Procesando...",
            sLengthMenu:     "Mostrar _MENU_ registros",
            sZeroRecords:    "No se encontraron resultados",
            sEmptyTable:     "Ningún dato disponible en esta tabla",
            sInfo:           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            sInfoEmpty:      "Mostrando registros del 0 al 0 de un total de 0 registros",
            sInfoFiltered:   "(filtrado de un total de _MAX_ registros)",
            sInfoPostFix:    "",
            sSearch:         "Buscar:",
            sUrl:            "",
            sInfoThousands:  ",",
            sLoadingRecords: "Cargando...",
            oPaginate: {
                sFirst:    "Primero",
                sLast:     "Último",
                sNext:     "Siguiente",
                sPrevious: "Anterior"
            },
            oAria: {
                sSortAscending:  ": Activar para ordenar la columna de manera ascendente",
                sSortDescending: ": Activar para ordenar la columna de manera descendente"
            }
        },
        responsive: true
    });

    window.Promotick.defaults = {

        LoadingOverlay : {
            zIndex : 2147
        }
    };

    //Options Default
    window.Promotick.options.debug = false;

})(window, jQuery);

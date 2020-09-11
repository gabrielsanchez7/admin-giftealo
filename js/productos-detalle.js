function ProductosDetalle(uri, registro) {
    this.uri = uri;
    this.registro = parseInt(registro);
    this.idProducto = $('#idProducto');
    this.categoriaProducto = $('#categoriaProducto');
    this.marcaProducto = $('#marcaProducto');
    this.btnAdd = $('.btnAdd');
    this.imagenPrincipal = $('#imagenPrincipal');
    this.imagenDetalle = $('#imagenDetalle');
    this.gridCatalogos = $('#gridCatalogos');
    this.tipoProducto = $('#tipoProducto');
    this.formProducto = $('#formProducto');
    this.btnGuardarInfo = $('#btnGuardarInfo');
    this.btnGuardarImagen = $('#btnGuardarImagen');
    this.codigoWeb = $('#codigoWeb');
    this.nombreProducto = $('#nombreProducto');
    this.descripcionProducto = $('#descripcionProducto');
    this.puntosProducto = $('#puntosProducto');
    this.precioProducto = $('#precioProducto');
    this.stockProductoCatalogo = $('#stockProductoCatalogo');
    this.stockProducto = $('#stockProducto');
    this.stockCatalogo = $('#stockCatalogo');
    this.modalStockProductoCatalogo = $('#modalStockProductoCatalogo');
    this.modalCatalogo = $('#modalCatalogo');
    this.frmStockProductoCatalogo = $('#frmStockProductoCatalogo');
    this.frmCatalogo = $('#frmCatalogo');
    this.chkIlimitado = $('#chkIlimitado');
    this.chkIlimitadoProducto = $('#chkIlimitadoProducto');
    this.chkIlimitadoCatalogo = $('#chkIlimitadoCatalogo');
    this.idProductoCatalogo = $('#idProductoCatalogo');
    this.btnActualizarStock = $('#btnActualizarStock');
    this.btnAgregarCatalogo = $('#btnAgregarCatalogo');
    this.slcCatalogo = $('#slcCatalogo');
    this.btnModalAgregarCatalogo = $('#btnModalAgregarCatalogo');
    this.btnNuevoProducto = $('#btnNuevoProducto');
    this.tabProducto = $('#tabProducto');
    this.tabImagenes = $('#tabImagenes');
    this.tabCatalogos = $('#tabCatalogos');
    this.idNetsuite = $('#idNetsuite');
}

ProductosDetalle.prototype.init = function() {
    this.handle();
    this.initValidations();
    this.initCatalogos();
};

ProductosDetalle.prototype.handle = function() {
    var obj = this;
    $.fn.modal.Constructor.prototype._enforceFocus = function() {};

    obj.categoriaProducto.select2({
        placeholder: "Seleccionar"
    });
    obj.marcaProducto.select2({
        placeholder: "Seleccionar"
    });
    obj.slcCatalogo.select2({
        dropdownParent: $('#modalCatalogo .modal-content'),
        dropdownAutoWidth : true,
        width: '100%',
        placeholder: "Seleccionar",
        minimumResultsForSearch: -1
    });
    obj.tipoProducto.select2({
        placeholder: "Seleccionar",
        minimumResultsForSearch: -1
    });

    $(document).on('click', '.btnRemove', function(e) {
        e.preventDefault();
        $(this).parent().parent().remove();
    });

    obj.btnAdd.on('click', function(e) {
        e.preventDefault();
        $(this).parent().parent().parent().append(obj.makeInput($(this).attr('data-class')));
    });

    var imagenDefecto = obj.imagenPrincipal.attr('data-uri');
    var imagenDetalleDefecto = obj.imagenDetalle.attr('data-uri');

    obj.makeFileInput(obj.imagenPrincipal, '#principalError');
    obj.makeFileInput(obj.imagenDetalle, '#detalleError');

    obj.btnGuardarInfo.on('click', function(e) {
        e.preventDefault();

        var objValidateInfo = obj.validateInfo(this);
        if (objValidateInfo.status) {
            obj.actualizarInfoProducto(objValidateInfo);
        } else if (objValidateInfo.mensaje != null) {
            Promotick.toast.warning(objValidateInfo.mensaje, 'Informacion de producto')
        }
    });

    obj.btnGuardarImagen.on('click', function(e) {
        e.preventDefault();

        var objValidateImagenes = obj.validateImagenes(this);
        if (objValidateImagenes.status) {
            obj.cargaImagenes(objValidateImagenes);
        } else if (objValidateImagenes.mensaje != null) {
            Promotick.toast.warning(objValidateImagenes.mensaje, 'Carga de imagenes')
        }
    });

    obj.gridCatalogos.on('click','label.editCatalogo', function (e){
        var data = obj.gridCatalogos.dataTable().fnGetData($(this).parents('tr'));
        var stock = data.stockProductoCatalogo;
        obj.idProductoCatalogo.val(data.idProductoCatalogo);

        if (stock === -1) {
            obj.stockProductoCatalogo.val('Ilimitado');
            obj.stockProductoCatalogo.attr('disabled', true);
            obj.chkIlimitado.prop('checked', true);
        } else {
            obj.stockProductoCatalogo.val(stock);
            obj.chkIlimitado.prop('checked', false);
            obj.stockProductoCatalogo.attr('disabled', false);
        }
        obj.modalStockProductoCatalogo.modal();
    });

    obj.gridCatalogos.on('click','label.removeCatalogo', function (e){
        obj.gridCatalogos.DataTable()
            .row( $(this).parents('tr'))
            .remove()
            .draw();
    });

    obj.gridCatalogos.on('click', '.onoffswitch', function(e) {

        var $checkbox = $(this).parent().find('input[type=checkbox]');
        var checked = $checkbox.is(':checked');
        var idProductoCatalogo = $checkbox.attr('data-id');

        var estado = 'activar';
        if (checked) {
            estado = 'desactivar';
        }
        swal({
                title: $.camelCase("-" + estado),
                text: 'Estas seguro de ' + estado + ' a este producto ?',
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: 'Si, ' + estado + '!',
                cancelButtonText: "No, cancelar!",
                closeOnConfirm: false,
                closeOnCancel: true
            },
            function (isConfirm) {
                if (isConfirm){
                    obj.actualizarEstado(idProductoCatalogo, checked, $checkbox);
                }
            }
        );
    });

    obj.chkIlimitado.on('change', function() {
        if($(this).is(":checked")){
            obj.stockProductoCatalogo.val('Ilimitado');
            obj.stockProductoCatalogo.attr('disabled', true);
        } else {
            obj.stockProductoCatalogo.val('');
            obj.stockProductoCatalogo.attr('disabled', false);
            obj.stockProductoCatalogo.focus();
        }
    });

    obj.chkIlimitadoCatalogo.on('change', function() {
        if($(this).is(":checked")){
            obj.stockCatalogo.val('Ilimitado');
            obj.stockCatalogo.attr('disabled', true);
        } else {
            obj.stockCatalogo.val('');
            obj.stockCatalogo.attr('disabled', false);
            obj.stockCatalogo.focus();
        }
    });

    obj.chkIlimitadoProducto.on('change', function() {
        if($(this).is(":checked")){
            obj.stockProducto.val('Ilimitado');
            obj.stockProducto.attr('disabled', true);
        } else {
            obj.stockProducto.val('');
            obj.stockProducto.attr('disabled', false);
            obj.stockProducto.focus();
        }
    });

    obj.btnActualizarStock.on('click', function(e) {
        e.preventDefault();

        if (obj.frmStockProductoCatalogo.valid()) {
            obj.actualizarStockProductoCatalogo(this);
        } else {
            obj.frmStockProductoCatalogo.validate().focusInvalid();
        }
    });

    obj.btnAgregarCatalogo.on('click', function(e) {
        e.preventDefault();
        obj.modalCatalogo.modal();
    });

    obj.btnModalAgregarCatalogo.on('click', function(e) {
        e.preventDefault();

        if (obj.frmCatalogo.valid()) {

            var rowId = obj.gridCatalogos.dataTable().fnFindCellRowIndexes(obj.slcCatalogo.val(), 0);

            if (rowId.length === 0) {

                var stock = -1;
                if (!obj.chkIlimitadoCatalogo.is(':checked')) {
                    stock = obj.stockCatalogo.val()
                }

                var request = {
                    catalogo : {
                        idCatalogo : obj.slcCatalogo.val(),
                        nombreCatalogo : obj.slcCatalogo.text()
                    },
                    producto : {
                        idProducto : obj.idProducto.val()
                    },
                    stockProductoCatalogo : stock,
                    nuevo : true
                };

                if (obj.registro === 1) {
                    obj.gridCatalogos.DataTable().row.add(request).draw( false );
                    obj.modalCatalogo.modal('hide');
                } else {
                    obj.agregarCatalogo(this, request);
                }


            } else {
                Promotick.toast.warning('El catalogo "' + obj.slcCatalogo.text() + '" ya se encuentra registrado para este producto', 'Agregar Catalogo')
            }

        } else {
            obj.frmCatalogo.validate().focusInvalid();
        }
    });

    obj.modalCatalogo.on('hidden.bs.modal', function () {
        obj.frmCatalogo[0].reset();
        obj.slcCatalogo.select2("val", "");
        obj.stockCatalogo.attr('disabled', false);
        obj.chkIlimitadoCatalogo.prop('checked', false);
    });

    obj.btnNuevoProducto.on('click', function(e) {
        e.preventDefault();

        var objValidateInfo = obj.validateInfo(this);
        if (objValidateInfo.status) {

            var objValidateImagenes = obj.validateImagenes(this);
            if (objValidateImagenes.status) {

                var objValidateCatalogos = obj.validateCatalogos(this);
                if (objValidateCatalogos.status) {
                    obj.registrarProducto(objValidateInfo, objValidateImagenes, objValidateCatalogos);
                } else {
                    Promotick.toast.warning(objValidateCatalogos.mensaje, 'Creacion de catalogos');
                    obj.tabCatalogos.click();
                }

            } else if (objValidateImagenes.mensaje != null) {
                Promotick.toast.warning(objValidateImagenes.mensaje, 'Carga de imagenes');
                obj.tabImagenes.click();
            }

        } else if (objValidateInfo.mensaje != null) {
            Promotick.toast.warning(objValidateInfo.mensaje, 'Informacion de producto');
            obj.tabProducto.click();
        }

    })
};

ProductosDetalle.prototype.actualizarEstado = function(idProductoCatalogo, checked, $checkbox) {
    var obj = this;

    var request = {
        idProductoCatalogo : idProductoCatalogo,
        estadoProductoCatalogo : checked ? 1 : -1
    };


    var $button = document.querySelector( 'button.confirm');
    var loader = null;

    Promotick.ajax.post({
        url : obj.uri + 'catalogos/productos/actualizar-estado-pc',
        data : JSON.stringify(request),
        messageError : true,
        messageTitle : 'Actualizacion de Estado',
        before : function() {
            loader = Ladda.create($button);
            loader.start();
        },
        success : function(response) {
            if (response.status) {
                Promotick.toast.success(response.message, 'Actualizacion de Estado');
                $checkbox.prop('checked', !checked);
            }
        },
        complete : function() {
            loader.stop();
            swal.close();
        }
    });
};


ProductosDetalle.prototype.makeFileInput = function(instance, idError) {
    var imagenDefault = instance.attr('data-default');
    var imagen = instance.attr('data-uri');
    instance.fileinput({
        overwriteInitial: true,
        maxFileSize: 5*1204,
        showClose: false,
        showCaption: false,
        browseLabel: '',
        removeLabel: '',
        browseIcon: '<i class="glyphicon glyphicon-folder-open"></i>',
        removeIcon: '<i class="glyphicon glyphicon-remove"></i>',
        removeTitle: 'Cancelar o limpiar cambios',
        browseClass : 'btn btn-primary btn-upload input-file-button',
        removeClass : 'btn btn-secondary btn-upload input-file-button',
        elErrorContainer: idError,
        msgErrorClass: 'alert alert-block alert-danger',
        defaultPreviewContent: '<img src="' + imagen + '" alt="" style="max-height: 250px">',
        layoutTemplates: {main2: '{preview} {remove} {browse}'},
        allowedFileExtensions: ["jpg", "png", "gif", "jpeg"]
    });

    var $objImg = instance.parent().parent().find('.file-preview').find('.file-default-preview').find('img');

    var image = new Image();
    image.src = imagen;
    image.onload = function() {
        $objImg.attr('src', imagen);
    };
    image.onerror = function() {
        $objImg.attr('src', imagenDefault);
    }
};

ProductosDetalle.prototype.initCatalogos = function() {
    var obj = this;

    if (obj.registro === 1) {
        obj.gridCatalogos.dataTable({
            "bProcessing" : false,
            "bFilter" : false,
            "bLengthChange": false,
            "bPaginate": false,
            "bInfo" : false,
            "serverSide" : false,
            "bSort": false,
            "columns" : [
                {"data" : "catalogo.idCatalogo", "orderable": false, "sClass": "text-center"},
                {"data" : "catalogo.nombreCatalogo", "orderable": false},
                {"data" : "stockProductoCatalogo", "orderable": false, "sClass": "text-center", "render" : function(data, type, full){
                        if (data === -1) {
                            return 'Ilimitado';
                        }
                        return data + ' unidades';
                    }
                },
                {"data" : null, "orderable": false, "sClass": "text-center"},
                {"data" : "estadoProductoCatalogo", "orderable": false, "render" : obj._formatEstadoSwitch},
                {"data" : null, "orderable": false, "sClass": "text-center", "render" : function(data, type, full){
                        return '<label class="btn btn-danger btn-xs removeCatalogo" style="margin: 0"><i class="fa fa-remove"></i></label>';
                    }}
            ],
            'columnDefs' : [
                { targets: [3, 4], visible: false }
            ]
        });
    } else {
        obj.gridCatalogos.dataTable({
            "bProcessing" : true,
            "bFilter" : false,
            "bLengthChange": false,
            "bPaginate": false,
            "bInfo" : false,
            "serverSide" : true,
            "bSort": false,
            "ajax": {
                "url" : obj.uri + 'catalogos/productos/listar-catalogos-producto',
                "type": "POST",
                "data" : function(d) {
                    d.idProducto = obj.idProducto.val();
                }
            },
            "columns" : [
                {"data" : "catalogo.idCatalogo", "orderable": false, "sClass": "text-center"},
                {"data" : "catalogo.nombreCatalogo", "orderable": false},
                {"data" : "stockProductoCatalogo", "orderable": false, "sClass": "text-center", "render" : function(data, type, full){
                        if (data === -1) {
                            return 'Ilimitado';
                        }
                        return data + ' unidades';
                    }
                },
                {"data" : null, "orderable": false, "sClass": "text-center", "render" : function(data, type, full){
                        return '<label class="btn btn-primary btn-xs editCatalogo" style="margin: 0"><i class="fa fa-edit"></i></label>';
                    }},
                {"data" : "estadoProductoCatalogo", "orderable": false, "render" : obj._formatEstadoSwitch},
                {"data" : null, "orderable": false, "sClass": "text-center"}
            ],
            'columnDefs' : [
                { targets: [5], visible: false }
            ]
        });
    }

};

ProductosDetalle.prototype.validateInfo = function(e) {
    var obj = this;

    var objValid = {
        status : false,
        request : null,
        mensaje : null,
        handle : e
    };

    var especificaciones = null;
    $(document).find('input.especificacionesProducto').each(function(i, e) {
        var value = $(e).val();
        if (value !== '') {
            if (especificaciones == null) {
                especificaciones = value;
            } else {
                especificaciones += '|' + value;
            }
        }
    });

    var terminos = null;
    $(document).find('input.terminosProducto').each(function(i, e) {
        var value = $(e).val();
        if (value !== '') {
            if (terminos == null) {
                terminos = value;
            } else {
                terminos += '|' + value;
            }
        }
    });

    if (obj.formProducto.valid()) {
        if (terminos == null) {
            objValid.mensaje = 'Ingrese al menos un termino de producto';
        } else if (especificaciones == null){
            objValid.mensaje = 'Ingrese al menos una especificacion de producto';
        } else {
            objValid.status = true;

            var stockProducto = -1;

            if(obj.chkIlimitadoProducto.is(":not(:checked)")){
                stockProducto = obj.stockProducto.val();
            }

            objValid.request = {
                idProducto : obj.idProducto.val(),
                codigoWeb : obj.codigoWeb.val() ,
                nombreProducto : obj.nombreProducto.val(),
                descripcionProducto : obj.descripcionProducto.val(),
                puntosProducto : obj.puntosProducto.val(),
                precioProducto : obj.precioProducto.val(),
                tipoProducto : {
                    idTipoProducto : obj.tipoProducto.val()
                },
                marca : {
                    idMarca : obj.marcaProducto.val()
                },
                categoria : {
                    idCategoria : obj.categoriaProducto.val()
                },
                especificacionesProducto : especificaciones,
                terminosProducto : terminos,
                stockProducto : stockProducto,
                idNetsuite : obj.idNetsuite.val()
            };

        }
    } else {
        obj.formProducto.validate().focusInvalid();
    }

    return objValid;
};

ProductosDetalle.prototype.validateImagenes = function(e) {
    var obj = this;

    var objValid = {
        status : false,
        mensaje : null,
        handle : e,
        formData : null
    };


    if (obj.imagenPrincipal[0].files.length === 0 && obj.imagenDetalle[0].files.length === 0) {
        objValid.mensaje = 'Seleccione al menos una imagen para cargar';
    } else {
        var data = new FormData();
        $.each($('#imagenPrincipal')[0].files, function(i, file) {
            data.append('imagenPrincipal', file);
        });

        $.each($('#imagenDetalle')[0].files, function(i, file) {
            data.append('imagenDetalle', file);
        });

        data.append('idProducto', obj.idProducto.val());

        objValid.formData = data;
        objValid.status = true;
    }

    return objValid;
};

ProductosDetalle.prototype.initValidations = function() {
    var obj = this;

    obj.formProducto.validate({
        rules : {
            codigoWeb : {
                required : true,
                minlength : 3
            },
            nombreProducto : {
                required : true,
                minlength : 5
            },
            descripcionProducto : {
                required : true,
                minlength : 5
            },
            puntosProducto : {
                required : true,
                digits: true
            },
            precioProducto : {
                required : true,
                number: true
            },
            idNetsuite : {
                required : true
            },
            tipoProducto : {
                required : true,
                min : 1
            },
            marcaProducto : {
                required : true,
                min : 1
            },
            categoriaProducto : {
                required : true,
                min : 1
            },
            stockProducto : {
                required: {
                    depends: function (element) {
                        return obj.chkIlimitadoProducto.is(':not(:checked)')
                    }
                },
                digits: true
            }
        },
        messages : {
            codigoWeb : {
                required : 'Ingrese un codigo web',
                minlength : 'Ingrese al menos 3 caracteres'
            },
            nombreProducto : {
                required : 'Ingrese el nombre del producto',
                minlength : 'Ingrese al menos 5 caracteres'
            },
            descripcionProducto : {
                required : 'Ingrese la descripcion del producto',
                minlength : 'Ingrese al menos 5 caracteres'
            },
            puntosProducto : {
                required : 'Ingrese los puntos para el producto',
                digits: 'Ingrese un numero entero positivo'
            },
            precioProducto : {
                required : 'Ingrese el precio del producto',
                number: 'Ingrese un numero'
            },
            idNetsuite : {
                required : 'Ingrese el ID de netsuite'
            },
            tipoProducto : {
                required : 'Seleccione un tipo de producto',
                min : 'Seleccione un tipo de producto',
            },
            marcaProducto : {
                required : 'Seleccione una marca para el producto',
                min : 'Seleccione una marca para el producto',
            },
            categoriaProducto : {
                required : 'Seleccione un categoria para el producto',
                min : 'Seleccione un categoria para el producto'
            },
            stockProducto : {
                required : 'Ingrese un stock para el producto',
                digits: 'Se permiten solo numeros positivos'
            }
        }
    });

    obj.frmStockProductoCatalogo.validate({
        rules : {
            stockProductoCatalogo : {
                required: {
                    depends: function (element) {
                        return obj.chkIlimitado.is(':not(:checked)')
                    }
                },
                digits: true
            }
        },
        messages : {
            stockProductoCatalogo : {
                required : 'Ingrese un Stock',
                digits: 'Ingrese un numero entero positivo'
            }
        }
    });

    obj.frmCatalogo.validate({
        rules : {
            slcCatalogo : {
                required : true,
                min : 1
            },
            stockCatalogo : {
                required: {
                    depends: function (element) {
                        return obj.chkIlimitadoCatalogo.is(':not(:checked)')
                    }
                },
                digits: true
            }
        },
        messages : {
            slcCatalogo : {
                required : 'Seleccione un catalogo',
                min : 'Seleccione un catalogo'
            },
            stockCatalogo : {
                required : 'Ingrese un Stock',
                digits: 'Ingrese un numero entero positivo'
            }
        }
    });

};

ProductosDetalle.prototype.actualizarInfoProducto = function(objValidateInfo) {
    var obj = this;

    var loader = null;

    Promotick.ajax.post({
        url : obj.uri + 'catalogos/productos/actualizar-producto',
        data : JSON.stringify(objValidateInfo.request),
        messageError : true,
        messageTitle : 'Actualizacion de producto',
        before : function() {
            loader = Ladda.create(objValidateInfo.handle);
            loader.start();
        },
        success : function(response) {
            if (response.status) {
                Promotick.toast.success(response.message, 'Actualizacion de producto');
                $('html, body').animate({scrollTop:0}, 'slow');
            }
        },
        complete : function() {
            loader.stop();
        }
    });
};

ProductosDetalle.prototype.cargaImagenes = function(objValidateImagenes) {
    var obj = this;

    var loader = null;

    Promotick.ajax.post({
        url : obj.uri + 'catalogos/productos/cargar-imagenes',
        data : objValidateImagenes.formData,
        processData : false,
        contentType : false,
        messageError : true,
        messageTitle : 'Carga de imagenes',
        before : function() {
            loader = Ladda.create(objValidateImagenes.handle);
            loader.start();
        },
        success : function(response) {
            if (response.status) {
                Promotick.toast.success(response.message, 'Carga de imagenes');
                $('html, body').animate({scrollTop:0}, 'slow');
            }
        },
        complete : function() {
            loader.stop();
        }
    });
};

ProductosDetalle.prototype._formatEstadoSwitch = function(data, type, full) {
    var estado = '';
    var checked= '';

    if(data === 1){
        checked = 'checked';
    }
    estado += '<div class="switch">';
    estado +=   '<div class="onoffswitch">';
    estado +=       '<input type="checkbox" ' + checked + ' disabled class="onoffswitch-checkbox" id="s-' + full.idProductoCatalogo + '" data-id="' + full.idProductoCatalogo + '">';
    estado +=       '<label class="onoffswitch-label" for="s-' + full.idProductoCatalogo + '">';
    estado +=           '<span class="onoffswitch-inner"></span>';
    estado +=           '<span class="onoffswitch-switch"></span>';
    estado +=       '</label>';
    estado +=   '</div>';
    estado += '</div>';

    return estado;
};

ProductosDetalle.prototype.actualizarStockProductoCatalogo = function(handle) {
    var obj = this;

    var stock = obj.chkIlimitado.is(":checked") ? -1 : obj.stockProductoCatalogo.val();

    var request = {
        idProductoCatalogo : obj.idProductoCatalogo.val(),
        stockProductoCatalogo : stock
    };

    var loader = null;

    Promotick.ajax.post({
        url : obj.uri + 'catalogos/productos/actualizar-stock',
        data : JSON.stringify(request),
        messageError : true,
        messageTitle : 'Actualizacion de Stock',
        before : function() {
            loader = Ladda.create(handle);
            loader.start();
        },
        success : function(response) {
            if (response.status) {
                Promotick.toast.success(response.message, 'Actualizacion de Stock');
                obj.gridCatalogos.DataTable().ajax.reload();
                obj.modalStockProductoCatalogo.modal('hide');
            }
        },
        complete : function() {
            loader.stop();
        }
    });
};

ProductosDetalle.prototype.validateCatalogos = function(e) {
    var obj = this;
    var objValid = {
        status : false,
        request : null,
        mensaje : null,
        handle : e
    };

    var catalogos = '';

    if (obj.gridCatalogos.DataTable().rows().data().length <= 0) {
        objValid.mensaje = 'Es necesario al menos un catalogo para la creacion del producto';
    } else {
        $.each(obj.gridCatalogos.DataTable().rows().data(), function(i, e) {

            if (e != null) {
                var separator = ';';
                if (i === 0) {
                    separator = '';
                }

                catalogos += separator + e.catalogo.idCatalogo + '|' + e.stockProductoCatalogo;
            }
        });

        objValid.request = {
            catalogos : catalogos
        };

        objValid.status = true;
    }

    return objValid;
};

ProductosDetalle.prototype.registrarProducto = function(validateInfo, validateImagenes, validateCatalogo) {
    var obj = this;

    $.each(validateInfo.request, function (key, val) {
        validateImagenes.formData.append(key, val);
    });

    validateImagenes.formData.append('idCategoria', validateInfo.request.categoria.idCategoria);
    validateImagenes.formData.append('idMarca', validateInfo.request.marca.idMarca);
    validateImagenes.formData.append('idTipoProducto', validateInfo.request.tipoProducto.idTipoProducto);


    $.each(validateCatalogo.request, function (key, val) {
        validateImagenes.formData.append(key, val);
    });

    var loader = null;

    Promotick.ajax.post({
        url : obj.uri + 'catalogos/productos/registrarProducto',
        data : validateImagenes.formData,
        processData : false,
        contentType : false,
        messageError : true,
        messageTitle : 'Registro de producto',
        before : function() {
            loader = Ladda.create(validateImagenes.handle);
            loader.start();
        },
        success : function(response) {
            if (response.status) {
                Promotick.toast.success(response.message, 'Registro de producto');
                $('html, body').animate({scrollTop:0}, 'slow');

                setTimeout(function() {
                    window.location.href = obj.uri + 'catalogos/productos?accion=crear';
                }, 1000);
            }
        },
        complete : function() {
            loader.stop();
        }
    });
};

ProductosDetalle.prototype.agregarCatalogo = function(handle, request) {
    var obj = this;

    var loader = null;

    Promotick.ajax.post({
        url : obj.uri + 'catalogos/productos/registrarProductoCatalogo',
        data : JSON.stringify(request),
        messageError : true,
        messageTitle : 'Registro de catalogo',
        before : function() {
            loader = Ladda.create(handle);
            loader.start();
        },
        success : function(response) {
            if (response.status) {
                Promotick.toast.success(response.message, 'Registro de catalogo');
                obj.gridCatalogos.DataTable().ajax.reload();
                obj.modalCatalogo.modal('hide');
            }
        },
        complete : function() {
            loader.stop();
        }
    });
};

ProductosDetalle.prototype.makeInput = function(clazz) {
   var $input = $('<div/>').addClass('input-group margin-bottom-input');
   $input.append($('<input/>').addClass('form-control').addClass(clazz).attr('type', 'text'));
   $input.append($('<span/>').addClass('input-group-append')
       .append($('<button/>').attr('type', 'button')
           .addClass('width-button-input btn btn-danger btnRemove')
           .append($('<i/>').addClass('fa fa-minus')).append(' Borrar'))
   );
   return $input;
};
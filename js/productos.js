var uriGeneral;
function Productos(uri) {
    this.uri = uri;
    uriGeneral = uri;
    this.grid = $('#gridProductos');
    this.btnFiltrar = $('#btnFiltrar');
    this.buscarProducto = $('#buscarProducto');
    this.btnAccion = $('.btnAccion');
    this.btnEnviarNotificacion = $('#btnEnviarNotificacion');
    this.alert = null;
}

Productos.prototype.init = function() {
    this.handle();
    this.listarProductos();
};

Productos.prototype.handle = function() {
    var obj = this;

    obj.btnFiltrar.on('click', function(e){
        e.preventDefault();
        obj.gridReload();
    });

    obj.btnAccion.on('click', function(e) {
        e.preventDefault();
        window.location.href = $(this).attr('data-url');
    });

    obj.btnEnviarNotificacion.on('click', function(e) {
        e.preventDefault();

        swal({
                title: 'Notificacion de productos',
                text: 'Estas seguro de enviar notificacion de productos nuevos a todos los participantes ?',
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: 'Si, enviar!',
                cancelButtonText: "No, cancelar!",
                closeOnConfirm: false,
                closeOnCancel: true
            },
            function (isConfirm) {
                if (isConfirm){
                    obj.enviarNotificacion();
                }
            }
        );
    });

    $(document).on('click', '.onoffswitch', function(e) {

        var $checkbox = $(this).parent().find('input[type=checkbox]');
        var checked = $checkbox.is(':checked');
        var idMarca = $checkbox.attr('data-id');

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
                    obj.actualizarEstado(idMarca, checked, $checkbox);
                }
            }
        );
    });
};

Productos.prototype.actualizarEstado = function(idProducto, checked, $checkbox) {
    var obj = this;

    var request = {
        idProducto : idProducto,
        estadoProducto : checked ? 1 : -1
    };

    var $button = document.querySelector( 'button.confirm');
    var loader = null;

    Promotick.ajax.post({
        url : obj.uri + 'catalogos/productos/actualizar-estado',
        data : JSON.stringify(request),
        messageError : true,
        messageTitle : 'Actualizacion Estado',
        before : function() {
            loader = Ladda.create($button);
            loader.start();
        },
        success : function(response) {
            if (response.status) {
                Promotick.toast.success(response.message, 'Actualizacion Estado');
                $checkbox.prop('checked', !checked);
            }
        },
        complete : function() {
            loader.stop();
            swal.close();
        }
    });
};

Productos.prototype.listarProductos = function(){
    var obj = this;
    obj.grid.DataTable({
        // "bProcessing" : true,
        "bFilter" : false,
        "bLengthChange": false,
        "bPaginate": true,
        "bInfo" : true,
        "serverSide" : true,
        "bSort": false,
        "ajax": {
            "url" : obj.uri + 'catalogos/productos/listar-productos',
            "type": "POST",
            "data" : function(d) {
                d.buscar = obj.buscarProducto.val();
            }
        },
        "columns" : [
            {"data" : "nombreProducto", "orderable": false, "render" : this._formatNombre},
            {"data" : "nombreCatalogo", "orderable": false},
            {"data" : "tipoProducto.nombreTipoProducto", "orderable": false},
            {"data" : "codigoWeb", "orderable": false},
            {"data" : "nombreMarca", "orderable": false},
            {"data" : "categoria.nombreCategoria", "orderable": false},
            {"data" : "puntosProducto", "orderable": false},
            {"data" : "precioProducto", "orderable": false},
            {"data" : "stockProducto", "orderable": false, "render" : obj._formatStock},
            {"data" : "estadoProducto", "orderable": false,"class":"estado", "render" : obj._formatEstadoSwitch},
        ],
        "lengthMenu": [[10, 15, 20], [10, 15, 20]],
        "initComplete":function(settings,json){
        },
        "fnDrawCallback": function(){

        }
    });
};

Productos.prototype._formatNombre = function(data, type, full) {
    var obj = this;
    return '<a href="' + uriGeneral + 'catalogos/productos/' + full.idProducto + '"><u>' + data + '</u></a>';
};

Productos.prototype._formatStock = function(data, type, full) {
    if (data === -1) {
        return 'Ilimitado';
    }
    return data;
};

Productos.prototype._formatEstadoSwitch = function(data, type, full) {
    var estado = '';
    var checked= '';

    if(data === 1){
        checked = 'checked';
    }
    estado += '<div class="switch">';
    estado +=   '<div class="onoffswitch">';
    estado +=       '<input type="checkbox" ' + checked + ' disabled class="onoffswitch-checkbox" id="s-' + full.idProducto + '" data-id="' + full.idProducto + '">';
    estado +=       '<label class="onoffswitch-label" for="s-' + full.idProducto + '">';
    estado +=           '<span class="onoffswitch-inner"></span>';
    estado +=           '<span class="onoffswitch-switch"></span>';
    estado +=       '</label>';
    estado +=   '</div>';
    estado += '</div>';

    return estado;
};

Productos.prototype.gridReload = function(){
    this.grid.DataTable().ajax.reload();
};


Productos.prototype.enviarNotificacion = function() {
    var obj = this;

    var $button = document.querySelector( 'button.confirm');
    var loader = null;

    Promotick.ajax.get({
        url : obj.uri + 'catalogos/productos/enviarNotificacion',
        messageError : true,
        messageTitle : 'Enviar notificacion',
        before : function() {
            loader = Ladda.create($button);
            loader.start();
        },
        success : function(response) {
            if (response.status) {
                Promotick.toast.success(response.message, 'Enviar notificacion');
            }
        },
        complete : function() {
            loader.stop();
            swal.close();
        }
    });
};
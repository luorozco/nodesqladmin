document.addEventListener("DOMContentLoaded", () => {
    var grid = new FancyGrid({
        theme: 'bootstrap',
        title: 'Usuarios',
        width: '1150',
        height: 'fit',
        renderTo: 'users',
        trackOver: true,
        selModel: 'rows',
        tbar: [{
            type: 'search',
            width: 350,
            emptyText: 'Buscar',
            paramsMenu: true,
            paramsText: 'Parámetros',
        }],
        data: {
            proxy: {
                type: 'rest',
                url: '/auth/users/data.json',
                writer: {
                    type: 'json',
                    allFields: true,
                }
            }
        },
        defaults: {
            type: 'string',
            resizable: true,
            ellipsis: false
        },
        paging: true,
        clicksToEdit: 1,
        columnLines: false,
        columnClickData: true,
        columns: [{
            index: 'username',
            title: 'Usuario',
            flex: 1,
        }, {
            index: 'role',
            editable: true,
            title: ' Rol',
            type:'combo',
            data: ['MODERADOR','ADMINISTRADOR'],
            flex: 1
        },{
            index: 'last_connection',
            title: 'Última conexión',
            flex: 1,
        },{
            type: 'action',
            title: 'Acciones',
            width:150,
            items: [{
                text: 'Borrar usuario',
                cls: 'action-column-remove',
                action: 'remove',
            }],
        }]
    });
})
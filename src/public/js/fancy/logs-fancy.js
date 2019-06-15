document.addEventListener("DOMContentLoaded", () => {
    var grid = new FancyGrid({
        theme: 'bootstrap',
        title: 'Logs',
        width: '1150',
        height: 'fit',
        renderTo: 'logs',
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
                url: '/logs/data.json',
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
        sortable: true,
        columns: [{
            index: 'username',
            title: 'Usuario',
            flex: 1,
        }, {
            index: 'date',
            title: 'Fecha',
            flex: 1,
        }, {
            index: 'description',
            title: ' Descripción',
            flex: 1,
        }, {
            index: 'name_variable',
            title: 'Nombre variable',
            flex: 1,
        },{
            index: 'old_value',
            title: 'Valor antiguo',
            flex: 1,
        },{
            index: 'new_value',
            title: 'Valor nuevo',
            flex: 1,
        }]
    });
});
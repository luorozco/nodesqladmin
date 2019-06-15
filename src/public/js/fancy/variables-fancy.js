document.addEventListener("DOMContentLoaded", () => {
    var grid = new FancyGrid({
        theme: 'bootstrap',
        title: 'Variables',
        width: '1150',
        height: 'fit',
        renderTo: 'variables',
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
                url: '/variables/data.json',
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
        clicksToEdit: 1, // Esto permite editar una celda dandole click
        columnLines: false,
        columnClickData: true,
        columns: [{
            index: 'variable_name',
            title: 'Nombre de variable',
            sortable: true,
            flex: 1,
        }, {
            index: 'variable_value',
            title: 'Valor actual',
            editable: true, // Esta columna es editable, es decir, toda celda de esta columna se puede modificar
            flex: 1,
        }, {
            index: 'min_value',
            title: ' Valor mínimo'
        }, {
            index: 'max_value',
            title: 'Valor máximo'
        }]
    });
});
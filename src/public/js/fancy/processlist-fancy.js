document.addEventListener("DOMContentLoaded", () => { // document.addEventListener("DOMContentLoaded") es un método que espera a un evento (en este caso que el DOM se cargue por completo)
    var grid = new FancyGrid({ // Clase de FancyGrid
        theme: 'bootstrap', // El Tema que usará la tabla
        title: 'Lista de procesos',
        width: '1150',
        height: 'fit',
        renderTo: 'processlist', // El target donde se renderizará la tabla (en este caso, el div con id processlist)
        trackOver: true,
        selModel: 'row', // Aquí se puede especificar el modo de selección. En este caso es selección de fila
        tbar: [{ // La cabecera de la tabla y obtiene una lista con objetos. El primer y único objeto que le hemos introducido es para añadir una barra de búsqueda
            type: 'search',
            width: 350,
            emptyText: 'Buscar',
            paramsMenu: true, // Desplegar un menú para seleccionar por qué columna se va a buscar
            paramsText: 'Parámetros', // Texto del botón
        }],
        // Los datos los obtenemos desde la API creada anteriormente
        data: {
            proxy: {
                autoLoad: false, // Si los datos se cargan nada mas iniciar. Por defecto es true pero en este caso, como quiero que la tabla se recargue cada tiempo, prefiero elegir yo cuando se carga.
                type: 'rest', // Tipo de API
                url: '/processlist/data', // La ruta de donde obtenemos los objetos JSON
                writer: { // Para especificar que, cuando enviemos algo al servidor, será en formato JSON
                    type: 'json',
                    allFields: true, // Esto envía todas las columnas al servidor
                }
            }
        },
        defaults: { // Los parámetros por defecto
            type: 'string', // Todos los campos serán tipo string
            resizable: true, // Se puede ajustar su tamaño
            ellipsis: true // Esto habilita puntos suspensivos para textos que sobresalgan del campo
        },
        paging: true, // Habilita la paginación
        columnLines: false, // Deshabilita los separadores entre las columnas
        columns: [{ // Aquí se definen las columnas que tendrá la tabla. Index es el nombre del dato recibido dentro del objeto JSON y title el nombre que tendrá la columna.
            index: 'id',
            title: 'ID',
            flex: 1, // Autoajuste de ancho
        }, {
            index: 'user',
            title: 'Usuario',
            flex: 1,
        }, {
            index: 'host',
            title: 'Host',
            flex: 1,
        }, {
            index: 'db',
            title: 'Base de datos',
            flex: 1,
        }, {
            index: 'command',
            title: 'Comando',
            flex: 1,
        }, {
            index: 'time',
            title: 'Tiempo',
            flex: 1,
        }, {
            index: 'state',
            title: 'Estado',
            flex: 1,
        }, {
            index: 'info',
            title: 'Info',
            flex: 1,
        },{
            type: 'action',
            flex: 1,
            items: [{
                text: 'Cerrar proceso',
                cls: 'action-column-remove',
                action: 'remove'
            }]
        }]
    });
    grid.load();
    function reloadData(){
        grid.clearData();
        grid.load();
    }
    setInterval(reloadData, 5000);
});
/**
 * @class KPI
 * @extends Ext.data.Model
 * The KPI model is the representing the KPI (Key Performance Indicator) of XS (Executive Score Card)
 */
Ext.regModel("KPI", {
    fields: [
        {name: "id",             type: "int"},
        {name: "name",           type: "string"},
        {name: "status",         type: "string"},
        {name: "value", 		 type: "int"},
        {name: "green_start",	 type: "int"},
        {name: "green_end",  	 type: "int"},
        {name: "yellow_start", 	 type: "int"},
        {name: "yellow_end", 	 type: "int"},
        {name: "red_start",      type: "int"},
        {name: "red_end",        type: "int"},
        {name: "direction",      type: "string"},
        {name: "partner_id",     type: "int"},
    ],
    
    proxy: {
        type: 'xs',
        
        reader: {
            type: 'json',
            root: 'query.results.kpis'
        }
    }
});
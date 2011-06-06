/**
 * @class Loan
 * @extends Ext.data.Model
 * The Loan model is the only model we need in this simple application. We're using a custom Proxy for
 * this application to enable us to consume Kiva's JSON api. See lib/KivaProxy.js to see how this is done
 */
Ext.regModel("Loan", {
    fields: [
        {name: "id",             type: "int"},
        {name: "number",	type: "int"},
        {name: "name",      type: "string"},
        {name: "symbol",    type: "string"},
        {name: "weight",    type: "int"},
        {name: "chart",     type: "string"},
        {name: "category",  type: "string"},
        {name: "categories",type: "string"},
    ],
    
    proxy: {
        type: 'ajax',
        url: '../ajax',
        reader: {
            type: 'json',
            root: 'weather'
        }
    }
});
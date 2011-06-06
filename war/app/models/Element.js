/**
 * @class Element
 * @extends Ext.data.Model
 * The Element model is the only model we need in this simple application.
 */

Ext.regModel("Element", {
    fields: [
        {name: "number",	type: "int"},
        {name: "name",      type: "string"},
        {name: "symbol",    type: "string"},
        {name: "weight",    type: "int"},
        {name: "chart",     type: "string"},
        {name: "category",  type: "string"},
        {name: "categories",type: "string"},
    ],
    
    proxy: {
        type: 'elements',
        
        reader: {
            type: 'json',
            root: 'query.results.elements'
        }
    }
});
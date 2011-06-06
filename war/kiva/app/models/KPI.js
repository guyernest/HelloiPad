/**
 * @class KPI
 * @extends Ext.data.Model
 * The KPI model is the interesting model in our application
 */
Ext.regModel("KPI", {
    fields: [
        {name: "Value",             type: "int"},
        {name: "Unit_Type",      type: "string"},
        {name: "ID",	type: "int"},
        {name: "KPI",      type: "string"},
        {name: "Score",    type: "int"},
        {name: "Trend",    type: "int"},
        {name: "Objective",  type: "string"},
        {name: "Perspective",type: "string"},
        {name: "Description",type: "string"},
    ],
       
    proxy: {
        type: 'ajax',
        url: '../kpi',
        reader: {
            type: 'json',
            root: 'kpis'
        }
    }
});
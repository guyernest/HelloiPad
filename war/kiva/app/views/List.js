/**
 * @class kiva.views.List
 * @extends Ext.List
 * 
 * This simple Ext.List subclass is used to display the Loans that are returned from Kiva's API. The largest
 * part of this class is the XTemplate used to render each item - all other functionality is already provided
 * by Ext.List
 */
kiva.views.List = Ext.extend(Ext.DataView, {
    emptyText   : 'No loans matching that query.',

    ui: 'kiva',
    
    /**
     * Ext.List can take a tpl configuration, which allows us to customize the look and feel of our list. In this case
     * we've set up a simple template and added a custom function (percentFunded), which allows us to do simple view logic
     * inside the template. See the XTemplate docs for more (http://dev.sencha.com/deploy/touch/docs/?class=Ext.XTemplate)
     */
    tpl: new Ext.XTemplate(
//    	'<tpl for=".">',
//		    '<div class="element {categories}" data-symbol="{symbol}" data-category="{category}">',
//		      '<p class="number">{number}</p>',
//		      '<h3 class="symbol">{symbol}</h3>', 
//		      '<h2 class="name">{name}</h2>',
//		      '<p class="weight">({weight})</p>', 
//		      '<p><img alt="chart" src="{chart}"/></p>',
//		    '</div>',
//         '</tpl>',

     	'<tpl for=".">',
		    '<div class="element {Perspective}" data-symbol="{Objective}" data-score="{Score}" data-category="{Perspective}">',
		      '<p class="number">{Value}</p>',
		      '<h3 class="symbol">{Objectivel}</h3>', 
		      '<h2 class="name">{KPI}</h2>', 
		      '<div id="xs-bar-{ID}" class="chart">  </div>',
		      '<span class="xs-status-{[this.getStatus(values)]}"></span>',
		    '</div>',
	    '</tpl>',

        {
            /**
             * Returns the status
             *              * @param {Object} data The Loan data
             * @return {Number} The status (-1,0,1)
             */
     		getStatus: function(data) {
 
                var score     = data.Score;
                if (score < 4) {
                	return -1;
                } else if (score < 7) {
                	return 0;
                } 
                
                return 1;
            }
        }
    ),
    
    itemSelector:'div.element',

    
    /**
     * initComponent is called whenever any class is instantiated. It is normal to add some logic here to set up
     * our component - in this case we're defining a Store and adding the filter toolbar at the top.
     */
    initComponent: function() {
        Ext.applyIf(this, {
            store: new Ext.data.Store({
                model: "KPI",
                autoLoad: true,
                remoteFilter: true
            })
        });
    
        kiva.views.List.superclass.initComponent.apply(this, arguments);
        
        this.enableBubble('selectionchange');
//        this.enableBubble('itemtap');
    }
});

Ext.reg('loansList', kiva.views.List);
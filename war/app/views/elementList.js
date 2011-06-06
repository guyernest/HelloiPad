/**
 * @class elements.views.List
 * @extends Ext.List
 * 
 * This simple Ext.List subclass is used to display the Elements that are returned from elements's API. The largest
 * part of this class is the XTemplate used to render each item - all other functionality is already provided
 * by Ext.List
 */
elements.views.List = Ext.extend(Ext.List, {
    emptyText   : 'No elements matching that query.',

    ui: 'elements',
    
    /**
     * Ext.List can take a tpl configuration, which allows us to customize the look and feel of our list. 
     * See the XTemplate docs for more (http://dev.sencha.com/deploy/touch/docs/?class=Ext.XTemplate)
     */
    itemTpl: new Ext.XTemplate(
	    	'<div class="element {categories}" data-symbol="{symbol}" data-category="{category}">', 
	      		'<p class="number">{number}</p>', 
	      		'<h3 class="symbol">{symbol}</h3>', 
	      		'<h2 class="name">{name}</h2>', 
	      		'<p class="weight">({weight})</p>', 
	      		'<p><img alt="chart" src="{chart}"/></p>',
	    	'</div>', 
	    ),
    
    /**
     * initComponent is called whenever any class is instantiated. It is normal to add some logic here to set up
     * our component - in this case we're defining a Store and adding the filter toolbar at the top.
     */
    initComponent: function() {
        Ext.applyIf(this, {
            store: new Ext.data.Store({
                model: "Element",
                autoLoad: true,
                remoteFilter: true
            })
        });
    
        elements.views.List.superclass.initComponent.apply(this, arguments);
        
        this.enableBubble('selectionchange');
    }
});

Ext.reg('elementsList', elements.views.List);
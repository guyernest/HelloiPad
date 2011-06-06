/**
 * @class kiva.views.LoanFilter
 * @extends Ext.form.FormPanel
 * 
 * This form enables the user to filter the types of Loans visible to those that they are interested in.
 * 
 * We add a custom event called 'filter' to this class, and fire it whenever the user changes any of the
 * fields. The loans controller listens for this event and filters the Ext.data.Store that contains the
 * Loans based on the values selected (see the onFilter method in app/controllers/loans.js).
 * 
 */
kiva.views.LoanFilter = Ext.extend(Ext.form.FormPanel, {
    ui: 'green',
    cls: 'x-toolbar-dark',
    baseCls: 'x-toolbar',
    
    initComponent: function() {
        this.addEvents(
            /**
             * @event filter
             * Fires whenever the user changes any of the form fields
             * @param {Object} values The current value of each field
             * @param {Ext.form.FormPanel} form The form instance
             */
            'filter', 
            
            'scorecard'
        );
        
        var thisForm = this;
        
        this.enableBubble('filter');
        this.enableBubble('scorecard');
        
        Ext.apply(this, {
            defaults: {
                listeners: {
                    change: this.onFieldChange,
                    click: this.onClick,
                    scope: this
                }
            },
            
            layout: {
                type: 'hbox',
                align: 'center'
            },
            items: [
                {
                    xtype: 'button',
                    text: 'Scorecard',
                    handler: function() {
                    	console.log('Scorecard click');
                    	thisForm.onClick(this);
                    } 
                },
                {
                    xtype: 'selectfield',
                    name: 'sector',
                    prependText: 'Sector:',
                    options: [
                        {text: 'All',            value: '*'},
                        {text: 'Customer',       value: '.Customer'},
                        {text: 'Operational Excellence',       value: '.Operational'},
                        {text: 'IT Value',       value: '.IT'}
                    ]
                },
                {
                    xtype: 'spacer'
                },
                {
                    xtype: 'selectfield',
                    fieldLabel: 'Sort by:',
                    name: 'sort_by',
                    prependText: 'Sort by:',
                    options: [
                        {text: 'Sort By:',           value: 'score'},
                        {text: 'Score',           value: 'score'},
                        {text: 'Category',		   value: 'category'},
                        {text: 'Value',           value: 'number'},
                        {text: 'Name',       	   value: 'name'}
                    ]
                },
                {
                    xtype: 'spacer'
                },
                {
                    xtype: 'searchfield',
                    name: 'q',
                    placeholder: 'Search',
                    listeners : {
                        change: this.onFieldChange,
                        keyup: function(field, e) {
                            var key = e.browserEvent.keyCode;
                            
                            // blur field when user presses enter/search which will trigger a change if necessary.
                            if (key === 13) {
                                field.blur();
                            }
                        },
                        scope : this
                    }
                }
            ]
        });
            
        kiva.views.LoanFilter.superclass.initComponent.apply(this, arguments);
    },
    
    /**
     * This is called whenever any of the fields in the form are changed. It simply collects all of the 
     * values of the fields and fires the custom 'filter' event.
     */
    onFieldChange : function(comp, value) {
        this.fireEvent('filter', this.getValues(), this);
    },
    
    onClick : function(comp) {
    	console.log("onClick");
        this.fireEvent('scorecard', this);
    }

});

Ext.reg('loanFilter', kiva.views.LoanFilter);
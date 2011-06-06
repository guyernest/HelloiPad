/**
 * @class loans
 * @extends Ext.Controller
 * 
 * The only controller in this simple application - this simply sets up the fullscreen viewport panel
 * and renders a detailed overlay whenever a Loan is tapped on.
 */
Ext.regController("loans", {

    /**
     * Renders the Viewport and sets up listeners to show details when a Loan is tapped on. This
     * is only expected to be called once - at application startup. This is initially called inside
     * the app.js launch function.
     */
    list: function() {
        this.listView = this.render({
            xtype: 'kivaMain',
            listeners: {
                scope : this,
                filter: this.onFilter,
                scorecard: this.onClick,
                selectionchange: this.onSelected
            }
        }, Ext.getBody()).down('.loansList');
        var aId = this.listView.getEl().first().id;
        console.log(aId);
        $container = $('#'+aId);
        //$container = $('#ext-gen1028');
        
        this.listView.store.on('load', this.onLoad, this);
    },

    
    onLoad: function() {
        $container.isotope({ 
        	itemSelector : '.element',
    		sortBy : 'score',
        	getSortData : {
                score : function( $elem ) {
                	var scoreValue = parseInt($elem.attr('data-score'));
                	return scoreValue;
                },
                number : function( $elem ) {
                    return parseInt( $elem.find('.number').text(), 10 );
                },
                name : function ( $elem ) {
                  return $elem.find('.name').text();
                },
                category : function( $elem ) {
                    return $elem.attr('data-category');
                }
        	}
        });
        var items = this.listView.store.data.items;
        for (var i =0; i < items.length; i++) {
        	var item = items[i].raw;
	    	var bar = new CChart.Gauge({
 	            container: document.getElementById("xs-bar-"+item.ID),
 	            width: 150,
 	            height: 150,
 	            rangeFrom: item.Range_From,
 	            rangeTo: item.Range_To,
 	            ranges: [
 	   	              { from: item.Range_From, to: item.Range_To, color: CChart.Color.red },
 	   	              { from: item.Warning_From, to: item.Warning_To, color: CChart.Color.orange },
 	 	              { from: item.Good_From, to: item.Good_To, color: CChart.Color.green }
 	            ],
 	            value: item.Value,
 	            status: CChart.Status.warning,
 	            trend: CChart.Trend.down,
 	            chartName: "FY2011JW19",
 	            valueTitle: item.Unit_Type,
                axisFontColor: "#FFF",
                fontColor: "#FFF",
                animation: false,
                titleVisibility: true
 	        }).Draw();

        }
    	
    },
 
    /**
     * Shows a details overlay for a given Loan. This creates a single reusable detailView and simply
     * updates it each time a Loan is tapped on.
     */
    show: function(options) {
        var view = this.detailView;
        
        if (!view) {
            this.detailView = this.render({
                xtype: 'loanShow',
                listeners: {
                    scope: this,
                    hide : function() {
                        this.listView.getSelectionModel().deselectAll();
                    }
                }
            }, false);
            
            view = this.detailView;
        }
        
        view.setLoan(options.instance);
        view.show();
    },
    
    /**
     * Shows a details overlay for a given Loan. This creates a single reusable detailView and simply
     * updates it each time a Loan is tapped on.
     */
    scorecard: function(options) {
        var sc = this.cardView;
        
        if (!sc) {
            this.cardView = this.render({
                xtype: 'ScoreCard',
                listeners: {
                    scope: this,
                    hide : function() {
                    	// Do something
                    }
                }
            }, false);
            
            sc = this.cardView;
        }
        sc.setData(this.listView.store.data.items);
        sc.show();
    },
    
    /**
     * @private
     * Listener for the 'filter' event fired by the listView set up in the 'list' action. This simply
     * gets the form values that the user wants to filter on and tells the Store to filter using them.
     */
    onFilter: function(values, form) {
//    	if (!values.sort_by || values.sort_by.length == 0)
//    		values.sort_by = 'number';
    	console.log('Sort:'+values.sort_by);
	    $container.isotope({ 
				sortBy : values.sort_by,
				sortAscending : true
		});
	    $container.isotope({ 
			filter: values.sector
	    });
	
	    return;

    },
    
    /**
     * @private
     * Causes the Loan details overlay to be shown if there is a Loan selected
     */
    onSelected: function(selectionModel, records) {
        var loan = records[0];
        
        if (loan) {
            this.show({
                instance: loan
            });
        }
    },

    /**
     * @private
     * Causes the Loan details overlay to be shown if there is a Loan selected
     */
    onClick: function(button) {
        console.log('onClick triggerd');
		this.scorecard();
    }


});
/**
 * @class kiva.views.LoanInfo
 * @extends Ext.Sheet
 * 
 * We use this Ext.Sheet subclass to display information about a particular Loan when the user has tapped on it.
 * Ext.Sheet is an overlay class that slides in from above, below or one of the sides, usually in response to a
 * user action such as tapping on a list item.
 * 
 * In this class we set the sheet up to be modal (masks the rest of the page) and to enter and exit from the 
 * right hand edge of the screen. It hides itself when the user taps on the modal mask (via the hideOnMaskTap config).
 * 
 * Inside the class we have an Ext.Carousel with three cards - details, payments and map. Each card is set up
 * inside its own function to make it easy to see what is going on. The LoanInfo sheet is rendered and shown by
 * the loan controller's 'show' action (see app/controllers/loans.js).
 * 
 */
kiva.views.LoanInfo = Ext.extend(Ext.Sheet, {
    modal: true,
    centered : false,
    hideOnMaskTap : true,
    
    cls: 'loaninfo',
    layout: 'fit',
    enter: 'bottom',
    exit: 'bottom',
    
    // we always want the sheet to be 400px wide and to be as tall as the device allows
    height: 500,
    stretchX : true,
    
    /**
     * Here we just set up the items that will go in the carousel and add a button to make it easy for the
     * user to lend money to the loanee.
     */
    initComponent: function() {
        Ext.apply(this, {
            items: {
                xtype: 'carousel',
                items: [
                    this.getDetailsCard(),
//                    this.getPaymentsCard(),
                    this.getMapCard()
                ]
            },
            
            dockedItems: [{
                xtype: 'button',
                text: 'Send as E-mail',
                ui: 'action',
                dock: 'right'
            },
            {
                xtype: 'button',
                text: 'Add Annotation',
                ui: 'action',
                dock: 'right'
            },{ 
                xtype: 'button',
                text: 'Mark Up',
                ui: 'action',
                dock: 'right'
            }
            ]
        });
    
        kiva.views.LoanInfo.superclass.initComponent.apply(this, arguments);
    },
    
    /**
     * Sets the Loan instance to be displayed in the cards. If this component has already been rendered,
     * the cards are updated immediately, otherwise they will be updated when the component is rendered
     * @param {Ext.data.Model} loan The Loan instance
     */
    setLoan: function(loan) {
        /**
         * @property instance
         * @type Ext.data.Model
         * The currently loaded Loan instance
         */
        this.instance = loan;
        
        if (this.rendered) {
            this.updateCards();
        } else {
            this.on('show', this.updateCards, this);
        }
    },
    
    /**
     * Returns an Ext.Component that displays details about the given loan
     * @return {Ext.Component} The details component
     */
    getDetailsCard: function() {
        return new Ext.Component({
            tpl: new Ext.XTemplate(
                '<h1>{KPI}</h1>',
  		      	'<p>{Description}</p>',
  		      	'<div id="history-chart"></div>',
                {compiled: true}
            ),
            
            itemId: 'detailsCard',
            scroll: 'vertical',
            styleHtmlContent: true,
            html: '',
            listeners : {
                activate : function() {
                    if (this.scroller) {
                        this.scroller.scrollTo({x:0, y:0});
                    }
                }
            }
        });
    },
    
    /**
     * Returns an Ext.Component that displays the payment schedule for the given loan
     * @return {Ext.Component} The payments component
     */
    getPaymentsCard: function() {
        return new Ext.Component({
            html: '',
            scroll: 'vertical',
            styleHtmlContent: true,
            itemId: 'paymentsCard',
            
            tpl: new Ext.XTemplate(
                '<h1>Repayment Schedule</h1>',
                {
                    compiled: true,
                    
                    /**
                     * Takes a date timestamp and formats it nicely for display
                     * @param {String} date The data string
                     * @return {String} The formatted date string
                     */
                    formatDueDate: function(date) {
                        var format = "j M Y",
                            parsed = Date.parseDate(date, 'c');
                        
                        return Ext.util.Format.date(parsed, format);
                    }
                }
            ),
            
            listeners : {
                activate : function() {
                    if (this.scroller) {
                        this.scroller.scrollTo({x:0, y:0});
                    }
                }
            }
        });
    },
    
    /**
     * Returns an Ext.Map centered on the location of the Loanee
     * @return {Ext.Map} The map component
     */
    getMapCard: function() {
        return new Ext.Map({
            itemId: 'mapCard',
            maskMap: true,
            
            mapOptions: {
                center: this.mapPosition,
                disableDefaultUI: true,
                zoom: 5
            },
            
            listeners : {
                activate : function() {
                    if (this.marker) {
                        this.update(this.marker.position);
                    }
                },
                resize : function() {
                    if (this.marker) {
                        this.update(this.marker.position);
                    }
                }
            }
        });
    },
    
    /**
     * @private
     * This is used internally by the component to update the contents of each card.
     */
    updateCards: function() {
        var detailsCard  = this.down("#detailsCard"),
            paymentsCard = this.down("#paymentsCard"),
            mapCard      = this.down("#mapCard"),
            loan         = this.instance,
//            coords       = loan.get('location').geo.pairs.split(' ').map(parseFloat);
        	coords		= [32.066283, 34.790611];
        
        //updates the text in the first two cards
        detailsCard.update(loan.data);
        var item = loan.raw;
    	var line = new CChart.Line({
	            container: document.getElementById("history-chart"),
	            width: 800,
	            height: 400,
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
	            title: item.KPI,
                axisValues: [
                    { "x": "Jan 2010", "y": 30, "tooltip": "30"  },
                    { "x": "", "y": 12, "tooltip": "12"  },
                    { "x": "", "y": 28, "tooltip": "28"  },
                    { "x": "", "y": 20 , "tooltip": "28"},
                    { "x": "", "y": 30, "tooltip": "28" },
                    { "x": "", "y": 22 , "tooltip": "28"},
                    { "x": "Jul 2010", "y": 25, "tooltip": "28" },
                    { "x": "", "y": 28, "tooltip": "28" },
                    { "x": "", "y": 45, "tooltip": "28" },
                    { "x": "", "y": 42, "tooltip": "28" },
                    { "x": "", "y": 49, "tooltip": "28" },
                    { "x": "", "y": 60, "tooltip": "28" },
                    { "x": "Jan 2011", "y": 77, "tooltip": "28" },
                    { "x": "", "y": 69, "tooltip": "28" },
                    { "x": "", "y": 60, "tooltip": "28" },
                    { "x": "", "y": 60, "tooltip": "28" },
                    { "x": "", "y": 55, "tooltip": "28" },
                    { "x": "Jul 2011", "y": 67, "tooltip": "28" },
                    { "x": "", "y": 43, "tooltip": "28" },
                    { "x": "", "y": 28, "tooltip": "28" },
                    { "x": "Oct 2011", "y": 30, "tooltip": "28" }
                ],
                xAxisLabelRotation: 0,
		        axisFontColor: "#FFF",
		        fontColor: "#FFF",
                titleVisibility: true
	        }).Draw();

//        paymentsCard.update(loan.data.terms.scheduled_payments);
        
        //if we already had an old marker, remove it now
        if (this.mapMarker) {
            this.mapMarker.setMap(null);
            delete this.mapMarker;
        }
        
        //add a marker for the Loanee's position on the map
        this.mapMarker = new google.maps.Marker({ 
            map: mapCard.map, 
            title : loan.get('name'),
            position: new google.maps.LatLng(coords[0], coords[1])  
        });
        
        mapCard.update(this.mapMarker.position);
        
//        //finally, update the link tied to the Lend $25 button
//        var url    = "http://www.kiva.org/lend/" + this.instance.getId(),
//            text   = Ext.util.Format.format('<a href="{0}" target="_blank">Lend 25$</a>', url),
//            button = this.getDockedItems()[0];
//        
//        button.setText(text);
    }
});

Ext.reg('loanShow', kiva.views.LoanInfo);
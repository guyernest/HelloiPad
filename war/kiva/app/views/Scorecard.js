/**
 * @class kiva.views.ScoreCard
 * @extends Ext.Sheet
 * 
 */
kiva.views.ScoreCard = Ext.extend(Ext.Sheet, {
    modal: true,
    centered : false,
    hideOnMaskTap : true,
    
    cls: 'scorecard',
    layout: 'fit',
    enter: 'left',
    exit: 'left',
    
    // we always want the sheet to be 400px wide and to be as tall as the device allows
    width: 550,
    stretchY : true,
    
    rows: [
           {
               title: "Financial",
               items: [
                   {
                       title: "Improve cost planned vs exec",
                       value: 6,
                       trend: CChart.Trend.up,
                       status: CChart.Status.warning
                   },
                   {
                       title: "Maintain non negative HC growth",
                       value: 2,
                       trend: CChart.Trend.down,
                       status: CChart.Status.error
                   }
               ]
           },
           {
               title: "Customers",
               items: [
                   {
                       title: "Improve customer satisfaction",
                       value: 1,
                       trend: CChart.Trend.same,
                       status: CChart.Status.error
                   },
               ]
           },
           {
               title: "Process",
               items: [
                   {
                       title: "Improve R&amp;D efficeiency",
                       value: 9,
                       trend: CChart.Trend.down,
                       status: CChart.Status.ok
                   },
                   {
                       title: "Improve defects handling time",
                       value: 5,
                       trend: CChart.Trend.same,
                       status: CChart.Status.warning
                   },
                   {
                       title: "Improve processing",
                       value: 9,
                       trend: CChart.Trend.down,
                       status: CChart.Status.ok
                   }
               ]
           },
           {
               title: "Quality",
               items: [
                   {
                       title: "Release XS with high quality",
                       value: 10,
                       trend: CChart.Trend.up,
                       status: CChart.Status.ok
                   },
                   {
                       title: "Status",
                       value: 10,
                       trend: CChart.Trend.same,
                       status: CChart.Status.ok
                   }

               ]
           },
       ],
    
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
                ]
            },
            
            dockedItems: [{
                xtype: 'button',
                text: 'Send as E-mail',
                ui: 'action',
                dock: 'bottom'
            },
            {
                xtype: 'button',
                text: 'Add Annotation',
                ui: 'action',
                dock: 'bottom'
            },{ 
                xtype: 'button',
                text: 'Mark Up',
                ui: 'action',
                dock: 'bottom'
            }
            ]
        });
    
        kiva.views.ScoreCard.superclass.initComponent.apply(this, arguments);
    },

    
    setData: function(kpis) {
        this.instance = kpis;
        
        if (this.rendered) {
            this.updateScoreCard();
        } else {
            this.on('show', this.updateScoreCard, this);
        }
    },

    updateScoreCard: function() {
        var detailsCard  = this.down("#scoreCard"),
        kpis         = this.instance;
        var perspectives = [];
        var perspectives = [];
        for (var k = 0; k < kpis.length; k++) {
        	if (perspectives.indexOf(kpis[k].raw.Perspective)==-1) {
        		perspectives.push(kpis[k].raw.Perspective);
        	}
        }
        detailsCard.update(this.rows);
        
        var item = kpis[0].raw;

    },

	/**
	 * Returns an Ext.Component that displays details about the given loan
	 * @return {Ext.Component} The details component
	 */
	getDetailsCard: function() {
		
		var objectiveTemplate = new Ext.XTemplate(
				'<tpl for="items">',
					'<div>{title}</div>',
				'</tpl>',
				{compile : true}
				);
		
	    return new Ext.Component({
	        tpl: new Ext.XTemplate(
//	             '<tpl for=".">',
//					'<h2>{title}</h2>',
//						'{[this.renderObjective(values)]}',
//					'<p></p>', 
//	    	    '</tpl>',
	        	'<div class="modalWin">',
	        		'<ul class="iconeMenu" data-role="header">',
	        		'<li id="cchart-list-btnall" class="first all"><a href="#" rel="external"></a></li>',
	        		'<li id="cchart-list-btnerror" class="error"><a href="#" rel="external"></a></li>',
	        		'<li id="cchart-list-btnwarning" class="last warning"><a href="#" rel="external"></a></li>',
	        	'</ul>',

	        	    '<table cellpadding="0" cellspacing="0" width="100%">',
		             '<tpl for=".">',
	        	    '<tr>',
	        		    '<th colspan="2">{title}</th>',
	        	    '</tr>',
	    				'<tpl for="items">',
	        	    '<tr>',
	        		    '<td>{title}</td>',
	        		    '<td width="70" class="alignx">{value}',
	                    '<img class="inlineImg" src="resources/images/{[this.getTrend(values)]}.png" />',
	                    '<img class="inlineImg" src="resources/images/{[this.getStatus(values)]}.png" /></td>',
	        	    '</tr>',
					'</tpl>',
		    	    '</tpl>',
	            '</table>',
	            '</div>',

	        		{
	            	 compiled: true,
	            	 getTrend : function(values) {
	            		 if (values.trend == CChart.Trend.up)
	            			 return 'upArrow';
	            		 else if (values.trend == CChart.Trend.down)
	            			 return 'downArrow';
	            		 else
	            			 return 'blankArrow';
	            	 },
	            	 getStatus : function(values) {
	            		 if (values.status == CChart.Status.ok)
	            			 return 'icon_ok';
	            		 else if (values.trend == CChart.Status.warning)
	            			 return 'icon_warning';
	            		 else
	            			 return 'icon_error';
	            	 }
	            }
	        ),
	        
	        itemId: 'scoreCard',
	        scroll: 'vertical',
	        styleHtmlContent: true,
	        html: '<div>ScoreCard</div>' +
	        '<div>Objective</div>',
	        listeners : {
	            activate : function() {
	                if (this.scroller) {
	                    this.scroller.scrollTo({x:0, y:0});
	                }
	            }
	        }
	    });
	}


});

Ext.reg('ScoreCard', kiva.views.ScoreCard);
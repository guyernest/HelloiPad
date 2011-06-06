Ext.setup({
    tabletStartupScreen: 'tablet_startup.png',
    phoneStartupScreen: 'phone_startup.png',
    icon: 'icon.png',
    glossOnIcon: false,
    
    onReady: function() {
        var tpl = Ext.XTemplate.from('weather');
        var $container;
        var makeAjaxRequest = function() {
            Ext.getBody().mask('Loading...', 'x-mask-loading', false);
            Ext.Ajax.request({
                url: 'test.json',
                success: function(response, opts) {
                    Ext.getCmp('content').update(response.responseText);
                    Ext.getCmp('status').setTitle('Static test.json file loaded');
                    Ext.getBody().unmask();
                }
            });
        };
        
        var makeJSONPRequest = function() {
            Ext.getBody().mask('Loading...', 'x-mask-loading', false);
            Ext.util.JSONP.request({
                url: 'http://www.worldweatheronline.com/feed/weather.ashx',
                callbackKey: 'callback',
                params: {                    
                    key: '0416ba258b073725111305',
                    // palo alto
                    q: '94301',
                    format: 'json',
                    num_of_days: 5
                },
                callback: function(result) {
                    var weather = result.data.weather;
                    if (weather) {
                        var html = tpl.applyTemplate(weather);
                        Ext.getCmp('content').update(html);                        
                    }
                    else {
                        alert('There was an error retrieving the weather.');
                    }
                    Ext.getCmp('status').setTitle('Palo Alto, CA Weather');
                    Ext.getBody().unmask();
                }
            });
        };

        var makeAppJSONPRequest = function() {
            Ext.getBody().mask('Loading App...', 'x-mask-loading', false);
            Ext.util.JSONP.request({
                url: 'ajax',
                callbackKey: 'callback',
                params: {                    
                    num_of_days: 5
                },
                callback: function(result) {
                    var weather = result.weather;
                    if (weather) {
                        var html = tpl.applyTemplate(weather);
                        Ext.getCmp('content').update(html);   
                        $container = $('#ext-gen1005');
                        $container.isotope(
                        		{ itemSelector : '.element'});
                    }
                    else {
                        alert('There was an error retrieving the weather.');
                    }
                    Ext.getCmp('status').setTitle('Server Palo Alto, CA Weather');
                    Ext.getBody().unmask();
                }
            });
        };

        var defects = function() {
//            var $container = $('#ext-gen1005');
            $container.isotope({filter: '.defects'});
            return false;
        };

        var financial = function() {
          $container.isotope({filter: '.financial'});
          return false;
      };

      var showAll = function() {
          $container.isotope({filter: '*'});
          return false;
      };

        new Ext.Panel({
            fullscreen: true,
            id: 'content',
            scroll: 'vertical',
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                items: 
                	[
                	 {
	                    text: 'JSONP',
	                    handler: makeJSONPRequest
                	 },
                	 {xtype: 'spacer'},
                	 {
 	                    text: 'JSONP-App',
 	                    handler: makeAppJSONPRequest
                 	 },
                	 {xtype: 'spacer'},
                	 {
                		 text: 'XMLHTTP',
                		 handler: makeAjaxRequest
                	 },
                	 {xtype: 'spacer'},
                	 {
                		 text: 'Defects',
                		 handler: defects
                	 },
                	 {xtype: 'spacer'},
                	 {
                		 text: 'Financial',
                		 handler: financial
                	 },
                	 {xtype: 'spacer'},
                	 {
                		 text: 'Show All',
                		 handler: showAll
                	 }
                	]
            },{
                id: 'status',
                xtype: 'toolbar',
                dock: 'bottom',
                title: "Tap a button above."
            }]
        });
    }
});
/*global PPI, YAHOO */

// Create namespace
var PPI = {};

// Create app..
PPI.app = function() {
	// Private objects..
	var throttled_process_id = 0, ppi_input, ppi_response;
	
	/**
	 * Handle keyup event on our textarea elem
	 * 
	 * We do ajax calls to PPI every throttle_interval microseconds
	 */ 
    var on_keyup = function(){
		// Clear any pending calls that haven't run yet
        clearTimeout(throttled_process_id);
				
		// Send a request to the server in throttle_interval microseconds
		// (unless another keyup event happens before then)
		throttled_process_id = setTimeout(that.send_request, that.cfg.throttle_interval);
    };
	
	// Public object
	var that = {};
	
	// Set config defaults
	that.cfg = {
		href: 'ppi.cgi',
		throttle_interval: 150 // time interval between ajax requests
	};
	
    /***
     * Initialise the controls on the page, subscribe to events etc..
     */
    that.init_page = function(){
		// Store some handy reference to out input/reponse elemenets..
    	ppi_input = document.getElementById('ppi-input');
		ppi_response = document.getElementById('ppi-response');
		
        // Wrap our textarea element in a pretty YUI Panel
        var ppi_input_panel = new YAHOO.widget.Panel('ppi-input-panel', {
            width: '100%',
            draggable: false,
            close: false
        });
        ppi_input_panel.render();
        
        // Wrap our response div element in a pretty YUI Panel
        var ppi_response_panel = new YAHOO.widget.Panel('ppi-response-panel', {
            width: '100%',
            draggable: false,
            close: false
        });
        ppi_response_panel.render();
        
        // Subscribe to keyup events on our textarea element
        YAHOO.util.Event.addListener('ppi-input-panel', 'keyup', on_keyup);
		
		// Add some simple resize handles to the textarea elem
		var ppi_input_resize = new YAHOO.util.Resize('ppi-input-resize', {
			handles: ['b']
		});
        ppi_input_resize.on('resize', function(ev) {
            var w = ev.width;
            var h = ev.height;
            ppi_input.style.height = (h - 5) + "px";
        });
		
		// And do the same for the response div
		var ppi_response_resize = new YAHOO.util.Resize('ppi-response-resize', {
			handles: ['b']
		});
        ppi_response_resize.on('resize', function(ev) {
            var w = ev.width;
            var h = ev.height;
            ppi_response.style.height = (h - 5) + "px";
        });
		
		// If the page was loaded with data, fake a keyup evevnt
		if (ppi_input.value && ppi_input.value.length > 0) {
			on_keyup();
		}
    };
    
	/**
	 * Send the plaintext string in our textarea elem to the server and
	 * handle the response
	 */
    that.send_request = function(){
		// URI-encode the plaintext string in our textarea elem
        var uri_encoded_data = encodeURIComponent(ppi_input.value);
		
		// Do the HTTP request (via POST so that we can handle large input)
        YAHOO.util.Connect.asyncRequest('POST', that.cfg.href, {
            success: function(o){
                ppi_response.innerHTML = o.responseText;
            },
			failure: function(o) {
				ppi_response.innerHTML = o.responseText;
            }
        }, 'src=' + uri_encoded_data);
    };
	
	return that;
}(); //singleton

YAHOO.util.Event.onDOMReady(PPI.app.init_page);

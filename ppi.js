/*global PPI, YAHOO */
PPI = new function(){
    var HREF = 'ppi.cgi';
    var throttled_process_id = 0;
	var THROTTLE_INTERVAL = 150; // time interval between ajax requests
    
    /***
     * Initialise the controls on the page, subscribe to events etc..
     */
    this.init = function(){
		// Store some handy reference to out input/reponse elemenets..
    	this.ppi_input = document.getElementById('ppi-input');
		this.ppi_response = document.getElementById('ppi-response');
		
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
        YAHOO.util.Event.addListener('ppi-input-panel', 'keyup', this.on_keyup, null, this);
		
		// Add some simple resize handles to the textarea elem
		var resize = new YAHOO.util.Resize('ppi-input-resize', {
			handles: ['b']
		});
		var ppi_input = this.ppi_input;
        resize.on('resize', function(ev) {
            var w = ev.width;
            var h = ev.height;
            ppi_input.style.height = (h - 5) + "px";
        });
		
		// If the page was loaded with data, fake a keyup evevnt
		if (ppi_input.value && ppi_input.value.length > 0) {
			this.on_keyup();
		}
    };
    
	/**
	 * Handle keyup event on our textarea elem
	 * 
	 * We do ajax calls to PPI every THROTTLE_INTERVAL microseconds
	 */ 
    this.on_keyup = function(){
		// Clear any pending calls that haven't run yet
        clearTimeout(throttled_process_id);
		
		// Grab a reference to 'this' for our closure below..
        var t = this;
		
		// Send a request to the server in THROTTLE_INTERVAL microseconds
		// (unless another keyup event happens before then)
        throttled_process_id = setTimeout(function(){
            t.send_request();
        }, THROTTLE_INTERVAL);
    };
    
	/**
	 * Send the plaintext string in our textarea elem to the server and
	 * handle the response
	 */
    this.send_request = function(){
		// URI-encode the plaintext string in our textarea elem
        var uri_encoded_data = encodeURIComponent(this.ppi_input.value);
		var ppi_response = this.ppi_response;
		
		// Do the HTTP request (via POST so that we can handle large input)
        YAHOO.util.Connect.asyncRequest('POST', HREF, {
            success: function(o){
                ppi_response.innerHTML = o.responseText;
            },
			failure: function(o) {
				ppi_response.innerHTML = o.responseText;
            }
        }, 'src=' + uri_encoded_data);
    };
}();
YAHOO.util.Event.onDOMReady(PPI.init, null, PPI);

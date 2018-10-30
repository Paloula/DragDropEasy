var demoGallery  = ( function(demoGalleryModule) {	
		var transferTimer = null;
		
		var updateCallback = function(response) {
				
				var responseJSON = JSON.parse(response);
				console.log(responseJSON.url);
				
				if (responseJSON.dragResult == "success") {
						demoGallery.hideMessages();
				} else if (responseJSON.dragResult == "failure") {
						showMessageError(responseJSON.errorMessage);
				} else if (typeof responseJSON.url !== "undefined") {
						var redirectUrl = responseJSON.url;
						window.location.href = redirectUrl;
				}
				
				console.log(responseJSON.dragResult);
		};

		demoGalleryModule.callBackDropped = function(dragDropProtocol) {			
				console.log("callbackDropped:");
				console.log(dragDropProtocol);				
				
				transferTimer = setTimeout(function() {
						showMessageTransfer();
				}, 1000);	
				
				ajaxShift(dragDropProtocol, updateCallback);
		};	
		
		var ajaxShift = function(dragDropProtocol, callBack) {
				
				$.ajax({
						type: "POST",
						dataType: "html",
						cache: false,
						url: "shift.shift", 
						data: jQuery.param({dragDropProtocol:JSON.stringify(dragDropProtocol)}),
						
						success: function(response) {  							
								callBack(response);									
						},								
						error: function(error) {
								//console.log("[Paloula] ajaxPagePartAlc error:" + error.responseText);
								var errorJSON = JSON.parse(error);
								showMessageError(error.errorMessage);
						},								
						complete: function(dataResponse) {
								
						}
				});
				
		};			
		
		var showMessageTransfer = function() {
				var $ajaxWait = $("DIV.ajax-wait");
				
				$ajaxWait.css({
						"display" : "block",
						"visibility" : "visible"
				})
				
				var $transfer = $("DIV#transfer");
				
				$transfer.css({
						"display" : "block",
						"visibility" : "visible"
				})
		};
		
		var showMessageError = function(message) {				
				var $ajaxWait = $("DIV.ajax-wait");
				
				$ajaxWait.css({
						"display" : "block",
						"visibility" : "visible"
				})

				var $transfer = $("DIV#transfer");
				
				$transfer.css({
						"display" : "none",
						"visibility" : "hidden"
				})
				
				var $error = $("DIV#error");
				
				$error.css({
						"display" : "block",
						"visibility" : "visible"
				})		

				var $errorMessage = $("P#ajaxErrorMessage");
				$errorMessage.text(message);
		};

		demoGalleryModule.hideMessages = function() {
				clearTimeout(transferTimer); 
				
				var $ajaxWait = $("DIV.ajax-wait");
				
				$ajaxWait.css({
						"display" : "none",
						"visibility" : "hidden"
				})
				
				var $transfer = $("DIV#transfer");
				
				$transfer.css({
						"display" : "none",
						"visibility" : "hidden"
				})
				
				var $error = $("DIV#error");
				
				$error.css({
						"display" : "none",
						"visibility" : "hidden"
				})
		}
		
		demoGalleryModule.changeSelect = function (value) {
				console.log(value)
				var multiselectActivation = false;

				if (value == "multiselcet") {
						multiselectActivation = true;
				}

				paloulaDDE.dragdrop.setMultiSelect(multiselectActivation);
		}	

		demoGalleryModule.changeCopyMode = function(value) {
				console.log(value);
				paloulaDDE.dragdrop.setMoveCopy(value);
		};		
		

				
		return demoGalleryModule; 
} (demoGallery || {}));
		
$(document).ready( function() { 
		$okButton = $("button.reload-button");
		
		$okButton.on( "click", function(event){		
				demoGallery.hideMessages();
				location.reload(); 
		});	
});		



	
	
	
	
				
				

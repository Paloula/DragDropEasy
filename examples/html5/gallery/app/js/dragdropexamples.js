var demoGallery  = ( function(demoGalleryModule) {	

		demoGalleryModule.callBackDropped = function(dragDropProtocol) {			
				console.log("callbackDropped:");
				console.log(dragDropProtocol);				
		};		
		
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



	
	
	
	
				
				

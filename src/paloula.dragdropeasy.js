var paloulaDDE = {};
paloulaDDE.dragdrop = ( function(dragdropModule) {	
		var DURATION_PLACEHOLDER_STANDARD = 400;
		
		var _durationHidePlaceholderInline = 400;		
		var _dragElement = null;		
		var _selectedDragIds = [];		
		
		var options = {
				multiSelect: false,
				copyMove: "move",
				copyRandomIdPrefix: "paloula-dde-randomid_",
				durationAnimateSelection: 200,
				dragDropModeActivated: true,
				callBackDropped: null
		};
		
		dragdropModule.handleSelection = function($dragElementToSelect) {
	
				if (options.dragDropModeActivated == true && options.multiSelect == true) {
						var dragElementId = $dragElementToSelect.attr("id");
						var isSelected = $dragElementToSelect.attr("data-isselected");
						
						if (isSelected == undefined) {
								$dragElementToSelect.attr("data-isselected", "true");
								var $selectedIcon = $($("<div class='paloula-selected'></div>"));
								$dragElementToSelect.append($selectedIcon);
								_selectedDragIds.push(dragElementId);
						} else {
								$dragElementToSelect.removeAttr("data-isselected");
								var $selectedIcon = $dragElementToSelect.find("DIV.paloula-selected");
								$selectedIcon.remove();
								removeFromSelectedDragIds(dragElementId);
						}
				}		
		};

		var removeFromSelectedDragIds = function (dragElementId) {
				var index = _selectedDragIds.indexOf(dragElementId);
				
				if (index !== -1) {
						_selectedDragIds.splice(index, 1);
				}			
		};
		
		var resetSelection = function() {
				
				$("[data-isselected = true]").each(function() {
							var $selectedElement = $(this);
							$selectedElement.removeAttr("data-isselected");
							var $selectedIcon = $selectedElement.find("DIV.paloula-selected");
							$selectedIcon.remove();				
				});
				
				_selectedDragIds = [];
		}
		
		var displaceElement = new function DisplaceElement () {
				var $displaceElement = null;
				var displacementElementType = null;
				var lastDisplaceElementId = null;
				var dropDirection = null;		
				var isLastDisplaceElement = false;
				var lastDisplacementElementType = null;
				var $dropArea = null;
				var dropAreaId = null;
				var dropAreaType = null;
				
				this.setEmptyDropArea = function($currentDropArea, currentDropAreaId, currentDropAreaType) {						
						displacementElementType = "EmptyDropArea";
						$displaceElement = null;
						lastDisplaceElementId = null;
						dropDirection = null;		
						isLastDisplaceElement = false;	
						$dropArea = $currentDropArea;
						dropAreaId = currentDropAreaId;
						dropAreaType = currentDropAreaType;
						clearPlaceholderElements();
				};
				
				this.setDisplacementElement = function($currentDropArea, currentDropAreaId, currentDropAreaType, $currentDisplaceElement, currentDisplaceElementId, currentDropDirection) {
						
						if ($displaceElement == null || lastDisplaceElementId != currentDisplaceElementId) {
								isLastDisplaceElement = false;								
						} else if (lastDisplaceElementId == currentDisplaceElementId && dropDirection == currentDropDirection ) {
								isLastDisplaceElement = true;								
						} else if (lastDisplaceElementId == currentDisplaceElementId && dropDirection != currentDropDirection ) {
								isLastDisplaceElement = false;
						}			
						
						displacementElementType = "DisplacementElement";
						$displaceElement = $currentDisplaceElement;
						lastDisplaceElementId = currentDisplaceElementId;
						dropDirection = currentDropDirection;		
						$dropArea = $currentDropArea;
						dropAreaId = currentDropAreaId;
						dropAreaType = currentDropAreaType;
						
						if (isLastDisplaceElement == false) {
								var $expandElementInline = $(".paloula-expanding-now-inline");
								
								if ($expandElementInline.length > 0) {		
										var displacementElementInDocument = paloulaDDE.dragdropScreen.elementInDocument($displaceElement);
										var displacementElementTop = displacementElementInDocument.top;
										var expandElementInlineInDocument = paloulaDDE.dragdropScreen.elementInDocument($expandElementInline);
										var expandElementInlineTop = expandElementInlineInDocument.top;
										
										if (displacementElementTop != expandElementInlineTop) {
												_durationHidePlaceholderInline = 0;
										} else {
												_durationHidePlaceholderInline = 400;
										}
										
								} else {
										_durationHidePlaceholderInline = 400;
								}								
								
								clearPlaceholderElements();		
								insertDisplaceElement(false);
						}						
						
				};	

				this.setDisplaceElementInitial = function() {
						displacementElementType = "DisplacementElement";
						$displaceElement =  _dragElement.get$DragElement();
						lastDisplaceElementId = _dragElement.getDragElementId();
						dropDirection = "before";						
						isLastDisplaceElement = false;	
						$dropArea = _dragElement.get$SourceDropArea();
						dropAreaId = $dropArea.attr("id");						
						dropAreaType = _dragElement.getDropAreaType();	

						insertDisplaceElement(true);
				}
				
				this.setOutOfDropArea = function() {
						displacementElementType = "OutOfDropArea";
						$displaceElement = null;
						lastDisplaceElementId = null;
						dropDirection = null;		
						isLastDisplaceElement = false;	
						$dropArea = null;
						dropAreaId = null;
						clearPlaceholderElements();
				};
				
				this.reset = function() {
						displacementElementType = null;;
						$displaceElement = null;
						lastDisplaceElementId = null;
						dropDirection = null;		
						isLastDisplaceElement = false;	
						$dropArea = null;
						dropAreaId = null;
						dropAreaType = null;
				}
				
				this.updateDisplaceElement = function() {
						checkDragElementOverDropArea();	
				};
				
				this.getDisplacementElementProperties = function() {
						displaceElementProperties = null;					
						
						var displaceElementProperties = {
								displacementElementType: displacementElementType,
								$displaceElement: $displaceElement,
								lastDisplaceElementId: lastDisplaceElementId,
								dropDirection: dropDirection,
								isLastDisplaceElement: isLastDisplaceElement,
								$dropArea: $dropArea,
								dropAreaId: dropAreaId,
								dropAreaType: dropAreaType,
						}		

						return displaceElementProperties;
						
				};		
			
				var insertDisplaceElement = function(isFirstInsert) {
						var $placeholderElement = get$PlaceholderExpandElement();
						var dragElementPositionInDocument = paloulaDDE.dragdropScreen.elementInDocument($displaceElement);
						var duration = DURATION_PLACEHOLDER_STANDARD;
						
						if (isFirstInsert == true) {
								duration = 0;
						}
						
						if (dropDirection == "before" ) {
								$displaceElement.before($placeholderElement);
						} else if (dropDirection == "after" ) {
								$displaceElement.after($placeholderElement);
						} 	
						
						
						if (dropAreaType == "inline") {	
								$placeholderElement.addClass("paloula-expanding-now-inline");
								var displaceElementWidth = dragElementPositionInDocument.outerWidth;	
								var displaceElementHeight = dragElementPositionInDocument.outerHeight;	
								
								$placeholderElement.css({
									"height" : displaceElementHeight + "px",
									"display" : "inline-block"
								});
								
								$placeholderElement.animate({
											width: displaceElementWidth + 'px'										
								}, {
											duration: duration,
											queue: false       
								});	
								
								if (isFirstInsert == true && options.copyMove == "move") {
										$displaceElement.animate({
													width: "0px"									
										}, {
													duration: 0,
													queue: false,  
													complete: function() {
															$displaceElement.css({
																	"visibility" : "hidden",
																	"display" : "none"
															})												
													}
										});	
								}
						}										

						if (dropAreaType == "vertical") {

								$placeholderElement.addClass("paloula-expanding-now-vertical");
								var displaceElementHeight = dragElementPositionInDocument.clientHeight;
								
								$placeholderElement.animate({
											height: displaceElementHeight + 'px'
								}, {
											duration: duration,
											queue: false       
								});
								
								if (isFirstInsert == true && options.copyMove == "move") {
										$displaceElement.animate({
													height: "0px"									
										}, {
													duration: 0,
													queue: false,  
													complete: function() {
															$displaceElement.css({
																	"visibility" : "hidden",
																	"display" : "none"
															})												
													}
										});								
								}
								
						} 	
					
				};
				
				var get$PlaceholderExpandElement = function() {
						var $placeholderElement = $($("<li class='paloula-dragdrop-element-expand paloula-expanding-now'></li>"));
						$placeholderElement.css({"background-color" : "rgba(255,255,255,0.0", "vertical-align" : "middle", "border": "none"});
						
						return $placeholderElement;
				};

		}
		
		var checkDragElementOverDropArea = function() {
				var dropAreaProperties = paloulaDDE.dropArea.getDropArea();			
				var isOverDropArea = dropAreaProperties.isOverDropArea;
				
				if (isOverDropArea == true) {
						setDisplaceElementOverDropArea(dropAreaProperties);				
				} else if (isOverDropArea == false) {						
						displaceElement.setOutOfDropArea();						
				}
		};

		var setDisplaceElementOverDropArea = function(dropAreaProperties) {
				var numberOfDropElements = dropAreaProperties.numberOfDropElements;
				var dropAreaType = dropAreaProperties.dropAreaType;
				
				if (numberOfDropElements == 0) {
						var $dropArea = dropAreaProperties.$dropArea;
						var dropAreaId = dropAreaProperties.dropAreaId;								
						var dropAreaType = dropAreaProperties.dropAreaType;
						displaceElement.setEmptyDropArea($dropArea, dropAreaId, dropAreaType);
						
				} else if (numberOfDropElements > 0) {								
						
						if (dropAreaType == "inline") {
								paloulaDDE.dropArea.searchPossibleDropElementInline(dropAreaProperties);
						}								
						
						if (dropAreaType == "vertical") {
								paloulaDDE.dropArea.searchPossibleDropElementVerical(dropAreaProperties);
						}
				}		
		};
		
		var clearPlaceholderElements = function() {		
					
				$(".paloula-expanding-now-vertical").each( function() {
							var $dragDropExpandElement = $(this);
							$dragDropExpandElement.clearQueue();
							
							$dragDropExpandElement.animate({
										height: '0px'
							}, {
									duration: DURATION_PLACEHOLDER_STANDARD,
									queue: false,
									complete: function() {$dragDropExpandElement.remove()}
							});
				});				
				
				
				$(".paloula-expanding-now-inline").each( function() {
							var $dragDropExpandElement = $(this);
							$dragDropExpandElement.clearQueue();
							
							$dragDropExpandElement.css({
									"background-image" : "none"
							});
							
							$dragDropExpandElement.animate({
										width: '0px'
							}, {
									duration: _durationHidePlaceholderInline,
									queue: false,
									complete: function() {$dragDropExpandElement.remove()}
							});
				});
				
		};
		
		function DragElement($dragElement, event) {
				var event = event;
				var $dragElement = $dragElement;
				var dragElementId = $dragElement.attr("id");
				var $dragElementClone = $dragElement.clone();
				var $sourceDropArea = null;
				var sourceDropAreaId = null;
				var $dragElementDragFrame = null;	
				var dragElementDragFrame = null;	
				var dropAreaType = null;
				var droppedElementId = null;
				var dragElementToMouseLeft = 0;
				var dragElementToMouseTop = 0;	
				
				var dragStartHandling = function() {
						$sourceDropArea = $dragElement.closest("UL.paloula-dragdrop-list");
						sourceDropAreaId = $sourceDropArea.attr("id");
						$dragElementDragFrame = $dragElement.closest("UL.paloula-dragdrop-list").clone().empty();
						dragElementDragFrame = $dragElementDragFrame.get(0);
						dropAreaType = paloulaDDE.dropArea.getDropAreaTypeByDropArea($dragElementDragFrame);
				};
				
				var setDragDummy = function() {							
						$dragElementClone.addClass("paloula-dragdrop-absolute");
						
						$dragElementClone.css({
								//"background-color" : "#FF0000",
								//"filter" : "alpha(opacity=60)",	
								//"opacity" : "0.6",
								
								"margin-left" : "0",
								"margin-top" : "0",
								"margin-right" : "0",
								"margin-bottom" : "0",
								"overflow-x" : "hidden",
								"overflow-y" : "hidden"
						})				

						$dragElementDragFrame.append($dragElementClone);
							
						setDragFrameCss();
						setDragFrameAttributes();
						setDragCloneAttributes();
						setDragElementCloneSelectedNumber();
						
				};
				
				var setDragCloneAttributes = function() {
						var dragElementDimensions = paloulaDDE.dragdropScreen.elementInDocument($dragElement);		
						var dragElementWidth = dragElementDimensions.width;
						var dragElementHeight = dragElementDimensions.height;

						$dragElementClone.attr("data-origin-width", dragElementWidth);
						$dragElementClone.attr("data-origin-height", dragElementHeight);
						$dragElementClone.attr("id", "dragElementClone"); 
						$dragElementClone.attr("data-dragelement-id", dragElementId);
				};
				
				var setDragFrameCss = function() {						
						var dragElementDimensions = paloulaDDE.dragdropScreen.elementInDocument($dragElement);
						var leftCorner = dragElementDimensions.left
						var topCorner = dragElementDimensions.top;						
						var dragElementWidth = dragElementDimensions.width;
						var dragElementHeight = dragElementDimensions.height;
						var windowScrollWidth = parseInt(document.documentElement.scrollWidth);
						var viewportWidth = window.innerWidth;
						var maxWidth;
						
						if (windowScrollWidth > viewportWidth) {
								maxWidth = viewportWidth * 0.8;
						} else {
								maxWidth = dragElementWidth;
						}

						$dragElementDragFrame.css({
								"position" : "absolute",
								"left" : leftCorner + "px",
								"top" : topCorner + "px",
								"overflow-x" : "hidden",
								"overflow-y" : "hidden",
								"width" : dragElementWidth,
								"height" : dragElementHeight,
								"min-height" : dragElementHeight,
								"max-height" : dragElementHeight,
								"padding-left" : "0",
								"padding-top" : "0",
								"padding-right" : "0",
								"padding-bottom" : "0",
								"margin-left" : "0",
								"margin-top" : "0",
								"margin-right" : "0",
								"margin-bottom" : "0",
								"transform" : "scale(90%,90%)",
								"max-width" : maxWidth
								
						});						
				};
				
				var setDragFrameAttributes = function() {
						$dragElementDragFrame.addClass("paloula-dragdrop-absolute");						
						$dragElementDragFrame.attr("id", "dragElementParentClone"); 
				};
				
				var setDragElementCloneSelectedNumber = function() {
						var appendNumber = 1;						
						var dragElementSelected = $dragElementClone.find("DIV.paloula-selected").length;
						
						if (dragElementSelected == 1) {
								appendNumber = 0;
						}
						
						var selectedDragElementsNr = _selectedDragIds.length + appendNumber;
						var $selectedNrOf = $($("<div class='paloula-nr-of-selected'>" + selectedDragElementsNr + "</div>"));
						$dragElementClone.append($selectedNrOf);						
				};
				
				var setDragElementToMouse = function() {
						var dragElementToMouse = paloulaDDE.dragdropScreen.elementToMouse(event, $dragElement);
						dragElementToMouseTop = dragElementToMouse.distTop;
						dragElementToMouseLeft = dragElementToMouse.distLeft;
				};
				
				this.insertDragFrame = function() {
						$("BODY").append($dragElementDragFrame);	
				}
				
				this.setPosition = function(event) {
						var dragElementInDocument = paloulaDDE.dragdropScreen.elementInDocument($dragElementDragFrame);
						var dragElementLeft = dragElementInDocument.left;		
						var dragElementRight = dragElementInDocument.right;		
						var dragElementTop = dragElementInDocument.top;		
						var dragElementBottom = dragElementInDocument.bottom;		
						var dragElementWidth = dragElementInDocument.width;	
						var dragElementHalfWidth = dragElementWidth/2;	
						var dragElementHeight = dragElementInDocument.height;	
						var dragElementHalfHeight = dragElementHeight/2;
						var mouseInDocument = paloulaDDE.dragdropScreen.mouseInDocument(event);						
						var newLeftCorner = mouseInDocument.left - dragElementToMouseLeft;
						var newTopCorner = mouseInDocument.top - dragElementToMouseTop;
						var dragElementInViewport = paloulaDDE.dragdropScreen.elementInViewport($dragElementDragFrame);
						var middleTop = dragElementInViewport.top + dragElementHalfHeight;
						var middleBottom = dragElementInViewport.bottom - dragElementHalfHeight;
						var middleLeft = dragElementInViewport.left + dragElementHalfWidth;
						var middleRight = dragElementInViewport.right - dragElementHalfWidth;
						var viewportHeight = paloulaDDE.dragdropScreen.getViewportHeightWithToolbar();
						var viewportWidth = paloulaDDE.dragdropScreen.getViewportWidth();
						var windowInnerHeight =0;
						/*
						paloulaDDE.screenConsole.log(
									{headline: "viewportHeight", value: paloulaDDE.dragdropScreen.getViewportHeight()},
									{headline: "viewportHeightWithToolbar", value: viewportHeight}
						);						
						*/
						
						if (dragElementBottom > viewportHeight) {
								document.body.style.overflowY = "hidden";
						} else {
								document.body.style.overflowY = "auto";
						}
						
						if (newTopCorner < dragElementTop && middleTop > 0) {
								dragElementDragFrame.style.top =  newTopCorner + "px";
						}
						
						if (newTopCorner > dragElementTop && middleBottom < viewportHeight) {
								dragElementDragFrame.style.top =  newTopCorner + "px";
						}
						
						if (dragElementRight > viewportWidth) {
								document.body.style.overflowX = "hidden";
						} else {
								document.body.style.overflowX = "auto";
						}
						
						if (newLeftCorner < dragElementLeft && middleLeft > 0) {
								dragElementDragFrame.style.left =  newLeftCorner + "px";
						}
						
						if (newLeftCorner > dragElementLeft && middleRight < viewportWidth) {
								dragElementDragFrame.style.left =  newLeftCorner + "px";
						}
				};
			
				var animateDragElementToWidthHeight = function(width, height, display) {
						$dragElement.css({
									"display" : display
						});
						
						$dragElement.animate({
									width: width + "px",								
									height: height + "px",								
						}, {
									duration: 400,
									queue: false,  
									complete: function() {
											
											$dragElement.css({
													"visibility" : "visible",
											})												
									}
						});
				};
				
				var animateDragFrameToPosition = function(left, top, completeFunction) {
						
						$dragElementDragFrame.animate({
									left: left + 'px',										
									top:  top + 'px',
						}, {
									duration: 400,
									queue: false,
									complete: function() {
											completeFunction();
									}											
						});
				};					
				
				var animateDragFrameToPositionAndWidth = function(left, top, width, completeFunction, $dropArea, displaceElementId, dropDirection) {
						
						$dragElementDragFrame.animate({
									left: left + 'px',	
									top: top + 'px',
									width: width + "px"
						}, {
									duration: 200,
									queue: false,
									complete: function() {
											completeFunction($dropArea, displaceElementId, dropDirection);
											dragDropSelectedElements(0, $dropArea);
									}											
						});
				};	

				var removeDragFrameAndClearPlaceholder = function() {
						$dragElementDragFrame.remove();	
						clearPlaceholderElements();
				};
					
				var dragCompleteInline = function($dropArea, displaceElementId, dropDirection) {
						var $dragdropExpandElement = $(".paloula-dragdrop-element-expand");	
						var displaceElementWidth = $dropArea.attr("data-elements-width");
						var displaceElementHeight = $dropArea.attr("data-elements-height");		
						var dropAreaId = $dropArea.attr("id");
						
						clearPlaceholderElements();
						
						if (options.copyMove == "move") {
								$dragElement.css({
										"width" : displaceElementWidth + 'px',
										"height" : displaceElementHeight + 'px',
										"display" : "inline-block",
										"visibility" : "visible"
								});
								
								if (displaceElementId == null) {
										$dropArea.append($dragElement);
								} else {
										$dragdropExpandElement.replaceWith($dragElement);
								}
								
								droppedElementId = dragElementId;
						
						} else if (options.copyMove == "copy"){							
								var randomId = paloulaDDE.utils.getRandomAlphanumericString(options.copyRandomIdPrefix, 50);
								var $insertDragElementClone = $dragElement.clone();
								$insertDragElementClone.attr("id", randomId);
								$insertDragElementClone.attr("draggable", "false");
								
								$insertDragElementClone.css({
										"width" : displaceElementWidth + 'px',
										"height" : displaceElementHeight + 'px',
										"display" : "inline-block",
										"visibility" : "visible"
								});							
								
								if (displaceElementId == null) {
										$dropArea.append($insertDragElementClone);
								} else {
										$dragdropExpandElement.replaceWith($insertDragElementClone);
								}

								droppedElementId = randomId;
								paloulaDDE.events.addNewDragElementListener($insertDragElementClone);
						}
						
						$dragElementDragFrame.remove();							
						
						paloulaDDE.callback.addToDragDropProtocol(dragElementId, droppedElementId, sourceDropAreaId, dropAreaId, displaceElementId, dropDirection);
				};	
				
				var dragCompleteVerical = function($dropArea, displaceElementId, dropDirection) {
						var $dragdropExpandElement = $(".paloula-dragdrop-element-expand");	
						var displaceElementHeight = $dragElementClone.attr("data-origin-height");															
						var dropAreaId = $dropArea.attr("id");
						
						clearPlaceholderElements();
						
						if (options.copyMove == "move") {
								$dragElement.css({
										"width" : '100%',
										"height" : displaceElementHeight + 'px',
										"display" : "block",
										"visibility" : "visible"
								});
								
								if (displaceElementId == null) {
										$dropArea.append($dragElement);
								} else {
										$dragdropExpandElement.replaceWith($dragElement);
								}
								
							
								droppedElementId = dragElementId;
						} else if (options.copyMove == "copy"){							
								var randomId = paloulaDDE.utils.getRandomAlphanumericString(options.copyRandomIdPrefix, 50);
								var $insertDragElementClone = $dragElement.clone();
								$insertDragElementClone.attr("id",randomId);
								
								$insertDragElementClone.css({
										"width" : '100%',
										"height" : displaceElementHeight + 'px',
										"display" : "block",
										"visibility" : "visible"
								});
								
								if (displaceElementId == null) {
										$dropArea.append($insertDragElementClone);
								} else {
										$dragdropExpandElement.replaceWith($insertDragElementClone);
								}
								
								droppedElementId = randomId;
								paloulaDDE.events.addNewDragElementListener($insertDragElementClone);
						}
						
						$dragElementDragFrame.remove();		
						
						paloulaDDE.callback.addToDragDropProtocol(dragElementId, droppedElementId, sourceDropAreaId, dropAreaId, displaceElementId, dropDirection);
				};
					
				this.drop = function() {						
						var displaceElementProperties = displaceElement.getDisplacementElementProperties();
						var displacementElementType = displaceElementProperties.displacementElementType;
						var $displaceElement = displaceElementProperties.$displaceElement;
						var $dropArea = displaceElementProperties.$dropArea;
						var dropAreaId = displaceElementProperties.dropAreaId;
						var dropAreaType = displaceElementProperties.dropAreaType;
						var displaceElementId = displaceElementProperties.lastDisplaceElementId;
						var dropDirection = displaceElementProperties.dropDirection;
						
						if (displacementElementType == null) {
								removeDragFrameAndClearPlaceholder();
						}
						
						if (displacementElementType == "OutOfDropArea" && options.copyMove == "move") {
								var displaceElementWidth = $sourceDropArea.attr("data-elements-width")
								var displaceElementHeight = $sourceDropArea.attr("data-elements-height")
								var dropAreaType = paloulaDDE.dropArea.getDropAreaTypeByDropArea($sourceDropArea);

								if (dropAreaType == "inline") {
										var displaceElementWidth = $sourceDropArea.attr("data-elements-width");
										var displaceElementHeight = $sourceDropArea.attr("data-elements-height");										
										
										animateDragElementToWidthHeight(displaceElementWidth, displaceElementHeight, "inline-block")

								} else if (dropAreaType == "vertical") {
										var displaceElementHeight = $dragElementClone.attr("data-origin-height");
										
										animateDragElementToWidthHeight("100%", displaceElementHeight, "block")
								}		
								
								var dragElementInDocument = paloulaDDE.dragdropScreen.elementInDocument($dragElement);
								var dragElementLeft = dragElementInDocument.left;
								var dragElementTop = dragElementInDocument.top;
								
								animateDragFrameToPosition(dragElementLeft, dragElementTop, removeDragFrameAndClearPlaceholder);
						}						

						if (displacementElementType == "OutOfDropArea" && options.copyMove == "copy") {
								var dragElementInDocument = paloulaDDE.dragdropScreen.elementInDocument($dragElement);
								var dragElementLeft = dragElementInDocument.left;
								var dragElementTop = dragElementInDocument.top;
								
								animateDragFrameToPosition(dragElementLeft, dragElementTop, removeDragFrameAndClearPlaceholder);
						}
						
						if (displacementElementType == "DisplacementElement") {
								
								var $dragdropExpandElement = $(".paloula-dragdrop-element-expand");								
								var dragdropExpandElementInDocument = paloulaDDE.dragdropScreen.elementInDocument($dragdropExpandElement);
								var dragdropExpandElementLeft = dragdropExpandElementInDocument.left;
								var dragdropExpandElementTop = dragdropExpandElementInDocument.top;								
									
								if (dropAreaType == "inline") {
										var displaceElementWidth = $dropArea.attr("data-elements-width");
										
										animateDragFrameToPositionAndWidth(dragdropExpandElementLeft, dragdropExpandElementTop, displaceElementWidth, dragCompleteInline, $dropArea, displaceElementId, dropDirection);
										
								}  else if (dropAreaType == "vertical") {
										var dropAreaInDocument = paloulaDDE.dragdropScreen.elementInDocument($dropArea);
											
										animateDragFrameToPositionAndWidth(dragdropExpandElementLeft, dragdropExpandElementTop, dropAreaInDocument.innerWidth, dragCompleteVerical, $dropArea, displaceElementId, dropDirection);
								}
								
						}
						
						if (displacementElementType == "EmptyDropArea") {
								var dropAreaInDocument = paloulaDDE.dragdropScreen.elementInDocument($dropArea);
								var dropAreaInDocumentLeft = dropAreaInDocument.left;
								var dropAreaInDocumentTop= dropAreaInDocument.top;
									
								if (dropAreaType == "inline") {
										var displaceElementWidth = $dropArea.attr("data-elements-width");
											
										animateDragFrameToPositionAndWidth(dropAreaInDocumentLeft, dropAreaInDocumentTop, displaceElementWidth, dragCompleteInline, $dropArea, displaceElementId, dropDirection);
											
								}  else if (dropAreaType == "vertical") {
										animateDragFrameToPositionAndWidth(dropAreaInDocumentLeft, dropAreaInDocumentTop, dropAreaInDocument.innerWidth, dragCompleteVerical, $dropArea, displaceElementId, dropDirection);
								}										
						}
						
				};

				var dragDropSelectedElements = function(selecedElementNumber, $dropArea) {
						var dropAreaId = $dropArea.attr("id");
						var dropAreaType = paloulaDDE.dropArea.getDropAreaTypeByDropArea($dropArea);
						
						var previouseElementId = droppedElementId;
						var selectedElementId = _selectedDragIds[selecedElementNumber];						
						
						if (_selectedDragIds.length > 0 && selectedElementId != dragElementId) {
									var $selectedElement = $("#" + selectedElementId);								
									var selectedElementInDocument = paloulaDDE.dragdropScreen.elementInDocument($selectedElement);
									var selectedElementLeft = selectedElementInDocument.left;
									var selectedElementTop = selectedElementInDocument.top;
									var $selectedElementClone = $selectedElement.clone();									
									var selectedElementDropAreaId =  $selectedElement.closest("UL.paloula-dragdrop-list").attr("id");
									
									$selectedElementClone.css({
											"position" : "absolute",
											"left" : selectedElementLeft + "px",
											"top" : selectedElementTop + "px"
									});
									
									$("BODY").append($selectedElementClone);
									
									var $previouseElement = $("#" + previouseElementId);										
									var previouseElementInDocument = paloulaDDE.dragdropScreen.elementInDocument($previouseElement);
									var previouseElementRight = previouseElementInDocument.right;
									var previouseElementTop = previouseElementInDocument.top;

									$selectedElementClone.animate({
												left: previouseElementRight + 'px',										
												top:  previouseElementTop + 'px',
									}, {
												duration: options.durationAnimateSelection,
												queue: true,
												complete: function() {
														
														if (dropAreaType == "vertical") {
																var selectedElementHeight = $selectedElement.attr("data-origin-height");
																
																$selectedElementClone.css({
																		"width" : '100%',
																		"height" : selectedElementHeight + 'px',
																		"display" : "block",
																});															
																
														} else if (dropAreaType == "inline") {
																	var selectedElementWidth = $dropArea.attr("data-elements-width");
																	var selectedElementHeight = $dropArea.attr("data-elements-height");
																	
																	$selectedElementClone.css({
																			"width" : selectedElementWidth + 'px',
																			"height" : selectedElementHeight + 'px',
																			"display" : "inline-block",
																	});												
														}				
														
														$selectedElementClone.insertAfter($previouseElement);
														paloulaDDE.events.addNewDragElementListener($selectedElementClone);
														
														$selectedElementClone.css({
																"position" : "relative",
																"left" : "",
																"top" : ""
														});	
														
														if (options.copyMove == "copy") {
																var randomId = paloulaDDE.utils.getRandomAlphanumericString(options.copyRandomIdPrefix, 50);
																$selectedElementClone.attr("id", randomId);
																droppedElementId = randomId;
														} else {
																droppedElementId = selectedElementId;
																$selectedElement.remove();
														}

														selecedElementNumber = selecedElementNumber + 1;
														
														paloulaDDE.callback.addToDragDropProtocol(selectedElementId, droppedElementId, selectedElementDropAreaId, dropAreaId, previouseElementId, "after");
														
														if (selecedElementNumber < _selectedDragIds.length) {
																dragDropSelectedElements(selecedElementNumber, $dropArea);
														} else {
																resetSelection();
																paloulaDDE.callback.callbackDropped();
														}
												}
									
									});		
						}	else if (_selectedDragIds.length > 1 && selectedElementId == dragElementId) {
								selecedElementNumber = selecedElementNumber + 1;
								
								if (selecedElementNumber < _selectedDragIds.length) {
										dragDropSelectedElements(selecedElementNumber, $dropArea);
								} else {
										resetSelection();
								}
								
						}	else if (_selectedDragIds.length == 1 && selectedElementId == dragElementId) {
								resetSelection();
								paloulaDDE.callback.callbackDropped();
						} else if (_selectedDragIds.length == 0) {
								resetSelection();
								paloulaDDE.callback.callbackDropped();
						}
				
				};

				this.getDropAreaType = function() {
						return dropAreaType;
				};
				
				this.getDragElementId = function() {
						return dragElementId;
				};

				this.get$DragElement = function() {
						return $dragElement;
				};
				
				this.get$SourceDropArea = function() {
						return $sourceDropArea;
				};
				
				this.get$DragElementDragFrame = function() {
						return $dragElementDragFrame;
				};
				
				(function init() { 
						dragStartHandling()
						setDragElementToMouse();
						setDragDummy()
				})(); 				
		};		
		
		dragdropModule.dragStart = function($dragElement, event) {
				document.getSelection().removeAllRanges();	
				
				if (paloulaDDE.stateOfThings.scroll.getDropAreaIsScrollingByUser() == false && paloulaDDE.stateOfThings.scroll.getPageIsScrollingByUser() == false && options.dragDropModeActivated == true) {
						var isDragStart = false;
						
						if (_dragElement == null) {
								isDragStart = true;
						}
						
						paloulaDDE.stateOfThings.dragDrop.setDragInProgress(true);	
						_dragElement = new DragElement($dragElement, event);						
						_dragElement.insertDragFrame();	
						
						if (isDragStart == true && options.copyMove == "move") {
								displaceElement.setDisplaceElementInitial();
						}								
				}
		};		
		
		dragdropModule.dragNow = function(event) {			
				
				if (paloulaDDE.stateOfThings.dragDrop.getDragInProgress() == true) {		
						event.preventDefault();
						_dragElement.setPosition(event);
						
						if (paloulaDDE.stateOfThings.scroll.getPageIsScrollingByDragDrop() == false && paloulaDDE.stateOfThings.scroll.getDropAreaIsScrollingByDragDrop() == false) {
								displaceElement.updateDisplaceElement();
						}
				} 
		};
		
		dragdropModule.dragEnd = function() {
				
				if (paloulaDDE.stateOfThings.dragDrop.getDragInProgress() == true) {	
						_dragElement.drop();
						_dragElement = null;
						displaceElement.reset();				
						paloulaDDE.stateOfThings.dragDrop.setDragInProgress(false);	
						document.body.style.overflowY = "auto";
						document.body.style.overflowX = "auto";
				}
		};
		
		dragdropModule.getDragElement = function() {
				return _dragElement;
		};
		
		dragdropModule.getOptions = function() {
				return options;
		};
		
		dragdropModule.getDisplaceElement = function() {
				return displaceElement;
		};		
		
		dragdropModule.setDragDropActivation = function(activation) {
				options.dragDropModeActivated = activation;
		};
		
		dragdropModule.setMultiSelect= function(activation) {
				options.multiSelect = activation;
				
				if (activation == false) {
						resetSelection();
				}
		};

		dragdropModule.setMoveCopy = function(choice) {
				options.copyMove = choice;
		};

		dragdropModule.setCopyRandomIdPrefix = function(prefix) {
				options.copyRandomIdPrefix = prefix;
		};

		dragdropModule.setDurationAnimateSelection = function(duration) {
				options.durationAnimateSelection = duration;
		};

		dragdropModule.setCallBackDropped = function(callbackFunction) {
				options.callBackDropped = callbackFunction;
		};
		
		var setOptions = function() {
				
				if (typeof paloulaDragDropOptions !== "undefined") {
						
						Object.keys(paloulaDragDropOptions).forEach(function(key) {
								//console.log(key, paloulaDragDropOptions[key]);						
								options[key] = paloulaDragDropOptions[key];
						});					
				}
		};	

		dragdropModule.init = function() {				
				paloulaDDE.events.addDragDropEventListener();	
				setOptions();
		};
		
		return dragdropModule; 
} (paloulaDDE.dragdrop || {}));
// ==================================================================
// DropArea
// ==================================================================
paloulaDDE.dropArea = ( function(dropAreaModule) {	

		dropAreaModule.searchPossibleDropElementInline = function(dropAreaProperties) {
				var $dropArea = dropAreaProperties.$dropArea;
				var dropAreaId = dropAreaProperties.dropAreaId;
				var dropAreaType = dropAreaProperties.dropAreaType;
				var $dropElements = dropAreaProperties.$dropElements;
				var oneIsOverDropElement = false;
				var dragElement = paloulaDDE.dragdrop.getDragElement();
				var displaceElement = paloulaDDE.dragdrop.getDisplaceElement();
				var $dragFramePositionInDocument = paloulaDDE.dragdropScreen.elementInDocument(dragElement.get$DragElementDragFrame());
				var $dragFrameInDocumentLeft =  $dragFramePositionInDocument.left;
				var $dragFrameInDocumentTop =  $dragFramePositionInDocument.top;
				var $dragFrameInDocumentRight =  $dragFramePositionInDocument.right;
				var $dragFrameInDocumentBottom =  $dragFramePositionInDocument.bottom;
				var $dragFrameInDocumentHeight =  $dragFramePositionInDocument.outerHeight;		
				var mouseDirection = paloulaDDE.dragdropScreen.getMouseDirection();
				var mouseUpDownDirection = mouseDirection.mouseUpDownDirection;			
				var mouseLeftRightDirection = mouseDirection.mouseLeftRightDirection;
				var dropAreaPositionInDocument = paloulaDDE.dragdropScreen.elementInDocument($dropArea);
				var dropAreaPositionInDocumentLeft = dropAreaPositionInDocument.left;

				var listOfPossibleDisplaceElemntsInline = [];
				var dropDirection = "";	
				var $possibleDisplaceElement = null;
				
				$dropElements.each( function() {
						$possibleDisplaceElement = $(this);
						var possibleDisplaceElementId = $possibleDisplaceElement.attr("id");
						var isOverDropElement = false;	
						var possibleDisplaceElementPositionInDocument = paloulaDDE.dragdropScreen.elementInDocument($possibleDisplaceElement);
						var possibleDisplaceElementInDocumentLeft =  possibleDisplaceElementPositionInDocument.left;
						var possibleDisplaceElementInDocumentRight = possibleDisplaceElementPositionInDocument.right;				 
						var possibleDisplaceElementInDocumentTop =  possibleDisplaceElementPositionInDocument.top;
						var possibleDisplaceElementInDocumentBottom =  possibleDisplaceElementPositionInDocument.bottom;	
						var possibleDisplaceElementInDocumentWidth =  possibleDisplaceElementPositionInDocument.width;
						var possibleDisplaceElementInDocumentHeight =  possibleDisplaceElementPositionInDocument.height;
						var possibleDisplaceInlineDropBeforeLimitHorizontal = parseInt(possibleDisplaceElementInDocumentWidth * 0.6);
						var possibleDisplaceInlineDropAfterLimitHorizontal = parseInt(possibleDisplaceElementInDocumentWidth * 0.7);
						
						if (mouseLeftRightDirection == "left") {
								
								if  (       $dragFrameInDocumentLeft >= possibleDisplaceElementInDocumentLeft
												&&  $dragFrameInDocumentLeft < possibleDisplaceElementInDocumentLeft + possibleDisplaceInlineDropBeforeLimitHorizontal
												&&  $dragFrameInDocumentTop >= possibleDisplaceElementInDocumentTop
												&&  $dragFrameInDocumentTop <= possibleDisplaceElementInDocumentBottom
												&& 	possibleDisplaceElementInDocumentBottom > dropAreaProperties.dropAreaTop 																		
								) {	
										
										var distVertical = possibleDisplaceElementInDocumentBottom - $dragFrameInDocumentTop;
										var distVerticalPercent = 100 / ( $dragFrameInDocumentHeight / distVertical);
										
										var possibleDisplaceElementInline = {
												possibleDisplaceElementId: possibleDisplaceElementId,
												distVerticalPercent: distVerticalPercent,
												$possibleDisplaceElement: $possibleDisplaceElement,
												dropDirection: "before",
										}
										
										listOfPossibleDisplaceElemntsInline.push(possibleDisplaceElementInline);
								}	
								
								if  (				$dragFrameInDocumentLeft >= possibleDisplaceElementInDocumentLeft
												&&  $dragFrameInDocumentLeft < possibleDisplaceElementInDocumentLeft + possibleDisplaceInlineDropBeforeLimitHorizontal
												&&  $dragFrameInDocumentBottom >= possibleDisplaceElementInDocumentTop
												&&  $dragFrameInDocumentBottom <= possibleDisplaceElementInDocumentBottom
												&& 	possibleDisplaceElementInDocumentTop < dropAreaProperties.dropAreaBottom
								) {	
										
										var distVertical = $dragFrameInDocumentBottom - possibleDisplaceElementInDocumentTop;
										var distVerticalPercent = 100 / ( $dragFrameInDocumentHeight / distVertical);
										
										var possibleDisplaceElementInline = {
												possibleDisplaceElementId: possibleDisplaceElementId,
												distVerticalPercent: distVerticalPercent,
												$possibleDisplaceElement: $possibleDisplaceElement,
												dropDirection: "before",
										}
										
										listOfPossibleDisplaceElemntsInline.push(possibleDisplaceElementInline);
								}	
								
								
						} else if (mouseLeftRightDirection == "right") {
						
								var marginLeft = parseInt($possibleDisplaceElement.css("margin-left"));
								var paddingLeft = parseInt($possibleDisplaceElement.css("padding-left"));
								var paddingLeftDropArea = parseInt($dropArea.css("padding-left"));
								
								if  (				(possibleDisplaceElementInDocumentLeft - dropAreaPositionInDocumentLeft - marginLeft - paddingLeft) == 0
												&&	$dragFrameInDocumentLeft >= possibleDisplaceElementInDocumentLeft
												&&  $dragFrameInDocumentLeft < possibleDisplaceElementInDocumentLeft + possibleDisplaceInlineDropBeforeLimitHorizontal
												&&  $dragFrameInDocumentTop >= possibleDisplaceElementInDocumentTop
												&&  $dragFrameInDocumentTop <= possibleDisplaceElementInDocumentBottom
												&& 	possibleDisplaceElementInDocumentBottom > dropAreaProperties.dropAreaTop 	
								) {
										
										var distVertical = possibleDisplaceElementInDocumentBottom - $dragFrameInDocumentTop;
										var distVerticalPercent = 100 / ( $dragFrameInDocumentHeight / distVertical);

										var possibleDisplaceElementInline = {
												possibleDisplaceElementId: possibleDisplaceElementId,
												distVerticalPercent: distVerticalPercent,
												$possibleDisplaceElement: $possibleDisplaceElement,
												dropDirection: "before",	
										}
										
										listOfPossibleDisplaceElemntsInline.push(possibleDisplaceElementInline);															
									}


								if  (				
														$dragFrameInDocumentLeft <= possibleDisplaceElementInDocumentRight															
												&&  $dragFrameInDocumentLeft > possibleDisplaceElementInDocumentRight - possibleDisplaceInlineDropAfterLimitHorizontal
												&&  $dragFrameInDocumentTop >= possibleDisplaceElementInDocumentTop
												&&  $dragFrameInDocumentTop <= possibleDisplaceElementInDocumentBottom
												&& 	possibleDisplaceElementInDocumentBottom > dropAreaProperties.dropAreaTop 																		
								) {	
										
										var distVertical = possibleDisplaceElementInDocumentBottom - $dragFrameInDocumentTop;
										var distVerticalPercent = 100 / ( $dragFrameInDocumentHeight / distVertical);

										var possibleDisplaceElementInline = {
												possibleDisplaceElementId: possibleDisplaceElementId,
												distVerticalPercent: distVerticalPercent,
												$possibleDisplaceElement: $possibleDisplaceElement,
												dropDirection: "after",
										}
										
										listOfPossibleDisplaceElemntsInline.push(possibleDisplaceElementInline);
								}	
								
								if  (				
														$dragFrameInDocumentLeft <= possibleDisplaceElementInDocumentRight															
												&&  $dragFrameInDocumentLeft > possibleDisplaceElementInDocumentRight - possibleDisplaceInlineDropAfterLimitHorizontal
												&&  $dragFrameInDocumentBottom >= possibleDisplaceElementInDocumentTop
												&&  $dragFrameInDocumentBottom <= possibleDisplaceElementInDocumentBottom
												&& 	possibleDisplaceElementInDocumentTop < dropAreaProperties.dropAreaBottom
								) {	
										
										var distVertical = $dragFrameInDocumentBottom - possibleDisplaceElementInDocumentTop;
										var distVerticalPercent = 100 / ( $dragFrameInDocumentHeight / distVertical);

										var possibleDisplaceElementInline = {
												possibleDisplaceElementId: possibleDisplaceElementId,
												distVerticalPercent: distVerticalPercent,
												$possibleDisplaceElement: $possibleDisplaceElement,
												dropDirection: "after",
										}
										
										listOfPossibleDisplaceElemntsInline.push(possibleDisplaceElementInline);
								}													
						
						}
				});			

				for (var i=0; i < listOfPossibleDisplaceElemntsInline.length; i++) {
						var possibleDisplaceElementInline = listOfPossibleDisplaceElemntsInline[i];
						var distVerticalPercent = possibleDisplaceElementInline.distVerticalPercent;
						
						if (distVerticalPercent > 52 )  {
								dropDirection = possibleDisplaceElementInline.dropDirection;
								oneIsOverDropElement = true;
								possibleDisplaceElementId = possibleDisplaceElementInline.possibleDisplaceElementId
								$possibleDisplaceElement = possibleDisplaceElementInline.$possibleDisplaceElement;
						}
				}
						
				if (oneIsOverDropElement == true) {
						oneIsOverDropElement = true;												
						displaceElement.setDisplacementElement($dropArea, dropAreaId, dropAreaType, $possibleDisplaceElement, possibleDisplaceElementId, dropDirection);
				}										
				
				if (oneIsOverDropElement == false) {
						var $lastElement = $dropElements.last();
						var lastElementId = $lastElement.attr("id");
						var dragElementId = dragElement.getDragElementId();
						
						if (lastElementId == dragElementId) {
								$lastElement = $lastElement.prev();
						}
						var lastElementPositionInDocument = paloulaDDE.dragdropScreen.elementInDocument($lastElement);
						var lastElementInDocumentTop =  lastElementPositionInDocument.top;	
						var lastElementInDocumentLeft =  lastElementPositionInDocument.left;	
						var lastElementInDocumentBottom =  lastElementPositionInDocument.bottom;	
						var lastElementInDocumentRight =  lastElementPositionInDocument.right;	

						if (		$dragFrameInDocumentTop > lastElementInDocumentBottom
										|| ($dragFrameInDocumentTop > lastElementInDocumentTop && $dragFrameInDocumentLeft > lastElementInDocumentRight)
						) {
								var possibleDisplaceElementId = $lastElement.attr("id");
								displaceElement.setDisplacementElement($dropArea, dropAreaId, dropAreaType, $lastElement, possibleDisplaceElementId, "after");							
						}
				}				

		};

		dropAreaModule.searchPossibleDropElementVerical = function(dropAreaProperties) {
				var $dropArea = dropAreaProperties.$dropArea;
				var dropAreaId = dropAreaProperties.dropAreaId;
				var dropAreaType = dropAreaProperties.dropAreaType;
				var $dropElements = dropAreaProperties.$dropElements;
				var oneIsOverDropElement = false;
				var dragElement = paloulaDDE.dragdrop.getDragElement();
				var displaceElement = paloulaDDE.dragdrop.getDisplaceElement();
				var $dragFramePositionInDocument = paloulaDDE.dragdropScreen.elementInDocument(dragElement.get$DragElementDragFrame());
				var $dragFrameInDocumentLeft =  $dragFramePositionInDocument.left;
				var $dragFrameInDocumentTop =  $dragFramePositionInDocument.top;
				var $dragFrameInDocumentRight =  $dragFramePositionInDocument.right;
				var $dragFrameInDocumentBottom =  $dragFramePositionInDocument.bottom;
				var $dragFrameInDocumentHeight =  $dragFramePositionInDocument.outerHeight;		
				var mouseDirection = paloulaDDE.dragdropScreen.getMouseDirection();
				var mouseUpDownDirection = mouseDirection.mouseUpDownDirection;
								
				$dropElements.each( function() {
						var $possibleDisplaceElement = $(this);
						var possibleDisplaceElementId = $possibleDisplaceElement.attr("id");
						var dropDirection = "";	
						var isOverDropElement = false;	
						
						var possibleDisplaceElementPositionInDocument = paloulaDDE.dragdropScreen.elementInDocument($possibleDisplaceElement);
						var possibleDisplaceElementInDocumentLeft =  possibleDisplaceElementPositionInDocument.left;
						var possibleDisplaceElementInDocumentRight = possibleDisplaceElementPositionInDocument.right;				 
						var possibleDisplaceElementInDocumentTop =  possibleDisplaceElementPositionInDocument.top;
						var possibleDisplaceElementInDocumentBottom =  possibleDisplaceElementPositionInDocument.bottom;	
						var possibleDisplaceElementInDocumentWidth =  possibleDisplaceElementPositionInDocument.width;
						var possibleDisplaceElementInDocumentHeight =  possibleDisplaceElementPositionInDocument.height;
						
						var possibleDisplaceVerticalDropBeforeLimit = parseInt(possibleDisplaceElementInDocumentHeight * 0.3);
						var possibleDisplaceVerticalDropAfterLimit = parseInt(possibleDisplaceElementInDocumentHeight * 0.5);
						var $displaceElement = displaceElement.getDisplacementElementProperties().$displaceElement;
						
						if  (	    mouseUpDownDirection == "up"
									&&  $dragFrameInDocumentLeft >= possibleDisplaceElementInDocumentLeft
									&&  $dragFrameInDocumentLeft <= possibleDisplaceElementInDocumentRight
									&&  $dragFrameInDocumentTop >= possibleDisplaceElementInDocumentTop
									&&  $dragFrameInDocumentTop <= possibleDisplaceElementInDocumentTop + possibleDisplaceVerticalDropBeforeLimit
						) {	
								
								isOverDropElement = true;
								dropDirection = "before";											 
						}
						
						if  (	    mouseUpDownDirection == "down"
									&&  $displaceElement != null
									&&  $dragFrameInDocumentLeft >= possibleDisplaceElementInDocumentLeft
									&&  $dragFrameInDocumentLeft <= possibleDisplaceElementInDocumentRight
									&&  $dragFrameInDocumentTop >= possibleDisplaceElementInDocumentTop + possibleDisplaceVerticalDropBeforeLimit
									&&  $dragFrameInDocumentTop <= possibleDisplaceElementInDocumentTop + possibleDisplaceVerticalDropAfterLimit
						) {	
								
								isOverDropElement = true;
								dropDirection = "after";											 
						}
						
						if  (	    mouseUpDownDirection == "down"
									&&  $displaceElement == null
									&&  $dragFrameInDocumentLeft >= possibleDisplaceElementInDocumentLeft
									&&  $dragFrameInDocumentLeft <= possibleDisplaceElementInDocumentRight
									&&  $dragFrameInDocumentTop >= possibleDisplaceElementInDocumentTop
									&&  $dragFrameInDocumentTop <= possibleDisplaceElementInDocumentBottom
						) {	
								
								isOverDropElement = true;
								dropDirection = "after";											 
						}										
						
						if (isOverDropElement == true) {
								oneIsOverDropElement = true;
								displaceElement.setDisplacementElement($dropArea, dropAreaId, dropAreaType, $possibleDisplaceElement, possibleDisplaceElementId, dropDirection);
						} 
						
					
				});	

				if (oneIsOverDropElement == false) {
						var $lastElement = $dropElements.last();
						var lastElementPositionInDocument = paloulaDDE.dragdropScreen.elementInDocument($lastElement);
						var lastElementInDocumentTop =  lastElementPositionInDocument.top;						
						
						if ($dragFrameInDocumentTop >= lastElementInDocumentTop) {
								var possibleDisplaceElementId = $lastElement.attr("id");
								displaceElement.setDisplacementElement($dropArea, dropAreaId, dropAreaType, $lastElement, possibleDisplaceElementId, "after");							
						}
				}

		};		
		
		dropAreaModule.getDropArea = function() {
				var dropAreaProperties = null;
				var isOverDropArea = false;
				var dragElement = paloulaDDE.dragdrop.getDragElement();
				var $dragFramePositionInDocument = paloulaDDE.dragdropScreen.elementInDocument(dragElement.get$DragElementDragFrame());
				var $dragFrameInDocumentLeft =  $dragFramePositionInDocument.left;
				var $dragFrameInDocumentTop =  $dragFramePositionInDocument.top;
				
				$(".paloula-dragdrop-list").not("#dragElementParentClone").each( function(){
						var $possibleDropArea = $(this);
						var possibleDropAreaPositionInDocument = paloulaDDE.dragdropScreen.elementInDocument($possibleDropArea);
						var possibleDropAreaInDocumentLeft =  possibleDropAreaPositionInDocument.left;
						var possibleDropAreaInDocumentRight = possibleDropAreaPositionInDocument.right;				 
						var possibleDropAreaInDocumentTop =  possibleDropAreaPositionInDocument.top;
						var possibleDropAreaInDocumentBottom =  possibleDropAreaPositionInDocument.bottom;		
						
						if (	   $dragFrameInDocumentLeft >= possibleDropAreaInDocumentLeft 
									&& $dragFrameInDocumentLeft <= possibleDropAreaInDocumentRight
									&& $dragFrameInDocumentTop >= possibleDropAreaInDocumentTop
									&& $dragFrameInDocumentTop <= possibleDropAreaInDocumentBottom
						) {
										isOverDropArea = true;
										var dropAreaId = $possibleDropArea.attr("id");
										var dropAreaType;
										
										if ($possibleDropArea.hasClass("paloula-vertical-list")) {
												dropAreaType = "vertical"; 
										} else if ($possibleDropArea.hasClass("paloula-inline-list")) {
												dropAreaType = "inline"; 
										}
										
										var $dropElements = $possibleDropArea.find(".paloula-dragdrop-element").not(".paloula-dragdrop-absolute, .paloula-expanding-now, paloula-dragdrop-element-hidden");
									
										dropAreaProperties = {
												isOverDropArea: isOverDropArea,
												$dropArea: $possibleDropArea, 
												dropAreaId: dropAreaId,
												dropAreaType: dropAreaType,
												dropAreaLeft: possibleDropAreaInDocumentLeft,
												dropAreaRight: possibleDropAreaInDocumentRight,
												dropAreaTop: possibleDropAreaInDocumentTop,
												dropAreaBottom: possibleDropAreaInDocumentBottom,
												$dropElements: $dropElements,
												numberOfDropElements: $dropElements.length
										}
								 
							 }
		
				});
				
				if (isOverDropArea == false) {
						dropAreaProperties = {
								isOverDropArea: isOverDropArea
						}
				}
				
				return dropAreaProperties;
		
		};
		
		dropAreaModule.getDropAreaAtPoint = function(left, top) {
				var $dropArea = null;
				
				$(".paloula-dragdrop-list").not("#dragElementParentClone").each( function(){
						var $possibleDropArea = $(this);
						var possibleDropAreaPositionInDocument = paloulaDDE.dragdropScreen.elementInDocument($possibleDropArea);
						var possibleDropAreaInDocumentLeft =  possibleDropAreaPositionInDocument.left;
						var possibleDropAreaInDocumentRight = possibleDropAreaPositionInDocument.right;				 
						var possibleDropAreaInDocumentTop =  possibleDropAreaPositionInDocument.top;
						var possibleDropAreaInDocumentBottom =  possibleDropAreaPositionInDocument.bottom;	
						
						if ( 	left >=  possibleDropAreaInDocumentLeft && left <= possibleDropAreaInDocumentRight &&
									top >= possibleDropAreaInDocumentTop && top <= possibleDropAreaInDocumentBottom 
						) {										
									$dropArea = $possibleDropArea;								
						}
				});
				
				return $dropArea;						
		};
		
		dropAreaModule.getDropAreaTypeByDropArea = function($dropArea) {
				var dropAreaType = null;
				
				if ($dropArea.hasClass("paloula-vertical-list")) {
						dropAreaType = "vertical"; 
				} else if ($dropArea.hasClass("paloula-inline-list")) {
						dropAreaType = "inline"; 
				}
				
				return dropAreaType;
		};
		
		return dropAreaModule; 
} (paloulaDDE.dropArea || {}));
// ==================================================================
// Scroll
// ==================================================================
paloulaDDE.scroll = ( function(scrollModule) {	
		var SCROLL_PAGE_AREA_SIZE = 10;
		var SCROLL_DROP_ZONE_AREA_SIZE = 10;
		
		scrollModule.checkScrollState = function() {
				
				if (paloulaDDE.stateOfThings.dragDrop.getDragInProgress() == true && paloulaDDE.dragdrop.getOptions().dragDropModeActivated == true) {		
						scrollPage();
						scrollDropArea();
				}
		};		

		var scrollPage = function() {					
				var isScrollingNow = false;
				var $dragFrame = paloulaDDE.dragdrop.getDragElement().get$DragElementDragFrame();
				var elementViewportTopCorner = paloulaDDE.dragdropScreen.elementInViewport($dragFrame).top;				
				var elementViewportBottomCorner = paloulaDDE.dragdropScreen.elementInViewport($dragFrame).bottom;	
				var elementViewportLeftCorner = paloulaDDE.dragdropScreen.elementInViewport($dragFrame).left;				
				var elementViewportRightCorner = paloulaDDE.dragdropScreen.elementInViewport($dragFrame).right;	
				var viewportHeight = paloulaDDE.dragdropScreen.getViewportHeightWithToolbar();
				var viewportWidth = paloulaDDE.dragdropScreen.getViewportWidth();						
				var windowScrollLeft = paloulaDDE.dragdropScreen.getWindowScrollLeft();						
				var windowScrollTop = paloulaDDE.dragdropScreen.getWindowScrollTop();		
				
				// Top ============================================================================
				if (elementViewportTopCorner <= SCROLL_PAGE_AREA_SIZE && windowScrollTop > 0) {
						//console.log("Scroll top now!")
						scrollPageTop($dragFrame, windowScrollLeft, windowScrollTop, 8);								
						isScrollingNow = true;
				}	
				
				var windowOffsetHeight = parseInt(document.documentElement.offsetHeight);
				var windowScrollHeight = document.documentElement.scrollHeight;
				var windowClientHeight = document.documentElement.clientHeight;
				var windowOuterHeight = window.outerHeight;
				
				// Bottom ============================================================================
				var limitScrollTop = paloulaDDE.dragdropScreen.getWindowScrollHeight() - viewportHeight;						
				/*
				paloulaDDE.screenConsole.log(
							{headline: "elementViewportBottomCorner", value: elementViewportBottomCorner},
							{headline: "SCROLL_PAGE_AREA_SIZE", value: SCROLL_PAGE_AREA_SIZE},
							{headline: "windowScrollTop", value: windowScrollTop},
							{headline: "limitScrollTop", value: limitScrollTop},
							{headline: "viewportHeight", value: viewportHeight},
							{headline: "windowClientHeight", value: windowClientHeight},
							{headline: "document.documentElement.scrollHeight", value: document.documentElement.scrollHeight}
				);
				*/					
				if (	elementViewportBottomCorner >= viewportHeight - SCROLL_PAGE_AREA_SIZE && 
							windowScrollTop < limitScrollTop
				) {
							//console.log("scroll bottom")
							scrollPageBottom($dragFrame, windowScrollLeft, windowScrollTop, 8);							
							isScrollingNow = true;								
				} 						

				// Left ============================================================================
				if (	elementViewportLeftCorner <= SCROLL_PAGE_AREA_SIZE && windowScrollLeft > 0 &&
							elementViewportTopCorner > SCROLL_PAGE_AREA_SIZE &&
							elementViewportBottomCorner < viewportHeight - SCROLL_PAGE_AREA_SIZE 
				) {							
							/*
							scrollPageLeft($dragFrame, windowScrollLeft, windowScrollTop, 8):
							isScrollingNow = true;
							*/
				}	
				
				// Right ============================================================================
				var limitScrollLeft = paloulaDDE.dragdropScreen.getWindowScrollWidth() -  viewportWidth;
				
				if (	elementViewportRightCorner >= viewportWidth - SCROLL_PAGE_AREA_SIZE && windowScrollLeft < limitScrollLeft &&
							elementViewportTopCorner > SCROLL_PAGE_AREA_SIZE &&
							elementViewportBottomCorner < viewportHeight - SCROLL_PAGE_AREA_SIZE 
				) {
							/*
							scrollPageRight($dragFrame, windowScrollLeft, windowScrollTop, 8);
							isScrollingNow = true;
							*/
				}					
				
				if (isScrollingNow == false) {
						paloulaDDE.stateOfThings.scroll.setPageIsScrollingByDragDrop(false);
				}
								

		};	
		
		var scrollPageTop = function($dragFrame, windowScrollLeft, windowScrollTop, scrollHeight) {
				paloulaDDE.stateOfThings.scroll.setPageIsScrollingByDragDrop(true);
				var elementInDocument = paloulaDDE.dragdropScreen.elementInDocument($dragFrame);
				var elementDocumentTopCorner = elementInDocument.top;	
				var scrollTarget = windowScrollTop - scrollHeight;
				
				window.scrollTo(windowScrollLeft, scrollTarget);					
				
				$dragFrame.css({
						"top" : elementDocumentTopCorner - scrollHeight + "px",
				});							
		};
		
		var scrollPageBottom = function($dragFrame, windowScrollLeft, windowScrollTop, scrollHeight) {
				paloulaDDE.stateOfThings.scroll.setPageIsScrollingByDragDrop(true);
				var elementInDocument = paloulaDDE.dragdropScreen.elementInDocument($dragFrame);
				var elementDocumentTopCorner = elementInDocument.top;								
				var scrollTarget = windowScrollTop + scrollHeight;
				
				window.scrollTo(windowScrollLeft, scrollTarget);		
				
				$dragFrame.css({
						"top" : (elementDocumentTopCorner + scrollHeight) + "px",
				});	
		};
		
		var scrollPageLeft = function($dragFrame, windowScrollLeft, windowScrollTop, scrollWidth) {
					paloulaDDE.stateOfThings.scroll.setPageIsScrollingByDragDrop(true);
					var elementInDocument = paloulaDDE.dragdropScreen.elementInDocument($dragFrame);
					var elementDocumentLeftCorner = elementInDocument.left;						
					var scrollTarget = windowScrollLeft - scrollWidth;
					
					window.scrollTo(scrollTarget, windowScrollTop);	
					
					$dragFrame.css({
							"left" : (elementDocumentLeftCorner - scrollWidth) + "px",
					});		
		}
		
		var scrollPageRight = function($dragFrame, windowScrollLeft, windowScrollTop, scrollWidth) {
					paloulaDDE.stateOfThings.scroll.setPageIsScrollingByDragDrop(true);
					var elementInDocument = paloulaDDE.dragdropScreen.elementInDocument($dragFrame);
					var elementDocumentLeftCorner = elementInDocument.left;				
					var scrollTarget = windowScrollLeft + scrollWidth;
					
					window.scrollTo(scrollTarget, windowScrollTop);	
					
					$dragFrame.css({
							"left" : (elementDocumentLeftCorner + scrollWidth) + "px",
					});	
		}

		var scrollDropArea = function() {				
				
				if (paloulaDDE.stateOfThings.scroll.getPageIsScrollingByDragDrop() == false) {
						var newLeftCorner = paloulaDDE.stateOfThings.mouse.getMouseLeftInDocument();
						var newTopCorner = paloulaDDE.stateOfThings.mouse.getMouseTopInDocument();						
						var $dropArea = paloulaDDE.dropArea.getDropAreaAtPoint(newLeftCorner, newTopCorner);
						var $dragFrame = paloulaDDE.dragdrop.getDragElement().get$DragElementDragFrame();
	
						if ($dropArea != null) {									
								var dropAreaScrollTop = $dropArea.scrollTop();
								var $dropAreaInDocument = paloulaDDE.dragdropScreen.elementInDocument($dropArea);	
								var $dragElementParentCloneInDocument = paloulaDDE.dragdropScreen.elementInDocument($dragFrame);	
								var dropAreaId = $dropArea.attr("id");
								var dropAreaScrollHeight = parseInt(document.getElementById(dropAreaId).scrollHeight);
								var dropAreaHeight = $dropAreaInDocument.innerHeight;
								var dropAreaMaxScrollTop = dropAreaScrollHeight - dropAreaHeight;								
								
								if (	$dragElementParentCloneInDocument.top >= $dropAreaInDocument.top - 10 &&
											$dragElementParentCloneInDocument.top <= $dropAreaInDocument.top + SCROLL_DROP_ZONE_AREA_SIZE &&
											dropAreaScrollTop > 0
								
								) {
										
										$dropArea.scrollTop(dropAreaScrollTop - 10);
										paloulaDDE.stateOfThings.scroll.setDropAreaIsScrollingByDragDrop(true);
								
								} else if (	$dragElementParentCloneInDocument.bottom <= $dropAreaInDocument.bottom + 10 &&
														$dragElementParentCloneInDocument.bottom >= $dropAreaInDocument.bottom - SCROLL_DROP_ZONE_AREA_SIZE &&
														dropAreaScrollTop < dropAreaScrollHeight - dropAreaHeight 
								) {								
										
										$dropArea.scrollTop(dropAreaScrollTop + 10);
										paloulaDDE.stateOfThings.scroll.setDropAreaIsScrollingByDragDrop(true);
								
								} else {
										
										paloulaDDE.stateOfThings.scroll.setDropAreaIsScrollingByDragDrop(false);
								}																

						}
				}	
		};
		
		return scrollModule; 
} (paloulaDDE.scroll || {}));
// ==================================================================
// State of things
// ==================================================================
paloulaDDE.stateOfThings = ( function(stateOfThingsModule) {	

		stateOfThingsModule.dragDrop = new function DragDropStates() {	
				var dragInProgress = false;
		
				this.getDragInProgress = function() {
						return dragInProgress;
				};
				
				this.setDragInProgress = function(state) {
						dragInProgress = state;
				};
		};

		stateOfThingsModule.scroll = new function Scrolltates() {
				var pageIsScrollingByDragDrop = false;
				var dropAreaIsScrollingByDragDrop = false;
				var pageIsScrollingByUser = false;		
				var dropAreaIsScrollingByUser = false;
				

				
				this.getPageIsScrollingByDragDrop = function() {
						return pageIsScrollingByDragDrop;
				};
				
				this.setPageIsScrollingByDragDrop = function(state) {
						pageIsScrollingByDragDrop = state;
				};

				this.getDropAreaIsScrollingByDragDrop = function() {
						return dropAreaIsScrollingByDragDrop;
				};
				
				this.setDropAreaIsScrollingByDragDrop = function(state) {
						dropAreaIsScrollingByDragDrop = state;
				};

				this.getPageIsScrollingByUser = function() {
						return pageIsScrollingByUser;
				};
				
				this.setPageIsScrollingByUser = function(state) {
						pageIsScrollingByUser = state;
				};
				
				this.getDropAreaIsScrollingByUser = function() {
						return dropAreaIsScrollingByUser;
				};
				
				this.setDropAreaIsScrollingByUser = function(state) {
						dropAreaIsScrollingByUser = state;
				};
				
				this.resetScrollingStates = function() {
						dropAreaIsScrollingByUser = false;
						pageIsScrollingByUser = false;
				};
				
		}; 	

		stateOfThingsModule.mouse = new function MouseStates() {
				var mouseLeftInDocument;
				var mouseTopInDocument;
				
				this.getMouseLeftInDocument = function() {
						return mouseLeftInDocument;
				};
				
				this.setMouseLeftInDocument = function(left) {
						mouseLeftInDocument = left;
				};
				
				this.getMouseTopInDocument = function() {
						return mouseTopInDocument;
				};
				
				this.setMouseTopInDocument = function(top) {
						mouseTopInDocument = top;
				};
		};	
		
		stateOfThingsModule.handleMousePositionInDocument = function(event) {
				mouseLeftInDocument = paloulaDDE.stateOfThings.mouse.setMouseLeftInDocument(event.pageX);
				mouseTopInDocument = paloulaDDE.stateOfThings.mouse.setMouseTopInDocument(event.pageY);
		};

		stateOfThingsModule.handleTouchPositionInDocument = function(event) {
				var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];				
				mouseLeftInDocument = paloulaDDE.stateOfThings.mouse.setMouseLeftInDocument(touch.pageX);
				mouseTopInDocument = paloulaDDE.stateOfThings.mouse.setMouseTopInDocument(touch.pageY);
		};		

		return stateOfThingsModule; 
} (paloulaDDE.stateOfThings || {}));
// ==================================================================
//  Screen and dimensions
// ==================================================================
paloulaDDE.dragdropScreen = ( function(dragdropScreenModule) {	
		var mouseLeftRightDirection = "";
		var mouseUpDownDirection = "";		 
		var oldMouseLeft = 0;
		var oldMouseTop = 0;
		var isAndroid = false;	
		
		dragdropScreenModule.getViewportHeightWithToolbar = function() {
				var viewportHeight = paloulaDDE.dragdropScreen.getViewportHeight();
				var windowInnerHeight = 0;
				
				if (typeof window.innerHeight !== "undefined") {
						
						if (window.innerHeight != null) {
								windowInnerHeight = window.innerHeight;
								
								if (windowInnerHeight < viewportHeight) {
										viewportHeight = windowInnerHeight;
								}
						}							
				}		

				return viewportHeight;
		}
		
		dragdropScreenModule.getViewportWidth = function() {
				var viewportWidth = parseInt(document.documentElement.clientWidth); //window.innerWidth;
			
				return viewportWidth;
		};
			
		dragdropScreenModule.getViewportHeight = function() {
				var viewportHeight = parseInt(document.documentElement.clientHeight); //window.innerHeight;
				
				return viewportHeight;
		};
			
		dragdropScreenModule.getWindowScrollWidth = function() {
				var windowScrollWidth = parseInt(document.documentElement.scrollWidth);

				return windowScrollWidth;
		};
		
		dragdropScreenModule.getWindowScrollHeight = function() {
				var windowScrollHeight = parseInt(document.documentElement.scrollHeight);
				
				return windowScrollHeight;
		};

		dragdropScreenModule.getWindowScrollLeft = function() {		
		
				var windowScrollLeft = window.pageXOffset;						
						
				if (windowScrollLeft == null || windowScrollLeft == "undefined" || document.body.scrollLeft > windowScrollLeft) {
						windowScrollLeft = document.body.scrollLeft;
						console.log("getWindowScrollLeft1");
				}	
				
				if (windowScrollLeft == null || windowScrollLeft == "undefined" || window.scrollX > windowScrollLeft) {
						windowScrollLeft = window.scrollX;
						console.log("getWindowScrollLeft2");
				}					
				
				/*
				paloulaDDE.screenConsole.log(
							{headline: "document.body.scrollLeft", value: document.body.scrollLeft}, 
							{headline: "window.pageXOffset", value: window.pageXOffset},
							{headline: "document.documentElement.scrollLeft", value: document.documentElement.scrollLeft},
							{headline: "document.scrollingElement.scrollLeft", value: document.documentElement.scrollLeft},
							{headline: "window.scrollX", value: window.scrollX}
				);
				*/
				
				return parseInt(windowScrollLeft);						
		};
		
		dragdropScreenModule.getWindowScrollTop = function() {
				var windowScrollTop = window.pageYOffset;
				
				if (windowScrollTop == null || windowScrollTop == "undefined" || window.scrollY > windowScrollTop) {
						windowScrollLeft = window.scrollY;
				}	
					
				/*
				paloulaDDE.screenConsole.log(
							{headline: "document.body.scrollTop", value: document.body.scrollTop}, 
							{headline: "window.pageYOffset", value: window.pageYOffset},
							{headline: "document.documentElement.scrollTop", value: document.documentElement.scrollTop},
							{headline: "document.scrollingElement.scrollTop", value: document.documentElement.scrollTop},
							{headline: "window.scrollY", value: window.scrollY}
				);
				*/
					
				return parseInt(windowScrollTop);
		};
		
		dragdropScreenModule.setMouseDirection = function(event) {
				if (oldMouseLeft < event.pageX) {
						mouseLeftRightDirection = "right";
				} else {
						mouseLeftRightDirection = "left";
				}
		 
				if (oldMouseTop < event.pageY) {
						mouseUpDownDirection = "down";
				} else {
						mouseUpDownDirection = "up";
				}
		 
				oldMouseLeft = event.pageX;
				oldMouseTop = event.pageY;		 
		};
		
		dragdropScreenModule.elementInViewport = function($element) {
				var elementOffset = $element.offset(); 
				var scrollLeft = paloulaDDE.dragdropScreen.getWindowScrollLeft(); 
				var scrollTop = paloulaDDE.dragdropScreen.getWindowScrollTop(); 
				var elementLeft = parseInt(elementOffset.left - scrollLeft);
				var elementTop = parseInt(elementOffset.top - scrollTop);
				
			  var elementWidth =  parseInt($element.width());
				var elementHeight =  parseInt($element.height());
			  var elementOuterWidth =  parseInt($element.outerWidth());
				var elementOuterHeight =  parseInt($element.outerHeight());
			  var elementInnerWidth =  parseInt($element.innerWidth());
				var elementInnerHeight =  parseInt($element.innerHeight());
				var element = $element.get(0);
				var elementClientWidth = element.clientWidth;
				var elementClientHeight = element.clientHeight;
				
				var viewportPositionElement = {
						left: elementLeft,
						top : elementTop,
						right: elementLeft + elementOuterWidth,
						bottom: elementTop + elementOuterHeight,
						width: elementWidth,
						height: elementHeight,
						outerWidth: elementOuterWidth,
						outerHeight: elementOuterHeight,
						innerWidth: elementInnerWidth,
						innerHeight: elementInnerHeight,
						clientWidth: elementClientWidth,
						clientHeight: elementClientHeight
				}
				
				return viewportPositionElement;
		};

		dragdropScreenModule.elementInDocument = function($element) {
				var elementOffset = $element.offset(); 
				var elementLeft = parseInt(elementOffset.left);
				var elementTop = parseInt(elementOffset.top);				
			  var elementWidth =  parseInt($element.width());
				var elementHeight =  parseInt($element.height());
			  var elementOuterWidth =  parseInt($element.outerWidth());
				var elementOuterHeight =  parseInt($element.outerHeight());
			  var elementInnerWidth =  parseInt($element.innerWidth());
				var elementInnerHeight =  parseInt($element.innerHeight());
				var element = $element.get(0);
				var elementClientWidth = element.clientWidth;
				var elementClientHeight = element.clientHeight;
				var elementBorderLeftWidth = parseInt($element.css("border-left-width"));
				var elementBorderTopWidth = parseInt($element.css("border-top-width"));
				var elementBorderRightWidth = parseInt($element.css("border-right-width"));
				var elementBorderBottomWidth = parseInt($element.css("border-bottom-width"));
				
				var documentPositionElement = {
						left: elementLeft,
						top : elementTop,
						leftBorder: elementLeft - elementBorderLeftWidth,
						topBorder: elementTop - elementBorderTopWidth,
						rightBorder: elementLeft + elementOuterWidth + elementBorderRightWidth,
						bottomBorder: elementTop + elementOuterHeight + elementBorderBottomWidth,
						right: elementLeft + elementOuterWidth,
						bottom: elementTop + elementOuterHeight,
						width: elementWidth,
						height: elementHeight,
						outerWidth: elementOuterWidth,
						outerHeight: elementOuterHeight,
						innerWidth: elementInnerWidth,
						innerHeight: elementInnerHeight,
						clientWidth: elementClientWidth,
						clientHeight: elementClientHeight
				}
				
				return documentPositionElement;
		};
		
		/*
		dragdropScreenModule.mouseInViewport = function(event) {
				var viewportPositionMouse	= null;			
				
				if(isAndroid){
						viewportPositionMouse = {
								left: event.targetTouches[0].clientX,
								top : event.targetTouches[0].clientY
						}						
				}	else{
						viewportPositionMouse = {
								left: event.clientX,
								top : event.clientY
						}
				} 				
				
				return viewportPositionMouse;
		};
		*/

		dragdropScreenModule.mouseInDocument = function(event) {
				var documentPositionMouse	= null;			
				
				if(isAndroid == true){
						documentPositionMouse = {
								left: event.targetTouches[0].pageX,
								top : event.targetTouches[0].pageY
						}						
				}	else{
						documentPositionMouse = {
								left: event.pageX,
								top : event.pageY
						}
				} 				
				
				
				return documentPositionMouse;
		};		

		dragdropScreenModule.elementToMouse = function(event, $element) {
				var elementInDocument = paloulaDDE.dragdropScreen.elementInDocument($element);
				var mouseInDocument =  paloulaDDE.dragdropScreen.mouseInDocument(event);
				
				var elementToMouse = {
						distLeft: mouseInDocument.left - elementInDocument.left,
						distTop: mouseInDocument.top - elementInDocument.top,
						distRight: elementInDocument.right - mouseInDocument.left,
						distBottom: elementInDocument.bottom - mouseInDocument.top,
				}
				
				return elementToMouse;
		};
		
		dragdropScreenModule.elementToCoordinates = function(left, top, $element) {
				var elementInDocument = paloulaDDE.dragdropScreen.elementInDocument($element);
				
				var elementToMouse = {
						distLeft: left - elementInDocument.left,
						distTop: top - elementInDocument.top,
						distRight: left - elementInDocument.right,
						distBottom: top - elementInDocument.bottom
						
				}
				
				return elementToMouse;
		};
		
		dragdropScreenModule.getMouseDirection = function() {
				var mouseDirection = {
						mouseLeftRightDirection: mouseLeftRightDirection,
						mouseUpDownDirection: mouseUpDownDirection
				}
				
				return mouseDirection;
		};
		
		dragdropScreenModule.isAndroid = function() {
				return isAndroid;
		};
		
		(function init() {				
				if( (navigator.userAgent || navigator.vendor || window.opera).match( /Android/i ) ){
						isAndroid = true;
						console.log("isAndroid" + isAndroid);
				}				
				
				$(document).bind( "mousemove touchmove", function(event){
						paloulaDDE.dragdropScreen.setMouseDirection(event);
				});	
		})();
		
		return dragdropScreenModule; 
} (paloulaDDE.dragdropScreen || {}));

// ==================================================================
// Events
// ==================================================================
paloulaDDE.events = ( function(eventsModule) {	
		var _mouseDownDelay = null;
		var _mouseIsDown = null;
		
		var clearAllTimer = function() {
				clearMouseIsDown();
				clearMouseDownDelay();
		};	

		var clearMouseDownDelay = function() {
				clearTimeout(_mouseDownDelay);
		};
		
		var clearMouseIsDown = function() {
				clearTimeout(_mouseIsDown);
				clearInterval(_mouseIsDown);
		};
		
		eventsModule.addNewDragElementListener = function($dragElement) {
				
				$dragElement.bind( "mousedown", function(event){
						paloulaDDE.stateOfThings.scroll.setPageIsScrollingByUser(false);		
						paloulaDDE.stateOfThings.scroll.setDropAreaIsScrollingByUser(false);
						
						_mouseDownDelay = setTimeout(function() {			
								paloulaDDE.dragdrop.dragStart($dragElement, event);
						}, 200);	

						_mouseIsDown = setInterval(function () {
								paloulaDDE.scroll.checkScrollState();
						}, 100);
				});	
				
				$dragElement.bind( "touchstart", function(event){
						paloulaDDE.stateOfThings.scroll.setPageIsScrollingByUser(false);		
						paloulaDDE.stateOfThings.scroll.setDropAreaIsScrollingByUser(false);
						event = jQuery.Event(event);
						paloulaDDE.stateOfThings.handleMousePositionInDocument(event);
						
						_mouseDownDelay = setTimeout(function() {			
								paloulaDDE.dragdrop.dragStart($dragElement, event);
						}, 200);	

						_mouseIsDown = setInterval(function () {
								paloulaDDE.scroll.checkScrollState();
						}, 100);
				});	
				
				$dragElement.on( "click", function(event){		
						clearAllTimer();
						paloulaDDE.dragdrop.handleSelection($dragElement);						
						event.stopPropagation();
				});				
		};

		eventsModule.addDragDropEventListener = function() {
				
				$("UL.paloula-dragdrop-list > LI").each( function() {
						var $dragElement = $(this);
						paloulaDDE.events.addNewDragElementListener($dragElement);						
				});

				document.addEventListener('scroll', function(event) {
						paloulaDDE.stateOfThings.scroll.setPageIsScrollingByUser(true)
						clearTimeout(_mouseDownDelay);
				});

				document.addEventListener('touchmove', function(event) {
						event = jQuery.Event(event);
						paloulaDDE.stateOfThings.handleMousePositionInDocument(event);
						
						if (paloulaDDE.stateOfThings.dragDrop.getDragInProgress() == false) {
								paloulaDDE.stateOfThings.scroll.setPageIsScrollingByUser(true)
								clearTimeout(_mouseDownDelay);
						} else {
								paloulaDDE.dragdrop.dragNow(event);
						}
						
				}, { passive: false });

				var dropAreas = document.getElementsByClassName("paloula-dragdrop-list");
				
				for (var i = 0; i < dropAreas.length; i++) {
							dropAreas[i].addEventListener('scroll', function(event) {
									//event.preventDefault();
									paloulaDDE.stateOfThings.scroll.setDropAreaIsScrollingByUser(true);
							}, { passive: false });
				}

				document.addEventListener('mousemove', function(event) {
						event = jQuery.Event(event);
						paloulaDDE.stateOfThings.handleMousePositionInDocument(event);
						paloulaDDE.dragdrop.dragNow(event);
						
				});
				
				$(document, window).bind("mouseup touchend", function(event){
						clearAllTimer();
						paloulaDDE.stateOfThings.scroll.resetScrollingStates();
						paloulaDDE.dragdrop.dragEnd();
				});
		};

		return eventsModule; 
} (paloulaDDE.events || {}));
// ==================================================================
// Prepare Dom
// ==================================================================
paloulaDDE.prepareDom = ( function(prepareDomModule) {	
		var errors = false;
		
		prepareDomModule.prepare = function() {
				checkIdsDropAreas();
				prepareDropAreaCss();
				checkIdsDragElements();
				//prepareDomForAndroidMobile();
				prepareDomBodyHTML();
				
				if (errors == false) {
						paloulaDDE.prepareDom.resetWidthHeight();
						paloulaDDE.prepareDom.normalizeWidthVerticalDropArea();
						paloulaDDE.prepareDom.normalizeWidthHeightInlineDropArea();
						prepareDragElements();
				}
				
				if (errors == false) {
						paloulaDDE.dragdrop.init();
				}
				
		};
		
		var prepareDragElements = function() {
				$("UL.paloula-dragdrop-list > LI").attr("draggable", "false");
		}
		
		/*
		var prepareDomForAndroidMobile = function() {				
				
				if (paloulaDDE.dragdropScreen.isAndroid()) {
						$("HTML").css({
								"overflow-x": "auto",
								"overflow-y": "auto"
						});
						
						$("BODY").css({
								"overflow-x": "auto",
								"overflow-y": "auto"
						});			
				}
		};
		*/
		
		var prepareDomBodyHTML = function() {
				
				$("HTML").css({
						"overflow-x": "hidden",
						"overflow-y": "auto",
						"max-width": "100%",
						"display": "block",
						"position": "relative",
						"height": "100%",
						"width": "100%",
						"margin" : 0,
						"padding" : 0
				});
				
				$("BODY").css({
						"overflow-x": "hidden",
						"overflow-y": "auto",
						"max-width": "100%",
						"display": "block",
						"position": "relative",
						"min.height": "100%",
						"min-width": "100%",					
						"margin" : 0,
						"padding" : 0
				});		
		};
		
		var checkIdsDropAreas = function() {
				$("UL.paloula-dragdrop-list").each( function() {
						$paloulaDropArea = $(this);
						var paloulaDropAreaId = $paloulaDropArea.attr("id");				
						
						if (paloulaDropAreaId == undefined) {
								errors = true;
								console.log("[paloulaDDE.dragdropeasy:" + "UL.paloula-dragdrop-list" + "without id - " + "not initialized!")
						} 
				});
		};
		
		var prepareDropAreaCss = function() {
				$("UL.paloula-dragdrop-list").each( function() {
						$paloulaDropArea = $(this);
								
						$paloulaDropArea.css({
								"margin-left" : "0",
								"margin-top" : "0",
								"margin-right" : "0",
								"margin-bottom" : "0",
								"padding-left" : "0",
								"padding-top" : "0",
								"padding-right" : "0",
								"padding-bottom" : "0",
								"list-style" : "none",
								"position" : "relative",
								"font-size" : "0",
								"letter-spacing" : "0",
								"overflow-y" : "auto",
								"overflow-x" : "hidden"
						});						
				});
		};
		
		var checkIdsDragElements = function() {
				$("UL.paloula-dragdrop-list > LI").each( function() {
						$paloulaDragElement = $(this);
						var paloulaDragElementId = $paloulaDragElement.attr("id");				
						
						if (paloulaDragElementId == undefined) {
								errors = true;
								console.log("[paloulaDDE.dragdropeasy:" + "UL.paloula-dragdrop-list > LI" + "without id - " + "not initialized!")
						} else {
								$paloulaDragElement.addClass("paloula-dragdrop-element");
						}
				});			
		};
		
		prepareDomModule.resetWidthHeight = function() {
				
				$("UL.paloula-inline-list").each( function() {
						$(this).css({
									"width" :  "",
									"height" : ""
						});							
				});
				
				$("LI.paloula-dragdrop-element").each( function() {
						$(this).css({
									"width" :  "",
									"height" : ""
						});							
				});
				
		};
		
		prepareDomModule.normalizeWidthVerticalDropArea = function() {
				$("UL.paloula-vertical-list").each( function() {
						$paloulaDropArea = $(this);
						var paloulaDropAreaId = $paloulaDropArea.attr("id");	

						$("#" + paloulaDropAreaId + " > LI").css({
									"width" : "100%",
									"min-height" : "10px",
									"display" : "block",
									"position" : "relative",
									"margin" : "0",
									"padding" : "0"									
						});									
				});	
				
				
				
		};
		
		prepareDomModule.normalizeWidthHeightInlineDropArea = function() {	
						
				$("UL.paloula-inline-list").each( function() {
						$paloulaDropArea = $(this);
						var paloulaDropAreaId = $paloulaDropArea.attr("id");						
						var dragElementCounter = 0;
						var dragElementsHeight = 0;
						var maxOuterWidth = 0;
						var maxOuterHeight = 0;
						var maxInnerWidth = 0;
						var scrollbarWidth = 0;
						var paloulaDragElementMarginLeft;
						var paloulaDragElementMarginRight;						
						
						$paloulaDropArea.children( ".paloula-dragdrop-element" ).each( function() {
								dragElementCounter = dragElementCounter + 1;
								$paloulaDragElement = $(this);								
								var dragElementInDocument = paloulaDDE.dragdropScreen.elementInDocument($paloulaDragElement);
								var paloulaDragElementHeight = dragElementInDocument.height;
								dragElementsHeight = dragElementsHeight + paloulaDragElementHeight;
								
								var paloulaDragElementOuterWitdh = dragElementInDocument.outerWidth;
								var paloulaDragElementOuterHeight = dragElementInDocument.outerHeight;
								var paloulaDragElementInnerWitdh = dragElementInDocument.innerWidth;
								
								if ((paloulaDragElementInnerWitdh) > maxOuterWidth) {
										maxOuterWidth = paloulaDragElementOuterWitdh;
								}
								
								if ((paloulaDragElementInnerWitdh) > maxInnerWidth) {
										maxInnerWidth = paloulaDragElementInnerWitdh;
								}
								
								if (paloulaDragElementOuterHeight > maxOuterHeight) {
										maxOuterHeight = paloulaDragElementOuterHeight;
								}
								
								paloulaDragElementMarginLeft = parseInt($paloulaDragElement.css("margin-left"));
								paloulaDragElementMarginRight = parseInt($paloulaDragElement.css("margin-right"));
								
						});
						
						if ( $paloulaDropArea.children( ".paloula-dragdrop-element" ).length == 0) {
								var $paloulaDragElement = $($("<li class='paloula-dragdrop-element' style='display: inline-block; visibility: hidden'></li>"));
								$paloulaDropArea.append($paloulaDragElement);
								dragElementCounter = 1;
						
								var dragElementInDocument = paloulaDDE.dragdropScreen.elementInDocument($paloulaDragElement);
								dragElementsHeight = dragElementInDocument.height;
								var paloulaDragElementOuterWitdh = dragElementInDocument.outerWidth;
								var paloulaDragElementOuterHeight = dragElementInDocument.outerHeight;
								var paloulaDragElementInnerWitdh = dragElementInDocument.innerWidth;
								
								maxOuterWidth = paloulaDragElementOuterWitdh;
								maxInnerWidth = paloulaDragElementInnerWitdh;
								maxOuterHeight = paloulaDragElementOuterHeight;
														
								paloulaDragElementMarginLeft = parseInt($paloulaDragElement.css("margin-left"));
								paloulaDragElementMarginRight = parseInt($paloulaDragElement.css("margin-right"));
								
								$paloulaDragElement.remove();
						}
						
						var paloulaDragElementsAverageHeight = dragElementsHeight/dragElementCounter;
						
						$("#" + paloulaDropAreaId + " > LI").css({
									"height" : paloulaDragElementsAverageHeight + "px",
									"min-height" : "10px",
									"width" :  maxInnerWidth + "px",
									"display" : "inline-block",
									"position" : "relative",
									"margin" : "0",
									"padding" : "0"
						});				
						
						$paloulaDropArea.attr("data-elements-width", maxInnerWidth);
						$paloulaDropArea.attr("data-elements-height", paloulaDragElementsAverageHeight);
						$paloulaDropArea.attr("data-elements-outer-height", maxOuterHeight);						
						
						var paloulaDropAreaInDocument = paloulaDDE.dragdropScreen.elementInDocument($paloulaDropArea);
						var paloulaDropAreaClientWidth = paloulaDropAreaInDocument.clientWidth;
						
						var maxOuterWidthWithMargins =  maxOuterWidth + paloulaDragElementMarginLeft + paloulaDragElementMarginRight;
						var calculatedColumnspaloulaDropArea = Math.floor(paloulaDropAreaClientWidth/maxOuterWidthWithMargins);
						//console.log ("navigator:"  + navigator.userAgent + "  "  +  navigator.vendor + "  "  +  window.opera);
						var $paloulaDropAreaJS = $paloulaDropArea.get(0);
						var scrollbarWidth = $paloulaDropAreaJS.offsetWidth - $paloulaDropAreaJS.clientWidth;
						var newWidth = calculatedColumnspaloulaDropArea * maxOuterWidthWithMargins + scrollbarWidth + 1;
						
						$paloulaDropArea.css({
									"width" :  newWidth + "px",
						});				

				});	
			
		};
		
		return prepareDomModule; 
} (paloulaDDE.prepareDom || {}));
// ==================================================================
// Resize Timer
// ==================================================================
paloulaDDE.resizeTimer = ( function(resizeTimerModule) {	
		var resizeTimer = null;
		
		resizeTimerModule.setTimer = function(resizeFunction)  {
				clearTimeout(resizeTimer);				
				paloulaDDE.prepareDom.resetWidthHeight();
				
				resizeTimer = setTimeout(function() {
						//console.log("[paloula dragdropeasy] resize");
						paloulaDDE.prepareDom.normalizeWidthVerticalDropArea();
						paloulaDDE.prepareDom.normalizeWidthHeightInlineDropArea();		
				}, 250);		
		};
		
		return resizeTimerModule; 
} (paloulaDDE.resizeTimer || {}));
// ==================================================================
// Utils
// ==================================================================
paloulaDDE.utils = (function (utilsModule) {
		utilsModule.getRandomAlphanumericString = function (startChar, stringLength) {
				
				if (startChar == null) {
						startChar = "";					
				}
				
				var idExists = true;
				var randomId = startChar + "";    
				var charset = "abcdefghijklmnopqrstuvwxyz0123456789";

				while (idExists == true) {
						for( var i=0; i < stringLength; i++ ) {
								randomId = randomId + charset.charAt(Math.floor(Math.random() * charset.length));
						}
						
						var controlDuplicateElement = document.getElementById(randomId);
						
						if (controlDuplicateElement == null) {
								idExists = false;
						}
				}
				
				return randomId;
		}

		return utilsModule; 
		
} (paloulaDDE.utils || {}));
// ==================================================================
// Callback
// ==================================================================
paloulaDDE.callback = (function (callbackModule) {
		var _dragDropProtocol = null;

		callbackModule.addToDragDropProtocol = function (elementSourceId, elementTargetId, parentSourceId, parentTargetId, displaceElementId, dropDirection) {
					
				if (_dragDropProtocol == null) {
						 _dragDropProtocol = {dragdropaction : paloulaDDE.dragdrop.getOptions().copyMove+"", draggedelements:[]};
				}
				
				var draggedElement = {
						elementSourceId : elementSourceId,
						elementTargetId : elementTargetId,
						parentSourceId : parentSourceId,
						parentTargetId : parentTargetId,
						dropped : dropDirection,
						displaceElementId : displaceElementId,
				}
				
				_dragDropProtocol.draggedelements.push(draggedElement);
		}
		
		callbackModule.callbackDropped = function () {	
				
				if (paloulaDDE.dragdrop.getOptions().callBackDropped != null) {
						paloulaDDE.dragdrop.getOptions().callBackDropped(_dragDropProtocol);
				}
				
				_dragDropProtocol = null;
		};	
		
		return callbackModule; 
		
} (paloulaDDE.callback || {}));
// ==================================================================
// DOM Ready
// ==================================================================
$(document).ready( function() { 
		paloulaDDE.prepareDom.prepare();
		
		$(window).on('resize',  function(e) {
				paloulaDDE.resizeTimer.setTimer();
		});
});
// ==================================================================
// Screen Console
// ==================================================================
paloulaDDE.screenConsole = ( function(screenConsoleModule) {	

		screenConsoleModule.log = function (logItems) {
				var $log = $("UL#paloulaLog");
				
				if ($log.length > 0) {
						
						for(var arg = 0; arg < arguments.length; ++ arg) {
								var logItem = arguments[arg];
								var headline = logItem.headline;
								var value = logItem.value;
								var id = headline.replace(/\./g,'_')
								id = id.replace(/\s/g, '_');
								var $headlineInLog = $log.find("#"+id);
								//console.log(headline + " " + id);
								
								if ($headlineInLog.length == 0) {
										var $headline = $($("<li>" + headline + "</li>"));
										$headline.attr("id", id);
										var $value =  $($("<li>" + value + "</li>"));
										$log.append($headline);
										$log.append($value);
								} else if ($headlineInLog.length == 1) {
										
										$headlineInLog.text(headline);
										$headlineInLog.next().text(value);
								}
						}			
				}
		}
		
		return screenConsoleModule

} (paloulaDDE.screenConsole || {}));
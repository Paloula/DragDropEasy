var toggleSwitchControls  = ( function(controlsModule) {	
				
		controlsModule.initToggleSwitch = function() {			
				$("BODY").find(".toggle-switch").each( function() {
						var $toggleSwitch = $(this);
						var kathreinToggleSwitch = new KathreinToggleSwitch($toggleSwitch);
						$toggleSwitch.data("kathreinToggleSwitchObject", kathreinToggleSwitch);
				});			
		};	
		
		function KathreinToggleSwitch ($toggleSwitch) {
				var $toggleSwitch = $toggleSwitch;
				var callBackChange = $toggleSwitch.attr("data-callback");
				var dataValueActive = $toggleSwitch.attr("data-value-active");
				var dataValueLeft = $toggleSwitch.find(".toggle-switch-left").attr("data-value");
				var dataValueRight = $toggleSwitch.find(".toggle-switch-right").attr("data-value");
				
				if (dataValueActive == dataValueLeft) {
						$toggleSwitch.find(".toggle-switch-left").addClass("toggle-switch-active");
						$toggleSwitch.find(".toggle-switch-right").addClass("toggle-switch-inactive");
				} else if (dataValueActive == dataValueRight) {
						$toggleSwitch.find(".toggle-switch-right").addClass("toggle-switch-active");
						$toggleSwitch.find(".toggle-switch-left").addClass("toggle-switch-inactive");
				}						

				var $activeSwitch = $toggleSwitch.find(".toggle-switch-active");
				var activeSwitchValue = $activeSwitch.attr("data-value");
				$toggleSwitch.parent().find("INPUT").val(activeSwitchValue);
				var activeSwitchWidth = $activeSwitch.outerWidth();
				var $inactiveSwitch = $toggleSwitch.find(".toggle-switch-inactive");
				var inactiveSwitchWidth = $inactiveSwitch.outerWidth();

				if (activeSwitchWidth > inactiveSwitchWidth) {
						$inactiveSwitch.outerWidth(activeSwitchWidth);
				} else {
						$activeSwitch.outerWidth(inactiveSwitchWidth);
				}

				$toggleSwitch.click( function(event) {
						event.stopPropagation();
						var $activeSwitch = $toggleSwitch.find(".toggle-switch-active");
						var activeSwitchWidth = $activeSwitch.width();						
						var $inactiveSwitch = $toggleSwitch.find(".toggle-switch-inactive");						
						var inactiveSwitchText = $inactiveSwitch.text();
						var inactiveSwitchValue = $inactiveSwitch.attr("data-value");
						$toggleSwitch.parent().find("INPUT").val(inactiveSwitchValue);
						var $activeClone = $activeSwitch.clone();
						$activeSwitch.blur();
						$inactiveSwitch.blur();

						if ($activeSwitch.hasClass("toggle-switch-left")) {											
								$activeClone.css({
										'position' : 'absolute', 
										'top' : '0', 
										'left' : '0', 
										'width' : activeSwitchWidth, 
										'opacity': 0.5
								});			
								
								$toggleSwitch.append($activeClone);

								$activeClone.animate({'left' : '50%'}, function() {								
										$activeClone.delay(200).text(inactiveSwitchText);
										$activeSwitch.removeClass("toggle-switch-active").addClass("toggle-switch-inactive");
										$inactiveSwitch.addClass("toggle-switch-active").removeClass("toggle-switch-inactive");
										$activeClone.remove();						
								});

						} else {										
								$activeClone.css({
										'position' : 'absolute', 
										'top' : '0', 
										'left' : '50%', 
										'width' : activeSwitchWidth, 
										'opacity': 0.5
								});		
								
								$toggleSwitch.append($activeClone);

								$activeClone.animate({'left' : '0'}, function() {	
										$activeClone.delay(200).text(inactiveSwitchText);
										$activeSwitch.removeClass("toggle-switch-active").addClass("toggle-switch-inactive");
										$inactiveSwitch.addClass("toggle-switch-active").removeClass("toggle-switch-inactive");
										$activeClone.remove();						
								});
						}
						
						sendCallbackChange();
				});		

				var sendCallbackChange = function() {
						var value = $toggleSwitch.parent().find("INPUT").val();

						if (callBackChange != null) {
								eval(callBackChange);
						}
				};
		};
		
		
		
		return controlsModule; 
} (toggleSwitchControls || {}));

toggleSwitchControls.initToggleSwitch();
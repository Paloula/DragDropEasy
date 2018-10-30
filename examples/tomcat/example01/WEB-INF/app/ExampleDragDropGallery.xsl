<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template match="/root">
		<!-- ======================================================================================== -->
		<html>
			<head>
				<meta charset="utf-8"/>
				<meta content="no-cache" http-equiv="cache-control"/>
				<meta content="no-cache" http-equiv="pragma"/>
				<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0"/>
				<meta name="apple-mobile-web-app-capable" content="yes"/>
				<title>Paloula DragDropEasy</title>
				<link href="app/css/paloula-dragdrop-easy.css" rel="stylesheet"/>
				<link href="app/css/page.css" rel="stylesheet"/>
			</head>
			<style>
			</style>
			<body>
				<header id="app-example-logo-wrapper">
					<img class="app-logo" src="app/img/logo_1000_001.png"/>
					<img class="app-slogan" src="app/img/slogan_1000_002.png"/>
				</header>
				<div class="gallery-settings-layout">
					<div class="gallery-settings">
						<div class="toggle-container"> 
							<ul data-value-original="singleselcet" data-value-active="singleselcet" data-callback="demoGallery.changeSelect(value)" id="changeSelect" class="toggle-switch"> 
								<li data-value="singleselcet" class="toggle-switch-left">Singleselect</li> 
								<li data-value="multiselcet" class="toggle-switch-right">Multiselect</li> 
							</ul> 
							<input id="selectValue" type="hidden" /> 
						</div> 

						<div class="toggle-container"> 
							<ul data-value-original="move" data-value-active="move" data-callback="demoGallery.changeCopyMode(value)" id="changeCopy" class="toggle-switch"> 
								<li data-value="move" class="toggle-switch-left">Move</li> 
								<li data-value="copy" class="toggle-switch-right">Copy</li> 
							</ul> 
							<input id="copyValue" type="hidden" /> 
						</div> 
					</div>
				</div>

				<main class="app-example-content">
					<div class="galleries-wrapper">
						<xsl:for-each select="gallery">
							<div class="galleries-column">
								<ul class="paloula-dragdrop-list paloula-inline-list gallery" id="{./@id}">
									<xsl:for-each select="./media">
										<xsl:sort select="./@pos" data-type="number"/>
										<li id="{./@id}">
											<div class="galler-img-wrapper">

												<xsl:choose>
													<xsl:when test="./@orientation = 'landscape'">
														<img class="img-landscape" src="app/img/galleries/{@src}"/>
													</xsl:when>
													<xsl:when test="./@orientation = 'portrait'">
														<img class="img-portrait" src="app/img/galleries/{@src}"/>
													</xsl:when>
												</xsl:choose>												

											</div>							
										</li>					
									</xsl:for-each>
								</ul>		
							</div>	
						</xsl:for-each>
					</div>
				</main>		

				<script src="app/js/jquery-3.2.1.min.js"></script> 
				<script src="app/js/paloula.dragdropeasy-0.8.js"></script> 
				<script src="app/js/dragdropexamples.js"></script>
				<script src="app/js/controls.js"></script>
				<script>
						var paloulaDragDropOptions = {
								copyMove: "move",
								multiSelect: false,
								dragDropModeActivated: true,
								callBackDropped: demoGallery.callBackDropped
						};	
				</script>
				<div class="ajax-wait" style="position: absolute; display: none; visibility: hidden; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0 ,0 ,0.8);">
					
					<div class="ajax-wait-message-wrapper" id="transfer" style="display: none; visibility: hidden;">
						<div class="ajax-wait-spinner">	</div>
						<p class="ajax-wait-message">Transfer to Server...</p>
					</div>
					
					<div class="ajax-wait-message-wrapper" id="error" style="display: none; visibility: hidden;">
						<div class="ajax-error-icon">	</div>
						<p class="ajax-error-message" id="ajaxErrorMessage">Transfer to Server...</p>
						<button class="reload-button">OK! Reload Page</button>
					</div>
					
				</div>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>

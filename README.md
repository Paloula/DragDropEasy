# DragDropEasy

Easy to integrate:
<ul class="paloula-dragdrop-list paloula-inline-list" id="yourIdOfList">
	<li id="yourId1">
		<!-- Your Content -->
	</li>
	<li id="yourId2">
		 <!-- Your Content -->
	</li>
	<li id="yourId3">
		<!-- Your Content -->
	</li>
	<li id="yourId4">
		 <!-- Your Content -->
	</li>
	<li id="yourId5">
		 <!-- Your Content -->
	</li>
</ul>

<script src="app/js/jquery-3.2.1.min.js"></script>
<script src="app/js/paloula.dragdropeasy-0.8.js"></script>


Init if with your own parameters:
<script>
    var paloulaDragDropOptions = {
        copyMove: "move",
        multiSelect: false,
        dragDropModeActivated: true,
        callBackDropped: demoGallery.callBackDropped
    };
</script>

Link css:
<link href="app/css/paloula-dragdrop-easy.css" rel="stylesheet"/>

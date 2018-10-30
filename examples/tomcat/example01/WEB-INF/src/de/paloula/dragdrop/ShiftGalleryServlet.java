package de.paloula.dragdrop;

import java.io.IOException;
import java.net.URISyntaxException;
import java.text.ParseException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.JDOMException;
import org.json.JSONArray;
import org.json.JSONObject;

import de.paloula.web.client.ServletOut;
import de.paloula.xml.commons.JDomXPath;
import de.paloula.xml.commons.PaloulaXmlException;
import de.paloula.xml.sequence.Sequence;
import de.paloula.xml.sequence.SequenceDrag;

@SuppressWarnings("serial")
public class ShiftGalleryServlet extends HttpServlet {

	public void doGet(HttpServletRequest request, HttpServletResponse response) {
		HttpSession session = request.getSession();
		
		if (session.isNew()) {		
			ShiftGalleryServlet.redirectOnNewSession(request, response);	
		} else {
			handleShift(request, response);
		}	
	}

	private static void handleShift(HttpServletRequest request, HttpServletResponse response) {
		HttpSession session = request.getSession();
		JSONObject dragResult = new JSONObject();
		
		try {
			SessionDragDrop.handleSession(session);

			Sequence sequenceGallery = (Sequence) session.getAttribute("sessionGallerySequence");
			String dragDropProtocolSubmitted = request.getParameter("dragDropProtocol");
			JSONObject dragDropProtocol = new JSONObject(dragDropProtocolSubmitted);			
			String dragdropaction = dragDropProtocol.getString("dragdropaction");
			JSONArray draggedElements = dragDropProtocol.getJSONArray("draggedelements");
			
			for (int i = 0; i < draggedElements.length(); i++) {
				JSONObject shiftElement = draggedElements.getJSONObject(i);
				String dropDirection = shiftElement.getString("dropped");
				String displaceElementId = shiftElement.getString("displaceElementId");
				String shiftElementId = shiftElement.getString("elementSourceId");
				String elementNewId = shiftElement.getString("elementTargetId");
				String parentSourceId = shiftElement.getString("parentSourceId");
				String parentTargetId = shiftElement.getString("parentTargetId");
				
				Document galleryXML = sequenceGallery.getXmlDocument();
				Element dragElement = JDomXPath.getFirstElement("//*[@id='" + shiftElementId + "']", galleryXML);
				Element targetElement = JDomXPath.getFirstElement("//*[@id='" + displaceElementId + "']", galleryXML);
				Element targetGallery = JDomXPath.getFirstElement("//*[@id='" + parentTargetId + "']", galleryXML);
				String targetElementPos = targetElement.getAttributeValue("pos");
				Integer targetPosition = Integer.valueOf(targetElementPos);
				
				if (dragdropaction.equals("move") && dropDirection.equals("before")) {
					SequenceDrag.moveElementWithinAllSiblings(sequenceGallery, dragElement, targetGallery, targetPosition);
				} else 	if (dragdropaction.equals("move") && dropDirection.equals("after")) {
					targetPosition = targetPosition + 1;
					SequenceDrag.moveElementWithinAllSiblings(sequenceGallery, dragElement, targetGallery, targetPosition);
				} else if (dragdropaction.equals("copy") && dropDirection.equals("before")) {
					SequenceDrag.copyElementWithinAllSiblings(sequenceGallery, dragElement, targetGallery, targetPosition, elementNewId);
				} else 	if (dragdropaction.equals("copy") && dropDirection.equals("after")) {
					targetPosition = targetPosition + 1;
					SequenceDrag.copyElementWithinAllSiblings(sequenceGallery, dragElement, targetGallery, targetPosition, elementNewId);
				}		

				//System.out.println(JDomDocument.getStringFromDocumentExpand(xmlGalleryDocument));	
			}
			dragResult.put("dragResult", "success");
			ServletOut.ajaxJSONOutput(response, dragResult);
			
		} catch (URISyntaxException | PaloulaXmlException | JDOMException | IOException | ParseException e) {
			e.printStackTrace();
			dragResult.put("dragResult", "failure");
			dragResult.put("errorMessage", "" + e);
			try {
				ServletOut.ajaxJSONOutput(response, dragResult);
			} catch (IOException e1) {
				e1.printStackTrace();
			}
		}		
	}
	
	private static void redirectOnNewSession(HttpServletRequest request, HttpServletResponse response) {
		System.out.println("redirectOnNewSession");
		String sn = request.getServerName();
		String cp = request.getContextPath();
		String redirectUrl = "http://" + sn + cp + "/gallery.html";
		System.out.println("redirectUrl " + redirectUrl);
		
		try {
			ServletOut.redirectAjax(response, redirectUrl);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
		doGet(request, response);
	}

}

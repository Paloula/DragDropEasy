package de.paloula.dragdrop;

import java.io.IOException;
import java.net.URISyntaxException;

import javax.servlet.http.HttpSession;

import org.jdom2.Document;
import org.jdom2.JDOMException;

import de.paloula.xml.commons.PaloulaXmlException;
import de.paloula.xml.sequence.Sequence;

public class SessionDragDrop {

	private SessionDragDrop() {
	}

	public static void handleSession(HttpSession session) throws PaloulaXmlException, JDOMException, IOException, URISyntaxException {
		SessionDragDrop.sessionDocument(session);
	}

	private static void sessionDocument(HttpSession session) throws PaloulaXmlException, JDOMException, IOException, URISyntaxException {
		Document sessionDocument = (Document) session.getAttribute("sessionGallery");
		Sequence sequenceGallery = (Sequence) session.getAttribute("sessionGallerySequence");
		
		
		if (sessionDocument == null || sequenceGallery == null) {
			System.out.println("sessionDocumentnull");
			
			sessionDocument = DragDropCommons.getGalleryXML();
			session.setAttribute("sessionGallery", sessionDocument);

			sequenceGallery = new Sequence(sessionDocument);
			session.setAttribute("sessionGallerySequence", sequenceGallery);
		}
	}

}

package de.paloula.dragdrop;

import java.io.IOException;
import java.net.URISyntaxException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.xml.transform.TransformerException;

import org.jdom2.Document;
import org.jdom2.JDOMException;

import de.paloula.web.client.ServletOut;
import de.paloula.xml.commons.PaloulaXmlException;

@SuppressWarnings("serial")
public class ExampleDragDropServlet extends HttpServlet {

	public void doGet(HttpServletRequest request, HttpServletResponse response) {
		HttpSession session = request.getSession();
		
		try {
			SessionDragDrop.handleSession(session);		
			Document sessionGallery = (Document) session.getAttribute("sessionGallery");
			Document xslDocument = DragDropCommons.getGalleryXSL();
			
			ServletOut.html5Output(response, sessionGallery, xslDocument);
			
		} catch (URISyntaxException e) {
			e.printStackTrace();
		} catch (JDOMException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} catch (TransformerException e) {
			e.printStackTrace();
		} catch (PaloulaXmlException e) {
			e.printStackTrace();
		}
		
	}
	
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
		doGet(request, response);
	}
	
}

package de.paloula.dragdrop;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.jdom2.Document;
import org.jdom2.JDOMException;

import de.paloula.xml.commons.JDomDocument;

public class DragDropCommons {

	public static Document getXSL() throws JDOMException, IOException, URISyntaxException {
		Path appPath = DragDropCommons.getAppPath();
		Path xslPath = appPath.resolve("ExampleDragDrop.xsl");
		Document xslDocument = JDomDocument.getJDomDocument(xslPath);
		
		return xslDocument;
	}
	
	public static Document getGalleryXSL() throws JDOMException, IOException, URISyntaxException {
		Path appPath = DragDropCommons.getAppPath();
		Path xslPath = appPath.resolve("ExampleDragDropGallery.xsl");
		Document xslDocument = JDomDocument.getJDomDocument(xslPath);
		
		return xslDocument;
	}
	
	public static Document getGalleryXML() throws JDOMException, IOException, URISyntaxException {
		Path appPath = DragDropCommons.getAppPath();
		Path xslPath = appPath.resolve("galleries.xml");
		Document xslDocument = JDomDocument.getJDomDocument(xslPath);
		
		return xslDocument;
	}

	public static Document getIndexXML() throws JDOMException, IOException, URISyntaxException {
		Path appPath = DragDropCommons.getAppPath();
		Path xslPath = appPath.resolve("index.xml");
		Document xslDocument = JDomDocument.getJDomDocument(xslPath);
		
		return xslDocument;
	}
	
	private static Path getAppPath() throws URISyntaxException {
		URI classPath = DragDropCommons.class.getProtectionDomain().getCodeSource().getLocation().toURI();
		Path appPath = Paths.get(classPath).getParent();
		appPath = appPath.resolve("app");
		
		return appPath;
	}	
	

	
}

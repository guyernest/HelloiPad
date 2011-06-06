package com.hp.btoaw.demo;

import org.junit.Test;

import com.google.appengine.repackaged.org.json.JSONException;
import com.google.appengine.repackaged.org.json.JSONObject;


public class AjaxResponseServletTest {
	
	@Test
	public void isAbleToGenerateJson() {
	
		AjaxResponseServlet servletUnderTest = new AjaxResponseServlet();
		JSONObject json = servletUnderTest.getJson();
		try {
			System.out.println(json.toString(4));
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	@Test
	public void isAbleToGenerateElementsJson() {
	
		JSONObject json = Elements.getJson();
		try {
			System.out.println(json.toString(4));
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}

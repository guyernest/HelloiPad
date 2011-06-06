package com.hp.btoaw.demo;

import org.json.JSONException;
import org.json.JSONObject;
import org.junit.Test;

import com.hp.btoe.engine.api.KPIResultBO;

public class GaugeDemoServletTest {

	@Test
	public void testGetKPI() throws JSONException {
		GaugeDemoServlet gaugeDemoServlet = new GaugeDemoServlet();
		KPIResultBO kpi = gaugeDemoServlet.getRandomKPI(true);
		System.out.println(new JSONObject(kpi).toString(4));
	}

	@Test
	public void testGetDemoKPI() throws JSONException {
		GaugeDemoServlet gaugeDemoServlet = new GaugeDemoServlet();
		System.out.println(gaugeDemoServlet.getDemoKpi().toString(4));
	}

	@Test
	public void testGetFlatDemoKPI() throws JSONException {
		GaugeDemoServlet gaugeDemoServlet = new GaugeDemoServlet();
		System.out.println(gaugeDemoServlet.getFlatDemoKpi().toString(4));
	}
	
}

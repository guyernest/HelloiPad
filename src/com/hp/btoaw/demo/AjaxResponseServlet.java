package com.hp.btoaw.demo;

import java.io.IOException;
import javax.servlet.http.*;

import com.google.appengine.repackaged.org.json.JSONArray;
import com.google.appengine.repackaged.org.json.JSONException;
import com.google.appengine.repackaged.org.json.JSONObject;

@SuppressWarnings("serial")
public class AjaxResponseServlet extends HttpServlet {
	public void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {
		resp.setContentType("application/json");
		JSONObject json = Elements.getJson();

		resp.getWriter().println(json.toString());
//		resp.getWriter().println("Ext.util.JSONP.callback("+json.toString()+")");

//		resp.getWriter().println("Ext.util.JSONP.callback({ \"data\": { } ],  \"weatherIconUrl\": [ {\"value\": \"http://www.worldweatheronline.com/images/wsymbols01_png_64/wsymbol_0001_sunny.png\" } ], \"winddir16Point\": \"SSW\", \"winddirDegree\": \"200\", \"windspeedKmph\": \"13\", \"windspeedMiles\": \"8\" } ],  \"request\": [ {\"query\": \"Tel Aviv, Israel\", \"type\": \"City\" } ],  \"weather\": [ {\"date\": \"2011-05-13\", \"precipMM\": \"0.7\", \"tempMaxC\": \"23\", \"tempMaxF\": \"73\", \"tempMinC\": \"17\", \"tempMinF\": \"62\", \"weatherCode\": \"113\",  \"weatherDesc\": [ {\"value\": \"Sunny\" } ],  \"weatherIconUrl\": [ {\"value\": \"http://www.worldweatheronline.com/images/wsymbols01_png_64/wsymbol_0001_sunny.png\" } ], \"winddir16Point\": \"W\", \"winddirDegree\": \"273\", \"winddirection\": \"W\", \"windspeedKmph\": \"30\", \"windspeedMiles\": \"19\" }, {\"date\": \"2011-05-14\", \"precipMM\": \"1.3\", \"tempMaxC\": \"22\", \"tempMaxF\": \"72\", \"tempMinC\": \"15\", \"tempMinF\": \"60\", \"weatherCode\": \"113\",  \"weatherDesc\": [ {\"value\": \"Sunny\" } ],  \"weatherIconUrl\": [ {\"value\": \"http://www.worldweatheronline.com/images/wsymbols01_png_64/wsymbol_0001_sunny.png\" } ], \"winddir16Point\": \"W\", \"winddirDegree\": \"262\", \"winddirection\": \"W\", \"windspeedKmph\": \"28\", \"windspeedMiles\": \"17\" } ] }})");
	}

	private static final String[] elements = {
		"1	H	Hydrogen	1	1	1	availability	0.00008988	14.175	20.28	14.304	2.20	1400",
		"2	He	Helium	18	1	4	ALM	0.0001785	n/a6	4.22	5.193	-	0.008",
		"3	Li	Lithium	1	2	7	incident	0.534	453.85	1615	3.582	0.98	20",
		"4	Be	Beryllium	2	2	9	incident	1.85	1560.15	2742	1.825	1.57	2.8",
		"5	B	Boron	13	2	10	defects	2.34	2573.15	4200	1.026	2.04	10",
		"6	C	Carbon	14	2	12	defects	2.267	3948.157	4300	0.709	2.55	200",
		"7	N	Nitrogen	15	2	14	financial	0.0012506	63.29	77.36	1.04	3.04	19",
		"8	O	Oxygen	16	2	16	financial	0.001429	50.5	90.20	0.918	3.44	461000",
		"9	F	Fluorine	17	2	19	SLA	0.001696	53.63	85.03	0.824	3.98	585",
		"10	Ne	Neon	18	2	20	SLA	0.0008999	24.703	27.07	1.03	-	0.005",
	};
	
	protected JSONObject getJson() {
		JSONObject json = new JSONObject();
		try {
			JSONArray items = new JSONArray();
			for (String element : elements) {
				JSONObject elem = new JSONObject();
				String[] split = element.split("\\t");
				elem.put("id", split[0]);
				elem.put("categories", split[6]);
				elem.put("symbol", split[1]);
				elem.put("category", split[6]);
				elem.put("number", split[0]);
				elem.put("name", split[2]);
				elem.put("weight", split[5]);
				elem.put("chart", "http://2.chart.apis.google.com/chart?chs=95x75&cht=gom&chd=t:"+split[0]+"&chf=bg,s,EFEFEF00");
				items.put(elem);
			}
			
			json.put("weather",items);
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return json;
	}

	
}

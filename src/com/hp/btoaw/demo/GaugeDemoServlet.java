package com.hp.btoaw.demo;

import java.io.IOException;
import java.text.NumberFormat;
import java.util.Hashtable;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Random;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.hp.btoe.engine.api.KPIDefinitionBO;
import com.hp.btoe.engine.api.KPIResultBO;
import com.hp.btoe.engine.api.KpiResultTreeNode;
import com.hp.btoe.engine.api.ObjectiveResultTreeNode;
import com.hp.btoe.engine.api.ResultStatus;
import com.hp.btoe.engine.api.ResultThreshold;
import com.hp.btoe.engine.api.ResultTrend;

/**
 * Servlet implementation class GaugeDemoServlet
 */
//@WebServlet(description = "DrawKPIGauge", urlPatterns = { "/GaugeDemoServlet" })
public class GaugeDemoServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * Map of the perspectives and their objective maps
	 * Key - the name of the perspective
	 * Value - a map of the objectives of this perspectives
	 */
	private static final Map<String, Map<String, ObjectiveResultTreeNode>> itsObjectiveMap = new Hashtable<String, Map<String, ObjectiveResultTreeNode>>();

    public static Map<String, Map<String, ObjectiveResultTreeNode>> getObjectiveMap() {
		return itsObjectiveMap;
	}

	/**
     * Default constructor. 
     */
    public GaugeDemoServlet() {
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
//		KPIResultBO[] kpis = new KPIResultBO[3];
//		for (int i = 0; i < kpis.length; i++) {
//			kpis[i] = getRandomKPI(true);
//		}
		
		try {
//			JSONArray array = new JSONArray(kpis);
//			JSONArray array = getDemoKpi();
			JSONObject array = new JSONObject();
			array.put("kpis", getFlatDemoKpi());

			ServletOutputStream out = response.getOutputStream();
		    response.setContentType("text/plain"); 
				out.write(array.toString(3).getBytes());
		} catch (JSONException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		
	}

	protected KPIResultBO getRandomKPI(boolean recursive) {
		KPIResultBO kpi = new KPIResultBO();
		kpi.setStatus(ResultStatus.GOOD);
		kpi.setTrend(ResultTrend.DOWN);
		Random random = new Random();
		int start = random.nextInt(50);
		KPIDefinitionBO definitionBO = kpi.getDefinitionBO();
		definitionBO.setRangeFrom((float) start);
		definitionBO.setGoodFrom((float) start);
		int goodTo = start + random.nextInt(50);
		definitionBO.setGoodTo((float) goodTo);
		definitionBO.setWarningFrom((float) goodTo);
		int warningTo = goodTo + random.nextInt(50);
		definitionBO.setWarningTo((float) warningTo);
		int rangeTo = warningTo + random.nextInt(50);
		definitionBO.setRangeTo((float) rangeTo);
		int value = start + random.nextInt(rangeTo-start);
		kpi.setCalculationValue((float) value);
		kpi.setName("HTML KPI "+value);
		kpi.setTrend(ResultTrend.DOWN);
		definitionBO.setUnit("Unit");
		definitionBO.setThresholdType(ResultThreshold.MAXIMIZE);
		if (recursive) {
			KPIResultBO innerKPI = getRandomKPI(false);
			kpi.getChildrenMap().put(innerKPI.getId(), innerKPI);
		}
		return kpi;
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}
	
	protected JSONArray getDemoKpi() throws JSONException {

		for (String kpiString : kpis) {
			try {
				String[] split = kpiString.split("\t");
				String perspectiveName = split[Field.Perspective.ordinal()];
				String objectiveName = split[Field.Objective.ordinal()];
				ObjectiveResultTreeNode objective = getObjectiveNode(perspectiveName, objectiveName);
				Map<Long, KpiResultTreeNode> kpisMap = objective.getKpis();
				KPIResultBO kpi = new KPIResultBO();
				kpi.setId(Long.parseLong(split[Field.ID.ordinal()]));
				int score = Integer.parseInt(split[Field.Score.ordinal()]);
				if (score<4) {
					kpi.setStatus(ResultStatus.ERROR);
				} else if (score<7) {
					kpi.setStatus(ResultStatus.WARNING);
				} else 
					kpi.setStatus(ResultStatus.GOOD);
				String trend = split[Field.Trend.ordinal()];
				if (trend.equals("1")) {
					kpi.setTrend(ResultTrend.UP);					
				} else if (trend.equals("0")) {
					kpi.setTrend(ResultTrend.SAME);					
				} else 
					kpi.setTrend(ResultTrend.DOWN);
				int start = Integer.parseInt(split[Field.Range_From.ordinal()]);
				KPIDefinitionBO definitionBO = kpi.getDefinitionBO();
				definitionBO.setRangeFrom((float) start);
				int goodFrom = Integer.parseInt(split[Field.Good_From.ordinal()]);
				definitionBO.setGoodFrom((float) goodFrom);
				int goodTo = Integer.parseInt(split[Field.Good_To.ordinal()]);
				definitionBO.setGoodTo((float) goodTo);
				int warningFrom = Integer.parseInt(split[Field.Warning_From.ordinal()]);
				definitionBO.setWarningFrom((float) warningFrom);
				int warningTo = Integer.parseInt(split[Field.Warning_To.ordinal()]);
				definitionBO.setWarningTo((float) warningTo);
				int rangeTo = Integer.parseInt(split[Field.Range_To.ordinal()]);
				definitionBO.setRangeTo((float) rangeTo);
				int value = Integer.parseInt(split[Field.Value.ordinal()]);
				kpi.setCalculationValue((float) value);
				kpi.setScore(Float.parseFloat(split[Field.Score.ordinal()]));
				kpi.setName(split[Field.KPI.ordinal()]);
				definitionBO.setDescription(split[Field.Description.ordinal()]);
				definitionBO.setUnit(split[Field.Unit_Type.ordinal()]);
				definitionBO.setThresholdType(ResultThreshold.MAXIMIZE);
				KpiResultTreeNode node = new  KpiResultTreeNode();
				node.setResult(kpi);
				kpisMap.put(kpi.getId(), node);
			} catch (NumberFormatException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		Map<String, Map<String, ObjectiveResultTreeNode>> perspectives = GaugeDemoServlet.getObjectiveMap();
		JSONArray perspectiveArray = new JSONArray();
		for (Entry<String, Map<String, ObjectiveResultTreeNode>> perspective : perspectives.entrySet()) {
			String perspectiveName = perspective.getKey();
			JSONObject perpectiveObject = new JSONObject();
			perpectiveObject.put("perspective_name", perspectiveName);
			Map<String, ObjectiveResultTreeNode> objectives = perspective.getValue();
			JSONArray objectiveArray = new JSONArray();
			for (Entry<String, ObjectiveResultTreeNode> objective : objectives.entrySet()) {
				float objectiveScore = 0;
				String objectiveName = objective.getKey();
				JSONObject objectiveObject = new JSONObject();
				objectiveObject.put("objective_name", objectiveName);
				JSONArray kpiArray = new JSONArray();
				Map<Long, KpiResultTreeNode> kpis = objective.getValue().getKpis();
				for (KpiResultTreeNode kpiNode : kpis.values()) {
					KPIResultBO kpi = kpiNode.getResult();
					objectiveScore += kpi.getScore();
					kpiArray.put(new JSONObject(kpi));
				}
				objectiveScore /= kpis.size();
				NumberFormat nf = NumberFormat.getInstance();
				nf.setMaximumFractionDigits(2);
				objectiveObject.put("objective_score", nf.format(objectiveScore));
				if (objectiveScore < 10f/3) {
					objectiveObject.put("objective_status", -1);					
				} else if (objectiveScore < 20f/3) {
					objectiveObject.put("objective_status", 0);					
				} else {
					objectiveObject.put("objective_status", 1);					
				}
				objectiveObject.put("kpis", kpiArray);
				objectiveArray.put(objectiveObject);
			}
			perpectiveObject.put("objectives", objectiveArray);
			perspectiveArray.put(perpectiveObject);
		}

		return perspectiveArray;
	}
	
	private ObjectiveResultTreeNode getObjectiveNode(String perspectiveName, String objectiveName) {
		if (!itsObjectiveMap.containsKey(perspectiveName)) {
			Map<String, ObjectiveResultTreeNode> objectiveMap = new Hashtable<String, ObjectiveResultTreeNode>();
			itsObjectiveMap.put(perspectiveName, objectiveMap);
		} 
		Map<String, ObjectiveResultTreeNode> objectiveMap = itsObjectiveMap.get(perspectiveName);
		if (!objectiveMap.containsKey(objectiveName)) {
			ObjectiveResultTreeNode objective = new ObjectiveResultTreeNode();
			objective.setKpis(new Hashtable<Long, KpiResultTreeNode>());
			objectiveMap.put(objectiveName, objective);
		}
		ObjectiveResultTreeNode objective = objectiveMap.get(objectiveName);
		return objective;
		
	}

	protected JSONArray getFlatDemoKpi() throws JSONException {

		JSONArray answer = new JSONArray();
		for (String kpiString : kpis) {
			JSONObject kpi = new JSONObject();
			String[] split = kpiString.split("\t");
			for (Field field : Field.values()) {
				try {
					kpi.put(field.name(), split[field.ordinal()]);
				} catch (Exception e) {
					System.out.println(kpiString);
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			answer.put(kpi);
		}
		return answer;
	}

	
	public enum Field {
		ID, 
		Perspective, 
		Objective, 
		KPI, 
		Description, 
		Business_Questions, 
		Unit_Type, 
		Time_Period, 
		Direction, 
		Range_From, 
		Range_To, 
		Good_From, 
		Good_To, 
		Warning_From, 
		Warning_To, 
		Value, 
		Score, 
		Trend, 
		Personas,
	};	
	
	private static final String[] kpis = {
	
		"1	IT Value	Alignment with Business Strategy	% of Capex vs Opex Spending	The capitalized expense relative to operational expense.	How does Capex spending compare to Opex spending?	%	Monthly	Centralize	0	200	80	120	40	160	40	3	1	CIO;#VP FM;#PMO",
		"2	IT Value	Alignment with Business Strategy	Innovation Delivery	The discretionary cost divided by the actual cost.	 Make sure our discretionary spending is aligned with our innovation goals. What are the discretionary and non-discretionary values for the fiscal period? How does discretionary spending compare to non-discretionary spending? What percentage of the total discretionary and non-discretionary??? 	%	Monthly	Centralize	0	100	20	40	10	50	30	8	-1	CIO;#VP FM;#VP Apps;#PMO",
		"99	Customer	Improve Customer Satisfaction	% of Met SLAs	The number of met SLAs relative to the total number of SLAs.	Make sure that our SLAs meet the goal, over time.	%	Monthly	Maximize	0	100	99	100	90	99	80	5	0	CIO;#VP Ops;#Director of Service Management",
		"35	Customer	Improve Customer Satisfaction	% of Satisfied Customers	The number of satisfied customers relative to the total number of customers. Customer satisfaction is based on the criteria and on customer satisfaction surveys and feedback.	Make sure our deliveries of products and services are meeting customer expectations.	%	Monthly	Maximize	0	100	90	100	75	90	72	6	1	CIO;#VP Ops;#Director of Service Management",
		"24	Customer	Improve Customer Satisfaction	% of Service level Objectives for IT Process Activities which Were Met	The number of service level objectives for IT process activities that were met relative to the total number of IT process activities during the measurement period.	Make sure the processes for IT responses to incidents within the SLAs are efficient.	%	Monthly	Maximize	0	100	99	100	95	99	99	8	-1	CIO;#VP Ops;#Director of Service Management",
		"27	Customer	Improve Customer Satisfaction	Downtime % of SLAs	The number of outages relative to the total SLA uptime, during the measurement period.	Make sure that our service delivery is meeting customer expectations.	%	Monthly	Minimize	0	100	0	2	2	5	1	8	0	CIO;#VP Ops;#VP Apps;#PMO",
		"30	Customer	Improve Service Delivery Performance	% of Service Availability	The average service availability over the measurement period.	Make sure our service availability is meeting customer expectations.	%	Monthly	Maximize	90	100	99	100	95	99	99	8	1	CIO;#VP Ops",
		"48	Customer	Improve Service Delivery Performance	% of Service Performance Met	The number of periods when service performance was met, relative to the total number of periods in the measurement time frame.	Make sure our service performance is meeting expectations.	%	Monthly	Maximize	0	100	99	100	90	99	91	7	0	CIO;#VP Ops;#Director of Service Management",
		"110	Customer	Improve Service Delivery Performance	Avg Outage Duration Per Incident	The average duration of outages associated with an incident.	Make sure our outage resolution policy is efficient.	Hours	Monthly	Minimize	0	72	0	24	24	48	21	7	1	CIO;#VP Ops;#Director of Service Management",
		"129	Customer	Improve Service Delivery Performance	Number of Close Incidents	The amount of incidents closed during the specific period		Incidents	Monthly	Maximize	0	500	400	500	100	400	423	7	-1	CIO;#VP Ops;#Director of Service Management",
		"123	Customer	Improve Service Delivery Performance	Number of Open Incidents	The amount of new incidents opened during the specific period		Incidents	Monthly	Minimize	0	1000	0	200	200	500	312	6	1	CIO;#VP Ops",
		"117	Customer	Improve Service Delivery Performance	Service Mean Time To Recover From Critical Error	Mean Time to Recover. The average time that a service will take to recover from Critical status	Make sure our serviceability levels are high. Make sure our customers are satisfied. Make sure our operations are efficient.	Hours	Monthly	Minimize	0	48	0	12	12	24	9	8	-1	CIO;#VP Ops;#Director of Service Management",
		"111	Customer	Improve Service Delivery Performance	Service MTBF	Mean Time Between Failures. The average time between failures of the services. 	Make sure our serviceability levels are high. Make sure our customers are satisfied. Make sure our operations are efficient.	Hours	Monthly	Maximize	0	96	36	96	24	36	29	5	0	CIO;#VP Ops",
		"114	IT Value	Reduce Cost	% of Change in Assets Cost	 The last period asset cost relative to the previous period.	Make sure our assets costs are under control. Make sure our asset management is improving. 	%	Monthly	Minimize	0	100	0	95	95	98	25	8	1	CIO;#VP Ops",
		"121	IT Value	Stewardship of IT Investment	% of Actual vs Planned Projects Cost	The actual costs relative to the planned projects cost.	Make sure our business agility from the projects perspective is efficient.	%	Monthly	Centralize	50	150	90	105	75	120	78	7	-1	CIO;#VP Ops;#Director of Service Management",
		"115	Operational Excellence	Achieve Process Excellence	% of Assets in Maintenance	The number of assets in maintenance relative to the total number of assets.	Make sure we have enough assets to work efficiently.	%	Monthly	Minimize	0	100	0	5	5	80	2	9	1	CIO;#VP Ops;#Director of Service Management",
		"116	Operational Excellence	Achieve Process Excellence	% of Assets Returned to Supplier	The number of assets returned to the suppliers relative to the total number of assets.	Make sure we have enough assets to work efficiently. Should we change suppliers?	%	Monthly	Minimize	0	100	0	5	5	80	5	7	1	CIO;#VP Ops;#Director of Service Management",
		"122	Operational Excellence	Achieve Process Excellence	% of Changes Resulted in Outage	The number of changes opened during the measurement period that resulted in unexpected outage, relative to the total number of changes.	Make sure changes implications and risk assesments are correct	%	Monthly	Minimize	0	50	0	5	5	10	7	6	-1	CIO;#VP Ops;#Director of Service Management",
		"18	Operational Excellence	Achieve Process Excellence	% of Emergency Changes	The number of opened, urgent changes relative to the total number of changes opened during the measurement period.	 Make sure that the potential risk of urgent changes does not impact the quality and performance of the projects and that our change management process is efficient.	%	Monthly	Minimize	0	100	0	20	20	40	13	8	0	CIO;#VP Ops",
		"109	Operational Excellence	Achieve Process Excellence	% of Escalated Incidents	The number of escalated incidents relative to the total incidents opened during the measurement period.	Make sure that our incident management process is efficient and that the major number of incidents are solved by the first or second support tiers.	%	Monthly	Minimize	0	100	0	10	10	20	10	7	-1	CIO;#VP Ops;#Director of Service Management",
		"14	Operational Excellence	Achieve Process Excellence	% of Reopened Incidents	The number of closed incidents that were re-opened, relative to the total number of incidents closed during the measurement period. This KPI is meaningful only if your Incident Management process allows reopening calls.	Make sure our incident closing process is efficient.	%	Monthly	Minimize	0	100	0	5	5	10	2	9	1	CIO;#VP Ops;#Director of Service Management",
		"25	Operational Excellence	Achieve Process Excellence	% of SLA Expirations	The number of SLAs that expired (that are still active but passed their end date) relative to the total number of SLAs during the measurement period. 	Make sure we are providing the best service to our customers. Maker sure our services are up to date.	%	Monthly	Minimize	0	100	0	1	1	3	1	7	-1	CIO;#VP Ops;#Director of Service Management",
		"8	Operational Excellence	Achieve Process Excellence	% of SLAs Coverage	The number of business processes not covered by a defined service availability plan relative to the total number of business processes.	Make sure that the service availability plan is on track.	%	Monthly	Maximize	0	100	75	100	50	75	77	7	0	CIO;#VP Ops;#Director of Service Management",
		"16	Operational Excellence	Achieve Process Excellence	% of Software Licenses in Use	The number of used software licenses relative to the total purchased software licenses. 	Make sure our software license purchasing is efficient.	%	Monthly	Maximize	0	100	75	100	50	75	78	7	-1	CIO;#VP FM;#VP Ops",
		"50	Operational Excellence	Achieve Process Excellence	% of Unauthorized Implemented Changes	The number of unplanned implemented changes relative to the total number of implemented changes during the measurement period.	Make sure our change policy is efficient.	%	Monthly	Minimize	0	100	0	15	15	30	21	5	0	CIO;#VP Ops",
		"124	Operational Excellence	Achieve Process Excellence	% of Unplanned Changes	The number of unplanned changes opened during the measurement period, relative to the total number of changes.	Make sure the change process is efficient and controlled.	%	Monthly	Minimize	0	100	0	15	15	25	24	4	1	CIO;#VP Ops",
		"29	Operational Excellence	Achieve Process Excellence	Avg Age of Hardware Assets	The average age of hardware assets.	Make sure our policy of hardware asset renewal is on track.	Months	Monthly	Centralize	0	60	36	48	0	54	37	7	-1	CIO;#VP Ops;#Director of Service Management",
		"32	Operational Excellence	Achieve Process Excellence	Change Success Rate	The number of successful changes relative to the total number of changes.	Make sure our change processes are efficient.	%	Monthly	Maximize	0	100	90	100	75	90	99	10	0	CIO;#VP Ops;#Director of Service Management",
		"126	Operational Excellence	Achieve Process Excellence	Changes Backlog Size	backlog of opened change requests that are pending a desicion		#	Monthly	Minimize	0	50	0	10	10	20	2	9	0	CIO;#VP Ops;#PMO",
		"128	Operational Excellence	Achieve Process Excellence	Incidents Backlog Size	The amount of pending incidents		#	Monthly	Minimize	0	100	0	10	10	40	5	8	1	CIO;#VP Ops",
		"130	Operational Excellence	Achieve Process Excellence	Mean Time to Resolution for Incidents			Hours	Monthly	Minimize	0	72	0	24	24	48	27	6	-1	CIO;#VP Ops;#Director of Service Management",
		"127	Operational Excellence	Achieve Process Excellence	Number of Completed Changes	The purpose of this KPI is to track number of Normal and Standard changes. Track as well total number of changes being completed on a daily/weekly/monthly basis		Changes	Monthly	Centralize	0	1000	400	600	300	700	599	7	0	CIO;#VP Ops",
		"7	Operational Excellence	Improve Responsiveness	% of FCR	(% first call resolution of service requests) The number of interactions that were solved by the first line without assistance from other support lines, relative to the total number of interactions that occurred during the measurement period	Make sure that the service desk management process is efficient and that the majority of interactions are solved by the first level support. If this number is too high you probably need to improve the self help tools in your organization	%	Monthly	Centralize	0	100	40	60	20	80	44	7	1	CIO;#VP Ops",
		"49	Operational Excellence	Improve Responsiveness	% of Interactions in Backlog	The number of open interactions that are older than 28 days (or any other given time frame) relative to the total number of open interactions. This number reflects the size of the backlog of old unresolved interactions.	Make sure that the majority of interactions are solved during the given time frame.	%	Monthly	Minimize	0	100	0	10	10	20	11	6	-1	CIO;#VP Ops",
		"40	Operational Excellence	Improve Responsiveness	% of Older Incidents	The number of open incidents older than 5 days (or any other given time frame) relative to the total number of open incidents.	Make sure that the majority of the incidents are solved during the given time frame.	%	Monthly	Minimize	0	50	0	5	5	10	2	8	0	CIO;#VP Ops;#Director of Service Management",
		"118	Operational Excellence	Improve Responsiveness	Avg Interaction Closure Duration	The average time ellapsed from the interaction creation time till the interaction close time.	Make sure our interaction processes are efficient.	Hours	Monthly	Minimize	0	36	0	12	12	24	0	10	1	CIO;#VP Ops;#Director of Service Management",
		"31	Operational Excellence	Improve Responsiveness	Avg Time to Procure Hardware	The average time needed to procure an item defined as the time lag between a request for procurement and the contract signing or the purchase.	Make sure our procuration policy is efficient.	Days	Monthly	Minimize	0	90	0	15	15	45	2	10	-1	CIO;#VP Ops;#VP Process;#Director of Service Management;#BRM	};",
		};
}

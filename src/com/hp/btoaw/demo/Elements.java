package com.hp.btoaw.demo;

import com.google.appengine.repackaged.org.json.JSONArray;
import com.google.appengine.repackaged.org.json.JSONException;
import com.google.appengine.repackaged.org.json.JSONObject;

public class Elements {
	
	/**
	 * Taken from http://chemistry.wikia.com/wiki/List_of_elements_by_atomic_mass
	 */
	private static final String[] THE_ELEMENTS = {
	
	"1	Hydrogen	H	1.00794	1	1	7",
	"2	Helium	He	4.002602	18	1	9",
	"3	Lithium	Li	6.941	1	2	0",
	"4	Beryllium	Be	9.012182	2	2	1",
	"5	Boron	B	10.811	13	2	6",
	"6	Carbon	C	12.0107	14	2	7",
	"7	Nitrogen	N	14.0067	15	2	7",
	"8	Oxygen	O	15.9994	16	2	7",
	"9	Fluorine	F	18.9984032	17	2	8",
	"10	Neon	Ne	20.1797	18	2	9",
	"11	Sodium	Na	22.98976928	1	3	0",
	"12	Magnesium	Mg	24.3050	2	3	1",
	"13	Aluminium	Al	26.9815386	13	3	5",
	"14	Silicon	Si	28.0855	14	3",
	"15	Phosphorus	P	30.973762	15	3",
	"16	Sulfur	S	32.065	16	3",
	"17	Chlorine	Cl	35.453	17	3	8",
	"19	Potassium	K	39.0983	1	4	0",
	"18	Argon	Ar	39.948	18	3",
	"20	Calcium	Ca	40.078	2	4	1",
	"21	Scandium	Sc	44.955912	3	4",
	"22	Titanium	Ti	47.867	4	4",
	"23	Vanadium	V	50.9415	5	4",
	"24	Chromium	Cr	51.9961	6	4",
	"25	Manganese	Mn	54.938045	7	4",
	"26	Iron	Fe	55.845	8	4",
	"27	Cobalt	Co	58.933195	9	4",
	"28	Nickel	Ni	58.6934	10	4",
	"29	Copper	Cu	63.546	11	4",
	"30	Zinc	Zn	65.409	12	4",
	"31	Gallium	Ga	69.723	13	4",
	"32	Germanium	Ge	72.64	14	4",
	"33	Arsenic	As	74.92160	15	4",
	"34	Selenium	Se	78.96	16	4",
	"35	Bromine	Br	79.904	17	4	8",
	"36	Krypton	Kr	83.798	18	4",
	"37	Rubidium	Rb	85.4678	1	5	0",
	"38	Strontium	Sr	87.62	2	5	1",
	"39	Yttrium	Y	88.90585	3	5",
	"40	Zirconium	Zr	91.224	4	5",
	"41	Niobium	Nb	92.906	5	5",
	"42	Molybdenum	Mo	95.94	6	5",
	"43	Technetium	Tc	98 1	7	5",
	"44	Ruthenium	Ru	101.07	8	5",
	"45	Rhodium	Rh	102.905	9	5",
	"46	Palladium	Pd	106.42	10	5",
	"47	Silver	Ag	107.8682	11	5",
	"48	Cadmium	Cd	112.411	12	5",
	"49	Indium	In	114.818	13	5",
	"50	Tin	Sn	118.710	14	5",
	"51	Antimony	Sb	121.760	15	5",
	"52	Tellurium	Te	127.60	16	5",
	"53	Iodine	I	126.904	17	5	8",
	"54	Xenon	Xe	131.293	18	5",
	"55	Caesium	Cs	132.9054519	1	6	0",
	"56	Barium	Ba	137.327	2	6	1",
	"57	Lanthanum	La	138.90547	0	6",
	"58	Cerium	Ce	140.116	0	6",
	"59	Praseodymium	Pr	140.90765	0	6",
	"60	Neodymium	Nd	144.242	0	6",
	"61	Promethium	Pm	145 1	0	6",
	"62	Samarium	Sm	150.36	0	6",
	"63	Europium	Eu	151.964	0	6",
	"64	Gadolinium	Gd	157.25	0	6",
	"65	Terbium	Tb	158.92535	0	6",
	"66	Dysprosium	Dy	162.500	0	6",
	"67	Holmium	Ho	164.930	0	6",
	"68	Erbium	Er	167.259	0	6",
	"69	Thulium	Tm	168.93421	0	6",
	"70	Ytterbium	Yb	173.04	0	6",
	"71	Lutetium	Lu	174.967	3	6",
	"72	Hafnium	Hf	178.49	4	6",
	"73	Tantalum	Ta	180.94788	5	6",
	"74	Tungsten	W	183.84	6	6",
	"75	Rhenium	Re	186.207	7	6",
	"76	Osmium	Os	190.23	8	6",
	"77	Iridium	Ir	192.217	9	6",
	"78	Platinum	Pt	195.084	10	6",
	"79	Gold	Au	196.966569	11	6",
	"80	Mercury	Hg	200.59	12	6",
	"81	Thallium	Tl	204.3833	13	6",
	"82	Lead	Pb	207.2	14	6",
	"83	Bismuth	Bi	208.98040	15	6",
	"84	Polonium	Po	210 1	16	6",
	"85	Astatine	At	210	17	6	8",
	"86	Radon	Rn	220	18	6",
	"87	Francium	Fr	223	1	7	0",
	"88	Radium	Ra	226	2	7	1",
	"89	Actinium	Ac	227	0	7",
	"91	Protactinium	Pa	231.03588	0	7",
	"90	Thorium	Th	232.03806	0	7",
	"93	Neptunium	Np	237	0	7",
	"92	Uranium	U	238.02891	0	7",
	"95	Americium	Am	243	0	7",
	"94	Plutonium	Pu	244	0	7",
	"96	Curium	Cm	247	0	7",
	"97	Berkelium	Bk	247	0	7",
	"98	Californium	Cf	251	0	7",
	"99	Einsteinium	Es	252	0	7",
	"101	Mendelevium	Md	258	0	7",
	"103	Lawrencium	Lr	262	3	7",
	"104	Rutherfordium	Rf	261	4	7",
	"105	Dubnium	Db	262	5	7",
	"106	Seaborgium	Sg	266	6	7",
	"107	Bohrium	Bh	264	7	7",
	"108	Hassium	Hs	277	8	7",
	"109	Meitnerium	Mt	268	9	7",
	"110	Darmstadtium	Ds	271	10	7",
	"111	Roentgenium	Rg	272	11	7",
	"112	Ununbium	Uub	285	12	7",
	"113	Ununtrium	Uut	284	13	7",
	"114	Ununquadium	Uuq	289	14	7",
	"115	Ununpentium	Uup	288	15	7",
	"116	Ununhexium	Uuh	292	16	7",
	"117	Ununseptium	Uus	294	17	7	8 ",
	"118	Ununoctium	Uuo	294	18	7",
	
	};
	
	private final static String[] THE_SERIES = {
		"Alkali metals",
		"Alkaline earth metals",
		"Lanthanides",
		"Actinides",
		"Transition metals",
		"Poor metals",
		"Metalloids",
		"Nonmetals",
		"Halogens",
		"Noble gases"
	};
	
	private final static String[] THE_CATEGORIES = {
		"availability",
		"SLM",
		"SLA",
		"incident", 
		"CR", 
		"financial",
		"service-desk",
		"defects",
		"availability",
		"SLM",
		"SLA",
		"incident", 
		"CR", 
		"financial",
		"service-desk",
		"defects",
		"availability",
		"SLM",
		"SLA",
		"incident", 
		"CR", 
		"financial",
		"service-desk",
		"defects",
		"availability",
		"SLM",
		"SLA",
		"incident", 
		"CR", 
		"financial",
		"service-desk",
		"defects"
	};
	
	protected static JSONObject getJson() {
		JSONObject json = new JSONObject();
		try {
			JSONArray items = new JSONArray();
			for (String element : THE_ELEMENTS) {
				JSONObject elem = new JSONObject();
				String[] split = element.split("\\t");
				elem.put("id", split[0]);
				int category = Integer.parseInt(split[4]);
				elem.put("categories", THE_CATEGORIES[category]);
				elem.put("symbol", split[2]);
				elem.put("category", THE_CATEGORIES[category]);
				elem.put("number", split[0]);
				elem.put("name", split[1]);
				elem.put("weight", split[3]);
				elem.put("chart", "http://2.chart.apis.google.com/chart?chs=95x75&cht=gom&chd=t:"+split[3]+"&chf=bg,s,EFEFEF00");
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

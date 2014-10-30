var clientIp = process.env.MYIP || getIPAddress();
zibase_ip = "192.168.0.x"
var zibaseIp = process.env.IP_ZIBASE|| zibase_ip;

var zibase_device = require('string');
var zibase_token = require('string');
var zibase_url = require('string');
var util = require("util");
//var Iconv = require('iconv').Iconv;
//var iconvlite = require('iconv-lite');
var fs = require("fs");

var  jeedom_api = require('string');

// A remplir :
zibase_device = "";
zibase_token = "";
jeedom_ip = "192.168.0.x";
jeedom_api = "";

jeedom_chemin_install    = "/jeedom/core/api/jeeApi.php?api=";
jeedom_chemin_preinstall = "/core/api/jeeApi.php?api=";
jeedom_chemin = jeedom_chemin_install; // ou jeedom_chemin = jeedom_chemin_preinstall; si jeedom a ete preinstallee

zibase_url = "http://zibase.net/m/get_xml.php?device="+zibase_device+"&token="+zibase_token;

//var utils = require('util');
var S = require('string');
var request = require("request");
var dgram = require("dgram");
var server = dgram.createSocket("udp4");
var client = dgram.createSocket("udp4");

var periph_file = require('string');	// Variable temporaire pour stocker en fichier les peripheriques
periph_file = "";
var periph_jeedom = require('string');	// Variable temporaire pour stocker les noms des peripheriques
periph_jeedom = "";
var jid = require('string');	// Variable des identifiants de base Jeedom
jid = "";
var jidhygro = require('string');	// Variable des identifiants Jeedom pour les remontees d'hygrometrie
jidhygro = "";
var jidbatterie = require('string');	// Variable des identifiants Jeedom pour les remontees de batterie
jidbatterie = "";
var jidcmd = require('string');	// Variable des identifiants Jeedom pour les remontees de commande (X2D)
jidcmd = "";
var jidradio = require('string');	// Variable des identifiants Jeedom pour les remontees de reception radio
jidradio = "";
var jidpowerstatus = require('string');	// Variable des identifiants Jeedom pour les remontees de Statut sur les equipements de type Power
jidpowerstatus = "";
var jidpowertotal = require('string');	// Variable des identifiants Jeedom pour les remontees 'Total Energy' sur les equipements de type Power
jidpowertotal = "";
var jidpowerpower = require('string');	// Variable des identifiants Jeedom pour les remontees 'Power' sur les equipements de type Power
jidpowertotal = "";
var jidnoise = require('string');	// Variable des identifiants Jeedom pour les remontees de bruit radio de Anémomètre et Pluviomètre Oregon
jidnoise = "";
var jidlevel = require('string');	// Variable des identifiants Jeedom pour les remontees de de niveau de réception radio Anémomètre Oregon
jidlevel = "";
var jidavgwind = require('string');	// Variable des identifiants Jeedom pour les remontees de vitesse de vent de Anémomètre Oregon
jidavgwind = "";
var jiddir = require('string');	// Variable des identifiants Jeedom pour les remontees de direction du vent de Anémomètre Oregon
jiddir = "";
var jidtotalrain = require('string');	// Variable des identifiants Jeedom pour les remontees de Pluviomètre Oregon
jidtotalrain = "";
var jidcurrentrain = require('string');	// Variable des identifiants Jeedom pour les remontees de direction du vent de Pluviomètre Oregon
jidcurrentrain = "";

var jid_descr = require('string');	// Variable temporaire de declaration des identifiants Jeedom et d'initialisation à 0
jid_descr = "";
var jid_file = require('string');	// Variable temporaire pour stocker en fichier les identifiants Jeedom
jid_file = "";

var debug_zwave = require('string');
debug_zwave = "";
var app_script = require('string');
var app_script1 = require('string');
var app_script2 = require('string');
app_script1 = "";
app_script2 = "";
count_periph = 0;
// Variable qui enregistre le script final
// Initialisation du script final dans la variable app_script :

app_script1 = app_script1+'\n\n// ******************************************************************************************************************** \n';
app_script1 = app_script1+'// *****************   Script de lecture de suivi d\'activite de Zibase, et d\'alimentation de Jeedom   ***************** \n';
app_script1 = app_script1+'// *****************   Zeldoi5                                                                        ***************** \n';
app_script1 = app_script1+'// *****************   merci de remplir les variables :                                               ***************** \n';
app_script1 = app_script1+'// *****************   - zibase_device                                                                ***************** \n';
app_script1 = app_script1+'// *****************   - zibase_token                                                                 ***************** \n';
app_script1 = app_script1+'// *****************   - zibase_device                                                                ***************** \n';
app_script1 = app_script1+'// *****************   - jeedom_ip                                                                    ***************** \n';
app_script1 = app_script1+'// *****************   - jeedom_api                                                                   ***************** \n';
app_script1 = app_script1+'// ******************************************************************************************************************** \n';
app_script1 = app_script1+'// XML URL : '+zibase_url+' \n';


app_script1 = app_script1+'var clientIp = process.env.MYIP || getIPAddress();\n';
app_script1 = app_script1+'var zibaseIp = process.env.IP_ZIBASE|| "'+zibase_ip+'";\n';
app_script1 = app_script1+'var S = require(\'string\');\n';

app_script1 = app_script1+'var debug_zwave = require(\'string\');\n';
app_script1 = app_script1+'var debug_http_request = require(\'string\');\n';
app_script1 = app_script1+'debug_zwave = "";\n';
app_script1 = app_script1+'var request = require(\"request\");\n';
app_script1 = app_script1+'var dgram = require(\"dgram\");\n';
app_script1 = app_script1+'var server = dgram.createSocket(\"udp4\");\n';
app_script1 = app_script1+'var client = dgram.createSocket(\"udp4\");\n\n';

app_script1 = app_script1+'var fs = require("fs");\n';

app_script2 = app_script2+'var expr,chacon,oregon,zwave,temp_web = require(\'string\');\n';
app_script2 = app_script2+'var zibase_device, zibase_token = require(\'string\');\n\n';
app_script2 = app_script2+'var owl_id, owl_status = require(\'string\');\n\n';

app_script2 = app_script2+'var b = new Buffer(70);b.fill(0);b.write(\'ZSIG\0\', 0/*offset*/);\n';
app_script2 = app_script2+'b.writeUInt16BE(13,4); //command HOST REGISTERING (13)\n';
app_script2 = app_script2+'b.writeUInt32BE(dot2num(clientIp), 50);\n';
app_script2 = app_script2+'b.writeUInt32BE(0x42CC, 54); // port 17100 0x42CC\n\n';

app_script2 = app_script2+'chacon = false;\n';
app_script2 = app_script2+'oregon = false;\n';
app_script2 = app_script2+'zwave = false;\n';
app_script2 = app_script2+'temp_web = false;\n\n';

app_script2 = app_script2+'console.log(b);\n';
app_script2 = app_script2+'console.log(b.toString(\'hex\', 0, b.length));\n\n';

app_script2 = app_script2+'var parseString = require(\'xml2js\').parseString;\n';
app_script2 = app_script2+'server.on("error", function (err) {\n';
app_script2 = app_script2+'  console.log("server error : " + err.stack);\n';
app_script2 = app_script2+'  server.close();\n';
app_script2 = app_script2+'});\n';
app_script2 = app_script2+'server.on("message", function (msg, rinfo) {\n';
app_script2 = app_script2+'	//Booleen de generation de requete HTTP\n';
app_script2 = app_script2+'	nb_http_request = 0;\n';
app_script2 = app_script2+'\n';
app_script2 = app_script2+'	//Tests des remontees de sondes de temperature/hygrometrie OREGON via les balises id/tem/hum\n';
app_script2 = app_script2+'	id 		= S(msg).between(\'<id>\', \'</id>\').s;\n';
app_script2 = app_script2+'	tem 	= S(msg).between(\'<tem>\', \'</tem>\').s;\n';
app_script2 = app_script2+'	hum 	= S(msg).between(\'<hum>\', \'</hum>\').s;\n';
app_script2 = app_script2+'	rf 		= S(msg).between(\'<rf>\', \'</rf>\').s;\n';
app_script2 = app_script2+'	//Remontee de l\'etat de la batterie\n';
app_script2 = app_script2+'	if (S(msg).include(\'Batt=<bat>\')) {	bat 	= S(msg).between(\'<bat>\', \'</bat>\');}\n';
app_script2 = app_script2+'	else  bat 	= S(msg).between(\'Batt=\', \')\').s;\n';
//app_script2 = app_script2+'	bat 	= S(msg).between(\'<bat>\', \'</bat>\').s;\n';
//app_script2 = app_script2+'	bat2 	= S(msg).between(\'Batt=\', \')\').s;\n';
app_script2 = app_script2+'	if ((bat == "OK" || bat == "ok" || bat == "Ok")) { bat_bool = 1;}\n';
app_script2 = app_script2+'	else { bat_bool = 0}\n';
app_script2 = app_script2+'	dev 	= S(msg).between(\'<dev>\', \'</dev>\').s;\n';
app_script2 = app_script2+'	//Remontee des consommations\n';
app_script2 = app_script2+'	kwh 	= S(msg).between(\'<kwh>\', \'</kwh>\').s;\n';
app_script2 = app_script2+'	w 		= S(msg).between(\'<w>\', \'</w>\').s;\n';
app_script2 = app_script2+'	//Remontee des classes : ex. Class=0x<cla>30</cla>\n';
app_script2 = app_script2+'	cla 	= S(msg).between(\'<cla>\', \'</cla>\').s;\n';
app_script2 = app_script2+'	//Remontee des op : ex. Op=0x<op>03</op>\n';
app_script2 = app_script2+'	op 		= S(msg).between(\'<op>\', \'</op>\').s;\n';
app_script2 = app_script2+'	//Remontee des channels de communications : ex. Ch=<ch>0</ch>\n';
app_script2 = app_script2+'	ch 		= S(msg).between(\'<ch>\', \'</ch>\').s;\n';
app_script2 = app_script2+'	//Remontee des type de mesure : ex. <uv>Light/UV</uv>\n';
app_script2 = app_script2+'	uv 		= S(msg).between(\'<uv>\', \'</uv>\').s;\n';
app_script2 = app_script2+'	//Remontee des niveaux de mesure : ex. Level=<uvl>2</uvl>\n';
app_script2 = app_script2+'	uvl 	= S(msg).between(\'<uvl>\', \'</uvl>\').s;\n';
app_script2 = app_script2+'	lev 	= S(msg).between(\'<lev>\', \'</lev>\').s;\n';
app_script2 = app_script2+'	//Remontee du bruit de mesure : ex. Noise=<noise>0</noise>\n';
app_script2 = app_script2+'	if (S(msg).include(\'Noise=<noise>\')) {	noise 	= S(msg).between(\'<noise>\', \'</noise>\');}\n';
app_script2 = app_script2+'	else  noise 	= S(msg).between(\'Noise=\', \' \').s;\n';
//app_script2 = app_script2+'	noise 	= S(msg).between(\'<noise>\', \'</noise>\').s;\n';
//app_script2 = app_script2+'	noise 	= S(msg).between(\'Noise=\', \' \').s;\n';
app_script2 = app_script2+'	//Remontee du level : ex. Level=<lev>2.0</lev>/5 ou Level=1.9/5\n';
app_script2 = app_script2+'	if (S(msg).include(\'Level=<lev>\')) {	level 	= S(msg).between(\'<level>\', \'</level>\');}\n';
app_script2 = app_script2+'	else  level 	= S(msg).between(\'Level=\', \' \').s;\n';
//app_script2 = app_script2+'	level 	= S(msg).between(\'Level=\', \' \').s;\n';
app_script2 = app_script2+'	//Remontee du sta (status?) : ex. <sta>ON</sta> ou <sta>OFF</sta>\n';
app_script2 = app_script2+'	sta 	= S(msg).between(\'<sta>\', \'</sta>\').s;\n';
app_script2 = app_script2+'	//Remontee de l\'anemometre : ex. Received radio ID (433Mhz Oregon Noise=2494 Level=1.9/5 WGR800 Avg.Wind=0.9m/s Dir.=180° Batt=Ok)\n';
app_script2 = app_script2+'	//Remontee de l\'anemometre :Received radio ID (<rf>433Mhz Oregon</rf> Noise=<noise>2524</noise> Level=<lev>2.0</lev>/5 <dev>WGR800</dev> Avg.Wind=<awi>1.5</awi>m/s Dir.=<drt>180</drt>Â° Batt=<bat>Ok</bat>): <id>OS445251072</id>\n';
app_script2 = app_script2+'	if (S(msg).include(\'</awi>m/s\')) {	avgwind 	= S(msg).between(\'<awi>\', \'</awi>\');}\n';
app_script2 = app_script2+'	else  avgwind 	= S(msg).between(\'Avg.Wind=\', \' \').s;\n';
app_script2 = app_script2+'	if (S(msg).include(\'Dir.=<drt>\')) {	direction 	= S(msg).between(\'<drt>\', \'</drt>\');}\n';
app_script2 = app_script2+'	else  direction 	= S(msg).between(\'Dir.=\', \' \').s;\n';
app_script2 = app_script2+'	//avgwind 	= S(msg).between(\'Avg.Wind=\', \' \').s;\n';
app_script2 = app_script2+'	//direction 	= S(msg).between(\'Dir.=\', \' \').s;\n';

app_script2 = app_script2+'	//Remontee du pluviometre : Received radio ID (<rf>433Mhz Oregon</rf> Noise=<noise>2472</noise> Level=<lev>5.0</lev>/5 <dev>PCR800</dev> Total Rain=<tra>44</tra>mm Current Rain=<cra>0</cra>mm/hour Batt=<bat>Ok</bat>): <id>OS706331648</id>\n';
//app_script2 = app_script2+'	//Remontee du pluviometre : Received radio ID (<rf>433Mhz Oregon</rf> Noise=<noise>2486</noise> Level=<lev>5.0</lev>/5 <dev>PCR800</dev> Total Rain=<tra>44</tra>mm Current Rain=<cra>0</cra>mm/hour Batt=<bat>Ok</bat>): <id>OS706331648</id>\n';
//app_script2 = app_script2+'	if (S(msg).include(\'</awi>m/s\')) {	totalrain 	= S(msg).between(\'<awi>\', \'</awi>\');}\n';
//app_script2 = app_script2+'	else  totalrain 	= S(msg).between(\'Avg.Wind=\', \' \').s;\n';
//app_script2 = app_script2+'	if (S(msg).include(\'Dir.=<drt>\')) {	currentrain 	= S(msg).between(\'<drt>\', \'</drt>\');}\n';
//app_script2 = app_script2+'	else  currentrain 	= S(msg).between(\'Dir.=\', \' \').s;\n';
app_script2 = app_script2+'	totalrain	= S(msg).between(\'<tra>\', \'</tra>\').s;\n';
app_script2 = app_script2+'	currentrain	= S(msg).between(\'<cra>\', \'</cra>\').s;\n';

app_script2 = app_script2+'\n';
app_script2 = app_script2+'	console.log("--------------------------------------------------------------------------------------")\n';
app_script2 = app_script2+'\n';
app_script2 = app_script2+'	console.log(new Date() + " " + msg.slice(70));\n';
app_script2 = app_script2+'';

app_script2 = app_script2+'	debug_http_request = "yes";	//Variable à initialiser à "no" pour désactiver les reponses des requêtes HTTP\n';
app_script2 = app_script2+'	visionic433 = S(msg).include(\'VISONIC433\');\n';
app_script2 = app_script2+'		visionic433_id = "";\n';
app_script2 = app_script2+'		visionic433_status = "";\n';
app_script2 = app_script2+'	visionic868 = S(msg).include(\'VISONIC868\');\n';
app_script2 = app_script2+'		visionic868_id = "";\n';
app_script2 = app_script2+'		visionic868_status = "";\n';
app_script2 = app_script2+'	chacon = S(msg).include(\'Chacon\');\n';
app_script2 = app_script2+'		chacon_status = "";\n';
app_script2 = app_script2+'	domia = S(msg).include(\'DOMIA\');\n';
app_script2 = app_script2+'		domia_status = "";\n';
app_script2 = app_script2+'	rfx10 = S(msg).include(\'X10\');\n';
app_script2 = app_script2+'		rfx10_status = "";\n';
app_script2 = app_script2+'	zwave = S(msg).include(\'ZWAVE\')||S(msg).include(\'ZWave\');\n';
app_script2 = app_script2+'		zwave_id = "";\n';
app_script2 = app_script2+'		zwave_status = "";\n';
app_script2 = app_script2+'		zwave = S(msg).include(\'ZWAVE\')||S(msg).include(\'ZWave\');\n';
app_script2 = app_script2+'		zwave_id = "";\n';
app_script2 = app_script2+'		zwave_status = "";\n';
app_script2 = app_script2+'	rfs10ts10 = S(msg).include(\'RFS10/TS10\');\n';
app_script2 = app_script2+'		rfs10ts10_status = "";\n';
app_script2 = app_script2+'	xdd433alrm = S(msg).include(\'XDD433 alrm\');\n';
app_script2 = app_script2+'		xdd433alrm_status = "";\n';
app_script2 = app_script2+'	xdd868alrm = S(msg).include(\'XDD868 alrm\');\n';
app_script2 = app_script2+'		xdd868alrm_status = "";\n';
app_script2 = app_script2+'	xdd868intershutter = S(msg).include(\'Inter/shutter RFY433\');\n';
app_script2 = app_script2+'		xdd868intershutter_status = "";\n';
app_script2 = app_script2+'	xdd868pilotwire = S(msg).include(\'XDD868 Radiator/Pilot Wire\');\n';
app_script2 = app_script2+'		xdd868pilotwire_id = "";\n';
app_script2 = app_script2+'		xdd868pilotwire_status = "";\n';
app_script2 = app_script2+'		xdd868pilotwire_cmd = "";\n';
app_script2 = app_script2+'	xdd868boiler = S(msg).include(\'XDD868Boiler\');\n';
app_script2 = app_script2+'		xdd868boiler_status = "";\n';
app_script2 = app_script2+'	owl = S(msg).include(\'433Mhz OWL\');\n';
app_script2 = app_script2+'		owl_id = "";\n';
app_script2 = app_script2+'		owl_status = "";\n';

app_script2 = app_script2+'\n	//Test de demarrage de script :\n';
app_script2 = app_script2+'	if (S(msg).include(\'Zapi linked to host\'))\n';
app_script2 = app_script2+'	{\n';
app_script2 = app_script2+'	    demmarrage = true\n';
app_script2 = app_script2+'		console.log(" Demarrage du script Zidomn.js");';
app_script2 = app_script2+'	    nb_http_request++;\n';
app_script2 = app_script2+'	}\n';

app_script2 = app_script2+'\n	//Test de remontees de PROTOCOLE 1 : composants VISION433 :\n';
app_script2 = app_script2+'\n	//Received radio ID \n';
app_script2 = app_script2+'\n	//Received radio ID \n';
app_script2 = app_script2+'	if (S(msg).include(\'<rf>433Mhz </rf>\') && S(msg).include(\'<id>VS\'))\n';
app_script2 = app_script2+'	{\n';
app_script2 = app_script2+'		visionic433_status = "UNKNOWN";\n';
app_script2 = app_script2+'	    visionic433_id  = "VS"+S(msg).between("<id>VS", \'</id>\').s;\n';
app_script2 = app_script2+'		visionic433 = true;\n';
app_script2 = app_script2+'		if (S(msg).include(\'>Alive</flag\') && !S(msg).include(\'>Alarm</flag\'))\n';
app_script2 = app_script2+'		{\n			 visionic433_status = "Alive";\n		}\n';
app_script2 = app_script2+'		else if (!S(msg).include(\'>Alive</flag\') && S(msg).include(\'>Alarm</flag\'))\n';
app_script2 = app_script2+'		{\n			 visionic433_status = "Alarm";\n		}\n';
app_script2 = app_script2+'		else  visionic433_status = "UNKNOWN";\n';
app_script2 = app_script2+'		console.log("Debug : visionic433    : " + visionic433 + " | Composant/Id " + visionic433_id + " | Statut " + visionic433_status);\n';
app_script2 = app_script2+'	}\n';

app_script2 = app_script2+'\n	//Test de remontees de PROTOCOLE 2 : composants VISION868 :\n';
app_script2 = app_script2+'\n	//Received radio ID (<rf>868Mhz </rf> Noise=<noise>2163</noise> Level=<lev>5.0</lev>/5  <dev>Remote Control</dev>  Flags= <flag3>Alive</flag3>  Batt=<bat>Ok</bat>): <id>VS3549221672</id> \n';
app_script2 = app_script2+'\n	//Received radio ID (<rf>868Mhz </rf> Noise=<noise>2173</noise> Level=<lev>5.0</lev>/5  <dev>Remote Control</dev>  Flags= <flag1>Alarm</flag1>  Batt=<bat>Ok</bat>): <id>VS381936674</id>  \n';
app_script2 = app_script2+'	if (S(msg).include(\'<rf>868Mhz </rf>\') && S(msg).include(\'<id>VS\'))\n';
app_script2 = app_script2+'	{\n';
app_script2 = app_script2+'		visionic868_status = "UNKNOWN";\n';
app_script2 = app_script2+'	    visionic868_id  = "VS"+S(msg).between("<id>VS", \'</id>\').s;\n';
app_script2 = app_script2+'		visionic868 = true;\n';
app_script2 = app_script2+'		if (S(msg).include(\'>Alive</flag\') && !S(msg).include(\'>Alarm</flag\'))\n';
app_script2 = app_script2+'		{\n			 visionic868_status = "Alive";\n		}\n';
app_script2 = app_script2+'		else if (!S(msg).include(\'>Alive</flag\') && S(msg).include(\'>Alarm</flag\'))\n';
app_script2 = app_script2+'		{\n			 visionic868_status = "Alarm";\n		}\n';
app_script2 = app_script2+'		else  visionic868_status = "UNKNOWN";\n';
app_script2 = app_script2+'		console.log("Debug : visionic868    : " + visionic868 + " | Composant/Id " + visionic868_id + " | Statut " + visionic868_status);\n';
app_script2 = app_script2+'	}\n';

app_script2 = app_script2+'\n	//Test de remontees de PROTOCOLE 3 : composants Chacon : 	Sent radio ID (1 Burst(s), Protocols=\'Chacon\' ): A1_OFF\n';
app_script2 = app_script2+'	if (S(msg).include(\'Chacon\'))\n';
app_script2 = app_script2+'	{\n';
app_script2 = app_script2+'	    chacon_id = S(msg).between("Chacon\' ): ", \'_\').s;\n';
app_script2 = app_script2+'		chacon = true;\n';
app_script2 = app_script2+'		if (S(msg).include(\'_ON\'))\n';
app_script2 = app_script2+'		{\n			 chacon_status = "ON";\n		}\n';
app_script2 = app_script2+'		else if (S(msg).include(\'_OFF\'))\n';
app_script2 = app_script2+'		{\n			 chacon_status = "OFF";\n		}\n';
app_script2 = app_script2+'		console.log("Debug : chacon    : " + chacon + " | Composant/Id " + chacon_id + " | Statut " + chacon_status);\n';
app_script2 = app_script2+'	}\n';

app_script2 = app_script2+'\n	//Test de remontees de PROTOCOLE 4 : composants DOMIA : 	Sent radio ID (1 Burst(s), Protocols=\'Domia\' ): M13_ON\n';
app_script2 = app_script2+'	if (S(msg).include(\'DOMIA\'))\n';
app_script2 = app_script2+'	{\n';
app_script2 = app_script2+'	    domia_id  = S(msg).between("Domia\' ): ", \'_\').s;\n';
app_script2 = app_script2+'		domia = true;\n';
app_script2 = app_script2+'		if (S(msg).include(\'_ON\'))\n';
app_script2 = app_script2+'		{\n			 domia_status = "ON";\n		}\n';
app_script2 = app_script2+'		else if (S(msg).include(\'_OFF\'))\n';
app_script2 = app_script2+'		{\n			 domia_status = "OFF";\n		}\n';
app_script2 = app_script2+'		console.log("Debug : domia    : " + domia + " | Composant/Id " + domia_id + " | Statut " + domia_status);\n';
app_script2 = app_script2+'	}\n';

app_script2 = app_script2+'\n	//Test de remontees de PROTOCOLE 5 : composants RF X10\n';
app_script2 = app_script2+'	if (S(msg).include(\'X10\'))\n';
app_script2 = app_script2+'	{\n';
app_script2 = app_script2+'	    rfx10_id  = S(msg).between("X10\' ): ", \'_\').s;\n';
app_script2 = app_script2+'		rfx10 = true;\n';
app_script2 = app_script2+'		if (S(msg).include(\'_ON\'))\n';
app_script2 = app_script2+'		{\n			 rfx10_status = "ON";\n		}\n';
app_script2 = app_script2+'		else if (S(msg).include(\'_OFF\'))\n';
app_script2 = app_script2+'		{\n			 rfx10_status = "OFF";\n		}\n';
app_script2 = app_script2+'		console.log("Debug : rfx10    : " + rfx10 + " | Composant/Id " + rfx10_id + " | Statut " + rfx10_status);\n';
app_script2 = app_script2+'	}\n';

app_script2 = app_script2+'\n	//Test de remontees de PROTOCOLE 6 : composants ZWAVE (ou ZWave)\n';
app_script2 = app_script2+'	if (S(msg).include(\'ZWAVE\')||S(msg).include(\'ZWave\'))\n';
app_script2 = app_script2+'	{\n';
app_script2 = app_script2+'	\tdebug_zwave = debug_zwave + S(msg);\n';
app_script2 = app_script2+'		zwave = true;\n';
app_script2 = app_script2+'		//Test pour identifier le statut du composant ZWAVE'
/*		//Test pour identifier le statut du composant ZWAVE		//Thu Aug 14 2014 23:03:59 GMT+0100 (BST) Sent radio ID (1 Burst(s), Protocols='ZWave n38'  Last RF Transmit Time=20ms): ZC7_ON
		//Thu Aug 14 2014 23:04:47 GMT+0100 (BST) Sent radio ID (1 Burst(s), Protocols='ZWave n38'  Last RF Transmit Time=10ms): ZC7_OFF
		//Thu Aug 14 2014 23:01:07 GMT+0100 (BST) Received radio ID (<rf>ZWAVE ZC5</rf> <dev>Low-Power Measure</dev> Total Energy=<kwh>1.0</kwh>kWh Power=<w>00</w>W Batt=<bat>Ok</bat>): <id>PZC6</id>
		//Thu Aug 14 2014 23:33:06 GMT+0100 (BST) Received radio ID (<rf>ZWAVE ZC6</rf> <dev>WakeUp</dev> Batt=<bat>Ok</bat>): <id>WZC4</id>
		//Tue Oct 21 2014 05:47:06 GMT+0200 (CEST) ZWave message - Coming from Device ZA3 Battery level=80%*/
app_script2 = app_script2+'\n';
app_script2 = app_script2+'		//Tue Oct 21 2014 05:47:06 GMT+0200 (CEST) ZWave message - Coming from Device ZA3 Battery level=80%\n';
app_script2 = app_script2+'		if (\n	            S(msg).include(\'ZWave\') \n';
app_script2 = app_script2+'\t		&&  S(msg).include(\'Battery level\')\n';
app_script2 = app_script2+'\t		&& !S(msg).include(\'ZWAVE\')\n';
app_script2 = app_script2+'\t 		&& !S(msg).include(\'_ON\')\n';
app_script2 = app_script2+'\t		&& !S(msg).include(\'_OFF\')\n';
app_script2 = app_script2+'\t		&& !S(msg).include(\'Power Measure\')\n';
app_script2 = app_script2+'\t		&& !S(msg).include(\'<dev>WakeUp\'))\n';
app_script2 = app_script2+'		{\n';
app_script2 = app_script2+'			zwave_message = true;\n';
app_script2 = app_script2+'			zwave_id= S(msg).between(\'Device \', \' Battery level\').s;\n';
app_script2 = app_script2+'			bat 	= S(msg).between(\'level=\', \'%\').s;\n';
app_script2 = app_script2+'		}\n';
app_script2 = app_script2+'		//Thu Aug 14 2014 23:04:47 GMT+0100 (BST) Sent radio ID (1 Burst(s), Protocols=\'ZWave n38\'  Last RF Transmit Time=10ms): ZC7_ON\n';
app_script2 = app_script2+'		else if (\n			    S(msg).include(\'ZWave\') \n';
app_script2 = app_script2+'\t		&& !S(msg).include(\'Battery level\')\n';
app_script2 = app_script2+'\t		&& !S(msg).include(\'ZWAVE\')\n';
app_script2 = app_script2+'\t 		&&  S(msg).include(\'_ON\')\n';
app_script2 = app_script2+'\t		&& !S(msg).include(\'_OFF\')\n';
app_script2 = app_script2+'\t		&& !S(msg).include(\'Power Measure\')\n';
app_script2 = app_script2+'\t		&& !S(msg).include(\'<dev>WakeUp\'))\n';
app_script2 = app_script2+'		{\n';
app_script2 = app_script2+'			zwave_message = true;\n';
app_script2 = app_script2+'			zwave_id= S(msg).between(\'): \', \'_ON\').s;\n';
app_script2 = app_script2+'			zwave_status = "ON";\n';
app_script2 = app_script2+'			if (!S(msg).include(\'Battery\')) { bat = "Ok"; }\n';
app_script2 = app_script2+'		}\n';
app_script2 = app_script2+'		//Thu Aug 14 2014 23:04:47 GMT+0100 (BST) Sent radio ID (1 Burst(s), Protocols=\'ZWave n38\'  Last RF Transmit Time=10ms): ZC7_OFF\n';
app_script2 = app_script2+'		else if (\n			    S(msg).include(\'ZWave\') \n';
app_script2 = app_script2+'\t		&& !S(msg).include(\'Battery level\')\n';
app_script2 = app_script2+'\t		&& !S(msg).include(\'ZWAVE\')\n';
app_script2 = app_script2+'\t 		&& !S(msg).include(\'_ON\')\n';
app_script2 = app_script2+'\t		&&  S(msg).include(\'_OFF\')\n';
app_script2 = app_script2+'\t		&& !S(msg).include(\'Power Measure\')\n';
app_script2 = app_script2+'\t		&& !S(msg).include(\'<dev>WakeUp\'))\n';
app_script2 = app_script2+'		{\n';
app_script2 = app_script2+'			zwave_message = true;\n';
app_script2 = app_script2+'			zwave_id= S(msg).between(\'): \', \'_OFF\').s;\n';
app_script2 = app_script2+'			zwave_status = "OFF";\n';
app_script2 = app_script2+'			if (!S(msg).include(\'Battery\')) { bat = "Ok"; }\n';
app_script2 = app_script2+'		}\n';
app_script2 = app_script2+'		//Tue Aug 19 2014 19:52:59 GMT+0100  (BST) Received radio ID (<rf>ZWAVE ZC7</rf>  <dev>CMD/INTER</dev>  Batt=<bat>Ok</bat>): <id>ZC7_ON</id>\n';
app_script2 = app_script2+'		//Fri Oct 24 2014 19:40:24 GMT+0200 (CEST) Received radio ID (<rf>ZWAVE ZB3</rf>  <dev>CMD/INTER</dev>  Batt=<bat>Ok</bat>): <id>ZB3</id>\n';
app_script2 = app_script2+'		else if (\n			   !S(msg).include(\'ZWave\') \n';
app_script2 = app_script2+'\t		&& !S(msg).include(\'Battery level\')\n';
app_script2 = app_script2+'\t		&&  S(msg).include(\'ZWAVE\')\n';
app_script2 = app_script2+'\t 		&&( S(msg).include(\'_ON\') || S(msg).include(\'<dev>CMD/INTER</dev>\'))\n';
app_script2 = app_script2+'\t		&& !S(msg).include(\'_OFF\')\n';
app_script2 = app_script2+'\t		&& !S(msg).include(\'Power Measure\')\n';
app_script2 = app_script2+'\t		&& !S(msg).include(\'<dev>WakeUp\'))\n';
app_script2 = app_script2+'		{\n';
app_script2 = app_script2+'			zwave_status = "ON";\n';
app_script2 = app_script2+'			//Test pour identifier le composant ZWAVE impacte\n';
app_script2 = app_script2+'			if ((S(msg).include("ZWave")))\n';
app_script2 = app_script2+'			{ zwave_id = "Z"+S(msg).between(\': Z\', \'_ON\').s; }\n';
app_script2 = app_script2+'			else if ((S(msg).include("ZWAVE")))\n';
app_script2 = app_script2+'			{ zwave_id = "Z"+S(msg).between(\'<rf>ZWAVE Z\',\'</rf>\').s; }\n';
app_script2 = app_script2+'			if (!S(msg).include(\'Battery\')) { bat = "Ok"; }\n';
app_script2 = app_script2+'		}\n';
app_script2 = app_script2+'		//Tue Aug 19 2014 19:52:59 GMT+0100 (BST) Received radio ID (<rf>ZWAVE ZC7</rf>  <dev>CMD/INTER</dev>  Batt=<bat>Ok</bat>): <id>ZC7_OFF</id>\n';
app_script2 = app_script2+'		else if (\n			   !S(msg).include(\'ZWave\') \n';
app_script2 = app_script2+'\t		&& !S(msg).include(\'Battery level\')\n';
app_script2 = app_script2+'\t		&&  S(msg).include(\'ZWAVE\')\n';
app_script2 = app_script2+'\t 		&& !S(msg).include(\'_ON\')\n';
app_script2 = app_script2+'\t		&&  S(msg).include(\'_OFF\')\n';
app_script2 = app_script2+'\t		&& !S(msg).include(\'Power Measure\')\n';
app_script2 = app_script2+'\t		&& !S(msg).include(\'<dev>WakeUp\'))\n';
app_script2 = app_script2+'		{\n';
app_script2 = app_script2+'			zwave_status = "OFF";\n';
app_script2 = app_script2+'			//Test pour identifier le composant ZWAVE impacte\n';
app_script2 = app_script2+'			if ((S(msg).include("ZWave")))\n';
app_script2 = app_script2+'			{ zwave_id = "Z"+S(msg).between(\': Z\', \'_OFF\').s; }\n';
app_script2 = app_script2+'			else if ((S(msg).include("ZWAVE")))\n';
app_script2 = app_script2+'			{ zwave_id = "Z"+S(msg).between(\'<rf>ZWAVE Z\',\'</rf>\').s; }\n';
app_script2 = app_script2+'			if (!S(msg).include(\'Battery\')) { bat = "Ok"; }\n';
app_script2 = app_script2+'		}\n';
app_script2 = app_script2+'		//Thu Aug 14 2014 23:33:06 GMT+0100 (BST) Received radio ID (<rf>ZWAVE ZC6</rf> <dev>WakeUp</dev> Batt=<bat>Ok</bat>): <id>WZC4</id>\n';
app_script2 = app_script2+'		else if (\n			   !S(msg).include(\'ZWave\') \n';
app_script2 = app_script2+'\t		&& !S(msg).include(\'Battery level\')\n';
app_script2 = app_script2+'\t		&&  S(msg).include(\'ZWAVE\')\n';
app_script2 = app_script2+'\t 		&& !S(msg).include(\'_ON\')\n';
app_script2 = app_script2+'\t		&& !S(msg).include(\'_OFF\')\n';
app_script2 = app_script2+'\t		&& !S(msg).include(\'Power Measure\')\n';
app_script2 = app_script2+'\t		&&  S(msg).include(\'<dev>WakeUp\'))\n';
app_script2 = app_script2+'		{\n';
app_script2 = app_script2+'			zwave_status = "WakeUp";\n';
app_script2 = app_script2+'			zwave_id = S(msg).between(\'<rf>ZWAVE \', \'</rf>\').s;\n';
app_script2 = app_script2+'			//zwave_id = id;\n';
app_script2 = app_script2+'		}\n';
app_script2 = app_script2+'		//Sun Oct 26 2014 14:38:39 GMT+0100 (CET) Received radio ID (<rf>ZWAVE ZA8</rf> <dev>Low-Power Measure</dev> Total Energy=<kwh>11.4</kwh>kWh Power=<w>200</w>W Batt=<bat>Ok</bat>): <id>PZA8</id>\n';
app_script2 = app_script2+'		else if (\n			   !S(msg).include(\'ZWave\') \n';
app_script2 = app_script2+'\t		&& !S(msg).include(\'Battery level\')\n';
app_script2 = app_script2+'\t		&&  S(msg).include(\'ZWAVE\')\n';
app_script2 = app_script2+'\t 		&& !S(msg).include(\'_ON\')\n';
app_script2 = app_script2+'\t		&& !S(msg).include(\'_OFF\')\n';
app_script2 = app_script2+'\t		&&  S(msg).include(\'Power Measure\')\n';
app_script2 = app_script2+'\t		&& !S(msg).include(\'<dev>WakeUp\'))\n';
app_script2 = app_script2+'		{\n';
app_script2 = app_script2+'			zwave_status = "UNKNOWN";\n';
app_script2 = app_script2+'			zwave_id = id;\n';
app_script2 = app_script2+'		}\n';
app_script2 = app_script2+'		else if (\n			   !S(msg).include(\'ZWave\') \n';
app_script2 = app_script2+'\t		&& !S(msg).include(\'Battery level\')\n';
app_script2 = app_script2+'\t		&&  S(msg).include(\'ZWAVE\')\n';
app_script2 = app_script2+'\t 		&& !S(msg).include(\'_ON\')\n';
app_script2 = app_script2+'\t		&& !S(msg).include(\'_OFF\')\n';
app_script2 = app_script2+'\t		&& !S(msg).include(\'Power Measure\')\n';
app_script2 = app_script2+'\t		&& !S(msg).include(\'<dev>WakeUp\'))\n';
app_script2 = app_script2+'		{\n';
app_script2 = app_script2+'			zwave_status = "UNKNOWN";\n';
app_script2 = app_script2+'			zwave_id = S(msg).between(\'<id>\', \'</id>\').s;\n';
app_script2 = app_script2+'			if (!S(msg).include(\'Battery\')) { bat = "Ok"; }\n';
app_script2 = app_script2+'		}\n';
app_script2 = app_script2+'		console.log("Debug  : zwave     : " + zwave + " | Composant " + zwave_id + " | Statut : " + zwave_status);\n';
app_script2 = app_script2+'	}\n';

app_script2 = app_script2+'\n	//Test de remontees de PROTOCOLE 7 : composants RFS10/TS10\n';
app_script2 = app_script2+'	if (S(msg).include(\'RFS10/TS10\'))\n';
app_script2 = app_script2+'	{\n';
app_script2 = app_script2+'	    rfs10ts10_id  = S(msg).between("TS10\' ): ", \'_\').s;\n';
app_script2 = app_script2+'		rfs10ts10 = true;\n';
app_script2 = app_script2+'		if (S(msg).include(\'_ON\'))\n';
app_script2 = app_script2+'		{\n			 rfs10ts10_status = "ON";\n		}\n';
app_script2 = app_script2+'		else if (S(msg).include(\'_OFF\'))\n';
app_script2 = app_script2+'		{\n			 rfs10ts10_status = "OFF";\n		}\n';
app_script2 = app_script2+'		console.log("Debug : rfs10ts10    : " + rfs10ts10 + " | Composant/Id " + rfs10ts10_id + " | Statut " + rfs10ts10_status);\n';
app_script2 = app_script2+'	}\n';

app_script2 = app_script2+'\n	//Test de remontees de PROTOCOLE 8 : composants XDD433 alrm\n';
app_script2 = app_script2+'	if (S(msg).include(\'XDD433 alrm\'))\n';
app_script2 = app_script2+'	{\n';
app_script2 = app_script2+'	    xdd433alrm_id = S(msg).between("XDD433 alrm\' ): ", \'_\').s;\n';
app_script2 = app_script2+'		xdd433alrm = true;\n';
app_script2 = app_script2+'		if (S(msg).include(\'_ON\'))\n';
app_script2 = app_script2+'		{\n			 xdd433alrm_status = "ON";\n		}\n';
app_script2 = app_script2+'		else if (S(msg).include(\'_OFF\'))\n';
app_script2 = app_script2+'		{\n			 xdd433alrm_status = "OFF";\n		}\n';
app_script2 = app_script2+'		console.log("Debug : xdd433alrm    : " + xdd433alrm + " | Composant/Id " + xdd433alrm_id + " | Statut " + xdd433alrm_status);\n';
app_script2 = app_script2+'	}\n';

app_script2 = app_script2+'\n	//Test de remontees de PROTOCOLE 9 : composants XDD868 alrm\n';
app_script2 = app_script2+'	if (S(msg).include(\'XDD868 alrm\'))\n';
app_script2 = app_script2+'	{\n';
app_script2 = app_script2+'	    domia_id  = S(msg).between("XDD868 alrm\' ): ", \'_\').s;\n';
app_script2 = app_script2+'		xdd868alrm = true;\n';
app_script2 = app_script2+'		if (S(msg).include(\'_ON\'))\n';
app_script2 = app_script2+'		{\n			 xdd868alrm_status = "ON";\n		}\n';
app_script2 = app_script2+'		else if (S(msg).include(\'_OFF\'))\n';
app_script2 = app_script2+'		{\n			 xdd868alrm_status = "OFF";\n		}\n';
app_script2 = app_script2+'		console.log("Debug : xdd868alrm    : " + xdd868alrm + " | Composant/Id " + id + " | Statut " + xdd868alrm_status);\n';
app_script2 = app_script2+'	}\n';

app_script2 = app_script2+'\n	//Test de remontees de PROTOCOLE 10 : composants XDD868 Inter/Shutter : 		 Sent radio ID (1 Burst(s), Protocols=\'Inter/shutter RFY433\' ): C1_OFF\n';
app_script2 = app_script2+'	if (S(msg).include(\'Inter/shutter RFY433\'))\n';
app_script2 = app_script2+'	{\n';
app_script2 = app_script2+'	    xdd868intershutter_id  = S(msg).between("Inter/shutter RFY433\' ): ", \'_\').s;\n';
app_script2 = app_script2+'		xdd868intershutter = true;\n';
app_script2 = app_script2+'		xdd868intershutter_id 	= S(msg).between("Protocols=\'Inter/shutter RFY433\' ): ", " ").s;\n';
app_script2 = app_script2+'		xdd868intershutter_power_ON 	= S(msg).include(\'_ON\');\n';
app_script2 = app_script2+'		xdd868intershutter_power_OFF 	= S(msg).include(\'_OFF\');\n';
app_script2 = app_script2+'		xdd868intershutter_DIM_SPECIAL 	= S(msg).include(\'DIM/SPECIAL\');\n';
app_script2 = app_script2+'		if (S(msg).include(\'_ON\')) { xdd868intershutter_status = "ON"; }\n';
app_script2 = app_script2+'		else if (S(msg).include(\'_OFF)\')) { xdd868intershutter_status = "OFF"; }\n';
app_script2 = app_script2+'		console.log("Debug : xdd868intershutter    : " + xdd868intershutter + " | Composant/Id " + xdd868intershutter_id + " | Statut " + xdd868intershutter_status);\n';
app_script2 = app_script2+'	}\n';

app_script2 = app_script2+'	//Test de remontees de PROTOCOLE 11 : composants XDD868PilotWire: Sent radio ID (1 Burst(s), Protocols=\'XDD868 Radiator/Pilot Wire :OutOfFrost\' ): B1 DIM/SPECIAL\n';
app_script2 = app_script2+'	//Sent radio ID (1 Burst(s), Protocols=\'XDD868 Radiator/Pilot Wire :Auto\' ): B1_ON\n';
app_script2 = app_script2+'	if (S(msg).include(\'XDD868 Radiator/Pilot Wire\'))\n';
app_script2 = app_script2+'	{\n';
app_script2 = app_script2+'	    xdd868pilotwire_id  = "UNKNOWN";\n';
app_script2 = app_script2+'		xdd868pilotwire = true;\n';
app_script2 = app_script2+'		xdd868pilotwire_cmd = S(msg).between("Radiator/Pilot Wire :", "\'").s;\n';
app_script2 = app_script2+'		if (S(msg).include(\'_ON\') && !S(msg).include(\'_OFF\') && !S(msg).include(\'DIM/SPECIAL\'))\n';
app_script2 = app_script2+'		{\n';
app_script2 = app_script2+'			xdd868pilotwire_status = "ON";\n';
app_script2 = app_script2+'			xdd868pilotwire_id  = S(msg).between("\' ): ", \'_\').s;\n';
app_script2 = app_script2+'		}\n';
app_script2 = app_script2+'		else if (!S(msg).include(\'_ON\') && S(msg).include(\'_OFF\') && !S(msg).include(\'DIM/SPECIAL\'))\n';
app_script2 = app_script2+'		{\n';
app_script2 = app_script2+'			xdd868pilotwire_status = "OFF";\n';
app_script2 = app_script2+'			xdd868pilotwire_id  = S(msg).between("\' ): ", \'_\').s;\n';
app_script2 = app_script2+'		}\n';
app_script2 = app_script2+'		else if (!S(msg).include(\'_ON\') && !S(msg).include(\'_OFF\') && S(msg).include(\'DIM/SPECIAL\'))\n';
app_script2 = app_script2+'		{\n';
app_script2 = app_script2+'			xdd868pilotwire_status = "DIM/SPECIAL";\n';
app_script2 = app_script2+'			xdd868pilotwire_id  = S(msg).between(" ): ", \' DIM/SPECIAL\').s;\n';
app_script2 = app_script2+'		}\n';
app_script2 = app_script2+'		else xdd868pilotwire_status = "UNKNOWN";\n';
app_script2 = app_script2+'		console.log("Debug : xdd868pilotwire    : " + xdd868pilotwire + " | Composant/Id " + xdd868pilotwire_id + " | Statut " + xdd868pilotwire_status+ " | Commande " +xdd868pilotwire_cmd);\n';
app_script2 = app_script2+'	}\n';

app_script2 = app_script2+'	//Test de remontees de PROTOCOLE 12 : composants XDD868Boiler\n';
app_script2 = app_script2+'	if (S(msg).include(\'XDD868Boiler\'))\n';
app_script2 = app_script2+'	{\n';
app_script2 = app_script2+'	    xdd868boiler_id  = S(msg).between("XDD868Boiler\' ): ", \'_\').s;\n';
app_script2 = app_script2+'		xdd868boiler = true;\n';
app_script2 = app_script2+'		if (S(msg).include(\'_ON\'))\n';
app_script2 = app_script2+'		{\n';
app_script2 = app_script2+'			xdd868boiler_status = "ON";\n';
app_script2 = app_script2+'		}\n';
app_script2 = app_script2+'		else if (S(msg).include(\'_OFF\'))\n';
app_script2 = app_script2+'		{\n';
app_script2 = app_script2+'			xdd868boiler_status = "OFF";\n';
app_script2 = app_script2+'		}\n';;
app_script2 = app_script2+'		else if (S(msg).include(\'_DIM/SPECIAL\'))\n';
app_script2 = app_script2+'		{\n';
app_script2 = app_script2+'			xdd868boiler_status = "DIM/SPECIAL";\n';
app_script2 = app_script2+'		}\n';
app_script2 = app_script2+'		console.log("Debug : xdd868boiler    : " + xdd868boiler + " | Composant/Id " + xdd868boiler_id + " | Statut " + xdd868boiler_status);\n';
app_script2 = app_script2+'	}\n';

app_script2 = app_script2+'	//Test de remontees de 433Mhz OWL\n';
app_script2 = app_script2+'	//Received radio ID (<rf>433Mhz OWL</rf> Noise=<noise>2107</noise> Level=<lev>3.5</lev>/5 <dev>High-Power Measure</dev> Ch=<ch>2</ch> Total Energy=<kwh>4504.0</kwh>kWh Power=<w>1000</w>W Batt=<bat>Ok</bat>): <id>WS132632</id>\n';
app_script2 = app_script2+'	if (S(msg).include(\'433Mhz OWL\'))\n';
app_script2 = app_script2+'	{\n';
app_script2 = app_script2+'	    owl_id  = id;\n';
app_script2 = app_script2+'		owl = true;\n';
app_script2 = app_script2+'		if (S(msg).include(\'_ON\'))\n';
app_script2 = app_script2+'		{\n			 owl_status = "ON";\n		}\n';
app_script2 = app_script2+'		else if (S(msg).include(\'_OFF\'))\n';
app_script2 = app_script2+'		{\n			 owl_status = "OFF";\n		}\n';
app_script2 = app_script2+'		else if (S(msg).include(\'_DIM/SPECIAL\'))\n';
app_script2 = app_script2+'		{\n			 owl_status = "DIM/SPECIAL";\n		}\n';
app_script2 = app_script2+'		console.log("Debug : 433Mhz OWL    : " + owl + " | Composant/Id " + owl_id+ " | Statut " + owl_status);\n';
app_script2 = app_script2+'	}\n';

app_script2 = app_script2+'	// Test de remontees de composants Oregon	Received radio ID (<rf>433Mhz Oregon</rf> Noise=<noise>2453</noise> Level=<lev>5.0</lev>/5 <dev>THWR288A-THN132N</dev> Ch=<ch>2</ch> T=<tem>+23.3</tem>C (+73.9F)  Batt=<bat>Ok</bat>): <id>OS3930896642</id>  Batt=<bat>Ok</bat>): <id>OS4294967047</id>\n';
app_script2 = app_script2+'	//oregon = S(msg).include(\'Oregon\');\n';
app_script2 = app_script2+'	if (S(msg).include(\'Oregon\'))\n';
app_script2 = app_script2+'	{\n';
app_script2 = app_script2+'		oregon = true;\n';
app_script2 = app_script2+'		console.log("Debug : oregon    : " + oregon + " | Composant/Id " + id);\n';
app_script2 = app_script2+'	}\n';

var b = new Buffer(70);
b.fill(0);
b.write('ZSIG\0', 0/*offset*/);
b.writeUInt16BE(13,4); //command HOST REGISTERING (13)
b.writeUInt32BE(dot2num(clientIp), 50);
b.writeUInt32BE(0x42CC, 54); // port 17100 0x42CC

console.log(b);
console.log(b.toString('hex', 0, b.length));

//Parsing list of devices
var parseString = require('xml2js').parseString;
//npm install --save xml2js

//http://www.zodianet.com/pub/ZAPI2_V1.2.pdf

xmlurl = zibase_url;

request(xmlurl, function(err, resp, body)
{
	console.log(" URL de peripheriques Zibase : "+xmlurl);

	console.log("// *************************************************************************** ")
	console.log("// *****************   Script de configuration automatique   ***************** ")
	console.log("// *****************   Zeldoi5                               ***************** ")
	console.log("// *****************   merci de remplir les variables :      ***************** ")
	console.log("// *****************   - zibase_device                       ***************** ")
	console.log("// *****************   - zibase_token                        ***************** ")
	console.log("// *****************   - zibase_device                       ***************** ")
	console.log("// *****************   - jeedom_ip                           ***************** ")
	console.log("// *****************   - jeedom_api                          ***************** ")
	console.log("// *************************************************************************** ")

	//Initialisation des variables extraites de l'xml
	var name_eqp = "";
	var id_eqp= "";
	var id1_eqp= "";
	var id2_eqp= "";
	var id3_eqp= "";
	var id4_eqp= "";
	var type_eqp = "";
	var proto_i = "";
	var proto = "";

	//Initialisation des variables de scripts par proto
	var app_visionic433 = "	if (visionic433)\n	{						//	 Equipements de Type VISIONIC433\n";
	var app_visionic868 = "	else if (visionic868)\n	{					//	 Equipements de Type VISIONIC868\n";
	var app_chacon = "	else if (chacon)\n	{							//	 Equipements de Type CHACON\n";
	var app_domia = "	else if (domia)\n	{							//	 Equipements de Type DOMIA\n";
	var app_rfx10 = "	else if (rfx10)\n	{							//	 Equipements de Type RF X10\n";
	var app_zwave = "	else if (zwave)\n	{							//	 Equipements de Type ZWAVE\n";
	var app_rfs10ts10 = "	else if (rfs10ts10)\n	{					//	 Equipements de Type RFS10 TS10\n";
	var app_xdd433alrm = "	else if (xdd433alrm)\n	{					//	 Equipements de Type XDD433 alrm\n";
	var app_xdd868alrm = "	else if (xdd868alrm)\n	{					//	 Equipements de Type XDD868 alrm\n";
	var app_xdd868intershutter = "	else if (xdd868intershutter)\n	{	//	 Equipements de Type XDD868Inter/Shutter\n";
	var app_xdd868pilotwire = "	else if (xdd868pilotwire)\n	{			//	 Equipements de Type XDD868PilotWire\n";
	var app_xdd868boiler = "	else if (xdd868boiler)\n	{			//	 Equipements de Type XDD868Boiler\n";
	//var app_undefined = "	else if (S(msg).include('Received radio ID'))\n	{//	 Equipements sans protocole scpecifique\n";
	var app_undefined = "	\n	{//	 Equipements sans protocole scpecifique\n";
	
	var id_scenario = "0";
	var name_scenario = "";
	
	var count = 0;
	parseString(body, function(err, result)
	{
		result.r.e.forEach (function(i)
		{
			count++;
			id_eqp= "";
			id1_eqp= "";
			id2_eqp= "";
			id3_eqp= "";
			id4_eqp= "";
			type_eqp = "";
			id_scenario = "0";
			name_scenario = "";
			proto_i = "";
			proto = "";
			
			bool_periph_added = 0; 	//Booleen : si 0 --> periph non ajoute
										//			si 1 --> periph ajoute
			
			//Extraction des equipements
			name_eqp = i.n;
			id_eqp= i['$'].c;
			id1_eqp= i['$'].c1;
			id2_eqp= i['$'].c2;
			//id3_eqp= i['$'].c3;
			//id4_eqp= i['$'].c4;
			type_eqp = i['$'].t;
			//if ( id_eqp== "")
			proto_i = i['$'].p;

			console.log(" ----------------------------------------------------------------------------------------------------- ");
			//console.log(" type_eqp : "+type_eqp);
			//console.log(" --> S(id_eqp).startsWith('Z')="+ S(id_eqp).startsWith('Z'));
			
			//Test des peripheriques remontes en protocole ZWAVE mais n'ayant pas de Z dans l'ID
			if (proto_i == 6 && !S(id_eqp).startsWith('Z'))
			{	id_eqp = "Z" + id_eqp;	}
			
			//Test des peripheriques dont l'ID commence par un Z mais dont le protocole n'est pas defini en Zwave 
			if (!proto_i)
			{
				proto = "undefined";
				//if (S(id_eqp).include("Z"))
				if (S(id_eqp).startsWith('Z')||S(id_eqp).startsWith('PZ'))
				{	proto ="ZWAVE";	}
				if (type_eqp == "temperature" && type_eqp != "power" && (!S(id_eqp).startsWith('Z')||S(id_eqp).startsWith('PZ'))) { proto = "oregon"; }
				else if (type_eqp != "temperature" && type_eqp == "power" && !S(id_eqp).startsWith('PZ')) { proto = "owl"; }
			}
			else
			{
				if (proto_i == 1 ) { proto ="VISONIC433";}
				else if (type_eqp != "temperature" && type_eqp != "power" && proto_i == 2 ) { proto ="VISONIC868";}
				else if (type_eqp != "temperature" && type_eqp != "power" && proto_i == 3 ) { proto ="CHACON";}
				else if (type_eqp != "temperature" && type_eqp != "power" && proto_i == 4 ) { proto ="DOMIA";}
				else if (type_eqp != "temperature" && type_eqp != "power" && proto_i == 5 ) { proto ="RF X10";}
				else if (type_eqp != "temperature" && type_eqp != "power" && proto_i == 6 ) { proto ="ZWAVE";}
				else if (type_eqp != "temperature" && type_eqp != "power" && proto_i == 7 ) { proto ="RFS10/TS10";}
				else if (type_eqp != "temperature" && type_eqp != "power" && proto_i == 8 ) { proto ="XDD433";}
				else if (type_eqp != "temperature" && type_eqp != "power" && proto_i == 9 ) { proto ="XDD868";}
				else if (type_eqp != "temperature" && type_eqp != "power" && proto_i == 10 ) { proto ="XDD868Inter/Shutter";}
				else if (type_eqp != "temperature" && type_eqp != "power" && proto_i == 11 ) { proto ="XDD868PilotWire";}
				else if (type_eqp != "temperature" && type_eqp != "power" && proto_i == 12 ) { proto ="XDD868Boiler";}
				//else if (type_eqp == "temperature" && type_eqp != "power") { proto = "oregon"; }
				//else if (type_eqp != "temperature" && type_eqp == "power") { proto = "owl";console.log("\n\n POWERRRRRR !!! \n\n"); }
				else proto = "undefined";
				//console.log(" --> Protocole defini : "+proto)
			}
		
			//Parsing des commandes Zibase pour extraction des differents ID
			if ( S(type_eqp).contains("COMMANDE"))
			{
				id_def = id1_eqp +"/"+id2_eqp;
				console.log("Lignes : " + count + ", nom : " + name_eqp + ", Protocole " + proto +  ", id : " + id1_eqp+ " / " + id2_eqp+ ", type_eqp : " + type_eqp);
			}
			else
			{
				id_def = id_eqp;
				console.log("Lignes : " + count + ", nom : " + name_eqp + ", Protocole " + proto +  ", id : " + id_eqp+ ", type_eqp : " + type_eqp);
			}
			
			// Traitement des peripheriques SANS et AVEC ID de defini en Zibase
			//Peripheriques definis SANS Id : non traites
			if (!id_def)
			{
				console.log(" Equipement declare dans la Zibase mais sans Id : non ajoute dans Zidom/Jeedom");
			}
			//Peripheriques definis AVEC Id : traites
			else
			{
				/*app_visionic433
				app_visionic868+'	}\n';
				app_chacon+'	}\n';
				app_domia+'	}\n';
				app_rfx10+'	}\n';
				app_zwave+'	}\n';
				app_rfs10ts10+'	}\n';
				app_xdd433alrm+'	}\n';
				app_xdd868alrm+'	}\n';
				app_xdd868intershutter+'	}\n';
				app_xdd868pilotwire+'	}\n';
				app_xdd868boiler+'	}\n';
				*/
				if (proto =="VISONIC433")
				{
					//A implementer
					console.log(" Equipement de protocole "+proto+" | Tests non realises en l absence de ce type d equipement. Les developpements ci dessous sont hypothetiques\n");
					app_visionic433 = app_visionic433+'\n	//Aucun equipement VISIONIC433 n est en ma possession pour tester et remonter les infos\n';

					//Received radio ID
					//Received radio ID 
					console.log(" Equipement de protocole "+proto+".");
					console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id : "+ id_eqp);
					console.log("  Ajout dans le script Zidom du test de remontee sur cet equipement");
					
					periph_jeedom = S(name_eqp).replaceAll(' ', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('/', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('\\', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('-', '').s;
					periph_jeedom = S(periph_jeedom).replaceAll('.', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('?', '').s;
					jid = "j_"+periph_jeedom;
						jidbatterie = "j_"+periph_jeedom+"_batterie";
						jidradio = "j_"+periph_jeedom+"_radio";
					jid_descr = jid_descr+'var '+jid+' = require(\'string\');\n';
						jid_descr = jid_descr+'var '+jidbatterie+' = require(\'string\');\n';
						jid_descr = jid_descr+'var '+jidradio+' = require(\'string\');\n';
					jid_file = jid_file+'\t'+jid+' = 42;\t//'+periph_jeedom+';\n';
						jid_file = jid_file+'\t\t'+jidbatterie+' = 84;\t//'+periph_jeedom+';\n';
						jid_file = jid_file+'\t\t\t'+jidradio+' = 88;\t//'+periph_jeedom+';\n';
					periph_file = periph_file+type_eqp+'\t'+periph_jeedom+'\t'+id_eqp+'\tid_'+'\n';
					
					app_visionic433 = app_visionic433+'\n		if (visionic433_id=="'+id_eqp+'" && visionic433_status=="Alive")\n'
					app_visionic433 = app_visionic433+'		{\n';
					app_visionic433 = app_visionic433+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+' et de statut Alive et de type '+type_eqp+'\");\n';
					app_visionic433 = app_visionic433+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=1\";\n';
					app_visionic433 = app_visionic433+'			console.log(\"  Envoi de la requete HTTP Alive-Visionic868 de l\'equipement \");\n';
					app_visionic433 = app_visionic433+'			console.log(\"  Requete :\" + http_request);\n';
					app_visionic433 = app_visionic433+'			request(http_request, function(error, response, body)\n';
					app_visionic433 = app_visionic433+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_visionic433 = app_visionic433+'			nb_http_request = nb_http_request + 1;\n';

					app_visionic433 = app_visionic433+'			console.log(\"  Envoi de la requete HTTP BatterieVisionic868: \" + bat);\n';
					app_visionic433 = app_visionic433+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=\"+bat;\n';
					app_visionic433 = app_visionic433+'			console.log(\"  Requete :\" + http_request);\n';
					app_visionic433 = app_visionic433+'			request(http_request, function(error, response, body)\n';
					app_visionic433 = app_visionic433+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_visionic433 = app_visionic433+'			nb_http_request = nb_http_request + 1;\n';

					app_visionic433 = app_visionic433+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidradio+'+\"&value=\"+lev;\n';
					app_visionic433 = app_visionic433+'			console.log(\"  Envoi de la requete HTTP Niveau de reception radio de Visionic868: \"+lev);\n';
					app_visionic433 = app_visionic433+'			console.log(\"  Requete :\" + http_request);\n';
					app_visionic433 = app_visionic433+'			request(http_request, function(error, response, body)\n';
					app_visionic433 = app_visionic433+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_visionic433 = app_visionic433+'			nb_http_request = nb_http_request + 1;\n';
					app_visionic433 = app_visionic433+'		}\n';

					app_visionic433 = app_visionic433+'		if (visionic433_id=="'+id_eqp+'" && visionic433_status=="Alarm")\n'
					app_visionic433 = app_visionic433+'		{\n';
					app_visionic433 = app_visionic433+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+' et de statut Alarm et de type '+type_eqp+'\");\n';
					app_visionic433 = app_visionic433+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=10\";\n';
					app_visionic433 = app_visionic433+'			console.log(\"  Envoi de la requete HTTP Alarm-Visionic868 de l\'equipement \");\n';
					app_visionic433 = app_visionic433+'			console.log(\"  Requete :\" + http_request);\n';
					app_visionic433 = app_visionic433+'			request(http_request, function(error, response, body)\n';
					app_visionic433 = app_visionic433+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_visionic433 = app_visionic433+'			nb_http_request = nb_http_request + 1;\n';

					app_visionic433 = app_visionic433+'			console.log(\"  Envoi de la requete HTTP Batterie Visionic868: \" + bat);\n';
					app_visionic433 = app_visionic433+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=\"+bat;\n';
					app_visionic433 = app_visionic433+'			console.log(\"  Requete :\" + http_request);\n';
					app_visionic433 = app_visionic433+'			request(http_request, function(error, response, body)\n';
					app_visionic433 = app_visionic433+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_visionic433 = app_visionic433+'			nb_http_request = nb_http_request + 1;\n';

					app_visionic433 = app_visionic433+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidradio+'+\"&value=\"+lev;\n';
					app_visionic433 = app_visionic433+'			console.log(\"  Envoi de la requete HTTP Niveau de reception radio de Visionic868: \"+lev);\n';
					app_visionic433 = app_visionic433+'			console.log(\"  Requete :\" + http_request);\n';
					app_visionic433 = app_visionic433+'			request(http_request, function(error, response, body)\n';
					app_visionic433 = app_visionic433+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_visionic433 = app_visionic433+'			nb_http_request = nb_http_request + 1;\n';
					app_visionic433 = app_visionic433+'		}\n';

					app_visionic433 = app_visionic433+'		if (visionic433_id=="'+id_eqp+'" && visionic433_status=="UNKNOWN")\n'
					app_visionic433 = app_visionic433+'		{\n';
					app_visionic433 = app_visionic433+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+' et de statut UNKNOWN et de type '+type_eqp+'\");\n';
					app_visionic433 = app_visionic433+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=0\";\n';
					app_visionic433 = app_visionic433+'			console.log(\"  Envoi de la requete HTTP Alarm-Visionic868 de l\'equipement \");\n';
					app_visionic433 = app_visionic433+'			console.log(\"  Requete :\" + http_request);\n';
					app_visionic433 = app_visionic433+'			request(http_request, function(error, response, body)\n';
					app_visionic433 = app_visionic433+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_visionic433 = app_visionic433+'			nb_http_request = nb_http_request + 1;\n';

					app_visionic433 = app_visionic433+'			console.log(\"  Envoi de la requete HTTP Batterie Visionic868: \" + bat);\n';
					app_visionic433 = app_visionic433+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=\"+bat;\n';
					app_visionic433 = app_visionic433+'			console.log(\"  Requete :\" + http_request);\n';
					app_visionic433 = app_visionic433+'			request(http_request, function(error, response, body)\n';
					app_visionic433 = app_visionic433+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_visionic433 = app_visionic433+'			nb_http_request = nb_http_request + 1;\n';

					app_visionic433 = app_visionic433+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidradio+'+\"&value=\"+lev;\n';
					app_visionic433 = app_visionic433+'			console.log(\"  Envoi de la requete HTTP Niveau de reception radio de Visionic868: \"+lev);\n';
					app_visionic433 = app_visionic433+'			console.log(\"  Requete :\" + http_request);\n';
					app_visionic433 = app_visionic433+'			request(http_request, function(error, response, body)\n';
					app_visionic433 = app_visionic433+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_visionic433 = app_visionic433+'			nb_http_request = nb_http_request + 1;\n';
					app_visionic433 = app_visionic433+'		}\n';

					count_periph++;
					bool_periph_added = 1;
				}
				if (proto =="VISONIC868")
				{
					//Received radio ID (<rf>868Mhz </rf> Noise=<noise>2163</noise> Level=<lev>5.0</lev>/5  <dev>Remote Control</dev>  Flags= <flag3>Alive</flag3>  Batt=<bat>Ok</bat>): <id>VS3549221672</id> 
					//Received radio ID (<rf>868Mhz </rf> Noise=<noise>2173</noise> Level=<lev>5.0</lev>/5  <dev>Remote Control</dev>  Flags= <flag1>Alarm</flag1>  Batt=<bat>Ok</bat>): <id>VS381936674</id> 
					console.log(" Equipement de protocole "+proto+".");
					console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id : "+ id_eqp);
					console.log("  Ajout dans le script Zidom du test de remontee sur cet equipement");
					
					periph_jeedom = S(name_eqp).replaceAll(' ', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('/', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('\\', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('-', '').s;
					periph_jeedom = S(periph_jeedom).replaceAll('.', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('?', '').s;
					jid = "j_"+periph_jeedom;
						jidbatterie = "j_"+periph_jeedom+"_batterie";
						jidradio = "j_"+periph_jeedom+"_radio";
					jid_descr = jid_descr+'var '+jid+' = require(\'string\');\n';
						jid_descr = jid_descr+'var '+jidbatterie+' = require(\'string\');\n';
						jid_descr = jid_descr+'var '+jidradio+' = require(\'string\');\n';
					jid_file = jid_file+'\t'+jid+' = 42;\t//'+periph_jeedom+';\n';
						jid_file = jid_file+'\t\t'+jidbatterie+' = 84;\t//'+periph_jeedom+';\n';
						jid_file = jid_file+'\t\t\t'+jidradio+' = 88;\t//'+periph_jeedom+';\n';
					periph_file = periph_file+type_eqp+'\t'+periph_jeedom+'\t'+id_eqp+'\tid_'+'\n';
					
					app_visionic868 = app_visionic868+'\n		if (visionic868_id=="'+id_eqp+'" && visionic868_status=="Alive")\n'
					app_visionic868 = app_visionic868+'		{\n';
					app_visionic868 = app_visionic868+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+' et de statut Alive et de type '+type_eqp+'\");\n';
					app_visionic868 = app_visionic868+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=1\";\n';
					app_visionic868 = app_visionic868+'			console.log(\"  Envoi de la requete HTTP Alive-Visionic868 de l\'equipement \");\n';
					app_visionic868 = app_visionic868+'			console.log(\"  Requete :\" + http_request);\n';
					app_visionic868 = app_visionic868+'			request(http_request, function(error, response, body)\n';
					app_visionic868 = app_visionic868+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_visionic868 = app_visionic868+'			nb_http_request = nb_http_request + 1;\n';

					app_visionic868 = app_visionic868+'			console.log(\"  Envoi de la requete HTTP BatterieVisionic868: \" + bat);\n';
					app_visionic868 = app_visionic868+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=\"+bat;\n';
					app_visionic868 = app_visionic868+'			console.log(\"  Requete :\" + http_request);\n';
					app_visionic868 = app_visionic868+'			request(http_request, function(error, response, body)\n';
					app_visionic868 = app_visionic868+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_visionic868 = app_visionic868+'			nb_http_request = nb_http_request + 1;\n';

					app_visionic868 = app_visionic868+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidradio+'+\"&value=\"+lev;\n';
					app_visionic868 = app_visionic868+'			console.log(\"  Envoi de la requete HTTP Niveau de reception radio de Visionic868: \"+lev);\n';
					app_visionic868 = app_visionic868+'			console.log(\"  Requete :\" + http_request);\n';
					app_visionic868 = app_visionic868+'			request(http_request, function(error, response, body)\n';
					app_visionic868 = app_visionic868+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_visionic868 = app_visionic868+'			nb_http_request = nb_http_request + 1;\n';
					app_visionic868 = app_visionic868+'		}\n';

					app_visionic868 = app_visionic868+'		if (visionic868_id=="'+id_eqp+'" && visionic868_status=="Alarm")\n'
					app_visionic868 = app_visionic868+'		{\n';
					app_visionic868 = app_visionic868+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+' et de statut Alarm et de type '+type_eqp+'\");\n';
					app_visionic868 = app_visionic868+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=10\";\n';
					app_visionic868 = app_visionic868+'			console.log(\"  Envoi de la requete HTTP Alarm-Visionic868 de l\'equipement \");\n';
					app_visionic868 = app_visionic868+'			console.log(\"  Requete :\" + http_request);\n';
					app_visionic868 = app_visionic868+'			request(http_request, function(error, response, body)\n';
					app_visionic868 = app_visionic868+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_visionic868 = app_visionic868+'			nb_http_request = nb_http_request + 1;\n';

					app_visionic868 = app_visionic868+'			console.log(\"  Envoi de la requete HTTP Batterie Visionic868: \" + bat);\n';
					app_visionic868 = app_visionic868+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=\"+bat;\n';
					app_visionic868 = app_visionic868+'			console.log(\"  Requete :\" + http_request);\n';
					app_visionic868 = app_visionic868+'			request(http_request, function(error, response, body)\n';
					app_visionic868 = app_visionic868+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_visionic868 = app_visionic868+'			nb_http_request = nb_http_request + 1;\n';

					app_visionic868 = app_visionic868+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidradio+'+\"&value=\"+lev;\n';
					app_visionic868 = app_visionic868+'			console.log(\"  Envoi de la requete HTTP Niveau de reception radio de Visionic868: \"+lev);\n';
					app_visionic868 = app_visionic868+'			console.log(\"  Requete :\" + http_request);\n';
					app_visionic868 = app_visionic868+'			request(http_request, function(error, response, body)\n';
					app_visionic868 = app_visionic868+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_visionic868 = app_visionic868+'			nb_http_request = nb_http_request + 1;\n';
					app_visionic868 = app_visionic868+'		}\n';

					app_visionic868 = app_visionic868+'		if (visionic868_id=="'+id_eqp+'" && visionic868_status=="UNKNOWN")\n'
					app_visionic868 = app_visionic868+'		{\n';
					app_visionic868 = app_visionic868+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+' et de statut UNKNOWN et de type '+type_eqp+'\");\n';
					app_visionic868 = app_visionic868+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=0\";\n';
					app_visionic868 = app_visionic868+'			console.log(\"  Envoi de la requete HTTP Alarm-Visionic868 de l\'equipement \");\n';
					app_visionic868 = app_visionic868+'			console.log(\"  Requete :\" + http_request);\n';
					app_visionic868 = app_visionic868+'			request(http_request, function(error, response, body)\n';
					app_visionic868 = app_visionic868+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_visionic868 = app_visionic868+'			nb_http_request = nb_http_request + 1;\n';

					app_visionic868 = app_visionic868+'			console.log(\"  Envoi de la requete HTTP Batterie Visionic868: \" + bat);\n';
					app_visionic868 = app_visionic868+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=\"+bat;\n';
					app_visionic868 = app_visionic868+'			console.log(\"  Requete :\" + http_request);\n';
					app_visionic868 = app_visionic868+'			request(http_request, function(error, response, body)\n';
					app_visionic868 = app_visionic868+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_visionic868 = app_visionic868+'			nb_http_request = nb_http_request + 1;\n';

					app_visionic868 = app_visionic868+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidradio+'+\"&value=\"+lev;\n';
					app_visionic868 = app_visionic868+'			console.log(\"  Envoi de la requete HTTP Niveau de reception radio de Visionic868: \"+lev);\n';
					app_visionic868 = app_visionic868+'			console.log(\"  Requete :\" + http_request);\n';
					app_visionic868 = app_visionic868+'			request(http_request, function(error, response, body)\n';
					app_visionic868 = app_visionic868+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_visionic868 = app_visionic868+'			nb_http_request = nb_http_request + 1;\n';
					app_visionic868 = app_visionic868+'		}\n';
					
					count_periph++;
					bool_periph_added = 1;
				}
				if (proto =="CHACON")
				{
					console.log(" Equipement de protocole "+proto+".");
					console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id : "+ id_eqp);
					console.log("  Ajout dans le script Zidom du test de remontee sur cet equipement");
					
					periph_jeedom = S(name_eqp).replaceAll(' ', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('/', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('\\', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('-', '').s;
					periph_jeedom = S(periph_jeedom).replaceAll('.', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('?', '').s;
					jid = "j_"+periph_jeedom;
						jidbatterie = "j_"+periph_jeedom+"_batterie";
						//jidradio = "j_"+periph_jeedom+"_radio";
					jid_descr = jid_descr+'var '+jid+' = require(\'string\');\n';
						jid_descr = jid_descr+'var '+jidbatterie+' = require(\'string\');\n';
						//jid_descr = jid_descr+'var '+jidradio+' = require(\'string\');\n';
					jid_file = jid_file+'\t'+jid+' = 42;\t//'+periph_jeedom+';\n';
						jid_file = jid_file+'\t\t'+jidbatterie+' = 84;\t//'+periph_jeedom+';\n';
						//jid_file = jid_file+'\t\t\t'+jidradio+' = 88;\t//'+periph_jeedom+';\n';
					periph_file = periph_file+type_eqp+'\t'+periph_jeedom+'\t'+id_eqp+'\tid_'+'\n';
					
					app_chacon = app_chacon+'\n		if (chacon_id=="'+id_eqp+'" && chacon_status=="ON")\n'
					app_chacon = app_chacon+'		{\n';
					app_chacon = app_chacon+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+' et de statut ON et de type '+type_eqp+'\");\n';
					app_chacon = app_chacon+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=1\";\n';
					app_chacon = app_chacon+'			console.log(\"  Envoi de la requete HTTP Activation de l\'equipement \");\n';
					app_chacon = app_chacon+'			console.log(\"  Requete :\" + http_request);\n';
					app_chacon = app_chacon+'			request(http_request, function(error, response, body)\n';
					app_chacon = app_chacon+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_chacon = app_chacon+'			nb_http_request = nb_http_request + 1;\n';

					app_chacon = app_chacon+'			if (S(msg).include("Batt"))\n';
					app_chacon = app_chacon+'			{\n';
					app_chacon = app_chacon+'\t			console.log(\"  Envoi de la requete HTTP Batterie: \" + bat);\n';
					app_chacon = app_chacon+'\t			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=\"+bat;\n';
					app_chacon = app_chacon+'\t			console.log(\"  Requete :\" + http_request);\n';
					app_chacon = app_chacon+'\t			request(http_request, function(error, response, body)\n';
					app_chacon = app_chacon+'\t			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_chacon = app_chacon+'\t			nb_http_request = nb_http_request + 1;\n';
					app_chacon = app_chacon+'			}\n';
					app_chacon = app_chacon+'		}\n';

					app_chacon = app_chacon+'		if (chacon_id=="'+id_eqp+'" && chacon_status=="OFF")\n'
					app_chacon = app_chacon+'		{\n';
					app_chacon = app_chacon+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+' et de statut OFF et de type '+type_eqp+'\");\n';
					app_chacon = app_chacon+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=0\";\n';
					app_chacon = app_chacon+'			console.log(\"  Envoi de la requete HTTP DESActivation de l\'equipement \");\n';
					app_chacon = app_chacon+'			console.log(\"  Requete :\" + http_request);\n';
					app_chacon = app_chacon+'			request(http_request, function(error, response, body)\n';
					app_chacon = app_chacon+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_chacon = app_chacon+'			nb_http_request = nb_http_request + 1;\n';

					app_chacon = app_chacon+'			if (S(msg).include("Batt"))\n';
					app_chacon = app_chacon+'			{\n';
					app_chacon = app_chacon+'\t			console.log(\"  Envoi de la requete HTTP Batterie: \" + bat);\n';
					app_chacon = app_chacon+'\t			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=\"+bat;\n';
					app_chacon = app_chacon+'\t			console.log(\"  Requete :\" + http_request);\n';
					app_chacon = app_chacon+'\t			request(http_request, function(error, response, body)\n';
					app_chacon = app_chacon+'\t			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_chacon = app_chacon+'\t			nb_http_request = nb_http_request + 1;\n';
					app_chacon = app_chacon+'			}\n';
					app_chacon = app_chacon+'		}\n';

					count_periph++;
					bool_periph_added = 1;
				}
				if (proto =="DOMIA")
				{
					console.log(" Equipement de protocole "+proto+".");
					console.log(" Equipement de protocole "+proto+"."); // | Tests non realises en l absence de ce type d equipement\n");
					//Sent radio ID (1 Burst(s), Protocols='Domia' ): M13_ON
					//Sent radio ID (1 Burst(s), Protocols='Domia' ): M11_OFF

					periph_jeedom = S(name_eqp).replaceAll(' ', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('/', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('\\', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('-', '').s;
					periph_jeedom = S(periph_jeedom).replaceAll('.', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('?', '').s;
					jid = "j_"+periph_jeedom;
					jid_descr = jid_descr+'var '+jid+' = require(\'string\');\n';
					jid_file = jid_file+'\t'+jid+' = 42;\t//'+periph_jeedom+';\n';
					periph_file = periph_file+type_eqp+'\t'+periph_jeedom+'\t'+id_eqp+'\tid_'+'\n';
					
					app_domia = app_domia+'\n		if (domia_id=="'+id_eqp+'" && domia_status=="ON")\n'
					app_domia = app_domia+'		{\n';
					app_domia = app_domia+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+' et de statut ON et de type '+type_eqp+'\");\n';
					app_domia = app_domia+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=0\";\n';
					app_domia = app_domia+'			console.log(\"  Envoi de la requete HTTP Activation de l\'equipement \");\n';
					app_domia = app_domia+'			console.log(\"  Requete :\" + http_request);\n';
					app_domia = app_domia+'			request(http_request, function(error, response, body)\n';
					app_domia = app_domia+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_domia = app_domia+'			nb_http_request = nb_http_request + 1;\n';

					/*app_domia = app_domia+'			console.log(\"  Envoi de la requete HTTP Batterie: \" + bat);\n';
					app_domia = app_domia+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=\"+bat;\n';
					app_domia = app_domia+'			console.log(\"  Requete :\" + http_request);\n';
					app_domia = app_domia+'			request(http_request, function(error, response, body)\n';
					app_domia = app_domia+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_domia = app_domia+'			nb_http_request = nb_http_request + 1;\n';*/
					app_domia = app_domia+'		}\n';

					app_domia = app_domia+'		if (domia_id=="'+id_eqp+'" && domia_status=="OFF")\n'
					app_domia = app_domia+'		{\n';
					app_domia = app_domia+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+' et de statut OFF et de type '+type_eqp+'\");\n';
					app_domia = app_domia+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=0\";\n';
					app_domia = app_domia+'			console.log(\"  Envoi de la requete HTTP DESActivation de l\'equipement \");\n';
					app_domia = app_domia+'			console.log(\"  Requete :\" + http_request);\n';
					app_domia = app_domia+'			request(http_request, function(error, response, body)\n';
					app_domia = app_domia+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_domia = app_domia+'			nb_http_request = nb_http_request + 1;\n';

					/*app_domia = app_domia+'			console.log(\"  Envoi de la requete HTTP Batterie: \" + bat);\n';
					app_domia = app_domia+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=\"+bat;\n';
					app_domia = app_domia+'			console.log(\"  Requete :\" + http_request);\n';
					app_domia = app_domia+'			request(http_request, function(error, response, body)\n';
					app_domia = app_domia+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_domia = app_domia+'			nb_http_request = nb_http_request + 1;\n';*/
					app_domia = app_domia+'		}\n';

					count_periph++;
					bool_periph_added = 1;
				}
				if (proto =="RF X10")
				{
					console.log(" Equipement de protocole "+proto+".");
					//app_rfx10=app_rfx10+'	}\n';
					console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id : "+ id_eqp);
					console.log("  Ajout dans le script Zidom du test de remontee sur cet equipement");
					
					periph_jeedom = S(name_eqp).replaceAll(' ', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('/', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('\\', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('-', '').s;
					periph_jeedom = S(periph_jeedom).replaceAll('.', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('?', '').s;
					/*periph_jeedom = S(periph_jeedom).replaceAll('e', 'e').s;
					periph_jeedom = S(periph_jeedom).replaceAll('è', 'e').s;
					periph_jeedom = S(periph_jeedom).replaceAll('ê', 'e').s;
					periph_jeedom = S(periph_jeedom).replaceAll('à', 'a').s;
					periph_jeedom = S(periph_jeedom).replaceAll('â', 'a').s;*/
					jid = "j_"+periph_jeedom;
						jidbatterie = "j_"+periph_jeedom+"_batterie";
						//jidradio = "j_"+periph_jeedom+"_radio";
					jid_descr = jid_descr+'var '+jid+' = require(\'string\');\n';
						jid_descr = jid_descr+'var '+jidbatterie+' = require(\'string\');\n';
						jid_descr = jid_descr+'var '+jidradio+' = require(\'string\');\n';
					jid_file = jid_file+'\t'+jid+' = 42;\t//'+periph_jeedom+';\n';
						jid_file = jid_file+'\t\t'+jidbatterie+' = 84;\t//'+periph_jeedom+';\n';
						//jid_file = jid_file+'\t\t\t'+jidradio+' = 88;\t//'+periph_jeedom+';\n';
					periph_file = periph_file+type_eqp+'\t'+periph_jeedom+'\t'+id_eqp+'\tid_'+'\n';
					
					app_rfx10 = app_rfx10+'\n		if (rfx10_id=="'+id_eqp+'" && rfx10_status=="ON")\n'
					app_rfx10 = app_rfx10+'		{\n';
					app_rfx10 = app_rfx10+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+' et de statut ON et de type '+type_eqp+'\");\n';
					app_rfx10 = app_rfx10+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=1\";\n';
					app_rfx10 = app_rfx10+'			console.log(\"  Envoi de la requete HTTP Activation de l\'equipement \");\n';
					app_rfx10 = app_rfx10+'			console.log(\"  Requete :\" + http_request);\n';
					app_rfx10 = app_rfx10+'			request(http_request, function(error, response, body)\n';
					app_rfx10 = app_rfx10+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';

					/*app_rfx10 = app_rfx10+'			console.log(\"  Envoi de la requete HTTP Batterie: \" + bat);\n';
					app_rfx10 = app_rfx10+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
					app_rfx10 = app_rfx10+'			console.log(\"  Requete :\" + http_request);\n';
					app_rfx10 = app_rfx10+'			request(http_request + bat, function(error, response, body)\n';
					app_rfx10 = app_rfx10+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_rfx10 = app_rfx10+'			nb_http_request = nb_http_request + 1;\n';*/
					app_rfx10 = app_rfx10+'		}\n';

					app_rfx10 = app_rfx10+'		if (rfx10_id=="'+id_eqp+'" && rfx10_status=="OFF")\n'
					app_rfx10 = app_rfx10+'		{\n';
					app_rfx10 = app_rfx10+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+'de statut OFF et de type '+type_eqp+'\");\n';
					app_rfx10 = app_rfx10+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=0\";\n';
					app_rfx10 = app_rfx10+'			console.log(\"  Envoi de la requete HTTP DESActivation de l\'equipement \");\n';
					app_rfx10 = app_rfx10+'			console.log(\"  Requete :\" + http_request);\n';
					app_rfx10 = app_rfx10+'			request(http_request, function(error, response, body)\n';
					app_rfx10 = app_rfx10+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';

					/*app_rfx10 = app_rfx10+'			console.log(\"  Envoi de la requete HTTP Batterie: \" + bat);\n';
					app_rfx10 = app_rfx10+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
					app_rfx10 = app_rfx10+'			console.log(\"  Envoi de la requete HTTP DESActivation de l\'equipement :\"+http_request+\");\n';
					app_rfx10 = app_rfx10+'			request(http_request, function(error, response, body)\n';
					app_rfx10 = app_rfx10+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_rfx10 = app_rfx10+'			nb_http_request = nb_http_request + 1;\n';*/
					app_rfx10 = app_rfx10+'		}\n';

					count_periph++;
					bool_periph_added = 1;
				}
				else if (proto =="ZWAVE")
				{
					console.log(" Equipement de protocole "+proto+".");
					periph_jeedom = S(name_eqp).replaceAll(' ', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('/', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('\\', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('-', '').s;
					periph_jeedom = S(periph_jeedom).replaceAll('.', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('?', '').s;

					/*if (S(name_eqp).contains("è"))
					{
						console.log("  Presence  de caractere accentué : accent grave");
						console.log("  Tentative 1 de correction:"+S(name_eqp).replaceAll('è', 'e').s);
						console.log("  Tentative 2 de correction:"+S(name_eqp).replaceAll('è', 'e').s);
					}
					if (S(name_eqp).contains("é"))
					{
						console.log("  Presence  de caractere accentué : accent aigu");
						console.log("  Tentative 1 de correction:"+S(name_eqp).replaceAll('é', 'e').s);
						console.log("  Tentative 2 de correction:"+S(name_eqp).replaceAll('é', 'e').s);
					}*/
					periph_jeedom = S(periph_jeedom).replaceAll('é', 'e').s;
					periph_jeedom = S(periph_jeedom).replaceAll('è', 'e').s;
					periph_jeedom = S(periph_jeedom).replaceAll('ê', 'e').s;
					periph_jeedom = S(periph_jeedom).replaceAll('à', 'a').s;
					periph_jeedom = S(periph_jeedom).replaceAll('â', 'a').s;

					jid = "j_"+periph_jeedom;
					jidbatterie = "j_"+periph_jeedom+"_batterie";
					jidradio = "j_"+periph_jeedom+"_radio";
					jid_descr = jid_descr+'var '+jid+' = require(\'string\');\n';
					jid_descr = jid_descr+'var '+jidbatterie+' = require(\'string\');\n';
					jid_descr = jid_descr+'var '+jidradio+' = require(\'string\');\n';
					jid_file = jid_file+'\t'+jid+' = 42;\t//'+periph_jeedom+';\n';
					jid_file = jid_file+'\t\t'+jidbatterie+' = 84;\t//'+periph_jeedom+';\n';
					//jid_file = jid_file+'\t\t\t'+jidradio+' = 88;\t//'+periph_jeedom+';\n';
					periph_file = periph_file+type_eqp+'\t'+periph_jeedom+'\t'+id_eqp+'\tid_'+'\n';
					
					if (type_eqp == "power")
					{
						jidpowerstatus = "j_"+periph_jeedom+"_powerstatus";
						jidpowertotal = "j_"+periph_jeedom+"_powertotal";
						jidpowerpower = "j_"+periph_jeedom+"_powerpower";
						
						jid_descr = jid_descr+'var '+jidpowerstatus+' = require(\'string\');\n';
						jid_descr = jid_descr+'var '+jidpowertotal+' = require(\'string\');\n';
						jid_descr = jid_descr+'var '+jidpowerpower+' = require(\'string\');\n';
						jid_file = jid_file+'\t\t\t'+jidpowerstatus+' = 88;\t//'+periph_jeedom+';\n';
						jid_file = jid_file+'\t\t\t'+jidpowertotal+' = 88;\t//'+periph_jeedom+';\n';
						jid_file = jid_file+'\t\t\t'+jidpowerpower+' = 88;\t//'+periph_jeedom+';\n';
	
						console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id : "+ id_eqp);
						console.log("  Ajout dans le script Zidom du test de remontee sur ce Power");
						app_zwave = app_zwave+'\n		if (zwave_id=="'+id_eqp+'")\n'
						app_zwave = app_zwave+'		{\n';
						app_zwave = app_zwave+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+' et de statut UNKNOWN et de type '+type_eqp+'\");\n';
						app_zwave = app_zwave+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidpowertotal+'+\"&value=\" + kwh;\n';
						
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP Power Total Energy: \" + kwh);\n';
						app_zwave = app_zwave+'			console.log(\"  Requete :\" + http_request);\n';
						app_zwave = app_zwave+'			request(http_request, function(error, response, body)\n';
						app_zwave = app_zwave+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_zwave = app_zwave+'			nb_http_request = nb_http_request + 1;\n';

						app_zwave = app_zwave+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidpowerpower+'+\"&value=\" + w;\n';
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP Power: \" + w);\n';
						app_zwave = app_zwave+'			console.log(\"  Requete :\" + http_request);\n';
						app_zwave = app_zwave+'			request(http_request, function(error, response, body)\n';
						app_zwave = app_zwave+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_zwave = app_zwave+'			nb_http_request = nb_http_request + 1;\n';

						/*app_zwave = app_zwave+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidpowerstatus+'+\"&value=\" + w;\n';
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP Power Status: \" + w);\n';
						app_zwave = app_zwave+'			console.log(\"  Requete :\" + http_request);\n';
						app_zwave = app_zwave+'			request(http_request, function(error, response, body)\n';
						app_zwave = app_zwave+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_zwave = app_zwave+'			nb_http_request = nb_http_request + 1;\n';*/

						app_zwave = app_zwave+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP Batterie: \" + bat);\n';
						app_zwave = app_zwave+'			console.log(\"  Requete :\" + http_request);\n';
						app_zwave = app_zwave+'			request(http_request, function(error, response, body)\n';
						app_zwave = app_zwave+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_zwave = app_zwave+'			nb_http_request = nb_http_request + 1;\n';
						app_zwave = app_zwave+'		}\n';
					}
 
					if (type_eqp == "receiverXDom")
					{
						console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id : "+ id_eqp);
						console.log("  Ajout dans le script Zidom du test de remontee sur ce receiverXDom");

						/*app_zwave = app_zwave+'\n		if (dev=="CMD/INTER" && zwave_id=="'+id_eqp+'" && zwave_status=="ON")\n'
						app_zwave = app_zwave+'		{\n';
						app_zwave = app_zwave+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+' et de statut ON et de type '+type_eqp+'\");\n';
						app_zwave = app_zwave+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=1\";\n';
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP Activation de l\'equipement\");\n';
						app_zwave = app_zwave+'			console.log(\"  Requete :\" + http_request);\n'; 
						app_zwave = app_zwave+'			request(http_request, function(error, response, body)\n';
						app_zwave = app_zwave+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';

						app_zwave = app_zwave+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP Batterie: \" + bat);\n';
						app_zwave = app_zwave+'			console.log(\"  Requete :\" + http_request);\n';
						app_zwave = app_zwave+'			request(http_request, function(error, response, body)\n';
						app_zwave = app_zwave+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_zwave = app_zwave+'			nb_http_request = nb_http_request + 1;\n';
						app_zwave = app_zwave+'		}\n';
						
						app_zwave = app_zwave+'\n		if (dev=="CMD/INTER" && zwave_id=="'+id_eqp+'" && zwave_status=="OFF")\n'
						app_zwave = app_zwave+'		{\n';
						app_zwave = app_zwave+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+' et de statut OFF et de type '+type_eqp+'\");\n';
						app_zwave = app_zwave+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=0\";\n';
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP DESActivation de l\'equipement\");\n';
						app_zwave = app_zwave+'			console.log(\"  Requete :\" + http_request);\n'; 
						app_zwave = app_zwave+'			request(http_request, function(error, response, body)\n';
						app_zwave = app_zwave+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';

						app_zwave = app_zwave+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP Batterie: \" + bat);\n';
						app_zwave = app_zwave+'			console.log(\"  Requete :\" + http_request);\n';
						app_zwave = app_zwave+'			request(http_request, function(error, response, body)\n';
						app_zwave = app_zwave+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_zwave = app_zwave+'			nb_http_request = nb_http_request + 1;\n';
						app_zwave = app_zwave+'		}\n';*/

						app_zwave = app_zwave+'\n		if (zwave_id=="'+id_eqp+'" && zwave_status=="ON")\n'
						app_zwave = app_zwave+'		{\n';
						app_zwave = app_zwave+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+' et de statut ON et de type '+type_eqp+'\");\n';
						app_zwave = app_zwave+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=1\";\n';
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP Activation de l\'equipement\");\n';
						app_zwave = app_zwave+'			console.log(\"  Requete :\" + http_request);\n'; 
						app_zwave = app_zwave+'			request(http_request, function(error, response, body)\n';
						app_zwave = app_zwave+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';

						app_zwave = app_zwave+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP Batterie: \" + bat);\n';
						app_zwave = app_zwave+'			console.log(\"  Requete :\" + http_request);\n';
						app_zwave = app_zwave+'			request(http_request, function(error, response, body)\n';
						app_zwave = app_zwave+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_zwave = app_zwave+'			nb_http_request = nb_http_request + 1;\n';
						app_zwave = app_zwave+'		}\n';
						
						app_zwave = app_zwave+'\n		else if (zwave_id=="'+id_eqp+'" && zwave_status=="OFF")\n'
						app_zwave = app_zwave+'		{\n';
						app_zwave = app_zwave+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+' et de statut OFF et de type '+type_eqp+'\");\n';
						app_zwave = app_zwave+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=0\";\n';
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP DESActivation de l\'equipement\");\n';
						app_zwave = app_zwave+'			console.log(\"  Requete :\" + http_request);\n'; 
						app_zwave = app_zwave+'			request(http_request, function(error, response, body)\n';
						app_zwave = app_zwave+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';

						app_zwave = app_zwave+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP Batterie: \" + bat);\n';
						app_zwave = app_zwave+'			console.log(\"  Requete :\" + http_request);\n';
						app_zwave = app_zwave+'			request(http_request, function(error, response, body)\n';
						app_zwave = app_zwave+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_zwave = app_zwave+'			nb_http_request = nb_http_request + 1;\n';
						app_zwave = app_zwave+'		}\n';
						
						/*app_zwave = app_zwave+'\n		else if (zwave_id=="'+id_eqp+'" && zwave_status=="UNKNOWN" && S(dev).include(\'Power Measure\'))\n'
						app_zwave = app_zwave+'		{\n';
						app_zwave = app_zwave+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+' et de statut POWER et de type '+type_eqp+'\");\n';
						app_zwave = app_zwave+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidpowertotal+'+\"&value=\" + kwh;\n';
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP Total Energy: \" + kwh);\n';
						app_zwave = app_zwave+'			console.log(\"  Requete :\" + http_request);\n';
						app_zwave = app_zwave+'			request(http_request, function(error, response, body)\n';
						app_zwave = app_zwave+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_zwave = app_zwave+'			nb_http_request = nb_http_request + 1;\n';

						app_zwave = app_zwave+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidpowerpower+'+\"&value=\" + w;\n';
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP Power: \" + w);\n';
						app_zwave = app_zwave+'			console.log(\"  Requete :\" + http_request);\n';
						app_zwave = app_zwave+'			request(http_request, function(error, response, body)\n';
						app_zwave = app_zwave+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_zwave = app_zwave+'			nb_http_request = nb_http_request + 1;\n';

						app_zwave = app_zwave+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP Batterie: \" + bat);\n';
						app_zwave = app_zwave+'			console.log(\"  Requete :\" + http_request);\n';
						app_zwave = app_zwave+'			request(http_request, function(error, response, body)\n';
						app_zwave = app_zwave+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_zwave = app_zwave+'			nb_http_request = nb_http_request + 1;\n';
						app_zwave = app_zwave+'		}\n'*/

						app_zwave = app_zwave+'\n		else if (zwave_id=="'+id_eqp+'" && zwave_status=="WakeUp")\n'
						app_zwave = app_zwave+'		{\n';
						app_zwave = app_zwave+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+' et de statut WakeUp de type '+type_eqp+'\");\n';
						app_zwave = app_zwave+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP Batterie: \" + bat);\n';
						app_zwave = app_zwave+'			console.log(\"  Requete :\" + http_request);\n';
						app_zwave = app_zwave+'			request(http_request, function(error, response, body)\n';
						app_zwave = app_zwave+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_zwave = app_zwave+'			nb_http_request = nb_http_request + 1;\n';
						app_zwave = app_zwave+'		}\n';
					}

					if (type_eqp == "transmitter")
					{
						console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id : "+ id_eqp);
						console.log("  Ajout dans le script Zidom du test de remontee sur ce transmitter");
						
						app_zwave = app_zwave+'\n		if (dev=="CMD/INTER" && zwave_id=="'+id_eqp+'" && zwave_status=="ON")\n'
						app_zwave = app_zwave+'		{\n';
						app_zwave = app_zwave+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+' et de statut ON et de type '+type_eqp+'\");\n';
						app_zwave = app_zwave+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=1\";\n';
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP Activation de l\'equipement\");\n';
						app_zwave = app_zwave+'			console.log(\"  Requete :\" + http_request);\n'; 
						app_zwave = app_zwave+'			request(http_request, function(error, response, body)\n';
						app_zwave = app_zwave+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';

						app_zwave = app_zwave+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP Batterie: \" + bat);\n';
						app_zwave = app_zwave+'			console.log(\"  Requete :\" + http_request);\n';
						app_zwave = app_zwave+'			request(http_request, function(error, response, body)\n';
						app_zwave = app_zwave+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_zwave = app_zwave+'			nb_http_request = nb_http_request + 1;\n';
						app_zwave = app_zwave+'		}\n';

						app_zwave = app_zwave+'\n		if (dev=="CMD/INTER" && zwave_id=="'+id_eqp+'" && zwave_status=="OFF")\n'
						app_zwave = app_zwave+'		{\n';
						app_zwave = app_zwave+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+' et de statut OFF et de type '+type_eqp+'\");\n';
						app_zwave = app_zwave+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=0\";\n';
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP DESActivation de l\'equipement\");\n';
						app_zwave = app_zwave+'			console.log(\"  Requete :\" + http_request);\n'; 
						app_zwave = app_zwave+'			request(http_request, function(error, response, body)\n';
						app_zwave = app_zwave+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';

						app_zwave = app_zwave+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP Batterie: \" + bat);\n';
						app_zwave = app_zwave+'			console.log(\"  Requete :\" + http_request);\n';
						app_zwave = app_zwave+'			request(http_request, function(error, response, body)\n';
						app_zwave = app_zwave+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_zwave = app_zwave+'			nb_http_request = nb_http_request + 1;\n';
						app_zwave = app_zwave+'		}\n';
					}

					count_periph++;
					bool_periph_added = 1;
					//app_zwave = app_zwave+'		fs.writeFileSync("debug_zwave.txt", S(msg), "UTF-8");';
				}
				else if (proto =="RFS10/TS10")
				{
					//A implementer
					console.log(" Equipement de protocole "+proto+" | Tests non realises en l absence de ce type d equipement\n");
					app_rfs10ts10=app_rfs10ts10+'	}\n';

					count_periph++;	
					bool_periph_added = 1;				
				}
				else if (proto =="XDD433")
				{
					//A implementer
					console.log(" Equipement de protocole "+proto+" | Tests non realises en l absence de ce type d equipement\n");
					app_xdd433alrm=app_xdd433alrm+'	}\n';

					count_periph++;	
					bool_periph_added = 1;				
				}
				else if (proto =="XDD868")
				{
					//A implementer
					console.log(" Equipement de protocole "+proto+" | Tests non realises en l absence de ce type d equipement\n");
					app_xdd868alrm=app_xdd868alrm+'	}\n';

					count_periph++;	
					bool_periph_added = 1;				
				}
				else if (proto =="XDD868Inter/Shutter")
				{
					console.log(" Equipement de protocole "+proto+".");
					console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id : "+ id_eqp);
					console.log("  Ajout dans le script Zidom du test de remontee sur cet equipement");
					
					periph_jeedom = S(name_eqp).replaceAll(' ', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('/', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('\\', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('-', '').s;
					periph_jeedom = S(periph_jeedom).replaceAll('.', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('?', '').s;
					jid = "j_"+periph_jeedom;
						jidbatterie = "j_"+periph_jeedom+"_batterie";
						//jidradio = "j_"+periph_jeedom+"_radio";
					
					jid_descr = jid_descr+'var '+jid+' = require(\'string\');\n';
						jid_descr = jid_descr+'var '+jidbatterie+' = require(\'string\');\n';
						jid_descr = jid_descr+'var '+jidradio+' = require(\'string\');\n';
					jid_file = jid_file+'\t'+jid+' = 42;\t//'+periph_jeedom+';\n';
						jid_file = jid_file+'\t\t'+jidbatterie+' = 84;\t//'+periph_jeedom+';\n';
						//jid_file = jid_file+'\t\t\t'+jidradio+' = 88;\t//'+periph_jeedom+';\n';
					periph_file = periph_file+type_eqp+'\t'+periph_jeedom+'\t'+id_eqp+'\tid_'+'\n';
					
					app_xdd868intershutter = app_xdd868intershutter+'\n		if (S(msg).include(\'Inter/shutter RFY433\') && S(msg).include("'+id_eqp+'_ON"))\n'
					app_xdd868intershutter = app_xdd868intershutter+'		{\n';
					app_xdd868intershutter = app_xdd868intershutter+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+' et de statut ONet de type '+type_eqp+'\");\n';
					app_xdd868intershutter = app_xdd868intershutter+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=1\";\n';
					app_xdd868intershutter = app_xdd868intershutter+'			console.log(\"  Envoi de la requete HTTP Ouverture volet de l\'equipement \");\n';
					app_xdd868intershutter = app_xdd868intershutter+'			console.log(\"  Requete :\" + http_request);\n'; 
					app_xdd868intershutter = app_xdd868intershutter+'			request(http_request, function(error, response, body)\n';
					app_xdd868intershutter = app_xdd868intershutter+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_xdd868intershutter = app_xdd868intershutter+'			nb_http_request = nb_http_request + 1;\n';
					app_xdd868intershutter = app_xdd868intershutter+'		}\n';
					
					app_xdd868intershutter = app_xdd868intershutter+'\n		if (S(msg).include(\'Inter/shutter RFY433\') && S(msg).include("'+id_eqp+'_OFF"))\n'
					app_xdd868intershutter = app_xdd868intershutter+'		{\n';
					app_xdd868intershutter = app_xdd868intershutter+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+' et de statut OFF et de type '+type_eqp+'\");\n';
					app_xdd868intershutter = app_xdd868intershutter+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=0\";\n';
					app_xdd868intershutter = app_xdd868intershutter+'			console.log(\"  Envoi de la requete HTTP Fermeture volet de l\'equipement \");\n';
					app_xdd868intershutter = app_xdd868intershutter+'			console.log(\"  Requete :\" + http_request);\n'; 
					app_xdd868intershutter = app_xdd868intershutter+'			request(http_request, function(error, response, body)\n';
					app_xdd868intershutter = app_xdd868intershutter+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_xdd868intershutter = app_xdd868intershutter+'			nb_http_request = nb_http_request + 1;\n';
					app_xdd868intershutter = app_xdd868intershutter+'		}\n';
					
					app_xdd868intershutter = app_xdd868intershutter+'\n		if (S(msg).include(\'Inter/shutter RFY433\') && S(msg).include("'+id_eqp+'") && S(msg).include("DIM/SPECIAL"))\n'
					app_xdd868intershutter = app_xdd868intershutter+'		{\n';
					app_xdd868intershutter = app_xdd868intershutter+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' de statu DIM/SPECIAL et de type '+type_eqp+'\");\n';
					app_xdd868intershutter = app_xdd868intershutter+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=2\";\n';
					app_xdd868intershutter = app_xdd868intershutter+'			console.log(\"  Envoi de la requete HTTP Arret volet de l\'equipement \");\n';
					app_xdd868intershutter = app_xdd868intershutter+'			console.log(\"  Requete :\" + http_request);\n'; 
					app_xdd868intershutter = app_xdd868intershutter+'			request(http_request, function(error, response, body)\n';
					app_xdd868intershutter = app_xdd868intershutter+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_xdd868intershutter = app_xdd868intershutter+'			nb_http_request = nb_http_request + 1;\n';
					app_xdd868intershutter = app_xdd868intershutter+'		}\n';

					count_periph++;
					bool_periph_added = 1;
				}
				else if (proto =="XDD868PilotWire")
				{
					console.log(" Equipement de protocole "+proto+".");
					console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id : "+ id_eqp);
					console.log("  Ajout dans le script Zidom du test de remontee sur cet equipement");
					//app_xdd868pilotwire = app_xdd868pilotwire+'\n		console.log(\"DEBUG X2D !!!!!! Dans les tests X2D 1....\");\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'\n		if (xdd868pilotwire_id=="'+id_eqp+'")\n';
					app_xdd868pilotwire=app_xdd868pilotwire+'		{\n';
					
					periph_jeedom = S(name_eqp).replaceAll(' ', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('/', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('\\', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('-', '').s;
					periph_jeedom = S(periph_jeedom).replaceAll('.', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('?', '').s;
					jid = "j_"+periph_jeedom;
						//jidbatterie = "j_"+periph_jeedom+"_batterie";
						jidcmd = "j_"+periph_jeedom+"_cmd";
					
					jid_descr = jid_descr+'var '+jid+' = require(\'string\');\n';
						//jid_descr = jid_descr+'var '+jidbatterie+' = require(\'string\');\n';
						jid_descr = jid_descr+'var '+jidradio+' = require(\'string\');\n';
					jid_file = jid_file+'\t'+jid+' = 42;\t//'+periph_jeedom+';\n';
						//jid_file = jid_file+'\t\t'+jidbatterie+' = 84;\t//'+periph_jeedom+';\n';
						jid_file = jid_file+'\t\t\t'+jidcmd+' = 88;\t//'+periph_jeedom+';\n';
					periph_file = periph_file+type_eqp+'\t'+periph_jeedom+'\t'+id_eqp+'\tid_'+'\n';

					//app_xdd868pilotwire = app_xdd868pilotwire+'\n			console.log(\"DEBUG X2D !!!!!! Dans les tests X2D 2....\");\n';
					
					//app_xdd868pilotwire = app_xdd868pilotwire+'\n			if (S(msg).include(\'XDD868 Radiator/Pilot Wire\') && S(msg).include("'+id_eqp+'_ON"))\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'\n			if (xdd868pilotwire_id=="'+id_eqp+'" && xdd868pilotwire_status=="ON")\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'			{\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+', de statut ON, de commande '+jidcmd+' et de type '+type_eqp+'\");\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=1\";\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\"  Envoi de la requete HTTP Activation de l\'equipement\");\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\"  Requete :\" + http_request);\n'; 
					app_xdd868pilotwire = app_xdd868pilotwire+'				request(http_request, function(error, response, body)\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				nb_http_request = nb_http_request + 1;\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=\"+'+jidcmd+';\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\"  Envoi de la requete HTTP Commande de l\'equipement\");\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\"  Requete :\" + http_request);\n'; 
					app_xdd868pilotwire = app_xdd868pilotwire+'				request(http_request, function(error, response, body)\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				nb_http_request = nb_http_request + 1;\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'			}\n';
					
					//app_xdd868pilotwire = app_xdd868pilotwire+'			if (S(msg).include(\'XDD868 Radiator/Pilot Wire\') && S(msg).include("'+id_eqp+'_OFF"))\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'\n			if (xdd868pilotwire_id=="'+id_eqp+'" && xdd868pilotwire_status=="OFF")\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'			{\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+', de statut OFF, de commande '+jidcmd+' et de type '+type_eqp+'\");\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=0\";\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\"  Envoi de la requete HTTP DESActivation de l\'equipement\");\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\"  Requete :\" + http_request);\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				request(http_request, function(error, response, body)\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				nb_http_request = nb_http_request + 1;\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=\"+'+jidcmd+';\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\"  Envoi de la requete HTTP Commande de l\'equipement\");\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\"  Requete :\" + http_request);\n'; 
					app_xdd868pilotwire = app_xdd868pilotwire+'				request(http_request, function(error, response, body)\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				nb_http_request = nb_http_request + 1;\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'			}\n';

					//app_xdd868pilotwire = app_xdd868pilotwire+'\n			if (S(msg).include(\'XDD868 Radiator/Pilot Wire\') && S(msg).include("'+id_eqp+'") && S(msg).include("DIM/SPECIAL"))\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'\n			if (xdd868pilotwire_id=="'+id_eqp+'" && xdd868pilotwire_status=="DIM/SPECIAL")\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'			{\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+', de statut DIM/SPECIAL, de commande '+jidcmd+' de type '+type_eqp+'\");\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=2\";\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\"  Envoi de la requete HTTP DIM/SPECIAL de l\equipement\");\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\"  Requete :\" + http_request);\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				request(http_request, function(error, response, body)\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				nb_http_request = nb_http_request + 1;\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=\"+'+jidcmd+';\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\"  Envoi de la requete HTTP Commande de l\'equipement\");\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\"  Requete :\" + http_request);\n'; 
					app_xdd868pilotwire = app_xdd868pilotwire+'				request(http_request, function(error, response, body)\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				nb_http_request = nb_http_request + 1;\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'			}\n';

					//app_xdd868pilotwire = app_xdd868pilotwire+'\n			if (S(msg).include(\'XDD868 Radiator/Pilot Wire\') && S(msg).include("'+id_eqp+'") && S(msg).include("DIM/SPECIAL"))\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'\n			if (xdd868pilotwire_id=="'+id_eqp+'" && xdd868pilotwire_status=="UNKNOWN")\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'			{\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+', de statut UNKNOWN, de commande '+jidcmd+' de type '+type_eqp+'\");\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=3\";\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\"  Envoi de la requete HTTP DIM/SPECIAL de l\equipement\");\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\"  Requete :\" + http_request);\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				request(http_request, function(error, response, body)\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				nb_http_request = nb_http_request + 1;\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=\"+'+jidcmd+';\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\"  Envoi de la requete HTTP Commande de l\'equipement\");\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\"  Requete :\" + http_request);\n'; 
					app_xdd868pilotwire = app_xdd868pilotwire+'				request(http_request, function(error, response, body)\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				nb_http_request = nb_http_request + 1;\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'			}\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'		}\n';

					count_periph++;
					bool_periph_added = 1;
				}
				else if (proto =="XDD868Boiler")
				{
					//A implementer
					console.log(" Equipement de protocole "+proto+" | Tests non realises en l absence de ce type d equipement");
					app_xdd868boiler=app_xdd868boiler+'	}\n';

					count_periph++;
					bool_periph_added = 1;			
				}
				// Traitement des peripheriques sans protocoles
				else if (proto =="oregon")
				{
					console.log(" Equipement de protocole "+proto+".");
					console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id : "+ id_eqp);
					console.log("  Ajout dans le script Zidom du test de remontee sur cet Oregon");
					app_undefined = app_undefined+'\n		if (id=="'+id_eqp+'")\n'
					app_undefined = app_undefined+'		{\n';
					
					periph_jeedom = S(name_eqp).replaceAll(' ', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('/', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('\\', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('+', '').s;
					//periph_jeedom = S(periph_jeedom).replaceAll('-', '').s;
					periph_jeedom = S(periph_jeedom).replaceAll('.', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('?', '').s;
					jid = "j_"+periph_jeedom;
					jidhygro = "j_"+periph_jeedom+"_hygro";
						jidbatterie = "j_"+periph_jeedom+"_batterie";
						jidradio = "j_"+periph_jeedom+"_radio";
					
					jid_descr = jid_descr+'var '+jid+' = require(\'string\');\n';
					jid_descr = jid_descr+'var '+jidhygro+' = require(\'string\');\n';
						jid_descr = jid_descr+'var '+jidbatterie+' = require(\'string\');\n';
						jid_descr = jid_descr+'var '+jidradio+' = require(\'string\');\n';
					jid_file = jid_file+'\t'+jid+' = 42;\t//'+periph_jeedom+';\n';
						jid_file = jid_file+'\t\t'+jidhygro+' = 42;\t//'+periph_jeedom+';\n';
						jid_file = jid_file+'\t\t\t'+jidbatterie+' = 84;\t//'+periph_jeedom+';\n';
						jid_file = jid_file+'\t\t\t\t'+jidradio+' = 88;\t//'+periph_jeedom+';\n';
					periph_file = periph_file+type_eqp+'\t'+periph_jeedom+'\t'+id_eqp+'\tid_'+'\n';
					
					app_undefined = app_undefined+'			console.log(\" Test de l equipement Oregon ' + name_eqp + ', d\'ID Zibase '+id_eqp+' et de type '+type_eqp+'\");\n';
					app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=\" + tem;\n';
					app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP temperature: \" + tem);\n';
					app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
					app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
					app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';

					app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidradio+'+\"&value=\"+lev;\n';
					app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Niveau de reception radio: \"+lev);\n';
					app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
					app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
					app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';

					app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
					app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Batterie: \" + bat);\n';
					app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
					app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
					app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';
					
					app_undefined = app_undefined+'			if (S(msg).include(\'Humidity\'))\n'
					app_undefined = app_undefined+'			{\n';
					app_undefined = app_undefined+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidhygro+'+\"&value=\" + hum\n';
					app_undefined = app_undefined+'				console.log(\"  Envoi de la requete HTTP Hygrometrie: \" + hum);\n';
					app_undefined = app_undefined+'				console.log(\"  Requete :\" + http_request);\n';
					app_undefined = app_undefined+'				request(http_request, function(error, response, body)\n';
					app_undefined = app_undefined+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_undefined = app_undefined+'				nb_http_request = nb_http_request + 1;\n';
					app_undefined = app_undefined+'			}\n';
					app_undefined = app_undefined+'		}\n';

					count_periph++;
					bool_periph_added = 1;
				}
				else if (proto =="owl")
				{
					console.log(" Equipement de protocole "+proto+".");
					console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id : "+ id_eqp);
					console.log("  Ajout dans le script Zidom du test de remontee sur cet OWL");
					app_undefined = app_undefined+'\n		if (owl_id=="'+id_eqp+'")\n'
					app_undefined = app_undefined+'		{\n';

					periph_jeedom = S(name_eqp).replaceAll(' ', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('/', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('\\', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('-', '').s;
					periph_jeedom = S(periph_jeedom).replaceAll('.', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('?', '').s;
					//jid = "j_"+periph_jeedom;
						jidpowertotal = "j_"+periph_jeedom+"_powertotal";
						jidpowerpower = "j_"+periph_jeedom+"_powerpower";
						jidbatterie = "j_"+periph_jeedom+"_batterie";
						jidradio = "j_"+periph_jeedom+"_radio";

					//jid_descr = jid_descr+'var '+jid+' = require(\'string\');\n';
						jid_descr = jid_descr+'var '+jidpowertotal+' = require(\'string\');\n';
						jid_descr = jid_descr+'var '+jidpowerpower+' = require(\'string\');\n';
						jid_descr = jid_descr+'var '+jidbatterie+' = require(\'string\');\n';
						jid_descr = jid_descr+'var '+jidradio+' = require(\'string\');\n';
					//jid_file = jid_file+'\t'+jid+' = 42;\t//'+periph_jeedom+';\n';
						jid_file = jid_file+'\t'+jidpowertotal+' = 88;\t//'+periph_jeedom+';\n';
						jid_file = jid_file+'\t\t'+jidpowerpower+' = 88;\t//'+periph_jeedom+';\n';
						jid_file = jid_file+'\t\t\t'+jidbatterie+' = 84;\t//'+periph_jeedom+';\n';
						jid_file = jid_file+'\t\t\t'+jidradio+' = 88;\t//'+periph_jeedom+';\n';
					periph_file = periph_file+type_eqp+'\t'+periph_jeedom+'\t'+id_eqp+'\tid_'+'\n';

					app_undefined = app_undefined+'			console.log(\" Test de l equipement OWL ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+' et de statut POWER et de type '+type_eqp+'\");\n';
					app_undefined = app_undefined+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidpowertotal+'+\"&value=\" + kwh;\n';
					
					app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP OWL Power Total Energy: \" + kwh);\n';
					app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
					app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
					app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';

					app_undefined = app_undefined+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidpowerpower+'+\"&value=\" + w;\n';
					app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP OWL Power: \" + w);\n';
					app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
					app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
					app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';

					app_undefined = app_undefined+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
					app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP OWL Batterie: \" + bat);\n';
					app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
					app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
					app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';
					app_undefined = app_undefined+'		}\n';

					count_periph++;
					bool_periph_added = 1;
				}
				else if (proto == "undefined")
				{
					console.log(" Equipement de protocole "+proto+".");
					/*if (type_eqp =="power")
					{
						periph_jeedom = S(name_eqp).replaceAll(' ', '_').s;
						periph_jeedom = S(periph_jeedom).replaceAll('/', '_').s;
						periph_jeedom = S(periph_jeedom).replaceAll('\\', '_').s;
						periph_jeedom = S(periph_jeedom).replaceAll('-', '').s;
						periph_jeedom = S(periph_jeedom).replaceAll('.', '_').s;
						periph_jeedom = S(periph_jeedom).replaceAll('?', '').s;
						//jid = "j_"+periph_jeedom;
							jidpowertotal = "j_"+periph_jeedom+"_powertotal";
							jidpowerpower = "j_"+periph_jeedom+"_powerpower";
							jidbatterie = "j_"+periph_jeedom+"_batterie";
							jidradio = "j_"+periph_jeedom+"_radio";
						
						//jid_descr = jid_descr+'var '+jid+' = require(\'string\');\n';
							jid_descr = jid_descr+'var '+jidpowertotal+' = require(\'string\');\n';
							jid_descr = jid_descr+'var '+jidpowerpower+' = require(\'string\');\n';
							jid_descr = jid_descr+'var '+jidbatterie+' = require(\'string\');\n';
							jid_descr = jid_descr+'var '+jidradio+' = require(\'string\');\n';
						//jid_file = jid_file+'\t'+jid+' = 42;\t//'+periph_jeedom+';\n';
							jid_file = jid_file+'\t'+jidpowertotal+' = 88;\t//'+periph_jeedom+';\n';
							jid_file = jid_file+'\t\t'+jidpowerpower+' = 88;\t//'+periph_jeedom+';\n';
							jid_file = jid_file+'\t\t\t'+jidbatterie+' = 84;\t//'+periph_jeedom+';\n';
							jid_file = jid_file+'\t\t\t'+jidradio+' = 88;\t//'+periph_jeedom+';\n';
						periph_file = periph_file+type_eqp+'\t'+periph_jeedom+'\t'+id_eqp+'\tid_'+'\n';
						
						console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id : "+ id_eqp);
						console.log("  Ajout dans le script Zidom du test de remontee sur ce Power OWL");
						app_undefined = app_undefined+'\n		if (owl_id=="'+id_eqp+'")\n'
						app_undefined = app_undefined+'		{\n';
						app_undefined = app_undefined+'			console.log(\" Test de l equipement OWL ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+' et de statut POWER et de type '+type_eqp+'\");\n';
						app_undefined = app_undefined+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidpowertotal+'+\"&value=\" + kwh;\n';
						
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP OWL Power Total Energy: \" + kwh);\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';

						app_undefined = app_undefined+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidpowerpower+'+\"&value=\" + w;\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP OWL Power: \" + w);\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';

						app_undefined = app_undefined+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP OWL Batterie: \" + bat);\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';
						app_undefined = app_undefined+'			}\n';

						count_periph++;
					}*/
				
					//console.log(" Equipement de protocole "+proto+".");
					//Traitements des sondes de Temperature					
					if (type_eqp == "temperature")
					{
						console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id : "+ id_eqp);
						console.log("  Ajout dans le script Zidom du test de remontee sur ce transmitter");
						app_undefined = app_undefined+'\n		if (id=="'+id_eqp+'")\n'
						app_undefined = app_undefined+'		{\n';
					
						periph_jeedom = S(name_eqp).replaceAll(' ', '_').s;
						periph_jeedom = S(periph_jeedom).replaceAll('/', '_').s;
						periph_jeedom = S(periph_jeedom).replaceAll('\\', '_').s;
						periph_jeedom = S(periph_jeedom).replaceAll('-', '').s;
						periph_jeedom = S(periph_jeedom).replaceAll('.', '_').s;
						periph_jeedom = S(periph_jeedom).replaceAll('?', '').s;
						jid = "j_"+periph_jeedom;
						jidhygro = "j_"+periph_jeedom+"_hygro";
							jidbatterie = "j_"+periph_jeedom+"_batterie";
							jidradio = "j_"+periph_jeedom+"_radio";
						
						jid_descr = jid_descr+'var '+jid+' = require(\'string\');\n';
						jid_descr = jid_descr+'var '+jidhygro+' = require(\'string\');\n';
							jid_descr = jid_descr+'var '+jidbatterie+' = require(\'string\');\n';
							jid_descr = jid_descr+'var '+jidradio+' = require(\'string\');\n';
						jid_file = jid_file+'\t'+jid+' = 42;\t//'+periph_jeedom+';\n';
							jid_file = jid_file+'\t\t'+jidhygro+' = 42;\t//'+periph_jeedom+';\n';
							jid_file = jid_file+'\t\t\t'+jidbatterie+' = 84;\t//'+periph_jeedom+';\n';
							jid_file = jid_file+'\t\t\t\t'+jidradio+' = 88;\t//'+periph_jeedom+';\n';
						periph_file = periph_file+type_eqp+'\t'+periph_jeedom+'\t'+id_eqp+'\tid_'+'\n';

						app_undefined = app_undefined+'			console.log(\" Test de l equipement Temperature ' + name_eqp + ', d\'ID Zibase '+id_eqp+' et de type '+type_eqp+'\");\n';
						app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=\" + tem;\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP temperature: \" + tem);\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';

						app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidradio+'+\"&value=\"+lev;\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Niveau de reception radio: \"+lev);\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';

						app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Batterie: \" + bat);\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';
						
						app_undefined = app_undefined+'			if (S(msg).include(\'Humidity\'))\n'
						app_undefined = app_undefined+'			{\n';
						app_undefined = app_undefined+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidhygro+'+\"&value=\" + hum;\n';
						app_undefined = app_undefined+'				console.log(\"  Envoi de la requete HTTP Hygrometrie: \" + hum);\n';
						app_undefined = app_undefined+'				console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'				request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'				nb_http_request = nb_http_request + 1;\n';
						app_undefined = app_undefined+'			}\n';
						app_undefined = app_undefined+'		}\n';
					}

					//console.log(" Equipement de protocole "+proto+".");
					//Traitements des sondes Rain (pluviometre)
					if (type_eqp == "rain")
					{
						console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id : "+ id_eqp);
						console.log("  Ajout dans le script Zidom du test de remontee sur ce transmitter");
						app_undefined = app_undefined+'\n		if (id=="'+id_eqp+'")\n'
						app_undefined = app_undefined+'		{\n';
					
						periph_jeedom = S(name_eqp).replaceAll(' ', '_').s;
						periph_jeedom = S(periph_jeedom).replaceAll('/', '_').s;
						periph_jeedom = S(periph_jeedom).replaceAll('\\', '_').s;
						periph_jeedom = S(periph_jeedom).replaceAll('-', '').s;
						periph_jeedom = S(periph_jeedom).replaceAll('.', '_').s;
						periph_jeedom = S(periph_jeedom).replaceAll('?', '').s;
						//jid = "j_"+periph_jeedom;
							jidnoise = "j_"+periph_jeedom+"_noise";
							jidlevel = "j_"+periph_jeedom+"_level";
							jidtotalrain = "j_"+periph_jeedom+"_totalrain";
							jidcurrentrain = "j_"+periph_jeedom+"_currentrain";
							jidbatterie = "j_"+periph_jeedom+"_batterie";
							//jidradio = "j_"+periph_jeedom+"_radio";
						
						//jid_descr = jid_descr+'var '+jid+' = require(\'string\');\n';
							jid_descr = jid_descr+'var '+jidnoise+' = require(\'string\');\n';
							jid_descr = jid_descr+'var '+jidlevel+' = require(\'string\');\n';
							jid_descr = jid_descr+'var '+jidtotalrain+' = require(\'string\');\n';
							jid_descr = jid_descr+'var '+jidcurrentrain+' = require(\'string\');\n';
							jid_descr = jid_descr+'var '+jidbatterie+' = require(\'string\');\n';
							//jid_descr = jid_descr+'var '+jidradio+' = require(\'string\');\n';
						//jid_file = jid_file+'\t'+jid+' = 42;\t//'+periph_jeedom+';\n';
							jid_file = jid_file+'\t\t'+jidnoise+' = 42;\t//'+periph_jeedom+';\n';
							jid_file = jid_file+'\t\t\t'+jidlevel+' = 42;\t//'+periph_jeedom+';\n';
							jid_file = jid_file+'\t\t\t\t'+jidtotalrain+' = 42;\t//'+periph_jeedom+';\n';
							jid_file = jid_file+'\t\t\t\t\t'+jidcurrentrain+' = 42;\t//'+periph_jeedom+';\n';
							jid_file = jid_file+'\t\t\t\t\t\t'+jidbatterie+' = 84;\t//'+periph_jeedom+';\n';
							//jid_file = jid_file+'\t\t\t\t'+jidradio+' = 88;\t//'+periph_jeedom+';\n';
						periph_file = periph_file+type_eqp+'\t'+periph_jeedom+'\t'+id_eqp+'\tid_'+'\n';

						//29/10/2014 19:58:53    Received radio ID (433Mhz Oregon Noise=2482 Level=5.0/5 PCR800 Total Rain=40mm Current Rain=236mm/hour Batt=Ok) Pluviomètre (OS706331648)
						app_undefined = app_undefined+'			console.log(\" Test de l equipement rain ' + name_eqp + ', d\'ID Zibase '+id_eqp+' et de type '+type_eqp+'\");\n';
						/*app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidnoise+'+\"&value=\" + noise;\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Niveau de bruit radio (sur pluviometre): \" + noise);\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';*/

						/*app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidlevel+'+\"&value=\" + level;\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Niveau de reception radio (sur pluviometre): \" + level);\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';*/

						app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidtotalrain+'+\"&value=\"+totalrain;\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Total Rain (sur pluviometre): \" + totalrain);\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';

						app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidcurrentrain+'+\"&value=\"+currentrain;\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Current Rain (sur pluviometre): \" + currentrain);\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';

						app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Batterie: \" + bat);\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';
						app_undefined = app_undefined+'		}\n';
					}

					//console.log(" Equipement de protocole "+proto+".");
					//Traitements des sondes Wind (anemometre)	Received radio ID (433Mhz Oregon Noise=2494 Level=1.9/5 WGR800 Avg.Wind=0.9m/s Dir.=180° Batt=Ok) 				
					if (type_eqp == "wind")
					{
						console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id : "+ id_eqp);
						console.log("  Ajout dans le script Zidom du test de remontee sur ce transmitter");
						app_undefined = app_undefined+'\n		if (id=="'+id_eqp+'")\n'
						app_undefined = app_undefined+'		{\n';

						periph_jeedom = S(name_eqp).replaceAll(' ', '_').s;
						periph_jeedom = S(periph_jeedom).replaceAll('/', '_').s;
						periph_jeedom = S(periph_jeedom).replaceAll('\\', '_').s;
						periph_jeedom = S(periph_jeedom).replaceAll('-', '').s;
						periph_jeedom = S(periph_jeedom).replaceAll('.', '_').s;
						periph_jeedom = S(periph_jeedom).replaceAll('?', '').s;
						//jid = "j_"+periph_jeedom;
							jidnoise = "j_"+periph_jeedom+"_noise";
							jidlevel = "j_"+periph_jeedom+"_level";
							jidavgwind = "j_"+periph_jeedom+"_avgwind";
							jiddir = "j_"+periph_jeedom+"_dir";
							jidbatterie = "j_"+periph_jeedom+"_batterie";
							//jidradio = "j_"+periph_jeedom+"_radio";
						
						//jid_descr = jid_descr+'var '+jid+' = require(\'string\');\n';
							jid_descr = jid_descr+'var '+jidnoise+' = require(\'string\');\n';
							jid_descr = jid_descr+'var '+jidlevel+' = require(\'string\');\n';
							jid_descr = jid_descr+'var '+jidavgwind+' = require(\'string\');\n';
							jid_descr = jid_descr+'var '+jiddir+' = require(\'string\');\n';
							jid_descr = jid_descr+'var '+jidbatterie+' = require(\'string\');\n';
							//jid_descr = jid_descr+'var '+jidradio+' = require(\'string\');\n';
						//jid_file = jid_file+'\t'+jid+' = 42;\t//'+periph_jeedom+';\n';
							jid_file = jid_file+'\t\t'+jidnoise+' = 42;\t//'+periph_jeedom+';\n';
							jid_file = jid_file+'\t\t\t'+jidlevel+' = 42;\t//'+periph_jeedom+';\n';
							jid_file = jid_file+'\t\t\t\t'+jidavgwind+' = 42;\t//'+periph_jeedom+';\n';
							jid_file = jid_file+'\t\t\t\t\t'+jiddir+' = 42;\t//'+periph_jeedom+';\n';
							jid_file = jid_file+'\t\t\t\t\t\t'+jidbatterie+' = 84;\t//'+periph_jeedom+';\n';
							//jid_file = jid_file+'\t\t\t\t'+jidradio+' = 88;\t//'+periph_jeedom+';\n';
						periph_file = periph_file+type_eqp+'\t'+periph_jeedom+'\t'+id_eqp+'\tid_'+'\n';

						//Received radio ID (433Mhz Oregon Noise=2494 Level=1.9/5 WGR800 Avg.Wind=0.9m/s Dir.=180° Batt=Ok)
						app_undefined = app_undefined+'			console.log(\" Test de l equipement Wind ' + name_eqp + ', d\'ID Zibase '+id_eqp+' et de type '+type_eqp+'\");\n';
						/*app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidnoise+'+\"&value=\" + noise;\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Niveau de bruit radio (sur anemometre): \" + noise);\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';*/

						/*app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidlevel+'+\"&value=\" + level;\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Niveau de reception radio (sur anemometre): \" + level);\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';*/

						app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidavgwind+'+\"&value=\"+avgwind;\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP wind (sur anemometre): \" + avgwind);\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';

						app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jiddir+'+\"&value=\"+level;\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Direction du vent (sur anemometre): \" + direction);\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';

						app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Batterie (sur anemometre): \" + bat);\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';
						app_undefined = app_undefined+'		}\n';
					}

					//Traitements des sondes de lumiere
					else if (type_eqp == "light")
					{
						console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id : "+ id_eqp);
						console.log("  Ajout dans le script Zidom du test de remontee sur ce transmitter");
						app_undefined = app_undefined+'\n		if (id=="'+id_eqp+'" && dev == "Light/UV")\n'
						app_undefined = app_undefined+'		{\n';
					
						periph_jeedom = S(name_eqp).replaceAll(' ', '_').s;
						periph_jeedom = S(periph_jeedom).replaceAll('/', '_').s;
						periph_jeedom = S(periph_jeedom).replaceAll('\\', '_').s;
						periph_jeedom = S(periph_jeedom).replaceAll('-', '').s;
						periph_jeedom = S(periph_jeedom).replaceAll('.', '_').s;
						periph_jeedom = S(periph_jeedom).replaceAll('?', '').s;
						jid = "j_"+periph_jeedom;
							jidbatterie = "j_"+periph_jeedom+"_batterie";
							//jidradio = "j_"+periph_jeedom+"_radio";
						
						jid_descr = jid_descr+'var '+jid+' = require(\'string\');\n';
							jid_descr = jid_descr+'var '+jidbatterie+' = require(\'string\');\n';
							jid_descr = jid_descr+'var '+jidradio+' = require(\'string\');\n';
						jid_file = jid_file+'\t'+jid+' = 42;\t//'+periph_jeedom+';\n';
							jid_file = jid_file+'\t\t'+jidbatterie+' = 84;\t//'+periph_jeedom+';\n';
							//jid_file = jid_file+'\t\t\t'+jidradio+' = 88;\t//'+periph_jeedom+';\n';
						periph_file = periph_file+type_eqp+'\t'+periph_jeedom+'\t'+id_eqp+'\tid_'+'\n';

						app_undefined = app_undefined+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' et de type '+type_eqp+'\");\n';
						app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=\" + uv;\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP lumiere: \" + uv);\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';

						app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Batterie: \" + bat);\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';
						app_undefined = app_undefined+'		}\n';
					}

					//Traitements des telecommandes
					//else if (type_eqp == "COMMANDE")
					else if (type_eqp == "COMMANDE")
					{
						console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id1 : "+ id1_eqp + " / Id2 : "+ id2_eqp);
						console.log("  Ajout dans le script Zidom du test de remontee sur cette telecommande");
						app_undefined = app_undefined+'\n		if (id=="'+id1_eqp+'")\n'
						app_undefined = app_undefined+'		{\n';


						periph_jeedom = S(name_eqp).replaceAll(' ', '_').s;
						periph_jeedom = S(periph_jeedom).replaceAll('/', '_').s;
						periph_jeedom = S(periph_jeedom).replaceAll('\\', '_').s;
						periph_jeedom = S(periph_jeedom).replaceAll('-', '').s;
						periph_jeedom = S(periph_jeedom).replaceAll('.', '_').s;
						periph_jeedom = S(periph_jeedom).replaceAll('?', '').s;
						jid = "j_"+periph_jeedom;
							jidbatterie = "j_"+periph_jeedom+"_batterie";
							//jidradio = "j_"+periph_jeedom+"_radio";
						
						jid_descr = jid_descr+'var '+jid+' = require(\'string\');\n';
							jid_descr = jid_descr+'var '+jidbatterie+' = require(\'string\');\n';
							jid_descr = jid_descr+'var '+jidradio+' = require(\'string\');\n';
						jid_file = jid_file+'\t'+jid+' = 42;\t//'+periph_jeedom+';\n';
							jid_file = jid_file+'\t\t'+jidbatterie+' = 84;\t//'+periph_jeedom+';\n';
							//jid_file = jid_file+'\t\t\t'+jidradio+' = 88;\t//'+periph_jeedom+';\n';
						periph_file = periph_file+type_eqp+'\t'+periph_jeedom+'\t'+id_eqp+'\tid_'+'\n';

						app_undefined = app_undefined+'			console.log(\" Test de l equipement COMMANDE ' + name_eqp + ', d\'ID Zibase '+id1_eqp+' et de type '+type_eqp+'\");\n';
						app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=1\";\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Telecommande ON : \" + sta);\n';
						//app_undefined = app_undefined+'		request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=1\", function(error, response, body)\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';
						
						app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Batterie Telecommande: \" + bat);\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';
						app_undefined = app_undefined+'		}\n';

						
						app_undefined = app_undefined+'\n		if (id=="'+id2_eqp+'")\n'
						app_undefined = app_undefined+'		{\n';
						
						app_undefined = app_undefined+'			console.log(\" Test de l equipement COMMANDE ' + name_eqp + ', d\'ID Zibase '+id2_eqp+' et de type '+type_eqp+'\");\n';
						app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=1\";\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Telecommande OFF : \" + sta);\n';
						//app_undefined = app_undefined+'		request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=1\", function(error, response, body)\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';
						
						app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Batterie Telecommande: \" + bat);\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';

						app_undefined = app_undefined+'		}\n';
					}
					//else if (type_eqp == "COMMANDE2")
					else if (type_eqp == "COMMANDE2")
					{
						console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id1 : "+ id1_eqp + " / Id2 : "+ id2_eqp);
						console.log("  Ajout dans le script Zidom du test de remontee sur cette telecommande");
						app_undefined = app_undefined+'\n		if (id=="'+id1_eqp+'")\n'
						app_undefined = app_undefined+'		{\n';
					

						periph_jeedom = S(name_eqp).replaceAll(' ', '_').s;
						periph_jeedom = S(periph_jeedom).replaceAll('/', '_').s;
						periph_jeedom = S(periph_jeedom).replaceAll('\\', '_').s;
						periph_jeedom = S(periph_jeedom).replaceAll('-', '').s;
						periph_jeedom = S(periph_jeedom).replaceAll('.', '_').s;
						periph_jeedom = S(periph_jeedom).replaceAll('?', '').s;
						jid = "j_"+periph_jeedom;
							jidbatterie = "j_"+periph_jeedom+"_batterie";
							//jidradio = "j_"+periph_jeedom+"_radio";
						
						jid_descr = jid_descr+'var '+jid+' = require(\'string\');\n';
							jid_descr = jid_descr+'var '+jidbatterie+' = require(\'string\');\n';
							jid_descr = jid_descr+'var '+jidradio+' = require(\'string\');\n';
						jid_file = jid_file+'\t'+jid+' = 42;\t//'+periph_jeedom+';\n';
							jid_file = jid_file+'\t\t'+jidbatterie+' = 84;\t//'+periph_jeedom+';\n';
							//jid_file = jid_file+'\t\t\t'+jidradio+' = 88;\t//'+periph_jeedom+';\n';
						periph_file = periph_file+type_eqp+'\t'+periph_jeedom+'\t'+id_eqp+'\tid_'+'\n';

						app_undefined = app_undefined+'			console.log(\" Test de l equipement COMMANDE ' + name_eqp + ', d\'ID Zibase '+id1_eqp+' et de type '+type_eqp+'\");\n';
						app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=1\";\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Telecommande ON : \" + sta);\n';
						//app_undefined = app_undefined+'		request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=1\", function(error, response, body)\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';
						
						app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Batterie Telecommande: \" + bat);\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';
						app_undefined = app_undefined+'		}\n';
						
						app_undefined = app_undefined+'\n		if (id=="'+id2_eqp+'")\n'
						app_undefined = app_undefined+'		{\n';
						app_undefined = app_undefined+'			console.log(\" Test de l equipement COMMANDE ' + name_eqp + ', d\'ID Zibase '+id2_eqp+' et de type '+type_eqp+'\");\n';
						app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=1\";\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Telecommande OFF : \" + sta);\n';
						//app_undefined = app_undefined+'		request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=1\", function(error, response, body)\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';
						
						app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Batterie Telecommande: \" + bat);\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';
						app_undefined = app_undefined+'		}\n';
					}
					//else if (type_eqp == "COMMANDE4")
					else if (type_eqp == "COMMANDE4")
					{
						console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id1 : "+ id1_eqp + " / Id2 : "+ id2_eqp);
						console.log("  Ajout dans le script Zidom du test de remontee sur cette telecommande");
						app_undefined = app_undefined+'\n		if (id=="'+id1_eqp+'")\n'
						app_undefined = app_undefined+'		{\n';
											

						periph_jeedom = S(name_eqp).replaceAll(' ', '_').s;
						periph_jeedom = S(periph_jeedom).replaceAll('/', '_').s;
						periph_jeedom = S(periph_jeedom).replaceAll('\\', '_').s;
						periph_jeedom = S(periph_jeedom).replaceAll('-', '').s;
						periph_jeedom = S(periph_jeedom).replaceAll('.', '_').s;
						periph_jeedom = S(periph_jeedom).replaceAll('?', '').s;
						jid = "j_"+periph_jeedom;
							jidbatterie = "j_"+periph_jeedom+"_batterie";
							//jidradio = "j_"+periph_jeedom+"_radio";
						
						jid_descr = jid_descr+'var '+jid+' = require(\'string\');\n';
							jid_descr = jid_descr+'var '+jidbatterie+' = require(\'string\');\n';
							//jid_descr = jid_descr+'var '+jidradio+' = require(\'string\');\n';
						jid_file = jid_file+'\t'+jid+' = 42;\t//'+periph_jeedom+';\n';
							jid_file = jid_file+'\t\t'+jidbatterie+' = 84;\t//'+periph_jeedom+';\n';
							//jid_file = jid_file+'\t\t\t'+jidradio+' = 88;\t//'+periph_jeedom+';\n';
						periph_file = periph_file+type_eqp+'\t'+periph_jeedom+'\t'+id_eqp+'\tid_'+'\n';

						app_undefined = app_undefined+'			console.log(\" Test de l equipement COMMANDE ' + name_eqp + ', d\'ID Zibase '+id1_eqp+' et de type '+type_eqp+'\");\n';
						app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=1\";\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Telecommande ON : \" + sta);\n';
						//app_undefined = app_undefined+'		request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=1\", function(error, response, body)\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';
						
						app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Batterie Telecommande: \" + bat);\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';
						app_undefined = app_undefined+'		}\n';

						
						app_undefined = app_undefined+'\n		if (id=="'+id2_eqp+'")\n'
						app_undefined = app_undefined+'		{\n';
						app_undefined = app_undefined+'			console.log(\" Test de l equipement COMMANDE ' + name_eqp + ', d\'ID Zibase '+id2_eqp+' et de type '+type_eqp+'\");\n';
						app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=1\";\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Telecommande OFF : \" + sta);\n';
						//app_undefined = app_undefined+'		request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=1\", function(error, response, body)\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';
						
						app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Batterie Telecommande: \" + bat);\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';
						app_undefined = app_undefined+'		}\n';
					}
					//else if (type_eqp == "transmitter")
					else if (type_eqp == "transmitter")
					{
						console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id : "+ id_eqp);
						console.log("  Ajout dans le script Zidom du test de remontee sur ce transmitter");

						periph_jeedom = S(name_eqp).replaceAll(' ', '_').s;
						periph_jeedom = S(periph_jeedom).replaceAll('/', '_').s;
						periph_jeedom = S(periph_jeedom).replaceAll('\\', '_').s;
						periph_jeedom = S(periph_jeedom).replaceAll('-', '').s;
						periph_jeedom = S(periph_jeedom).replaceAll('.', '_').s;
						periph_jeedom = S(periph_jeedom).replaceAll('?', '').s;

						jid = "j_"+periph_jeedom;
							jidbatterie = "j_"+periph_jeedom+"_batterie";
							jidradio = "j_"+periph_jeedom+"_radio";
						
						jid_descr = jid_descr+'var '+jid+' = require(\'string\');\n';
							jid_descr = jid_descr+'var '+jidbatterie+' = require(\'string\');\n';
							jid_descr = jid_descr+'var '+jidradio+' = require(\'string\');\n';
						jid_file = jid_file+'\t'+jid+' = 42;\t//'+periph_jeedom+';\n';
							jid_file = jid_file+'\t\t'+jidbatterie+' = 84;\t//'+periph_jeedom+';\n';
							jid_file = jid_file+'\t\t\t'+jidradio+' = 88;\t//'+periph_jeedom+';\n';
						periph_file = periph_file+type_eqp+'\t'+periph_jeedom+'\t'+id_eqp+'\tid_'+'\n';
					
						app_undefined = app_undefined+'\n		if (id=="'+id_eqp+'" && sta =="ON")\n'
						app_undefined = app_undefined+'		{\n';
						app_undefined = app_undefined+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' et de type '+type_eqp+'\");\n';
						app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=1\";\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Activation de l\'equipement \");\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n'; 
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';

						app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Batterie: \" + bat);\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';

						app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidradio+'+\"&value=\"+bat;\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Batterie: \" + bat);\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';
						app_undefined = app_undefined+'		}\n';

						app_undefined = app_undefined+'\n		if (id=="'+id_eqp+'" && sta =="OFF")\n'
						app_undefined = app_undefined+'		{\n';
						app_undefined = app_undefined+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' et de type '+type_eqp+'\");\n';
						app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=1\";\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP DESActivation de l\'equipement \");\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n'; 
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';

						app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Batterie: \" + bat);\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';

						app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidradio+'+\"&value=\"+bat;\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Niveau de reception Radio: \" + bat);\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';
						app_undefined = app_undefined+'		}\n';
					}
					//else if (type_eqp == "receiverXDom")
					else if (type_eqp == "receiverXDom")
					{
						console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id : "+ id_eqp);
						console.log("  Ajout dans le script Zidom du test de remontee sur ce receiverXDom");

						periph_jeedom = S(name_eqp).replaceAll(' ', '_').s;
						periph_jeedom = S(periph_jeedom).replaceAll('/', '_').s;
						periph_jeedom = S(periph_jeedom).replaceAll('\\', '_').s;
						periph_jeedom = S(periph_jeedom).replaceAll('-', '').s;
						periph_jeedom = S(periph_jeedom).replaceAll('.', '_').s;
						periph_jeedom = S(periph_jeedom).replaceAll('?', '').s;

						jid = "j_"+periph_jeedom;
							jidbatterie = "j_"+periph_jeedom+"_batterie";
							jidradio = "j_"+periph_jeedom+"_radio";
						
						jid_descr = jid_descr+'var '+jid+' = require(\'string\');\n';
							jid_descr = jid_descr+'var '+jidbatterie+' = require(\'string\');\n';
							jid_descr = jid_descr+'var '+jidradio+' = require(\'string\');\n';
						jid_file = jid_file+'\t'+jid+' = 42;\t//'+periph_jeedom+';\n';
							jid_file = jid_file+'\t\t'+jidbatterie+' = 84;\t//'+periph_jeedom+';\n';
							jid_file = jid_file+'\t\t\t'+jidradio+' = 88;\t//'+periph_jeedom+';\n';
						periph_file = periph_file+type_eqp+'\t'+periph_jeedom+'\t'+id_eqp+'\tid_'+'\n';
					
						app_undefined = app_undefined+'\n		if (id=="'+id_eqp+'" && sta =="ON")\n'
						app_undefined = app_undefined+'		{\n';
						app_undefined = app_undefined+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' et de type '+type_eqp+'\");\n';
						app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=1\";\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Activation de l\'equipement \");\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n'; 
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';

						/*app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Batterie: \" + bat);\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';

						app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidradio+'+\"&value=\"+bat;\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Batterie: \" + bat);\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';*/
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';
						app_undefined = app_undefined+'		}\n';

						app_undefined = app_undefined+'\n		if (id=="'+id_eqp+'" && sta =="OFF")\n'
						app_undefined = app_undefined+'		{\n';
						app_undefined = app_undefined+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' et de type '+type_eqp+'\");\n';
						app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=1\";\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP DESActivation de l\'equipement \");\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n'; 
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';

						/*app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Batterie: \" + bat);\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';

						app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidradio+'+\"&value=\"+bat;\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Niveau de reception Radio: \" + bat);\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';*/
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';
						app_undefined = app_undefined+'		}\n';
					}

					count_periph++;
					bool_periph_added = 1;
				}
				if (bool_periph_added == 0)
				{
					console.log(" Equipement NON AJOUTE (protocole "+proto+").");
					console.log(" Equipement NON AJOUTE : " + name_eqp + ", de type " + type_eqp + " / Id : "+ id_eqp);
				}
			}
			
			//Extraction des scenarii
			//id_scenario = i['$'].id;
			//name_scenario = i.n;
			//if (id_scenario != "0") { console.log("Lignes : " + count + ", nom scenario : " + name_scenario + ", id: " + id_scenario); }
			//if (id_scenario == undefined) { console.log(" UNDEFINED Lignes : " + count + ", nom scenario : " + name_scenario + ", id: " + id_scenario); }
		});
		//console.log("app_script : "+app_script);

		
		console.log("\n------------------------------------------------------------------------------------")
		console.log(" --> Nombre de peripheriques lu dans le fichier XML : "+count_periph);
		console.log(" --> Nombre de ligne lu dans le fichier XML : "+count);
		
		app_script = app_script1+'\n'+
			jid_descr+'\n'+
			jid_file+'\n'+
			app_script2+'\n'+
			app_visionic433+'	}\n'+
			app_visionic868+'	}\n'+
			app_chacon+'	}\n'+
			app_domia+'	}\n'+
			app_rfx10+'	}\n'+
			app_zwave+'	}\n'+
			app_rfs10ts10+'	}\n'+
			app_xdd433alrm+'	}\n'+
			app_xdd868alrm+'	}\n'+
			app_xdd868intershutter+'	}\n'+
			app_xdd868pilotwire+'	}\n'+
			app_xdd868boiler+'	}\n'+
			app_undefined+'	}\n';

		app_script = app_script+'	if (!nb_http_request) { console.log(new Date() + " *** AUCUNE Requete HTTP envoyee a Jeedom ***");}\n';
		app_script = app_script+'});\n';

		app_script = app_script+'server.on(\"listening\", function () {\n';
		app_script = app_script+'  var address = server.address();\n';
		app_script = app_script+'  console.log(\"server listening \" +\n';
		app_script = app_script+'	  address.address + \":\" + address.port);\n';
		app_script = app_script+'});\n';
		app_script = app_script+'\n';
		app_script = app_script+'client.send(b, 0, b.length, 49999, zibaseIp, function(err, bytes) {\n';
		app_script = app_script+'  client.close();\n';
		app_script = app_script+'});\n';
		app_script = app_script+'\n';
		app_script = app_script+'server.bind(0x42CC, clientIp);\n';
		app_script = app_script+'\n';
		app_script = app_script+'\n';
		app_script = app_script+'process.on(\'SIGINT\', function() {\n';
		app_script = app_script+'	console.log(\"Caught interrupt signal\");\n';
		app_script = app_script+'\n';
		app_script = app_script+'	var client = dgram.createSocket(\"udp4\");\n';
		app_script = app_script+'	b.writeUInt16BE(22,4); //command HOST UNREGISTERING (22)\n';
		app_script = app_script+'	console.log(b);\n';
		app_script = app_script+'	client.send(b, 0, b.length, 49999, zibaseIp, function(err, bytes) {\n';
		app_script = app_script+'	  console.log(\"Unregistering...\" , bytes);\n';
		app_script = app_script+'	  setTimeout( function(){\n';
		app_script = app_script+'			  console.log(\"exit\");\n';
		app_script = app_script+'			  client.close();\n';
		app_script = app_script+'			  process.exit()\n';
		app_script = app_script+'		  }, 3000);\n';
		app_script = app_script+'	});\n';
		app_script = app_script+'});\n';
		app_script = app_script+'\n';
		app_script = app_script+'function dot2num(dot) {\n';
		app_script = app_script+'var d = dot.split(\'.\');\n';
		app_script = app_script+'return ((((((+d[0])*256)+(+d[1]))*256)+(+d[2]))*256)+(+d[3]);}\n';
		app_script = app_script+'\n';
		app_script = app_script+'function num2dot(num) {\n';
		app_script = app_script+'var d = num%256;\n';
		app_script = app_script+'for (var i = 3; i > 0; i--) { \n';
		app_script = app_script+'num = Math.floor(num/256);\n';
		app_script = app_script+'d = num%256 + \'.\' + d;}\n';
		app_script = app_script+'return d;}\n';
		app_script = app_script+'\n';
		app_script = app_script+'function getIPAddress() {\n';
		app_script = app_script+'	var interfaces = require(\'os\').networkInterfaces();\n';
		app_script = app_script+'	for (var devName in interfaces) {\n';
		app_script = app_script+'		var iface = interfaces[devName];\n';
		app_script = app_script+'\n';
		app_script = app_script+'		for (var i = 0; i < iface.length; i++) {\n';
		app_script = app_script+'			var alias = iface[i];\n';
		app_script = app_script+'			if (alias.family === \'IPv4\' && alias.address !== \'127.0.0.1\' && !alias.internal)\n';
		app_script = app_script+'				return alias.address;\n';
		app_script = app_script+'		}\n';
		app_script = app_script+'	}\n';
		app_script = app_script+'\n';
		app_script = app_script+'	return \'0.0.0.0\';\n';
		app_script = app_script+'}\n';

		console.log("------------------------------------------------------------------------------------")
		console.log(" Debut d'Ecriture dans le fichier zidomn10.js ...");
		fs.writeFileSync("zidomn10.js", app_script, "utf8");
		//readFileSync_encoding2("zidomn10-2.js", "UTF-8", app_script);
		//readFileSync_encoding("zidomn10-2.js", "UTF-8", app_script);
		console.log(" Fin d'Ecriture dans le fichier zidomn10.js !")
		console.log("------------------------------------------------------------------------------------")
		console.log(" Debut d'Ecriture dans le fichier jeedom_id_steph.txt ...");
		fs.writeFileSync("jeedom_id.txt", jid_file, "utf8");
		//readFileSync_encoding("jeedom_id.txt", "UTF-8", app_script);
		console.log(" Fin d'Ecriture dans le fichier jeedom_id.txt !")
		console.log("------------------------------------------------------------------------------------")
		/*console.log(" Debut d'Ecriture dans le fichier de DEBUG ZWAVE debug_zwave.txt ...");
		fs.writeFileSync("debug_zwave.txt", debug_zwave, "UTF-8");
		console.log(" Fin d'Ecriture dans le fichier de DEBUG debug_zwave.txt !")
		console.log("------------------------------------------------------------------------------------")*/
	});
});

/*function readFileSync_encoding(filename, encoding) {
    var content = fs.readFileSync(filename);
    return iconvlite.decode(content, encoding);
}

function readFileSync_encoding2(filename, encoding, contenu) {
    var content = fs.readFileSync(filename, contenu);
    var iconv = new Iconv(encoding, 'UTF-8');
    var buffer = iconv.convert(content);
    return buffer.toString('utf8');
}*/

process.on('SIGINT', function() {
	console.log("Caught interrupt signal");

	var client = dgram.createSocket("udp4");
	b.writeUInt16BE(22,4); //command HOST UNREGISTERING (22)
	console.log(b);
	client.send(b, 0, b.length, 49999, zibaseIp, function(err, bytes) {
	  console.log("Unregistering..." , bytes);
	  setTimeout( function(){
			  console.log("exit");
			  client.close();
			  process.exit()
		  }, 3000);
	});
});


function dot2num(dot) {
var d = dot.split('.');
return ((((((+d[0])*256)+(+d[1]))*256)+(+d[2]))*256)+(+d[3]);}

function num2dot(num) {
var d = num%256;
for (var i = 3; i > 0; i--) { 
num = Math.floor(num/256);
d = num%256 + '.' + d;}
return d;}

function getIPAddress() {
	var interfaces = require('os').networkInterfaces();
	for (var devName in interfaces) {
		var iface = interfaces[devName];

		for (var i = 0; i < iface.length; i++) {
			var alias = iface[i];
			if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
				return alias.address;
		}
	}

	return '0.0.0.0';
}

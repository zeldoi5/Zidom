// A remplir :
var zibase_ip = "192.168.0.X";
var zibase_device = "";
var zibase_token = "";
var jeedom_ip = "192.168.0.X";
var jeedom_api = "";
var jeedom_chemin_install    = "/jeedom/core/api/jeeApi.php?api=";
var jeedom_chemin_preinstall = "/core/api/jeeApi.php?api=";
var jeedom_chemin = jeedom_chemin_install; // ou jeedom_chemin = jeedom_chemin_preinstall; si jeedom a ete preinstallee

//on ne touche plus rien après ceci
var zibaseIp = process.env.IP_ZIBASE|| zibase_ip;
var clientIp = process.env.MYIP || getIPAddress();

var zibase_url = require('string');
var util = require("util");
//var Iconv = require('iconv').Iconv;
//var iconvlite = require('iconv-lite');
var fs = require("fs");
//var jsonrpc = require('json-rpc2');

zibase_url = "http://zibase.net/m/get_xml.php?device="+zibase_device+"&token="+zibase_token;

var S = require('string');
var request = require("request");
var dgram = require("dgram");
var server = dgram.createSocket("udp4");
var client = dgram.createSocket("udp4");

var periph_file = "";	// Variable temporaire pour stocker en fichier les peripheriques
var periph_jeedom = "";	// Variable temporaire pour stocker les noms des peripheriques
var jid = "";	// Variable des identifiants de base Jeedom
var jidhygro = "";	// Variable des identifiants Jeedom pour les remontees d'hygrometrie
var jidbatterie = "";	// Variable des identifiants Jeedom pour les remontees de batterie
var jidcmd = "";	// Variable des identifiants Jeedom pour les remontees de commande (X2D)
var jidradio = "";	// Variable des identifiants Jeedom pour les remontees de reception radio
var jidpowerstatus = "";	// Variable des identifiants Jeedom pour les remontees de Statut sur les equipements de type Power
var jidpowertotal = "";	// Variable des identifiants Jeedom pour les remontees 'Total Energy' sur les equipements de type Power
var jidpowerpower = "";	// Variable des identifiants Jeedom pour les remontees 'Power' sur les equipements de type Power
var jidnoise = "";	// Variable des identifiants Jeedom pour les remontees de bruit radio de Anémomètre et Pluviomètre Oregon
var jidavgwind = "";	// Variable des identifiants Jeedom pour les remontees de vitesse de vent de Anémomètre Oregon
var jiddir = "";	// Variable des identifiants Jeedom pour les remontees de direction du vent de Anémomètre Oregon
var jidtotalrain = "";	// Variable des identifiants Jeedom pour les remontees de Pluviomètre Oregon
var jidcurrentrain = "";	// Variable des identifiants Jeedom pour les remontees de direction du vent de Pluviomètre Oregon
var jid_descr = "";	// Variable temporaire de declaration des identifiants Jeedom et d'initialisation à 0
var jid_file = "";	// Variable temporaire pour stocker en fichier les identifiants Jeedom
var jid_script_file = "";	//Variable temporaire pour stocker en fichier les scripts cibles dans Jeedom

var generate_zidom_script = "";
var declare_zidom = "";
var test_zidom = "";
var script_zidom = "";
count_periph = 0;
// Variable qui enregistre le script final
// Initialisation du script final dans la variable generate_zidom_script :

declare_zidom = declare_zidom+'\n\n// ****************************************************************************************************************** \n';
declare_zidom = declare_zidom+'// *****************   Script de lecture de suivi d\'activite de Zibase, et d\'alimentation de Jeedom   ***************** \n';
declare_zidom = declare_zidom+'// *****************   Zeldoi5                                                                          ***************** \n';
declare_zidom = declare_zidom+'// *****************   merci de remplir les variables :                                                 ***************** \n';
declare_zidom = declare_zidom+'// *****************   - zibase_ip                                                             	       ***************** \n';
declare_zidom = declare_zidom+'// *****************   - zibase_device                                                                  ***************** \n';
declare_zidom = declare_zidom+'// *****************   - zibase_token                                                                   ***************** \n';
declare_zidom = declare_zidom+'// *****************   - zibase_device                                                                  ***************** \n';
declare_zidom = declare_zidom+'// *****************   - jeedom_ip                                                                      ***************** \n';
declare_zidom = declare_zidom+'// *****************   - jeedom_api                                                                     ***************** \n';
declare_zidom = declare_zidom+'// ********************************************************************************************************************** \n';

declare_zidom = declare_zidom+'// XML URL : '+zibase_url+' \n';

/*
 Connect to HTTP server

var client = rpc.Client.$create('localhost/core/api/jeeApi/core/api/jeeApi.php?apikey='+jeedom_api);

client.call('object::all', [], function (err, result){
  if (err) {
    return printError(err);
  }
  console.log('  1 + 2 = ' + result + ' (http)');
});

function printError(err){
  console.error('RPC Error: ' + err.toString());
} */

declare_zidom = declare_zidom+'var clientIp = process.env.MYIP || getIPAddress();\n';
declare_zidom = declare_zidom+'var zibaseIp = process.env.IP_ZIBASE|| "'+zibase_ip+'";\n';
declare_zidom = declare_zidom+'var S = require(\'string\');\n';

declare_zidom = declare_zidom+'var debug_http_request = \'\';\n';
declare_zidom = declare_zidom+'var request = require(\"request\");\n';
declare_zidom = declare_zidom+'var dgram = require(\"dgram\");\n';
declare_zidom = declare_zidom+'var server = dgram.createSocket(\"udp4\");\n';
declare_zidom = declare_zidom+'var client = dgram.createSocket(\"udp4\");\n';
declare_zidom = declare_zidom+'var nowseconds = require(\"util\");\n';
declare_zidom = declare_zidom+'//var nowseconds = new Date(milliseconds);\n\n';

declare_zidom = declare_zidom+'var fs = require("fs");\n';

test_zidom = test_zidom+'var expr,chacon,oregon,zwave,temp_web = \'\';\n';
test_zidom = test_zidom+'var zibase_device, zibase_token = \'\';\n\n';
test_zidom = test_zidom+'var owl_id, owl_status = \'\';\n\n';

test_zidom = test_zidom+'var b = new Buffer(70);b.fill(0);b.write(\'ZSIG\0\', 0/*offset*/);\n';
test_zidom = test_zidom+'b.writeUInt16BE(13,4); //command HOST REGISTERING (13)\n';
test_zidom = test_zidom+'b.writeUInt32BE(dot2num(clientIp), 50);\n';
test_zidom = test_zidom+'b.writeUInt32BE(0x42CC, 54); // port 17100 0x42CC\n\n';

test_zidom = test_zidom+'chacon = false;\n';
test_zidom = test_zidom+'oregon = false;\n';
test_zidom = test_zidom+'oregon_prev_receive = 0;\n';
test_zidom = test_zidom+'inter_time_oregon = 250000;\n';
test_zidom = test_zidom+'oregon_prev = "true";\n';
test_zidom = test_zidom+'zwave = false;\n';
test_zidom = test_zidom+'temp_web = false;\n\n';

test_zidom = test_zidom+'console.log(b);\n';
test_zidom = test_zidom+'console.log(b.toString(\'hex\', 0, b.length));\n\n';

test_zidom = test_zidom+'var parseString = require(\'xml2js\').parseString;\n';
test_zidom = test_zidom+'server.on("error", function (err) {\n';
test_zidom = test_zidom+'  console.log("server error : " + err.stack);\n';
test_zidom = test_zidom+'  server.close();\n';
test_zidom = test_zidom+'});\n';
test_zidom = test_zidom+'server.on("message", function (msg, rinfo) {\n';
test_zidom = test_zidom+'	//Booleen de generation de requete HTTP\n';
test_zidom = test_zidom+'	nb_http_request = 0;\n';
test_zidom = test_zidom+'\n';
test_zidom = test_zidom+'	//Tests des remontees de sondes de temperature/hygrometrie OREGON via les balises id/tem/hum\n';
test_zidom = test_zidom+'	id 		= S(msg).between(\'<id>\', \'</id>\').s;\n';
test_zidom = test_zidom+'	tem 	= S(msg).between(\'<tem>\', \'</tem>\').s;\n';
test_zidom = test_zidom+'	hum 	= S(msg).between(\'<hum>\', \'</hum>\').s;\n';
test_zidom = test_zidom+'	rf 		= S(msg).between(\'<rf>\', \'</rf>\').s;\n';
test_zidom = test_zidom+'	//Remontee de l\'etat de la batterie\n';
test_zidom = test_zidom+'	if (S(msg).include(\'Batt=<bat>\')) {	bat 	= S(msg).between(\'<bat>\', \'</bat>\');}\n';
test_zidom = test_zidom+'	else  bat 	= S(msg).between(\'Batt=\', \')\').s;\n';
//test_zidom = test_zidom+'	bat 	= S(msg).between(\'<bat>\', \'</bat>\').s;\n';
//test_zidom = test_zidom+'	bat2 	= S(msg).between(\'Batt=\', \')\').s;\n';
test_zidom = test_zidom+'	if ((bat == "OK" || bat == "ok" || bat == "Ok")) { bat_bool = 1;}\n';
test_zidom = test_zidom+'	else { bat_bool = 0}\n';
test_zidom = test_zidom+'	dev 	= S(msg).between(\'<dev>\', \'</dev>\').s;\n';
test_zidom = test_zidom+'	//Remontee des consommations\n';
test_zidom = test_zidom+'	kwh 	= S(msg).between(\'<kwh>\', \'</kwh>\').s;\n';
test_zidom = test_zidom+'	w 		= S(msg).between(\'<w>\', \'</w>\').s;\n';
test_zidom = test_zidom+'	//Remontee des classes : ex. Class=0x<cla>30</cla>\n';
test_zidom = test_zidom+'	cla 	= S(msg).between(\'<cla>\', \'</cla>\').s;\n';
test_zidom = test_zidom+'	//Remontee des op : ex. Op=0x<op>03</op>\n';
test_zidom = test_zidom+'	op 		= S(msg).between(\'<op>\', \'</op>\').s;\n';
test_zidom = test_zidom+'	//Remontee des channels de communications : ex. Ch=<ch>0</ch>\n';
test_zidom = test_zidom+'	ch 		= S(msg).between(\'<ch>\', \'</ch>\').s;\n';
test_zidom = test_zidom+'	//Remontee des type de mesure : ex. <uv>Light/UV</uv>\n';
test_zidom = test_zidom+'	uv 		= S(msg).between(\'<uv>\', \'</uv>\').s;\n';
test_zidom = test_zidom+'	//Remontee des niveaux de mesure : ex. Level=<uvl>2</uvl>\n';
test_zidom = test_zidom+'	uvl 	= S(msg).between(\'<uvl>\', \'</uvl>\').s;\n';
test_zidom = test_zidom+'	lev 	= S(msg).between(\'<lev>\', \'</lev>\').s;\n';
test_zidom = test_zidom+'	//Remontee du bruit de mesure : ex. Noise=<noise>0</noise>\n';
test_zidom = test_zidom+'	if (S(msg).include(\'Noise=<noise>\')) {	noise 	= S(msg).between(\'<noise>\', \'</noise>\');}\n';
test_zidom = test_zidom+'	else  if (S(msg).include(\'Noise\')) {	noise 	= S(msg).between(\'Noise=\', \' \').s;}\n';
//test_zidom = test_zidom+'	noise 	= S(msg).between(\'<noise>\', \'</noise>\').s;\n';
//test_zidom = test_zidom+'	noise 	= S(msg).between(\'Noise=\', \' \').s;\n';
test_zidom = test_zidom+'	//Remontee du level : ex. Level=<lev>2.0</lev>/5 ou Level=1.9/5\n';
test_zidom = test_zidom+'	if (S(msg).include(\'Level=<lev>\')) {	level 	= S(msg).between(\'<level>\', \'</level>\');}\n';
test_zidom = test_zidom+'	else  level 	= S(msg).between(\'Level=\', \' \').s;\n';
//test_zidom = test_zidom+'	level 	= S(msg).between(\'Level=\', \' \').s;\n';
test_zidom = test_zidom+'	//Remontee du sta (status?) : ex. <sta>ON</sta> ou <sta>OFF</sta>\n';
test_zidom = test_zidom+'	if (S(msg).include(\'<sta>\')) {	sta 	= S(msg).between(\'<sta>\', \'</sta>\');}\n';
test_zidom = test_zidom+'	else  if (S(msg).include(\'OFF\') && !S(msg).include(\'ON\')) {	sta 	= "OFF";}\n';
test_zidom = test_zidom+'	else  if (!S(msg).include(\'OFF\') && !S(msg).include(\'<sta>\') && !S(msg).include(\'ON\')) {	sta 	= "ON";};\n';
test_zidom = test_zidom+'	//Remontee de l\'anemometre : ex. Received radio ID (433Mhz Oregon Noise=2494 Level=1.9/5 WGR800 Avg.Wind=0.9m/s Dir.=180° Batt=Ok)\n';
test_zidom = test_zidom+'	//Remontee de l\'anemometre :Received radio ID (<rf>433Mhz Oregon</rf> Noise=<noise>2524</noise> Level=<lev>2.0</lev>/5 <dev>WGR800</dev> Avg.Wind=<awi>1.5</awi>m/s Dir.=<drt>180</drt>Â° Batt=<bat>Ok</bat>): <id>OS445251072</id>\n';
test_zidom = test_zidom+'	if (S(msg).include(\'</awi>m/s\')) {	avgwind 	= S(msg).between(\'<awi>\', \'</awi>\');}\n';
test_zidom = test_zidom+'	else  avgwind 	= S(msg).between(\'Avg.Wind=\', \' \').s;\n';
test_zidom = test_zidom+'	if (S(msg).include(\'Dir.=<drt>\')) {	direction 	= S(msg).between(\'<drt>\', \'</drt>\');}\n';
test_zidom = test_zidom+'	else  direction 	= S(msg).between(\'Dir.=\', \' \').s;\n';
test_zidom = test_zidom+'	//avgwind 	= S(msg).between(\'Avg.Wind=\', \' \').s;\n';
test_zidom = test_zidom+'	//direction 	= S(msg).between(\'Dir.=\', \' \').s;\n';

test_zidom = test_zidom+'	//Remontee du pluviometre : Received radio ID (<rf>433Mhz Oregon</rf> Noise=<noise>2472</noise> Level=<lev>5.0</lev>/5 <dev>PCR800</dev> Total Rain=<tra>44</tra>mm Current Rain=<cra>0</cra>mm/hour Batt=<bat>Ok</bat>): <id>OS706331648</id>\n';
//test_zidom = test_zidom+'	//Remontee du pluviometre : Received radio ID (<rf>433Mhz Oregon</rf> Noise=<noise>2486</noise> Level=<lev>5.0</lev>/5 <dev>PCR800</dev> Total Rain=<tra>44</tra>mm Current Rain=<cra>0</cra>mm/hour Batt=<bat>Ok</bat>): <id>OS706331648</id>\n';
//test_zidom = test_zidom+'	if (S(msg).include(\'</awi>m/s\')) {	totalrain 	= S(msg).between(\'<awi>\', \'</awi>\');}\n';
//test_zidom = test_zidom+'	else  totalrain 	= S(msg).between(\'Avg.Wind=\', \' \').s;\n';
//test_zidom = test_zidom+'	if (S(msg).include(\'Dir.=<drt>\')) {	currentrain 	= S(msg).between(\'<drt>\', \'</drt>\');}\n';
//test_zidom = test_zidom+'	else  currentrain 	= S(msg).between(\'Dir.=\', \' \').s;\n';
test_zidom = test_zidom+'	totalrain	= S(msg).between(\'<tra>\', \'</tra>\').s;\n';
test_zidom = test_zidom+'	currentrain	= S(msg).between(\'<cra>\', \'</cra>\').s;\n';

test_zidom = test_zidom+'\n';
test_zidom = test_zidom+'	console.log("--------------------------------------------------------------------------------------")\n';
test_zidom = test_zidom+'\n';
test_zidom = test_zidom+'	console.log(new Date() + " " + msg.slice(70));\n';
test_zidom = test_zidom+'';

test_zidom = test_zidom+'	debug_http_request = "yes";	//Variable à initialiser à "no" pour désactiver les reponses des requêtes HTTP\n';
test_zidom = test_zidom+'	visionic433 = S(msg).include(\'VISONIC433\');\n';
test_zidom = test_zidom+'		visionic433_id = "";\n';
test_zidom = test_zidom+'		visionic433_status = "";\n';
test_zidom = test_zidom+'	visionic868 = S(msg).include(\'VISONIC868\');\n';
test_zidom = test_zidom+'		visionic868_id = "";\n';
test_zidom = test_zidom+'		visionic868_status = "";\n';
test_zidom = test_zidom+'	chacon = S(msg).include(\'Chacon\');\n';
test_zidom = test_zidom+'		chacon_status = "";\n';
test_zidom = test_zidom+'	domia = S(msg).include(\'DOMIA\') || S(msg).include(\'Domia\');\n';
test_zidom = test_zidom+'		domia_status = "";\n';
test_zidom = test_zidom+'	rfx10 = S(msg).include(\'X10\');\n';
test_zidom = test_zidom+'		rfx10_status = "";\n';
test_zidom = test_zidom+'	zwave = S(msg).include(\'ZWAVE\')||S(msg).include(\'ZWave\');\n';
test_zidom = test_zidom+'		zwave_id = "";\n';
test_zidom = test_zidom+'		zwave_status = "";\n';
test_zidom = test_zidom+'		zwave = S(msg).include(\'ZWAVE\')||S(msg).include(\'ZWave\');\n';
test_zidom = test_zidom+'		zwave_id = "";\n';
test_zidom = test_zidom+'		zwave_status = "";\n';
test_zidom = test_zidom+'	rfs10ts10 = S(msg).include(\'RFS10/TS10\');\n';
test_zidom = test_zidom+'		rfs10ts10_status = "";\n';
test_zidom = test_zidom+'	xdd433alrm = S(msg).include(\'XDD433 alrm\');\n';
test_zidom = test_zidom+'		xdd433alrm_status = "";\n';
test_zidom = test_zidom+'	xdd868alrm = S(msg).include(\'XDD868 alrm\');\n';
test_zidom = test_zidom+'		xdd868alrm_status = "";\n';
test_zidom = test_zidom+'	xdd868intershutter = S(msg).include(\'Inter/shutter RFY433\');\n';
test_zidom = test_zidom+'		xdd868intershutter_status = "";\n';
test_zidom = test_zidom+'	xdd868pilotwire = S(msg).include(\'XDD868 Radiator/Pilot Wire\');\n';
test_zidom = test_zidom+'		xdd868pilotwire_id = "";\n';
test_zidom = test_zidom+'		xdd868pilotwire_status = "";\n';
test_zidom = test_zidom+'		xdd868pilotwire_cmd = "";\n';
test_zidom = test_zidom+'	xdd868boiler = S(msg).include(\'XDD868Boiler\');\n';
test_zidom = test_zidom+'		xdd868boiler_status = "";\n';
test_zidom = test_zidom+'	owl = S(msg).include(\'433Mhz OWL\');\n';
test_zidom = test_zidom+'		owl_id = "";\n';
test_zidom = test_zidom+'		owl_status = "";\n';

test_zidom = test_zidom+'\n	//Test de demarrage de script :\n';
test_zidom = test_zidom+'	if (S(msg).include(\'Zapi linked to host\'))\n';
test_zidom = test_zidom+'	{\n';
test_zidom = test_zidom+'	    demmarrage = true\n';
test_zidom = test_zidom+'		console.log(" Demarrage du script Zidomn.js");';
test_zidom = test_zidom+'	    nb_http_request++;\n';
test_zidom = test_zidom+'	}\n';

test_zidom = test_zidom+'\n	//Test de remontees de PROTOCOLE 1 : composants VISION433 :\n';
test_zidom = test_zidom+'\n	//Received radio ID \n';
test_zidom = test_zidom+'\n	//Received radio ID \n';
test_zidom = test_zidom+'	if (S(msg).include(\'<rf>433Mhz </rf>\') && S(msg).include(\'<id>VS\'))\n';
test_zidom = test_zidom+'	{\n';
test_zidom = test_zidom+'		visionic433_status = "UNKNOWN";\n';
test_zidom = test_zidom+'	    visionic433_id  = "VS"+S(msg).between("<id>VS", \'</id>\').s;\n';
test_zidom = test_zidom+'		visionic433 = true;\n';
test_zidom = test_zidom+'		if (S(msg).include(\'>Alive</flag\') && !S(msg).include(\'>Alarm</flag\'))\n';
test_zidom = test_zidom+'		{\n			 visionic433_status = "Alive";\n		}\n';
test_zidom = test_zidom+'		else if (!S(msg).include(\'>Alive</flag\') && S(msg).include(\'>Alarm</flag\'))\n';
test_zidom = test_zidom+'		{\n			 visionic433_status = "Alarm";\n		}\n';
test_zidom = test_zidom+'		else  visionic433_status = "UNKNOWN";\n';
test_zidom = test_zidom+'		console.log("Debug : visionic433    : " + visionic433 + " | Composant/Id " + visionic433_id + " | Statut " + visionic433_status);\n';
test_zidom = test_zidom+'	}\n';

test_zidom = test_zidom+'\n	//Test de remontees de PROTOCOLE 2 : composants VISION868 :\n';
test_zidom = test_zidom+'\n	//Received radio ID (<rf>868Mhz </rf> Noise=<noise>2163</noise> Level=<lev>5.0</lev>/5  <dev>Remote Control</dev>  Flags= <flag3>Alive</flag3>  Batt=<bat>Ok</bat>): <id>VS3549221672</id> \n';
test_zidom = test_zidom+'\n	//Received radio ID (<rf>868Mhz </rf> Noise=<noise>2173</noise> Level=<lev>5.0</lev>/5  <dev>Remote Control</dev>  Flags= <flag1>Alarm</flag1>  Batt=<bat>Ok</bat>): <id>VS381936674</id>  \n';
test_zidom = test_zidom+'	if (S(msg).include(\'<rf>868Mhz </rf>\') && S(msg).include(\'<id>VS\'))\n';
test_zidom = test_zidom+'	{\n';
test_zidom = test_zidom+'		visionic868_status = "UNKNOWN";\n';
test_zidom = test_zidom+'	    visionic868_id  = "VS"+S(msg).between("<id>VS", \'</id>\').s;\n';
test_zidom = test_zidom+'		visionic868 = true;\n';
test_zidom = test_zidom+'		if (S(msg).include(\'>Alive</flag\') && !S(msg).include(\'>Alarm</flag\'))\n';
test_zidom = test_zidom+'		{\n			 visionic868_status = "Alive";\n		}\n';
test_zidom = test_zidom+'		else if (!S(msg).include(\'>Alive</flag\') && S(msg).include(\'>Alarm</flag\'))\n';
test_zidom = test_zidom+'		{\n			 visionic868_status = "Alarm";\n		}\n';
test_zidom = test_zidom+'		else  visionic868_status = "UNKNOWN";\n';
test_zidom = test_zidom+'		console.log("Debug : visionic868    : " + visionic868 + " | Composant/Id " + visionic868_id + " | Statut " + visionic868_status);\n';
test_zidom = test_zidom+'	}\n';

test_zidom = test_zidom+'\n	//Test de remontees de PROTOCOLE 3 : composants Chacon : 	Sent radio ID (1 Burst(s), Protocols=\'Chacon\' ): A1_OFF\n';
test_zidom = test_zidom+'	if (S(msg).include(\'Chacon\'))\n';
test_zidom = test_zidom+'	{\n';
test_zidom = test_zidom+'	    chacon_id = S(msg).between("Chacon\' ): ", \'_\').s;\n';
test_zidom = test_zidom+'		chacon = true;\n';
test_zidom = test_zidom+'		if (S(msg).include(\'_ON\'))\n';
test_zidom = test_zidom+'		{\n			 chacon_status = "ON";\n		}\n';
test_zidom = test_zidom+'		else if (S(msg).include(\'_OFF\'))\n';
test_zidom = test_zidom+'		{\n			 chacon_status = "OFF";\n		}\n';
test_zidom = test_zidom+'		console.log("Debug : chacon    : " + chacon + " | Composant/Id " + chacon_id + " | Statut " + chacon_status);\n';
test_zidom = test_zidom+'	}\n';

test_zidom = test_zidom+'\n	//Test de remontees de PROTOCOLE 4 : composants DOMIA : 	Sent radio ID (1 Burst(s), Protocols=\'Domia\' ): M13_ON\n';
test_zidom = test_zidom+'	if (S(msg).include(\'DOMIA\'))\n';
test_zidom = test_zidom+'	{\n';
test_zidom = test_zidom+'	    domia_id  = S(msg).between("Domia\' ): ", \'_\').s;\n';
test_zidom = test_zidom+'		domia = true;\n';
test_zidom = test_zidom+'		if (S(msg).include(\'_ON\'))\n';
test_zidom = test_zidom+'		{\n			 domia_status = "ON";\n		}\n';
test_zidom = test_zidom+'		else if (S(msg).include(\'_OFF\'))\n';
test_zidom = test_zidom+'		{\n			 domia_status = "OFF";\n		}\n';
test_zidom = test_zidom+'		console.log("Debug : domia    : " + domia + " | Composant/Id " + domia_id + " | Statut " + domia_status);\n';
test_zidom = test_zidom+'	}\n';

test_zidom = test_zidom+'\n	//Test de remontees de PROTOCOLE 5 : composants RF X10\n';
test_zidom = test_zidom+'	if (S(msg).include(\'X10\'))\n';
test_zidom = test_zidom+'	{\n';
test_zidom = test_zidom+'	    rfx10_id  = S(msg).between("X10\' ): ", \'_\').s;\n';
test_zidom = test_zidom+'		rfx10 = true;\n';
test_zidom = test_zidom+'		if (S(msg).include(\'_ON\'))\n';
test_zidom = test_zidom+'		{\n			 rfx10_status = "ON";\n		}\n';
test_zidom = test_zidom+'		else if (S(msg).include(\'_OFF\'))\n';
test_zidom = test_zidom+'		{\n			 rfx10_status = "OFF";\n		}\n';
test_zidom = test_zidom+'		console.log("Debug : rfx10    : " + rfx10 + " | Composant/Id " + rfx10_id + " | Statut " + rfx10_status);\n';
test_zidom = test_zidom+'	}\n';

test_zidom = test_zidom+'\n	//Test de remontees de PROTOCOLE 6 : composants ZWAVE (ou ZWave)\n';
test_zidom = test_zidom+'	if (S(msg).include(\'ZWAVE\')||S(msg).include(\'ZWave\'))\n';
test_zidom = test_zidom+'	{\n';
//test_zidom = test_zidom+'	\tdebug_zwave = debug_zwave + S(msg);\n';
test_zidom = test_zidom+'		zwave = true;\n';
test_zidom = test_zidom+'		//Test pour identifier le statut du composant ZWAVE';
/*		//Test pour identifier le statut du composant ZWAVE		//Thu Aug 14 2014 23:03:59 GMT+0100 (BST) Sent radio ID (1 Burst(s), Protocols='ZWave n38'  Last RF Transmit Time=20ms): ZC7_ON
		//Thu Aug 14 2014 23:04:47 GMT+0100 (BST) Sent radio ID (1 Burst(s), Protocols='ZWave n38'  Last RF Transmit Time=10ms): ZC7_OFF
		//Thu Aug 14 2014 23:01:07 GMT+0100 (BST) Received radio ID (<rf>ZWAVE ZC5</rf> <dev>Low-Power Measure</dev> Total Energy=<kwh>1.0</kwh>kWh Power=<w>00</w>W Batt=<bat>Ok</bat>): <id>PZC6</id>
		//Thu Aug 14 2014 23:33:06 GMT+0100 (BST) Received radio ID (<rf>ZWAVE ZC6</rf> <dev>WakeUp</dev> Batt=<bat>Ok</bat>): <id>WZC4</id>
		//Tue Oct 21 2014 05:47:06 GMT+0200 (CEST) ZWave message - Coming from Device ZA3 Battery level=80%*/
test_zidom = test_zidom+'\n';
test_zidom = test_zidom+'		//Tue Oct 21 2014 05:47:06 GMT+0200 (CEST) ZWave message - Coming from Device ZA3 Battery level=80%\n';
test_zidom = test_zidom+'		if (\n	            S(msg).include(\'ZWave\') \n';
test_zidom = test_zidom+'\t		&&  S(msg).include(\'Battery level\')\n';
test_zidom = test_zidom+'\t		&& !S(msg).include(\'ZWAVE\')\n';
test_zidom = test_zidom+'\t 		&& !S(msg).include(\'_ON\')\n';
test_zidom = test_zidom+'\t		&& !S(msg).include(\'_OFF\')\n';
test_zidom = test_zidom+'\t		&& !S(msg).include(\'Power Measure\')\n';
test_zidom = test_zidom+'\t		&& !S(msg).include(\'<dev>WakeUp\'))\n';
test_zidom = test_zidom+'		{\n';
test_zidom = test_zidom+'			zwave_message = true;\n';
test_zidom = test_zidom+'			zwave_id= S(msg).between(\'Device \', \' Battery level\').s;\n';
test_zidom = test_zidom+'			bat 	= S(msg).between(\'level=\', \'%\').s;\n';
test_zidom = test_zidom+'		}\n';
test_zidom = test_zidom+'		//Thu Aug 14 2014 23:04:47 GMT+0100 (BST) Sent radio ID (1 Burst(s), Protocols=\'ZWave n38\'  Last RF Transmit Time=10ms): ZC7_ON\n';
test_zidom = test_zidom+'		else if (\n			    S(msg).include(\'ZWave\') \n';
test_zidom = test_zidom+'\t		&& !S(msg).include(\'Battery level\')\n';
test_zidom = test_zidom+'\t		&& !S(msg).include(\'ZWAVE\')\n';
test_zidom = test_zidom+'\t 		&&  S(msg).include(\'_ON\')\n';
test_zidom = test_zidom+'\t		&& !S(msg).include(\'_OFF\')\n';
test_zidom = test_zidom+'\t		&& !S(msg).include(\'Power Measure\')\n';
test_zidom = test_zidom+'\t		&& !S(msg).include(\'<dev>WakeUp\'))\n';
test_zidom = test_zidom+'		{\n';
test_zidom = test_zidom+'			zwave_message = true;\n';
test_zidom = test_zidom+'			zwave_id= S(msg).between(\'): \', \'_ON\').s;\n';
test_zidom = test_zidom+'			zwave_status = "ON";\n';
test_zidom = test_zidom+'			if (!S(msg).include(\'Battery\')) { bat = "Ok"; }\n';
test_zidom = test_zidom+'		}\n';
test_zidom = test_zidom+'		//Thu Aug 14 2014 23:04:47 GMT+0100 (BST) Sent radio ID (1 Burst(s), Protocols=\'ZWave n38\'  Last RF Transmit Time=10ms): ZC7_OFF\n';
test_zidom = test_zidom+'		else if (\n			    S(msg).include(\'ZWave\') \n';
test_zidom = test_zidom+'\t		&& !S(msg).include(\'Battery level\')\n';
test_zidom = test_zidom+'\t		&& !S(msg).include(\'ZWAVE\')\n';
test_zidom = test_zidom+'\t 		&& !S(msg).include(\'_ON\')\n';
test_zidom = test_zidom+'\t		&&  S(msg).include(\'_OFF\')\n';
test_zidom = test_zidom+'\t		&& !S(msg).include(\'Power Measure\')\n';
test_zidom = test_zidom+'\t		&& !S(msg).include(\'<dev>WakeUp\'))\n';
test_zidom = test_zidom+'		{\n';
test_zidom = test_zidom+'			zwave_message = true;\n';
test_zidom = test_zidom+'			zwave_id= S(msg).between(\'): \', \'_OFF\').s;\n';
test_zidom = test_zidom+'			zwave_status = "OFF";\n';
test_zidom = test_zidom+'			if (!S(msg).include(\'Battery\')) { bat = "Ok"; }\n';
test_zidom = test_zidom+'		}\n';
test_zidom = test_zidom+'		//Tue Aug 19 2014 19:52:59 GMT+0100  (BST) Received radio ID (<rf>ZWAVE ZC7</rf>  <dev>CMD/INTER</dev>  Batt=<bat>Ok</bat>): <id>ZC7_ON</id>\n';
test_zidom = test_zidom+'		//Fri Oct 24 2014 19:40:24 GMT+0200 (CEST) Received radio ID (<rf>ZWAVE ZB3</rf>  <dev>CMD/INTER</dev>  Batt=<bat>Ok</bat>): <id>ZB3</id>\n';
test_zidom = test_zidom+'		else if (\n			   !S(msg).include(\'ZWave\') \n';
test_zidom = test_zidom+'\t		&& !S(msg).include(\'Battery level\')\n';
test_zidom = test_zidom+'\t		&&  S(msg).include(\'ZWAVE\')\n';
test_zidom = test_zidom+'\t 		&&( S(msg).include(\'_ON\') || S(msg).include(\'<dev>CMD/INTER</dev>\'))\n';
test_zidom = test_zidom+'\t		&& !S(msg).include(\'_OFF\')\n';
test_zidom = test_zidom+'\t		&& !S(msg).include(\'Power Measure\')\n';
test_zidom = test_zidom+'\t		&& !S(msg).include(\'<dev>WakeUp\'))\n';
test_zidom = test_zidom+'		{\n';
test_zidom = test_zidom+'			zwave_status = "ON";\n';
test_zidom = test_zidom+'			//Test pour identifier le composant ZWAVE impacte\n';
test_zidom = test_zidom+'			if ((S(msg).include("ZWave")))\n';
test_zidom = test_zidom+'			{ zwave_id = "Z"+S(msg).between(\': Z\', \'_ON\').s; }\n';
test_zidom = test_zidom+'			else if ((S(msg).include("ZWAVE")))\n';
test_zidom = test_zidom+'			{ zwave_id = "Z"+S(msg).between(\'<rf>ZWAVE Z\',\'</rf>\').s; }\n';
test_zidom = test_zidom+'			if (!S(msg).include(\'Battery\')) { bat = "Ok"; }\n';
test_zidom = test_zidom+'		}\n';
test_zidom = test_zidom+'		//Tue Aug 19 2014 19:52:59 GMT+0100 (BST) Received radio ID (<rf>ZWAVE ZC7</rf>  <dev>CMD/INTER</dev>  Batt=<bat>Ok</bat>): <id>ZC7_OFF</id>\n';
test_zidom = test_zidom+'		else if (\n			   !S(msg).include(\'ZWave\') \n';
test_zidom = test_zidom+'\t		&& !S(msg).include(\'Battery level\')\n';
test_zidom = test_zidom+'\t		&&  S(msg).include(\'ZWAVE\')\n';
test_zidom = test_zidom+'\t 		&& !S(msg).include(\'_ON\')\n';
test_zidom = test_zidom+'\t		&&  S(msg).include(\'_OFF\')\n';
test_zidom = test_zidom+'\t		&& !S(msg).include(\'Power Measure\')\n';
test_zidom = test_zidom+'\t		&& !S(msg).include(\'<dev>WakeUp\'))\n';
test_zidom = test_zidom+'		{\n';
test_zidom = test_zidom+'			zwave_status = "OFF";\n';
test_zidom = test_zidom+'			//Test pour identifier le composant ZWAVE impacte\n';
test_zidom = test_zidom+'			if ((S(msg).include("ZWave")))\n';
test_zidom = test_zidom+'			{ zwave_id = "Z"+S(msg).between(\': Z\', \'_OFF\').s; }\n';
test_zidom = test_zidom+'			else if ((S(msg).include("ZWAVE")))\n';
test_zidom = test_zidom+'			{ zwave_id = "Z"+S(msg).between(\'<rf>ZWAVE Z\',\'</rf>\').s; }\n';
test_zidom = test_zidom+'			if (!S(msg).include(\'Battery\')) { bat = "Ok"; }\n';
test_zidom = test_zidom+'		}\n';
test_zidom = test_zidom+'		//Thu Aug 14 2014 23:33:06 GMT+0100 (BST) Received radio ID (<rf>ZWAVE ZC6</rf> <dev>WakeUp</dev> Batt=<bat>Ok</bat>): <id>WZC4</id>\n';
test_zidom = test_zidom+'		else if (\n			   !S(msg).include(\'ZWave\') \n';
test_zidom = test_zidom+'\t		&& !S(msg).include(\'Battery level\')\n';
test_zidom = test_zidom+'\t		&&  S(msg).include(\'ZWAVE\')\n';
test_zidom = test_zidom+'\t 		&& !S(msg).include(\'_ON\')\n';
test_zidom = test_zidom+'\t		&& !S(msg).include(\'_OFF\')\n';
test_zidom = test_zidom+'\t		&& !S(msg).include(\'Power Measure\')\n';
test_zidom = test_zidom+'\t		&&  S(msg).include(\'<dev>WakeUp\'))\n';
test_zidom = test_zidom+'		{\n';
test_zidom = test_zidom+'			zwave_status = "WakeUp";\n';
test_zidom = test_zidom+'			zwave_id = S(msg).between(\'<rf>ZWAVE \', \'</rf>\').s;\n';
test_zidom = test_zidom+'			//zwave_id = id;\n';
test_zidom = test_zidom+'		}\n';
test_zidom = test_zidom+'		//Sun Oct 26 2014 14:38:39 GMT+0100 (CET) Received radio ID (<rf>ZWAVE ZA8</rf> <dev>Low-Power Measure</dev> Total Energy=<kwh>11.4</kwh>kWh Power=<w>200</w>W Batt=<bat>Ok</bat>): <id>PZA8</id>\n';
test_zidom = test_zidom+'		else if (\n			   !S(msg).include(\'ZWave\') \n';
test_zidom = test_zidom+'\t		&& !S(msg).include(\'Battery level\')\n';
test_zidom = test_zidom+'\t		&&  S(msg).include(\'ZWAVE\')\n';
test_zidom = test_zidom+'\t 		&& !S(msg).include(\'_ON\')\n';
test_zidom = test_zidom+'\t		&& !S(msg).include(\'_OFF\')\n';
test_zidom = test_zidom+'\t		&&  S(msg).include(\'Power Measure\')\n';
test_zidom = test_zidom+'\t		&& !S(msg).include(\'<dev>WakeUp\'))\n';
test_zidom = test_zidom+'		{\n';
test_zidom = test_zidom+'			zwave_status = "UNKNOWN";\n';
test_zidom = test_zidom+'			zwave_id = id;\n';
test_zidom = test_zidom+'		}\n';
test_zidom = test_zidom+'		else if (\n			   !S(msg).include(\'ZWave\') \n';
test_zidom = test_zidom+'\t		&& !S(msg).include(\'Battery level\')\n';
test_zidom = test_zidom+'\t		&&  S(msg).include(\'ZWAVE\')\n';
test_zidom = test_zidom+'\t 		&& !S(msg).include(\'_ON\')\n';
test_zidom = test_zidom+'\t		&& !S(msg).include(\'_OFF\')\n';
test_zidom = test_zidom+'\t		&& !S(msg).include(\'Power Measure\')\n';
test_zidom = test_zidom+'\t		&& !S(msg).include(\'<dev>WakeUp\'))\n';
test_zidom = test_zidom+'		{\n';
test_zidom = test_zidom+'			zwave_status = "UNKNOWN";\n';
test_zidom = test_zidom+'			zwave_id = S(msg).between(\'<id>\', \'</id>\').s;\n';
test_zidom = test_zidom+'			if (!S(msg).include(\'Battery\')) { bat = "Ok"; }\n';
test_zidom = test_zidom+'		}\n';
test_zidom = test_zidom+'		console.log("Debug  : zwave     : " + zwave + " | Composant " + zwave_id + " | Statut : " + zwave_status);\n';
test_zidom = test_zidom+'	}\n';

test_zidom = test_zidom+'\n	//Test de remontees de PROTOCOLE 7 : composants RFS10/TS10\n';
test_zidom = test_zidom+'	if (S(msg).include(\'RFS10/TS10\'))\n';
test_zidom = test_zidom+'	{\n';
test_zidom = test_zidom+'	    rfs10ts10_id  = S(msg).between("TS10\' ): ", \'_\').s;\n';
test_zidom = test_zidom+'		rfs10ts10 = true;\n';
test_zidom = test_zidom+'		if (S(msg).include(\'_ON\'))\n';
test_zidom = test_zidom+'		{\n			 rfs10ts10_status = "ON";\n		}\n';
test_zidom = test_zidom+'		else if (S(msg).include(\'_OFF\'))\n';
test_zidom = test_zidom+'		{\n			 rfs10ts10_status = "OFF";\n		}\n';
test_zidom = test_zidom+'		console.log("Debug : rfs10ts10    : " + rfs10ts10 + " | Composant/Id " + rfs10ts10_id + " | Statut " + rfs10ts10_status);\n';
test_zidom = test_zidom+'	}\n';

test_zidom = test_zidom+'\n	//Test de remontees de PROTOCOLE 8 : composants XDD433 alrm\n';
test_zidom = test_zidom+'	if (S(msg).include(\'XDD433 alrm\'))\n';
test_zidom = test_zidom+'	{\n';
test_zidom = test_zidom+'	    xdd433alrm_id = S(msg).between("XDD433 alrm\' ): ", \'_\').s;\n';
test_zidom = test_zidom+'		xdd433alrm = true;\n';
test_zidom = test_zidom+'		if (S(msg).include(\'_ON\'))\n';
test_zidom = test_zidom+'		{\n			 xdd433alrm_status = "ON";\n		}\n';
test_zidom = test_zidom+'		else if (S(msg).include(\'_OFF\'))\n';
test_zidom = test_zidom+'		{\n			 xdd433alrm_status = "OFF";\n		}\n';
test_zidom = test_zidom+'		console.log("Debug : xdd433alrm    : " + xdd433alrm + " | Composant/Id " + xdd433alrm_id + " | Statut " + xdd433alrm_status);\n';
test_zidom = test_zidom+'	}\n';

test_zidom = test_zidom+'\n	//Test de remontees de PROTOCOLE 9 : composants XDD868 alrm\n';
test_zidom = test_zidom+'	if (S(msg).include(\'XDD868 alrm\'))\n';
test_zidom = test_zidom+'	{\n';
test_zidom = test_zidom+'	    xdd868alrm_id  = S(msg).between("XDD868 alrm\' ): ", \'_\').s;\n';
test_zidom = test_zidom+'		xdd868alrm = true;\n';
test_zidom = test_zidom+'		if (S(msg).include(\'_ON\'))\n';
test_zidom = test_zidom+'		{\n			 xdd868alrm_status = "ON";\n		}\n';
test_zidom = test_zidom+'		else if (S(msg).include(\'_OFF\'))\n';
test_zidom = test_zidom+'		{\n			 xdd868alrm_status = "OFF";\n		}\n';
test_zidom = test_zidom+'		console.log("Debug : xdd868alrm    : " + xdd868alrm + " | Composant/Id " + id + " | Statut " + xdd868alrm_status);\n';
test_zidom = test_zidom+'	}\n';

test_zidom = test_zidom+'\n	//Test de remontees de PROTOCOLE 10 : composants XDD868 Inter/Shutter : 		 Sent radio ID (1 Burst(s), Protocols=\'Inter/shutter RFY433\' ): C1_OFF\n';
test_zidom = test_zidom+'	if (S(msg).include(\'Inter/shutter RFY433\'))\n';
test_zidom = test_zidom+'	{\n';
test_zidom = test_zidom+'	    xdd868intershutter_id  = S(msg).between("Inter/shutter RFY433\' ): ", \'_\').s;\n';
test_zidom = test_zidom+'		xdd868intershutter = true;\n';
test_zidom = test_zidom+'		xdd868intershutter_id 	= S(msg).between("Protocols=\'Inter/shutter RFY433\' ): ", " ").s;\n';
test_zidom = test_zidom+'		xdd868intershutter_power_ON 	= S(msg).include(\'_ON\');\n';
test_zidom = test_zidom+'		xdd868intershutter_power_OFF 	= S(msg).include(\'_OFF\');\n';
test_zidom = test_zidom+'		xdd868intershutter_DIM_SPECIAL 	= S(msg).include(\'DIM/SPECIAL\');\n';
test_zidom = test_zidom+'		if (S(msg).include(\'_ON\')) { xdd868intershutter_status = "ON"; }\n';
test_zidom = test_zidom+'		else if (S(msg).include(\'_OFF)\')) { xdd868intershutter_status = "OFF"; }\n';
test_zidom = test_zidom+'		console.log("Debug : xdd868intershutter    : " + xdd868intershutter + " | Composant/Id " + xdd868intershutter_id + " | Statut " + xdd868intershutter_status);\n';
test_zidom = test_zidom+'	}\n';

test_zidom = test_zidom+'	//Test de remontees de PROTOCOLE 11 : composants XDD868PilotWire: Sent radio ID (1 Burst(s), Protocols=\'XDD868 Radiator/Pilot Wire :OutOfFrost\' ): B1 DIM/SPECIAL\n';
test_zidom = test_zidom+'	//Sent radio ID (1 Burst(s), Protocols=\'XDD868 Radiator/Pilot Wire :Auto\' ): B1_ON\n';
test_zidom = test_zidom+'	if (S(msg).include(\'XDD868 Radiator/Pilot Wire\'))\n';
test_zidom = test_zidom+'	{\n';
test_zidom = test_zidom+'	    xdd868pilotwire_id  = "UNKNOWN";\n';
test_zidom = test_zidom+'		xdd868pilotwire = true;\n';
test_zidom = test_zidom+'		xdd868pilotwire_cmd = S(msg).between("Radiator/Pilot Wire :", "\'").s;\n';
test_zidom = test_zidom+'		if (S(msg).include(\'_ON\') && !S(msg).include(\'_OFF\') && !S(msg).include(\'DIM/SPECIAL\'))\n';
test_zidom = test_zidom+'		{\n';
test_zidom = test_zidom+'			xdd868pilotwire_status = "ON";\n';
test_zidom = test_zidom+'			xdd868pilotwire_id  = S(msg).between("\' ): ", \'_\').s;\n';
test_zidom = test_zidom+'		}\n';
test_zidom = test_zidom+'		else if (!S(msg).include(\'_ON\') && S(msg).include(\'_OFF\') && !S(msg).include(\'DIM/SPECIAL\'))\n';
test_zidom = test_zidom+'		{\n';
test_zidom = test_zidom+'			xdd868pilotwire_status = "OFF";\n';
test_zidom = test_zidom+'			xdd868pilotwire_id  = S(msg).between("\' ): ", \'_\').s;\n';
test_zidom = test_zidom+'		}\n';
test_zidom = test_zidom+'		else if (!S(msg).include(\'_ON\') && !S(msg).include(\'_OFF\') && S(msg).include(\'DIM/SPECIAL\'))\n';
test_zidom = test_zidom+'		{\n';
test_zidom = test_zidom+'			xdd868pilotwire_status = "DIM/SPECIAL";\n';
test_zidom = test_zidom+'			xdd868pilotwire_id  = S(msg).between(" ): ", \' DIM/SPECIAL\').s;\n';
test_zidom = test_zidom+'		}\n';
test_zidom = test_zidom+'		else xdd868pilotwire_status = "UNKNOWN";\n';
test_zidom = test_zidom+'		console.log("Debug : xdd868pilotwire    : " + xdd868pilotwire + " | Composant/Id " + xdd868pilotwire_id + " | Statut " + xdd868pilotwire_status+ " | Commande " +xdd868pilotwire_cmd);\n';
test_zidom = test_zidom+'	}\n';

test_zidom = test_zidom+'	//Test de remontees de PROTOCOLE 12 : composants XDD868Boiler\n';
test_zidom = test_zidom+'	if (S(msg).include(\'XDD868Boiler\'))\n';
test_zidom = test_zidom+'	{\n';
test_zidom = test_zidom+'	    xdd868boiler_id  = S(msg).between("XDD868Boiler\' ): ", \'_\').s;\n';
test_zidom = test_zidom+'		xdd868boiler = true;\n';
test_zidom = test_zidom+'		if (S(msg).include(\'_ON\'))\n';
test_zidom = test_zidom+'		{\n';
test_zidom = test_zidom+'			xdd868boiler_status = "ON";\n';
test_zidom = test_zidom+'		}\n';
test_zidom = test_zidom+'		else if (S(msg).include(\'_OFF\'))\n';
test_zidom = test_zidom+'		{\n';
test_zidom = test_zidom+'			xdd868boiler_status = "OFF";\n';
test_zidom = test_zidom+'		}\n';;
test_zidom = test_zidom+'		else if (S(msg).include(\'_DIM/SPECIAL\'))\n';
test_zidom = test_zidom+'		{\n';
test_zidom = test_zidom+'			xdd868boiler_status = "DIM/SPECIAL";\n';
test_zidom = test_zidom+'		}\n';
test_zidom = test_zidom+'		console.log("Debug : xdd868boiler    : " + xdd868boiler + " | Composant/Id " + xdd868boiler_id + " | Statut " + xdd868boiler_status);\n';
test_zidom = test_zidom+'	}\n';

test_zidom = test_zidom+'	//Test de remontees de 433Mhz OWL\n';
test_zidom = test_zidom+'	//Received radio ID (<rf>433Mhz OWL</rf> Noise=<noise>2107</noise> Level=<lev>3.5</lev>/5 <dev>High-Power Measure</dev> Ch=<ch>2</ch> Total Energy=<kwh>4504.0</kwh>kWh Power=<w>1000</w>W Batt=<bat>Ok</bat>): <id>WS132632</id>\n';
test_zidom = test_zidom+'	if (S(msg).include(\'433Mhz OWL\'))\n';
test_zidom = test_zidom+'	{\n';
test_zidom = test_zidom+'	    owl_id  = id;\n';
test_zidom = test_zidom+'		owl = true;\n';
test_zidom = test_zidom+'		if (S(msg).include(\'_ON\'))\n';
test_zidom = test_zidom+'		{\n			 owl_status = "ON";\n		}\n';
test_zidom = test_zidom+'		else if (S(msg).include(\'_OFF\'))\n';
test_zidom = test_zidom+'		{\n			 owl_status = "OFF";\n		}\n';
test_zidom = test_zidom+'		else if (S(msg).include(\'_DIM/SPECIAL\'))\n';
test_zidom = test_zidom+'		{\n			 owl_status = "DIM/SPECIAL";\n		}\n';
test_zidom = test_zidom+'		console.log("Debug : 433Mhz OWL    : " + owl + " | Composant/Id " + owl_id+ " | Statut " + owl_status);\n';
test_zidom = test_zidom+'	}\n';

test_zidom = test_zidom+'	// Test de remontees de composants Oregon	Received radio ID (<rf>433Mhz Oregon</rf> Noise=<noise>2453</noise> Level=<lev>5.0</lev>/5 <dev>THWR288A-THN132N</dev> Ch=<ch>2</ch> T=<tem>+23.3</tem>C (+73.9F)  Batt=<bat>Ok</bat>): <id>OS3930896642</id>  Batt=<bat>Ok</bat>): <id>OS4294967047</id>\n';
test_zidom = test_zidom+'	//oregon = S(msg).include(\'Oregon\');\n';
test_zidom = test_zidom+'	if (S(msg).include(\'Oregon\'))\n';
test_zidom = test_zidom+'	{\n';
test_zidom = test_zidom+'		oregon = true;\n';
test_zidom = test_zidom+'		console.log("Debug : oregon    : " + oregon + " | Composant/Id " + id);\n';
test_zidom = test_zidom+'	}\n';

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
	console.log("// *****************   - zibase_ip                           ***************** ")
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
					
					//periph_jeedom = replace_special_char(name_eqp).s;
					periph_jeedom = S(name_eqp).replaceAll(' ', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('/', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('\\', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('-', '').s;
					periph_jeedom = S(periph_jeedom).replaceAll('.', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('?', '').s;
					jid = "j_"+periph_jeedom;
						jidbatterie = "j_"+periph_jeedom+"_batterie";
						jidradio = "j_"+periph_jeedom+"_radio";
					jid_descr = jid_descr+'var '+jid+' = \'\';\n';
						jid_descr = jid_descr+'var '+jidbatterie+' = \'\';\n';
						jid_descr = jid_descr+'var '+jidradio+' = \'\';\n';
					jid_file = jid_file+'\t'+jid+' = 42;\t//'+periph_jeedom+';\n';
						jid_file = jid_file+'\t\t'+jidbatterie+' = 84;\t//'+periph_jeedom+';\n';
						jid_file = jid_file+'\t\t\t'+jidradio+' = 88;\t//'+periph_jeedom+';\n';
					periph_file = periph_file+type_eqp+'\t'+periph_jeedom+'\t'+id_eqp+'\tid_'+'\n';
					
					app_visionic433 = app_visionic433+'\n		if (visionic433_id=="'+id_eqp+'" && visionic433_status=="Alive")\n';
					app_visionic433 = app_visionic433+'		{\n';
					app_visionic433 = app_visionic433+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+' et de statut Alive et de type '+type_eqp+'\");\n';
					app_visionic433 = app_visionic433+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=1\";\n';
					app_visionic433 = app_visionic433+'			console.log(\"  Envoi de la requete HTTP Alive-Visionic433 de l\'equipement \");\n';
					app_visionic433 = app_visionic433+'			console.log(\"  Requete :\" + http_request);\n';
					app_visionic433 = app_visionic433+'			request(http_request, function(error, response, body)\n';
					app_visionic433 = app_visionic433+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_visionic433 = app_visionic433+'			nb_http_request = nb_http_request + 1;\n';

					app_visionic433 = app_visionic433+'			if (S(msg).include(\'Batt\'))\n';
					app_visionic433 = app_visionic433+'			{\n';
					app_visionic433 = app_visionic433+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
					app_visionic433 = app_visionic433+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Batterie: \" + bat);\n';
					app_visionic433 = app_visionic433+'				console.log(\"  Requete :\" + http_request);\n';
					app_visionic433 = app_visionic433+'				request(http_request, function(error, response, body)\n';
					app_visionic433 = app_visionic433+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_visionic433 = app_visionic433+'				nb_http_request = nb_http_request + 1;\n';
					app_visionic433 = app_visionic433+'			};\n';
					app_visionic433 = app_visionic433+'			if (S(msg).include(\'Level\'))\n';
					app_visionic433 = app_visionic433+'			{\n';
					app_visionic433 = app_visionic433+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidradio+'+\"&value=\"+lev;\n';
					app_visionic433 = app_visionic433+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Niveau reception radio: \" + lev);\n';
					app_visionic433 = app_visionic433+'				console.log(\"  Requete :\" + http_request);\n';
					app_visionic433 = app_visionic433+'				request(http_request, function(error, response, body)\n';
					app_visionic433 = app_visionic433+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_visionic433 = app_visionic433+'				nb_http_request = nb_http_request + 1;\n';
					app_visionic433 = app_visionic433+'			};\n';
					app_visionic433 = app_visionic433+'		}\n';

					app_visionic433 = app_visionic433+'		if (visionic433_id=="'+id_eqp+'" && visionic433_status=="Alarm")\n';
					app_visionic433 = app_visionic433+'		{\n';
					app_visionic433 = app_visionic433+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+' et de statut Alarm et de type '+type_eqp+'\");\n';
					app_visionic433 = app_visionic433+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=10\";\n';
					app_visionic433 = app_visionic433+'			console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Alarm-Visionic433 de l\'equipement \");\n';
					app_visionic433 = app_visionic433+'			console.log(\"  Requete :\" + http_request);\n';
					app_visionic433 = app_visionic433+'			request(http_request, function(error, response, body)\n';
					app_visionic433 = app_visionic433+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_visionic433 = app_visionic433+'			nb_http_request = nb_http_request + 1;\n';

					app_visionic433 = app_visionic433+'			if (S(msg).include(\'Batt\'))\n';
					app_visionic433 = app_visionic433+'			{\n';
					app_visionic433 = app_visionic433+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
					app_visionic433 = app_visionic433+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Batterie: \" + bat);\n';
					app_visionic433 = app_visionic433+'				console.log(\"  Requete :\" + http_request);\n';
					app_visionic433 = app_visionic433+'				request(http_request, function(error, response, body)\n';
					app_visionic433 = app_visionic433+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_visionic433 = app_visionic433+'				nb_http_request = nb_http_request + 1;\n';
					app_visionic433 = app_visionic433+'			};\n';
					app_visionic433 = app_visionic433+'			if (S(msg).include(\'Level\'))\n';
					app_visionic433 = app_visionic433+'			{\n';
					app_visionic433 = app_visionic433+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidradio+'+\"&value=\"+lev;\n';
					app_visionic433 = app_visionic433+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Niveau reception radio: \" + lev);\n';
					app_visionic433 = app_visionic433+'				console.log(\"  Requete :\" + http_request);\n';
					app_visionic433 = app_visionic433+'				request(http_request, function(error, response, body)\n';
					app_visionic433 = app_visionic433+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_visionic433 = app_visionic433+'				nb_http_request = nb_http_request + 1;\n';
					app_visionic433 = app_visionic433+'			};\n';
					app_visionic433 = app_visionic433+'		}\n';

					app_visionic433 = app_visionic433+'		if (visionic433_id=="'+id_eqp+'" && visionic433_status=="UNKNOWN")\n';
					app_visionic433 = app_visionic433+'		{\n';
					app_visionic433 = app_visionic433+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+' et de statut UNKNOWN et de type '+type_eqp+'\");\n';
					app_visionic433 = app_visionic433+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=0\";\n';
					app_visionic433 = app_visionic433+'			console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Alarm-Visionic868 de l\'equipement \");\n';
					app_visionic433 = app_visionic433+'			console.log(\"  Requete :\" + http_request);\n';
					app_visionic433 = app_visionic433+'			request(http_request, function(error, response, body)\n';
					app_visionic433 = app_visionic433+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_visionic433 = app_visionic433+'			nb_http_request = nb_http_request + 1;\n';

					app_visionic433 = app_visionic433+'			if (S(msg).include(\'Batt\'))\n';
					app_visionic433 = app_visionic433+'			{\n';
					app_visionic433 = app_visionic433+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
					app_visionic433 = app_visionic433+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Batterie: \" + bat);\n';
					app_visionic433 = app_visionic433+'				console.log(\"  Requete :\" + http_request);\n';
					app_visionic433 = app_visionic433+'				request(http_request, function(error, response, body)\n';
					app_visionic433 = app_visionic433+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_visionic433 = app_visionic433+'				nb_http_request = nb_http_request + 1;\n';
					app_visionic433 = app_visionic433+'			};\n';
					app_visionic433 = app_visionic433+'			if (S(msg).include(\'Level\'))\n';
					app_visionic433 = app_visionic433+'			{\n';
					app_visionic433 = app_visionic433+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidradio+'+\"&value=\"+lev;\n';
					app_visionic433 = app_visionic433+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Niveau reception radio: \" + lev);\n';
					app_visionic433 = app_visionic433+'				console.log(\"  Requete :\" + http_request);\n';
					app_visionic433 = app_visionic433+'				request(http_request, function(error, response, body)\n';
					app_visionic433 = app_visionic433+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_visionic433 = app_visionic433+'				nb_http_request = nb_http_request + 1;\n';
					app_visionic433 = app_visionic433+'			};\n';
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
					
					//periph_jeedom = replace_special_char(name_eqp).s;
					periph_jeedom = S(name_eqp).replaceAll(' ', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('/', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('\\', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('-', '').s;
					periph_jeedom = S(periph_jeedom).replaceAll('.', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('?', '').s;
					jid = "j_"+periph_jeedom;
						jidbatterie = "j_"+periph_jeedom+"_batterie";
						jidradio = "j_"+periph_jeedom+"_radio";
					jid_descr = jid_descr+'var '+jid+' = \'\';\n';
						jid_descr = jid_descr+'var '+jidbatterie+' = \'\';\n';
						jid_descr = jid_descr+'var '+jidradio+' = \'\';\n';
					jid_file = jid_file+'\t'+jid+' = 42;\t//'+periph_jeedom+';\n';
						jid_file = jid_file+'\t\t'+jidbatterie+' = 84;\t//'+periph_jeedom+';\n';
						jid_file = jid_file+'\t\t\t'+jidradio+' = 88;\t//'+periph_jeedom+';\n';
					periph_file = periph_file+type_eqp+'\t'+periph_jeedom+'\t'+id_eqp+'\tid_'+'\n';
					
					app_visionic868 = app_visionic868+'\n		if (visionic868_id=="'+id_eqp+'" && visionic868_status=="Alive")\n';
					app_visionic868 = app_visionic868+'		{\n';
					app_visionic868 = app_visionic868+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+' et de statut Alive et de type '+type_eqp+'\");\n';
					app_visionic868 = app_visionic868+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=1\";\n';
					app_visionic868 = app_visionic868+'			console.log(\"  Envoi de la requete HTTP Alive-Visionic868 de l\'equipement \");\n';
					app_visionic868 = app_visionic868+'			console.log(\"  Requete :\" + http_request);\n';
					app_visionic868 = app_visionic868+'			request(http_request, function(error, response, body)\n';
					app_visionic868 = app_visionic868+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_visionic868 = app_visionic868+'			nb_http_request = nb_http_request + 1;\n';

					app_visionic868 = app_visionic868+'			if (S(msg).include(\'Batt\'))\n';
					app_visionic868 = app_visionic868+'			{\n';
					app_visionic868 = app_visionic868+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
					app_visionic868 = app_visionic868+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Batterie: \" + bat);\n';
					app_visionic868 = app_visionic868+'				console.log(\"  Requete :\" + http_request);\n';
					app_visionic868 = app_visionic868+'				request(http_request, function(error, response, body)\n';
					app_visionic868 = app_visionic868+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_visionic868 = app_visionic868+'				nb_http_request = nb_http_request + 1;\n';
					app_visionic868 = app_visionic868+'			};\n';
					app_visionic868 = app_visionic868+'			if (S(msg).include(\'Level\'))\n';
					app_visionic868 = app_visionic868+'			{\n';
					app_visionic868 = app_visionic868+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidradio+'+\"&value=\"+lev;\n';
					app_visionic868 = app_visionic868+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Niveau reception radio: \" + lev);\n';
					app_visionic868 = app_visionic868+'				console.log(\"  Requete :\" + http_request);\n';
					app_visionic868 = app_visionic868+'				request(http_request, function(error, response, body)\n';
					app_visionic868 = app_visionic868+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_visionic868 = app_visionic868+'				nb_http_request = nb_http_request + 1;\n';
					app_visionic868 = app_visionic868+'			};\n';
					app_visionic868 = app_visionic868+'		}\n';

					app_visionic868 = app_visionic868+'		if (visionic868_id=="'+id_eqp+'" && visionic868_status=="Alarm")\n';
					app_visionic868 = app_visionic868+'		{\n';
					app_visionic868 = app_visionic868+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+' et de statut Alarm et de type '+type_eqp+'\");\n';
					app_visionic868 = app_visionic868+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=10\";\n';
					app_visionic868 = app_visionic868+'			console.log(\"  Envoi de la requete HTTP Alarm-Visionic868 de l\'equipement \");\n';
					app_visionic868 = app_visionic868+'			console.log(\"  Requete :\" + http_request);\n';
					app_visionic868 = app_visionic868+'			request(http_request, function(error, response, body)\n';
					app_visionic868 = app_visionic868+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_visionic868 = app_visionic868+'			nb_http_request = nb_http_request + 1;\n';

					app_visionic868 = app_visionic868+'			if (S(msg).include(\'Batt\'))\n';
					app_visionic868 = app_visionic868+'			{\n';
					app_visionic868 = app_visionic868+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
					app_visionic868 = app_visionic868+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Batterie: \" + bat);\n';
					app_visionic868 = app_visionic868+'				console.log(\"  Requete :\" + http_request);\n';
					app_visionic868 = app_visionic868+'				request(http_request, function(error, response, body)\n';
					app_visionic868 = app_visionic868+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_visionic868 = app_visionic868+'				nb_http_request = nb_http_request + 1;\n';
					app_visionic868 = app_visionic868+'			};\n';
					app_visionic868 = app_visionic868+'			if (S(msg).include(\'Level\'))\n';
					app_visionic868 = app_visionic868+'			{\n';
					app_visionic868 = app_visionic868+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidradio+'+\"&value=\"+lev;\n';
					app_visionic868 = app_visionic868+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Niveau reception radio: \" + lev);\n';
					app_visionic868 = app_visionic868+'				console.log(\"  Requete :\" + http_request);\n';
					app_visionic868 = app_visionic868+'				request(http_request, function(error, response, body)\n';
					app_visionic868 = app_visionic868+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_visionic868 = app_visionic868+'				nb_http_request = nb_http_request + 1;\n';
					app_visionic868 = app_visionic868+'			};\n';
					app_visionic868 = app_visionic868+'		}\n';

					app_visionic868 = app_visionic868+'		if (visionic868_id=="'+id_eqp+'" && visionic868_status=="UNKNOWN")\n';
					app_visionic868 = app_visionic868+'		{\n';
					app_visionic868 = app_visionic868+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+' et de statut UNKNOWN et de type '+type_eqp+'\");\n';
					app_visionic868 = app_visionic868+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=0\";\n';
					app_visionic868 = app_visionic868+'			console.log(\"  Envoi de la requete HTTP Alarm-Visionic868 de l\'equipement \");\n';
					app_visionic868 = app_visionic868+'			console.log(\"  Requete :\" + http_request);\n';
					app_visionic868 = app_visionic868+'			request(http_request, function(error, response, body)\n';
					app_visionic868 = app_visionic868+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_visionic868 = app_visionic868+'			nb_http_request = nb_http_request + 1;\n';

					app_visionic868 = app_visionic868+'			if (S(msg).include(\'Batt\'))\n';
					app_visionic868 = app_visionic868+'			{\n';
					app_visionic868 = app_visionic868+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
					app_visionic868 = app_visionic868+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Batterie: \" + bat);\n';
					app_visionic868 = app_visionic868+'				console.log(\"  Requete :\" + http_request);\n';
					app_visionic868 = app_visionic868+'				request(http_request, function(error, response, body)\n';
					app_visionic868 = app_visionic868+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_visionic868 = app_visionic868+'				nb_http_request = nb_http_request + 1;\n';
					app_visionic868 = app_visionic868+'			};\n';
					app_visionic868 = app_visionic868+'			if (S(msg).include(\'Level\'))\n';
					app_visionic868 = app_visionic868+'			{\n';
					app_visionic868 = app_visionic868+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidradio+'+\"&value=\"+lev;\n';
					app_visionic868 = app_visionic868+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Niveau reception radio: \" + lev);\n';
					app_visionic868 = app_visionic868+'				console.log(\"  Requete :\" + http_request);\n';
					app_visionic868 = app_visionic868+'				request(http_request, function(error, response, body)\n';
					app_visionic868 = app_visionic868+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_visionic868 = app_visionic868+'				nb_http_request = nb_http_request + 1;\n';
					app_visionic868 = app_visionic868+'			};\n';
					app_visionic868 = app_visionic868+'		}\n';
					
					count_periph++;
					bool_periph_added = 1;
				}
				if (proto =="CHACON")
				{
					console.log(" Equipement de protocole "+proto+".");
					console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id : "+ id_eqp);
					console.log("  Ajout dans le script Zidom du test de remontee sur cet equipement");
					
					
					/*$jsonrpc = new jsonrpcClient('#URL_JEEDOM#/core/api/jeeApi.php', #API_KEY#);
					$jsonrpc->sendRequest('cmd::execCmd', array('id' => #cmd_id#, 'options' => array('title' => 'Coucou', 'message' => 'Ca marche')))
					if($jsonrpc->sendRequest('cmd::execCmd', array('id' => #cmd_id#, 'options' => array('title' => 'Coucou', 'message' => 'Ca marche')))){
					   echo 'OK';
					}else{
					   echo $jsonrpc->getError();
					}
					var myArray = [];
					var toto ="";
					console.log("  Recherche de cet equipement dans jeedom ...");
					//client.call('cmd::execCmd', array('id' => #cmd_id#, 'options' => array('title' => 'Coucou', 'message' => 'Ca marche')));
					client.call('eqLogic::all',toto);
					console.log("  Equ. : "+toto);*/
					
					//jsonrpc = new jsonrpcClient('http://localhost/jeedom/core/api/jeeApi.php', jeedom_api);
					/*var toto = new Array();
					var client = jsonrpc.Client.$create('http://localhost/jeedom/core/api/jeeApi.php?apikey=drxc3bdcr0p8b0m2utr9');
					
					client.call('object::all', toto, function (err, result)
						{
							if (err)
							{
								return console.log(err);
							}
							console.log('  1 + 2 = ' + result + ' (http)');
						}
					);*/
					

					/*if(jsonrpc.sendRequest('object::all', toto)){
					   //print_r($jsonrpc->getResult());
					   console.log(jsonrpc.getResult());
					}else{
					   //echo $jsonrpc->getError();
					   console.log(jsonrpc.getError());
					}*/
					
					//periph_jeedom = replace_special_char(name_eqp).s;
					periph_jeedom = S(name_eqp).replaceAll(' ', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('/', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('\\', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('-', '').s;
					periph_jeedom = S(periph_jeedom).replaceAll('.', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('?', '').s;
					jid = "j_"+periph_jeedom;
						jidbatterie = "j_"+periph_jeedom+"_batterie";
						//jidradio = "j_"+periph_jeedom+"_radio";
					jid_descr = jid_descr+'var '+jid+' = \'\';\n';
						jid_descr = jid_descr+'var '+jidbatterie+' = \'\';\n';
						//jid_descr = jid_descr+'var '+jidradio+' = \'\';\n';
					jid_file = jid_file+'\t'+jid+' = 42;\t//'+periph_jeedom+';\n';
						jid_file = jid_file+'\t\t'+jidbatterie+' = 84;\t//'+periph_jeedom+';\n';
						//jid_file = jid_file+'\t\t\t'+jidradio+' = 88;\t//'+periph_jeedom+';\n';
					periph_file = periph_file+type_eqp+'\t'+periph_jeedom+'\t'+id_eqp+'\tid_'+'\n';
					
					app_chacon = app_chacon+'\n		if (chacon_id=="'+id_eqp+'" && chacon_status=="ON")\n';
					app_chacon = app_chacon+'		{\n';
					app_chacon = app_chacon+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+' et de statut ON et de type '+type_eqp+'\");\n';
					app_chacon = app_chacon+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=1\";\n';
					app_chacon = app_chacon+'			console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Activation de l\'equipement \");\n';
					app_chacon = app_chacon+'			console.log(\"  Requete :\" + http_request);\n';
					app_chacon = app_chacon+'			request(http_request, function(error, response, body)\n';
					app_chacon = app_chacon+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_chacon = app_chacon+'			nb_http_request = nb_http_request + 1;\n';

					app_chacon = app_chacon+'			if (S(msg).include("Batt"))\n';
					app_chacon = app_chacon+'			{\n';
					app_chacon = app_chacon+'\t			console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Batterie: \" + bat);\n';
					app_chacon = app_chacon+'\t			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=\"+bat;\n';
					app_chacon = app_chacon+'\t			console.log(\"  Requete :\" + http_request);\n';
					app_chacon = app_chacon+'\t			request(http_request, function(error, response, body)\n';
					app_chacon = app_chacon+'\t			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_chacon = app_chacon+'\t			nb_http_request = nb_http_request + 1;\n';
					app_chacon = app_chacon+'			}\n';
					app_chacon = app_chacon+'		}\n';

					app_chacon = app_chacon+'		if (chacon_id=="'+id_eqp+'" && chacon_status=="OFF")\n';
					app_chacon = app_chacon+'		{\n';
					app_chacon = app_chacon+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+' et de statut OFF et de type '+type_eqp+'\");\n';
					app_chacon = app_chacon+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=0\";\n';
					app_chacon = app_chacon+'			console.log(\"  Envoi de la requete HTTP | Procole '+proto+', DESActivation de l\'equipement \");\n';
					app_chacon = app_chacon+'			console.log(\"  Requete :\" + http_request);\n';
					app_chacon = app_chacon+'			request(http_request, function(error, response, body)\n';
					app_chacon = app_chacon+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_chacon = app_chacon+'			nb_http_request = nb_http_request + 1;\n';

					app_chacon = app_chacon+'			if (S(msg).include("Batt"))\n';
					app_chacon = app_chacon+'			{\n';
					app_chacon = app_chacon+'\t			console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Batterie: \" + bat);\n';
					app_chacon = app_chacon+'\t			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=\"+bat;\n';
					app_chacon = app_chacon+'\t			console.log(\"  Requete :\" + http_request);\n';
					app_chacon = app_chacon+'\t			request(http_request, function(error, response, body)\n';
					app_chacon = app_chacon+'\t			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_chacon = app_chacon+'\t			nb_http_request = nb_http_request + 1;\n';
					app_chacon = app_chacon+'			}\n';
					app_chacon = app_chacon+'		}\n';

					script_zidom = script_zidom+'//Ajout des scripts ZAPI1 pour ' + name_eqp + ':\n';
					script_zidom = script_zidom+' Pour allumer ' + name_eqp + ':\n';
					script_zidom = script_zidom+zibase_ip+'/cgi-bin/domo.cgi?cmd=ON%20'+id_eqp+'\n';
					script_zidom = script_zidom+' Pour Eteindre ' + name_eqp + ':\n';
					script_zidom = script_zidom+zibase_ip+'/cgi-bin/domo.cgi?cmd=OFF%20'+id_eqp+'\n';

					count_periph++;
					bool_periph_added = 1;
				}
				if (proto =="DOMIA")
				{
					console.log(" Equipement de protocole "+proto+".");
					//Sent radio ID (1 Burst(s), Protocols='Domia' ): M13_ON
					//Sent radio ID (1 Burst(s), Protocols='Domia' ): M11_OFF

					//periph_jeedom = replace_special_char(name_eqp).s;
					periph_jeedom = S(name_eqp).replaceAll(' ', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('/', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('\\', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('-', '').s;
					periph_jeedom = S(periph_jeedom).replaceAll('.', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('?', '').s;
					jid = "j_"+periph_jeedom;
						//jidbatterie = "j_"+periph_jeedom+"_batterie";
					jid_descr = jid_descr+'var '+jid+' = \'\';\n';
						//jid_descr = jid_descr+'var '+jidbatterie+' = \'\';\n';
					jid_file = jid_file+'\t'+jid+' = 42;\t//'+periph_jeedom+';\n';
						//jid_file = jid_file+'\t\t'+jidbatterie+' = 84;\t//'+periph_jeedom+';\n';
					periph_file = periph_file+type_eqp+'\t'+periph_jeedom+'\t'+id_eqp+'\tid_'+'\n';
					
					app_domia = app_domia+'\n		if (domia_id=="'+id_eqp+'" && domia_status=="ON")\n';
					app_domia = app_domia+'		{\n';
					app_domia = app_domia+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+' et de statut ON et de type '+type_eqp+'\");\n';
					app_domia = app_domia+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=1\";\n';
					app_domia = app_domia+'			console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Activation de l\'equipement \");\n';
					app_domia = app_domia+'			console.log(\"  Requete :\" + http_request);\n';
					app_domia = app_domia+'			request(http_request, function(error, response, body)\n';
					app_domia = app_domia+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_domia = app_domia+'			nb_http_request = nb_http_request + 1;\n';

					/*app_domia = app_domia+'			if (S(msg).include(\'Batt\'))\n';
					app_domia = app_domia+'			{\n';
					app_domia = app_domia+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
					app_domia = app_domia+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Batterie: \" + bat);\n';
					app_domia = app_domia+'				console.log(\"  Requete :\" + http_request);\n';
					app_domia = app_domia+'				request(http_request, function(error, response, body)\n';
					app_domia = app_domia+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_domia = app_domia+'				nb_http_request = nb_http_request + 1;\n';
					app_domia = app_domia+'			};\n';*/
					app_domia = app_domia+'		}\n';

					app_domia = app_domia+'		if (domia_id=="'+id_eqp+'" && domia_status=="OFF")\n';
					app_domia = app_domia+'		{\n';
					app_domia = app_domia+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+' et de statut OFF et de type '+type_eqp+'\");\n';
					app_domia = app_domia+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=0\";\n';
					app_domia = app_domia+'			console.log(\"  Envoi de la requete HTTP | Procole '+proto+', DESActivation de l\'equipement \");\n';
					app_domia = app_domia+'			console.log(\"  Requete :\" + http_request);\n';
					app_domia = app_domia+'			request(http_request, function(error, response, body)\n';
					app_domia = app_domia+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_domia = app_domia+'			nb_http_request = nb_http_request + 1;\n';

					/*app_domia = app_domia+'			if (S(msg).include(\'Batt\'))\n';
					app_domia = app_domia+'			{\n';
					app_domia = app_domia+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
					app_domia = app_domia+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Batterie: \" + bat);\n';
					app_domia = app_domia+'				console.log(\"  Requete :\" + http_request);\n';
					app_domia = app_domia+'				request(http_request, function(error, response, body)\n';
					app_domia = app_domia+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_domia = app_domia+'				nb_http_request = nb_http_request + 1;\n';
					app_domia = app_domia+'			};\n';*/
					app_domia = app_domia+'		}\n';

					count_periph++;
					bool_periph_added = 1;
				}
				if (proto =="RF X10")
				{
					console.log(" Equipement de protocole "+proto+".");
					console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id : "+ id_eqp);
					console.log("  Ajout dans le script Zidom du test de remontee sur cet equipement");
					
					//periph_jeedom = replace_special_char(name_eqp).s;
					periph_jeedom = S(name_eqp).replaceAll(' ', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('/', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('\\', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('-', '').s;
					periph_jeedom = S(periph_jeedom).replaceAll('.', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('?', '').s;
					jid = "j_"+periph_jeedom;
						jidbatterie = "j_"+periph_jeedom+"_batterie";
						jidradio = "j_"+periph_jeedom+"_radio";
					jid_descr = jid_descr+'var '+jid+' =  \'\';\n';
						jid_descr = jid_descr+'var '+jidbatterie+' =  \'\';\n';
						jid_descr = jid_descr+'var '+jidradio+' =  \'\';\n';
					jid_file = jid_file+'\t'+jid+' = 42;\t//'+periph_jeedom+';\n';
						jid_file = jid_file+'\t\t'+jidbatterie+' = 84;\t//'+periph_jeedom+';\n';
						jid_file = jid_file+'\t\t\t'+jidradio+' = 88;\t//'+periph_jeedom+';\n';
					periph_file = periph_file+type_eqp+'\t'+periph_jeedom+'\t'+id_eqp+'\tid_'+'\n';
					
					app_rfx10 = app_rfx10+'\n		if (rfx10_id=="'+id_eqp+'" && rfx10_status=="ON")\n';
					app_rfx10 = app_rfx10+'		{\n';
					app_rfx10 = app_rfx10+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+' et de statut ON et de type '+type_eqp+'\");\n';
					app_rfx10 = app_rfx10+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=1\";\n';
					app_rfx10 = app_rfx10+'			console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Activation de l\'equipement RF X10 \");\n';
					app_rfx10 = app_rfx10+'			console.log(\"  Requete :\" + http_request);\n';
					app_rfx10 = app_rfx10+'			request(http_request, function(error, response, body)\n';
					app_rfx10 = app_rfx10+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';

					app_rfx10 = app_rfx10+'			if (S(msg).include(\'Batt\'))\n';
					app_rfx10 = app_rfx10+'			{\n';
					app_rfx10 = app_rfx10+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
					app_rfx10 = app_rfx10+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Batterie: \" + bat);\n';
					app_rfx10 = app_rfx10+'				console.log(\"  Requete :\" + http_request);\n';
					app_rfx10 = app_rfx10+'				request(http_request, function(error, response, body)\n';
					app_rfx10 = app_rfx10+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_rfx10 = app_rfx10+'				nb_http_request = nb_http_request + 1;\n';
					app_rfx10 = app_rfx10+'			};\n';
					app_rfx10 = app_rfx10+'			if (S(msg).include(\'Level\'))\n';
					app_rfx10 = app_rfx10+'			{\n';
					app_rfx10 = app_rfx10+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidradio+'+\"&value=\"+lev;\n';
					app_rfx10 = app_rfx10+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Niveau reception radio: \" + lev);\n';
					app_rfx10 = app_rfx10+'				console.log(\"  Requete :\" + http_request);\n';
					app_rfx10 = app_rfx10+'				request(http_request, function(error, response, body)\n';
					app_rfx10 = app_rfx10+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_rfx10 = app_rfx10+'				nb_http_request = nb_http_request + 1;\n';
					app_rfx10 = app_rfx10+'			};\n';
					app_rfx10 = app_rfx10+'		}\n';

					app_rfx10 = app_rfx10+'		if (rfx10_id=="'+id_eqp+'" && rfx10_status=="OFF")\n';
					app_rfx10 = app_rfx10+'		{\n';
					app_rfx10 = app_rfx10+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+'de statut OFF et de type '+type_eqp+'\");\n';
					app_rfx10 = app_rfx10+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=0\";\n';
					app_rfx10 = app_rfx10+'			console.log(\"  Envoi de la requete HTTP | Procole '+proto+', DESActivation de l\'equipement\");\n';
					app_rfx10 = app_rfx10+'			console.log(\"  Requete :\" + http_request);\n';
					app_rfx10 = app_rfx10+'			request(http_request, function(error, response, body)\n';
					app_rfx10 = app_rfx10+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';

					app_rfx10 = app_rfx10+'			if (S(msg).include(\'Batt\'))\n';
					app_rfx10 = app_rfx10+'			{\n';
					app_rfx10 = app_rfx10+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
					app_rfx10 = app_rfx10+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Batterie: \" + bat);\n';
					app_rfx10 = app_rfx10+'				console.log(\"  Requete :\" + http_request);\n';
					app_rfx10 = app_rfx10+'				request(http_request, function(error, response, body)\n';
					app_rfx10 = app_rfx10+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_rfx10 = app_rfx10+'				nb_http_request = nb_http_request + 1;\n';
					app_rfx10 = app_rfx10+'			};\n';
					app_rfx10 = app_rfx10+'			if (S(msg).include(\'Level\'))\n';
					app_rfx10 = app_rfx10+'			{\n';
					app_rfx10 = app_rfx10+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidradio+'+\"&value=\"+lev;\n';
					app_rfx10 = app_rfx10+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Niveau reception radio: \" + lev);\n';
					app_rfx10 = app_rfx10+'				console.log(\"  Requete :\" + http_request);\n';
					app_rfx10 = app_rfx10+'				request(http_request, function(error, response, body)\n';
					app_rfx10 = app_rfx10+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_rfx10 = app_rfx10+'				nb_http_request = nb_http_request + 1;\n';
					app_rfx10 = app_rfx10+'			};\n';
					app_rfx10 = app_rfx10+'		}\n';

					count_periph++;
					bool_periph_added = 1;
				}
				else if (proto =="ZWAVE")
				{
					//periph_jeedom = replace_special_char(name_eqp).s;
					periph_jeedom = S(name_eqp).replaceAll(' ', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('/', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('\\', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('-', '').s;
					periph_jeedom = S(periph_jeedom).replaceAll('.', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('?', '').s;

					jid = "j_"+periph_jeedom;
						jidbatterie = "j_"+periph_jeedom+"_batterie";
						jidradio = "j_"+periph_jeedom+"_radio";
					jid_descr = jid_descr+'var '+jid+' = \'\';\n';
						jid_descr = jid_descr+'var '+jidbatterie+' = \'\';\n';
						jid_descr = jid_descr+'var '+jidradio+' = \'\';\n';
					jid_file = jid_file+'\t'+jid+' = 84;\t//'+periph_jeedom+';\n';
						jid_file = jid_file+'\t\t'+jidbatterie+' = 88;\t//'+periph_jeedom+';\n';
						jid_file = jid_file+'\t\t\t'+jidradio+' = 88;\t//'+periph_jeedom+';\n';
					periph_file = periph_file+type_eqp+'\t'+periph_jeedom+'\t'+id_eqp+'\tid_'+'\n';
					
					if (type_eqp == "power")
					{
						jidpowerstatus = "j_"+periph_jeedom+"_powerstatus";
						jidpowertotal = "j_"+periph_jeedom+"_powertotal";
						jidpowerpower = "j_"+periph_jeedom+"_powerpower";
						
						jid_descr = jid_descr+'var '+jidpowerstatus+' = \'\';\n';
						jid_descr = jid_descr+'var '+jidpowertotal+' = \'\';\n';
						jid_descr = jid_descr+'var '+jidpowerpower+' = \'\';\n';
						jid_file = jid_file+'\t\t\t'+jidpowerstatus+' = 88;\t//'+periph_jeedom+';\n';
						jid_file = jid_file+'\t\t\t'+jidpowertotal+' = 88;\t//'+periph_jeedom+';\n';
						jid_file = jid_file+'\t\t\t'+jidpowerpower+' = 88;\t//'+periph_jeedom+';\n';
	
						console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id : "+ id_eqp);
						console.log("  Ajout dans le script Zidom du test de remontee sur ce Power");
						app_zwave = app_zwave+'\n		if (zwave_id=="'+id_eqp+'")\n';
						app_zwave = app_zwave+'		{\n';
						app_zwave = app_zwave+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+' et de statut UNKNOWN et de type '+type_eqp+'\");\n';
						app_zwave = app_zwave+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidpowertotal+'+\"&value=\" + kwh;\n';
						
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Power Total Energy: \" + kwh);\n';
						app_zwave = app_zwave+'			console.log(\"  Requete :\" + http_request);\n';
						app_zwave = app_zwave+'			request(http_request, function(error, response, body)\n';
						app_zwave = app_zwave+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_zwave = app_zwave+'			nb_http_request = nb_http_request + 1;\n';

						app_zwave = app_zwave+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidpowerpower+'+\"&value=\" + w;\n';
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Power: \" + w);\n';
						app_zwave = app_zwave+'			console.log(\"  Requete :\" + http_request);\n';
						app_zwave = app_zwave+'			request(http_request, function(error, response, body)\n';
						app_zwave = app_zwave+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_zwave = app_zwave+'			nb_http_request = nb_http_request + 1;\n';

						/*app_zwave = app_zwave+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidpowerstatus+'+\"&value=\" + w;\n';
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Power Status: \" + w);\n';
						app_zwave = app_zwave+'			console.log(\"  Requete :\" + http_request);\n';
						app_zwave = app_zwave+'			request(http_request, function(error, response, body)\n';
						app_zwave = app_zwave+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_zwave = app_zwave+'			nb_http_request = nb_http_request + 1;\n';*/

						app_zwave = app_zwave+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Batterie: \" + bat);\n';
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

						/*app_zwave = app_zwave+'\n		if (dev=="CMD/INTER" && zwave_id=="'+id_eqp+'" && zwave_status=="ON")\n';
						app_zwave = app_zwave+'		{\n';
						app_zwave = app_zwave+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+' et de statut ON et de type '+type_eqp+'\");\n';
						app_zwave = app_zwave+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=1\";\n';
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Activation de l\'equipement\");\n';
						app_zwave = app_zwave+'			console.log(\"  Requete :\" + http_request);\n'; 
						app_zwave = app_zwave+'			request(http_request, function(error, response, body)\n';
						app_zwave = app_zwave+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';

						app_zwave = app_zwave+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Batterie: \" + bat);\n';
						app_zwave = app_zwave+'			console.log(\"  Requete :\" + http_request);\n';
						app_zwave = app_zwave+'			request(http_request, function(error, response, body)\n';
						app_zwave = app_zwave+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_zwave = app_zwave+'			nb_http_request = nb_http_request + 1;\n';
						app_zwave = app_zwave+'		}\n';
						
						app_zwave = app_zwave+'\n		if (dev=="CMD/INTER" && zwave_id=="'+id_eqp+'" && zwave_status=="OFF")\n';
						app_zwave = app_zwave+'		{\n';
						app_zwave = app_zwave+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+' et de statut OFF et de type '+type_eqp+'\");\n';
						app_zwave = app_zwave+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=0\";\n';
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP | Procole '+proto+', DESActivation de l\'equipement\");\n';
						app_zwave = app_zwave+'			console.log(\"  Requete :\" + http_request);\n'; 
						app_zwave = app_zwave+'			request(http_request, function(error, response, body)\n';
						app_zwave = app_zwave+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';

						app_zwave = app_zwave+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Batterie: \" + bat);\n';
						app_zwave = app_zwave+'			console.log(\"  Requete :\" + http_request);\n';
						app_zwave = app_zwave+'			request(http_request, function(error, response, body)\n';
						app_zwave = app_zwave+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_zwave = app_zwave+'			nb_http_request = nb_http_request + 1;\n';
						app_zwave = app_zwave+'		}\n';*/

						app_zwave = app_zwave+'\n		if (zwave_id=="'+id_eqp+'" && zwave_status=="ON")\n';
						app_zwave = app_zwave+'		{\n';
						app_zwave = app_zwave+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+' et de statut ON et de type '+type_eqp+'\");\n';
						app_zwave = app_zwave+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=1\";\n';
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Activation de l\'equipement\");\n';
						app_zwave = app_zwave+'			console.log(\"  Requete :\" + http_request);\n'; 
						app_zwave = app_zwave+'			request(http_request, function(error, response, body)\n';
						app_zwave = app_zwave+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';

						app_zwave = app_zwave+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Batterie: \" + bat);\n';
						app_zwave = app_zwave+'			console.log(\"  Requete :\" + http_request);\n';
						app_zwave = app_zwave+'			request(http_request, function(error, response, body)\n';
						app_zwave = app_zwave+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_zwave = app_zwave+'			nb_http_request = nb_http_request + 1;\n';
						app_zwave = app_zwave+'		}\n';
						
						app_zwave = app_zwave+'\n		else if (zwave_id=="'+id_eqp+'" && zwave_status=="OFF")\n';
						app_zwave = app_zwave+'		{\n';
						app_zwave = app_zwave+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+' et de statut OFF et de type '+type_eqp+'\");\n';
						app_zwave = app_zwave+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=0\";\n';
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP | Procole '+proto+', DESActivation de l\'equipement\");\n';
						app_zwave = app_zwave+'			console.log(\"  Requete :\" + http_request);\n'; 
						app_zwave = app_zwave+'			request(http_request, function(error, response, body)\n';
						app_zwave = app_zwave+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';

						app_zwave = app_zwave+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Batterie: \" + bat);\n';
						app_zwave = app_zwave+'			console.log(\"  Requete :\" + http_request);\n';
						app_zwave = app_zwave+'			request(http_request, function(error, response, body)\n';
						app_zwave = app_zwave+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_zwave = app_zwave+'			nb_http_request = nb_http_request + 1;\n';
						app_zwave = app_zwave+'		}\n';
						
						/*app_zwave = app_zwave+'\n		else if (zwave_id=="'+id_eqp+'" && zwave_status=="UNKNOWN" && S(dev).include(\'Power Measure\'))\n';
						app_zwave = app_zwave+'		{\n';
						app_zwave = app_zwave+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+' et de statut POWER et de type '+type_eqp+'\");\n';
						app_zwave = app_zwave+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidpowertotal+'+\"&value=\" + kwh;\n';
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Total Energy: \" + kwh);\n';
						app_zwave = app_zwave+'			console.log(\"  Requete :\" + http_request);\n';
						app_zwave = app_zwave+'			request(http_request, function(error, response, body)\n';
						app_zwave = app_zwave+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_zwave = app_zwave+'			nb_http_request = nb_http_request + 1;\n';

						app_zwave = app_zwave+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidpowerpower+'+\"&value=\" + w;\n';
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Power: \" + w);\n';
						app_zwave = app_zwave+'			console.log(\"  Requete :\" + http_request);\n';
						app_zwave = app_zwave+'			request(http_request, function(error, response, body)\n';
						app_zwave = app_zwave+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_zwave = app_zwave+'			nb_http_request = nb_http_request + 1;\n';

						app_zwave = app_zwave+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Batterie: \" + bat);\n';
						app_zwave = app_zwave+'			console.log(\"  Requete :\" + http_request);\n';
						app_zwave = app_zwave+'			request(http_request, function(error, response, body)\n';
						app_zwave = app_zwave+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_zwave = app_zwave+'			nb_http_request = nb_http_request + 1;\n';
						app_zwave = app_zwave+'		}\n'*/

						app_zwave = app_zwave+'\n		else if (zwave_id=="'+id_eqp+'" && zwave_status=="WakeUp")\n';
						app_zwave = app_zwave+'		{\n';
						app_zwave = app_zwave+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+' et de statut WakeUp de type '+type_eqp+'\");\n';
						app_zwave = app_zwave+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Batterie: \" + bat);\n';
						app_zwave = app_zwave+'			console.log(\"  Requete :\" + http_request);\n';
						app_zwave = app_zwave+'			request(http_request, function(error, response, body)\n';
						app_zwave = app_zwave+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_zwave = app_zwave+'			nb_http_request = nb_http_request + 1;\n';
						app_zwave = app_zwave+'		}\n';
						
						script_zidom = script_zidom+'//Ajout des scripts ZAPI1 pour ' + name_eqp + ':\n';
						script_zidom = script_zidom+' Pour allumer ' + name_eqp + ':\n';
						script_zidom = script_zidom+zibase_ip+'/cgi-bin/domo.cgi?cmd=ON%20'+id_eqp+'%20P6\n';
						script_zidom = script_zidom+' Pour Eteindre ' + name_eqp + ':\n';
						script_zidom = script_zidom+zibase_ip+'/cgi-bin/domo.cgi?cmd=OFF%20'+id_eqp+'%20P6\n';
					}

					if (type_eqp == "transmitter")
					{
						console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id : "+ id_eqp);
						console.log("  Ajout dans le script Zidom du test de remontee sur ce transmitter");
						
						app_zwave = app_zwave+'\n		if (dev=="CMD/INTER" && zwave_id=="'+id_eqp+'" && zwave_status=="ON")\n';
						app_zwave = app_zwave+'		{\n';
						app_zwave = app_zwave+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+' et de statut ON et de type '+type_eqp+'\");\n';
						app_zwave = app_zwave+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=1\";\n';
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Activation de l\'equipement\");\n';
						app_zwave = app_zwave+'			console.log(\"  Requete :\" + http_request);\n'; 
						app_zwave = app_zwave+'			request(http_request, function(error, response, body)\n';
						app_zwave = app_zwave+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';

						app_zwave = app_zwave+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Batterie: \" + bat);\n';
						app_zwave = app_zwave+'			console.log(\"  Requete :\" + http_request);\n';
						app_zwave = app_zwave+'			request(http_request, function(error, response, body)\n';
						app_zwave = app_zwave+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_zwave = app_zwave+'			nb_http_request = nb_http_request + 1;\n';
						app_zwave = app_zwave+'		}\n';

						app_zwave = app_zwave+'\n		if (dev=="CMD/INTER" && zwave_id=="'+id_eqp+'" && zwave_status=="OFF")\n';
						app_zwave = app_zwave+'		{\n';
						app_zwave = app_zwave+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+' et de statut OFF et de type '+type_eqp+'\");\n';
						app_zwave = app_zwave+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=0\";\n';
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP | Procole '+proto+', DESActivation de l\'equipement\");\n';
						app_zwave = app_zwave+'			console.log(\"  Requete :\" + http_request);\n'; 
						app_zwave = app_zwave+'			request(http_request, function(error, response, body)\n';
						app_zwave = app_zwave+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';

						app_zwave = app_zwave+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Batterie: \" + bat);\n';
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
					
					//periph_jeedom = replace_special_char(name_eqp).s;
					periph_jeedom = S(name_eqp).replaceAll(' ', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('/', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('\\', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('-', '').s;
					periph_jeedom = S(periph_jeedom).replaceAll('.', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('?', '').s;
					jid = "j_"+periph_jeedom;
						//jidbatterie = "j_"+periph_jeedom+"_batterie";
						//jidradio = "j_"+periph_jeedom+"_radio";
					jid_descr = jid_descr+'var '+jid+' = \'\';\n';
						//jid_descr = jid_descr+'var '+jidbatterie+' = \'\';\n';
						//jid_descr = jid_descr+'var '+jidradio+' = \'\';\n';
					jid_file = jid_file+'\t'+jid+' = 42;\t//'+periph_jeedom+';\n';
						//jid_file = jid_file+'\t\t'+jidbatterie+' = 84;\t//'+periph_jeedom+';\n';
						//jid_file = jid_file+'\t\t\t'+jidradio+' = 84;\t//'+periph_jeedom+';\n';
					periph_file = periph_file+type_eqp+'\t'+periph_jeedom+'\t'+id_eqp+'\tid_'+'\n';
					
					app_xdd868intershutter = app_xdd868intershutter+'\n		if (S(msg).include(\'Inter/shutter RFY433\') && S(msg).include("'+id_eqp+'_ON"))\n';
					app_xdd868intershutter = app_xdd868intershutter+'		{\n';
					app_xdd868intershutter = app_xdd868intershutter+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+' et de statut ONet de type '+type_eqp+'\");\n';
					app_xdd868intershutter = app_xdd868intershutter+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=1\";\n';
					app_xdd868intershutter = app_xdd868intershutter+'			console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Ouverture volet de l\'equipement \");\n';
					app_xdd868intershutter = app_xdd868intershutter+'			console.log(\"  Requete :\" + http_request);\n'; 
					app_xdd868intershutter = app_xdd868intershutter+'			request(http_request, function(error, response, body)\n';
					app_xdd868intershutter = app_xdd868intershutter+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_xdd868intershutter = app_xdd868intershutter+'			nb_http_request = nb_http_request + 1;\n';

					/*app_xdd868intershutter = app_xdd868intershutter+'			if (S(msg).include(\'Level\'))\n';
					app_xdd868intershutter = app_xdd868intershutter+'			{\n';
					app_xdd868intershutter = app_xdd868intershutter+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidradio+'+\"&value=\"+lev;\n';
					app_xdd868intershutter = app_xdd868intershutter+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Niveau reception radio: \" + lev);\n';
					app_xdd868intershutter = app_xdd868intershutter+'				console.log(\"  Requete :\" + http_request);\n';
					app_xdd868intershutter = app_xdd868intershutter+'				request(http_request, function(error, response, body)\n';
					app_xdd868intershutter = app_xdd868intershutter+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_xdd868intershutter = app_xdd868intershutter+'				nb_http_request = nb_http_request + 1;\n';
					app_xdd868intershutter = app_xdd868intershutter+'			};\n';
					app_xdd868intershutter = app_xdd868intershutter+'			if (S(msg).include(\'Batt\'))\n';
					app_xdd868intershutter = app_xdd868intershutter+'			{\n';
					app_xdd868intershutter = app_xdd868intershutter+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
					app_xdd868intershutter = app_xdd868intershutter+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Batterie: \" + bat);\n';
					app_xdd868intershutter = app_xdd868intershutter+'				console.log(\"  Requete :\" + http_request);\n';
					app_xdd868intershutter = app_xdd868intershutter+'				request(http_request, function(error, response, body)\n';
					app_xdd868intershutter = app_xdd868intershutter+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_xdd868intershutter = app_xdd868intershutter+'				nb_http_request = nb_http_request + 1;\n';
					app_xdd868intershutter = app_xdd868intershutter+'			};\n';*/
					app_xdd868intershutter = app_xdd868intershutter+'		}\n';
					
					app_xdd868intershutter = app_xdd868intershutter+'\n		if (S(msg).include(\'Inter/shutter RFY433\') && S(msg).include("'+id_eqp+'_OFF"))\n';
					app_xdd868intershutter = app_xdd868intershutter+'		{\n';
					app_xdd868intershutter = app_xdd868intershutter+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+' et de statut OFF et de type '+type_eqp+'\");\n';
					app_xdd868intershutter = app_xdd868intershutter+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=0\";\n';
					app_xdd868intershutter = app_xdd868intershutter+'			console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Fermeture volet de l\'equipement \");\n';
					app_xdd868intershutter = app_xdd868intershutter+'			console.log(\"  Requete :\" + http_request);\n'; 
					app_xdd868intershutter = app_xdd868intershutter+'			request(http_request, function(error, response, body)\n';
					app_xdd868intershutter = app_xdd868intershutter+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_xdd868intershutter = app_xdd868intershutter+'			nb_http_request = nb_http_request + 1;\n';

					/*app_xdd868intershutter = app_xdd868intershutter+'			if (S(msg).include(\'Level\'))\n';
					app_xdd868intershutter = app_xdd868intershutter+'			{\n';
					app_xdd868intershutter = app_xdd868intershutter+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidradio+'+\"&value=\"+lev;\n';
					app_xdd868intershutter = app_xdd868intershutter+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Niveau reception radio: \" + lev);\n';
					app_xdd868intershutter = app_xdd868intershutter+'				console.log(\"  Requete :\" + http_request);\n';
					app_xdd868intershutter = app_xdd868intershutter+'				request(http_request, function(error, response, body)\n';
					app_xdd868intershutter = app_xdd868intershutter+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_xdd868intershutter = app_xdd868intershutter+'				nb_http_request = nb_http_request + 1;\n';
					app_xdd868intershutter = app_xdd868intershutter+'			};\n';
					app_xdd868intershutter = app_xdd868intershutter+'			if (S(msg).include(\'Batt\'))\n';
					app_xdd868intershutter = app_xdd868intershutter+'			{\n';
					app_xdd868intershutter = app_xdd868intershutter+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
					app_xdd868intershutter = app_xdd868intershutter+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Batterie: \" + bat);\n';
					app_xdd868intershutter = app_xdd868intershutter+'				console.log(\"  Requete :\" + http_request);\n';
					app_xdd868intershutter = app_xdd868intershutter+'				request(http_request, function(error, response, body)\n';
					app_xdd868intershutter = app_xdd868intershutter+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_xdd868intershutter = app_xdd868intershutter+'				nb_http_request = nb_http_request + 1;\n';
					app_xdd868intershutter = app_xdd868intershutter+'			};\n';*/	
					app_xdd868intershutter = app_xdd868intershutter+'		}\n';
					
					app_xdd868intershutter = app_xdd868intershutter+'\n		if (S(msg).include(\'Inter/shutter RFY433\') && S(msg).include("'+id_eqp+'") && S(msg).include("DIM/SPECIAL"))\n';
					app_xdd868intershutter = app_xdd868intershutter+'		{\n';
					app_xdd868intershutter = app_xdd868intershutter+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' de statu DIM/SPECIAL et de type '+type_eqp+'\");\n';
					app_xdd868intershutter = app_xdd868intershutter+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=2\";\n';
					app_xdd868intershutter = app_xdd868intershutter+'			console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Arret volet de l\'equipement \");\n';
					app_xdd868intershutter = app_xdd868intershutter+'			console.log(\"  Requete :\" + http_request);\n'; 
					app_xdd868intershutter = app_xdd868intershutter+'			request(http_request, function(error, response, body)\n';
					app_xdd868intershutter = app_xdd868intershutter+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_xdd868intershutter = app_xdd868intershutter+'			nb_http_request = nb_http_request + 1;\n';

					/*app_xdd868intershutter = app_xdd868intershutter+'			if (S(msg).include(\'Level\'))\n';
					app_xdd868intershutter = app_xdd868intershutter+'			{\n';
					app_xdd868intershutter = app_xdd868intershutter+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidradio+'+\"&value=\"+lev;\n';
					app_xdd868intershutter = app_xdd868intershutter+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Niveau reception radio: \" + lev);\n';
					app_xdd868intershutter = app_xdd868intershutter+'				console.log(\"  Requete :\" + http_request);\n';
					app_xdd868intershutter = app_xdd868intershutter+'				request(http_request, function(error, response, body)\n';
					app_xdd868intershutter = app_xdd868intershutter+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_xdd868intershutter = app_xdd868intershutter+'				nb_http_request = nb_http_request + 1;\n';
					app_xdd868intershutter = app_xdd868intershutter+'			};\n';
					app_xdd868intershutter = app_xdd868intershutter+'			if (S(msg).include(\'Batt\'))\n';
					app_xdd868intershutter = app_xdd868intershutter+'			{\n';
					app_xdd868intershutter = app_xdd868intershutter+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
					app_xdd868intershutter = app_xdd868intershutter+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Batterie: \" + bat);\n';
					app_xdd868intershutter = app_xdd868intershutter+'				console.log(\"  Requete :\" + http_request);\n';
					app_xdd868intershutter = app_xdd868intershutter+'				request(http_request, function(error, response, body)\n';
					app_xdd868intershutter = app_xdd868intershutter+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_xdd868intershutter = app_xdd868intershutter+'				nb_http_request = nb_http_request + 1;\n';
					app_xdd868intershutter = app_xdd868intershutter+'			};\n';*/
					app_xdd868intershutter = app_xdd868intershutter+'		}\n';

					count_periph++;
					bool_periph_added = 1;

					script_zidom = script_zidom+'//Ajout des scripts ZAPI1 pour ' + name_eqp + ':\n';
					script_zidom = script_zidom+' Pour Ouvrir ' + name_eqp + ':\n';
					script_zidom = script_zidom+zibase_ip+'/cgi-bin/domo.cgi?cmd=ON%20'+id_eqp+'%20P10\n';
					script_zidom = script_zidom+' Pour Fermer ' + name_eqp + ':\n';
					script_zidom = script_zidom+zibase_ip+'/cgi-bin/domo.cgi?cmd=OFF%20'+id_eqp+'%20P10\n';
					script_zidom = script_zidom+' Pour Arreter ' + name_eqp + ':\n';
					script_zidom = script_zidom+zibase_ip+'/cgi-bin/domo.cgi?cmd=DIM%20'+id_eqp+'%20P10%2050\n';
				}
				else if (proto =="XDD868PilotWire")
				{
					console.log(" Equipement de protocole "+proto+".");
					console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id : "+ id_eqp);
					console.log("  Ajout dans le script Zidom du test de remontee sur cet equipement");
					
					//periph_jeedom = replace_special_char(name_eqp).s;
					periph_jeedom = S(name_eqp).replaceAll(' ', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('/', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('\\', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('-', '').s;
					periph_jeedom = S(periph_jeedom).replaceAll('.', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('?', '').s;
					jid = "j_"+periph_jeedom;
						jidcmd = "j_"+periph_jeedom+"_cmd";
						//jidbatterie = "j_"+periph_jeedom+"_batterie";
						//jidradio = "j_"+periph_jeedom+"_radio";						
					jid_descr = jid_descr+'var '+jid+' = \'\';\n';
						jid_descr = jid_descr+'var '+jidradio+' = \'\';\n';
						//jid_descr = jid_descr+'var '+jidbatterie+' = \'\';\n';
						//jid_descr = jid_descr+'var '+jidradio+' = \'\';\n';
					jid_file = jid_file+'\t'+jid+' = 42;\t//'+periph_jeedom+';\n';
						jid_file = jid_file+'\t\t\t'+jidcmd+' = 88;\t//'+periph_jeedom+';\n';
						//jid_file = jid_file+'\t\t'+jidbatterie+' = 84;\t//'+periph_jeedom+';\n';
						//jid_file = jid_file+'\t\t\t'+jidradio+' = 84;\t//'+periph_jeedom+';\n';
					periph_file = periph_file+type_eqp+'\t'+periph_jeedom+'\t'+id_eqp+'\tid_'+'\n';

					app_xdd868pilotwire = app_xdd868pilotwire+'\n		if (xdd868pilotwire_id=="'+id_eqp+'")\n';
					app_xdd868pilotwire=app_xdd868pilotwire+'		{\n';					
					//app_xdd868pilotwire = app_xdd868pilotwire+'\n			if (S(msg).include(\'XDD868 Radiator/Pilot Wire\') && S(msg).include("'+id_eqp+'_ON"))\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'\n			if (xdd868pilotwire_id=="'+id_eqp+'" && xdd868pilotwire_status=="ON")\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'			{\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+', de statut ON, de commande '+jidcmd+' et de type '+type_eqp+'\");\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=1\";\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Activation de l\'equipement\");\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\"  Requete :\" + http_request);\n'; 
					app_xdd868pilotwire = app_xdd868pilotwire+'				request(http_request, function(error, response, body)\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				nb_http_request = nb_http_request + 1;\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=\"+'+jidcmd+';\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Commande de l\'equipement\");\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\"  Requete :\" + http_request);\n'; 
					app_xdd868pilotwire = app_xdd868pilotwire+'				request(http_request, function(error, response, body)\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				nb_http_request = nb_http_request + 1;\n';

					/*app_xdd868pilotwire = app_xdd868pilotwire+'			if (S(msg).include(\'Level\'))\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'			{\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidradio+'+\"&value=\"+lev;\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Niveau reception radio: \" + lev);\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\"  Requete :\" + http_request);\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				request(http_request, function(error, response, body)\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				nb_http_request = nb_http_request + 1;\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'			};\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'			if (S(msg).include(\'Batt\'))\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'			{\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Batterie: \" + bat);\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\"  Requete :\" + http_request);\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				request(http_request, function(error, response, body)\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				nb_http_request = nb_http_request + 1;\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'			};\n';*/
					app_xdd868pilotwire = app_xdd868pilotwire+'			}\n';
					
					//app_xdd868pilotwire = app_xdd868pilotwire+'			if (S(msg).include(\'XDD868 Radiator/Pilot Wire\') && S(msg).include("'+id_eqp+'_OFF"))\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'\n			if (xdd868pilotwire_id=="'+id_eqp+'" && xdd868pilotwire_status=="OFF")\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'			{\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+', de statut OFF, de commande '+jidcmd+' et de type '+type_eqp+'\");\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=0\";\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', DESActivation de l\'equipement\");\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\"  Requete :\" + http_request);\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				request(http_request, function(error, response, body)\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				nb_http_request = nb_http_request + 1;\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=\"+'+jidcmd+';\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Commande de l\'equipement\");\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\"  Requete :\" + http_request);\n'; 
					app_xdd868pilotwire = app_xdd868pilotwire+'				request(http_request, function(error, response, body)\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				nb_http_request = nb_http_request + 1;\n';

					/*app_xdd868pilotwire = app_xdd868pilotwire+'			if (S(msg).include(\'Level\'))\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'			{\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidradio+'+\"&value=\"+lev;\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Niveau reception radio: \" + lev);\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\"  Requete :\" + http_request);\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				request(http_request, function(error, response, body)\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				nb_http_request = nb_http_request + 1;\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'			};\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'			if (S(msg).include(\'Batt\'))\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'			{\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Batterie: \" + bat);\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\"  Requete :\" + http_request);\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				request(http_request, function(error, response, body)\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				nb_http_request = nb_http_request + 1;\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'			};\n';*/
					app_xdd868pilotwire = app_xdd868pilotwire+'			}\n';

					//app_xdd868pilotwire = app_xdd868pilotwire+'\n			if (S(msg).include(\'XDD868 Radiator/Pilot Wire\') && S(msg).include("'+id_eqp+'") && S(msg).include("DIM/SPECIAL"))\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'\n			if (xdd868pilotwire_id=="'+id_eqp+'" && xdd868pilotwire_status=="DIM/SPECIAL")\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'			{\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+', de statut DIM/SPECIAL, de commande '+jidcmd+' de type '+type_eqp+'\");\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=2\";\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', DIM/SPECIAL de l\equipement\");\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\"  Requete :\" + http_request);\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				request(http_request, function(error, response, body)\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				nb_http_request = nb_http_request + 1;\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=\"+'+jidcmd+';\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Commande de l\'equipement\");\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\"  Requete :\" + http_request);\n'; 
					app_xdd868pilotwire = app_xdd868pilotwire+'				request(http_request, function(error, response, body)\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				nb_http_request = nb_http_request + 1;\n';

					/*app_xdd868pilotwire = app_xdd868pilotwire+'			if (S(msg).include(\'Level\'))\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'			{\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidradio+'+\"&value=\"+lev;\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Niveau reception radio: \" + lev);\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\"  Requete :\" + http_request);\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				request(http_request, function(error, response, body)\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				nb_http_request = nb_http_request + 1;\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'			};\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'			if (S(msg).include(\'Batt\'))\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'			{\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Batterie: \" + bat);\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\"  Requete :\" + http_request);\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				request(http_request, function(error, response, body)\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				nb_http_request = nb_http_request + 1;\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'			};\n';*/
					app_xdd868pilotwire = app_xdd868pilotwire+'			}\n';

					//app_xdd868pilotwire = app_xdd868pilotwire+'\n			if (S(msg).include(\'XDD868 Radiator/Pilot Wire\') && S(msg).include("'+id_eqp+'") && S(msg).include("DIM/SPECIAL"))\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'\n			if (xdd868pilotwire_id=="'+id_eqp+'" && xdd868pilotwire_status=="UNKNOWN")\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'			{\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+', de statut UNKNOWN, de commande '+jidcmd+' de type '+type_eqp+'\");\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=3\";\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', DIM/SPECIAL de l\equipement\");\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\"  Requete :\" + http_request);\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				request(http_request, function(error, response, body)\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				nb_http_request = nb_http_request + 1;\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=\"+'+jidcmd+';\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Commande de l\'equipement\");\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\"  Requete :\" + http_request);\n'; 
					app_xdd868pilotwire = app_xdd868pilotwire+'				request(http_request, function(error, response, body)\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				nb_http_request = nb_http_request + 1;\n';

					/*app_xdd868pilotwire = app_xdd868pilotwire+'			if (S(msg).include(\'Level\'))\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'			{\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidradio+'+\"&value=\"+lev;\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Niveau reception radio: \" + lev);\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\"  Requete :\" + http_request);\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				request(http_request, function(error, response, body)\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				nb_http_request = nb_http_request + 1;\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'			};\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'			if (S(msg).include(\'Batt\'))\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'			{\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Batterie: \" + bat);\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				console.log(\"  Requete :\" + http_request);\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				request(http_request, function(error, response, body)\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'				nb_http_request = nb_http_request + 1;\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'			};\n';*/
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
					
					//periph_jeedom = replace_special_char(name_eqp).s;
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
					
					jid_descr = jid_descr+'var '+jid+' = \'\';\n';
						jid_descr = jid_descr+'var '+jid+'_previous_receive = 0;\n';
						jid_descr = jid_descr+'var '+jidhygro+' = \'\';\n';
						jid_descr = jid_descr+'var '+jidbatterie+' = \'\';\n';
						jid_descr = jid_descr+'var '+jidradio+' = \'\';\n';
					jid_file = jid_file+'\t'+jid+' = 42;\t//'+periph_jeedom+';\n';
						jid_file = jid_file+'\t\t'+jidhygro+' = 42;\t//'+periph_jeedom+';\n';
						jid_file = jid_file+'\t\t\t'+jidbatterie+' = 84;\t//'+periph_jeedom+';\n';
						jid_file = jid_file+'\t\t\t\t'+jidradio+' = 88;\t//'+periph_jeedom+';\n';
					periph_file = periph_file+type_eqp+'\t'+periph_jeedom+'\t'+id_eqp+'\tid_'+'\n';

					app_undefined = app_undefined+'\n		if (id=="'+id_eqp+'")\n';
					app_undefined = app_undefined+'		{\n';
					app_undefined = app_undefined+'			var nowseconds = new Date().getTime();\n';
					app_undefined = app_undefined+'			delta_receive = nowseconds - '+jid+'_previous_receive;\n';
					app_undefined = app_undefined+'			//console.log("Timestamp de reception de cette Alarme : "+nowseconds);\n';
					app_undefined = app_undefined+'			//console.log("Timestamp de reception de la precedente Alarme : "+'+jid+'_previous_receive);\n';
					app_undefined = app_undefined+'			//console.log("Delta de reception entre les Alarme : "+delta_receive);\n';
					app_undefined = app_undefined+'			console.log(\" Test de l equipement Oregon ' + name_eqp + ', d\'ID Zibase '+id_eqp+' et de type '+type_eqp+'\");\n';
					app_undefined = app_undefined+'			if (delta_receive > inter_time_oregon)\n';
					app_undefined = app_undefined+'			{\n';		
					app_undefined = app_undefined+'				//console.log(\" Test de l equipement Oregon ' + name_eqp + ', d\'ID Zibase '+id_eqp+' et de type '+type_eqp+'\");\n';
					app_undefined = app_undefined+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=\" + tem;\n';
					app_undefined = app_undefined+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', temperature: \" + tem);\n';
					app_undefined = app_undefined+'				console.log(\"  Requete :\" + http_request);\n';
					app_undefined = app_undefined+'				request(http_request, function(error, response, body)\n';
					app_undefined = app_undefined+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_undefined = app_undefined+'				nb_http_request = nb_http_request + 1;\n';

					app_undefined = app_undefined+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidradio+'+\"&value=\"+lev;\n';
					app_undefined = app_undefined+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Niveau de reception radio: \"+lev);\n';
					app_undefined = app_undefined+'				console.log(\"  Requete :\" + http_request);\n';
					app_undefined = app_undefined+'				request(http_request, function(error, response, body)\n';
					app_undefined = app_undefined+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_undefined = app_undefined+'				nb_http_request = nb_http_request + 1;\n';

					app_undefined = app_undefined+'				if (S(msg).include(\'Batt\'))\n';
					app_undefined = app_undefined+'				{\n';
					app_undefined = app_undefined+'					http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
					app_undefined = app_undefined+'					console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Batterie: \" + bat);\n';
					app_undefined = app_undefined+'					console.log(\"  Requete :\" + http_request);\n';
					app_undefined = app_undefined+'					request(http_request, function(error, response, body)\n';
					app_undefined = app_undefined+'					{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_undefined = app_undefined+'					nb_http_request = nb_http_request + 1;\n';
					app_undefined = app_undefined+'				};\n';					
					app_undefined = app_undefined+'				if (S(msg).include(\'Humidity\'))\n';
					app_undefined = app_undefined+'				{\n';
					app_undefined = app_undefined+'					http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidhygro+'+\"&value=\" + hum\n';
					app_undefined = app_undefined+'					console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Hygrometrie: \" + hum);\n';
					app_undefined = app_undefined+'					console.log(\"  Requete :\" + http_request);\n';
					app_undefined = app_undefined+'					request(http_request, function(error, response, body)\n';
					app_undefined = app_undefined+'					{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_undefined = app_undefined+'					nb_http_request = nb_http_request + 1;\n';
					app_undefined = app_undefined+'				}\n';
					app_undefined = app_undefined+'				'+jid+'_previous_receive = new Date().getTime();\n';
					app_undefined = app_undefined+'				oregon_prev = true;\n';
					app_undefined = app_undefined+'			}\n';
					app_undefined = app_undefined+'			else \n';
					app_undefined = app_undefined+'			{\n';
					app_undefined = app_undefined+'				//console.log(\"  Aucun envoi de requete HTTP : precedente remontee de temperature trop recente.");\n';
					app_undefined = app_undefined+'				oregon_prev = false;\n';
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

					//periph_jeedom = replace_special_char(name_eqp).s;
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
					//jid_descr = jid_descr+'var '+jid+' = \'\';\n';
						jid_descr = jid_descr+'var '+jidpowertotal+' = \'\';\n';
						jid_descr = jid_descr+'var '+jidpowerpower+' = \'\';\n';
						jid_descr = jid_descr+'var '+jidbatterie+' = \'\';\n';
						jid_descr = jid_descr+'var '+jidradio+' = \'\';\n';
					//jid_file = jid_file+'\t'+jid+' = 42;\t//'+periph_jeedom+';\n';
						jid_file = jid_file+'\t'+jidpowertotal+' = 88;\t//'+periph_jeedom+';\n';
						jid_file = jid_file+'\t\t'+jidpowerpower+' = 88;\t//'+periph_jeedom+';\n';
						jid_file = jid_file+'\t\t\t'+jidbatterie+' = 84;\t//'+periph_jeedom+';\n';
						jid_file = jid_file+'\t\t\t\t'+jidradio+' = 88;\t//'+periph_jeedom+';\n';
					periph_file = periph_file+type_eqp+'\t'+periph_jeedom+'\t'+id_eqp+'\tid_'+'\n';

					app_undefined = app_undefined+'\n		if (owl_id=="'+id_eqp+'")\n';
					app_undefined = app_undefined+'		{\n';
					app_undefined = app_undefined+'			console.log(\" Test de l equipement OWL ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+' et de statut POWER et de type '+type_eqp+'\");\n';
					app_undefined = app_undefined+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidpowertotal+'+\"&value=\" + kwh;\n';
					
					app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP | Procole '+proto+',  Power Total Energy: \" + kwh);\n';
					app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
					app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
					app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';

					app_undefined = app_undefined+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidpowerpower+'+\"&value=\" + w;\n';
					app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Power: \" + w);\n';
					app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
					app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
					app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';

					app_undefined = app_undefined+'			if (S(msg).include(\'Batt\'))\n';
					app_undefined = app_undefined+'			{\n';
					app_undefined = app_undefined+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
					app_undefined = app_undefined+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+',  Batterie: \" + bat);\n';
					app_undefined = app_undefined+'				console.log(\"  Requete :\" + http_request);\n';
					app_undefined = app_undefined+'				request(http_request, function(error, response, body)\n';
					app_undefined = app_undefined+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
					app_undefined = app_undefined+'				nb_http_request = nb_http_request + 1;\n';
					app_undefined = app_undefined+'			};\n';
					app_undefined = app_undefined+'		}\n';

					count_periph++;
					bool_periph_added = 1;
				}
				else if (proto == "undefined")
				{
					console.log(" Equipement de protocole "+proto+".");
					/*if (type_eqp =="power")
					{
						//periph_jeedom = replace_special_char(name_eqp).s;
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
						
						//jid_descr = jid_descr+'var '+jid+' = \'\';\n';
							jid_descr = jid_descr+'var '+jidpowertotal+' = require(\'string\');\n';
							jid_descr = jid_descr+'var '+jidpowerpower+' = require(\'string\');\n';
							jid_descr = jid_descr+'var '+jidbatterie+' = \'\';\n';
							jid_descr = jid_descr+'var '+jidradio+' = \'\';\n';
						//jid_file = jid_file+'\t'+jid+' = 42;\t//'+periph_jeedom+';\n';
							jid_file = jid_file+'\t'+jidpowertotal+' = 88;\t//'+periph_jeedom+';\n';
							jid_file = jid_file+'\t\t'+jidpowerpower+' = 88;\t//'+periph_jeedom+';\n';
							jid_file = jid_file+'\t\t\t'+jidbatterie+' = 84;\t//'+periph_jeedom+';\n';
							jid_file = jid_file+'\t\t\t\t'+jidradio+' = 88;\t//'+periph_jeedom+';\n';
						periph_file = periph_file+type_eqp+'\t'+periph_jeedom+'\t'+id_eqp+'\tid_'+'\n';
						
						console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id : "+ id_eqp);
						console.log("  Ajout dans le script Zidom du test de remontee sur ce Power OWL");
						app_undefined = app_undefined+'\n		if (owl_id=="'+id_eqp+'")\n';
						app_undefined = app_undefined+'		{\n';
						app_undefined = app_undefined+'			console.log(\" Test de l equipement OWL ' + name_eqp + ', d\'ID Zibase '+id_eqp+' d\'ID Jeedom '+jid+' et de statut POWER et de type '+type_eqp+'\");\n';
						app_undefined = app_undefined+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidpowertotal+'+\"&value=\" + kwh;\n';
						
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Power Total Energy: \" + kwh);\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';

						app_undefined = app_undefined+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidpowerpower+'+\"&value=\" + w;\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Power: \" + w);\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';

						app_undefined = app_undefined+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Batterie: \" + bat);\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';
						app_undefined = app_undefined+'			}\n';

						count_periph++;
					}*/

					//Traitements des sondes de Temperature					
					if (type_eqp == "temperature")
					{
						console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id : "+ id_eqp);
						console.log("  Ajout dans le script Zidom du test de remontee sur ce transmitter");
					
						//periph_jeedom = replace_special_char(name_eqp).s;
						periph_jeedom = S(name_eqp).replaceAll(' ', '_').s;
						periph_jeedom = S(periph_jeedom).replaceAll('/', '_').s;
						periph_jeedom = S(periph_jeedom).replaceAll('\\', '_').s;
						periph_jeedom = S(periph_jeedom).replaceAll('-', '').s;
						periph_jeedom = S(periph_jeedom).replaceAll('.', '_').s;
						periph_jeedom = S(periph_jeedom).replaceAll('?', '').s;
						jid = "j_"+periph_jeedom;
							jidnoise = "j_"+periph_jeedom+"_noise";
							jidhygro = "j_"+periph_jeedom+"_hygro";
							jidbatterie = "j_"+periph_jeedom+"_batterie";
							jidradio = "j_"+periph_jeedom+"_radio";
						
						jid_descr = jid_descr+'var '+jid+' = \'\';\n';
							jid_descr = jid_descr+'var '+jidnoise+' = \'\';\n';
							jid_descr = jid_descr+'var '+jidhygro+' = \'\';\n';
							jid_descr = jid_descr+'var '+jidbatterie+' = \'\';\n';
							jid_descr = jid_descr+'var '+jidradio+' = \'\';\n';
						jid_file = jid_file+'\t'+jid+' = 42;\t//'+periph_jeedom+';\n';
							jid_file = jid_file+'\t\t'+jidnoise+' = 42;\t//'+periph_jeedom+';\n';
							jid_file = jid_file+'\t\t\t'+jidhygro+' = 42;\t//'+periph_jeedom+';\n';
							jid_file = jid_file+'\t\t\t\t'+jidbatterie+' = 84;\t//'+periph_jeedom+';\n';
							jid_file = jid_file+'\t\t\t\t\t'+jidradio+' = 88;\t//'+periph_jeedom+';\n';
						periph_file = periph_file+type_eqp+'\t'+periph_jeedom+'\t'+id_eqp+'\tid_'+'\n';

						app_undefined = app_undefined+'\n		if (id=="'+id_eqp+'")\n';
						app_undefined = app_undefined+'		{\n';
						app_undefined = app_undefined+'			console.log(\" Test de l equipement Temperature ' + name_eqp + ', d\'ID Zibase '+id_eqp+' et de type '+type_eqp+'\");\n';
						app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=\" + tem;\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP | Procole '+proto+', temperature: \" + tem);\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';

						app_undefined = app_undefined+'			if (S(msg).include(\'Noise\'))\n';
						app_undefined = app_undefined+'			{\n';
						app_undefined = app_undefined+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidnoise+'+\"&value=\"+noise;\n';
						app_undefined = app_undefined+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Niveau de Bruit radio (noise): \" + noise);\n';
						app_undefined = app_undefined+'				console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'				request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'				nb_http_request = nb_http_request + 1;\n';
						app_undefined = app_undefined+'			};\n';
						app_undefined = app_undefined+'			if (S(msg).include(\'Level\'))\n';
						app_undefined = app_undefined+'			{\n';
						app_undefined = app_undefined+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidradio+'+\"&value=\"+lev;\n';
						app_undefined = app_undefined+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Niveau reception radio: \" + lev);\n';
						app_undefined = app_undefined+'				console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'				request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'				nb_http_request = nb_http_request + 1;\n';
						app_undefined = app_undefined+'			};\n';
						app_undefined = app_undefined+'			if (S(msg).include(\'Batt\'))\n';
						app_undefined = app_undefined+'			{\n';
						app_undefined = app_undefined+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
						app_undefined = app_undefined+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Batterie: \" + bat);\n';
						app_undefined = app_undefined+'				console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'				request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'				nb_http_request = nb_http_request + 1;\n';

						app_undefined = app_undefined+'				if (S(msg).include(\'Noise\'))\n';
						app_undefined = app_undefined+'				{\n';
						app_undefined = app_undefined+'					http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidnoise+'+\"&value=\"+noise;\n';
						app_undefined = app_undefined+'					console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Niveau de Bruit radio (noise): \" + noise);\n';
						app_undefined = app_undefined+'					console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'					request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'					{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'					nb_http_request = nb_http_request + 1;\n';
						app_undefined = app_undefined+'				};\n';
						app_undefined = app_undefined+'				if (S(msg).include(\'Level\'))\n';
						app_undefined = app_undefined+'				{\n';
						app_undefined = app_undefined+'					http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidradio+'+\"&value=\"+lev;\n';
						app_undefined = app_undefined+'					console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Niveau reception radio: \" + lev);\n';
						app_undefined = app_undefined+'					console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'					request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'					{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'					nb_http_request = nb_http_request + 1;\n';
						app_undefined = app_undefined+'				};\n';
						app_undefined = app_undefined+'				if (S(msg).include(\'Batt\'))\n';
						app_undefined = app_undefined+'				{\n';
						app_undefined = app_undefined+'					http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
						app_undefined = app_undefined+'					console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Batterie: \" + bat);\n';
						app_undefined = app_undefined+'					console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'					request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'					{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'					nb_http_request = nb_http_request + 1;\n';
						app_undefined = app_undefined+'				};\n';
						app_undefined = app_undefined+'			};\n';
						app_undefined = app_undefined+'		}\n';
					}

					//console.log(" Equipement de protocole "+proto+".");
					//Traitements des sondes Rain (pluviometre)
					if (type_eqp == "rain")
					{
						console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id : "+ id_eqp);
						console.log("  Ajout dans le script Zidom du test de remontee sur ce transmitter");
					
						//periph_jeedom = replace_special_char(name_eqp).s;
					periph_jeedom = S(name_eqp).replaceAll(' ', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('/', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('\\', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('-', '').s;
					periph_jeedom = S(periph_jeedom).replaceAll('.', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('?', '').s;
						//jid = "j_"+periph_jeedom;
							jidnoise = "j_"+periph_jeedom+"_noise";
							jidradio = "j_"+periph_jeedom+"_radio";
							jidtotalrain = "j_"+periph_jeedom+"_totalrain";
							jidcurrentrain = "j_"+periph_jeedom+"_currentrain";
							jidbatterie = "j_"+periph_jeedom+"_batterie";
						//jid_descr = jid_descr+'var '+jid+' = \'\';\n';
							jid_descr = jid_descr+'var '+jidnoise+' = \'\';\n';
							jid_descr = jid_descr+'var '+jidradio+' = \'\';\n';
							jid_descr = jid_descr+'var '+jidtotalrain+' = \'\';\n';
							jid_descr = jid_descr+'var '+jidcurrentrain+' = \'\';\n';
							jid_descr = jid_descr+'var '+jidbatterie+' = \'\';\n';
						//jid_file = jid_file+'\t'+jid+' = 42;\t//'+periph_jeedom+';\n';
							jid_file = jid_file+'\t\t'+jidnoise+' = 42;\t//'+periph_jeedom+';\n';
							jid_file = jid_file+'\t\t\t'+jidradio+' = 42;\t//'+periph_jeedom+';\n';
							jid_file = jid_file+'\t\t\t\t'+jidtotalrain+' = 42;\t//'+periph_jeedom+';\n';
							jid_file = jid_file+'\t\t\t\t\t'+jidcurrentrain+' = 42;\t//'+periph_jeedom+';\n';
							jid_file = jid_file+'\t\t\t\t\t\t'+jidbatterie+' = 84;\t//'+periph_jeedom+';\n';
						periph_file = periph_file+type_eqp+'\t'+periph_jeedom+'\t'+id_eqp+'\tid_'+'\n';

						app_undefined = app_undefined+'\n		if (id=="'+id_eqp+'")\n';
						app_undefined = app_undefined+'		{\n';
						//29/10/2014 19:58:53    Received radio ID (433Mhz Oregon Noise=2482 Level=5.0/5 PCR800 Total Rain=40mm Current Rain=236mm/hour Batt=Ok) Pluviomètre (OS706331648)
						app_undefined = app_undefined+'			console.log(\" Test de l equipement rain ' + name_eqp + ', d\'ID Zibase '+id_eqp+' et de type '+type_eqp+'\");\n';
						app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidtotalrain+'+\"&value=\"+totalrain;\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Total Rain (sur pluviometre): \" + totalrain);\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';

						app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidcurrentrain+'+\"&value=\"+currentrain;\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Current Rain (sur pluviometre): \" + currentrain);\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';

						app_undefined = app_undefined+'			if (S(msg).include(\'Noise\'))\n';
						app_undefined = app_undefined+'			{\n';
						app_undefined = app_undefined+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidnoise+'+\"&value=\"+noise;\n';
						app_undefined = app_undefined+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Niveau de Bruit radio (noise): \" + noise);\n';
						app_undefined = app_undefined+'				console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'				request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'				nb_http_request = nb_http_request + 1;\n';
						app_undefined = app_undefined+'			};\n';
						app_undefined = app_undefined+'			if (S(msg).include(\'Level\'))\n';
						app_undefined = app_undefined+'			{\n';
						app_undefined = app_undefined+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidradio+'+\"&value=\"+lev;\n';
						app_undefined = app_undefined+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Niveau reception radio: \" + lev);\n';
						app_undefined = app_undefined+'				console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'				request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'				nb_http_request = nb_http_request + 1;\n';
						app_undefined = app_undefined+'			};\n';
						app_undefined = app_undefined+'			if (S(msg).include(\'Batt\'))\n';
						app_undefined = app_undefined+'			{\n';
						app_undefined = app_undefined+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
						app_undefined = app_undefined+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Batterie: \" + bat);\n';
						app_undefined = app_undefined+'				console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'				request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'				nb_http_request = nb_http_request + 1;\n';
						app_undefined = app_undefined+'			};\n';
						app_undefined = app_undefined+'		}\n';
					}

					//Traitements des sondes Wind (anemometre)	Received radio ID (433Mhz Oregon Noise=2494 Level=1.9/5 WGR800 Avg.Wind=0.9m/s Dir.=180° Batt=Ok) 				
					if (type_eqp == "wind")
					{
						console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id : "+ id_eqp);
						console.log("  Ajout dans le script Zidom du test de remontee sur ce transmitter");

						//periph_jeedom = replace_special_char(name_eqp).s;
					periph_jeedom = S(name_eqp).replaceAll(' ', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('/', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('\\', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('-', '').s;
					periph_jeedom = S(periph_jeedom).replaceAll('.', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('?', '').s;
						//jid = "j_"+periph_jeedom;
							jidnoise = "j_"+periph_jeedom+"_noise";
							jidradio = "j_"+periph_jeedom+"_radio";
							jidavgwind = "j_"+periph_jeedom+"_avgwind";
							jiddir = "j_"+periph_jeedom+"_dir";
							jidbatterie = "j_"+periph_jeedom+"_batterie";						
						//jid_descr = jid_descr+'var '+jid+' = \'\';\n';
							jid_descr = jid_descr+'var '+jidnoise+' = \'\';\n';
							jid_descr = jid_descr+'var '+jidradio+' = \'\';\n';
							jid_descr = jid_descr+'var '+jidavgwind+' = \'\';\n';
							jid_descr = jid_descr+'var '+jiddir+' = \'\';\n';
							jid_descr = jid_descr+'var '+jidbatterie+' = \'\';\n';
						//jid_file = jid_file+'\t'+jid+' = 42;\t//'+periph_jeedom+';\n';
							jid_file = jid_file+'\t\t'+jidnoise+' = 42;\t//'+periph_jeedom+';\n';
							jid_file = jid_file+'\t\t\t'+jidradio+' = 42;\t//'+periph_jeedom+';\n';
							jid_file = jid_file+'\t\t\t\t'+jidavgwind+' = 42;\t//'+periph_jeedom+';\n';
							jid_file = jid_file+'\t\t\t\t\t'+jiddir+' = 42;\t//'+periph_jeedom+';\n';
							jid_file = jid_file+'\t\t\t\t\t\t'+jidbatterie+' = 84;\t//'+periph_jeedom+';\n';
						periph_file = periph_file+type_eqp+'\t'+periph_jeedom+'\t'+id_eqp+'\tid_'+'\n';

						app_undefined = app_undefined+'\n		if (id=="'+id_eqp+'")\n';
						app_undefined = app_undefined+'		{\n';
						//Received radio ID (433Mhz Oregon Noise=2494 Level=1.9/5 WGR800 Avg.Wind=0.9m/s Dir.=180° Batt=Ok) + " Vitesse vent : "+avgwind+", Direction : "+direction+" / Noise : "+ noise+ " / Radio : "+ level
						app_undefined = app_undefined+'			console.log(\" Test de l equipement Wind ' + name_eqp + ', d\'ID Zibase '+id_eqp+' et de type '+type_eqp+'\");\n';
						//app_undefined = app_undefined+'			console.log(\"  Données : \" + avgwind + " / Direction : "+ direction + "/ Noise : \" + noise);\n';
						app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidavgwind+'+\"&value=\"+avgwind;\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP | Procole '+proto+', wind (sur anemometre): \" + avgwind);\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';

						app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jiddir+'+\"&value=\"+direction;\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Direction du vent (sur anemometre): \" + direction);\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';

						app_undefined = app_undefined+'			if (S(msg).include(\'Noise\'))\n';
						app_undefined = app_undefined+'			{\n';
						app_undefined = app_undefined+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidnoise+'+\"&value=\"+noise;\n';
						app_undefined = app_undefined+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Niveau de Bruit radio (noise): \" + noise);\n';
						app_undefined = app_undefined+'				console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'				request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'				nb_http_request = nb_http_request + 1;\n';
						app_undefined = app_undefined+'			};\n';
						app_undefined = app_undefined+'			if (S(msg).include(\'Level\'))\n';
						app_undefined = app_undefined+'			{\n';
						app_undefined = app_undefined+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidradio+'+\"&value=\"+lev;\n';
						app_undefined = app_undefined+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Niveau reception radio: \" + lev);\n';
						app_undefined = app_undefined+'				console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'				request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'				nb_http_request = nb_http_request + 1;\n';
						app_undefined = app_undefined+'			};\n';
						app_undefined = app_undefined+'			if (S(msg).include(\'Batt\'))\n';
						app_undefined = app_undefined+'			{\n';
						app_undefined = app_undefined+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
						app_undefined = app_undefined+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Batterie: \" + bat);\n';
						app_undefined = app_undefined+'				console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'				request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'				nb_http_request = nb_http_request + 1;\n';
						app_undefined = app_undefined+'			};\n';
						app_undefined = app_undefined+'		}\n';
					}

					//Traitements des sondes de lumiere
					else if (type_eqp == "light")
					{
						console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id : "+ id_eqp);
						console.log("  Ajout dans le script Zidom du test de remontee sur ce transmitter");
					
						//periph_jeedom = replace_special_char(name_eqp).s;
					periph_jeedom = S(name_eqp).replaceAll(' ', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('/', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('\\', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('-', '').s;
					periph_jeedom = S(periph_jeedom).replaceAll('.', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('?', '').s;
						jid = "j_"+periph_jeedom;
							jidbatterie = "j_"+periph_jeedom+"_batterie";
							jidradio = "j_"+periph_jeedom+"_radio";
						
						jid_descr = jid_descr+'var '+jid+' = \'\';\n';
							jid_descr = jid_descr+'var '+jidbatterie+' = \'\';\n';
							jid_descr = jid_descr+'var '+jidradio+' = \'\';\n';
						jid_file = jid_file+'\t'+jid+' = 42;\t//'+periph_jeedom+';\n';
							jid_file = jid_file+'\t\t'+jidbatterie+' = 84;\t//'+periph_jeedom+';\n';
							jid_file = jid_file+'\t\t\t'+jidradio+' = 88;\t//'+periph_jeedom+';\n';
						periph_file = periph_file+type_eqp+'\t'+periph_jeedom+'\t'+id_eqp+'\tid_'+'\n';

						app_undefined = app_undefined+'\n		if (id=="'+id_eqp+'" && dev == "Light/UV")\n';
						app_undefined = app_undefined+'		{\n';
						app_undefined = app_undefined+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' et de type '+type_eqp+'\");\n';
						app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=\" + uvl;\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP | Procole '+proto+', lumiere: \" + uvl);\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';

						app_undefined = app_undefined+'			if (S(msg).include(\'Batt\'))\n';
						app_undefined = app_undefined+'			{\n';
						app_undefined = app_undefined+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
						app_undefined = app_undefined+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Batterie: \" + bat);\n';
						app_undefined = app_undefined+'				console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'				request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'				nb_http_request = nb_http_request + 1;\n';
						app_undefined = app_undefined+'			};\n';
						app_undefined = app_undefined+'		}\n';
					}

					//Traitements des telecommandes
					//else if (type_eqp == "COMMANDE")
					else if (type_eqp == "COMMANDE")
					{
						console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id1 : "+ id1_eqp + " / Id2 : "+ id2_eqp);
						console.log("  Ajout dans le script Zidom du test de remontee sur cette telecommande");

						//periph_jeedom = replace_special_char(name_eqp).s;
					periph_jeedom = S(name_eqp).replaceAll(' ', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('/', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('\\', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('-', '').s;
					periph_jeedom = S(periph_jeedom).replaceAll('.', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('?', '').s;
						jid = "j_"+periph_jeedom;
							jidbatterie = "j_"+periph_jeedom+"_batterie";
						jid_descr = jid_descr+'var '+jid+' = \'\';\n';
							jid_descr = jid_descr+'var '+jidbatterie+' = \'\';\n';
							jid_descr = jid_descr+'var '+jidradio+' = \'\';\n';
						jid_file = jid_file+'\t'+jid+' = 42;\t//'+periph_jeedom+';\n';
							jid_file = jid_file+'\t\t'+jidbatterie+' = 84;\t//'+periph_jeedom+';\n';
						periph_file = periph_file+type_eqp+'\t'+periph_jeedom+'\t'+id_eqp+'\tid_'+'\n';

						app_undefined = app_undefined+'\n		if (id=="'+id1_eqp+'")\n';
						app_undefined = app_undefined+'		{\n';
						app_undefined = app_undefined+'			console.log(\" Test de l equipement COMMANDE ' + name_eqp + ', d\'ID Zibase '+id1_eqp+' et de type '+type_eqp+'\");\n';
						app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=1\";\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Telecommande ON : \" + sta);\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';

						app_undefined = app_undefined+'			if (S(msg).include(\'Batt\'))\n';
						app_undefined = app_undefined+'			{\n';
						app_undefined = app_undefined+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
						app_undefined = app_undefined+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Batterie Telecommande: \" + bat);\n';
						app_undefined = app_undefined+'				console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'				request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'				nb_http_request = nb_http_request + 1;\n';
						app_undefined = app_undefined+'			};\n';
						app_undefined = app_undefined+'		}\n';

						
						app_undefined = app_undefined+'\n		if (id=="'+id2_eqp+'")\n';
						app_undefined = app_undefined+'		{\n';
						
						app_undefined = app_undefined+'			console.log(\" Test de l equipement COMMANDE ' + name_eqp + ', d\'ID Zibase '+id2_eqp+' et de type '+type_eqp+'\");\n';
						app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=1\";\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Telecommande OFF : \" + sta);\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';

						app_undefined = app_undefined+'			if (S(msg).include(\'Batt\'))\n';
						app_undefined = app_undefined+'			{\n';
						app_undefined = app_undefined+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
						app_undefined = app_undefined+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Batterie Telecommande: \" + bat);\n';
						app_undefined = app_undefined+'				console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'				request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'				nb_http_request = nb_http_request + 1;\n';
						app_undefined = app_undefined+'			};\n';

						app_undefined = app_undefined+'		}\n';
					}
					//else if (type_eqp == "COMMANDE2")
					else if (type_eqp == "COMMANDE2")
					{
						console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id1 : "+ id1_eqp + " / Id2 : "+ id2_eqp);
						console.log("  Ajout dans le script Zidom du test de remontee sur cette telecommande");

						//periph_jeedom = replace_special_char(name_eqp).s;
					periph_jeedom = S(name_eqp).replaceAll(' ', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('/', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('\\', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('-', '').s;
					periph_jeedom = S(periph_jeedom).replaceAll('.', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('?', '').s;
						jid = "j_"+periph_jeedom;
							jidbatterie = "j_"+periph_jeedom+"_batterie";
						jid_descr = jid_descr+'var '+jid+' = \'\';\n';
							jid_descr = jid_descr+'var '+jidbatterie+' = \'\';\n';
							jid_descr = jid_descr+'var '+jidradio+' = \'\';\n';
						jid_file = jid_file+'\t'+jid+' = 42;\t//'+periph_jeedom+';\n';
							jid_file = jid_file+'\t\t'+jidbatterie+' = 84;\t//'+periph_jeedom+';\n';
						periph_file = periph_file+type_eqp+'\t'+periph_jeedom+'\t'+id_eqp+'\tid_'+'\n';

						app_undefined = app_undefined+'\n		if (id=="'+id1_eqp+'")\n';
						app_undefined = app_undefined+'		{\n';
						app_undefined = app_undefined+'			console.log(\" Test de l equipement COMMANDE ' + name_eqp + ', d\'ID Zibase '+id1_eqp+' et de type '+type_eqp+'\");\n';
						app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=1\";\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Telecommande2 ON : \" + sta);\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';

						app_undefined = app_undefined+'			if (S(msg).include(\'Batt\'))\n';
						app_undefined = app_undefined+'			{\n';
						app_undefined = app_undefined+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
						app_undefined = app_undefined+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Batterie Telecommande2: \" + bat);\n';
						app_undefined = app_undefined+'				console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'				request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'				nb_http_request = nb_http_request + 1;\n';
						app_undefined = app_undefined+'			};\n';
						app_undefined = app_undefined+'		}\n';
						
						app_undefined = app_undefined+'\n		if (id=="'+id2_eqp+'")\n';
						app_undefined = app_undefined+'		{\n';
						app_undefined = app_undefined+'			console.log(\" Test de l equipement COMMANDE ' + name_eqp + ', d\'ID Zibase '+id2_eqp+' et de type '+type_eqp+'\");\n';
						app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=1\";\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Telecommande2 OFF : \" + sta);\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';

						app_undefined = app_undefined+'			if (S(msg).include(\'Batt\'))\n';
						app_undefined = app_undefined+'			{\n';
						app_undefined = app_undefined+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
						app_undefined = app_undefined+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Batterie Telecommande2: \" + bat);\n';
						app_undefined = app_undefined+'				console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'				request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'				nb_http_request = nb_http_request + 1;\n';
						app_undefined = app_undefined+'			};\n';
						app_undefined = app_undefined+'		}\n';
					}
					//else if (type_eqp == "COMMANDE4")
					else if (type_eqp == "COMMANDE4")
					{
						console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id1 : "+ id1_eqp + " / Id2 : "+ id2_eqp);
						console.log("  Ajout dans le script Zidom du test de remontee sur cette telecommande");

						//periph_jeedom = replace_special_char(name_eqp).s;
					periph_jeedom = S(name_eqp).replaceAll(' ', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('/', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('\\', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('-', '').s;
					periph_jeedom = S(periph_jeedom).replaceAll('.', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('?', '').s;
						jid = "j_"+periph_jeedom;
							jidbatterie = "j_"+periph_jeedom+"_batterie";
						jid_descr = jid_descr+'var '+jid+' = \'\';\n';
							jid_descr = jid_descr+'var '+jidbatterie+' = \'\';\n';
						jid_file = jid_file+'\t'+jid+' = 42;\t//'+periph_jeedom+';\n';
							jid_file = jid_file+'\t\t'+jidbatterie+' = 84;\t//'+periph_jeedom+';\n';
						periph_file = periph_file+type_eqp+'\t'+periph_jeedom+'\t'+id_eqp+'\tid_'+'\n';

						app_undefined = app_undefined+'\n		if (id=="'+id1_eqp+'")\n';
						app_undefined = app_undefined+'		{\n';
						app_undefined = app_undefined+'			console.log(\" Test de l equipement COMMANDE ' + name_eqp + ', d\'ID Zibase '+id1_eqp+' et de type '+type_eqp+'\");\n';
						app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=1\";\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Telecommande4 ON : \" + sta);\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';

						app_undefined = app_undefined+'			if (S(msg).include(\'Batt\'))\n';
						app_undefined = app_undefined+'			{\n';
						app_undefined = app_undefined+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
						app_undefined = app_undefined+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Batterie Telecommande4: \" + bat);\n';
						app_undefined = app_undefined+'				console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'				request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'				nb_http_request = nb_http_request + 1;\n';
						app_undefined = app_undefined+'			};\n';
						app_undefined = app_undefined+'		}\n';

						
						app_undefined = app_undefined+'\n		if (id=="'+id2_eqp+'")\n';
						app_undefined = app_undefined+'		{\n';
						app_undefined = app_undefined+'			console.log(\" Test de l equipement COMMANDE ' + name_eqp + ', d\'ID Zibase '+id2_eqp+' et de type '+type_eqp+'\");\n';
						app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=1\";\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Telecommande OFF : \" + sta);\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';

						app_undefined = app_undefined+'			if (S(msg).include(\'Batt\'))\n';
						app_undefined = app_undefined+'			{\n';
						app_undefined = app_undefined+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
						app_undefined = app_undefined+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Batterie Telecommande4: \" + bat);\n';
						app_undefined = app_undefined+'				console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'				request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'				nb_http_request = nb_http_request + 1;\n';
						app_undefined = app_undefined+'			};\n';
						app_undefined = app_undefined+'		}\n';
					}
					//else if (type_eqp == "transmitter")
					else if (type_eqp == "transmitter")
					{
						console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id : "+ id_eqp);
						console.log("  Ajout dans le script Zidom du test de remontee sur ce transmitter");

						//periph_jeedom = replace_special_char(name_eqp).s;
					periph_jeedom = S(name_eqp).replaceAll(' ', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('/', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('\\', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('-', '').s;
					periph_jeedom = S(periph_jeedom).replaceAll('.', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('?', '').s;
						jid = "j_"+periph_jeedom;
							jidbatterie = "j_"+periph_jeedom+"_batterie";
							jidradio = "j_"+periph_jeedom+"_radio";
						jid_descr = jid_descr+'var '+jid+' = \'\';\n';
							jid_descr = jid_descr+'var '+jidbatterie+' = \'\';\n';
							jid_descr = jid_descr+'var '+jidradio+' = \'\';\n';
						jid_file = jid_file+'\t'+jid+' = 42;\t//'+periph_jeedom+';\n';
							jid_file = jid_file+'\t\t'+jidbatterie+' = 84;\t//'+periph_jeedom+';\n';
							jid_file = jid_file+'\t\t\t'+jidradio+' = 88;\t//'+periph_jeedom+';\n';
						periph_file = periph_file+type_eqp+'\t'+periph_jeedom+'\t'+id_eqp+'\tid_'+'\n';
					
						app_undefined = app_undefined+'\n		if (id=="'+id_eqp+'" && sta =="ON")\n';
						app_undefined = app_undefined+'		{\n';
						app_undefined = app_undefined+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' et de type '+type_eqp+'\");\n';
						app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=1\";\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Activation de l\'equipement \");\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n'; 
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';

						app_undefined = app_undefined+'			if (S(msg).include(\'Batt\'))\n';
						app_undefined = app_undefined+'			{\n';
						app_undefined = app_undefined+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
						app_undefined = app_undefined+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Batterie: \" + bat);\n';
						app_undefined = app_undefined+'				console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'				request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'				nb_http_request = nb_http_request + 1;\n';
						app_undefined = app_undefined+'			};\n';

						app_undefined = app_undefined+'			if (S(msg).include(\'Level\'))\n';
						app_undefined = app_undefined+'			{\n';
						app_undefined = app_undefined+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidradio+'+\"&value=\"+lev;\n';
						app_undefined = app_undefined+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Niveau reception radio: \" + lev);\n';
						app_undefined = app_undefined+'				console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'				request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'				nb_http_request = nb_http_request + 1;\n';
						app_undefined = app_undefined+'			};\n';
						app_undefined = app_undefined+'		}\n';

						app_undefined = app_undefined+'\n		if (id=="'+id_eqp+'" && sta =="OFF")\n';
						app_undefined = app_undefined+'		{\n';
						app_undefined = app_undefined+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' et de type '+type_eqp+'\");\n';
						app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=1\";\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP | Procole '+proto+', DESActivation de l\'equipement \");\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n'; 
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';

						app_undefined = app_undefined+'			if (S(msg).include(\'Batt\'))\n';
						app_undefined = app_undefined+'			{\n';
						app_undefined = app_undefined+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
						app_undefined = app_undefined+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Batterie: \" + bat);\n';
						app_undefined = app_undefined+'				console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'				request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'				nb_http_request = nb_http_request + 1;\n';
						app_undefined = app_undefined+'			};\n';
						app_undefined = app_undefined+'			if (S(msg).include(\'Level\'))\n';
						app_undefined = app_undefined+'			{\n';
						app_undefined = app_undefined+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidradio+'+\"&value=\"+lev;\n';
						app_undefined = app_undefined+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Niveau reception radio: \" + lev);\n';
						app_undefined = app_undefined+'				console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'				request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'				nb_http_request = nb_http_request + 1;\n';
						app_undefined = app_undefined+'			};\n';
						app_undefined = app_undefined+'		}\n';
					}
					//else if (type_eqp == "receiverXDom")
					else if (type_eqp == "receiverXDom")
					{
						console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id : "+ id_eqp);
						console.log("  Ajout dans le script Zidom du test de remontee sur ce receiverXDom");

						//periph_jeedom = replace_special_char(name_eqp).s;
					periph_jeedom = S(name_eqp).replaceAll(' ', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('/', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('\\', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('-', '').s;
					periph_jeedom = S(periph_jeedom).replaceAll('.', '_').s;
					periph_jeedom = S(periph_jeedom).replaceAll('?', '').s;
						jid = "j_"+periph_jeedom;
							jidbatterie = "j_"+periph_jeedom+"_batterie";
							jidradio = "j_"+periph_jeedom+"_radio";
						jid_descr = jid_descr+'var '+jid+' = \'\';\n';
							jid_descr = jid_descr+'var '+jidbatterie+' = \'\';\n';
							jid_descr = jid_descr+'var '+jidradio+' = \'\';\n';
						jid_file = jid_file+'\t'+jid+' = 42;\t//'+periph_jeedom+';\n';
							jid_file = jid_file+'\t\t'+jidbatterie+' = 84;\t//'+periph_jeedom+';\n';
							jid_file = jid_file+'\t\t\t'+jidradio+' = 88;\t//'+periph_jeedom+';\n';
						periph_file = periph_file+type_eqp+'\t'+periph_jeedom+'\t'+id_eqp+'\tid_'+'\n';
					
						app_undefined = app_undefined+'\n		if (id=="'+id_eqp+'" && sta =="ON")\n';
						app_undefined = app_undefined+'		{\n';
						app_undefined = app_undefined+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' et de type '+type_eqp+'\");\n';
						app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=1\";\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Activation de l\'equipement \");\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n'; 
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';

						app_undefined = app_undefined+'			if (S(msg).include(\'Batt\'))\n';
						app_undefined = app_undefined+'			{\n';
						app_undefined = app_undefined+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
						app_undefined = app_undefined+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Batterie: \" + bat);\n';
						app_undefined = app_undefined+'				console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'				request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'				nb_http_request = nb_http_request + 1;\n';
						app_undefined = app_undefined+'			};\n';
						app_undefined = app_undefined+'			if (S(msg).include(\'Level\'))\n';
						app_undefined = app_undefined+'			{\n';
						app_undefined = app_undefined+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidradio+'+\"&value=\"+lev;\n';
						app_undefined = app_undefined+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Niveau reception radio: \" + lev);\n';
						app_undefined = app_undefined+'				console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'				request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'				nb_http_request = nb_http_request + 1;\n';
						app_undefined = app_undefined+'			};\n';
						app_undefined = app_undefined+'		}\n';

						app_undefined = app_undefined+'\n		if (id=="'+id_eqp+'" && sta =="OFF")\n';
						app_undefined = app_undefined+'		{\n';
						app_undefined = app_undefined+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID Zibase '+id_eqp+' et de type '+type_eqp+'\");\n';
						app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jid+'+\"&value=1\";\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP | Procole '+proto+', DESActivation de l\'equipement \");\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request);\n'; 
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';

						app_undefined = app_undefined+'			if (S(msg).include(\'Batt\'))\n';
						app_undefined = app_undefined+'			{\n';
						app_undefined = app_undefined+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidbatterie+'+\"&value=\"+bat;\n';
						app_undefined = app_undefined+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Batterie: \" + bat);\n';
						app_undefined = app_undefined+'				console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'				request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'				nb_http_request = nb_http_request + 1;\n';
						app_undefined = app_undefined+'			};\n';
						app_undefined = app_undefined+'			if (S(msg).include(\'Level\'))\n';
						app_undefined = app_undefined+'			{\n';
						app_undefined = app_undefined+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=\"+'+jidradio+'+\"&value=\"+lev;\n';
						app_undefined = app_undefined+'				console.log(\"  Envoi de la requete HTTP | Procole '+proto+', Niveau reception radio: \" + lev);\n';
						app_undefined = app_undefined+'				console.log(\"  Requete :\" + http_request);\n';
						app_undefined = app_undefined+'				request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'				{if (debug_http_request=="yes"){ console.log(new Date() + \" \" + body); }});\n';
						app_undefined = app_undefined+'				nb_http_request = nb_http_request + 1;\n';
						app_undefined = app_undefined+'			};\n';
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
		//console.log("generate_zidom_script : "+generate_zidom_script);

		
		console.log("\n------------------------------------------------------------------------------------")
		console.log(" --> Nombre de peripheriques lu dans le fichier XML : "+count_periph);
		console.log(" --> Nombre de ligne lu dans le fichier XML : "+count);
		
		generate_zidom_script = declare_zidom+'\n'+
			jid_descr+'\n'+
			jid_file+'\n'+
			test_zidom+'\n'+
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

		generate_zidom_script = generate_zidom_script+'	if (!nb_http_request) \n'
		generate_zidom_script = generate_zidom_script+' {\n ';
		generate_zidom_script = generate_zidom_script+'		if (oregon_prev==false && oregon) { console.log(new Date() + " *** AUCUNE Requete HTTP envoyee a Jeedom - remontee temperature trop recente ***") }\n'
		generate_zidom_script = generate_zidom_script+' 	else console.log(new Date() + " *** AUCUNE Requete HTTP envoyee a Jeedom ***");';
		generate_zidom_script = generate_zidom_script+' }\n';
		generate_zidom_script = generate_zidom_script+'});\n';

		generate_zidom_script = generate_zidom_script+'server.on(\"listening\", function () {\n';
		generate_zidom_script = generate_zidom_script+'  var address = server.address();\n';
		generate_zidom_script = generate_zidom_script+'  console.log(\"server listening \" +\n';
		generate_zidom_script = generate_zidom_script+'	  address.address + \":\" + address.port);\n';
		generate_zidom_script = generate_zidom_script+'});\n';
		generate_zidom_script = generate_zidom_script+'\n';
		generate_zidom_script = generate_zidom_script+'client.send(b, 0, b.length, 49999, zibaseIp, function(err, bytes) {\n';
		generate_zidom_script = generate_zidom_script+'  client.close();\n';
		generate_zidom_script = generate_zidom_script+'});\n';
		generate_zidom_script = generate_zidom_script+'\n';
		generate_zidom_script = generate_zidom_script+'server.bind(0x42CC, clientIp);\n';
		generate_zidom_script = generate_zidom_script+'\n';
		generate_zidom_script = generate_zidom_script+'\n';
		generate_zidom_script = generate_zidom_script+'process.on(\'SIGINT\', function() {\n';
		generate_zidom_script = generate_zidom_script+'	console.log(\"Caught interrupt signal\");\n';
		generate_zidom_script = generate_zidom_script+'\n';
		generate_zidom_script = generate_zidom_script+'	var client = dgram.createSocket(\"udp4\");\n';
		generate_zidom_script = generate_zidom_script+'	b.writeUInt16BE(22,4); //command HOST UNREGISTERING (22)\n';
		generate_zidom_script = generate_zidom_script+'	console.log(b);\n';
		generate_zidom_script = generate_zidom_script+'	client.send(b, 0, b.length, 49999, zibaseIp, function(err, bytes) {\n';
		generate_zidom_script = generate_zidom_script+'	  console.log(\"Unregistering...\" , bytes);\n';
		generate_zidom_script = generate_zidom_script+'	  setTimeout( function(){\n';
		generate_zidom_script = generate_zidom_script+'			  console.log(\"exit\");\n';
		generate_zidom_script = generate_zidom_script+'			  client.close();\n';
		generate_zidom_script = generate_zidom_script+'			  process.exit()\n';
		generate_zidom_script = generate_zidom_script+'		  }, 3000);\n';
		generate_zidom_script = generate_zidom_script+'	});\n';
		generate_zidom_script = generate_zidom_script+'});\n';
		generate_zidom_script = generate_zidom_script+'\n';
		generate_zidom_script = generate_zidom_script+'function dot2num(dot) {\n';
		generate_zidom_script = generate_zidom_script+'var d = dot.split(\'.\');\n';
		generate_zidom_script = generate_zidom_script+'return ((((((+d[0])*256)+(+d[1]))*256)+(+d[2]))*256)+(+d[3]);}\n';
		generate_zidom_script = generate_zidom_script+'\n';
		generate_zidom_script = generate_zidom_script+'function num2dot(num) {\n';
		generate_zidom_script = generate_zidom_script+'var d = num%256;\n';
		generate_zidom_script = generate_zidom_script+'for (var i = 3; i > 0; i--) { \n';
		generate_zidom_script = generate_zidom_script+'num = Math.floor(num/256);\n';
		generate_zidom_script = generate_zidom_script+'d = num%256 + \'.\' + d;}\n';
		generate_zidom_script = generate_zidom_script+'return d;}\n';
		generate_zidom_script = generate_zidom_script+'\n';
		generate_zidom_script = generate_zidom_script+'function getIPAddress() {\n';
		generate_zidom_script = generate_zidom_script+'	var interfaces = require(\'os\').networkInterfaces();\n';
		generate_zidom_script = generate_zidom_script+'	for (var devName in interfaces) {\n';
		generate_zidom_script = generate_zidom_script+'		var iface = interfaces[devName];\n';
		generate_zidom_script = generate_zidom_script+'\n';
		generate_zidom_script = generate_zidom_script+'		for (var i = 0; i < iface.length; i++) {\n';
		generate_zidom_script = generate_zidom_script+'			var alias = iface[i];\n';
		generate_zidom_script = generate_zidom_script+'			if (alias.family === \'IPv4\' && alias.address !== \'127.0.0.1\' && !alias.internal)\n';
		generate_zidom_script = generate_zidom_script+'				return alias.address;\n';
		generate_zidom_script = generate_zidom_script+'		}\n';
		generate_zidom_script = generate_zidom_script+'	}\n';
		generate_zidom_script = generate_zidom_script+'\n';
		generate_zidom_script = generate_zidom_script+'	return \'0.0.0.0\';\n';
		generate_zidom_script = generate_zidom_script+'}\n';

		console.log("------------------------------------------------------------------------------------")
		console.log(" Debut d'Ecriture dans le fichier zidomn13_gerald.js ...");
		fs.writeFileSync("zidomn13.js", generate_zidom_script, "utf8");
			//readFileSync_encoding2("zidomn13-2.js", "UTF-8", generate_zidom_script);
			//readFileSync_encoding("zidomn13-2.js", "UTF-8", generate_zidom_script);
		console.log(" Fin d'Ecriture dans le fichier zidomn13.js !")
		console.log("------------------------------------------------------------------------------------")
		console.log(" Debut d'Ecriture dans le fichier jeedom_id.txt ...");
		fs.writeFileSync("jeedom_id.txt", jid_file, "utf8");
			//readFileSync_encoding("jeedom_id.txt", "UTF-8", generate_zidom_script);
		console.log(" Fin d'Ecriture dans le fichier jeedom_id.txt !")
		console.log("------------------------------------------------------------------------------------")
		console.log(" Debut d'Ecriture dans le fichier script_jeedom.txt ...");
		fs.writeFileSync("script_jeedom.txt", script_zidom, "utf8");
			//readFileSync_encoding("script_jeedom.txt", "UTF-8", generate_zidom_script);
		console.log(" Fin d'Ecriture dans le fichier script_jeedom.txt !")
		console.log("------------------------------------------------------------------------------------")


		function jsonrpcResultError(err, result)
		{
			if (err)
			{
				return console.log(err);
			}
			console.log('  1 + 2 = ' + result + ' (http)');
		}
		
		/*var toto = new Array();
		var client = jsonrpc.Client.$create('http://localhost/jeedom/core/api/jeeApi.php?apikey=drxc3bdcr0p8b0m2utr9');
		
		client.call('object::all', toto,jsonrpcResultError);
		client.call('cmd::all', toto, jsonrpcResultError);*/
		

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

function replace_special_char(value){
	value = S(value).replaceAll(' ', '_').s;
	value = S(value).replaceAll('/', '_').s;
	value = S(value).replaceAll('\\', '_').s;
	value = S(value).replaceAll('+', '').s;
	value = S(value).replaceAll('-', '_').s;
	value = S(value).replaceAll('.', '_').s;
	value = S(value).replaceAll('?', '').s;
	value = S(value).replaceAll('é', 'e').s;
	value = S(value).replaceAll('è', 'e').s;
	value = S(value).replaceAll('ê', 'e').s;
	value = S(value).replaceAll('à', 'a').s;
	value = S(value).replaceAll('â', 'a').s;
	console.log(" VALUE : "+value+"\n");
	return value;
}
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

var clientIp = process.env.MYIP || getIPAddress();
zibase_ip = "192.168.X.X"
var zibaseIp = process.env.IP_ZIBASE|| zibase_ip;

var zibase_device = require('string');
var zibase_token = require('string');
var zibase_url = require('string');
var util = require("util");
var fs = require("fs");

var  jeedom_api = require('string');

// A remplir :
zibase_device = "";
zibase_token = "";
jeedom_ip = "192.168.X.X";
jeedom_api = "";

jeedom_chemin_install    = "/jeedom/core/api/jeeApi.php?api=";
jeedom_chemin_preinstall = "/core/api/jeeApi.php?api=";
jeedom_chemin = jeedom_chemin_install; // ou jeedom_chemin = jeedom_chemin_preinstall; si jeedom a ete preinstallee

zibase_url = "http://zibase.net/m/get_xml.php?device="+zibase_device+"&token="+zibase_token;
//http://zibase.net/m/get_xml.php?device=ZiBASE005d18&token=fdb06a35b3

var S = require('string');
var request = require("request");
var dgram = require("dgram");
var server = dgram.createSocket("udp4");
var client = dgram.createSocket("udp4");

var app_script = require('string');
// Variable qui enregistre le script final
// Initialisation du script final dans la variable app_script :

app_script = app_script+'\n\n// ******************************************************************************************************************** \n';
app_script = app_script+'// *****************   Script de lecture de suivi d\'activite de Zibase, et d\'alimentation de Jeedom   ***************** \n';
app_script = app_script+'// *****************   Zeldoi5                                                                        ***************** \n';
app_script = app_script+'// *****************   merci de remplir les variables :                                               ***************** \n';
app_script = app_script+'// *****************   - zibase_device                                                                ***************** \n';
app_script = app_script+'// *****************   - zibase_token                                                                 ***************** \n';
app_script = app_script+'// *****************   - zibase_device                                                                ***************** \n';
app_script = app_script+'// *****************   - jeedom_ip                                                                    ***************** \n';
app_script = app_script+'// *****************   - jeedom_api                                                                   ***************** \n';
app_script = app_script+'// ******************************************************************************************************************** \n';
app_script = app_script+'// XML URL : '+zibase_url+' \n';


app_script = app_script+'var clientIp = process.env.MYIP || getIPAddress();\n';
app_script = app_script+'var zibaseIp = process.env.IP_ZIBASE|| "'+zibase_ip+'";\n';
app_script = app_script+'var S = require(\'string\');\n';
app_script = app_script+'var request = require(\"request\");\n';
app_script = app_script+'var dgram = require(\"dgram\");\n';
app_script = app_script+'var server = dgram.createSocket(\"udp4\");\n';
app_script = app_script+'var client = dgram.createSocket(\"udp4\");\n\n';

app_script = app_script+'var expr,chacon,oregon,zwave,temp_web = require(\'string\');\n';
app_script = app_script+'var zibase_device, zibase_token = require(\'string\');\n\n';

app_script = app_script+'var b = new Buffer(70);b.fill(0);b.write(\'ZSIG\0\', 0/*offset*/);\n';
app_script = app_script+'b.writeUInt16BE(13,4); //command HOST REGISTERING (13)\n';
app_script = app_script+'b.writeUInt32BE(dot2num(clientIp), 50);\n';
app_script = app_script+'b.writeUInt32BE(0x42CC, 54); // port 17100 0x42CC\n\n';

app_script = app_script+'chacon = false;\n';
app_script = app_script+'oregon = false;\n';
app_script = app_script+'zwave = false;\n';
app_script = app_script+'temp_web = false;\n\n';

app_script = app_script+'console.log(b);\n';
app_script = app_script+'console.log(b.toString(\'hex\', 0, b.length));\n\n';

app_script = app_script+'var parseString = require(\'xml2js\').parseString;\n';
app_script = app_script+'server.on("error", function (err) {\n';
app_script = app_script+'  console.log("server error : " + err.stack);\n';
app_script = app_script+'  server.close();\n';
app_script = app_script+'});\n';
app_script = app_script+'server.on("message", function (msg, rinfo) {\n';
app_script = app_script+'	//Booleen de generation de requete HTTP\n';
app_script = app_script+'	nb_http_request = 0;\n';
app_script = app_script+'\n';
app_script = app_script+'	//Tests des remontees de sondes de temperature/hygrometrie OREGON via les balises id/tem/hum\n';
app_script = app_script+'	id 		= S(msg).between(\'<id>\', \'</id>\').s;\n';
app_script = app_script+'	tem 	= S(msg).between(\'<tem>\', \'</tem>\').s;\n';
app_script = app_script+'	hum 	= S(msg).between(\'<hum>\', \'</hum>\').s;\n';
app_script = app_script+'	rf 		= S(msg).between(\'<rf>\', \'</rf>\').s;\n';
app_script = app_script+'	//Remontee de l\'etat de la batterie\n';
app_script = app_script+'	bat 	= S(msg).between(\'<bat>\', \'</bat>\').s;\n';
app_script = app_script+'	if (bat == "OK" || bat == "Ok") { bat_bool = 1}\n';
app_script = app_script+'	else { bat_bool = 0}\n';
app_script = app_script+'	dev 	= S(msg).between(\'<dev>\', \'</dev>\').s;\n';
app_script = app_script+'	//Remontee des consommations\n';
app_script = app_script+'	kwh 	= S(msg).between(\'<kwh>\', \'</kwh>\').s;\n';
app_script = app_script+'	w 		= S(msg).between(\'<w>\', \'</w>\').s;\n';
app_script = app_script+'	//Remontee des classes : ex. Class=0x<cla>30</cla>\n';
app_script = app_script+'	cla 	= S(msg).between(\'<cla>\', \'</cla>\').s;\n';
app_script = app_script+'	//Remontee des op : ex. Op=0x<op>03</op>\n';
app_script = app_script+'	op 		= S(msg).between(\'<op>\', \'</op>\').s;\n';
app_script = app_script+'	//Remontee des channels de communications : ex. Ch=<ch>0</ch>\n';
app_script = app_script+'	ch 		= S(msg).between(\'<ch>\', \'</ch>\').s;\n';
app_script = app_script+'	//Remontee des type de mesure : ex. <uv>Light/UV</uv>\n';
app_script = app_script+'	uv 		= S(msg).between(\'<uv>\', \'</uv>\').s;\n';
app_script = app_script+'	//Remontee des niveaux de mesure : ex. Level=<uvl>2</uvl>\n';
app_script = app_script+'	uvl 	= S(msg).between(\'<uvl>\', \'</uvl>\').s;\n';
app_script = app_script+'	lev 	= S(msg).between(\'<lev>\', \'</lev>\').s\n';
app_script = app_script+'	//Remontee du bruit de mesure : ex. Noise=<noise>0</noise>\n';
app_script = app_script+'	noise 	= S(msg).between(\'<noise>\', \'</noise>\').s;\n';
app_script = app_script+'	//Remontee du sta (status?) : ex. <sta>ON</sta> ou <sta>OFF</sta>\n';
app_script = app_script+'	sta 	= S(msg).between(\'<sta>\', \'</sta>\').s;\n';

app_script = app_script+'\n';
app_script = app_script+'	console.log("--------------------------------------------------------------------------------------")\n';
app_script = app_script+'\n';
app_script = app_script+'	console.log(new Date() + " " + msg.slice(70));\n';
app_script = app_script+'';

app_script = app_script+'	visionic433 = S(msg).include(\'VISONIC433\');\n';
app_script = app_script+'		visionic433_status = "";\n';
app_script = app_script+'	visionic868 = S(msg).include(\'VISONIC868\');\n';
app_script = app_script+'		visionic868_status = "";\n';
app_script = app_script+'	chacon = S(msg).include(\'Chacon\');\n';
app_script = app_script+'		chacon_status = "";\n';
app_script = app_script+'	domia = S(msg).include(\'DOMIA\');\n';
app_script = app_script+'		domia_status = "";';
app_script = app_script+'	rfx10 = S(msg).include(\'X10\');\n';
app_script = app_script+'		rfx10_status = "";';
app_script = app_script+'	zwave = S(msg).include(\'ZWAVE\')||S(msg).include(\'ZWave\');\n';
app_script = app_script+'		zwave_id = "";\n';
app_script = app_script+'		zwave_status = "";\n';
app_script = app_script+'		zwave = S(msg).include(\'ZWAVE\')||S(msg).include(\'ZWave\');\n';
app_script = app_script+'		zwave_id = "";\n';
app_script = app_script+'		zwave_status = "";\n';
app_script = app_script+'	rfs10ts10 = S(msg).include(\'RFS10/TS10\');\n';
app_script = app_script+'		rfs10ts10_status = "";\n';
app_script = app_script+'	xdd433alrm = S(msg).include(\'XDD433 alrm\');\n';
app_script = app_script+'		xdd433alrm_status = "";\n';
app_script = app_script+'	xdd868alrm = S(msg).include(\'XDD868 alrm\');\n';
app_script = app_script+'		xdd868alrm_status = "";\n';
app_script = app_script+'	xdd868intershutter = S(msg).include(\'Inter/shutter RFY433\');\n';
app_script = app_script+'		xdd868intershutter_status = "";\n';
app_script = app_script+'	xdd868pilotwire = S(msg).include(\'XDD868 Radiator/Pilot Wire\');\n';
app_script = app_script+'		xdd868pilotwire_status = "";\n';
app_script = app_script+'	xdd868boiler = S(msg).include(\'XDD868Boiler\');\n';
app_script = app_script+'		xdd868boiler_status = "";\n';

app_script = app_script+'\n	//Test de remontees de PROTOCOLE 1 : composants VISION433 :\n';
app_script = app_script+'	if (S(msg).include(\'VISONIC433\'))\n';
app_script = app_script+'	{\n';
app_script = app_script+'	    visionic433_id  = S(msg).between("Visionic433\' ): ", \'_\').s;\n';
app_script = app_script+'		visionic433 = true;\n';
app_script = app_script+'		if (S(msg).include(\'_ON\'))\n';
app_script = app_script+'		{\n			 visionic433_status = "ON";\n		}\n';
app_script = app_script+'		else if (S(msg).include(\'_OFF\'))\n';
app_script = app_script+'		{\n			 visionic433_status = "OFF";\n		}\n';
app_script = app_script+'		console.log("Debug : visionic433    : " + visionic433 + " | Composant/Id " + visionic433_id + " | Statut " + visionic433_status);\n';
app_script = app_script+'	}\n';

app_script = app_script+'\n	//Test de remontees de PROTOCOLE 2 : composants VISION868 :\n';
app_script = app_script+'	else if (S(msg).include(\'VISONIC868\'))\n';
app_script = app_script+'	{\n';
app_script = app_script+'	    visionic868_id  = S(msg).between("Visionic868\' ): ", \'_\').s;\n';
app_script = app_script+'		visionic868 = true;\n';
app_script = app_script+'		if (S(msg).include(\'_ON\'))\n';
app_script = app_script+'		{\n			 visionic868_status = "ON";\n		}\n';
app_script = app_script+'		else if (S(msg).include(\'_OFF\'))\n';
app_script = app_script+'		{\n			 visionic868_status = "OFF";\n		}\n';
app_script = app_script+'		console.log("Debug : visionic868    : " + visionic868 + " | Composant/Id " + visionic868_id + " | Statut " + visionic868_status);\n';
app_script = app_script+'	}\n';

app_script = app_script+'\n	//Test de remontees de PROTOCOLE 3 : composants Chacon : 	Sent radio ID (1 Burst(s), Protocols=\'Chacon\' ): A1_OFF\n';
app_script = app_script+'	else if (S(msg).include(\'Chacon\'))\n';
app_script = app_script+'	{\n';
app_script = app_script+'	    chacon_id = S(msg).between("Chacon\' ): ", \'_\').s;\n';
app_script = app_script+'		chacon = true;\n';
app_script = app_script+'		if (S(msg).include(\'_ON\'))\n';
app_script = app_script+'		{\n			 chacon_status = "ON";\n		}\n';
app_script = app_script+'		else if (S(msg).include(\'_OFF\'))\n';
app_script = app_script+'		{\n			 chacon_status = "OFF";\n		}\n';
app_script = app_script+'		console.log("Debug : chacon    : " + chacon + " | Composant/Id " + chacon_id + " | Statut " + chacon_status);\n';
app_script = app_script+'	}\n';

app_script = app_script+'\n	//Test de remontees de PROTOCOLE 4 : composants DOMIA\n';
app_script = app_script+'	else if (S(msg).include(\'DOMIA\'))\n';
app_script = app_script+'	{\n';
app_script = app_script+'	    domia_id  = S(msg).between("Domia\' ): ", \'_\').s;\n';
app_script = app_script+'		domia = true;\n';
app_script = app_script+'		if (S(msg).include(\'_ON\'))\n';
app_script = app_script+'		{\n			 domia_status = "ON";\n		}\n';
app_script = app_script+'		else if (S(msg).include(\'_OFF\'))\n';
app_script = app_script+'		{\n			 domia_status = "OFF";\n		}\n';
app_script = app_script+'		console.log("Debug : domia    : " + domia + " | Composant/Id " + domia_id + " | Statut " + domia_status);\n';
app_script = app_script+'	}\n';

app_script = app_script+'\n	//Test de remontees de PROTOCOLE 5 : composants RF X10\n';
app_script = app_script+'	else if (S(msg).include(\'X10\'))\n';
app_script = app_script+'	{\n';
app_script = app_script+'	    rfx10_id  = S(msg).between("X10\' ): ", \'_\').s;\n';
app_script = app_script+'		rfx10 = true;\n';
app_script = app_script+'		if (S(msg).include(\'_ON\'))\n';
app_script = app_script+'		{\n			 rfx10_status = "ON";\n		}\n';
app_script = app_script+'		else if (S(msg).include(\'_OFF\'))\n';
app_script = app_script+'		{\n			 rfx10_status = "OFF";\n		}\n';
app_script = app_script+'		console.log("Debug : rfx10    : " + rfx10 + " | Composant/Id " + rfx10_id + " | Statut " + rfx10_status);\n';
app_script = app_script+'	}\n';

app_script = app_script+'\n	//Test de remontees de PROTOCOLE 6 : composants ZWAVE (ou ZWave)\n';
app_script = app_script+'	if (S(msg).include(\'ZWAVE\')||S(msg).include(\'ZWave\'))'
app_script = app_script+'	{\n';
app_script = app_script+'		zwave = true;\n';
app_script = app_script+'		//Test pour identifier le statut du composant ZWAVE'
app_script = app_script+'		//Tue Aug 19 2014 19:52:59 GMT+0100 (BST) Received radio ID (<rf>ZWAVE ZC7</rf>  <dev>CMD/INTER</dev>  Batt=<bat>Ok</bat>): <id>ZC7_OFF</id>\n';
app_script = app_script+'		//Thu Aug 14 2014 23:03:59 GMT+0100 (BST) Sent radio ID (1 Burst(s), Protocols=\'ZWave n38\'  Last RF Transmit Time=20ms): ZC7_ON\n';
app_script = app_script+'		//Thu Aug 14 2014 23:04:47 GMT+0100 (BST) Sent radio ID (1 Burst(s), Protocols=\'ZWave n38\'  Last RF Transmit Time=10ms): ZC7_OFF\n';
app_script = app_script+'		//Thu Aug 14 2014 23:33:06 GMT+0100 (BST) Received radio ID (<rf>ZWAVE ZC4</rf> <dev>WakeUp</dev> Batt=<bat>Ok</bat>): <id>WZC4</id>\n';
app_script = app_script+'		//Thu Aug 14 2014 23:01:07 GMT+0100 (BST) Received radio ID (<rf>ZWAVE ZC5</rf> <dev>Low-Power Measure</dev> Total Energy=<kwh>1.0</kwh>kWh Power=<w>00</w>W Batt=<bat>Ok</bat>): <id>PZC6</id>\n';
app_script = app_script+'		//Thu Aug 14 2014 23:33:06 GMT+0100 (BST) Received radio ID (<rf>ZWAVE ZC6</rf> <dev>WakeUp</dev> Batt=<bat>Ok</bat>): <id>WZC4</id>\n';
app_script = app_script+'\n';
app_script = app_script+'		if (S(msg).include(\'ZWave message\') && S(msg).include(\'Battery level\'))\n';
app_script = app_script+'		{\n';
app_script = app_script+'			zwave_message = true;\n';
app_script = app_script+'			zwave_id= S(msg).between(\'Device Z\', \' Battery level\').s;\n';
app_script = app_script+'			bat 	= S(msg).between(\'level=\', \'%\').s;\n';
app_script = app_script+'		}\n';
app_script = app_script+'		if ((S(msg).include(\'_ON\')))\n';
app_script = app_script+'		{\n';
app_script = app_script+'			zwave_status = "ON";\n';
app_script = app_script+'			//Test pour identifier le composant ZWAVE impacte\n';
app_script = app_script+'			if ((S(msg).include("ZWave")))	//Sent radio ID (1 Burst(s), Protocols=\'ZWave n38\'  Last RF Transmit Time=20ms): ZC7_ON\n';
app_script = app_script+'			{ zwave_id = "Z"+S(msg).between(\': Z\', \'_ON\').s; }\n';
app_script = app_script+'			else if ((S(msg).include("ZWAVE")))	//Received radio ID (<rf>ZWAVE ZC4</rf> <dev>WakeUp</dev> Batt=<bat>Ok</bat>): <id>WZC4</id>\n';
app_script = app_script+'			{ zwave_id = "Z"+S(msg).between(\'<rf>ZWAVE Z\',\'</rf>\').s; }\n';
app_script = app_script+'		}\n';
app_script = app_script+'		//Thu Aug 14 2014 23:04:47 GMT+0100 (BST) Sent radio ID (1 Burst(s), Protocols=\'ZWave n38\'  Last RF Transmit Time=10ms): ZC7_OFF\n';
app_script = app_script+'		else if ((S(msg).include(\'_OFF\')))\n';
app_script = app_script+'		{\n';
app_script = app_script+'			zwave_status = "OFF";\n';
app_script = app_script+'			//Test pour identifier le composant ZWAVE impacte\n';
app_script = app_script+'			if ((S(msg).include("ZWave")))	//Sent radio ID (1 Burst(s), Protocols=\'ZWave n38\'  Last RF Transmit Time=20ms): ZC7_OFF\n';
app_script = app_script+'			{ zwave_id = "Z"+S(msg).between(\': Z\', \'_OFF\').s; }\n';
app_script = app_script+'			else if ((S(msg).include("ZWAVE")))	//Received radio ID (<rf>ZWAVE ZC4</rf> <dev>WakeUp</dev> Batt=<bat>Ok</bat>): <id>WZC4</id>\n';
app_script = app_script+'			{ zwave_id = "Z"+S(msg).between(\'<rf>ZWAVE Z\',\'</rf>\').s; }\n';
app_script = app_script+'		}\n';
app_script = app_script+'		else if ((!S(msg).include(\'_OFF\'))&&(!S(msg).include(\'_ON\')))\n';
app_script = app_script+'		{\n';
app_script = app_script+'			zwave_status = "UNKNOWN";\n';
app_script = app_script+'			if ((S(msg).include("ZWave")))	//Received radio ID (<rf>ZWAVE ZC5</rf> <dev>Low-Power Measure</dev> Total Energy=<kwh>1.0</kwh>kWh Power=<w>00</w>W Batt=<bat>Ok</bat>): <id>PZC6</id>\n';
app_script = app_script+'			{ zwave_id = "Z"+S(msg).between(\': Z\', \'_ON\').s; }\n';
app_script = app_script+'			else if ((S(msg).include("ZWAVE")))	//Received radio ID (<rf>ZWAVE ZC5</rf> <dev>Low-Power Measure</dev> Total Energy=<kwh>1.0</kwh>kWh Power=<w>00</w>W Batt=<bat>Ok</bat>): <id>PZC6</id>\n';
app_script = app_script+'			{ zwave_id = "Z"+S(msg).between(\'<rf>ZWAVE Z\',\'</rf>\').s; }\n';
app_script = app_script+'		}\n';
app_script = app_script+'		console.log("Debug  : zwave     : " + zwave + " | Composant " + zwave_id + " | Statut : " + zwave_status);\n';
app_script = app_script+'	}\n';

app_script = app_script+'\n	//Test de remontees de PROTOCOLE 7 : composants RFS10/TS10\n';
app_script = app_script+'	else if (S(msg).include(\'RFS10/TS10\'))\n';
app_script = app_script+'	{\n';
app_script = app_script+'	    rfs10ts10_id  = S(msg).between("TS10\' ): ", \'_\').s;\n';
app_script = app_script+'		rfs10ts10 = true;\n';
app_script = app_script+'		if (S(msg).include(\'_ON\'))\n';
app_script = app_script+'		{\n			 rfs10ts10_status = "ON";\n		}\n';
app_script = app_script+'		else if (S(msg).include(\'_OFF\'))\n';
app_script = app_script+'		{\n			 rfs10ts10_status = "OFF";\n		}\n';
app_script = app_script+'		console.log("Debug : rfs10ts10    : " + rfs10ts10 + " | Composant/Id " + rfs10ts10_id + " | Statut " + rfs10ts10_status);\n';
app_script = app_script+'	}\n';

app_script = app_script+'\n	//Test de remontees de PROTOCOLE 8 : composants XDD433 alrm\n';
app_script = app_script+'	else if (S(msg).include(\'XDD433 alrm\'))\n';
app_script = app_script+'	{\n';
app_script = app_script+'	    xdd433alrm_id = S(msg).between("XDD433 alrm\' ): ", \'_\').s;\n';
app_script = app_script+'		xdd433alrm = true;\n';
app_script = app_script+'		if (S(msg).include(\'_ON\'))\n';
app_script = app_script+'		{\n			 xdd433alrm_status = "ON";\n		}\n';
app_script = app_script+'		else if (S(msg).include(\'_OFF\'))\n';
app_script = app_script+'		{\n			 xdd433alrm_status = "OFF";\n		}\n';
app_script = app_script+'		console.log("Debug : xdd433alrm    : " + xdd433alrm + " | Composant/Id " + xdd433alrm_id + " | Statut " + xdd433alrm_status);\n';
app_script = app_script+'	}\n';

app_script = app_script+'\n	//Test de remontees de PROTOCOLE 9 : composants XDD868 alrm\n';
app_script = app_script+'	else if (S(msg).include(\'XDD868 alrm\'))\n';
app_script = app_script+'	{\n';
app_script = app_script+'	    domia_id  = S(msg).between("XDD868 alrm\' ): ", \'_\').s;\n';
app_script = app_script+'		xdd868alrm = true;\n';
app_script = app_script+'		if (S(msg).include(\'_ON\'))\n';
app_script = app_script+'		{\n			 xdd868alrm_status = "ON";\n		}\n';
app_script = app_script+'		else if (S(msg).include(\'_OFF\'))\n';
app_script = app_script+'		{\n			 xdd868alrm_status = "OFF";\n		}\n';
app_script = app_script+'		console.log("Debug : xdd868alrm    : " + xdd868alrm + " | Composant/Id " + id + " | Statut " + xdd868alrm_status);\n';
app_script = app_script+'	}\n';

app_script = app_script+'\n	//Test de remontees de PROTOCOLE 10 : composants XDD868 Inter/Shutter\n';
app_script = app_script+'	else if (S(msg).include(\'Inter/shutter RFY433\'))\n';
app_script = app_script+'	{\n';
app_script = app_script+'	    xdd868intershutter_id  = S(msg).between("Inter/shutter RFY433\' ): ", \'_\').s;\n';
app_script = app_script+'		xdd868intershutter = true;\n';
app_script = app_script+'		xdd868intershutter_id 	= S(msg).between("Protocols=\'Inter/shutter RFY433\' ): ", " ").s;\n';
app_script = app_script+'		xdd868intershutter_power_ON 	= S(msg).include(\'_ON\');\n';
app_script = app_script+'		xdd868intershutter_power_OFF 	= S(msg).include(\'_OFF\');\n';
app_script = app_script+'		xdd868intershutter_DIM_SPECIAL 	= S(msg).include(\'DIM/SPECIAL\');\n';
app_script = app_script+'		if (S(msg).include(\'_ON\')) { xdd868intershutter_status = "ON"; }\n';
app_script = app_script+'		else if (S(msg).include(\'_OFF)\')) { xdd868intershutter_status = "OFF"; }\n';
app_script = app_script+'		console.log("Debug : xdd868intershutter    : " + xdd868intershutter + " | Composant/Id " + xdd868intershutter_id + " | Statut " + xdd868intershutter_status);\n';
app_script = app_script+'	}\n';

/*app_script = app_script+'	//Test de remontees de composants Inter/shutter RFY433 ou SOMFY		 Sent radio ID (1 Burst(s), Protocols=\'Inter/shutter RFY433\' ): C1_OFF\n';
app_script = app_script+'	somfy = S(msg).include(\'Inter/shutter RFY433\'); somfy_id = ""; somfy_power_ON = ""; somfy_power_OFF = ""; somfy_DIM_SPECIAL = "";\n ';
app_script = app_script+'	if (S(msg).include(\'Inter/shutter RFY433\'))\n';
app_script = app_script+'	{\n';
app_script = app_script+'		somfy = true;\n';
app_script = app_script+'		somfy_id 			= S(msg).between("Protocols=\'Inter/shutter RFY433\' ): ", " ").s;\n';
app_script = app_script+'		somfy_power_ON 		= S(msg).include(\'_ON\');\n';
app_script = app_script+'		somfy_power_OFF 	= S(msg).include(\'_OFF\');\n';
app_script = app_script+'		somfy_DIM_SPECIAL 	= S(msg).include(\'DIM/SPECIAL\');\n';
app_script = app_script+'		//somfy_cmd 			= S(msg).between("Protocols=\'Inter/shutter RFY433\' ): ", " ").s;\n';
app_script = app_script+'		console.log("Debug : somfy     : " + somfy + " | Power ON : " + somfy_power_ON + " | Power OFF : " + somfy_power_OFF + " | DIM/SPECIAL : " + somfy_DIM_SPECIAL);\n';
app_script = app_script+'	}\n';*/

app_script = app_script+'	//Test de remontees de PROTOCOLE 11 : composants XDD868PilotWire\n';
app_script = app_script+'	else if (S(msg).include(\'XDD868 Radiator/Pilot Wire\'))\n';
app_script = app_script+'	{\n';
app_script = app_script+'	    xdd868pilotwire_id  = S(msg).between("\' ): ", \'_\').s;\n';
app_script = app_script+'		xdd868pilotwire = true;\n';
app_script = app_script+'		if (S(msg).include(\'_ON\'))\n';
app_script = app_script+'		{\n			 xdd868alrm_status = "ON";\n		}\n';
app_script = app_script+'		else if (S(msg).include(\'_OFF\'))\n';
app_script = app_script+'		{\n			 xdd868alrm_status = "OFF";\n		}\n';
app_script = app_script+'		else if (S(msg).include(\'_DIM/SPECIAL\'))\n';
app_script = app_script+'		{\n			 xdd868pilotwire_status = "DIM/SPECIAL";\n		}\n';
app_script = app_script+'		console.log("Debug : xdd868pilotwire    : " + xdd868pilotwire + " | Composant/Id " + xdd868pilotwire_id + " | Statut " + xdd868pilotwire_status);\n';
app_script = app_script+'	}\n';

app_script = app_script+'	//Test de remontees de PROTOCOLE 12 : composants XDD868Boiler\n';
app_script = app_script+'	else if (S(msg).include(\'XDD868Boiler\'))\n';
app_script = app_script+'	{\n';
app_script = app_script+'	    xdd868boiler_id  = S(msg).between("XDD868Boiler\' ): ", \'_\').s;\n';
app_script = app_script+'		xdd868boiler = true;\n';
app_script = app_script+'		if (S(msg).include(\'_ON\'))\n';
app_script = app_script+'		{\n			 xdd868alrm_status = "ON";\n		}\n';
app_script = app_script+'		else if (S(msg).include(\'_OFF\'))\n';
app_script = app_script+'		{\n			 xdd868alrm_status = "OFF";\n		}\n';
app_script = app_script+'		else if (S(msg).include(\'_DIM/SPECIAL\'))\n';
app_script = app_script+'		{\n			 xdd868pilotwire_status = "DIM/SPECIAL";\n		}\n';
app_script = app_script+'		console.log("Debug : xdd868boiler    : " + xdd868boiler + " | Composant/Id " + xdd868boiler_id + " | Statut " + xdd868boiler_status);\n';
app_script = app_script+'	}\n';

app_script = app_script+'	// Test de remontees de composants Oregon	Received radio ID (<rf>433Mhz Oregon</rf> Noise=<noise>2453</noise> Level=<lev>5.0</lev>/5 <dev>THWR288A-THN132N</dev> Ch=<ch>2</ch> T=<tem>+23.3</tem>C (+73.9F)  Batt=<bat>Ok</bat>): <id>OS3930896642</id>  Batt=<bat>Ok</bat>): <id>OS4294967047</id>\n';
app_script = app_script+'	//oregon = S(msg).include(\'Oregon\');\n';
app_script = app_script+'	else if (S(msg).include(\'Oregon\'))\n';
app_script = app_script+'	{\n';
app_script = app_script+'		oregon = true;\n';
app_script = app_script+'		console.log("Debug : oregon    : " + oregon + " | Composant/Id " + id);\n';
app_script = app_script+'	}\n';

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
	var app_visionic433 = "	if (visionic433)\n	{//	 Equipements de Type VISIONIC433\n";
	var app_visionic868 = "	else if (visionic868)\n	{//	 Equipements de Type VISIONIC868\n";
	var app_chacon = "	else if (chacon)\n	{//	 Equipements de Type CHACON\n";
	var app_domia = "	else if (domia)\n	{//	 Equipements de Type DOMIA\n";
	var app_rfx10 = "	else if (rfx10)\n	{//	 Equipements de Type RF X10\n";
	var app_zwave = "	else if (zwave)\n	{//	 Equipements de Type ZWAVE\n";
	var app_rfs10ts10 = "	else if (rfs10ts10)\n	{//	 Equipements de Type RFS10 TS10\n";
	var app_xdd433alrm = "	else if (xdd433alrm)\n	{//	 Equipements de Type XDD433 alrm\n";
	var app_xdd868alrm = "	else if (xdd868alrm)\n	{//	 Equipements de Type XDD868 alrm\n";
	var app_xdd868intershutter = "	else if (xdd868intershutter)\n	{//	 Equipements de Type XDD868\n";
	var app_xdd868pilotwire = "	else if (xdd868pilotwire)\n	{//	 Equipements de Type XDD868\n";
	var app_xdd868boiler = "	else if (xdd868boiler)\n	{//	 Equipements de Type XDD868\n";
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

			//console.log(" --> S(id_eqp).startsWith('Z')="+ S(id_eqp).startsWith('Z'));
			
			//Test des périphériques remontés en protocole ZWAVE mais n'ayant pas de Z dans l'ID
			if (proto_i == 6 && !S(id_eqp).startsWith('Z'))
			{	id_eqp = "Z" + id_eqp;	}
			
			//Test des périphériques dont l'ID commence par un Z mais dont le protocole n'est pas défini en Zwave 
			if (!proto_i)
			{
				proto = "undefined";
				//if (S(id_eqp).include("Z"))
				if (S(id_eqp).startsWith('Z')||S(id_eqp).startsWith('PZ'))
				{	proto ="ZWAVE";	}
			}
			else
			{
				if (proto_i == 1 ) { proto ="VISONIC433";}
				else if (type_eqp != "temperature" && proto_i == 2 ) { proto ="VISONIC868";}
				else if (type_eqp != "temperature" && proto_i == 3 ) { proto ="CHACON";}
				else if (type_eqp != "temperature" && proto_i == 4 ) { proto ="DOMIA";}
				else if (type_eqp != "temperature" && proto_i == 5 ) { proto ="RF X10";}
				else if (type_eqp != "temperature" && proto_i == 6 ) { proto ="ZWAVE";}
				else if (type_eqp != "temperature" && proto_i == 7 ) { proto ="RFS10/TS10";}
				else if (type_eqp != "temperature" && proto_i == 8 ) { proto ="XDD433";}
				else if (type_eqp != "temperature" && proto_i == 9 ) { proto ="XDD868";}
				else if (type_eqp != "temperature" && proto_i == 10 ) { proto ="XDD868Inter/Shutter";}
				else if (type_eqp != "temperature" && proto_i == 11 ) { proto ="XDD868PilotWire";}
				else if (type_eqp != "temperature" && proto_i == 12 ) { proto ="XDD868Boiler";}
				else if (type_eqp == "temperature") { proto = "oregon"; }
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
					//A implémenter
					console.log(" Equipement de type "+proto+" | Tests non realises en l absence de ce type d equipement\n");
					app_visionic433 = app_visionic433+'\n	//Aucun équipement VISIONIC433 n est en ma possession pour tester et remonter les infos\n';
				}
				if (proto =="VISONIC868")
				{
					//A implémenter
					console.log(" Equipement de type "+proto+" | Tests non realises en l absence de ce type d equipement\n");
					app_visionic868 = app_visionic868+'\n	//Aucun équipement VISIONIC868 n est en ma possession pour tester et remonter les infos\n';
				}
				if (proto =="CHACON")
				{
					console.log(" Equipement de type "+proto+".");
					console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id : "+ id_eqp);
					console.log("  Ajout dans le script Zidom du test de remontee sur cet équipement");
					
					app_chacon = app_chacon+'\n		if (chacon_id=="'+id_eqp+'" && chacon_status=="ON")\n'
					app_chacon = app_chacon+'		{\n';
					app_chacon = app_chacon+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID '+id_eqp+' de statut ON et de type '+type_eqp+'\");\n';
					app_chacon = app_chacon+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=0\";\n';
					app_chacon = app_chacon+'			console.log(\"  Envoi de la requete HTTP Activation de l\'equipement\n';
					app_chacon = app_chacon+'			console.log(\"  Requete :\" + http_request)\n';
					app_chacon = app_chacon+'			request(http_request, function(error, response, body)\n';
					app_chacon = app_chacon+'			{	console.log(new Date() + \" \" + body); });\n';

					/*app_chacon = app_chacon+'			console.log(\"  Envoi de la requete HTTP Batterie: \" + bat)\n';
					app_chacon = app_chacon+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=\"+bat;\n';
					app_chacon = app_chacon+'			console.log(\"  Requete :\" + http_request)\n';
					app_chacon = app_chacon+'			request(http_request, function(error, response, body)\n';
					app_chacon = app_chacon+'			{	console.log(new Date() + \" \" + body); });\n';
					app_chacon = app_chacon+'			nb_http_request = nb_http_request + 1;\n';*/
					app_chacon = app_chacon+'		}\n';

					app_chacon = app_chacon+'		if (chacon_id=="'+id_eqp+'" && chacon_status=="OFF")\n'
					app_chacon = app_chacon+'		{\n';
					app_chacon = app_chacon+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID '+id_eqp+' de statut OFF et de type '+type_eqp+'\");\n';
					app_chacon = app_chacon+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=0\";\n';
					app_chacon = app_chacon+'			console.log(\"  Envoi de la requete HTTP DESActivation de l\'equipement\n';
					app_chacon = app_chacon+'			console.log(\"  Requete :\" + http_request)\n';
					app_chacon = app_chacon+'			request(http_request, function(error, response, body)\n';
					app_chacon = app_chacon+'			{	console.log(new Date() + \" \" + body); });\n';

					/*app_chacon = app_chacon+'			console.log(\"  Envoi de la requete HTTP Batterie: \" + bat)\n';
					app_chacon = app_chacon+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=\"+bat;\n';
					app_chacon = app_chacon+'			console.log(\"  Envoi de la requete HTTP DESActivation de l\'equipement :\"+http_request+\");\n';
					app_chacon = app_chacon+'			request(http_request, function(error, response, body)\n';
					app_chacon = app_chacon+'			{	console.log(new Date() + \" \" + body); });\n';
					app_chacon = app_chacon+'			nb_http_request = nb_http_request + 1;\n';*/
					app_chacon = app_chacon+'		}\n';
				}
				if (proto =="DOMIA")
				{
					//A implémenter
					console.log(" Equipement de type "+proto+" | Tests non realises en l absence de ce type d equipement\n");
					app_domia=app_domia+'	//Aucun équipement VISIONIC433 n est en ma possession pour tester et remonter les infos\n';
				}
				if (proto =="RF X10")
				{
					console.log(" Equipement de type "+proto+".");
					//app_rfx10=app_rfx10+'	}\n';
					console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id : "+ id_eqp);
					console.log("  Ajout dans le script Zidom du test de remontee sur cet equipement");
					
					app_rfx10 = app_rfx10+'\n		if (rfx10_id=="'+id_eqp+'" && rfx10_status=="ON")\n'
					app_rfx10 = app_rfx10+'		{\n';
					app_rfx10 = app_rfx10+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID '+id_eqp+' de statut ON et de type '+type_eqp+'\");\n';
					app_rfx10 = app_rfx10+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=0\";\n';
					app_rfx10 = app_rfx10+'			console.log(\"  Envoi de la requete HTTP Activation de l\'equipement\n';
					app_rfx10 = app_rfx10+'			console.log(\"  Requete :\" + http_request)\n';
					app_rfx10 = app_rfx10+'			request(http_request, function(error, response, body)\n';
					app_rfx10 = app_rfx10+'			{	console.log(new Date() + \" \" + body); });\n';

					/*app_rfx10 = app_rfx10+'			console.log(\"  Envoi de la requete HTTP Batterie: \" + bat)\n';
					app_rfx10 = app_rfx10+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=\"+bat;\n';
					app_rfx10 = app_rfx10+'			console.log(\"  Requete :\" + http_request)\n';
					app_rfx10 = app_rfx10+'			request(http_request + bat, function(error, response, body)\n';
					app_rfx10 = app_rfx10+'			{	console.log(new Date() + \" \" + body); });\n';
					app_rfx10 = app_rfx10+'			nb_http_request = nb_http_request + 1;\n';*/
					app_rfx10 = app_rfx10+'		}\n';

					app_rfx10 = app_rfx10+'		if (rfx10_id=="'+id_eqp+'" && rfx10_status=="OFF")\n'
					app_rfx10 = app_rfx10+'		{\n';
					app_rfx10 = app_rfx10+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID '+id_eqp+'de statut OFF et de type '+type_eqp+'\");\n';
					app_rfx10 = app_rfx10+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=0\";\n';
					app_rfx10 = app_rfx10+'			console.log(\"  Envoi de la requete HTTP DESActivation de l\'equipement\n';
					app_rfx10 = app_rfx10+'			console.log(\"  Requete :\" + http_request)\n';
					app_rfx10 = app_rfx10+'			request(http_request, function(error, response, body)\n';
					app_rfx10 = app_rfx10+'			{	console.log(new Date() + \" \" + body); });\n';

					/*app_rfx10 = app_rfx10+'			console.log(\"  Envoi de la requete HTTP Batterie: \" + bat)\n';
					app_rfx10 = app_rfx10+'			http_request = \"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=\"+bat;\n';
					app_rfx10 = app_rfx10+'			console.log(\"  Envoi de la requete HTTP DESActivation de l\'equipement :\"+http_request+\");\n';
					app_rfx10 = app_rfx10+'			request(http_request, function(error, response, body)\n';
					app_rfx10 = app_rfx10+'			{	console.log(new Date() + \" \" + body); });\n';
					app_rfx10 = app_rfx10+'			nb_http_request = nb_http_request + 1;\n';*/
					app_rfx10 = app_rfx10+'		}\n';
				}
				else if (proto =="ZWAVE")
				{
					if (type_eqp == "power")
					{
						console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id : "+ id_eqp);
						console.log("  Ajout dans le script Zidom du test de remontee sur ce Power");
						app_zwave = app_zwave+'\n		if (zwave_id=="'+id_eqp+'")\n'
						app_zwave = app_zwave+'		{\n';
						app_zwave = app_zwave+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID '+id_eqp+' de statut POWER et de type '+type_eqp+'\");\n';
						app_zwave = app_zwave+'			http_request = (\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=\" + kwh';
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP Total Energy: \" + kwh)\n';
						app_zwave = app_zwave+'			console.log(\"  Requete :\" + http_request)\n';
						app_zwave = app_zwave+'			request(http_request, function(error, response, body)\n';
						app_zwave = app_zwave+'			{	console.log(new Date() + \" \" + body); });\n';
						app_zwave = app_zwave+'			nb_http_request = nb_http_request + 1;\n';

						app_zwave = app_zwave+'			http_request = (\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=\" + w';
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP Power: \" + w)\n';
						app_zwave = app_zwave+'			console.log(\"  Requete :\" + http_request)\n';
						app_zwave = app_zwave+'			request(http_request, function(error, response, body)\n';
						app_zwave = app_zwave+'			{	console.log(new Date() + \" \" + body); });\n';
						app_zwave = app_zwave+'			nb_http_request = nb_http_request + 1;\n';

						app_zwave = app_zwave+'			http_request = (\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=\" + bat';
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP Batterie: \" + bat)\n';
						app_zwave = app_zwave+'			console.log(\"  Requete :\" + http_request)\n';
						app_zwave = app_zwave+'			request(http_request, function(error, response, body)\n';
						app_zwave = app_zwave+'			{	console.log(new Date() + \" \" + body); });\n';
						app_zwave = app_zwave+'			nb_http_request = nb_http_request + 1;\n';
						app_zwave = app_zwave+'		}\n';
					}
 
					if (type_eqp == "receiverXDom")
					{
						console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id : "+ id_eqp);
						console.log("  Ajout dans le script Zidom du test de remontee sur ce receiverXDom");

						app_zwave = app_zwave+'\n		if (dev=="CMD/INTER" && zwave_id=="'+id_eqp+'" && zwave_status=="ON")\n'
						app_zwave = app_zwave+'		{\n';
						app_zwave = app_zwave+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID '+id_eqp+' de statut ON et de type '+type_eqp+'\");\n';
						app_zwave = app_zwave+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=1"\n';
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP Activation de l\'equipement\");\n';
						app_zwave = app_zwave+'			console.log(\"  Requete :\" + http_request)\n'; 
						app_zwave = app_zwave+'			request(http_request, function(error, response, body)\n';
						app_zwave = app_zwave+'			{	console.log(new Date() + \" \" + body); });\n';

						app_zwave = app_zwave+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=\" + bat\n';
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP Batterie: \" + bat)\n';
						app_zwave = app_zwave+'			console.log(\"  Requete :\" + http_request)\n';
						app_zwave = app_zwave+'			request(http_request, function(error, response, body)\n';
						app_zwave = app_zwave+'			{	console.log(new Date() + \" \" + body); });\n';
						app_zwave = app_zwave+'			nb_http_request = nb_http_request + 1;\n';
						app_zwave = app_zwave+'		}\n';
						
						app_zwave = app_zwave+'\n		if (dev=="CMD/INTER" && zwave_id=="'+id_eqp+'" && zwave_status=="OFF")\n'
						app_zwave = app_zwave+'		{\n';
						app_zwave = app_zwave+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID '+id_eqp+' de statut OFF et de type '+type_eqp+'\");\n';
						app_zwave = app_zwave+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=0"\n';
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP DESActivation de l\'equipement\");\n';
						app_zwave = app_zwave+'			console.log(\"  Requete :\" + http_request)\n'; 
						app_zwave = app_zwave+'			request(http_request, function(error, response, body)\n';
						app_zwave = app_zwave+'			{	console.log(new Date() + \" \" + body); });\n';

						app_zwave = app_zwave+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=\" + bat\n';
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP Batterie: \" + bat)\n';
						app_zwave = app_zwave+'			console.log(\"  Requete :\" + http_request)\n';
						app_zwave = app_zwave+'			request(http_request, function(error, response, body)\n';
						app_zwave = app_zwave+'			{	console.log(new Date() + \" \" + body); });\n';
						app_zwave = app_zwave+'			nb_http_request = nb_http_request + 1;\n';
						app_zwave = app_zwave+'		}\n';

						app_zwave = app_zwave+'\n		if (zwave_id=="'+id_eqp+'" && zwave_status=="ON")\n'
						app_zwave = app_zwave+'		{\n';
						app_zwave = app_zwave+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID '+id_eqp+' de statut ON et de type '+type_eqp+'\");\n';
						app_zwave = app_zwave+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=1"\n';
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP Activation de l\'equipement\");\n';
						app_zwave = app_zwave+'			console.log(\"  Requete :\" + http_request)\n'; 
						app_zwave = app_zwave+'			request(http_request, function(error, response, body)\n';
						app_zwave = app_zwave+'			{	console.log(new Date() + \" \" + body); });\n';

						app_zwave = app_zwave+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=\" + bat\n';
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP Batterie: \" + bat)\n';
						app_zwave = app_zwave+'			console.log(\"  Requete :\" + http_request)\n';
						app_zwave = app_zwave+'			request(http_request, function(error, response, body)\n';
						app_zwave = app_zwave+'			{	console.log(new Date() + \" \" + body); });\n';
						app_zwave = app_zwave+'			nb_http_request = nb_http_request + 1;\n';
						app_zwave = app_zwave+'		}\n';
						
						app_zwave = app_zwave+'\n		if (zwave_id=="'+id_eqp+'" && zwave_status=="OFF")\n'
						app_zwave = app_zwave+'		{\n';
						app_zwave = app_zwave+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID '+id_eqp+' de statut OFF et de type '+type_eqp+'\");\n';
						app_zwave = app_zwave+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=0"\n';
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP DESActivation de l\'equipement\");\n';
						app_zwave = app_zwave+'			console.log(\"  Requete :\" + http_request)\n'; 
						app_zwave = app_zwave+'			request(http_request, function(error, response, body)\n';
						app_zwave = app_zwave+'			{	console.log(new Date() + \" \" + body); });\n';

						app_zwave = app_zwave+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=\" + bat\n';
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP Batterie: \" + bat)\n';
						app_zwave = app_zwave+'			console.log(\"  Requete :\" + http_request)\n';
						app_zwave = app_zwave+'			request(http_request, function(error, response, body)\n';
						app_zwave = app_zwave+'			{	console.log(new Date() + \" \" + body); });\n';
						app_zwave = app_zwave+'			nb_http_request = nb_http_request + 1;\n';
						app_zwave = app_zwave+'		}\n';
					}

					if (type_eqp == "transmitter")
					{
						console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id : "+ id_eqp);
						console.log("  Ajout dans le script Zidom du test de remontee sur ce transmitter");
						
						app_zwave = app_zwave+'\n		if (dev=="CMD/INTER" && zwave_id=="'+id_eqp+'" && zwave_status=="ON")\n'
						app_zwave = app_zwave+'		{\n';
						app_zwave = app_zwave+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID '+id_eqp+' de statut ON et de type '+type_eqp+'\");\n';
						app_zwave = app_zwave+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=1"\n';
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP Activation de l\'equipement\");\n';
						app_zwave = app_zwave+'			console.log(\"  Requete :\" + http_request)\n'; 
						app_zwave = app_zwave+'			request(http_request, function(error, response, body)\n';
						app_zwave = app_zwave+'			{	console.log(new Date() + \" \" + body); });\n';

						app_zwave = app_zwave+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=\" + bat\n';
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP Batterie: \" + bat)\n';
						app_zwave = app_zwave+'			console.log(\"  Requete :\" + http_request)\n';
						app_zwave = app_zwave+'			request(http_request, function(error, response, body)\n';
						app_zwave = app_zwave+'			{	console.log(new Date() + \" \" + body); });\n';
						app_zwave = app_zwave+'			nb_http_request = nb_http_request + 1;\n';
						app_zwave = app_zwave+'		}\n';

						app_zwave = app_zwave+'\n		if (dev=="CMD/INTER" && zwave_id=="'+id_eqp+'" && zwave_status=="OFF")\n'
						app_zwave = app_zwave+'		{\n';
						app_zwave = app_zwave+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID '+id_eqp+' de statut OFF et de type '+type_eqp+'\");\n';
						app_zwave = app_zwave+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=0"\n';
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP DESActivation de l\'equipement\");\n';
						app_zwave = app_zwave+'			console.log(\"  Requete :\" + http_request)\n'; 
						app_zwave = app_zwave+'			request(http_request, function(error, response, body)\n';
						app_zwave = app_zwave+'			{	console.log(new Date() + \" \" + body); });\n';

						app_zwave = app_zwave+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=\" + bat\n';
						app_zwave = app_zwave+'			console.log(\"  Envoi de la requete HTTP Batterie: \" + bat)\n';
						app_zwave = app_zwave+'			console.log(\"  Requete :\" + http_request)\n';
						app_zwave = app_zwave+'			request(http_request, function(error, response, body)\n';
						app_zwave = app_zwave+'			{	console.log(new Date() + \" \" + body); });\n';
						app_zwave = app_zwave+'			nb_http_request = nb_http_request + 1;\n';
						app_zwave = app_zwave+'		}\n';
					}

				}
				else if (proto =="RFS10/TS10")
				{
					//A implémenter
					console.log(" Equipement de type "+proto+" | Tests non realises en l absence de ce type d equipement\n");
					app_rfs10ts10=app_rfs10ts10+'	}\n';
					
				}
				else if (proto =="XDD433")
				{
					//A implémenter
					console.log(" Equipement de type "+proto+" | Tests non realises en l absence de ce type d equipement\n");
					app_xdd433alrm=app_xdd433alrm+'	}\n';
					
				}
				else if (proto =="XDD868")
				{
					//A implémenter
					console.log(" Equipement de type "+proto+" | Tests non realises en l absence de ce type d equipement\n");
					app_xdd868alrm=app_xdd868alrm+'	}\n';
					
				}
				else if (proto =="XDD868Inter/Shutter")
				{
					console.log(" Equipement de type "+proto+".");
					console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id : "+ id_eqp);
					console.log("  Ajout dans le script Zidom du test de remontee sur cet équipement");
					
					app_xdd868intershutter = app_xdd868intershutter+'\n		if (S(msg).include(\'Inter/shutter RFY433\') && S(msg).include("'+id_eqp+'_ON"))\n'
					app_xdd868intershutter = app_xdd868intershutter+'		{\n';
					app_xdd868intershutter = app_xdd868intershutter+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID '+id_eqp+' de statut ONet de type '+type_eqp+'\");\n';
					app_xdd868intershutter = app_xdd868intershutter+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=1"\n';
					app_xdd868intershutter = app_xdd868intershutter+'			console.log(\"  Envoi de la requete HTTP Ouvetture volet de l\'equipement \");\n';
					app_xdd868intershutter = app_xdd868intershutter+'			console.log(\"  Requete :\" + http_request)\n'; 
					app_xdd868intershutter = app_xdd868intershutter+'			request(http_request, function(error, response, body)\n';
					app_xdd868intershutter = app_xdd868intershutter+'			{	console.log(new Date() + \" \" + body); });\n';
					app_xdd868intershutter = app_xdd868intershutter+'		}\n';
					
					app_xdd868intershutter = app_xdd868intershutter+'\n		if (S(msg).include(\'Inter/shutter RFY433\') && S(msg).include("'+id_eqp+'_OFF"))\n'
					app_xdd868intershutter = app_xdd868intershutter+'		{\n';
					app_xdd868intershutter = app_xdd868intershutter+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID '+id_eqp+' de statut OFF et de type '+type_eqp+'\");\n';
					app_xdd868intershutter = app_xdd868intershutter+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=0"\n';
					app_xdd868intershutter = app_xdd868intershutter+'			console.log(\"  Envoi de la requete HTTP Fermeture volet de l\'equipement \");\n';
					app_xdd868intershutter = app_xdd868intershutter+'			console.log(\"  Requete :\" + http_request)\n'; 
					app_xdd868intershutter = app_xdd868intershutter+'			request(http_request, function(error, response, body)\n';
					app_xdd868intershutter = app_xdd868intershutter+'			{	console.log(new Date() + \" \" + body); });\n';
					app_xdd868intershutter = app_xdd868intershutter+'		}\n';
					
					app_xdd868intershutter = app_xdd868intershutter+'\n		if (S(msg).include(\'Inter/shutter RFY433\') && S(msg).include("'+id_eqp+'") && S(msg).include("DIM/SPECIAL"))\n'
					app_xdd868intershutter = app_xdd868intershutter+'		{\n';
					app_xdd868intershutter = app_xdd868intershutter+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID '+id_eqp+' de statu DIM/SPECIAL et de type '+type_eqp+'\");\n';
					app_xdd868intershutter = app_xdd868intershutter+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=1"\n';
					app_xdd868intershutter = app_xdd868intershutter+'			console.log(\"  Envoi de la requete HTTP Arret volet de l\'equipement \");\n';
					app_xdd868intershutter = app_xdd868intershutter+'			console.log(\"  Requete :\" + http_request)\n'; 
					app_xdd868intershutter = app_xdd868intershutter+'			request(http_request, function(error, response, body)\n';
					app_xdd868intershutter = app_xdd868intershutter+'			{	console.log(new Date() + \" \" + body); });\n';
					app_xdd868intershutter = app_xdd868intershutter+'		}\n';
				}
				else if (proto =="XDD868PilotWire")
				{
					console.log(" Equipement de type "+proto+" | Tests non realises en l absence de ce type d equipement");
					app_xdd868pilotwire=app_xdd868pilotwire+'	}\n';
					
					app_xdd868pilotwire = app_xdd868pilotwire+'\n		if (S(msg).include(\'XDD868 Radiator/Pilot Wire\') && S(msg).include("'+id_eqp+'_ON"))\n'
					app_xdd868pilotwire = app_xdd868pilotwire+'		{\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID '+id_eqp+' de statut ON et de type '+type_eqp+'\");\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=1"\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'			console.log(\"  Envoi de la requete HTTP Activation de l\'equipement\");\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'			console.log(\"  Requete :\" + http_request)\n'; 
					app_xdd868pilotwire = app_xdd868pilotwire+'			request(http_request, function(error, response, body)\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'			{	console.log(new Date() + \" \" + body); });\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'		}\n';
					
					app_xdd868pilotwire = app_xdd868pilotwire+'		if (S(msg).include(\'XDD868 Radiator/Pilot Wire\') && S(msg).include("'+id_eqp+'_OFF"))\n'
					app_xdd868pilotwire = app_xdd868pilotwire+'		{\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID '+id_eqp+' de statut OFF et de type '+type_eqp+'\");\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=\" + bat\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'			console.log(\"  Envoi de la requete HTTP DESActivation de l\'equipement\")\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'			console.log(\"  Requete :\" + http_request)\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'			request(http_request, function(error, response, body)\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'			{	console.log(new Date() + \" \" + body); });\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'			nb_http_request = nb_http_request + 1;\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'		}\n';

					app_xdd868pilotwire = app_xdd868pilotwire+'\n		if (S(msg).include(\'XDD868 Radiator/Pilot Wire\') && S(msg).include("'+id_eqp+'") && S(msg).include("DIM/SPECIAL"))\n'
					app_xdd868pilotwire = app_xdd868pilotwire+'		{\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID '+id_eqp+' de statut DIM/SPECIAL et de type '+type_eqp+'\");\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=\" + bat\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'			console.log(\"  Envoi de la requete HTTP DIM/SPECIAL de l\equipement\")\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'			console.log(\"  Requete :\" + http_request)\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'			request(http_request, function(error, response, body)\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'			{	console.log(new Date() + \" \" + body); });\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'			nb_http_request = nb_http_request + 1;\n';
					app_xdd868pilotwire = app_xdd868pilotwire+'		}\n';
					
				}
				else if (proto =="XDD868Boiler")
				{
					//A implémenter
					console.log(" Equipement de type "+proto+" | Tests non realises en l absence de ce type d equipement");
					app_xdd868boiler=app_xdd868boiler+'	}\n';
					
				}
				// Traitement des périphériques sans protocoles
				else if (proto =="oregon")
				{
						console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id : "+ id_eqp);
						console.log("  Ajout dans le script Zidom du test de remontee sur ce transmitter");
						app_undefined = app_undefined+'\n		if (id=="'+id_eqp+'")\n'
						app_undefined = app_undefined+'		{\n';
						app_undefined = app_undefined+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID '+id_eqp+' et de type '+type_eqp+'\");\n';
						app_undefined = app_undefined+'			http_request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=\" + tem\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP temperature: \" + tem)\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request)\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{	console.log(new Date() + \" \" + body); });\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';

						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Niveau de reception radio: \" + lev)\n';
						app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=\" + lev\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request)\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{	console.log(new Date() + \" \" + body); });\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';

						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Batterie: \" + bat)\n';
						app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=\" + bat\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request)\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{	console.log(new Date() + \" \" + body); });\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';
						
						app_undefined = app_undefined+'			if (S(msg).include(\'Humidity\'))\n'
						app_undefined = app_undefined+'			{\n';
						app_undefined = app_undefined+'				console.log(\"  Envoi de la requete HTTP Hygrometrie: \" + bat)\n';
						app_undefined = app_undefined+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=\" + hum\n';
						app_undefined = app_undefined+'				console.log(\"  Requete :\" + http_request)\n';
						app_undefined = app_undefined+'				request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'				{	console.log(new Date() + \" \" + body); });\n';
						app_undefined = app_undefined+'				nb_http_request = nb_http_request + 1;\n';
						app_undefined = app_undefined+'			}\n';
						app_undefined = app_undefined+'		}\n';
				}
				else if (proto == "undefined")
				{
					//console.log(" Equipement de type "+proto+".");
					//Traitements des sondes de température					
					if (type_eqp == "temperature")
					{
						console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id : "+ id_eqp);
						console.log("  Ajout dans le script Zidom du test de remontee sur ce transmitter");
						app_undefined = app_undefined+'\n		if (id=="'+id_eqp+'")\n'
						app_undefined = app_undefined+'		{\n';
						app_undefined = app_undefined+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID '+id_eqp+' et de type '+type_eqp+'\");\n';
						app_undefined = app_undefined+'			http_request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=\" + tem\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP temperature: \" + tem)\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request)\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{	console.log(new Date() + \" \" + body); });\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';

						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Niveau de reception radio: \" + lev)\n';
						app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=\" + lev\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request)\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{	console.log(new Date() + \" \" + body); });\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';

						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Batterie: \" + bat)\n';
						app_undefined = app_undefined+'			http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=\" + bat\n';
						app_undefined = app_undefined+'			console.log(\"  Requete :\" + http_request)\n';
						app_undefined = app_undefined+'			request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'			{	console.log(new Date() + \" \" + body); });\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';
						
						app_undefined = app_undefined+'			if (S(msg).include(\'Humidity\'))\n'
						app_undefined = app_undefined+'			{\n';
						app_undefined = app_undefined+'				console.log(\"  Envoi de la requete HTTP Hygrometrie: \" + bat)\n';
						app_undefined = app_undefined+'				http_request = "http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=\" + hum\n';
						app_undefined = app_undefined+'				console.log(\"  Requete :\" + http_request)\n';
						app_undefined = app_undefined+'				request(http_request, function(error, response, body)\n';
						app_undefined = app_undefined+'				{	console.log(new Date() + \" \" + body); });\n';
						app_undefined = app_undefined+'				nb_http_request = nb_http_request + 1;\n';
						app_undefined = app_undefined+'			}\n';
						app_undefined = app_undefined+'		}\n';
					}

					//Traitements des sondes de lumière
					//else if (type_eqp == "light")
					if (type_eqp == "light")
					{
						console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id : "+ id_eqp);
						console.log("  Ajout dans le script Zidom du test de remontee sur ce transmitter");
						app_undefined = app_undefined+'\n		if (id=="'+id_eqp+'" && dev == "Light/UV")\n'
						app_undefined = app_undefined+'		{\n';
						app_undefined = app_undefined+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID '+id_eqp+' et de type '+type_eqp+'\");\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP lumiere: \" + uv)\n';
						app_undefined = app_undefined+'			request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=\" + uv, function(error, response, body)\n';
						app_undefined = app_undefined+'			{	console.log(new Date() + \" \" + body); });\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';

						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Batterie: \" + bat)\n';
						app_undefined = app_undefined+'			request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=\" + bat, function(error, response, body)\n';
						app_undefined = app_undefined+'			{	console.log(new Date() + \" \" + body); });\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';
						app_undefined = app_undefined+'		}\n';
					}

					//Traitements des télécommandes
					//else if (type_eqp == "COMMANDE")
					if (type_eqp == "COMMANDE")
					{
						console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id1 : "+ id1_eqp + " / Id2 : "+ id2_eqp);
						console.log("  Ajout dans le script Zidom du test de remontee sur cette telecommande");
						app_undefined = app_undefined+'\n		if (id=="'+id1_eqp+'")\n'
						app_undefined = app_undefined+'		{\n';
						app_undefined = app_undefined+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID '+id1_eqp+' et de type '+type_eqp+'\");\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Telecommande ON : \" + sta)\n';
						app_undefined = app_undefined+'			request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=1\", function(error, response, body)\n';
						app_undefined = app_undefined+'			{	console.log(new Date() + \" \" + body); });\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';
						
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Batterie Telecommande: \" + bat)\n';
						app_undefined = app_undefined+'			request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=\" + bat, function(error, response, body)\n';
						app_undefined = app_undefined+'			{	console.log(new Date() + \" \" + body); });\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';
						app_undefined = app_undefined+'		}\n';

						
						app_undefined = app_undefined+'\n		if (id=="'+id2_eqp+'")\n'
						app_undefined = app_undefined+'		{\n';
						app_undefined = app_undefined+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID '+id2_eqp+' et de type '+type_eqp+'\");\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Telecommande OFF : \" + sta)\n';
						app_undefined = app_undefined+'			request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=0\", function(error, response, body)\n';
						app_undefined = app_undefined+'			{	console.log(new Date() + \" \" + body); });\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';
						
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Batterie Telecommande: \" + bat)\n';
						app_undefined = app_undefined+'			request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=\" + bat, function(error, response, body)\n';
						app_undefined = app_undefined+'			{	console.log(new Date() + \" \" + body); });\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';
						app_undefined = app_undefined+'		}\n';
					}
					//else if (type_eqp == "COMMANDE2")
					if (type_eqp == "COMMANDE2")
					{
						console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id1 : "+ id1_eqp + " / Id2 : "+ id2_eqp);
						console.log("  Ajout dans le script Zidom du test de remontee sur cette telecommande");
						app_undefined = app_undefined+'\n		if (id=="'+id1_eqp+'")\n'
						app_undefined = app_undefined+'		{\n';
						app_undefined = app_undefined+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID '+id1_eqp+' et de type '+type_eqp+'\");\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Telecommande ON : \" + sta)\n';
						app_undefined = app_undefined+'			request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=1\", function(error, response, body)\n';
						app_undefined = app_undefined+'			{	console.log(new Date() + \" \" + body); });\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';
						
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Batterie Telecommande: \" + bat)\n';
						app_undefined = app_undefined+'			request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=\" + bat, function(error, response, body)\n';
						app_undefined = app_undefined+'			{	console.log(new Date() + \" \" + body); });\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';
						app_undefined = app_undefined+'		}\n';

						
						app_undefined = app_undefined+'\n		if (id=="'+id2_eqp+'")\n'
						app_undefined = app_undefined+'		{\n';
						app_undefined = app_undefined+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID '+id2_eqp+' et de type '+type_eqp+'\");\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Telecommande OFF : \" + sta)\n';
						app_undefined = app_undefined+'			request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=0\", function(error, response, body)\n';
						app_undefined = app_undefined+'			{	console.log(new Date() + \" \" + body); });\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';
						
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Batterie Telecommande: \" + bat)\n';
						app_undefined = app_undefined+'			request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=\" + bat, function(error, response, body)\n';
						app_undefined = app_undefined+'			{	console.log(new Date() + \" \" + body); });\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';
						app_undefined = app_undefined+'		}\n';
					}
					//else if (type_eqp == "COMMANDE4")
					if (type_eqp == "COMMANDE4")
					{
						console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id1 : "+ id1_eqp + " / Id2 : "+ id2_eqp);
						console.log("  Ajout dans le script Zidom du test de remontee sur cette telecommande");
						app_undefined = app_undefined+'\n		if (id=="'+id1_eqp+'")\n'
						app_undefined = app_undefined+'		{\n';
						app_undefined = app_undefined+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID '+id1_eqp+' et de type '+type_eqp+'\");\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Telecommande ON : \" + sta)\n';
						app_undefined = app_undefined+'			request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=1\", function(error, response, body)\n';
						app_undefined = app_undefined+'			{	console.log(new Date() + \" \" + body); });\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';
						
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Batterie Telecommande: \" + bat)\n';
						app_undefined = app_undefined+'			request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=\" + bat, function(error, response, body)\n';
						app_undefined = app_undefined+'			{	console.log(new Date() + \" \" + body); });\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';
						app_undefined = app_undefined+'		}\n';

						
						app_undefined = app_undefined+'\n		if (id=="'+id2_eqp+'")\n'
						app_undefined = app_undefined+'		{\n';
						app_undefined = app_undefined+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID '+id2_eqp+' et de type '+type_eqp+'\");\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Telecommande OFF : \" + sta)\n';
						app_undefined = app_undefined+'			request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=0\", function(error, response, body)\n';
						app_undefined = app_undefined+'			{	console.log(new Date() + \" \" + body); });\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';
						
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Batterie Telecommande: \" + bat)\n';
						app_undefined = app_undefined+'			request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=\" + bat, function(error, response, body)\n';
						app_undefined = app_undefined+'			{	console.log(new Date() + \" \" + body); });\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';
						app_undefined = app_undefined+'		}\n';
					}
					//else if (type_eqp == "transmitter")
					if (type_eqp == "transmitter")
					{
						console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id : "+ id_eqp);
						console.log("  Ajout dans le script Zidom du test de remontee sur ce transmitter");
						
						app_undefined = app_undefined+'\n		if (id=="'+id_eqp+'")\n'
						app_undefined = app_undefined+'		{\n';
						app_undefined = app_undefined+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID '+id_eqp+' et de type '+type_eqp+'\");\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Activation de l\'equipement \");\n';
						app_undefined = app_undefined+'			request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=1\", function(error, response, body)\n';
						app_undefined = app_undefined+'			{	console.log(new Date() + \" \" + body); });\n';

						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Batterie: \" + bat)\n';
						app_undefined = app_undefined+'			request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=\" + bat, function(error, response, body)\n';
						app_undefined = app_undefined+'			{	console.log(new Date() + \" \" + body); });\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';
						app_undefined = app_undefined+'		}\n';

						/*app_undefined = app_undefined+'\n		if (dev=="CMD/INTER" && zwave_id=="'+id_eqp+'_OFF")\n'
						app_undefined = app_undefined+'		{\n';
						app_undefined = app_undefined+'			console.log(\" Test de l equipement ' + name_eqp + ', d\'ID '+id_eqp+' et de type '+type_eqp+'\");\n';
						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP DESActivation de l\'equipement \");\n';
						app_undefined = app_undefined+'			request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=0\", function(error, response, body)\n';
						app_undefined = app_undefined+'			{	console.log(new Date() + \" \" + body); });\n';

						app_undefined = app_undefined+'			console.log(\"  Envoi de la requete HTTP Batterie: \" + bat)\n';
						app_undefined = app_undefined+'			request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=\" + bat, function(error, response, body)\n';
						app_undefined = app_undefined+'			{	console.log(new Date() + \" \" + body); });\n';
						app_undefined = app_undefined+'			nb_http_request = nb_http_request + 1;\n';
						app_undefined = app_undefined+'		}\n';*/
					}
				}
			}
			
			//Extraction des scenarii
			//id_scenario = i['$'].id;
			//name_scenario = i.n;
			//if (id_scenario != "0") { console.log("Lignes : " + count + ", nom scenario : " + name_scenario + ", id: " + id_scenario); }
			//if (id_scenario == undefined) { console.log(" UNDEFINED Lignes : " + count + ", nom scenario : " + name_scenario + ", id: " + id_scenario); }
		});
		//console.log("app_script : "+app_script);

		app_script = app_script+'\n'+
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

		app_script = app_script+'	if (!nb_http_request) { console.log(new Date() + " *** AUCUNE Requete HTTP envoyee a Jeedom ***" + msg.slice(70));}\n';
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
		
		console.log("\n\n------------------------------------------------------------------------------------")
		console.log(" Debut d'Ecriture dans le fichier zidomn.js ...")
		fs.writeFileSync("zidomn.js", app_script, "UTF-8");
		console.log(" Fin d'Ecriture dans le fichier zidomn.js !")
	});
});

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

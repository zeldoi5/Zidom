var clientIp = process.env.MYIP || getIPAddress();
zibase_ip = "192.168.0.X"
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
jeedom_ip = "192.168.0.X";
jeedom_api = "";

jeedom_chemin_install    = "/jeedom/core/api/jeeApi.php?api=";
jeedom_chemin_preinstall = "/core/api/jeeApi.php?api=";
jeedom_chemin = jeedom_chemin_install; // ou jeedom_chemin = jeedom_chemin_preinstall; si jeedom a ete preinstallee

zibase_url = "http://zibase.net/m/get_xml.php?device="+zibase_device+"&token="+zibase_token;


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
app_script = app_script+'	http_request = 0;\n';
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

app_script = app_script+'	console.log("--------------------------------------------------------------------------------------")\n';
app_script = app_script+'	console.log(new Date() + " " + msg.slice(70));\n';
app_script = app_script+'';
app_script = app_script+'	//Test de remontees de composants Inter/shutter RFY433 ou SOMFY		 Sent radio ID (1 Burst(s), Protocols=\'Inter/shutter RFY433\' ): C1_OFF\n';
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
app_script = app_script+'	}\n';
app_script = app_script+'	//Test de remontees de composants Chacon : 	Sent radio ID (1 Burst(s), Protocols=\'Chacon\' ): A1_OFF\n';
app_script = app_script+'	chacon = S(msg).include(\'Chacon\');\n';
app_script = app_script+'	if (S(msg).include(\'Chacon\'))\n';
app_script = app_script+'	{\n';
app_script = app_script+'		chacon = true;\n';
app_script = app_script+'		console.log("Debug : chacon    : " + chacon + " | Composant/Id " + id);\n';
app_script = app_script+'	}\n';
app_script = app_script+'	// Test de remontees de composants Oregon	Received radio ID (<rf>433Mhz Oregon</rf> Noise=<noise>2453</noise> Level=<lev>5.0</lev>/5 <dev>THWR288A-THN132N</dev> Ch=<ch>2</ch> T=<tem>+23.3</tem>C (+73.9F)  Batt=<bat>Ok</bat>): <id>OS3930896642</id>  Batt=<bat>Ok</bat>): <id>OS4294967047</id>\n';
app_script = app_script+'	oregon = S(msg).include(\'Oregon\');\n';
app_script = app_script+'	if (S(msg).include(\'Oregon\'))\n';
app_script = app_script+'	{\n';
app_script = app_script+'		oregon = true;\n';
app_script = app_script+'		console.log("Debug : oregon    : " + oregon + " | Composant/Id " + id);\n';
app_script = app_script+'	}\n';
app_script = app_script+'	//Test de remontees de composants ZWAVE (ou ZWave)\n';
app_script = app_script+'	zwave = S(msg).include(\'ZWAVE\')||S(msg).include(\'ZWave\');\n';
app_script = app_script+'	zwave_id = "";\n';
app_script = app_script+'	zwave_status = "";\n';
app_script = app_script+'	zwave = S(msg).include(\'ZWAVE\')||S(msg).include(\'ZWave\');\n';
app_script = app_script+'	zwave_id = "";\n';
app_script = app_script+'	zwave_status = "";\n';
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
	
	var name_eqp = "";
	var id_eqp= "";
	var id1_eqp= "";
	var id2_eqp= "";
	var id3_eqp= "";
	var id4_eqp= "";
	var type_eqp = "";
	var proto_i = "";
	var proto = "";
	
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
				if (S(id_eqp).startsWith('Z'))
				{	proto ="ZWAVE";	}
			}
			else
			{
				if (proto_i == 1 ) { proto ="VISONIC433";}
				if (proto_i == 2 ) { proto ="VISONIC868";}
				if (proto_i == 3 ) { proto ="CHACON";}
				if (proto_i == 4 ) { proto ="DOMIA";}
				if (proto_i == 5 ) { proto ="RF X10";}
				if (proto_i == 6 ) { proto ="ZWAVE";}
				if (proto_i == 7 ) { proto ="RFS10/TS10";}
				if (proto_i == 8 ) { proto ="XDD433";}
				if (proto_i == 9 ) { proto ="XDD868";}
				if (proto_i == 10 ) { proto ="XDD868Inter/Shutter";}
				if (proto_i == 11 ) { proto ="XDD868PilotWire";}
				if (proto_i == 12 ) { proto ="XDD868Boiler";}
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
				if (type_eqp == "power")
				{
					console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id : "+ id_eqp);
					console.log("  Ajout dans le script Zidom du test de remontee sur ce Power");
					app_script = app_script+'	if (id=="'+id_eqp+'")\n'
					app_script = app_script+'	{\n';
					app_script = app_script+'		console.log(\" Test de l equipement ' + name_eqp + ', d\'ID '+id_eqp+' et de type '+type_eqp+'\")\n';
					app_script = app_script+'		console.log(\"  Envoi de la requete HTTP Total Energy: \" + kwh)\n';
					app_script = app_script+'		request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=\" + kwh, function(error, response, body)\n';
					app_script = app_script+'		{	console.log(new Date() + \" \" + body); });\n';
					app_script = app_script+'		http_request = http_request + 1;\n';

					app_script = app_script+'		console.log(\"  Envoi de la requete HTTP Power: \" + w)\n';
					app_script = app_script+'		request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=\" + w, function(error, response, body)\n';
					app_script = app_script+'		{	console.log(new Date() + \" \" + body); });\n';
					app_script = app_script+'		http_request = http_request + 1;\n';

					app_script = app_script+'		console.log(\"  Envoi de la requete HTTP Batterie: \" + bat)\n';
					app_script = app_script+'		request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=\" + bat, function(error, response, body)\n';
					app_script = app_script+'		{	console.log(new Date() + \" \" + body); });\n';
					app_script = app_script+'		http_request = http_request + 1;\n';
					app_script = app_script+'	}\n';
				}
				if (type_eqp == "COMMANDE")
				{
					console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id1 : "+ id1_eqp + " / Id2 : "+ id2_eqp);
					console.log("  Ajout dans le script Zidom du test de remontee sur cette telecommande");
					app_script = app_script+'	if (id=="'+id1_eqp+'")\n'
					app_script = app_script+'	{\n';
					app_script = app_script+'		console.log(\" Test de l equipement ' + name_eqp + ', d\'ID '+id1_eqp+' et de type '+type_eqp+'\")\n';
					app_script = app_script+'		console.log(\"  Envoi de la requete HTTP Telecommande ON : \" + sta)\n';
					app_script = app_script+'		request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=1\", function(error, response, body)\n';
					app_script = app_script+'		{	console.log(new Date() + \" \" + body); });\n';
					app_script = app_script+'		http_request = http_request + 1;\n';
					
					app_script = app_script+'		console.log(\"  Envoi de la requete HTTP Batterie Telecommande: \" + bat)\n';
					app_script = app_script+'		request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=\" + bat, function(error, response, body)\n';
					app_script = app_script+'		{	console.log(new Date() + \" \" + body); });\n';
					app_script = app_script+'		http_request = http_request + 1;\n';
					app_script = app_script+'	}\n';

					
					app_script = app_script+'	if (id=="'+id2_eqp+'")\n'
					app_script = app_script+'	{\n';
					app_script = app_script+'		console.log(\" Test de l equipement ' + name_eqp + ', d\'ID '+id2_eqp+' et de type '+type_eqp+'\")\n';
					app_script = app_script+'		console.log(\"  Envoi de la requete HTTP Telecommande OFF : \" + sta)\n';
					app_script = app_script+'		request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=0\", function(error, response, body)\n';
					app_script = app_script+'		{	console.log(new Date() + \" \" + body); });\n';
					app_script = app_script+'		http_request = http_request + 1;\n';
					
					app_script = app_script+'		console.log(\"  Envoi de la requete HTTP Batterie Telecommande: \" + bat)\n';
					app_script = app_script+'		request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=\" + bat, function(error, response, body)\n';
					app_script = app_script+'		{	console.log(new Date() + \" \" + body); });\n';
					app_script = app_script+'		http_request = http_request + 1;\n';
					app_script = app_script+'	}\n';
				}
				if (type_eqp == "COMMANDE2")
				{
					console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id1 : "+ id1_eqp + " / Id2 : "+ id2_eqp);
					console.log("  Ajout dans le script Zidom du test de remontee sur cette telecommande");
					app_script = app_script+'	if (id=="'+id1_eqp+'")\n'
					app_script = app_script+'	{\n';
					app_script = app_script+'		console.log(\" Test de l equipement ' + name_eqp + ', d\'ID '+id1_eqp+' et de type '+type_eqp+'\")\n';
					app_script = app_script+'		console.log(\"  Envoi de la requete HTTP Telecommande ON : \" + sta)\n';
					app_script = app_script+'		request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=1\", function(error, response, body)\n';
					app_script = app_script+'		{	console.log(new Date() + \" \" + body); });\n';
					app_script = app_script+'		http_request = http_request + 1;\n';
					
					app_script = app_script+'		console.log(\"  Envoi de la requete HTTP Batterie Telecommande: \" + bat)\n';
					app_script = app_script+'		request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=\" + bat, function(error, response, body)\n';
					app_script = app_script+'		{	console.log(new Date() + \" \" + body); });\n';
					app_script = app_script+'		http_request = http_request + 1;\n';
					app_script = app_script+'	}\n';

					
					app_script = app_script+'	if (id=="'+id2_eqp+'")\n'
					app_script = app_script+'	{\n';
					app_script = app_script+'		console.log(\" Test de l equipement ' + name_eqp + ', d\'ID '+id2_eqp+' et de type '+type_eqp+'\")\n';
					app_script = app_script+'		console.log(\"  Envoi de la requete HTTP Telecommande OFF : \" + sta)\n';
					app_script = app_script+'		request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=0\", function(error, response, body)\n';
					app_script = app_script+'		{	console.log(new Date() + \" \" + body); });\n';
					app_script = app_script+'		http_request = http_request + 1;\n';
					
					app_script = app_script+'		console.log(\"  Envoi de la requete HTTP Batterie Telecommande: \" + bat)\n';
					app_script = app_script+'		request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=\" + bat, function(error, response, body)\n';
					app_script = app_script+'		{	console.log(new Date() + \" \" + body); });\n';
					app_script = app_script+'		http_request = http_request + 1;\n';
					app_script = app_script+'	}\n';
				}
				if (type_eqp == "COMMANDE4")
				{
					console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id1 : "+ id1_eqp + " / Id2 : "+ id2_eqp);
					console.log("  Ajout dans le script Zidom du test de remontee sur cette telecommande");
					app_script = app_script+'	if (id=="'+id1_eqp+'")\n'
					app_script = app_script+'	{\n';
					app_script = app_script+'		console.log(\" Test de l equipement ' + name_eqp + ', d\'ID '+id1_eqp+' et de type '+type_eqp+'\")\n';
					app_script = app_script+'		console.log(\"  Envoi de la requete HTTP Telecommande ON : \" + sta)\n';
					app_script = app_script+'		request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=1\", function(error, response, body)\n';
					app_script = app_script+'		{	console.log(new Date() + \" \" + body); });\n';
					app_script = app_script+'		http_request = http_request + 1;\n';
					
					app_script = app_script+'		console.log(\"  Envoi de la requete HTTP Batterie Telecommande: \" + bat)\n';
					app_script = app_script+'		request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=\" + bat, function(error, response, body)\n';
					app_script = app_script+'		{	console.log(new Date() + \" \" + body); });\n';
					app_script = app_script+'		http_request = http_request + 1;\n';
					app_script = app_script+'	}\n';

					
					app_script = app_script+'	if (id=="'+id2_eqp+'")\n'
					app_script = app_script+'	{\n';
					app_script = app_script+'		console.log(\" Test de l equipement ' + name_eqp + ', d\'ID '+id2_eqp+' et de type '+type_eqp+'\")\n';
					app_script = app_script+'		console.log(\"  Envoi de la requete HTTP Telecommande OFF : \" + sta)\n';
					app_script = app_script+'		request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=0\", function(error, response, body)\n';
					app_script = app_script+'		{	console.log(new Date() + \" \" + body); });\n';
					app_script = app_script+'		http_request = http_request + 1;\n';
					
					app_script = app_script+'		console.log(\"  Envoi de la requete HTTP Batterie Telecommande: \" + bat)\n';
					app_script = app_script+'		request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=\" + bat, function(error, response, body)\n';
					app_script = app_script+'		{	console.log(new Date() + \" \" + body); });\n';
					app_script = app_script+'		http_request = http_request + 1;\n';
					app_script = app_script+'	}\n';
				}

				if (type_eqp == "receiverXDom")
				{
					console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id : "+ id_eqp);
					console.log("  Ajout dans le script Zidom du test de remontee sur ce receiverXDom");
					if (proto !="XDD868Inter/Shutter")
					{
						app_script = app_script+'	if (dev=="CMD/INTER" && id=="'+id_eqp+'_ON")\n'
						app_script = app_script+'	{\n';
						app_script = app_script+'		console.log(\" Test de l equipement ' + name_eqp + ', d\'ID '+id_eqp+' et de type '+type_eqp+'\")\n';
						app_script = app_script+'		console.log(\"  Envoi de la requete HTTP Activation de l\'equipement \")\n';
						app_script = app_script+'		request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=1\", function(error, response, body)\n';
						app_script = app_script+'		{	console.log(new Date() + \" \" + body); });\n';

						app_script = app_script+'		console.log(\"  Envoi de la requete HTTP Batterie: \" + bat)\n';
						app_script = app_script+'		request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=\" + bat, function(error, response, body)\n';
						app_script = app_script+'		{	console.log(new Date() + \" \" + body); });\n';
						app_script = app_script+'		http_request = http_request + 1;\n';
						app_script = app_script+'	}\n';
						
						app_script = app_script+'	if (dev=="CMD/INTER" && id=="'+id_eqp+'_OFF")\n'
						app_script = app_script+'	{\n';
						app_script = app_script+'		console.log(\" Test de l equipement ' + name_eqp + ', d\'ID '+id_eqp+' et de type '+type_eqp+'\")\n';
						app_script = app_script+'		console.log(\"  Envoi de la requete HTTP DESActivation de l\'equipement \")\n';
						app_script = app_script+'		request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=0\", function(error, response, body)\n';
						app_script = app_script+'		{	console.log(new Date() + \" \" + body); });\n';

						app_script = app_script+'		console.log(\"  Envoi de la requete HTTP Batterie: \" + bat)\n';
						app_script = app_script+'		request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=\" + bat, function(error, response, body)\n';
						app_script = app_script+'		{	console.log(new Date() + \" \" + body); });\n';
						app_script = app_script+'		http_request = http_request + 1;\n';
						app_script = app_script+'	}\n';
					}
					else
					{
						app_script = app_script+'	if (S(msg).include(\'Inter/shutter RFY433\') && S(msg).include("'+id_eqp+'_ON"))\n'
						app_script = app_script+'	{\n';
						app_script = app_script+'		console.log(\" Test de l equipement ' + name_eqp + ', d\'ID '+id_eqp+' et de type '+type_eqp+'\")\n';
						app_script = app_script+'		console.log(\"  Envoi de la requete HTTP Fermeture volet de l\'equipement \")\n';
						app_script = app_script+'		request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=1\", function(error, response, body)\n';
						app_script = app_script+'		{	console.log(new Date() + \" \" + body); });\n';
						app_script = app_script+'	}\n';
						
						app_script = app_script+'	if (S(msg).include(\'Inter/shutter RFY433\') && S(msg).include("'+id_eqp+'_OFF"))\n'
						app_script = app_script+'	{\n';
						app_script = app_script+'		console.log(\" Test de l equipement ' + name_eqp + ', d\'ID '+id_eqp+' et de type '+type_eqp+'\")\n';
						app_script = app_script+'		console.log(\"  Envoi de la requete HTTP Ouverture volet de l\'equipement \")\n';
						app_script = app_script+'		request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=0\", function(error, response, body)\n';
						app_script = app_script+'		{	console.log(new Date() + \" \" + body); });\n';
						app_script = app_script+'	}\n';
					}
				}
				if (type_eqp == "transmitter")
				{
					console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id : "+ id_eqp);
					console.log("  Ajout dans le script Zidom du test de remontee sur ce transmitter");

					
					app_script = app_script+'	if (dev=="CMD/INTER" && id=="'+id_eqp+'_ON")\n'
					app_script = app_script+'	{\n';
					app_script = app_script+'		console.log(\" Test de l equipement ' + name_eqp + ', d\'ID '+id_eqp+' et de type '+type_eqp+'\")\n';
					app_script = app_script+'		console.log(\"  Envoi de la requete HTTP Activation de l\'equipement \")\n';
					app_script = app_script+'		request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=1\", function(error, response, body)\n';
					app_script = app_script+'		{	console.log(new Date() + \" \" + body); });\n';

					app_script = app_script+'		console.log(\"  Envoi de la requete HTTP Batterie: \" + bat)\n';
					app_script = app_script+'		request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=\" + bat, function(error, response, body)\n';
					app_script = app_script+'		{	console.log(new Date() + \" \" + body); });\n';
					app_script = app_script+'		http_request = http_request + 1;\n';
					app_script = app_script+'	}\n';

					app_script = app_script+'	if (dev=="CMD/INTER" && id=="'+id_eqp+'_OFF")\n'
					app_script = app_script+'	{\n';
					app_script = app_script+'		console.log(\" Test de l equipement ' + name_eqp + ', d\'ID '+id_eqp+' et de type '+type_eqp+'\")\n';
					app_script = app_script+'		console.log(\"  Envoi de la requete HTTP DESActivation de l\'equipement \")\n';
					app_script = app_script+'		request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=0\", function(error, response, body)\n';
					app_script = app_script+'		{	console.log(new Date() + \" \" + body); });\n';

					app_script = app_script+'		console.log(\"  Envoi de la requete HTTP Batterie: \" + bat)\n';
					app_script = app_script+'		request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=\" + bat, function(error, response, body)\n';
					app_script = app_script+'		{	console.log(new Date() + \" \" + body); });\n';
					app_script = app_script+'		http_request = http_request + 1;\n';
					app_script = app_script+'	}\n';
				}
				if (type_eqp == "temperature")
				{
					console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id : "+ id_eqp);
					console.log("  Ajout dans le script Zidom du test de remontee sur ce transmitter");
					app_script = app_script+'	if (id=="'+id_eqp+'")\n'
					app_script = app_script+'	{\n';
					app_script = app_script+'		console.log(\" Test de l equipement ' + name_eqp + ', d\'ID '+id_eqp+' et de type '+type_eqp+'\")\n';
					app_script = app_script+'		console.log(\"  Envoi de la requete HTTP temperature: \" + tem)\n';
					app_script = app_script+'		request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=\" + tem, function(error, response, body)\n';
					app_script = app_script+'		{	console.log(new Date() + \" \" + body); });\n';
					app_script = app_script+'		http_request = http_request + 1;\n';

					app_script = app_script+'		console.log(\"  Envoi de la requete HTTP Niveau de reception radio: \" + lev)\n';
					app_script = app_script+'		request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=\" + lev, function(error, response, body)\n';
					app_script = app_script+'		{	console.log(new Date() + \" \" + body); });\n';
					app_script = app_script+'		http_request = http_request + 1;\n';

					app_script = app_script+'		console.log(\"  Envoi de la requete HTTP Batterie: \" + bat)\n';
					app_script = app_script+'		request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=\" + bat, function(error, response, body)\n';
					app_script = app_script+'		{	console.log(new Date() + \" \" + body); });\n';
					app_script = app_script+'		http_request = http_request + 1;\n';
					
					app_script = app_script+'		if (S(msg).include(\'Humidity\'))\n'
					app_script = app_script+'		{\n';
					app_script = app_script+'			console.log(\"  Envoi de la requete HTTP Hygrometrie: \" + bat)\n';
					app_script = app_script+'			request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=\" + hum, function(error, response, body)\n';
					app_script = app_script+'			{	console.log(new Date() + \" \" + body); });\n';
					app_script = app_script+'			http_request = http_request + 1;\n';
					app_script = app_script+'		}\n';
					app_script = app_script+'	}\n';
				}
				if (type_eqp == "light")
				{
					console.log(" Equipement " + name_eqp + ", de type " + type_eqp + " / Id : "+ id_eqp);
					console.log("  Ajout dans le script Zidom du test de remontee sur ce transmitter");
					app_script = app_script+'	if (id=="'+id_eqp+'" && dev == "Light/UV")\n'
					app_script = app_script+'	{\n';
					app_script = app_script+'		console.log(\" Test de l equipement ' + name_eqp + ', d\'ID '+id_eqp+' et de type '+type_eqp+'\")\n';
					app_script = app_script+'		console.log(\"  Envoi de la requete HTTP lumiere: \" + uv)\n';
					app_script = app_script+'		request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=\" + uv, function(error, response, body)\n';
					app_script = app_script+'		{	console.log(new Date() + \" \" + body); });\n';
					app_script = app_script+'		http_request = http_request + 1;\n';

					app_script = app_script+'		console.log(\"  Envoi de la requete HTTP Batterie: \" + bat)\n';
					app_script = app_script+'		request(\"http://'+jeedom_ip+jeedom_chemin+jeedom_api+'&type=virtual&id=42&value=\" + bat, function(error, response, body)\n';
					app_script = app_script+'		{	console.log(new Date() + \" \" + body); });\n';
					app_script = app_script+'		http_request = http_request + 1;\n';
					app_script = app_script+'	}\n';
				}

			}
			

			//Extraction des scenarii
			//id_scenario = i['$'].id;
			//name_scenario = i.n;
			//if (id_scenario != "0") { console.log("Lignes : " + count + ", nom scenario : " + name_scenario + ", id: " + id_scenario); }
			//if (id_scenario == undefined) { console.log(" UNDEFINED Lignes : " + count + ", nom scenario : " + name_scenario + ", id: " + id_scenario); }
		});
		//console.log("app_script : "+app_script);
		 
		app_script = app_script+'	if (!http_request) { console.log(new Date() + " *** AUCUNE Requete HTTP envoyee a Jeedom ***" + msg.slice(70));}\n';
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

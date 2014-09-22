var clientIp = process.env.MYIP || getIPAddress();
var zibaseIp = process.env.IP_ZIBASE|| "192.168.X.X";

var S = require('string');
var request = require("request");
var dgram = require("dgram");
var server = dgram.createSocket("udp4");
var client = dgram.createSocket("udp4");

var expr,chacon,oregon,zwave,temp_web = require('string')
//http://stringjs.com/#methods/between-left-right

var zibase_device, zibase_token = require('string')

var b = new Buffer(70);
b.fill(0);
b.write('ZSIG\0', 0/*offset*/);
b.writeUInt16BE(13,4); //command HOST REGISTERING (13)
b.writeUInt32BE(dot2num(clientIp), 50);
b.writeUInt32BE(0x42CC, 54); // port 17100 0x42CC

chacon = false;
oregon = false;
zwave = false;
temp_web = false;
jeedom_api = "";

console.log(b);
console.log(b.toString('hex', 0, b.length));

var parseString = require('xml2js').parseString;
server.on("error", function (err) {
  console.log("server error:\n" + err.stack);
  server.close();
});

server.on("message", function (msg, rinfo) {
	//Booleen de génération de requête HTTP
	http_request = 0;

	//Tests des remontées de sondes de température/hygrométrie OREGON via les balises id/tem/hum
	id 		= S(msg).between('<id>', '</id>').s;
	tem 	= S(msg).between('<tem>', '</tem>').s;
	hum 	= S(msg).between('<hum>', '</hum>').s;
	rf 		= S(msg).between('<rf>', '</rf>').s;
	//Remontée de l'état de la batterie
	bat 	= S(msg).between('<bat>', '</bat>').s;
	if (bat == "OK" || bat == "Ok") { bat_bool = 1}
	else { bat_bool = 0}
	dev 	= S(msg).between('<dev>', '</dev>').s;
	//Remontée des consommations
	kwh 	= S(msg).between('<kwh>', '</kwh>').s;
	w 		= S(msg).between('<w>', '</w>').s;
	//Remontée des classes : ex. Class=0x<cla>30</cla>
	cla 	= S(msg).between('<cla>', '</cla>').s;
	//Remontée des op : ex. Op=0x<op>03</op>
	op 		= S(msg).between('<op>', '</op>').s;
	//Remontée des channels de communications : ex. Ch=<ch>0</ch>
	ch 		= S(msg).between('<ch>', '</ch>').s;
	//Remontée des type de mesure : ex. <uv>Light/UV</uv>
	uv 		= S(msg).between('<uv>', '</uv>').s;
	//Remontée des niveaux de mesure : ex. Level=<uvl>2</uvl>
	uvl 	= S(msg).between('<uvl>', '</uvl>').s;
	lev 	= S(msg).between('<lev>', '</lev>').s
	//Remontée du bruit de mesure : ex. Noise=<noise>0</noise>
	noise 	= S(msg).between('<noise>', '</noise>').s;
	//Remontée du sta (status?) : ex. <sta>ON</sta> ou <sta>OFF</sta>
	sta 	= S(msg).between('<sta>', '</sta>').s;
 
	console.log("\n--------------------------------------------------------------------------------------")
	console.log(new Date() + " " + msg.slice(70));

	//Test de remontées de composants Inter/shutter RFY433 ou SOMFY
	//Sent radio ID (1 Burst(s), Protocols='Inter/shutter RFY433' ): C1_OFF
	somfy = S(msg).include('Inter/shutter RFY433'); somfy_id = ""; somfy_power_ON = ""; somfy_power_OFF = ""; somfy_DIM_SPECIAL = ""; 
	if (S(msg).include('Inter/shutter RFY433'))
	{
		somfy = true;
		somfy_id 			= S(msg).between("Protocols='Inter/shutter RFY433' ): ", " ").s;
		somfy_power_ON 		= S(msg).include('_ON');
		somfy_power_OFF 	= S(msg).include('_OFF');
		somfy_DIM_SPECIAL 	= S(msg).include('DIM/SPECIAL');
		console.log("Debug : somfy     : " + somfy + " | Power ON : " + somfy_power_ON + " | Power OFF : " + somfy_power_OFF + " | DIM/SPECIAL : " + somfy_DIM_SPECIAL);
	}

	//Test de remontées de composants Chacon
	//Sent radio ID (1 Burst(s), Protocols='Chacon' ): A1_OFF
	chacon = S(msg).include('Chacon');
	if (S(msg).include('Chacon'))
	{
		chacon = true;
		console.log("Debug : chacon    : " + chacon + " | Composant/Id " + id);
	}

	// Test de remontées de composants Oregon
	//Received radio ID (<rf>433Mhz Oregon</rf> Noise=<noise>2453</noise> Level=<lev>5.0</lev>/5 <dev>THWR288A-THN132N</dev> Ch=<ch>2</ch> T=<tem>+23.3</tem>C (+73.9F)  Batt=<bat>Ok</bat>): <id>OS3930896642</id>  Batt=<bat>Ok</bat>): <id>OS4294967047</id>
	oregon = S(msg).include('Oregon');
	if (S(msg).include('Oregon'))
	{
		oregon = true;
		console.log("Debug : oregon    : " + oregon + " | Composant/Id " + id);
	}

	//Test de remontées de composants ZWAVE (ou ZWave)
	zwave = S(msg).include('ZWAVE')||S(msg).include('ZWave');
	zwave_id = "";
	zwave_status = "";
	if (S(msg).include('ZWAVE')||S(msg).include('ZWave'))
	{
		zwave = true;
		//Test pour identifier le statut du composant ZWAVE
		//Exemples :
		//Tue Aug 19 2014 19:52:59 GMT+0100 (BST) Received radio ID (<rf>ZWAVE ZC7</rf>  <dev>CMD/INTER</dev>  Batt=<bat>Ok</bat>): <id>ZC7_OFF</id> 
		//Thu Aug 14 2014 23:03:59 GMT+0100 (BST) Sent radio ID (1 Burst(s), Protocols='ZWave n38'  Last RF Transmit Time=20ms): ZC7_ON
		//Thu Aug 14 2014 23:04:47 GMT+0100 (BST) Sent radio ID (1 Burst(s), Protocols='ZWave n38'  Last RF Transmit Time=10ms): ZC7_OFF
		//Thu Aug 14 2014 23:33:06 GMT+0100 (BST) Received radio ID (<rf>ZWAVE ZC4</rf> <dev>WakeUp</dev> Batt=<bat>Ok</bat>): <id>WZC4</id>
		//Thu Aug 14 2014 23:01:07 GMT+0100 (BST) Received radio ID (<rf>ZWAVE ZC5</rf> <dev>Low-Power Measure</dev> Total Energy=<kwh>1.0</kwh>kWh Power=<w>00</w>W Batt=<bat>Ok</bat>): <id>PZC6</id>
		//Thu Aug 14 2014 23:33:06 GMT+0100 (BST) Received radio ID (<rf>ZWAVE ZC6</rf> <dev>WakeUp</dev> Batt=<bat>Ok</bat>): <id>WZC4</id>
		
		if (S(msg).include('ZWave message') && S(msg).include('Battery level'))
		{
			zwave_message = true;
			zwave_id= S(msg).between('Device Z', ' Battery level').s;
			bat 	= S(msg).between('level=', '%').s;
		}
		if ((S(msg).include('_ON')))
		{
			zwave_status = "ON";
			//Test pour identifier le composant ZWAVE impacté
			if ((S(msg).include("ZWave")))	//Sent radio ID (1 Burst(s), Protocols='ZWave n38'  Last RF Transmit Time=20ms): ZC7_ON
			{ zwave_id = S(msg).between(': Z', '_ON').s; }
			else if ((S(msg).include("ZWAVE")))	//Received radio ID (<rf>ZWAVE ZC4</rf> <dev>WakeUp</dev> Batt=<bat>Ok</bat>): <id>WZC4</id>
			{ zwave_id = S(msg).between('<rf>ZWAVE Z','</rf>').s; }
			//console.log("Debug (1) : zwave     : " + zwave + " | Composant " + zwave_id + " | Statut : " + zwave_status);
		}
		//Thu Aug 14 2014 23:04:47 GMT+0100 (BST) Sent radio ID (1 Burst(s), Protocols='ZWave n38'  Last RF Transmit Time=10ms): ZC7_OFF
		else if ((S(msg).include('_OFF')))
		{
			zwave_status = "OFF";
			//Test pour identifier le composant ZWAVE impacté
			if ((S(msg).include("ZWave")))	//Sent radio ID (1 Burst(s), Protocols='ZWave n38'  Last RF Transmit Time=20ms): ZC7_OFF
			{ zwave_id = S(msg).between(': Z', '_OFF').s; }
			else if ((S(msg).include("ZWAVE")))	//Received radio ID (<rf>ZWAVE ZC4</rf> <dev>WakeUp</dev> Batt=<bat>Ok</bat>): <id>WZC4</id>
			{ zwave_id = S(msg).between('<rf>ZWAVE Z','</rf>').s; }
			//console.log("Debug (2) : zwave     : " + zwave + " | Composant " + zwave_id + " | Statut : " + zwave_status);
		}
		else if ((!S(msg).include('_OFF'))&&(!S(msg).include('_ON')))
		{
			zwave_status = "UNKNOWN";
			if ((S(msg).include("ZWave")))	//Received radio ID (<rf>ZWAVE ZC5</rf> <dev>Low-Power Measure</dev> Total Energy=<kwh>1.0</kwh>kWh Power=<w>00</w>W Batt=<bat>Ok</bat>): <id>PZC6</id>
			{ zwave_id = S(msg).between(': Z', '_ON').s; }
			else if ((S(msg).include("ZWAVE")))	//Received radio ID (<rf>ZWAVE ZC5</rf> <dev>Low-Power Measure</dev> Total Energy=<kwh>1.0</kwh>kWh Power=<w>00</w>W Batt=<bat>Ok</bat>): <id>PZC6</id>
			{ zwave_id = S(msg).between('<rf>ZWAVE Z','</rf>').s; }
			//console.log("Debug (3) : zwave     : " + zwave + " | Composant " + zwave_id + " | Statut : " + zwave_status);
		}
		console.log("Debug Detection ZWAVE : zwave     : " + zwave + " | Composant " + zwave_id + " | Statut : " + zwave_status);
	}	

	// ******************************************************************************************************************
	// ************************************************** Analyse *******************************************************
	// ******************************************************************************************************************
	
	// Test de remontée ZWAVE
	if (zwave)
	{
	}
	// Received radio ID (<rf>INTERNAL</rf> Noise=<noise>0</noise> Level=<lev>0.0</lev>/5 <dev>TH V1.0</dev> Ch=<ch>1</ch> T=<tem>+17.0</tem>C (+62.6F) Humidity=<hum>59</hum>%  Batt=<bat>Ok</bat>): <id>OS65537</id>
	if (rf == "INTERNAL")
	{
	}
	//Sent radio ID (1 Burst(s), Protocols='Inter/shutter RFY433' ): C2_OFF 
	//Sent radio ID (1 Burst(s), Protocols='Inter/shutter RFY433' ): C2 DIM/SPECIAL 
	//Sent radio ID (1 Burst(s), Protocols='Inter/shutter RFY433' ): C2_ON 
// //Volets Somfy
	if (somfy)
	{
	}
// //Chacon
	if (chacon)
	{
	}
	
// //Sondes Oregon :
	if (oregon)
	{
	}
	//if (!http_request) { console.log(new Date() + " *** AUCUNE Requete HTTP envoyee a Jeedom ***\n" + msg.slice(70));}
});

server.on("listening", function () {
  var address = server.address();
  console.log("server listening " +
	  address.address + ":" + address.port);
});

client.send(b, 0, b.length, 49999, zibaseIp, function(err, bytes) {
  client.close();
});

server.bind(0x42CC, clientIp);


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

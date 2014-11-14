#!/bin/sh
echo "####################################"
echo "# Script de redemarrage zidomn13.js#"
echo "####################################"

cd /home/jeedom/script

echo `date` >> reboot_log.txt

echo "Check zidomn13.js process"
pid=$(ps -ef |grep zidomn13.js | grep -v grep | awk '{print $2}')
echo "Numero de Process du script zidomn13.js arrete:" $pid >> reboot_log.txt

if pidof -x node;
 then 
  stop=$(kill $pid)
  echo $stop
else echo "Aucun process zidomn de lance"
fi

cd /home/jeedom/script
echo "Redemarrage script zidomn13.js" >> reboot_log.txt
echo /usr/bin/node zidomn13.js >> suivi_activite13.txt&
sleep 10
pid_new=&(ps -ef |grep zidomn13.js | grep -v grep | awk '{print $2}')
echo "Numero de Process du nouveau script zidomn13.js :" $pid_new
echo $pin_new >> reboot_log.txt
echo "-----------------------------------------" >> reboot_log.txt

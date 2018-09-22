/**************************************************************************
*  Realtime Alerting for Google Analytics
*  Version: 1.1
*  Authors: Dan Gilbert - @dangilbertnow & Ed Guccione @triweasel
**************************************************************************/

/**
* Global Variables.
* Availabile to all functions in all .gs script files. 
*/

GITHUB_URL = "https://raw.githubusercontent.com/99-metrics/ga-realtime-alerting/master/Version.gs";
SHEET_URL = SpreadsheetApp.getActiveSpreadsheet().getUrl();
SHEET_NAME = SpreadsheetApp.getActiveSpreadsheet().getName();

function checkScriptVersion(){
  var response = UrlFetchApp.fetch(GITHUB_URL);
  var currentVersion = ScriptApp.getResource("Version").getDataAsString().match(/Version:\s[0-9]+\.[0-9]+/)[0];
  Logger.log(currentVersion);
  var latestVersion = response.getContentText().match(/Version:\s[0-9]+\.[0-9]+/)[0];
  Logger.log(latestVersion);
  
  if(currentVersion != latestVersion) { 
    //read for multiplier
    var updateEmailMultiplier =  readScriptProperty("updateEmailMultiplier")
    //check if multiplier exists and if it doesn't set it to 1
    if(!updateEmailMultiplier){
      setScriptProperty("updateEmailMultiplier",  1)
      var updateEmailMultiplier =  readScriptProperty("updateEmailMultiplier")}
    //times 28 by multiplier to get current wait before sending an email
    var howManywaitdays = 1440*(28*updateEmailMultiplier)
    Logger.log(howManywaitdays/60/24)
    //check if time since last an email was sent is greater than the wait time or if an email has never been sent
    if(hasPreviousAlertExpired("updateEmail",howManywaitdays)){
      //if it is greater than the wait time then send email
      MailApp.sendEmail({to:USER_EMAIL,subject: "GA Real Time Alerting: Script Update", htmlBody:"<p>There's a new version of the Real Time Alerting Script.</p><p>To get the new version copy the script files from here https://github.com/99-metrics/ga-realtime-alerting</p>"});
      //if an email has been sent before add 1 to the multiplier so the time between emails will increase
      if(readScriptProperty("updateEmail")){
        setScriptProperty("updateEmailMultiplier", parseInt(updateEmailMultiplier, 10) + 1 )}
      //set when the email was sent
      setScriptProperty("updateEmail", new Date())    
    }
  };
  
  
}

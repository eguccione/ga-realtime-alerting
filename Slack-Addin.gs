/**************************************************************************
*  Realtime Alerting for Google Analytics
*  Version: 1.1
*  Authors: Dan Gilbert - @dangilbertnow & Ed Guccione @triweasel
**************************************************************************/


/* Send slack alert to recipients and update last alerted timestamp 
* @param {string} Name of the alert 
* @param {object} Results object including totals and rows
* @param {object} Email details including addresses, subject and HTML formatted table where required
* @param {string} Slackwebhook
*/
function sendToSlack(name, results, email,postUrl){
  var slackTable =  convertResultsToSlackMarkup(results)
  if(results.total != 0) {
    email.body = "\n" + email.intro + "\n Total: " + results.total + "\n" + email.table;
  } else {
    email.body = "\n" + email.intro + "\n Total: " + results.total
  }
  sendHttpPost("*"+email.subject+"*" + "\n"+ slackTable,postUrl)
}

/* Send slack alert to recipients and update last alerted timestamp 
* @param {string} Slack message to be sent
* @param {string} Slackwebhook
*/

function sendHttpPost(message,postUrl)
{
  var jsonData = {"text" : message};
  var payload = JSON.stringify(jsonData);
  var options =
      {
        "method" : "post",
        "contentType" : "application/json",
        "payload" : payload
      };
  
  UrlFetchApp.fetch(postUrl, options);
}

/**
*Convert Realtime results into slack markup table
* @param {Object} results - Object containing headers, rows and totals for Realtime API query 
* @return {string} table -  lightly markuped table of headers and rows of RealTime API reults
*/ 
function convertResultsToSlackMarkup(results) {
  var headers = "" + results.headers.join("\t|\t") + "";
  var rows = results.rows.map(function (row) {
    return("" + row.join("\t|\t") + "");
  });
  var table = "" + headers + "\n" + rows.join("\n") + "";
  return(table);   
}


function sendToSlack(name, results, email,postUrl){
  var slackTable =  convertResultsToSlackMarkup(results)
  if(results.total != 0) {
    email.body = "\n" + email.intro + "\n Total: " + results.total + "\n" + email.table;
  } else {
    email.body = "\n" + email.intro + "\n Total: " + results.total
  }
  sendHttpPost("*"+email.subject+"*" + "\n"+ slackTable,postUrl)
}


function sendHttpPost(message,postUrl)
{
  var jsonData =
      {        
        "text" : message
      };
  var payload = JSON.stringify(jsonData);
  var options =
      {
        "method" : "post",
        "contentType" : "application/json",
        "payload" : payload
      };
  
  UrlFetchApp.fetch(postUrl, options);
}

/* Convert Realtime results into HTML table */
function convertResultsToSlackMarkup(results) {
  var headers = "" + results.headers.join("\t|\t") + "";
  var rows = results.rows.map(function (row) {
    return("" + row.join("\t|\t") + "");
  });
  var table = "" + headers + "\n" + rows.join("\n") + "";
  return(table);   
}


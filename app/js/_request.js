const config = require("./_config");

exports.request = function(link, renderCallback, fetchOptions) {
  var url = ''
  if(/http/.test(link)) {
    url = link;
  }
  else {
    url = config.vars.domain + link + config.vars.hash;
  }

  let requestObj = (fetchOptions) ? new Request(url, fetchOptions) : new Request(url);
  return fetch(requestObj)
    .then(res => {
      if (!res.ok) {
        throw new Error(res.statusText)
      }
      return res.json()
    })
      .then(response => {               //
        console.log(response)           //
        if(renderCallback) {            //
          renderCallback(response)      //
        }                               //
    })                                  //
    .catch(error => {
      console.log(error);
  });
  } 

  function getSingleRequest(url, renderCallback) {
    fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then( renderCallback() )
    .catch(alert);
  }
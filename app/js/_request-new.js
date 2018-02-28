const config = require("./_config");

export const request = (link, postValue) => {
  var url = (/http/.test(link)) ? link : config.vars.domain + link + config.vars.hash;
  let options = { 
    method: "POST", 
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: "value="+postValue
  }
  // console.log(!!postValue)
  let requestObj = (!!postValue) ? new Request(url, options) : new Request(url);

  return fetch(requestObj)
    .then(res => {
      if (!res.ok) {
        throw new Error(res.statusText)
      }
      return res.json()
    })
    .catch(error => {
      console.log(error);
    });
  } 

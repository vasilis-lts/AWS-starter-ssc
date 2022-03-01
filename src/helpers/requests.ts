import { BASE_URL } from "../appSettings";


export async function getJSON(path) {
  let json;
  await fetch(`./json/${path}`
    , {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (myJson) {
      json = myJson;
    });

  return json;
}

export async function getData(path) {
  let res;
  let status;
  await fetch(`${BASE_URL}${path}`
    , {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // 'Authorization': `Bearer ${localStorage.getItem("AdminAccessToken")}`
      }
    }
  )
    .then(function (response) { status = response.status; return response.json(); })
    .then(function (myJson) { res = myJson; })
    .catch(err => { res = err; })

  return { res, status };
}

export async function postData(path, reqBody) {
  let res;
  let status;
  let headers: any = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    // Authorization": localStorage.getItem("AdminAccessToken") ? `Bearer ${localStorage.getItem("AdminAccessToken")}` : null
  };

  await fetch(`${BASE_URL}${path}`
    , {
      method: "POST",
      headers: headers,
      body: reqBody ? JSON.stringify(reqBody) : null
    }
  )
    .then(function (response) { status = response.status; return response.json(); })
    .then(function (myJson) { res = myJson; })
    .catch(err => { res = err; })

  return { res, status };
}
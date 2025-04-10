const DOMAIN = "http://localhost:5000/api/v1";

export const get = async (api) => {
  const rensponse = await fetch(DOMAIN + api);
  const data = await rensponse.json();
  return data;
};

export const LoginPost = async (data, api) => {
  const rensponse = await fetch(DOMAIN + api, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    credentials: `include`,
  });
  const result = await rensponse.json();
  return result;
};

export const post = async (data, api) => {
  const rensponse = await fetch(DOMAIN + api, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
  const result = await rensponse.json();
  return result;
};
export const patch = async (data, api) => {
  const rensponse = await fetch(DOMAIN + api, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
  const result = await rensponse.json();
  return result;
};

export const del = async (api) => {
  const response = await fetch(DOMAIN + api, {
    method: "DELETE",
  });
  const result = await response.json();
  return result;
};

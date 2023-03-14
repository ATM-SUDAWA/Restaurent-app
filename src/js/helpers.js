// import { async } from 'regenerator-runtime';
import { TIMEOUT_SECS } from './config.js';

// `${API_URL}/${id}`
// 'https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc971'

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getJSON = async function (url) {
  try {
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SECS)]);
    // The data that we receive from our api call (promise)
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`); // handling error
    return data;
  } catch (err) {
    throw err;
  }
};

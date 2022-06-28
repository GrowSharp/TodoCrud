export const POINT = import.meta.env.VITE_END_POINT;

async function fetcher(url, { method = 'GET', body } = {}) {
  const opts = {
    method,
    credentials: 'include',
    headers: {
      'accept': 'application/json',
    },
  }
  if (body) {
    if (body instanceof FormData) {
      opts.body = body;
    } else {
      opts.headers["content-type"] = 'application/json';
      opts.body = JSON.stringify(body);
    }
  }
  let data;
  try {
    const response = await fetch(POINT + url, opts);
    try {
      data = await response.json();
    } catch {}
    if (response.status >= 400) {
      const err = new Error(`ServerError ${response.status} - ${response.statusText}`);
      err.response = response;
      err.data = data;
      throw err;
    }
  } catch (err) {
    throw err;
  }
  return data;
}

export default fetcher;
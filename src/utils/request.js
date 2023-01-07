import { BASE_URL } from '../config';

export async function request(method, uri) {
  try {
    const url = [BASE_URL, uri].join('/');
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(url, options);
    const json = await response.json();
    return json;
  } catch (err) {
    console.log(err);
    // alert('request error', JSON.stringify(err));
    return false;
  }
}

export function requestLocal(method, key, body) {
  try {
    switch (method) {
      case 'GET':
        return JSON.parse(localStorage.getItem(key));
      case 'POST':
        localStorage.setItem(key, JSON.stringify(body));
        break;
      case 'PATCH': {
        const before = JSON.parse(localStorage.getItem(key));
        const after = JSON.stringify({ ...before, ...body });
        localStorage.setItem(key, after);
        break;
      }
      case 'DELETE':
        localStorage.removeItem(key);
        break;
      default:
        return null;
    }
    return null;
  } catch (err) {
    console.log(err);
    // alert('request error', JSON.stringify(err));
    return false;
  }
}

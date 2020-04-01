import Promise from 'bluebird';
import request from 'request';
import cachedRequestLib from 'cached-request';

const cachedRequest = cachedRequestLib(request);
cachedRequest.setCacheDirectory('/tmp');

const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

const defaultTtl = oneDayInMilliseconds;

export const cachedRequestPromise = Promise.promisify(cachedRequest, { multiArgs: true });

export const requestPromise = async (options) => {
  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        resolve([response, body]);
      }
    });
  });
};

export const asyncRequest = (requestOptions) => {
  if (process.env.ENABLE_CACHED_REQUEST) {
    return cachedRequestPromise({ ttl: defaultTtl, ...requestOptions });
  } else {
    return requestPromise(requestOptions);
  }
};

export const imageRequest = (url) =>
  asyncRequest({ url, encoding: null }).then(([response]) => {
    return response;
  });

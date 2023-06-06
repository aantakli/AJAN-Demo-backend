const request = require('request');

// API examples: https://gist.github.com/deviantony/77026d402366b4b43fa5918d41bc42f8

class PortainerClient {
  private _apiHost: string;
  private _username: any;
  private _password: any;
  private _authToken: null;
  constructor(apiHost: string, username: any, password: any) {
    this._apiHost = apiHost.replace(/\/$/, '');
    this._username = username;
    this._password = password;
    this._authToken = null;
  }

  async callApiWithKey(requestmethod: any, apiPath: any, requestData?: any) {
    const self = this;

    return new Promise(async function(resolve, reject) {
      try {
        if (self._authToken === null)
          await self.setAuthToken();

        resolve(await self.callApi(requestmethod, apiPath, requestData, postHeaders()));
      }
      catch (error) {
        try {
          await self.setAuthToken();
          resolve(await self.callApi(requestmethod, apiPath, requestData, postHeaders()));
        }
        catch (error) {
          reject(error);
        }
      }
    });

    function postHeaders() {
      return {
        Authorization: 'Bearer ' + self._authToken
      };
    }
  }

  async callApi(requestMethod: string, apiPath: string, requestData: { username: any; password: any; }, requestHeaders: { Authorization: string; } | null | undefined) {
    const self = this;

    return new Promise(async function(resolve, reject) {

      let requestParams = {
        method: requestMethod.toUpperCase(),
        url: self._apiHost + apiPath,
        json: (typeof requestData === 'object') ? requestData : true
      };

      if(typeof requestHeaders === 'object' && requestHeaders !== null)
        { // @ts-ignore
          requestParams.headers = requestHeaders;
        }

      request(requestParams, function(error: any, response: { statusCode: number; }, body: unknown) {
        if(error)
          reject(error);
        else if(response && response.statusCode === 200)
          resolve(body);
        else if(response && response.statusCode === 204)
          resolve({});
        else
          reject(response.statusCode);
      });
    })
  }

  async setAuthToken() {
    const self = this;

    return new Promise(async function(resolve, reject) {
      try {
        let authData = await self.callApi('POST', '/api/auth', {
          username: self._username,
          password: self._password
        }, undefined);

        // @ts-ignore
        self._authToken = authData.jwt;
        resolve(self._authToken);
      }
      catch(error) {
        reject(error);
      }
    });
  }
}


export { PortainerClient }

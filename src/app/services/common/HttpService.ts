/**
 * http请求底层类，封装了所有http请求方法，统一定义了请求方法getRequestObservable
 * 统一定义了成功回调处理函数extractData
 * 统一定义了Response失败回调函数handleError
 */
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { trim, isObject, endsWith, assign } from 'lodash';
import {
  Http,
  Response,
  Headers,
  RequestOptions
  // Jsonp, 
  // URLSearchParams 
} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { CommonService } from './CommonService';

const isInitResponse = (url: string): boolean => {
  const keysList = ['login', 'keylist'];
  return keysList.some(e => (url.indexOf(e) > -1));
}

@Injectable()
export class HttpService {

  constructor(private http: Http, private cmm: CommonService) { }

  private get(url: string, params?: any, headers?: any, options?: RequestOptions): Observable<any> {
    url += this.buildUrlParams(params);
    return this.http.get(url, this.getOptions(headers, options)).map(this.extractData.bind(this)).catch(this.handleError);
  }

  private post(url: string, params: any, headers?: any, options?: any): Observable<any> {
    return this.http.post(url, params, this.getOptions(headers, options)).map(this.extractData.bind(this)).catch(this.handleError);
  }

  private put(url: string, params: any, headers?: any, options?: any): Observable<any> {
    return this.http.put(url, params, this.getOptions(headers, options)).map(this.extractData.bind(this)).catch(this.handleError);
  }

  private delete(url: string, params?: any, headers?: any, options?: RequestOptions): Observable<any> {
    url += this.buildUrlParams(params);
    return this.http.delete(url, this.getOptions(headers, options)).map(this.extractData.bind(this)).catch(this.handleError);
  }

  private patch(url: string, params: any, headers?: any, options?: any): Observable<any> {
    return this.http.patch(url, params, this.getOptions(headers, options)).map(this.extractData.bind(this)).catch(this.handleError);
  }

  private head(url: string, params?: any, headers?: any, options?: RequestOptions): Observable<any> {
    url += this.buildUrlParams(params);
    return this.http.head(url, this.getOptions(headers, options)).map(this.extractData.bind(this)).catch(this.handleError);
  }

  private options(url: string, params?: any, headers?: any, options?: RequestOptions): Observable<any> {
    url += this.buildUrlParams(params);
    return this.http.options(url, this.getOptions(headers, options)).map(this.extractData.bind(this)).catch(this.handleError);
  }

  private getOptions(headers?: any, options?: any): RequestOptions {
    let _options: RequestOptions;
    if (options) {
      _options = new RequestOptions(options);
    } else {
      _options = new RequestOptions({ headers: new Headers(assign(headers, { 'Content-Type': 'application/json;charset=UTF-8' })) });
    }
    return _options;
  }

  getRequestObservable(url: string, method: string, params?: any, headers?: any, options?: any): Observable<any> {
    // if(1==1) return Observable.create(() => {});
    let _params = params || {};
    window['loading'].startLoading();
    if (method == "get") {
      return this.get(url, _params, headers, options);
    } else if (method == "post") {
      return this.post(url, _params, headers, options);
    } else if (method == "put") {
      return this.put(url, _params, headers, options);
    } else if (method == "delete") {
      return this.delete(url, _params, headers, options);
    } else if (method == "patch") {
      return this.patch(url, _params, headers, options);
    } else if (method == "head") {
      return this.head(url, _params, headers, options);
    } else if (method == "options") {
      return this.options(url, _params, headers, options);
    } else {
      window['loading'].finishLoading();
      console.error("Except 'Get'/'Post'/'put'/'delete'/'patch'/'head'/'options' request, other requests doesn't support momentarily.");
    }
  }

  private extractData(res: Response | any) {
    if (!isInitResponse(res.url)) window['loading'].finishLoading();
    let test = null;
    if (res._body.indexOf('System Login') > -1) {
      window.location.reload();
      return;
    }
    let body = this.cmm.formatUndefinedValueToString(res._body && JSON.parse(res._body));
    return {
      ok: res.ok,
      status: res.status,
      statusText: res.statusText,
      type: res.type,
      url: res.url,
      headers: res.headers._headers,
      body
    } || {};
  }

  private handleError(error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    window['loading'].finishLoading();
    if (error.status === 0) {
      window.location.reload();
      return Observable.create((obsr) => {
        obsr.next();
      });
    }
    let body = "";
    try {
      let arr = JSON.parse(error._body);
      for (let e in arr) {
        body += (arr[e] + '-');
      }
    } catch (e) {
      body = error._body;
    }
    return Observable.create((obsr) => {
      obsr.error(body);
    });
  }

  private buildUrlParams(params: any) {
    let paramStr = "";
    if (params) {
      paramStr += "?";
      for (let e in params) {
        if (!!params[e] || params[e] === 0) paramStr += (e + "=" + params[e] + "&");
      }
      paramStr = paramStr != "?" ? trim(paramStr, "&") : "";
    }

    return paramStr;
  }

}
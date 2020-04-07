import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import {environment} from '../environments/environment';
import 'rxjs/add/operator/map';

@Injectable()
export class HelloWorldService {

  constructor(private http: Http) { }

  getTitle() {
    return this.http.get(`${environment.serverUrl}/hello-world`,"ANY")
      .map(response => response.json());
  }

  getData() {
    return this.http.get(`${environment.serverUrl}/getEmps`)
      .map(response => response.json());
  }

}

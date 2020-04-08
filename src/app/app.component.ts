import { Component, OnInit } from '@angular/core';
import { HelloWorldService } from './hello-world.service';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from "devextreme/data/data_source";
import 'devextreme/data/odata/store';
import { DxDataGridComponent } from 'devextreme-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title;
  continents: CustomStore;

  constructor(private hw: HelloWorldService) { }

  ngOnInit() {

    var thisComponent = this;

    this.continents = new CustomStore({
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.hw.getTitle().subscribe(data => {
          thisComponent.title = data.title;
          devru.resolve(JSON.parse(data["data"][0]["Emp"]));
        });
        return devru.promise();
      },
      insert: function (values) {
        var devru = $.Deferred();
        if (values["Empid"] ? values["FirstName"] ? true : false : false) {
          thisComponent.hw.Operation("createEmp", values).subscribe(data => {
            devru.resolve(data);
          });
        } else {
          devru.reject("Please provide the Valid Data!!");
        }
        return devru.promise();
      },
      remove: function (key) {
        var devru = $.Deferred();
        thisComponent.hw.Operation("deleteEmp", key).subscribe(data => {
          devru.resolve(data);
        });
        return devru.promise();
      },
      update: function (key, newValues) {
        var devru = $.Deferred();
        thisComponent.hw.Operation("updateEmp", getUpdateValues(key, newValues)).subscribe(data => {
          devru.resolve(data);
        });
        return devru.promise();
      }
    });

    function getUpdateValues(key, newValues): any {
      for (var prop in key) {
        key[prop] = (newValues[prop] == null) ? key[prop] : newValues[prop];
      }
      return key;
    }

  }

}

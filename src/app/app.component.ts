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

    this.hw.getData()
      .subscribe(data => {
        console.log(data);
      });

    var thisComponent = this;

    this.continents = new CustomStore({
      key: ["TypesID", "Description", "GroupModule"],
      load: function (loadOptions) {
        var devru = $.Deferred();
        thisComponent.hw.getTitle().subscribe(data => {
          thisComponent.title = data.title;
          devru.resolve(JSON.parse(data["data"][0]["Emp"]));
        });
        return devru.promise();
      },
      /* remove: function (key) {
        var devru = $.Deferred();
        dummyDataServive.getServerData("NumberSeriesSetup2", "deleteAlertHandler", ["",
          key["Prefix"]]).subscribe(data => {
            if (data <= 0) {
              devru.reject("Error while Deleting the Lines with LineNo: " + key["Prefix"] + ", Error Status Code is DELETE-ERR");
            } else {
              devru.resolve(data);
            }
          });
        return devru.promise();
      },
      insert: function (values) {
        var devru = $.Deferred();
        if (!thisComponent.isLinesExist) {
          if (values["Prefix"] ? values["RunningNo"] ? true : false : false) {
            dummyDataServive.getServerData("NumberSeriesSetup2", "btnSave_clickHandler", ["",
              values["Prefix"],
              values["UserYY"],
              values["UserMM"],
              values["RunningNo"],
              values["AttributeValue"] ? values["AttributeValue"] : '',
              thisComponent.TypesID["TypesID"]]).subscribe(data => {
                if (data > 0) {
                  devru.resolve(data);
                } else {
                  devru.reject("Error while Adding the Lines with Prefix: " + values["Prefix"] + ", Check For Duplicate!! Error is INSERT-ERR");
                }
              });
          } else {
            devru.reject("Please provide the Valid Data!!");
          }
        } else {
          thisComponent.toastr.warning("Not Allowed to Add new Lines, For Type :" + thisComponent.TypesID["TypesID"]);
          devru.resolve();
        }
        return devru.promise();
      },
      update: function (key, newValues) {
        var devru = $.Deferred();
        if (getUpdateValues(key, newValues, "RunningNo")) {
          dummyDataServive.getServerData("NumberSeriesSetup2", "btnUpdate_clickHandler", ["",
            getUpdateValues(key, newValues, "RunningNo"),
            thisComponent.TypesID["TypesID"],
            key["Prefix"]]).subscribe(data => {
              if (data > 0) {
                devru.resolve(data);
              } else {
                devru.reject("Error while Update the Lines with Prefix: " + key["Prefix"] + ", Check For Duplicate!! Error Status Code is UPDATE-ERR");
              }
            });
        } else {
          devru.reject("Please provide the Valid Data!!");
        }
        return devru.promise();
      }*/
    });

    function getUpdateValues(key, newValues, field): String {
      return (newValues[field] == null) ? key[field] : newValues[field];
    }

  }

}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HelloWorldService } from './hello-world.service';
import { HttpModule } from '@angular/http';
import { DxDataGridModule, DxButtonModule, DxTextBoxModule } from 'devextreme-angular';
import * as $ from 'jquery';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    DxDataGridModule,
    DxButtonModule,
    DxTextBoxModule
  ],
  providers: [HelloWorldService],
  bootstrap: [AppComponent]
})
export class AppModule { }

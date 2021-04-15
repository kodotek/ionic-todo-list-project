import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import localeEsExtra from '@angular/common/locales/extra/es';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TaskService } from './services/task.service';
import { HomePageModule } from './home/home.module';

registerLocaleData(localeEs, 'es_ES', localeEsExtra);

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HomePageModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es_ES' },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    TaskService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

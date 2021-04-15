import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { HomePage } from './home.page';
import { ModalTaskPage } from './modal-task/modal-task.page';

import { HomePageRoutingModule } from './home-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    HttpClientModule,
    HomePageRoutingModule,
  ],
  declarations: [HomePage, ModalTaskPage],
})
export class HomePageModule {}

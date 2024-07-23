import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { MainComponent } from './main.component';
import { CreateComponent } from "./components/create/create.component";
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


@NgModule({
  declarations: [MainComponent, CreateComponent],
  imports: [
    CommonModule,
    MainRoutingModule,
    NavbarComponent,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class MainModule { }

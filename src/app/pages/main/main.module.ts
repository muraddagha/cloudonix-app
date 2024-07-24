import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainRoutingModule } from './main-routing.module';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { MainComponent } from './main.component';
import { FormComponent } from './components/form/form.component';

@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
    MainRoutingModule,
    NavbarComponent,
    FormComponent
  ]
})
export class MainModule { }

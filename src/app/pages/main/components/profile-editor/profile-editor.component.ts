import { CommonModule } from '@angular/common';
import { Component, Input, } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile-editor',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './profile-editor.component.html',
  styleUrl: './profile-editor.component.scss'
})
export class ProfileEditorComponent {
  @Input() profile: any;

  public types = ['furniture', 'equipment', 'stationary', 'part'];

  constructor(private fb: FormBuilder) { }

  public get customProperties() {
    return this.profile.get('customProperties') as FormArray;
  }

  public addCustomProperty() {
    const propertyForm = this.fb.group({
      key: ['', Validators.required],
      value: ['', Validators.required]
    });
    this.customProperties.push(propertyForm);
  }

  public deleteCustomProperty(index: number) {
    this.customProperties.removeAt(index);
  }

  public updateProperties(product: any): void {
    this.customProperties.clear();

    Object.keys(product.profile).forEach(e => {
      if (e != 'type' && e != 'available' && e != 'backlog') {
        const propertyForm = this.fb.group({
          key: [e, Validators.required],
          value: [product.profile[e], Validators.required]
        });
        propertyForm.get('key')?.disable();
        this.customProperties.push(propertyForm);
      }
    })
  }

}

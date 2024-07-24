import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule, ValidatorFn, ValidationErrors, AbstractControl, FormArray } from '@angular/forms';
import { IProduct } from '../../../../models/product.model';
import { ApiService } from '../../../../services/api/api.service';
import { CommonModule } from '@angular/common';
import { ProfileEditorComponent } from "../profile-editor/profile-editor.component";

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, ProfileEditorComponent],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {
  @ViewChild('createDrawer') createDrawer!: ElementRef;
  @ViewChild(ProfileEditorComponent) profileEditorComponent!: ProfileEditorComponent;

  @Output() updateListTrigger: EventEmitter<boolean> = new EventEmitter(false);
  updatedProduct: IProduct | null = null;

  public form: FormGroup = new FormGroup({});
  public loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService) {

  }

  ngOnInit(): void {
    this.generateForm();
  }

  public generateForm(): void {
    this.form = this.fb.group({
      name: ["", [Validators.required]],
      description: ["", [Validators.required]],
      sku: ["", [Validators.required]],
      cost: ["", [Validators.required, this.positiveDecimalValidator()]],
      profile: this.fb.group({
        type: ["furniture", [Validators.required]],
        available: [true],
        backlog: [null],
        customProperties: this.fb.array([])
      })
    });
  }

  public patchUpdateData(product: any): void {
    this.form.get('profile')?.get('backlog')?.reset();
    this.form.get('profile')?.get('available')?.patchValue(true);
    
    this.updatedProduct = product;
    this.form.patchValue(product);
    this.profileEditorComponent.updateProperties(product);
  }

  public submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.loading = true;
    let profile: any = {
      type: this.form.value.profile.type,
      available: this.form.value.profile.available,
      backlog: this.form.value.profile.backlog,
    };
    this.form.getRawValue().profile.customProperties.forEach((item: any) => profile[item.key] = item.value);

    let body = this.form.value;
    body.profile = profile;
    if (!this.updatedProduct) this.create(body);
    else this.update(body);
  }

  private create(body: any): void {
    this.apiService.create('items', body).subscribe({
      next: (res) => {
      },
      error: (err) => { },
      complete: () => {
        this.loading = false;
        this.resetForm();
        this.createDrawer.nativeElement.click();
        this.updateListTrigger.next(true);
      }
    })
  }
  private update(body: any): void {
    delete body.sku;
    this.apiService.edit(`items/${this.updatedProduct?.id}`, body).subscribe({
      next: (res) => {
      },
      error: (err) => { },
      complete: () => {
        this.loading = false;
        this.resetForm();
        this.createDrawer.nativeElement.click();
        this.updateListTrigger.next(true);
      }
    })
  }
  public resetForm(): void {
    this.form.reset();
    (this.form.get('profile.customProperties') as FormArray).clear();
    this.generateForm();
    this.updatedProduct = null;
  }
  private positiveDecimalValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const valid = /^(\d+(\.\d{1,2})?)?$/.test(value) && value > 0;
      return valid ? null : { invalidDecimal: true };
    };
  }




}

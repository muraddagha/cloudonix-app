import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule, ValidatorFn, ValidationErrors, AbstractControl, FormArray } from '@angular/forms';
import { IProduct } from '../../../../models/product.model';
import { ApiService } from '../../../../services/api/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {
  @ViewChild('createDrawer') createDrawer!: ElementRef;
  @Output() updateListTrigger: EventEmitter<boolean> = new EventEmitter(false);
  updatedProduct: IProduct | null = null;

  public form: FormGroup = new FormGroup({});
  public loading: boolean = false;
  public types = ['furniture', 'equipment', 'stationary', 'part'];

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
    this.updatedProduct = product;
    this.form.patchValue(product);
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

  public get customProperties() {
    return this.form.get('profile.customProperties') as FormArray;
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

  public submit(): void {
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
    this.customProperties.clear();
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

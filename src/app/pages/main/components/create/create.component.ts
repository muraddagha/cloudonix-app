import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api/api.service';
import { IProduct } from '../../../../models/product.model';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {
  @ViewChild('createDrawer') createDrawer!: ElementRef;
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
      cost: ["", [Validators.required]],
      profile: ["furniture", [Validators.required]],
    });
  }

  public patchUpdateData(product: any): void {
    product.profile = product.profile.type
    this.updatedProduct = product;
    this.form.patchValue(product);
  }


  public submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    const body = this.form.value;
    body.profile = { type: body.profile };
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
    this.generateForm();
    this.updatedProduct = null;
  }
}

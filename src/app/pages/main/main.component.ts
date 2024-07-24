import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IProduct, IProfile } from '../../models/product.model';
import { ApiService } from '../../services/api/api.service';
import { FormComponent } from './components/form/form.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {
  @ViewChild('detailsModal') detailsModal!: ElementRef;
  @ViewChild('confirmModal') confirmModal!: ElementRef;
  @ViewChild('updateDrawerButton') updateDrawerButton!: ElementRef;
  @ViewChild(FormComponent) appFormComponent!: FormComponent;

  public loading: boolean = false;
  public removeLoading: boolean = false;

  public products: IProduct[] = [];
  public selectedProduct: IProduct | null = null;
  public updatedProduct: IProduct | null = null;

  constructor(private apiService: ApiService) {

  }
  ngOnInit(): void {
    this.getItems();
  }

  public getItems() {
    this.loading = true;
    this.apiService.get("items").subscribe({
      next: (res) => {
        this.products = res;
      },
      error: (err) => {
      },
      complete: () => {
        this.loading = false;
      }
    })
  }

  public showDetails(product: IProduct): void {
    this.selectedProduct = product;
    this.detailsModal.nativeElement.showModal();
  }

  public confirmDialog(product: IProduct): void {
    this.selectedProduct = product;
    this.confirmModal.nativeElement.showModal();
  }
  public removeProduct(): void {
    this.removeLoading = true;
    this.apiService.remove("items/", this.selectedProduct?.id).subscribe({
      next: (res) => {
      },
      error: () => {
        this.removeLoading = false;
        this.confirmModal.nativeElement.close();
        this.selectedProduct = null;
      },
      complete: () => {
        this.removeLoading = false;
        this.getItems();
        this.confirmModal.nativeElement.close();
        this.selectedProduct = null;
      }
    })
  }
  public openCreateDrawer(): void {
    this.appFormComponent.resetForm();
  }

  public setUpdateData(product: IProduct): void {
    this.appFormComponent.resetForm();
    this.appFormComponent.patchUpdateData({ ...product });
    this.updateDrawerButton.nativeElement.click();
  }

  public getProfileProperties(profile: any): any {
    if (!profile) return;
    return Object.keys(profile)
  }

}

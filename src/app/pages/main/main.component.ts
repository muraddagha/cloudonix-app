import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IProduct } from '../../models/product.model';
import { ApiService } from '../../services/api/api.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {
  @ViewChild('detailsModal') detailsModal!: ElementRef;
  @ViewChild('confirmModal') confirmModal!: ElementRef;

  public loading: boolean = false;
  public removeLoading: boolean = false;

  public products: IProduct[] = [];
  public selectedProduct: IProduct | null = null;
  constructor(private apiService: ApiService) {

  }
  ngOnInit(): void {
    this.getItems();
  }

  private getItems() {
    this.loading = true;
    this.apiService.get("items").subscribe({
      next: (res) => {
        this.products = res;
        // console.log(res)
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

}

import { Component } from '@angular/core';
import { IProductResponce } from 'src/app/shared/interfaces/product/product.interface';
import { OrderService } from 'src/app/shared/services/order/order.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss'],
})
export class FavoriteComponent {
  public likeProduct: Array<IProductResponce> = [];
  constructor(
    private orderService: OrderService,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.loadFav();
  }
  loadFav() {
    this.likeProduct = JSON.parse(
      localStorage.getItem('favoriteArray') as string
    );
  }
  productCount(data: IProductResponce, value: boolean): void {
    if (value) {
      ++data.count;
    } else if (!value && data.count > 1) {
      --data.count;
    }
  }

  addToBasket(data: IProductResponce): void {
    let basket: Array<IProductResponce> = [];
    if (localStorage.length > 0 && localStorage.getItem('basket')) {
      basket = JSON.parse(localStorage.getItem('basket') as string);
      if (basket.some((prod) => prod.id === data.id)) {
        const index = basket.findIndex((prod) => prod.id === data.id);
        basket[index].count += data.count;
      } else {
        basket.push(data);
      }
    } else {
      basket.push(data);
    }
    localStorage.setItem('basket', JSON.stringify(basket));
    data.count = 1;
    this.orderService.changeFavorite.next(true);
    this.orderService.changeBasket.next(true);
  }
  deleteLike(data: any): void {
    const index = this.likeProduct.findIndex((prod) => prod.id === data.id);
    this.likeProduct.splice(index, 1);
    localStorage.setItem('favoriteArray', JSON.stringify(this.likeProduct));
    this.orderService.changeFavorite.next(true);
    this.toastr.warning('Продукт видалено з улюблених');
  }
}

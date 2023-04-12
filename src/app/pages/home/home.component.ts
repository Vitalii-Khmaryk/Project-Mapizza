import { Component, OnInit, ViewChild } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { IProductResponce } from 'src/app/shared/interfaces/product/product.interface';
import { ProductService } from 'src/app/shared/services/product/product.service';
import { OrderService } from 'src/app/shared/services/order/order.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('autoHeight', [
      transition(':enter', [
        style({ height: '0px', opacity: 0 }),
        animate('300ms ease-in-out', style({ height: '*', opacity: 1 })),
      ]),
      transition(':leave', [
        style({ height: '*', opacity: 1 }),
        animate('300ms ease-in-out', style({ height: '0px', opacity: 0 })),
      ]),
    ]),
  ],
})
export class HomeComponent implements OnInit {
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['<', '>'],
    autoplay: true,
    autoplayTimeout: 3500,
    autoplaySpeed: 3000,
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 1,
      },
      740: {
        items: 1,
      },
      940: {
        items: 1,
      },
    },
    nav: true,
  };

  public productsArray: IProductResponce[] = [];
  public filterValue!: string;

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.productService.getAllFirebase().subscribe((data) => {
      this.productsArray = data as IProductResponce[];
    });
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
    this.orderService.changeBasket.next(true);
  }

  addFavorite(data: IProductResponce): void {
    let favoriteArray: Array<IProductResponce> = [];
    if (localStorage.getItem('favoriteArray') !== null) {
      favoriteArray = JSON.parse(
        localStorage.getItem('favoriteArray') as string
      );
      if (favoriteArray.some((prod) => prod.id === data.id)) {
        const index = favoriteArray.findIndex((prod) => prod.id === data.id);
        favoriteArray[index].count += data.count;
        this.toastr.info('Ви вже добавили цей продукт до списку улюблених.');
      } else {
        favoriteArray.push(data);
        localStorage.setItem('favoriteArray', JSON.stringify(favoriteArray));
        this.toastr.success('Продукт додано до списку улюблених.');
      }
    } else {
      favoriteArray.push(data);
      localStorage.setItem('favoriteArray', JSON.stringify(favoriteArray));
      this.toastr.success('Продукт додано до списку улюблених.');
    }
    this.orderService.changeFavorite.next(true);
  }
}

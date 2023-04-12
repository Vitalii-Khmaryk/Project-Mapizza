import { Component,OnInit,OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IProductResponce } from 'src/app/shared/interfaces/product/product.interface';
import { ProductService } from 'src/app/shared/services/product/product.service';
import { OrderService } from 'src/app/shared/services/order/order.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit,OnDestroy {

  public userProducts: Array<IProductResponce> = [];
  private eventSubsription!:Subscription;
  public filterValue!: string;



  constructor(
    private productService: ProductService,
    private actvatedRoute:ActivatedRoute,
    private orderService:OrderService,
    private router:Router,
    private toastr:ToastrService
  ){
  this.eventSubsription=this.router.events.subscribe(event=>{
      if (event instanceof NavigationEnd) {
        this.loadProducts();
      }
    })
  }

  ngOnInit(): void {
    
  }


  loadProducts(): void{
    const categoryName=this.actvatedRoute.snapshot.paramMap.get('category') as string;
    this.productService.getAllByCategoryFirebase(categoryName).then(data => {
      this.userProducts = data as IProductResponce[];      
    })
  }

  productCount(data:IProductResponce,value:boolean):void{
    if (value) {
      ++data.count;
    }
    else if (!value && data.count>1) {
      --data.count;
    }
  }

  addToBasket(data:IProductResponce):void{
    let basket:Array<IProductResponce> = [];
    if (localStorage.length>0 && localStorage.getItem('basket')) {
      basket=JSON.parse(localStorage.getItem('basket') as string);
      if (basket.some(prod=>prod.id===data.id)) {
        const index=basket.findIndex(prod=>prod.id===data.id);
        basket[index].count+=data.count;
      }
      else{
        basket.push(data);
      }
    }
    else{
      basket.push(data);
    }
    localStorage.setItem('basket',JSON.stringify(basket));
    data.count=1;
    this.orderService.changeBasket.next(true);
  }

  addFavorite(data:IProductResponce):void{
    let favoriteArray:Array<IProductResponce>=[];
    if (localStorage.getItem('favoriteArray') !== null) {
      favoriteArray = JSON.parse(localStorage.getItem('favoriteArray') as string);
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

  ngOnDestroy(): void {
      this.eventSubsription.unsubscribe();
  }
}

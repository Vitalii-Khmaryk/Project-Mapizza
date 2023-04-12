import { Component ,ElementRef,Renderer2,HostListener} from '@angular/core';
import { IProductResponce } from 'src/app/shared/interfaces/product/product.interface';
import { OrderService } from 'src/app/shared/services/order/order.service';
import { ROLE } from 'src/app/shared/constants/role.constant';
import { AccountService } from 'src/app/shared/services/account/account.service';

import { MatDialog } from '@angular/material/dialog';
import { AuthDialogComponent } from '../auth-dialog/auth-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})



export class HeaderComponent  {
public mobileVar=false;


public total = 0;
public basket: Array<IProductResponce> = [];
public count = 0;
public status = false;
public blurStatus = false;
public empty = true;
public isLogin=false;
public loginUrl='';
public loginPage='';

public favoriteArr: Array<IProductResponce> = [];
public totalFavorite=0;
public lastScrollPosition!:any;
constructor(
  private elementRef: ElementRef, 
  private renderer: Renderer2,
  private orderService: OrderService,
  private accountService:AccountService,
  private dialog:MatDialog
  ) {
   
  }

ngOnInit(): void {
  this.loadBasket();
  this.updateBasket();
    this.checkUserLogin();
    this.checkUpdateUserLogin();
    this.loadFavorite();
    this.updateFavorite();
}

@HostListener('window:scroll')
  onWindowScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const headerElement = this.elementRef.nativeElement.querySelector('.header__wrapper');
    if (scrollPosition > this.lastScrollPosition && headerElement) { 
      this.renderer.addClass(headerElement, 'hidden');
    } else if (headerElement) { 
      this.renderer.removeClass(headerElement, 'hidden');   
    }
    this.lastScrollPosition = scrollPosition;  
}
  

burger(){
this.mobileVar=!this.mobileVar;
}

closeMenu():void{
  this.mobileVar=false;
}


loadBasket() {
  if (localStorage.length > 0 && localStorage.getItem('basket')) {
    this.basket = JSON.parse(localStorage.getItem('basket') as string);
  }
  this.getTotalPrice();
}
getTotalPrice() {
  this.total = this.basket.reduce((total: number, prod: IProductResponce) =>
      total + prod.count * prod.price,0);
  this.count = this.basket.reduce(
    (total: number, prod: IProductResponce) => total + prod.count,
    0
  );
}
updateBasket() {
  this.orderService.changeBasket.subscribe(() => {
    this.loadBasket();
  });
}
getTotalFavorite(){
this.totalFavorite=this.favoriteArr.reduce((total:number,prod:IProductResponce)=>
total+prod.count,0);
}
loadFavorite(){
  if (localStorage.length > 0 && localStorage.getItem('favoriteArray')) {
    this.favoriteArr = JSON.parse(localStorage.getItem('favoriteArray') as string);
  }
  this.getTotalFavorite();
}
updateFavorite(){
  this.orderService.changeFavorite.subscribe(()=>{
    this.loadFavorite();
  })
}
showBasket() {
  setTimeout(()=>{
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const bc=this.elementRef.nativeElement.querySelector('.basket-container');
  if (scrollPosition > 200 && bc) {   
    this.renderer.addClass(bc, 'show'); 
  } else if (bc) {
    this.renderer.removeClass(bc, 'show');  
  }
  this.lastScrollPosition = scrollPosition; 
  },1);
  
  const bodyEl = document.getElementsByTagName('body')[0];
    this.renderer.setStyle(bodyEl, 'overflow','hidden');
    
  this.blurStatus = !this.blurStatus;
  let basketArr = JSON.parse(localStorage.getItem('basket') as string);
  if (basketArr === null) {
    console.log('');
  } else if (basketArr.length === 0) {
    console.log('');
  } else {
    this.empty = false;
  }
}
closeblurBasket(){
  const bodyEl = document.getElementsByTagName('body')[0];
    this.renderer.removeStyle(bodyEl, 'overflow');
  this.blurStatus=!this.blurStatus;
}
localDelete(item: any): void {
  const index = this.basket.findIndex((prod) => prod.id === item.id);
  this.basket.splice(index, 1);
  localStorage.setItem('basket', JSON.stringify(this.basket));
  let basketArr = JSON.parse(localStorage.getItem('basket') as string);
  if (basketArr === null) {
    this.orderService.changeBasket.next(true);
    return ;
  } else if (basketArr.length === 0) {
    this.empty = true;
    this.count = 0;
    this.total = 0;
    this.orderService.changeBasket.next(true);
    return ;
  } else {
    this.empty = false;
    this.orderService.changeBasket.next(true);
  }
}

incrementProductCount(item: IProductResponce): void {
  let basket:Array<IProductResponce> = [];
  basket = JSON.parse(localStorage.getItem('basket') as string);
   const index = basket.findIndex((prod) => prod.id === item.id);
  if (index !== -1) {
    basket[index].count++;
    localStorage.setItem('basket', JSON.stringify(basket));
    this.orderService.changeBasket.next(true);
  }
}

decrementProductCount(item: IProductResponce): void {
  let basket:Array<IProductResponce> = [];
  basket = JSON.parse(localStorage.getItem('basket') as string);
  const index = basket.findIndex((prod) => prod.id === item.id);
  if (index !== -1) {
    if (basket[index].count > 1) {
      basket[index].count--;
      localStorage.setItem('basket', JSON.stringify(basket));
      this.orderService.changeBasket.next(true);
    }
  }
}



catalog(): void {
  this.blurStatus = false;
}


checkUserLogin():void{
  const currentUser=JSON.parse(localStorage.getItem('currentUser') as string);
 if (currentUser && currentUser.role===ROLE.ADMIN) {
  this.isLogin=true;
  this.loginUrl='admin';
  this.loginPage='Адмін';
 }else if(currentUser && currentUser.role===ROLE.USER) {
  this.isLogin=true;
  this.loginUrl='cabinet';
  this.loginPage='Кабінет';
 }
 else{
  this.isLogin=false;
  this.loginUrl='';
  this.loginPage='';
 }
}

checkUpdateUserLogin():void{
  this.accountService.isUserLogin$.subscribe(()=>{
    this.checkUserLogin();
  })
}
openLoginDialog():void{
  this.dialog.open(AuthDialogComponent,{
    backdropClass:'dialog-back',
    panelClass:'auth-dialog'
  })}
}

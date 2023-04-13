import { Component } from '@angular/core';

import { OrderService } from 'src/app/shared/services/order/order.service';
import { IProductResponce } from 'src/app/shared/interfaces/product/product.interface';
import { doc, docData, Firestore, setDoc } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent {
  public container1!: boolean;

  public total = 0;
  public basket: Array<IProductResponce> = [];
  public count = 0;
  public userEmail = '';
  public userFullName = '';
  public userPhone = '';
  public userAddress = '';

  public userHome = '';
  public userEntrance = '';
  public userSelectStreet = '';
  public radio = '';
  public toCall = false;
  public deliveryType = '';

  public logic = true;

  public arrOrders: any[] = [];

  constructor(
    private orderService: OrderService,
    private router: Router,
    private toastr: ToastrService,
    private afs: Firestore
  ) {}
  ngOnInit(): void {
    this.loadBasket();
    this.updateBasket();
    this.loadUser();
  }

  saveUserOrder() {
    const currentUser = JSON.parse(
      localStorage.getItem('currentUser') as string
    );
    if (!currentUser || !currentUser.uid) {
      this.toastr.warning('Зареєструйтесь щоб замовити');
    } else {
      if (this.deliveryType === 'delivery') {
        const d = new Date();
        const dd = `${d.getHours()}:${d.getMinutes()} , ${d.getDate()}.${
          d.getMonth() + 1
        }.${d.getFullYear()}`;
        const userOrder = {
          date: dd,
          uid: currentUser.uid,
          name: this.userFullName,
          email: this.userEmail,
          phone: this.userPhone,
          address: this.userAddress,
          userHome: this.userHome,
          userEntrance: this.userEntrance,
          userStreetOrder: this.userSelectStreet,
          payment: this.radio,
          toCall: this.toCall,
          orders: currentUser.orders,
          suma: this.total,
          status: 'Замовлено',
          typeOrder: 'Доставка',
        };
        if (currentUser.orders.length !== 0) {
          if (localStorage.getItem('orders') == null) {
            this.arrOrders.push(userOrder);
            localStorage.setItem('orders', JSON.stringify(this.arrOrders));
            setDoc(doc(this.afs, 'orders', userOrder.uid), userOrder);
            this.toastr.success('Замовлення відправлено(з доставкою)');
            this.router.navigate(['/']);
          } else {
            this.arrOrders = JSON.parse(
              localStorage.getItem('orders') as string
            );
            this.arrOrders.push(userOrder);
            localStorage.setItem('orders', JSON.stringify(this.arrOrders));
            setDoc(doc(this.afs, 'orders', userOrder.uid), userOrder);
            this.toastr.success('Замовлення відправлено(з доставкою)');
            this.router.navigate(['/']);
          }
        } else if (currentUser.orders.length == 0) {
          this.toastr.warning('Немає продуктів');
        }
      } else if (this.deliveryType === 'pickup') {
        const d = new Date();
        const dd = `${d.getHours()}:${d.getMinutes()} , ${d.getDate()}.${
          d.getMonth() + 1
        }.${d.getFullYear()}`;
        const userOrder = {
          date: dd,
          uid: currentUser.uid,
          name: this.userFullName,
          email: this.userEmail,
          phone: this.userPhone,
          address: this.userAddress,
          userHome: this.userHome,
          userEntrance: this.userEntrance,
          userStreetOrder: this.userSelectStreet,
          payment: this.radio,
          toCall: this.toCall,
          orders: currentUser.orders,
          suma: this.total,
          status: 'Замовлено',
          typeOrder: 'Самовивіз',
        };
        if (currentUser.orders.length !== 0) {
          if (localStorage.getItem('orders') == null) {
            this.arrOrders.push(userOrder);
            localStorage.setItem('orders', JSON.stringify(this.arrOrders));
            setDoc(doc(this.afs, 'orders', userOrder.uid), userOrder);
            this.toastr.success('Замовлення відправлено(самовивіз)');
            this.router.navigate(['/']);
          } else {
            this.arrOrders = JSON.parse(
              localStorage.getItem('orders') as string
            );
            this.arrOrders.push(userOrder);
            localStorage.setItem('orders', JSON.stringify(this.arrOrders));
            setDoc(doc(this.afs, 'orders', userOrder.uid), userOrder);
            this.toastr.success('Замовлення відправлено(самовивіз)');
            this.router.navigate(['/']);
          }
        } else if (currentUser.orders.length == 0) {
          this.toastr.warning('Немає продуктів');
        }
      }
    }
  }

  startContainer() {
    if (this.deliveryType === 'delivery') {
      this.container1 = true;
      this.logic =
        !this.userFullName ||
        !this.userPhone ||
        !this.userEmail ||
        !this.userAddress ||
        !this.userHome ||
        !this.userEntrance ||
        !this.radio;
    } else if (this.deliveryType === 'pickup') {
      this.container1 = false;
      this.logic =
        !this.userFullName ||
        !this.userPhone ||
        !this.userEmail ||
        !this.userSelectStreet ||
        !this.radio;
    }
  }

  loadBasket() {
    if (localStorage.length > 0 && localStorage.getItem('basket')) {
      this.basket = JSON.parse(localStorage.getItem('basket') as string);
    }
    this.getTotalPrice();
  }
  getTotalPrice() {
    this.total = this.basket.reduce(
      (total: number, prod: IProductResponce) =>
        total + prod.count * prod.price,
      0
    );
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

  localDelete(item: any): void {
    const index = this.basket.findIndex((prod) => prod.id === item.id);
    this.basket.splice(index, 1);
    localStorage.setItem('basket', JSON.stringify(this.basket));
    let basketArr = JSON.parse(localStorage.getItem('basket') as string);
    if (basketArr === null) {
      this.orderService.changeBasket.next(true);
      return;
    } else if (basketArr.length === 0) {
      this.count = 0;
      this.total = 0;
      this.orderService.changeBasket.next(true);
      return;
    } else {
      this.orderService.changeBasket.next(true);
    }
  }

  incrementProductCount(item: IProductResponce): void {
    let basket: Array<IProductResponce> = [];
    basket = JSON.parse(localStorage.getItem('basket') as string);
    const index = basket.findIndex((prod) => prod.id === item.id);
    if (index !== -1) {
      basket[index].count++;
      localStorage.setItem('basket', JSON.stringify(basket));
      this.orderService.changeBasket.next(true);
    }
  }

  decrementProductCount(item: IProductResponce): void {
    let basket: Array<IProductResponce> = [];
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
  loadUser() {
    if (localStorage.length > 0 && localStorage.getItem('currentUser')) {
      const currentUser = JSON.parse(
        localStorage.getItem('currentUser') as string
      );
      const currentBasket = JSON.parse(
        localStorage.getItem('basket') as string
      );
      currentUser.orders = currentBasket;
      this.userFullName = `${currentUser.firstName} ${currentUser.lastName}`;
      this.userEmail = currentUser.email;
      this.userPhone = currentUser.phoneNumber;
      this.userAddress = currentUser.address;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      this.userFullName = '';
      this.userEmail = '';
      this.userPhone = '';
      this.userAddress = '';
    }
  }
}

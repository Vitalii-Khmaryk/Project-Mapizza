import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/shared/services/account/account.service';

import {
  doc,
  Firestore,
  setDoc,
} from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cabinet',
  templateUrl: './cabinet.component.html',
  styleUrls: ['./cabinet.component.scss'],
})
export class CabinetComponent {
  public userEmail!: string;
  public userName!: string;
  public userSurname!: string;
  public userPass!: string;

  public phone!: string;
  public dataVar = true;
  public historyVar = false;
  public passVar = false;

  public addressValue: string = '';

  public empty = true;

  public arrCab!:any[];

  constructor(
    private router: Router,
    private accountService: AccountService,
    private afs: Firestore,
    private toastr: ToastrService,
    
  ) {}
  ngOnInit(): void {
    this.dataLoad();
    this.orderLoad();
  }

 orderLoad(){
  let ordersArr = JSON.parse(localStorage.getItem('orders') as string);
    if (!ordersArr) {
      return;
    } else {
      this.empty = false;
      this.arrCab=ordersArr;
    }
}

  dataLoad() {
    const currentUser = JSON.parse(
      localStorage.getItem('currentUser') as string
    );
    this.phone = currentUser.phoneNumber;
    if (currentUser && currentUser.email) {
      this.userEmail = currentUser.email;
    }
    if (currentUser && currentUser.firstName) {
      this.userName = currentUser.firstName;
    }
    if (currentUser && currentUser.lastName) {
      this.userSurname = currentUser.lastName;
    }
    if (currentUser && currentUser.password) {
      this.userPass = currentUser.password;
    }
  }
  pass(){
    this.toastr.warning('На даний момент пароль змінити не можна');
  }
  save() {
    const currentUser = JSON.parse(
      localStorage.getItem('currentUser') as string
    );
    currentUser.address = this.addressValue;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    setDoc(doc(this.afs, 'users', currentUser.uid), currentUser);
    this.toastr.success('Адреса додана');
  }
  logout(): void {
    this.router.navigate(['/']);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('basket');
    localStorage.removeItem('orders');
    this.accountService.isUserLogin$.next(true);
  }
  data(): void {
    this.dataVar = true;
    this.historyVar = false;
    this.passVar = false;
  }
   history() {
    this.dataVar = false;
    this.historyVar = true;
    this.passVar = false;
  }
  changePass(): void {
    this.dataVar = false;
    this.historyVar = false;
    this.passVar = true;
  }
}


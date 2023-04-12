import { Component, OnInit,OnDestroy } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, UserCredential } from '@angular/fire/auth';
import { doc, docData, Firestore, setDoc } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { ROLE } from 'src/app/shared/constants/role.constant';
import { AccountService } from 'src/app/shared/services/account/account.service';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.scss']
})
export class AuthorizationComponent implements OnInit,OnDestroy {
  public authForm!:FormGroup;
  public authRegistForm!:FormGroup;
  public loginSubsription!:Subscription;
  
  constructor(
    private fb:FormBuilder,
    private accountService:AccountService,
    private router:Router,
    private auth:Auth,
    private afs:Firestore,
    private toastr:ToastrService
    ){}
  
  ngOnInit():void{
    this.initAuthForm();
    this.initauthRegistForm();
  }
  ngOnDestroy():void{
    if (this.loginSubsription){
      this.loginSubsription.unsubscribe();
    }
  }
  
  initAuthForm(){
    this.authForm=this.fb.group({
      email:[null,[Validators.required,Validators.email]],
      password:[null,[Validators.required]]
    })
   }
  
   initauthRegistForm(){
    this.authRegistForm=this.fb.group({
      userName:[null,[Validators.required]],
      userSurname:[null,[Validators.required]],
      phoneNumber:[null,[Validators.required]],
      userEmail:[null,[Validators.required,Validators.email]],
      userPassword:[null,[Validators.required]],
      repeatPassword:[null,[Validators.required]],
    })
   }
  
  
  
  login():void{
    const {email,password}=this.authForm.value;
    this.loginAsync(email,password).then(()=>{
      this.toastr.success('User successfully login');
    }).catch(e=>{
      this.toastr.error(e);
    })
  }
  
  async loginAsync(email:string,password:string):Promise<void>{
  const credential=await signInWithEmailAndPassword(this.auth,email,password);
  this.loginSubsription=docData(doc(this.afs,'users',credential.user.uid)).subscribe(user=>{
  const currentUser={...user,uid:credential.user.uid};
  localStorage.setItem('currentUser',JSON.stringify(currentUser));
    if (user && user['role']===ROLE.USER) {
            this.router.navigate(['/cabinet']);
          } else if(user && user['role']===ROLE.ADMIN){
            this.router.navigate(['/admin']);
          }
          this.accountService.isUserLogin$.next(true);
  },(error)=>{
    console.log(error);
  })
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IDiscountRequest,IDiscountResponse } from '../../interfaces/discount/discount.interface';
import {Firestore, CollectionReference, doc, updateDoc, deleteDoc,addDoc,docData, collectionData} from "@angular/fire/firestore";
import {DocumentData,collection} from "@firebase/firestore";

@Injectable({
  providedIn: 'root'
})
export class DiscountService implements Resolve<Observable<DocumentData>> {
  private url = environment.BACKEND_URL;
  private api = { discounts: `${this.url}/discounts` }
  private discountCollection!:CollectionReference<DocumentData>;
  constructor(
    private http: HttpClient,
  private afs:Firestore
  ) {
    this.discountCollection=collection(this.afs,'discounts');
  }

  getAllFirebase(){
    return collectionData(this.discountCollection, {idField:'id'});
  }
  getOneFirebase(id:string){
    const discountDocumentReference=doc(this.afs,`discounts/${id}`);
   return docData(discountDocumentReference, {idField:'id'});
  }
  resolve(route:ActivatedRouteSnapshot):Observable<DocumentData>{
    const discountDocumentReference=doc(this.afs,`discounts/${route.paramMap.get('id')}`);
    return docData(discountDocumentReference, {idField:'id'});
  }
  createFirebase(discount: IDiscountRequest) {
    return addDoc(this.discountCollection,discount);
  }
  updateFirebase(action: IDiscountRequest, id: string){
    const discountDocumentReference=doc(this.afs,`discounts/${id}`);
    return updateDoc(discountDocumentReference,{...action});
  }
  deleteFirebase(id:string){
    const discountDocumentReference=doc(this.afs,`discounts/${id}`);
    return deleteDoc(discountDocumentReference);
  }
}

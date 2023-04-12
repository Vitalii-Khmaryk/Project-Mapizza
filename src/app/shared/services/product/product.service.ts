import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import {Firestore, CollectionReference, doc, updateDoc, deleteDoc,addDoc,docData, collectionData} from "@angular/fire/firestore";
import {collection, DocumentData,getDocs,query,where} from "@firebase/firestore";
import { IProductRequest,IProductResponce } from '../../interfaces/product/product.interface';
@Injectable({
  providedIn: 'root'
})
export class ProductService implements Resolve<Observable<DocumentData>> {
  private url = environment.BACKEND_URL;
  private api = { products: `${this.url}/products` }
  private productCollection!:CollectionReference<DocumentData>;
  constructor(
    private http: HttpClient,
    private afs:Firestore
  ) {
    this.productCollection=collection(this.afs,'products');
  }

  getAllFirebase(){
    return collectionData(this.productCollection, {idField:'id'});
  }
  resolve(route:ActivatedRouteSnapshot):Observable<DocumentData>{
    const productDocumentReference=doc(this.afs,`products/${route.paramMap.get('id')}`);
    return docData(productDocumentReference, {idField:'id'});
  }
  getOneFirebase(id:string){
    const productDocumentReference=doc(this.afs,`products/${id}`);
    return docData(productDocumentReference, {idField:'id'});
  }
  async getAllByCategoryFirebase(name: string) {
    const productsCollectionRef =collection(this.afs,'products');
    const q=query(productsCollectionRef,where('category.path','==',name));
    const querySnapshot=await getDocs(q); 
    const products=querySnapshot.docs.map(doc=>({id:doc.id,...doc.data()}));
    return products;
  }
  createFirebase(product: IProductRequest) {
    return addDoc(this.productCollection,product);
  }
  updateFirebase(product: IProductRequest, id: string){
    const productDocumentReference=doc(this.afs,`products/${id}`);
    return updateDoc(productDocumentReference,{...product});
  }
  deleteFirebase(id:string){
    const productDocumentReference=doc(this.afs,`products/${id}`);
    return deleteDoc(productDocumentReference);
  }
  
}

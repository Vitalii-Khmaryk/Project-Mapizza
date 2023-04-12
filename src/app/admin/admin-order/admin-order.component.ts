import { Component } from '@angular/core';
import {
  Firestore,
  CollectionReference,
  collectionData,
} from '@angular/fire/firestore';
import {
  collection,
  DocumentData,
} from '@firebase/firestore';
@Component({
  selector: 'app-admin-order',
  templateUrl: './admin-order.component.html',
  styleUrls: ['./admin-order.component.scss'],
})
export class AdminOrderComponent {
  public orderAdmin!: any[];
  private orderCollection!: CollectionReference<DocumentData>;
  constructor(private afs: Firestore) {
    this.orderCollection = collection(this.afs, 'orders');
  }

  getAllFirebase() {
    return collectionData(this.orderCollection, { idField: 'id' });
  }
  ngOnInit(): void {
    this.loadOrder();
  }

  loadOrder() {
    this.getAllFirebase().subscribe((data) => {
      this.orderAdmin = data as Array<any>;
    });
  }
}

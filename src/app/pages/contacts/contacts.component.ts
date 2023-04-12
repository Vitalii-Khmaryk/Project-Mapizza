import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  doc,
  Firestore,
  setDoc,collection
} from '@angular/fire/firestore';
@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent {
  public contactForm!: FormGroup;
  constructor(private fb: FormBuilder, private toastr: ToastrService, private afs: Firestore,) {}
  ngOnInit(): void {
    this.initContactForm();
  }
  initContactForm(): void {
    this.contactForm = this.fb.group({
      name: [null, Validators.required],
      phone: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      message: [null, Validators.required],
    });
  }

  sendContact() {
    const dataContact = this.contactForm.value;
    const contactsRef = collection(this.afs, 'contacts');
    const newContactRef = doc(contactsRef);
    setDoc(newContactRef, dataContact)
      .then(() => {
        this.toastr.success('Контакти надіслано');
        this.contactForm.reset();
      })
      .catch((error) => {
        console.error('Error writing document: ', error);
      });
  }
}

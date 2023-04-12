import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IDiscountResponse } from 'src/app/shared/interfaces/discount/discount.interface';
import { DiscountService } from 'src/app/shared/services/discount/discount.service';
import {
  deleteObject,
  getDownloadURL,
  percentage,
  ref,
  Storage,
  uploadBytesResumable,
} from '@angular/fire/storage';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-admin-discount',
  templateUrl: './admin-discount.component.html',
  styleUrls: ['./admin-discount.component.scss'],
})
export class AdminDiscountComponent {
  public adminActions!: IDiscountResponse[];

  public actionForm!: FormGroup;

  public editId!: number | string;
  public editStatus = false;
  public uploadPercent!: number;
  public isUploaded = false;

  public addActionStatus = false;
  public dd!: any;
  constructor(
    private actionService: DiscountService,
    private fb: FormBuilder,
    private storage: Storage,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getActions();
    this.initActionForm();
  }

  initActionForm(): void {
    const d = new Date();
    const dd = `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
    this.actionForm = this.fb.group({
      date: dd,
      name: [null, Validators.required],
      title: [null, Validators.required],
      description: [null, Validators.required],
      imagePath: [null, Validators.required],
    });
  }

  getActions(): void {
    this.actionService.getAllFirebase().subscribe((data) => {
      this.adminActions = data as IDiscountResponse[];
    });
  }

  addAction(): void {
    this.addActionStatus = !this.addActionStatus;
    this.actionForm.patchValue({
      name: '',
      title: '',
      description: '',
      imagePath: '',
    });
  }

  saveNewAction(): void {
    if (this.editStatus) {
      this.actionService
        .updateFirebase(this.actionForm.value, this.editId as string)
        .then(() => {
          this.getActions();
          this.toastr.success('The discount has been successfully changed');
        });
    } else {
      this.actionService.createFirebase(this.actionForm.value).then(() => {
        this.getActions();
        this.toastr.success('The discount has been created successfully');
      });
    }
    this.addActionStatus = false;
    this.editStatus = false;
    this.isUploaded = false;
    this.uploadPercent = 0;
  }

  editAction(action: IDiscountResponse): void {
    this.addActionStatus = true;
    this.actionForm.patchValue({
      date: action.date,
      name: action.name,
      title: action.title,
      description: action.description,
      imagePath: action.imagePath,
    });
    this.editStatus = true;
    this.editId = action.id as number;
    this.isUploaded = true;
  }

  deleteAction(action: IDiscountResponse): void {
    this.actionService.deleteFirebase(action.id as string).then(() => {
      this.getActions();
      this.toastr.success('The discount has been successfully removed');
    });
  }

  upload(event: any): void {
    const file = event.target.files[0];
    this.uploadFile('images', file.name, file)
      .then((data) => {
        this.actionForm.patchValue({
          imagePath: data,
        });
        this.isUploaded = true;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async uploadFile(
    folder: string,
    name: string,
    file: File | null
  ): Promise<string> {
    const path = `${folder}/${name}`;
    let url = '';
    if (file) {
      try {
        const storageRef = ref(this.storage, path);
        const task = uploadBytesResumable(storageRef, file);
        percentage(task).subscribe((data) => {
          this.uploadPercent = data.progress;
        });
        await task;
        url = await getDownloadURL(storageRef);
      } catch (error: any) {
        console.error(error);
      }
    } else {
      console.log('wrong file');
    }
    return Promise.resolve(url);
  }

  deleteImage(): void {
    const task = ref(this.storage, this.valueByControl('imagePath'));
    deleteObject(task).then(() => {
      console.log('file deleted');
      this.isUploaded = false;
      this.uploadPercent = 0;
      this.actionForm.patchValue({
        imagePath: null,
      });
    });
  }

  valueByControl(control: string): string {
    return this.actionForm.get(control)?.value;
  }
}

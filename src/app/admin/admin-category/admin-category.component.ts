import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICategoryResponce } from 'src/app/shared/interfaces/category/category.interface';
import { CategoryService } from 'src/app/shared/services/category/category.service';
import { deleteObject, getDownloadURL, percentage, ref, Storage, uploadBytesResumable } from '@angular/fire/storage';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-admin-category',
  templateUrl: './admin-category.component.html',
  styleUrls: ['./admin-category.component.scss']
})
export class AdminCategoryComponent {
  public adminCategories!: ICategoryResponce[];

  public categoryForm!: FormGroup;

  public editId!: number | string;
  public editStatus = false;
  public uploadPercent!: number;
  public isUploaded = false;

  public addCategoryStatus = false;

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private storage: Storage
  ) { }

  ngOnInit(): void {
    this.getCategories();
    this.initCategoryForm();
  }

  initCategoryForm(): void {
    this.categoryForm = this.fb.group({
      name: [null, Validators.required],
      path: [null, Validators.required],
      imagePath: [null, Validators.required]
    })
  }

  getCategories(): void {
   this.categoryService.getAllFirebase().subscribe(data => {
      this.adminCategories = data as ICategoryResponce[];
    })

  }

  addCategory(): void {
    this.addCategoryStatus = !this.addCategoryStatus;
  }

  saveNewCategory(): void {
    if (this.editStatus) {
      this.categoryService.updateFirebase(this.categoryForm.value, this.editId as string).then(() => {
        this.getCategories();
        this.toastr.success('The category has been successfully changed');
      })
    } else {
      this.categoryService.createFirebase(this.categoryForm.value).then(() => {
        this.getCategories();
        this.toastr.success('The category has been created successfully');
      })
    }
    this.categoryForm.reset();
    this.addCategoryStatus = false;
    this.editStatus = false;
    this.isUploaded = false;
    this.uploadPercent = 0;
  }

  editCategory(category: ICategoryResponce): void {
    this.addCategoryStatus = true;
    this.categoryForm.patchValue({
      name: category.name,
      path: category.path,
      imagePath: category.imagePath
    });
    this.editStatus = true;
    this.editId = category.id as number;
    this.isUploaded = true;
  }

  deleteCategory(category: ICategoryResponce): void {
    this.categoryService.deleteFirebase(category.id as string).then(() => {
      this.getCategories();
      this.toastr.success('The category has been successfully removed');
    });
  }

  upload(event: any): void {
    const file = event.target.files[0];
    this.uploadFile('images', file.name, file)
      .then(data => {
        this.categoryForm.patchValue({
          imagePath: data
        });
        this.isUploaded = true;
      })
      .catch(err => {
        console.log(err);
      })
  }

  async uploadFile(folder: string, name: string, file: File | null): Promise<string> {
    const path = `${folder}/${name}`;
    let url = '';
    if (file) {
      try {
        const storageRef = ref(this.storage, path);
        const task = uploadBytesResumable(storageRef, file);
        percentage(task).subscribe(data => {
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

  deleteImage(): void{
    const task = ref(this.storage, this.valueByControl('imagePath'));
    deleteObject(task).then(()=>{
      console.log('file deleted');
      this.isUploaded = false;
      this.uploadPercent = 0;
      this.categoryForm.patchValue({
        imagePath: null
      })
    })
  }

  valueByControl(control: string): string{
    return this.categoryForm.get(control)?.value;
  }
}

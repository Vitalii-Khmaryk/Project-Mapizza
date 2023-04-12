import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ICategoryResponce } from 'src/app/shared/interfaces/category/category.interface';
import { IProductResponce } from 'src/app/shared/interfaces/product/product.interface';
import { CategoryService } from 'src/app/shared/services/category/category.service';
import { ImageService } from 'src/app/shared/services/image/image.service';
import { ProductService } from 'src/app/shared/services/product/product.service';
@Component({
  selector: 'app-admin-product',
  templateUrl: './admin-product.component.html',
  styleUrls: ['./admin-product.component.scss']
})
export class AdminProductComponent {
  public adminCategories: ICategoryResponce[]=[];
  public adminProducts: IProductResponce[]=[];

  public productForm!: FormGroup;

  public categoryId!: number;
  public editId!: number | string;
  public editStatus = false;
  public uploadPercent!: number;
  public isUploaded = false;

  public addProductStatus = false;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private imageService: ImageService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getProducts();
    this.initProductForm();
    this.loadCategories();
  }

  initProductForm(): void {
    this.productForm = this.fb.group({
      category: [null, Validators.required],
      name: [null, Validators.required],
      path: [null, Validators.required],
      ingredients: [null, Validators.required],
      weight: [null, Validators.required],
      price: [null, Validators.required],
      imagePath: [null, Validators.required],
      count: [1]
    })
  }

  getProducts(): void {
    this.productService.getAllFirebase().subscribe(data => {
      this.adminProducts = data as IProductResponce[];
    })
  }

  loadCategories(): void {
    this.categoryService.getAllFirebase().subscribe(data => {
      this.adminCategories = data as IProductResponce[];
      this.productForm.patchValue({
        category: this.adminCategories[0].id
      })
    })
  }


  addProduct(): void {
    this.addProductStatus = !this.addProductStatus;
  }

  saveNewProduct(): void {
    if (this.editStatus) {
      this.productService.updateFirebase(this.productForm.value, this.editId as string).then(() => {
        this.getProducts();
        this.toastr.success('The product has been successfully changed');
      })
    } else {
      this.productService.createFirebase(this.productForm.value).then(() => {
        this.getProducts();
        this.toastr.success('The product has been created successfully');
      })
    }
    this.productForm.reset();
    this.addProductStatus = false;
    this.editStatus = false;
    this.isUploaded = false;
    this.uploadPercent = 0;
  }

  editProduct(product: IProductResponce): void {
    this.addProductStatus = true;
    this.productForm.patchValue({
      category: product.category,
      name: product.name,
      path: product.path,
      ingredients: product.ingredients,
      weight: product.weight,
      price: product.price,
      imagePath: product.imagePath
    })
    this.editStatus = true;
    this.editId = product.id as number;
    this.isUploaded = true;
  }

  deleteProduct(product: IProductResponce): void {
    this.productService.deleteFirebase(product.id as string).then(() => {
      this.getProducts();
      this.toastr.success('The product has been successfully removed');
    });
  }

  upload(event: any): void {
    const file = event.target.files[0];
    this.imageService.uploadFile('images', file.name, file)
      .then(data => {
       this.uploadPercent= this.imageService.uploadPercent;
        this.productForm.patchValue({
          imagePath: data
        });
        this.isUploaded = true;
      })
      .catch(err => {
        console.log(err);
      })
  }

  deleteImage(): void {
    this.imageService.deleteUploadFile(this.valueByControl('imagePath'))
      .then(() => {
        this.isUploaded = false;
        this.uploadPercent = 0;
        this.productForm.patchValue({
          imagePath: null
        })
      })
      .catch(err => {
        console.log(err);
      })
  }

  valueByControl(control: string): string {
    return this.productForm.get(control)?.value;
  }
}

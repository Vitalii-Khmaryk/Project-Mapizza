import { Pipe, PipeTransform } from '@angular/core';
import { IProductResponce } from '../../interfaces/product/product.interface';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(arrProduct: IProductResponce[], filterValue:string):IProductResponce[] {
    if (!arrProduct) {
      return [];
    }
    if (!filterValue) {
      return arrProduct;
    }
    for (const i of arrProduct) {
      if (filterValue.includes(i.name.slice(0, 1).toLocaleLowerCase())) {
        return arrProduct.filter((prod) =>
          prod.name.toLowerCase().includes(filterValue.toLowerCase())
        );
      }
    }
    return arrProduct.filter((prod) =>prod.ingredients.toLowerCase().includes(filterValue.toLowerCase()));
  }
}



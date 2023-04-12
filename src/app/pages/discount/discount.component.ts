import { Component } from '@angular/core';
import { DiscountService } from 'src/app/shared/services/discount/discount.service';
import { IDiscountResponse } from 'src/app/shared/interfaces/discount/discount.interface';
@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.scss']
})
export class DiscountComponent {
  public discounts: IDiscountResponse[] = [];

  constructor(
    private discountService: DiscountService
  ) { }

  ngOnInit(): void {
    this.getActions();
  }

  getActions(): void {
    this.discountService.getAllFirebase().subscribe(data => {
      this.discounts = data as IDiscountResponse[];
    })
  }
}

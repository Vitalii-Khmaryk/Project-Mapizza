export interface IDiscountRequest{
    date: Date;
    name: string;
    title: string;
    description: string;
    imagePath: string;
}

export interface IDiscountResponse extends IDiscountRequest{
    id: number | string;
}
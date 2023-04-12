import { ICategoryResponce } from "../category/category.interface";

export interface IProductRequest{
    category: ICategoryResponce;
    name: string;
    path: string;
    ingredients: string;
    weight: string;
    price: number;
    imagePath: string;
    count:number;
}

export interface IProductResponce extends IProductRequest{
    id: number | string;
}
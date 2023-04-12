export interface ICategoryRequest{
    name: string;
    path: string;
    imagePath: string;
}

export interface ICategoryResponce extends ICategoryRequest{
    id: number | string;
}
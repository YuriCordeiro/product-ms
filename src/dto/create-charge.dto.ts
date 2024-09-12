import { CreateProductDTO } from "./create-product.dto";

export class CreateChargeDTO {
    cartId: string;
    orderId: string;
    products: CreateProductDTO[];
    totalAmount: number;
}
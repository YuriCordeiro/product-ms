import { GetProductStockDTO } from "./get-product-stock.dto";

export class InventoryDTO {
    product: GetProductStockDTO;
    totalAvailable: number;
    totalReserved: number;
}
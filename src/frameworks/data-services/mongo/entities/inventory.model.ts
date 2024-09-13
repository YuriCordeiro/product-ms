import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Product } from "./product.model";

export type InventoryDocument = Inventory & Document;

@Schema()
export class Inventory {
    id: string
    @Prop({
        type: Product
    })
    product: Product;
    @Prop()
    totalAvailable: number;
    @Prop()
    totalReserved: number;
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);
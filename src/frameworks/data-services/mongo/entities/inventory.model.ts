import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Product } from "./product.model";
import mongoose, { ObjectId } from "mongoose";

export type InventoryDocument = Inventory & Document;

@Schema()
export class Inventory {

    id: string

    @Prop({
        type: mongoose.Schema.Types.ObjectId
    })
    product: Product;
    @Prop()
    totalAvailable: number;
    @Prop()
    totalReserved: number;
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IDataServices } from 'src/core/abstracts/data-services.abstract';
import { MongoDataServices } from './mongo-data-services.service';
import { ConfigModule } from '@nestjs/config';
import { Product, ProductSchema } from './entities/product.model';
import { Inventory, InventorySchema } from './entities/inventory.model';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Inventory.name, schema: InventorySchema }
    ]),
    MongooseModule.forRoot(process.env.MONGO_CONNECTION_STRING),
  ],
  providers: [
    {
      provide: IDataServices,
      useClass: MongoDataServices,
    },
  ],
  exports: [IDataServices],
})
export class MongoDataServicesModule {}

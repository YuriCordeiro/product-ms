import { Injectable } from '@nestjs/common';
import { InventoryDTO } from 'src/dto/inventory.dto';
import { Inventory } from 'src/frameworks/data-services/mongo/entities/inventory.model';
import { Product } from 'src/frameworks/data-services/mongo/entities/product.model';

@Injectable()
export class InventoryFactoryService {

  createNewInventory(createdProduct: Product, quantity: number): Inventory {
    const inventory = new Inventory();
    inventory.product = createdProduct;
    inventory.totalAvailable = quantity;
    inventory.totalReserved = 0;
    return inventory;
  }

  updateInventory(inventoryDTO: InventoryDTO): Inventory {
    const updatedInventory = new Inventory();

    Object.entries(inventoryDTO).forEach(([key, value]) => {
      if (key === 'id') return;
      updatedInventory[key] = value;
    });
    return updatedInventory;
  }
}

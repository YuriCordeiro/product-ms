import { Injectable } from '@nestjs/common';
import { InventoryDTO } from 'src/dto/inventory.dto';
import { Inventory } from 'src/frameworks/data-services/mongo/entities/inventory.model';

@Injectable()
export class InventoryFactoryService {

  createNewInventory(inventoryDTO: InventoryDTO): Inventory {
    const inventory = new Inventory();
    inventory.product = inventoryDTO.product;
    inventory.totalAvailable = inventoryDTO.totalAvailable;
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

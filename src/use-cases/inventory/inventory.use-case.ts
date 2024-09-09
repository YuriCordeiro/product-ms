import { Injectable, Logger } from "@nestjs/common";
import { IDataServices } from "src/core/abstracts/data-services.abstract";
import { InventoryFactoryService } from "./inventory-factory.service";
import { InventoryDTO } from "src/dto/inventory.dto";
import { Inventory } from "src/frameworks/data-services/mongo/entities/inventory.model";
import { CreateProductDTO } from "src/dto/create-product.dto";

@Injectable()
export class InventoryUseCase {

    private readonly logger = new Logger(InventoryUseCase.name);

    constructor(
        private dataServices: IDataServices,
        private inventoryFactoryService: InventoryFactoryService
      ) { }

      async createProductInventory(productDTO: CreateProductDTO): Promise<Inventory> {
        this.logger.log(`createProductInventory(CreateProductDTO) - Adding ${productDTO.quantity}x - '${productDTO.name}' to inventory.`);
        let inventoryDTO = new InventoryDTO();
        inventoryDTO.product = productDTO;
        inventoryDTO.totalAvailable = productDTO.quantity;
        const newInventory = this.inventoryFactoryService.createNewInventory(inventoryDTO);
        
        return await this.dataServices.inventories.create(newInventory);
      }

      async getAllProductInventories(): Promise<Inventory[]> {
        return await this.dataServices.inventories.getAll();
      }

      async updateInventory(inventoryId: string, inventory: Inventory) {
        return await this.dataServices.inventories.update(inventoryId, inventory);
      }

      async bookProduct(product: CreateProductDTO) {
        return await this.dataServices.inventories.getAll().then(inventories => {
          inventories.filter(inventory => {
            inventory.product.sku = product.sku
          }).map(foundInventory => {
            this.logger.log(`found inventory: ${foundInventory}`);
            foundInventory.totalReserved += product.quantity
            this.logger.log(`inventory updated: ${foundInventory}`);
          });
        });
        
      }
}
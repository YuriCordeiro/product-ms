import { Injectable, Logger } from "@nestjs/common";
import { IDataServices } from "src/core/abstracts/data-services.abstract";
import { InventoryFactoryService } from "./inventory-factory.service";
import { InventoryDTO } from "src/dto/inventory.dto";
import { Inventory } from "src/frameworks/data-services/mongo/entities/inventory.model";
import { CreateProductDTO } from "src/dto/create-product.dto";
import { JOB_TYPES, SQSProducerService } from "src/frameworks/messaging-services/sqs-messaging-services.service";
import { CreateChargeDTO } from "src/dto/create-charge.dto";
import { Product } from "src/frameworks/data-services/mongo/entities/product.model";

@Injectable()
export class InventoryUseCase {

    private readonly logger = new Logger(InventoryUseCase.name);

    constructor(
        private dataServices: IDataServices,
        private inventoryFactoryService: InventoryFactoryService,
        private producerService: SQSProducerService
      ) { }

      async createProductInventory(createdProduct: Product, quantity: number): Promise<Inventory> {
        this.logger.log(`createProductInventory(CreateProductDTO) - Adding ${quantity}x - '${createdProduct.name}' to inventory.`);
        this.logger.log(`Created Product: ${createdProduct}`);
        const newInventory = this.inventoryFactoryService.createNewInventory(createdProduct, quantity);
        const createdInventory = await this.dataServices.inventories.create(newInventory);
        this.logger.log(`Created Inventory: ${createdInventory}`);
        return createdInventory;
      }

      async getAllProductInventories(): Promise<Inventory[]> {
        return await this.dataServices.inventories.getAll();
      }

      async updateInventory(inventoryId: string, inventory: Inventory) {
        return await this.dataServices.inventories.update(inventoryId, inventory);
      }

      async bookProducts(productList: CreateProductDTO[]) {
        this.logger.log("bookProducts(CreateProductDTO[]) - Start");
        this.getAllProductInventories()
          .then(inventories => {
              productList.forEach(product => { // For each product
                  inventories.filter(items => { // Find the self repository by product SKU
                      return items.product.sku = product.sku
                  }).map(productInventory => { // Update the fields 'totalReserved' and 'totalAvailable' based on 'product.quantity' field
                      productInventory.totalReserved += product.quantity;
                      productInventory.totalAvailable -= product.quantity;
                      return productInventory;
                  }).flatMap(updatedInventory => this.updateInventory(updatedInventory.id, updatedInventory)); // update the current updtated inventory
              })
        })
          .finally(() => this.logger.log("Products has been booked and inventories has been successfully updated."));
      }

      createNewCharge(createChargeDTO: CreateChargeDTO) {
        this.logger.log("createNewCharge(CreateChargeDTO) - Start");
        const totalOrderAmount = this.sumTotalChargeAmount(createChargeDTO.products);
        const chargeMessageObject = {
          orderId: createChargeDTO.orderId,
          cartId: createChargeDTO.cartId,
          totalOrderAmount: totalOrderAmount
      }
      const sendMessage = JSON.stringify(chargeMessageObject);
      this.logger.log(`Built Charge Message: ${sendMessage}`);
      this.producerService.sendNewCharge(chargeMessageObject, JOB_TYPES.NEW_CHARGE);
      }

      sumTotalChargeAmount(products: CreateProductDTO[]) {
        return products
          .map(p => p.value * p.quantity)
          .reduce((partialSum, a) => partialSum + a, 0);
      }
}
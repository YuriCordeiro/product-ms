import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { SqsMessageHandler } from "@ssut/nestjs-sqs";
import { Message } from "@aws-sdk/client-sqs";
import { JOB_TYPES, MessageBody } from "./sqs-messaging-services.service";
import { CreateProductDTO } from "src/dto/create-product.dto";
import { InventoryUseCase } from "src/use-cases/inventory/inventory.use-case";

@Injectable()
export class MessageHandler {

    private readonly logger = new Logger(MessageHandler.name);
    
    constructor(private inventoryService: InventoryUseCase) { }

    @SqsMessageHandler(process.env.SQS_QUEUE_NAME, false)
    async handleMessage(message: Message) {
    this.logger.log(`handleMessage() - Consumer  Start`);
    const msgBody: MessageBody = JSON.parse(message.Body) as MessageBody;
    this.logger.log(`Reading message with ID: ${msgBody.messageId}`)

    if (msgBody.MessageAttributes.job.value !in JOB_TYPES) {
      Logger.error('Invalid job type ' + msgBody.MessageAttributes.job.value);
      throw new InternalServerErrorException(
        'Invalid job type ' + msgBody.MessageAttributes.job.value,
      );
    }

    try {
      const strMessage = JSON.stringify(msgBody.message);

    //   this.logger.log(`This is the message: ${strMessage}`); // Log the message

      const productList: CreateProductDTO[] = JSON.parse(strMessage) as CreateProductDTO[];

      this.inventoryService.getAllProductInventories()
        .then(inventories => {
            productList.forEach(product => { // For each product
                inventories.filter(items => { // Find the self repository by product SKU
                    return items.product.sku = product.sku
                }).map(productInventory => { // Update the fields 'totalReserved' and 'totalAvailable' based on 'product.quantity' field
                    productInventory.totalReserved += product.quantity;
                    productInventory.totalAvailable -= product.quantity;
                    return productInventory;
                }).flatMap(updatedInventory => this.inventoryService.updateInventory(updatedInventory.id, updatedInventory)); // update the current updtated inventory
            })
      }).finally(() => {
        this.logger.log("Products has been booked and inventories has been successfully updated.");
    });

    } catch (error) {
      console.log('consumer error', JSON.stringify(error));
      //keep the message in sqs
      Logger.error(error.message);
      throw new InternalServerErrorException(error);
   
        }
    }
}


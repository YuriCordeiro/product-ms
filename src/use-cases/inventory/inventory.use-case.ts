import { Injectable, Logger } from "@nestjs/common";
import { IDataServices } from "src/core/abstracts/data-services.abstract";
import { InventoryFactoryService } from "./inventory-factory.service";
import { InventoryDTO } from "src/dto/inventory.dto";
import { Inventory } from "src/frameworks/data-services/mongo/entities/inventory.model";
import { CreateProductDTO } from "src/dto/create-product.dto";
import { SQS } from "aws-sdk";
import { ConfigModule, ConfigObject } from "@nestjs/config";
import { access } from "fs";

@Injectable()
export class InventoryUseCase {

    private readonly logger = new Logger(InventoryUseCase.name);

    constructor(
        private dataServices: IDataServices,
        private inventoryFactoryService: InventoryFactoryService
      ) { }

      //TODO: Validar usabilidade de fila NEW_PRODUCT ou PRODUCT_EVENT que atualiza a quantidade de produtos no estoque
      // Faz sentido para o mesmo MS? Acho que não.
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
}

// const region = process.env.SQS_REGION;
// const accessKeyId = process.env.SQS_ACCESS_KEY_ID;
// const secretAccessKey = process.env.SQS_SECRET_ACCESS_KEY

// const sqs = new SQS({
//   region: region,
//   credentials: {
//     accessKeyId: accessKeyId,
//     secretAccessKey: secretAccessKey
//   // region: "us-east-1",
//   // credentials: {
//   //   accessKeyId: "AKIA6GBMCKINQ5ULU2W4",
//   //   secretAccessKey: "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"
//   }
// });

// // const sqs = new SQS(configObject);

// const receiveMessages = async () => {
//   const params = {
//     // QueueUrl: process.env.SQS_URL,
//     QueueUrl: "https://sqs.us-east-1.amazonaws.com/975050002971/NEW_ORDER",
//     MaxNumberOfMessages: 10,
//     VisibilityTimeout: 20, // 20 seconds
//     WaitTimeSeconds: 0,
//   };

//   try {
//     const data = await sqs.receiveMessage(params).promise();
//     return data.Messages || [];
//   } catch (err) {
//     console.error("Error", err);
//     throw err;
//   }
// };

// const processMessages = async (messages) => {
//   for (const message of messages) {
//     console.log("Received message:", message.Body);

//     // Delete the message
//     const deleteParams = {
//       // QueueUrl: process.env.SQS_URL,
//       QueueUrl: "https://sqs.us-east-1.amazonaws.com/975050002971/NEW_ORDER",
//       ReceiptHandle: message.ReceiptHandle,
//     };
//     await sqs.deleteMessage(deleteParams).promise();
//   }
// };

// // Example usage
// receiveMessages().then(processMessages);
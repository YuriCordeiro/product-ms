import { Module } from "@nestjs/common";
import { DataServicesModule } from "src/services/data-services.module";
import { InventoryUseCase } from "./inventory.use-case";
import { InventoryFactoryService } from "./inventory-factory.service";
import AWS from "aws-sdk";
import { SqsModule } from "@ssut/nestjs-sqs";


AWS.config.update({
  region: sqsConfigObject.region,
  accessKeyId: sqsConfigObject.credentials.accessKeyId,
  secretAccessKey: sqsConfigObject.credentials.secretAccessKey,
});

@Module({
    imports: [
      DataServicesModule,
      SqsModule.register({
        consumers: [
            {
                name: config.QUEUE_NAME, // name of the queue 
                queueUrl: config.QUEUE_URL, // the url of the queue
                region: sqsConfigObject.region,
            },
        ],
        producers: [],
    }),
],
    providers: [InventoryFactoryService, InventoryUseCase],
    exports: [InventoryFactoryService, InventoryUseCase],
  })
  export class ProductUseCaseModule {}
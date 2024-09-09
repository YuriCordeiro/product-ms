import { Module } from "@nestjs/common";
import { DataServicesModule } from "src/services/data-services.module";
import { InventoryUseCase } from "./inventory.use-case";
import { InventoryFactoryService } from "./inventory-factory.service";
import { SqsModule } from "@ssut/nestjs-sqs";
import { SQSConsumerService } from "src/frameworks/messaging-services/sqs-messaging-services.service";
import { MessageHandler } from "src/frameworks/messaging-services/sqs-message-handler";
import {SQSClient} from '@aws-sdk/client-sqs';

@Module({
    imports: [
      DataServicesModule,      
      SqsModule.register({
        consumers: [
            {
                name: process.env.SQS_QUEUE_NAME, // name of the queue 
                queueUrl: process.env.SQS_URL, // the url of the queue
                region: process.env.SQS_REGION,
                waitTimeSeconds: 20,
                sqs: new SQSClient({
                  region: process.env.SQS_REGION,
                  credentials: {
                    accessKeyId: process.env.SQS_ACCESS_KEY_ID,
                    secretAccessKey: process.env.SQS_SECRET_ACCESS_KEY
                  }
                })
            },
        ],
        producers: []
    }),
],
    providers: [InventoryFactoryService, InventoryUseCase, SQSConsumerService, MessageHandler],
    exports: [InventoryFactoryService, InventoryUseCase, SQSConsumerService, MessageHandler],
  })
  export class InventoryUseCaseModule {}
  
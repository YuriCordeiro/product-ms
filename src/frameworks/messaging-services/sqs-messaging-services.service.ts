import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import {SQS} from "aws-sdk";
import { v4 as uuidv4 } from 'uuid';

export interface SQSMessage {
  QueueUrl: string;
  MessageBody: string;
  MessageGroupId?: string;
  MessageDeduplicationId?: string;
  DelaySeconds?: number;
  
}

export interface Job {
DataType: string;
value: string;
}
export interface MessageAttributes {
job: Job;
}

export interface MessageBody {
messageId:string;
message: any;
date: string;
MessageAttributes: MessageAttributes;
}

export enum JOB_TYPES {
  NEW_ORDER = "NEW ORDER",
  NEW_NOTIFICATION = "NEW NOTIFICATION",
  NEW_CHARGE = "NEW CHARGE",
  CHARGE_EVENTS = "CHARGE EVENTS"
}

@Injectable()
export class SQSProducerService {

  send(message: any, jobType: string, messageGroupId: string = 'general') {
    if (jobType !in JOB_TYPES) {
      throw new BadRequestException('Invalid job type');
    }
    const region = process.env.SQS_REGION;
    const accessKeyId = process.env.SQS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.SQS_SECRET_ACCESS_KEY

    const sqs = new SQS({
      region: region,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey
      }
    });

    const messageId = uuidv4();
    let sqsMessage: SQSMessage = {
      QueueUrl: process.env.SQS_URL,
      MessageBody: JSON.stringify({
        messageId,
        message,
        MessageAttributes: {
          job: {
            DataType: 'string',
            value: jobType,
          },
        },
      } as MessageBody), 
    };

    console.log('sqsMessage:', sqsMessage);

    sqs.sendMessage(sqsMessage, function (err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success", data.MessageId);
      }
    });
  }
}

// @Injectable()
// export class SQSConsumerService {
//   receive() {
//     const region = process.env.SQS_REGION;
//     const accessKeyId = process.env.SQS_ACCESS_KEY_ID;
//     const secretAccessKey = process.env.SQS_SECRET_ACCESS_KEY
//     const sqs = new SQS({
//       region: region,
//       credentials: {
//         accessKeyId: accessKeyId,
//         secretAccessKey: secretAccessKey
//       }
//     });

//     var receiveMessageParams = {
//       QueueUrl: "NEW_ORDER", // Use Env Var
//       MaxNumberOfMessages: 10
//     };

//     sqs.receiveMessage(receiveMessageParams, function(err, data) {
//       if(err) {
//           console.log(err);
//       } 
//       else {
//           console.log(data);
//       } 
//     });
//   };

// }
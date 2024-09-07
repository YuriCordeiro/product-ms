const region = process.env.SQS_REGION;
const accessKeyId = process.env.SQS_ACCESS_KEY_ID;
const secretAccessKey = process.env.SQS_SECRET_ACCESS_KEY

const sqsConfigObject = {
    region: region,
    credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey
    }
}

const config = {
    QUEUE_NAME: "NEW_ORDER",
    QUEUE_URL: "https://sqs.us-east-1.amazonaws.com/975050002971/NEW_ORDER"
}

module.exports(sqsConfigObject);
module.exports(config);
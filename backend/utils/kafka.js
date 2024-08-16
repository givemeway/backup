import { Kafka, logLevel } from "kafkajs";

const kafka = new Kafka({
  clientId: "IMAGE-TRANSFORM-EVENT-SERVER",
  brokers: ["poetic-tick-9403-eu1-kafka.upstash.io:9092"],
  ssl: true,
  sasl: {
    mechanism: "scram-sha-256",
    username: "cG9ldGljLXRpY2stOTQwMyQsPn_6NquhIskDTFU5gAGPyeFlm8XbBgqy98BTVJY",
    password: "MzkwMDNkMjUtNzc0MC00OTNlLWI2YzMtOWI4NjAxNWQwMzMx",
  },
  logLevel: logLevel.ERROR,
});

const producer = kafka.producer();

export const initiKafkaProducer = async (imgData) => {
  const { id, username, filename, avatar } = imgData;
  console.log(imgData);
  await producer.connect();
  await producer.send({
    topic: "PROCESS-IMAGE",
    messages: [
      { key: id, value: JSON.stringify({ id, username, filename, avatar }) },
    ],
  });
  await producer.disconnect();
};

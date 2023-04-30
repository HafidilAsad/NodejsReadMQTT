const mqtt = require("mqtt");
const mysql = require("mysql2");

const client = mqtt.connect("mqtt://192.168.137.1");
const topic = "outTopic";
const message = "test message";

// create MySQL database connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mydb",
});

client.on("connect", () => {
  console.log(`Is client connected: ${client.connected}`);
  if (client.connected === true) {
    console.log(`message: ${message}, topic: ${topic}`);
    // publish message
    client.publish(topic, message);
  }

  // subscribe to a topic
  client.subscribe(topic);
});

// receive a message from the subscribed topic
client.on("message", (topic, message) => {
  console.log(`message: ${message}, topic: ${topic}`);

  // update database
  connection.query(
    `UPDATE tbl_messages SET message = '${message}' WHERE id = 1`,
    (error, results, fields) => {
      if (error) throw error;
      console.log("Message updated successfully!");
    }
  );
});

// error handling
client.on("error", (error) => {
  console.error(error);
  process.exit(1);
});

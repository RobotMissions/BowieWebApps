var mqttClient = new Paho.MQTT.Client("broker.shiftr.io", Number(443), "p5js-client_" + parseInt(Math.random() * 100)); // 443 is the mqttwss port
mqttClient.onConnectionLost = onConnectionLost;
mqttClient.onMessageArrived = onMessageArrived;

function setup() {
  createCanvas(200, 200);

  mqttClient.connect({
    onSuccess: onSuccess,
    userName: " ",
    password: " ",
    useSSL: true, // ws or wss
    onFailure: onFailure
  });

}

function draw() {
  background(220);
}

function keyTyped() {
  sendMessage(key);
}

function onSuccess() {
  console.log("Connected to MQTT broker");
  mqttClient.subscribe("keyboard/#", { qos: 1 });
}

function onFailure(message) {
  console.log("Connection failed - ERROR: " + message.errorMessage);
  //window.setTimeout(location.reload(),20000); // wait 20s before trying to connect again.
}

function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("Connection lost: " + responseObject.errorMessage);
  }
}

function onMessageArrived(message) {
  console.log("Received message");
  console.log("Topic: " + message.destinationName);
  console.log("Payload: " + message.payloadString);
  console.log("QoS: " + message.qos);
  console.log("Retained: " + message.retained);
  console.log("Duplicate: " + message.duplicate);
}

function sendMessage(m) {
  console.log("Sending message: " + m);
  let message = new Paho.MQTT.Message(m);
  message.destinationName = "keyboard/";
  message.qos = 1;
  mqttClient.send(message);
}

function unsubTopic() {
  mqttClient.unsubscribe("keyboard/");
}


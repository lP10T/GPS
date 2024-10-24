const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://127.0.0.1:1883'); // Replace with your MQTT broker URL

client.on('connect', () => {
  console.log('Connected to MQTT broker');

  const publishPromises = [];

  for (let i = 0; i < 10; i++) {
    const message = JSON.stringify({
      lat: Math.random() * 90,
      long: Math.random() * 180,
      speed: Math.random() * 0.1,
      gpstime: new Date().toISOString(),
      device: `Device0${i}`,
    });

    publishPromises.push(
      new Promise((resolve, reject) => {
        client.publish('gps/1', message, (err) => {
          if (err) {
            console.error('Publish error:', err);
            reject(err);
          } else {
            console.log(`Message ${i + 1} published`);
            resolve();
          }
        });
      })
    );
  }

  Promise.all(publishPromises)
    .then(() => {
      console.log('All messages published');
      client.end();
    })
    .catch((err) => {
      console.error('Error publishing messages:', err);
      client.end();
    });
});

client.on('error', (err) => {
  console.error('Connection error:', err);
});
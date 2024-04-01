import * as amqp from 'amqplib/callback_api';

amqp.connect('amqp://localhost', function (error0, connection) {
  if (error0) {
    throw error0;
  }
  // create chanel
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }
    const queue = 'hello';
    const msg = 'Hello world';
    // create queue
    channel.assertQueue(queue, {
      durable: false
    });

    channel.sendToQueue(queue, Buffer.from(msg));
    console.log(' [x] Sent %s', msg);
  });
});

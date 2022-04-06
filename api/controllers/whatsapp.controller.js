
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.MESSAGIN_SERVICE_SID;
const client = require('twilio')(accountSid, authToken);

exports.sendmessage = async (req, res) => {
  let phone = req.body.phone;
  let message = req.body.message;

  client.messages
    .create({
      messagingServiceSid: messagingServiceSid,
      body: message,
      to: `whatsapp:${phone}`
    })
    .then(message => {
      res.send({
        message: `Success to send message to ${phone}!`
      });
    }).catch(err => {
      res.send({
        message: `Fail to send message to ${phone}! ${err}`
      });
    });

}


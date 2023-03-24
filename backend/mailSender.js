const fs = require('fs');
const path = require('path');
const sendMail = require('./gmail');

const main = async () => {
  const fileAttachments = [
    {
      filename: 'attachment1.txt',
      content: 'This is a plain text file sent as an attachment',
    },
    // {
    //   path: path.join(__dirname, './attachment2.txt'),
    // },
    // {
    //   filename: 'websites.pdf',
    //   path: 'https://www.labnol.org/files/cool-websites.pdf',
    // },

    // {
    //   filename: 'image.png',
    //   content: fs.createReadStream(path.join(__dirname, './attach.png')),
    // },
  ];

  const options = {
    to: 'riturajpradhantestcause@gmail.com',
    cc: 'saivigneshsham@gmail.com',
    replyTo: 'riturajpradhantestcause@gmail.com',
    subject: 'Hello Fren 🚀',
    text: 'This email is sent from the command line',
    html: `<p>🙋🏻‍♀️  &mdash; This is a <b>test email</b> from <a href="https://digitalinspiration.com">Digital Inspiration</a>.</p>`,
    attachments: fileAttachments,
    textEncoding: 'base64',
    headers: [
      { key: 'X-Application-Developer', value: 'Amit Agarwal' },
      { key: 'X-Application-Version', value: 'v1.0.0.2' },
    ],
  };

  const messageId = await sendMail(options);
  return messageId;
};

const send = async (destination, subject, text) => {
  const options = {
    to: destination,
    replyTo: 'riturajpradhantestcause@gmail.com',
    subject: subject,
    text: text,
    // html: `<p>🙋🏻‍♀️  &mdash; This is a <b>test email</b> from <a href="https://digitalinspiration.com">Digital Inspiration</a>.</p>`,
    // attachments: fileAttachments,
    textEncoding: 'base64',
    headers: [
      { key: 'X-Application-Developer', value: 'Romulan Overlord' },
      { key: 'X-Application-Version', value: 'v1.0.0.2' },
    ],
  };

  const messageId = await sendMail(options);
  return messageId;
}

// main()
//   .then((messageId) => console.log('Message sent successfully:', messageId))
//   .catch((err) => console.error(err));

module.exports = send;
const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient.js");

const createSendEmailCommand = (
  toAddress,
  fromAddress,
  senderName,
  receiverName,
) => {
  const subject = `${senderName} wants to connect with you on DevLinks`;

  const htmlBody = `
<h2>Hello ${receiverName}, 👋</h2>

<p><strong>${senderName}</strong> is interested in connecting with you on <strong>DevLinks</strong>.</p>

<p>Log in to your DevLinks account to view and respond to the connection request.</p>

<p>
<a
href="https://devlinks.in"
style="
background:#4F46E5;
color:white;
padding:12px 20px;
text-decoration:none;
border-radius:8px;
display:inline-block;
font-weight:bold;
">
View Connection Request
</a>
</p>

<br/>

<hr>

<p style="color:gray;font-size:13px">
You're receiving this email because someone interacted with your DevLinks account.
</p>

<p><strong>Team DevLinks</strong></p>
`;

  const textBody = `
Hello ${receiverName},

${senderName} is interested in connecting with you on DevLinks.

Visit https://devlinks.in to view the request.

Team DevLinks`;

  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: [
        /* more items */
      ],
      ToAddresses: [
        toAddress,
        /* more To-email addresses */
      ],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data: htmlBody,
        },
        Text: {
          Charset: "UTF-8",
          Data: textBody,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
      /* more items */
    ],
  });
};

const run = async (senderName,receiverName) => {
  const sendEmailCommand = createSendEmailCommand(
    "suraj.codes017@gmail.com",
    "suraj@devlinks.in",
    senderName,
    receiverName
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      /** @type { import('@aws-sdk/client-ses').MessageRejected} */
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

// snippet-end:[ses.JavaScript.email.sendEmailV3]
module.exports = { run };

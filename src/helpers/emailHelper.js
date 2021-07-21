const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "augustine.conroy42@ethereal.email",
    pass: "8UYdemZuv5rvg6tWNC",
  },
});

const sentEmail = (info) => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await transporter.sendMail(info);
      console.log("Message sent: %s", result.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(result));
      resolve(result);
    } catch (e) {
      console.log(e);
    }
  });
};

const emailProcessor = (email, pin) => {
  const info = {
    from: '"CRM Ticketing System" <augustine.conroy42@ethereal.email>',
    to: email,
    subject: "Password Reset ✔",
    text: `Here is your password reset PIN: ${pin}`,
    html: `<b>Hello,</b>
    Here is your password reset PIN: <b>${pin}</b>
    `,
  };

  sentEmail(info);
};

module.exports = {
  emailProcessor,
};

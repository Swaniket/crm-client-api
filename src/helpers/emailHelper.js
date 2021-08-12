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

const emailProcessor = ({ email, pin, type, verificationLink = "" }) => {
  let info = "";
  switch (type) {
    case "request-new-password":
      info = {
        from: '"CRM Ticketing System" <augustine.conroy42@ethereal.email>',
        to: email,
        subject: "Password Reset ✔",
        text: `Here is your password reset PIN: ${pin}. This PIN will expire in 1 Day`,
        html: `<b>Hello,</b>
        Here is your password reset PIN: <b>${pin}</b>. This PIN will expire in 1 Day
        `,
      };

      sentEmail(info);
      break;

    case "password-update-success":
      info = {
        from: '"CRM Ticketing System" <augustine.conroy42@ethereal.email>',
        to: email,
        subject: "Password Successfully Changed ✔",
        text: "Hello, Your password has been updated.",
        html: `<b>Hello,</b>
        Your password has been updated.
        `,
      };

      sentEmail(info);
      break;

    case "new-user-confirmation":
      info = {
        from: '"CRM Ticketing System" <augustine.conroy42@ethereal.email>',
        to: email,
        subject: "Verify your Account ✔",
        text: "Please follow the link to verify your account before you can login",
        html: `<b>Hello,</b>
          Please follow the link to verify your account before you can login
          <p>${verificationLink}</p>
          `,
      };

      sentEmail(info);
      break;

    default:
      break;
  }
};

module.exports = {
  emailProcessor,
};

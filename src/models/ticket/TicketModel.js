const { TicketSchema } = require("./TicketSchema");

const insertTicket = (ticketObj) => {
  return new Promise((resolve, reject) => {
    try {
      TicketSchema(ticketObj)
        .save()
        .then((data) => resolve(data))
        .catch((error) => reject(error));
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  insertTicket,
};

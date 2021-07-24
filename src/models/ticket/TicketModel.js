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

const getTickets = (clientId) => {
  return new Promise((resolve, reject) => {
    try {
      TicketSchema.find({ clientId })
        .then((data) => resolve(data))
        .catch((error) => reject(error));
    } catch (e) {
      reject(e);
    }
  });
};

const getTicketById = (_id, clientId) => {
  return new Promise((resolve, reject) => {
    try {
      TicketSchema.findOne({ _id, clientId })
        .then((data) => resolve(data))
        .catch((error) => reject(error));
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  insertTicket,
  getTickets,
  getTicketById,
};

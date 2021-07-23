const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
  },

  subject: {
    type: String,
    required: true,
    default: "",
    maxlegth: 200,
  },

  openAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },

  status: {
    type: String,
    required: true,
    default: "Pending Operator Response",
    maxlegth: 30,
  },

  conversation: [
    {
      sender: {
        type: String,
        required: true,
        default: "",
        maxlegth: 50,
      },
      message: {
        type: String,
        required: true,
        default: "",
        maxlegth: 1000,
      },
      msgAt: {
        type: Date,
        required: true,
        default: Date.now(),
      },
    },
  ],
});

module.exports = {
  TicketSchema: mongoose.model("Ticket", TicketSchema),
};

const express = require("express");
const { insertTicket } = require("../models/ticket/TicketModel");
const router = express.Router();

// Create a new ticket
router.post("/", async (req, res) => {
  try {
    const { subject, sender, message } = req.body;

    ticketObj = {
      clientId: "60f00d020c6fef27547b9cf5",
      subject,
      conversation: [
        {
          sender,
          message,
        },
      ],
    };

    const result = await insertTicket(ticketObj);
    if (result._id) {
      return res.send({
        status: "success",
        message: "Your ticket has been created!",
      });
    }

    res.send({
      status: "error",
      message:
        "Unable to create ticket at this moment, please try again later.",
    });
  } catch (e) {
    res.send({
      status: "error",
      message: e.message,
    });
  }
});

module.exports = router;

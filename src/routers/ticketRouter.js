const express = require("express");
const { insertTicket, getTickets, getTicketById } = require("../models/ticket/TicketModel");
const { userAuth } = require("../middlewares/auth");
const router = express.Router();

// Create a new ticket
router.post("/", userAuth, async (req, res) => {
  try {
    const { subject, sender, message } = req.body;

    const clientId = req.userId;

    ticketObj = {
      clientId,
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

// Get all tickets for a specific user
router.get("/", userAuth, async (req, res) => {
  try {
    const clientId = req.userId;

    const result = await getTickets(clientId);

    return res.send({
      status: "success",
      result,
    });
  } catch (e) {
    res.send({
      status: "error",
      message: e.message,
    });
  }
});

// Get a ticket details by ticketId
router.get("/:_id", userAuth, async (req, res) => {
  try {
    const {_id} = req.params
    const clientId = req.userId;
    const result = await getTicketById(_id, clientId);

    return res.send({
      status: "success",
      result,
    });
  } catch (e) {
    res.send({
      status: "error",
      message: e.message,
    });
  }
});

module.exports = router;

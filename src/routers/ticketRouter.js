const express = require("express");
const {
  insertTicket,
  getTickets,
  getTicketById,
  updateClientReply,
  closeTicket,
  deleteTicket,
} = require("../models/ticket/TicketModel");
const { userAuth } = require("../middlewares/auth");
const {
  createNewTicketValidation,
  replyMessageValidation,
} = require("../middlewares/validation");
const router = express.Router();

// Create a new ticket
router.post("/", createNewTicketValidation, userAuth, async (req, res) => {
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
    const { _id } = req.params;
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

// Reply message update
router.put("/:_id", replyMessageValidation, userAuth, async (req, res) => {
  try {
    const { message, sender } = req.body;
    const { _id } = req.params;
    const clientId = req.userId;
    const result = await updateClientReply({ _id, clientId, message, sender });

    if (result._id) {
      return res.send({
        status: "success",
        message: "Message Updated!",
      });
    }

    res.send({
      status: "error",
      message: "Unable to update your message, please try again later.",
    });
  } catch (e) {
    res.send({
      status: "error",
      message: e.message,
    });
  }
});

// Close Ticket
router.patch("/close-ticket/:_id", userAuth, async (req, res) => {
  try {
    const { _id } = req.params;
    const clientId = req.userId;

    const result = await closeTicket({ _id, clientId });

    if (result._id) {
      return res.send({
        status: "success",
        message: "Ticket Closed!",
      });
    }

    res.send({
      status: "error",
      message: "Unable to update your message, please try again later.",
    });
  } catch (e) {
    res.send({
      status: "error",
      message: e.message,
    });
  }
});

// Delete Ticket
router.delete("/:_id", userAuth, async (req, res) => {
  try {
    const { _id } = req.params;
    const clientId = req.userId;

    await deleteTicket({ _id, clientId });

    return res.send({
      status: "success",
      message: "Ticket has been deleted!",
    });
  } catch (e) {
    res.send({
      status: "error",
      message: e.message,
    });
  }
});

module.exports = router;

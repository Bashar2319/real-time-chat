import Meeting from "../models/Meeting.js";
import Message from "../models/Message.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const scheduleMeeting = async (req, res) => {
  try {
    const { participantId, scheduledAt } = req.body;
    const hostId = req.user._id;

    if (!participantId || !scheduledAt) {
      return res.status(400).json({ message: "Participant and scheduled time are required." });
    }

    if (hostId.equals(participantId)) {
      return res.status(400).json({ message: "Cannot schedule a meeting with yourself." });
    }

    const newMeeting = new Meeting({
      hostId,
      participantId,
      scheduledAt,
    });

    await newMeeting.save();

    // Populate user details before sending response to frontend
    await newMeeting.populate("hostId participantId", "-password");

    res.status(201).json(newMeeting);
  } catch (error) {
    console.error("Error in scheduleMeeting controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMeetings = async (req, res) => {
  try {
    const userId = req.user._id;

    const meetings = await Meeting.find({
      $or: [{ hostId: userId }, { participantId: userId }],
    })
      .populate("hostId participantId", "-password")
      .sort({ scheduledAt: 1 });

    res.status(200).json(meetings);
  } catch (error) {
    console.error("Error in getMeetings controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const startMeeting = async (req, res) => {
  try {
    const { id: meetingId } = req.params;
    const userId = req.user._id;

    const meeting = await Meeting.findById(meetingId);

    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    if (!meeting.hostId.equals(userId) && !meeting.participantId.equals(userId)) {
      return res.status(403).json({ message: "Unauthorized to start this meeting" });
    }
    
    if (meeting.status !== "scheduled") {
       return res.status(400).json({ message: "This meeting cannot be started as it is already " + meeting.status });
    }

    meeting.status = "ongoing";
    await meeting.save();
    
    const populatedMeeting = await Meeting.findById(meetingId).populate("hostId participantId", "-password");

    // notify the other user that the meeting started
    const otherUserId = meeting.hostId.equals(userId) ? meeting.participantId : meeting.hostId;
    const otherSocketId = getReceiverSocketId(otherUserId);
    
    if (otherSocketId) {
      io.to(otherSocketId).emit("meetingStarted", populatedMeeting);
    }
    // Also echo back to the user who started it in case they have multiple tabs open
    const mySocketId = getReceiverSocketId(userId);
    if(mySocketId) {
        io.to(mySocketId).emit("meetingStarted", populatedMeeting);
    }

    res.status(200).json(populatedMeeting);
  } catch (error) {
    console.error("Error in startMeeting controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const endMeeting = async (req, res) => {
  try {
    const { id: meetingId } = req.params;
    const userId = req.user._id;

    const meeting = await Meeting.findById(meetingId);

    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    if (!meeting.hostId.equals(userId) && !meeting.participantId.equals(userId)) {
      return res.status(403).json({ message: "Unauthorized to end this meeting" });
    }

    if (meeting.status === "ended") {
      return res.status(400).json({ message: "Meeting is already ended" });
    }

    // 1. Mark status as ended
    meeting.status = "ended";
    await meeting.save();

    // 2. Erase messages tagged with this meetingId
    await Message.deleteMany({ meetingId: meeting._id });
    
    const populatedMeeting = await Meeting.findById(meetingId).populate("hostId participantId", "-password");

    // 3. Notify participants
    const otherUserId = meeting.hostId.equals(userId) ? meeting.participantId : meeting.hostId;
    const otherSocketId = getReceiverSocketId(otherUserId);
    
    if (otherSocketId) {
      io.to(otherSocketId).emit("meetingEnded", populatedMeeting);
    }
    
    const mySocketId = getReceiverSocketId(userId);
    if (mySocketId) {
       io.to(mySocketId).emit("meetingEnded", populatedMeeting);
    }

    res.status(200).json({ message: "Meeting ended and ephemeral messages deleted", meeting: populatedMeeting });
  } catch (error) {
    console.error("Error in endMeeting controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

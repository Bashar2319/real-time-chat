import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";
import { useChatStore } from "./useChatStore";

export const useMeetingStore = create((set, get) => ({
  meetings: [],
  meetingMessages: [],
  activeMeeting: null, // the currently joined/ongoing meeting
  isMeetingsLoading: false,
  isMeetingMessagesLoading: false,

  setActiveMeeting: (meeting) => set({ activeMeeting: meeting }),

  getMeetings: async () => {
    set({ isMeetingsLoading: true });
    try {
      const res = await axiosInstance.get("/meetings");
      set({ meetings: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch meetings");
    } finally {
      set({ isMeetingsLoading: false });
    }
  },

  scheduleMeeting: async (participantId, scheduledAt) => {
    try {
      const res = await axiosInstance.post("/meetings", { participantId, scheduledAt });
      set((state) => ({ meetings: [...state.meetings, res.data] }));
      toast.success("Meeting scheduled successfully");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to schedule meeting");
      return false;
    }
  },

  startMeeting: async (meetingId) => {
    try {
      const res = await axiosInstance.post(`/meetings/${meetingId}/start`);
      
      // Update the local list
      set((state) => ({
        meetings: state.meetings.map(m => m._id === meetingId ? res.data : m),
        activeMeeting: res.data,
      }));
      
      return true;
    } catch (error) {
       toast.error(error.response?.data?.message || "Failed to start meeting");
       return false;
    }
  },

  endMeeting: async (meetingId) => {
     try {
       const res = await axiosInstance.post(`/meetings/${meetingId}/end`);
       
       set((state) => ({
         meetings: state.meetings.map(m => m._id === meetingId ? res.data.meeting : m),
         activeMeeting: null,
         meetingMessages: []
       }));

       // also clear the active chat tab in general chat store if needed
       useChatStore.getState().setActiveTab("chats");
       
       toast.success("Meeting ended and ephemeral messages deleted");
       return true;
     } catch(error) {
        toast.error(error.response?.data?.message || "Failed to end meeting");
        return false;
     }
  },

  getMeetingMessages: async (meetingId) => {
    set({ isMeetingMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/meeting/${meetingId}`);
      set({ meetingMessages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch meeting messages");
    } finally {
      set({ isMeetingMessagesLoading: false });
    }
  },

  sendMeetingMessage: async (meetingId, messageData) => {
    const { meetingMessages } = get();
    const { authUser } = useAuthStore.getState();
    const activeMeeting = get().activeMeeting;

    if (!activeMeeting) return;

    // determine receiver
    const receiverId = activeMeeting.hostId._id === authUser._id ? activeMeeting.participantId._id : activeMeeting.hostId._id;

    try {
      const res = await axiosInstance.post(`/messages/send/${receiverId}`, {
        ...messageData,
        meetingId
      });
      set({ meetingMessages: [...meetingMessages, res.data] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  subscribeToMeetingEvents: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("meetingStarted", (meeting) => {
      set((state) => ({
        meetings: state.meetings.map(m => m._id === meeting._id ? meeting : m)
      }));
      toast(`Meeting started by ${meeting.hostId.fullName}`, { icon: '📅' });
    });

    socket.on("meetingEnded", (meeting) => {
      set((state) => ({
        meetings: state.meetings.map(m => m._id === meeting._id ? meeting : m)
      }));
      
      const currentActive = get().activeMeeting;
      if (currentActive && currentActive._id === meeting._id) {
         set({ activeMeeting: null, meetingMessages: [] });
         toast("The meeting has been ended by the host. Messages deleted.");
         useChatStore.getState().setActiveTab("chats");
      }
    });

    socket.on("newMessage", (newMessage) => {
      const { activeMeeting, meetingMessages } = get();
      
      // If it's a meeting message and we are in that meeting
      if (newMessage.meetingId && activeMeeting && activeMeeting._id === newMessage.meetingId) {
         set({ meetingMessages: [...meetingMessages, newMessage] });
         const isSoundEnabled = useChatStore.getState().isSoundEnabled;
         if (isSoundEnabled) {
           const notificationSound = new Audio("/sounds/notification.mp3");
           notificationSound.currentTime = 0;
           notificationSound.play().catch((e) => console.log("Audio play failed:", e));
         }
      }
    });
  },

  unsubscribeFromMeetingEvents: () => {
    const socket = useAuthStore.getState().socket;
    if(!socket) return;
    socket.off("meetingStarted");
    socket.off("meetingEnded");
    // Note: newMessage is handled globally by ChatStore as well, we only listen to it here for meetings
  }
}));

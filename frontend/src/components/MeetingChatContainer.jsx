import { useEffect, useRef } from "react";
import { useMeetingStore } from "../store/useMeetingStore";
import { useAuthStore } from "../store/useAuthStore";
import { StopCircleIcon, ShieldCheckIcon } from "lucide-react";
import MessageInput from "./MessageInput";

const MeetingChatContainer = () => {
  const { activeMeeting, meetingMessages, getMeetingMessages, endMeeting } = useMeetingStore();
  const { authUser } = useAuthStore();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (activeMeeting) {
      getMeetingMessages(activeMeeting._id);
    }
  }, [activeMeeting, getMeetingMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [meetingMessages]);

  if (!activeMeeting) return null;

  const isHost = activeMeeting.hostId._id === authUser._id;
  const otherParticipant = isHost ? activeMeeting.participantId : activeMeeting.hostId;

  return (
    <div className="flex-1 flex flex-col overflow-hidden h-full relative z-10">
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50 bg-slate-800/80 backdrop-blur-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden">
                {otherParticipant.profilePic ? (
                    <img src={otherParticipant.profilePic} alt={otherParticipant.fullName} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">
                        {otherParticipant.fullName.charAt(0)}
                    </div>
                )}
            </div>
            <div>
              <h3 className="font-bold text-slate-100 flex items-center gap-2">
                 {otherParticipant.fullName}
                 <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded font-black uppercase">Ephemeral</span>
              </h3>
              <p className="text-xs text-slate-400">Meeting in progress</p>
            </div>
        </div>
        
        <button 
          onClick={() => endMeeting(activeMeeting._id)}
          className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-red-500/20"
        >
          <StopCircleIcon className="w-4 h-4" />
          End Meeting
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        <div className="flex items-center justify-center mb-8">
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 max-w-sm text-center">
                <ShieldCheckIcon className="w-8 h-8 mx-auto text-cyan-400 mb-2" />
                <h4 className="text-sm font-medium text-slate-200">Secure Ephemeral Meeting</h4>
                <p className="text-xs text-slate-400 mt-1">All messages in this chat will be permanently deleted once the meeting is ended.</p>
            </div>
        </div>

        {meetingMessages.map((msg) => (
          <div
            key={msg._id}
            className={`flex flex-col ${
              msg.senderId === authUser._id ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`max-w-[75%] rounded-2xl p-3 shadow-md ${
                msg.senderId === authUser._id
                  ? "bg-cyan-500 text-white rounded-br-none"
                  : "bg-slate-700 text-slate-100 rounded-bl-none"
              }`}
            >
              {msg.image && (
                <img
                  src={msg.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2 object-cover"
                />
              )}
              {msg.text && <p className="text-sm">{msg.text}</p>}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 px-1">
               {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-700/50 bg-slate-800/80 backdrop-blur-sm">
        <MessageInput 
           CustomSubmitFn={(data) => useMeetingStore.getState().sendMeetingMessage(activeMeeting._id, data)}
        />
      </div>
    </div>
  );
};

export default MeetingChatContainer;

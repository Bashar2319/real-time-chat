import { useState, useEffect } from "react";
import { useMeetingStore } from "../store/useMeetingStore";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { UsersIcon, CalendarIcon, LoaderIcon } from "lucide-react";
import ScheduleMeetingModal from "./ScheduleMeetingModal";
import toast from "react-hot-toast";

const MeetingsList = () => {
    const { meetings, getMeetings, isMeetingsLoading, startMeeting } = useMeetingStore();
    const { authUser } = useAuthStore();
    const { allContacts, getAllContacts } = useChatStore();
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    useEffect(() => {
        getMeetings();
        getAllContacts(); // We need contacts to pick from when scheduling
    }, [getMeetings, getAllContacts]);

    if (isMeetingsLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <LoaderIcon className="w-8 h-8 animate-spin text-cyan-500" />
            </div>
        );
    }

    // sort meetings: ongoing first, then scheduled, hide ended
    const activeMeetings = meetings
        .filter(m => m.status !== "ended")
        .sort((a, b) => {
             if (a.status === "ongoing" && b.status !== "ongoing") return -1;
             if (b.status === "ongoing" && a.status !== "ongoing") return 1;
             return new Date(a.scheduledAt) - new Date(b.scheduledAt);
        });

    const handleStartOrJoin = async (meeting) => {
        if (meeting.status === "ongoing") {
            useMeetingStore.getState().setActiveMeeting(meeting);
        } else if (meeting.status === "scheduled") {
            // anyone can start for simplicity
            await startMeeting(meeting._id);
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-slate-200 flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-cyan-400" />
                    Meetings
                </h3>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded hover:bg-cyan-500/20 transition-colors text-sm"
                >
                  + New
                </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pb-4">
                {activeMeetings.length === 0 ? (
                    <div className="text-center text-slate-500 mt-10 text-sm">
                        No active or scheduled meetings.
                    </div>
                ) : (
                    activeMeetings.map((meeting) => {
                        const isHost = meeting.hostId._id === authUser._id;
                        const otherUser = isHost ? meeting.participantId : meeting.hostId;
                        const dateObj = new Date(meeting.scheduledAt);

                        return (
                            <div 
                              key={meeting._id}
                              className={`p-3 rounded-lg border flex flex-col gap-2 transition-colors ${
                                  meeting.status === "ongoing" 
                                    ? "bg-cyan-500/10 border-cyan-500/50" 
                                    : "bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60"
                              }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                                        {otherUser.profilePic ? (
                                            <img src={otherUser.profilePic} alt={otherUser.fullName} className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            <UsersIcon className="w-5 h-5 text-slate-400" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-slate-200 font-medium truncate">{otherUser.fullName}</p>
                                        <p className="text-xs text-slate-400">
                                            {dateObj.toLocaleDateString()} at {dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-1">
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                                        meeting.status === "ongoing" ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"
                                    }`}>
                                        {meeting.status}
                                    </span>
                                    <button 
                                      onClick={() => handleStartOrJoin(meeting)}
                                      className={`text-xs font-medium px-3 py-1 rounded transition-colors ${
                                        meeting.status === "ongoing"
                                         ? "bg-cyan-500 text-white hover:bg-cyan-600"
                                         : "bg-slate-700 text-slate-200 hover:bg-slate-600"
                                      }`}
                                    >
                                        {meeting.status === "ongoing" ? "Join" : "Start"}
                                    </button>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>

            {isModalOpen && (
                <ScheduleMeetingModal 
                  onClose={() => setIsModalOpen(false)} 
                  contacts={allContacts} 
                />
            )}
        </div>
    );
};

export default MeetingsList;

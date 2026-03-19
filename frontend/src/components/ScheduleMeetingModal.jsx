import { useState } from "react";
import { useMeetingStore } from "../store/useMeetingStore";
import { XIcon } from "lucide-react";

const ScheduleMeetingModal = ({ onClose, contacts }) => {
    const { scheduleMeeting } = useMeetingStore();
    
    // Default to tomorrow, 9 AM
    const tmr = new Date();
    tmr.setDate(tmr.getDate() + 1);
    tmr.setHours(9, 0, 0, 0);
    
    // format for datetime-local input YYYY-MM-DDTHH:mm
    const dateStr = tmr.toISOString().slice(0,16);

    const [participantId, setParticipantId] = useState("");
    const [scheduledAt, setScheduledAt] = useState(dateStr);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const success = await scheduleMeeting(participantId, new Date(scheduledAt).toISOString());
        setIsSubmitting(false);
        if (success) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-slate-800">
                    <h2 className="text-lg font-bold text-slate-100">Schedule Meeting</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Select Contact</label>
                        <select 
                          required
                          value={participantId}
                          onChange={(e) => setParticipantId(e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                        >
                            <option value="" disabled>Choose a person...</option>
                            {contacts.map((c) => (
                                <option key={c._id} value={c._id}>{c.fullName} ({c.email})</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Date & Time</label>
                        <input 
                          type="datetime-local" 
                          required
                          value={scheduledAt}
                          onChange={(e) => setScheduledAt(e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                          style={{ colorScheme: 'dark' }}
                        />
                    </div>
                    
                    <div className="pt-2">
                        <p className="text-xs text-slate-400 mb-4 flex items-start gap-2">
                            <span className="text-cyan-400 leading-none">ℹ</span>
                            Messages sent during this meeting will be ephemeral and automatically deleted once the meeting is ended.
                        </p>
                        <button 
                          type="submit" 
                          disabled={isSubmitting || !participantId}
                          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Scheduling..." : "Schedule Meeting"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ScheduleMeetingModal;

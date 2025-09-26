import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventClickArg, EventInput } from "@fullcalendar/core";
import { useState } from "react";
import { Calendar } from "lucide-react";
import { useEffect } from "react";

const getReminderTime = (value: string): number => {
  switch (value) {
    case "10m":
      return 10 * 60 * 1000;
    case "30m":
      return 30 * 60 * 1000;
    case "1h":
      return 60 * 60 * 1000;
    case "1d":
      return 24 * 60 * 60 * 1000;
    default:
      return 0;
  }
};

const triggerNotification = (eventTitle: string) => {
  if (Notification.permission === "granted") {
    new Notification("Event Reminder", {
      body: `Upcoming event: ${eventTitle}`,
      icon: "/favicon.ico",
    });
  }
};

const initialEvents: EventInput[] = [
  {
    id: "1",
    title: "Music Festival",
    start: "2025-09-10T10:00:00",
    end: "2025-09-10T18:00:00",
    description: "A full-day music festival.",
    backgroundColor: "#7c3aed",
    borderColor: "#7c3aed",
    textColor: "#fff",
  },
  {
    id: "2",
    title: "Tech Conference",
    start: "2025-09-15T09:00:00",
    end: "2025-09-15T17:00:00",
    description: "Tech talks and networking.",
    backgroundColor: "#7c3aed",
    borderColor: "#7c3aed",
    textColor: "#fff",
  },
];

const UserCalendar: React.FC = () => {
  const [events, setEvents] = useState<EventInput[]>(initialEvents);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "",
    description: "",
  });

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  const [reminder, setReminder] = useState<string>("none");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setReminder(e.target.value);
  };

  // Click an existing event
  const handleEventClick = (clickInfo: EventClickArg) => {
    setSelectedEventId(clickInfo.event.id);
    setSelectedDate(clickInfo.event.startStr);
    setNewEvent({
      title: clickInfo.event.title,
      start: clickInfo.event.startStr,
      end: clickInfo.event.endStr || clickInfo.event.startStr,
      description: clickInfo.event.extendedProps.description || "",
    });
  };

  // Delete event
  const handleDeleteEvent = () => {
    if (!selectedEventId) return;
    setEvents(events.filter((e) => e.id !== selectedEventId));
    setNewEvent({ title: "", start: "", end: "", description: "" });
    setSelectedEventId(null);
    setSelectedDate("");
  };

  return (
    <div>
      <h1 className="flex gap-2 font-bold text-2xl text-primary p-6">
        <Calendar size={30} />
        My Calendar
      </h1>
      <div className="flex flex-col md:flex-row flex-wrap gap-6 p-4 max-w-7xl mx-auto">
        {/* Calendar */}
        <div className="flex-1 w-full min-w-0 bg-white shadow rounded-md p-4 overflow-x-auto">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right:
                window.innerWidth < 768
                  ? ""
                  : "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            editable={true}
            selectable={true} 
            selectMirror={true}
            dayMaxEvents={true}
            events={events}
            eventClick={handleEventClick}
            height="auto"
            contentHeight="auto"
            aspectRatio={1.35}
            expandRows={true}
            handleWindowResize={true}
            // 👇 Add this
            select={(info) => {
              setSelectedEventId("new");
              setSelectedDate(info.startStr);
              setNewEvent({
                title: "",
                start: info.startStr,
                end: info.endStr || info.startStr,
                description: "",
              });
              // if (title) {
              //   const newEvent = {
              //     id: String(events.length + 1),
              //     title,
              //     start: info.startStr,
              //     end: info.endStr,
              //     backgroundColor: "#7c3aed",
              //     borderColor: "#7c3aed",
              //     textColor: "#fff",
              //   };
              //   setEvents((prev) => [...prev, newEvent]);
              // }
            }}
          />
        </div>

        {/* Sidebar Form */}
        {selectedEventId && (
          <div className="w-full md:w-1/3 bg-gray-50 p-6 rounded-md shadow-md md:sticky md:top-4 h-fit">
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Event Details
            </h2>

            <p className="mb-2 text-gray-700">
              <span className="font-semibold">Title:</span> {newEvent.title}
            </p>
            <p className="mb-2 text-gray-700">
              <span className="font-semibold">Date:</span> {selectedDate}
            </p>
            {newEvent.description && (
              <p className="mb-2 text-gray-700">
                <span className="font-semibold">Description:</span>
                {newEvent.description}
              </p>
            )}

            <div className="flex flex-col gap-5 mt-4">
              <div className="space-y-2">
                <label
                  htmlFor="reminder"
                  className="block text-sm font-medium text-purple-700"
                >
                  Reminder
                </label>
                <select
                  id="reminder"
                  name="reminder"
                  value={reminder}
                  onChange={handleChange}
                  className="w-full p-2 border-2 border-purple-200 bg-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                >
                  <option value="none">None</option>
                  <option value="10m">10 minutes before</option>
                  <option value="30m">30 minutes before</option>
                  <option value="1h">1 hour before</option>
                  <option value="1d">1 day before</option>
                </select>

                {reminder !== "none" && (
                  <button
                    onClick={() => {
                      const reminderMs = getReminderTime(reminder);
                      const eventTime = new Date(newEvent.start).getTime();
                      const now = Date.now();
                      const timeUntilReminder = eventTime - reminderMs - now;

                      if (timeUntilReminder > 0) {
                        setTimeout(() => {
                          triggerNotification(newEvent.title);
                        }, timeUntilReminder);

                        alert(
                          `Reminder set for ${reminder} before "${newEvent.title}"`
                        );
                      } else {
                        alert("Reminder time has already passed.");
                      }
                    }}
                    className="bg-secondary text-white p-2 rounded-md w-full"
                  >
                    Add Reminder
                  </button>
                )}
              </div>
              <button
                onClick={handleDeleteEvent}
                className="bg-red-600 text-white p-2 rounded-md"
              >
                Delete Event
              </button>
              <button
                onClick={() => {
                  setSelectedEventId(null);
                  setSelectedDate("");
                  setNewEvent({
                    title: "",
                    start: "",
                    end: "",
                    description: "",
                  });
                }}
                className="text-sm text-gray-500 hover:underline"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCalendar;

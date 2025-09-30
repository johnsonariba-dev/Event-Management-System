import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { DateSelectArg, EventClickArg, EventInput } from "@fullcalendar/core";

// Sample initial events
const initialEvents: EventInput[] = [
  {
    id: "1",
    title: "Music Festival",
    start: "2025-09-10T10:00:00",
    end: "2025-09-10T18:00:00",
    description: "A full-day music festival.",
    backgroundColor: "#47348A",
    borderColor: "#47348A",
    textColor: "#fff",
  },
  {
    id: "2",
    title: "Tech Conference",
    start: "2025-09-15T09:00:00",
    end: "2025-09-15T17:00:00",
    description: "Tech talks and networking.",
    backgroundColor: "#47348A",
    borderColor: "#47348A",
    textColor: "#fff",
  },
];

const CalendarWithSidebar: React.FC = () => {
  const [events, setEvents] = useState<EventInput[]>(initialEvents);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "",
    description: "",
  });

  // Select a date on calendar
  const handleDateClick = (selectInfo: DateSelectArg) => {
    setSelectedDate(selectInfo.startStr);
    setSelectedEventId(null);
    setNewEvent({
      ...newEvent,
      start: selectInfo.startStr,
      end: selectInfo.startStr,
      title: "",
      description: "",
    });
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


  const handleSaveEvent = () => {
    if (!newEvent.title || !newEvent.start) return;

    if (selectedEventId) {
      setEvents(
        events.map((e) =>
          e.id === selectedEventId
            ? {
                ...e,
                ...newEvent,
                backgroundColor: "#47348A",
                borderColor: "#47348A",
                textColor: "#fff",
              }
            : e
        )
      );
    } else {
      const id = String(events.length + 1);
      setEvents([
        ...events,
        {
          id,
          ...newEvent,
          backgroundColor: "#7c3aed",
          borderColor: "#7c3aed",
          textColor: "#fff",
        },
      ]);
    }

    setNewEvent({ title: "", start: "", end: "", description: "" });
    setSelectedEventId(null);
    setSelectedDate("");
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
    <div className="flex flex-col md:flex-row flex-wrap gap-6 p-4 max-w-7xl mx-auto">
      {/* Calendar */}
      <div className="flex-1 w-full min-w-0 bg-white shadow rounded-md p-4 overflow-x-auto">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: window.innerWidth < 768 ? "" : "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          events={events}
          select={handleDateClick}
          eventClick={handleEventClick}
          height="auto"
          contentHeight="auto"
          aspectRatio={1.35}
          expandRows={true}
          handleWindowResize={true}
        />
      </div>

      {/* Sidebar Form */}
      <div className="w-full md:w-1/3 bg-gray-50 p-6 rounded-md shadow-md md:sticky md:top-4 h-fit">
        <h2 className="text-2xl font-bold mb-4 text-primary">
          {selectedEventId ? "Edit Event" : "Add Event"}
        </h2>
        <p className="mb-3 text-gray-700">
          Selected Date:{" "}
          <span className="font-semibold text-primary">
            {selectedDate || "None"}
          </span>
        </p>

        <input
          type="text"
          placeholder="Event Title"
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          className="w-full p-3 mb-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
        />
        <input
          type="datetime-local"
          value={newEvent.start}
          onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
          className="w-full p-3 mb-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
        />
        <input
          type="datetime-local"
          value={newEvent.end}
          onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
          className="w-full p-3 mb-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
        />
        <textarea
          placeholder="Description (optional)"
          value={newEvent.description}
          onChange={(e) =>
            setNewEvent({ ...newEvent, description: e.target.value })
          }
          className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
        />

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleSaveEvent}
            className="flex-1 bg-primary text-white p-3 rounded-lg font-semibold hover:bg-secondary transition"
          >
            {selectedEventId ? "Update Event" : "Save Event"}
          </button>
          {selectedEventId && (
            <button
              onClick={handleDeleteEvent}
              className="flex-1 bg-red-700 text-white p-3 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarWithSidebar;

import React from 'react'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

interface Event {
  id: number;
  image_url?: string;
  title: string;
  desc: string;
  category: string;
  venue: string;
  date: string;
  time: string;
  ticket_price: number;
  organizer: string;
}



function Payment() {
  const {id} = useParams<{id:string}>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/event_fake/events/${id}`);
        if (!res.ok) throw new Error("Event not found");
        const data: Event = await res.json();
        setEvent(data);
      } catch (err) {
        console.error(err);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        Loading event...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        Event not found
      </div>
    );
  }

  return (
    <div>
      <div>
        
      </div>
    </div>
    
  )
}

export default Payment

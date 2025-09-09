import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { cities } from "./CityLilst";

function CityDetails() {
  const { id } = useParams<{ id: string }>();
  const [city, setCity] = useState<(typeof cities)[0] | null>(null);

  useEffect(() => {
    const foundCity = cities.find((c) => c.id === Number(id));
    setCity(foundCity || null);
  }, [id]);

  if (!city) return <div>City not found</div>;

  return (
    <div className="w-full flex flex-col items-center justify-center pb-10">
      <img
        src={city.image}
        alt={city.title}
        className="mt-20 w-full  relative"
      />
      <h1 className="text-4xl font-bold absolute left-4 bottom-50 text-secondary">{city.title}</h1>
      <p className="text-xl font-semibold">{city.country}</p>
      <p>{city.date}</p>
      <p>{city.venue}</p>
    </div>
  );
}

export default CityDetails;

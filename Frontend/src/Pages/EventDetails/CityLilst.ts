import images from "../../types/images";

type City = {
  id: number;
  title: string;
  image: string;
  country?: string;
  date: string;
  venue: string;
};

export const cities: City[] = [
  {
    id: 1,
    title: "Paris",
    image: images.paris,
    country: "France",
    date: "2023-10-12",
    venue: "Paris, France",
  },
  {
    id: 2,
    title: "New York",
    image: images.newyork,
    country: "USA",
    date: "2023-10-12",
    venue: "New York, USA",
  },
  {
    id: 3,
    title: "Tokyo",
    image: images.tokyo,
    country: "Japan",
    date: "2023-10-14",
    venue: "Tokyo, Japan",
  },
  {
    id: 4,
    title: "London",
    image: images.london,
    country: "UK",
    date: "2023-10-10",
    venue: "London, UK",
  },
  {
    id: 5,
    title: "Cameroon",
    image: images.cameroon,
    country: "Cameroon",
    date: "2023-10-10",
    venue: "Yaoundé, Cameroon",
  },
];
import images from "../../types/images";

type City = {
  id: number;
  name: string;
  image: string;
  region?: string;
  desc?: string;
};

export const cities: City[] = [
  {
    id: 1,
    name: "Douala",
    image: images.douala,
    region: "Littoral",
    desc: "The largest city and Cameroon’s economic hub. Home to the country’s biggest seaport and international airport. It’s a hotspot for business events, concerts, expos, and nightlife activities."
  },
  {
    id: 2,
    name: "Yaounde",
    image: images.yaounde,
    region: "Centre",
    desc: "Cameroon’s political capital and second-largest city. Known for government institutions, embassies, universities, and cultural sites like the National Museum. Events often include political summits, academic conferences, and cultural festivals.",
  },
  {
    id: 3,
    name: "Bamenda",
    image: images.bamenda,
    region: "North-West",
    desc: "A lively city in the highlands, known for its cool climate and strong cultural heritage of the Grassfields people. Common for cultural festivals, community events, and university activities."
  },
  {
    id: 4,
    name: "Bafoussam",
    image: images.bafoussam,
    region: "West",
    desc : "Cultural and commercial center of the Bamileke people. Known for traditional festivals, markets, and agro-business fairs. Events often highlight entrepreneurship and local culture."
  },
  {
    id: 5,
    name: "Buea",
    image: images.buea,
    region: "Littoral",
    desc: "The largest city and Cameroon’s economic hub. Home to the country’s biggest seaport and international airport. It’s a hotspot for business events, concerts, expos, and nightlife activities."
  },
  {
    id: 6,
    name: "Maroua",
    image: images.maroua,
    region: "Centre",
    desc: "Cameroon’s political capital and second-largest city. Known for government institutions, embassies, universities, and cultural sites like the National Museum. Events often include political summits, academic conferences, and cultural festivals.",
  },
  {
    id: 7,
    name: "Garoua",
    image: images.garoua,
    region: "North-West",
    desc: "A lively city in the highlands, known for its cool climate and strong cultural heritage of the Grassfields people. Common for cultural festivals, community events, and university activities."
  },
  {
    id: 8,
    name: "Bertoua",
    image: images.bertoua,
    region: "West",
    desc : "Cultural and commercial center of the Bamileke people. Known for traditional festivals, markets, and agro-business fairs. Events often highlight entrepreneurship and local culture."
  },
  {
    id: 9,
    name: "Ebolowa",
    image: images.ebolowa,
    region: "North-West",
    desc: "A lively city in the highlands, known for its cool climate and strong cultural heritage of the Grassfields people. Common for cultural festivals, community events, and university activities."
  },
  {
    id: 10,
    name: "Ngaoundere",
    image: images.ngaoundere,
    region: "West",
    desc : "Cultural and commercial center of the Bamileke people. Known for traditional festivals, markets, and agro-business fairs. Events often highlight entrepreneurship and local culture."
  },

];
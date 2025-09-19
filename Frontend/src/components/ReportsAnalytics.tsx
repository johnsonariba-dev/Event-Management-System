import {
  FaCalendarAlt,
  FaDollarSign,
  FaStar,
  FaProjectDiagram,
} from "react-icons/fa";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Pie, Line } from "react-chartjs-2";
import {
  FaChartColumn,
  FaChartLine,
  FaDownload,
  FaTicket,
  FaUser,
} from "react-icons/fa6";

const stats = [
  {
    title: "Events Created",
    value: "176",
    icon: <FaCalendarAlt size={30} />,
    change: "+12%",
    note: "from last month",
    changeColor: "text-green-500",
  },
  {
    title: "Tickets Sold",
    value: "20.5K",
    icon: <FaTicket size={30} />,
    change: "",
    note: "Requires your attention",
    changeColor: "text-red-500",
  },
  {
    title: "Total Revenue",
    value: "$240,000",
    icon: <FaDollarSign size={30} />,
    change: "+18%",
    note: "from last month",
    changeColor: "text-green-500",
  },
  {
    title: "Avg Rating",
    value: "4.7",
    icon: <FaStar size={30} />,
    change: "-0.1",
    note: "vs last month",
    changeColor: "text-red-500",
    highlight: "text-blue-600",
  },
];

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

const lineData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Events",
      data: [14, 18, 21, 27, 30, 28],
      borderColor: "#3b82f6",
      backgroundColor: "rgba(59, 130, 246, 0.2)",
      tension: 0.4,
      fill: true,
    },
  ],
};

const donutData = {
  labels: ["Music", "Technology", "Food & Drink", "Arts & Culture", "Sports"],
  datasets: [
    {
      data: [145, 23, 8, 250, 58],
      backgroundColor: [
        "#22c55e",
        "#f59e0b",
        "#ef4444",
        "#3c34e1ff",
        "#000000",
      ],
      borderWidth: 1,
    },
  ],
};

interface PopularRow {
  name: string;
  organization: string;
  tickets: number;
  revenue: number;
  events: number;
  rating: number;
}
interface Props {
  data: PopularRow[];
}

const samplePopular: PopularRow[] = [
  {
    name: "Appstech music festival",
    organization: "Appstech",
    tickets: 5000,
    revenue: 405550,
    events: 12,
    rating: 3.6,
  },
  {
    name: "Appstech music festival",
    organization: "Appstech",
    tickets: 5000,
    revenue: 405550,
    events: 12,
    rating: 3.6,
  },
  {
    name: "Appstech music festival",
    organization: "Appstech",
    tickets: 5000,
    revenue: 405550,
    events: 12,
    rating: 3.6,
  },
  {
    name: "Appstech music festival",
    organization: "Appstech",
    tickets: 5000,
    revenue: 405550,
    events: 12,
    rating: 3.6,
  },
  {
    name: "Appstech music festival",
    organization: "Appstech",
    tickets: 5000,
    revenue: 405550,
    events: 12,
    rating: 3.6,
  },
  {
    name: "Appstech music festival",
    organization: "Appstech",
    tickets: 5000,
    revenue: 405550,
    events: 12,
    rating: 3.6,
  },
];
export const ReportsAnalytics = () => {
  return (
    <div>
      <div className="space-y-5">
        <div className="flex justify-between">
          <div>
            <h1 className="font-bold text-2xl">Reports & Analytics</h1>
            <p className="font-light text-sm">
              Comprehensive insights into platform performance
            </p>
          </div>
          <div className="flex space-x-2">
            <select className="bg-transparent border border-secondary rounded-md h-8 px-2 items-center justify-center">
              <option>Last week</option>
              <option>Last Month</option>
              <option>Last Quarter</option>
              <option>Last Year</option>
            </select>
            <button className="p-2 h-8 bg-secondary rounded-md text-xs font-light text-white items-center flex gap-2">
              <FaDownload size={12} />
              Export Report
            </button>
          </div>
        </div>
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow border p-4 flex flex-col justify-between"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm">{stat.title}</h3>
                  <span className="text-gray-500 items-center justify-center">
                    {stat.icon}
                  </span>
                </div>

                {/* Main value */}
                <div className="mt-2">
                  <p
                    className={`text-2xl font-bold ${
                      stat.highlight ? stat.highlight : "text-black"
                    }`}
                  >
                    {stat.value}
                  </p>
                  {stat.change && (
                    <p className={`text-xs ${stat.changeColor}`}>
                      {stat.change}{" "}
                      <span className="text-gray-500">{stat.note}</span>
                    </p>
                  )}
                  {!stat.change && (
                    <p className="text-xs text-gray-500">{stat.note}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
            <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
              <div>
                <h2 className="font-semibold text-xl items-center flex gap-2">
                  <FaChartLine />
                  Revenue & Ticket Sales Trends
                </h2>
                <p className="font-light text-xs">
                  Monthly performance over the last 8 months
                </p>
              </div>

              {/* Fixed height container */}
              <div className="h-80">
                <Line
                  data={lineData}
                  options={{ maintainAspectRatio: false, responsive: true }}
                />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 h-[450px]">
              <div>
                <h2 className="font-semibold text-xl flex items-center gap-2">
                  <FaChartColumn />
                  Event Categories
                </h2>
                <p className="text-xs font-light">Distribution by event type</p>
              </div>
              <div className="w-full h-full flex-1 flex items-center justify-center">
                <Pie
                  data={donutData}
                  options={{
                    maintainAspectRatio: false,
                    responsive: true,
                    plugins: {
                      legend: {
                        position: "bottom",
                        labels: {
                          usePointStyle: true,
                          padding: 15,
                        },
                      },
                    },
                    layout: {
                      padding: {
                        bottom: 20,
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-6 shadow space-y-4">
              <div>
                <h2 className="font-semibold text-xl flex items-center gap-2">
                  <FaProjectDiagram />
                  Most Popular Events
                </h2>
                <p className="text-xs font-light">
                  Top performing events by ticket sales
                </p>
              </div>
              <div className="space-y-4">
                {samplePopular.map((popular, index) => (
                  <div
                    key={index}
                    className="border rounded-md p-4 flex flex-col gap-2 bg-white"
                  >
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm font-semibold">{popular.name}</p>
                        <p className="text-xs text-gray-600">
                          by {popular.organization}
                        </p>
                      </div>
                      <div className="">
                        <p className="text-sm font-semibold">
                          {popular.tickets} tickets
                        </p>
                        <p className="text-xs text-gray-600">
                          {popular.revenue} FCFA
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white shadow rounded-lg p-6 space-y-4">
              <div>
                <h2 className="font-bold text-xl flex items-center gap-2">
                  <FaUser />
                  Most Active Organizers
                </h2>
                <p className="font-light text-xs">
                  Top performers by events and revenue
                </p>
              </div>
              <div>
                {samplePopular.map((popular, index) => (
                  <div
                    key={index}
                    className="border rounded-md p-4 flex gap-4 bg-white justify-between gap-4"
                  >
                    <div className="text-sm font-semibold">
                      <p>{popular.organization}</p>
                      <div className="flex gap-2 text-gray-600 text-xs">
                        <p>{popular.events} events</p>
                        <p className="flex items-center gap-1 ">
                          <FaStar size={10} />
                          {popular.rating}
                        </p>
                      </div>
                    </div>
                    <p>{popular.revenue} FCFA </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

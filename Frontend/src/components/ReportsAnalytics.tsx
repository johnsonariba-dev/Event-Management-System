import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line, Pie } from "react-chartjs-2";
import {
  FaDollarSign,
  FaStar,
  FaChartColumn,
  FaChartLine,
  FaDownload,
  FaTicket,
  FaUser,
  FaCalendar,
} from "react-icons/fa6";
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
  type ChartData,
} from "chart.js";
import { FaProjectDiagram } from "react-icons/fa";

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

interface Stat {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  note?: string;
  changeColor?: string;
  highlight?: string;
}

interface PopularRow {
  id: number;
  name?: string;
  organization: string;
  tickets?: number;
  revenue?: number;
  events?: number;
  rating?: number;
}

export const ReportsAnalytics = () => {
  const [stats, setStats] = useState<Stat[]>([]);
  const [lineData, setLineData] = useState<ChartData<"line">>({
    labels: [],
    datasets: [],
  });
  const [donutData, setDonutData] = useState<ChartData<"pie">>({
    labels: [],
    datasets: [],
  });
  const [popularEvents, setPopularEvents] = useState<PopularRow[]>([]);
  const [topOrganizers, setTopOrganizers] = useState<PopularRow[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [statsRes, lineRes, pieRes, popularRes, topOrgRes] =
          await Promise.all([
            axios.get("http://localhost:8000/reports/stats"),
            axios.get("http://localhost:8000/reports/line"),
            axios.get("http://localhost:8000/reports/categories"),
            axios.get("http://localhost:8000/reports/popular-events"),
            axios.get("http://localhost:8000/reports/top-organizers"),
          ]);

        // Stats cards
        setStats([
          {
            title: "Events Created",
            value: statsRes.data.events_created,
            icon: <FaCalendar size={30} />,
            change: "+12%",
            note: "from last month",
            changeColor: "text-green-500",
          },
          {
            title: "Tickets Sold",
            value: statsRes.data.tickets_sold,
            icon: <FaTicket size={30} />,
            note: "Requires your attention",
            changeColor: "text-red-500",
          },
          {
            title: "Total Revenue",
            value: `$${Number(statsRes.data.total_revenue).toLocaleString()}`,
            icon: <FaDollarSign size={30} />,
            change: "+18%",
            note: "from last month",
            changeColor: "text-green-500",
          },
          {
            title: "Avg Rating",
            value: statsRes.data.avg_rating,
            icon: <FaStar size={30} />,
            change: "-0.1",
            note: "vs last month",
            changeColor: "text-red-500",
            highlight: "text-blue-600",
          },
        ]);

        // Line chart
        setLineData({
          labels: lineRes.data.labels,
          datasets: [
            {
              label: "Events",
              data: lineRes.data.events,
              borderColor: "#3b82f6",
              backgroundColor: "rgba(59, 130, 246, 0.2)",
              tension: 0.4,
              fill: true,
            },
          ],
        });

        // Pie chart
        setDonutData({
          labels: pieRes.data.labels,
          datasets: [
            {
              data: pieRes.data.data,
              backgroundColor: [
                "#22c55e",
                "#f59e0b",
                "#ef4444",
                "#3c34e1ff",
                "#000000",
                "#d11a8bff",
              ],
              borderWidth: 1,
            },
          ],
        });

        // Popular events
        setPopularEvents(popularRes.data);

        // Top organizers
        setTopOrganizers(topOrgRes.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []);
const downloadReport = () => {
  const link = document.createElement("a");
  link.href = "http://localhost:8000/export-pdf";
  link.download = "report.pdf"; // filename (optional, since backend already sets it)
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  return (
    <div className="space-y-5 p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
  {/* Left */}
  <div>
    <h1 className="font-bold text-2xl">Reports & Analytics</h1>
    <p className="font-light text-sm">
      Comprehensive insights into platform performance
    </p>
  </div>

  {/* Right */}
  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
    <select className="bg-transparent border border-secondary rounded-md h-8 px-2 w-full sm:w-auto">
      <option>Last week</option>
      <option>Last Month</option>
      <option>Last Quarter</option>
      <option>Last Year</option>
    </select>

    <button
      onClick={downloadReport}
      className="p-2 h-8 bg-secondary rounded-md text-xs font-light text-white flex items-center justify-center gap-2 w-full sm:w-auto"
    >
      <FaDownload size={12} /> Export Report
    </button>
  </div>
</div>


      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow border p-4 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm">{stat.title}</h3>
              <span className="text-gray-500">{stat.icon}</span>
            </div>
            <div className="mt-2">
              <p
                className={`text-2xl font-bold ${
                  stat.highlight ? stat.highlight : "text-black"
                }`}
              >
                {stat.value}
              </p>
              {stat.change ? (
                <p className={`text-xs ${stat.changeColor}`}>
                  {stat.change}{" "}
                  <span className="text-gray-500">{stat.note}</span>
                </p>
              ) : (
                <p className="text-xs text-gray-500">{stat.note}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        {/* Line Chart */}
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <h2 className="font-semibold text-xl flex items-center gap-2">
            <FaChartLine /> Revenue & Ticket Sales Trends
          </h2>
          <p className="text-xs font-light">
            Monthly performance over the last 12 months
          </p>
          <div className="h-80">
            {lineData.datasets.length > 0 && (
              <Line
                data={lineData}
                options={{ maintainAspectRatio: false, responsive: true }}
              />
            )}
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-lg shadow p-6 h-[450px]">
          <h2 className="font-semibold text-xl flex items-center gap-2">
            <FaChartColumn /> Event Categories
          </h2>
          <p className="text-xs font-light">Distribution by event type</p>
          <div className="w-full h-full flex items-center justify-center">
            {donutData.datasets.length > 0 && (
              <Pie
                data={donutData}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: { usePointStyle: true, padding: 15 },
                    },
                  },
                  layout: { padding: { bottom: 20 } },
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Popular Events & Top Organizers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Popular Events */}
        <div className="bg-white rounded-lg p-6 shadow space-y-4">
          <h2 className="font-semibold text-xl flex items-center gap-2">
            <FaProjectDiagram /> Most Popular Events
          </h2>
          <p className="text-xs font-light">
            Top performing events by ticket sales
          </p>
          {popularEvents.map((p) => (
            <div
              key={p.id}
              className="border rounded-md p-4 flex justify-between bg-white"
            >
              <div>
                <p className="text-sm font-semibold">{p.name}</p>
                <p className="text-xs text-gray-600">by {p.organization}</p>
              </div>
              <div>
                <p className="text-sm font-semibold">{p.tickets} tickets</p>
                <p className="text-xs text-gray-600">
                  {p.revenue?.toLocaleString()} FCFA
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Top Organizers */}
        <div className="bg-white shadow rounded-lg p-6 space-y-4">
          <h2 className="font-bold text-xl flex items-center gap-2">
            <FaUser /> Most Active Organizers
          </h2>
          <p className="font-light text-xs">
            Top performers by events and revenue
          </p>
          {topOrganizers.map((o) => (
            <div
              key={o.id}
              className="border rounded-md p-4 flex justify-between bg-white"
            >
              <div className="text-sm font-semibold">
                <p>{o.organization}</p>
                <div className="flex gap-2 text-gray-600 text-xs">
                  <p>{o.events} events</p>
                  <p className="flex items-center gap-1">
                    <FaStar size={10} /> {o.rating}
                  </p>
                </div>
              </div>
              <p>{o.revenue?.toLocaleString()} FCFA</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

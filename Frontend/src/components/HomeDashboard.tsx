import { useState, useEffect } from "react";
import {
  FaCalendar,
  FaCheckCircle,
  FaCalendarAlt,
  FaClock,
  FaDollarSign,
  FaUsers,
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
  Title,
  Filler,
} from "chart.js";
import { Pie, Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  Filler
);

interface ApprovalRow {
  title: string;
  username: string;
  status: "Pending" | "Approved" | "Rejected";
  date: number;
}

export const HomeDashboard = () => {
  const [stats, setStats] = useState([
    {
      title: "Total Events",
      value: 0,
      icon: <FaCalendarAlt />,
      change: "",
      note: "",
      changeColor: "",
    },
    {
      title: "Pending Approval",
      value: 0,
      icon: <FaClock />,
      change: "",
      note: "",
      changeColor: "",
    },
    {
      title: "Approved Events",
      value: 0,
      icon: <FaDollarSign />,
      change: "",
      note: "",
      changeColor: "",
    },
    {
      title: "Rejected Events",
      value: 0,
      icon: <FaUsers />,
      change: "",
      note: "",
      changeColor: "",
    },
  ]);

  const [approvals, setApprovals] = useState<ApprovalRow[]>([]);
  const [lineData, setLineData] = useState({
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Events",
        data: Array(12).fill(0),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  });

  const [donutData, setDonutData] = useState({
    labels: ["Approved", "Pending", "Rejected"],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ["#22c55e", "#f59e0b", "#ef4444"],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch general stats
        const res = await fetch("http://127.0.0.1:8000/events/stats");
        const data = await res.json();

        setStats([
          { ...stats[0], value: data.total, note: "All events" },
          {
            ...stats[1],
            value: data.pending,
            note: "Requires attention",
            changeColor: "text-red-500",
          },
          {
            ...stats[2],
            value: data.approved,
            note: "Approved events",
            changeColor: "text-green-500",
          },
          {
            ...stats[3],
            value: data.rejected,
            note: "Rejected events",
            changeColor: "text-gray-500",
          },
        ]);

        // Fetch monthly line chart data
        const lineRes = await fetch("http://127.0.0.1:8000/line-data");
        const lineDataJson = await lineRes.json();

        setLineData({
          labels: lineDataJson.labels,
          datasets: [
            {
              label: "Events",
              data: lineDataJson.data,
              borderColor: "#3b82f6",
              backgroundColor: "rgba(59, 130, 246, 0.2)",
              tension: 0.4,
              fill: true,
            },
          ],
        });

        // Update donut chart
        setDonutData({
          ...donutData,
          datasets: [
            {
              ...donutData.datasets[0],
              data: [data.approved, data.pending, data.rejected],
            },
          ],
        });

        // Fetch pending approvals
        const approvalsRes = await fetch(
          "http://127.0.0.1:8000/events/pending"
        );
        const approvalsData = await approvalsRes.json();
        setApprovals(approvalsData);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Dashboard header */}
      <div className="space-y-3">
        <div className="flex justify-between pl-5">
          <div>
            <h1 className="font-bold text-2xl">Dashboard Overview</h1>
            <p className="font-light text-sm">
              Welcome back! Here's what's happening with your events
            </p>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow border p-4 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm">{stat.title}</h3>
                <span className="text-gray-500">{stat.icon}</span>
              </div>
              <div className="mt-2">
                <p
                  className={`text-2xl font-bold ${
                    stat.changeColor || "text-black"
                  }`}
                >
                  {stat.value}
                </p>
                <p
                  className={`text-xs ${
                    stat.change ? stat.changeColor : "text-gray-500"
                  }`}
                >
                  {stat.note}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <h2 className="font-semibold text-xl">Events & Revenue trends</h2>
          <p className="font-light text-xs">Monthly performance overview</p>
          <div className="h-80">
            <Line
              data={lineData}
              options={{ maintainAspectRatio: false, responsive: true }}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 h-[450px]">
          <h2 className="font-semibold text-xl">Event Status</h2>
          <p className="text-xs font-light">Current event approval status</p>
          <div className="w-full h-full flex-1 flex items-center justify-center">
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
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="rounded-lg shadow bg-white p-6">
        <h1 className="items-center flex font-bold text-xl gap-3">
          <FaCheckCircle /> Recent Activities
        </h1>
        <p>Latest events requiring your attention</p>
        <div className="space-y-4">
          {approvals.map((approval, index) => (
            <div
              key={index}
              className="border rounded-md p-4 flex flex-col gap-2 bg-white"
            >
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">{approval.title}</p>
                  <p className="text-sm text-gray-600">
                    by {approval.username}
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <p className="text-sm">
                    <span className="font-medium">{approval.status}</span>
                  </p>
                  <p className="text-xs text-gray-500">{approval.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

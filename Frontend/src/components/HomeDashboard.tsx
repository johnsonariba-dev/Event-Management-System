import { FaCalendar, FaCheckCircle, FaCalendarAlt, FaClock, FaDollarSign, FaUsers  } from "react-icons/fa";
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
import {  Pie, Line } from "react-chartjs-2";


const stats = [
  {
    title: "Total Events",
    value: "176",
    icon: <FaCalendarAlt />,
    change: "+12%",
    note: "from last month",
    changeColor: "text-green-500",
  },
  {
    title: "Pending Approval",
    value: "23",
    icon: <FaClock />,
    change: "",
    note: "Requires your attention",
    changeColor: "text-red-500",
  },
  {
    title: "Total Revenue",
    value: "$240,000",
    icon: <FaDollarSign />,
    change: "+18%",
    note: "from last month",
    changeColor: "text-green-500",
  },
  {
    title: "Active Users",
    value: "1,248",
    icon: <FaUsers />,
    change: "+8%",
    note: "from last month",
    changeColor: "text-green-500",
    highlight: "text-blue-600", // chiffre en bleu
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
  Title,
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
  labels: ["Approved", "Pending", "Rejected"],
  datasets: [
    {
      data: [145, 23, 8],
      backgroundColor: ["#22c55e", "#f59e0b", "#ef4444"],
      borderWidth: 1,
    },
  ],
};

interface ApprovalRow {
  name: string;
  organization: string;
  status: "Pending" | "Approved" | "Rejected";
  time: number;
}
interface Props {
  data: ApprovalRow[];
}

const sampleApprovals: ApprovalRow[] = [
  {
    name: "Appstech music festival",
    organization: "Appstech",
    status: "Approved",
    time: 2,
  },
  {
    name: "Appstech music festival",
    organization: "Appstech",
    status: "Approved",
    time: 2,
  },
  {
    name: "Appstech music festival",
    organization: "Appstech",
    status: "Approved",
    time: 2,
  },
  {
    name: "Appstech music festival",
    organization: "Appstech",
    status: "Approved",
    time: 2,
  },
  {
    name: "Appstech music festival",
    organization: "Appstech",
    status: "Approved",
    time: 2,
  },
  {
    name: "Appstech music festival",
    organization: "Appstech",
    status: "Approved",
    time: 2,
  },
];
export const HomeDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex justify-between">
          <div>
            <h1 className="font-bold text-2xl">Dashboard Overview</h1>
            <p className="font-light text-sm">
              Welcome back! Here's what's happening with your events
            </p>
          </div>
          <button className="bg-secondary p-2 h-8 rounded-md text-xs font-light text-white items-center flex gap-2">
            <FaCalendar size={12} />
            New Event Review
          </button>
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
              <span className="text-gray-500">{stat.icon}</span>
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
        </div>
        <div className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
            <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
              <div>
                <h2 className="font-semibold text-xl">
                  Events & Revenue trends
                </h2>
                <p className="font-light text-xs">
                  Monthly performance overview
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
                <h2 className="font-semibold text-xl">Event Status</h2>
                <p className="text-xs font-light">
                  Current event approval status
                </p>
              </div>
              <div className="w-full h-full flex-1 flex items-center justify-center">
                <Pie
                  data={donutData} // same dataset works
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
                        bottom: 20, // espace pour que la légende reste dans le cadre
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-lg shadow bg-white p-6">
          <h1 className="items-center flex font-bold text-xl gap-3">
            <FaCheckCircle /> Recent Activities
          </h1>
          <p>Latest events requiring your attention</p>

          <div className="space-y-4">
            {sampleApprovals.map((approval, index) => (
              <div
                key={index}
                className="border rounded-md p-4 flex flex-col gap-2 bg-white"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold">{approval.name}</p>
                    <p className="text-sm text-gray-600">
                      by {approval.organization}
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">{approval.status}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">
                        {approval.time} hours ago
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
  );
};

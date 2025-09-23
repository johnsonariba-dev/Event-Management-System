import React, { useState, useEffect } from "react";
import { FaEdit, FaUser } from "react-icons/fa";
import DashEditUser from "./DashEditUser";
import DeleteUser from "./DeleteUser";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="w-full sm:w-auto">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder || "Search organizers..."}
        className="border rounded-3xl h-8 p-2 text-xs w-full sm:w-64"
      />
    </form>
  );
};

interface Organizer {
  id: number;
  username: string;
  email: string;
  events: number;
  date_event: string;
  revenu: number;
  is_active?: boolean;
}

interface User {
  id: number;
  username: string;
  email: string;
  role: "user" | "organizer" | "admin";
}

interface Totals {
  total_users: number;
  active_count: number;
  inactive_count: number;
}

export default function OrganizerManagement() {
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [totals, setTotals] = useState<Totals>({
    total_users: 0,
    active_count: 0,
    inactive_count: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchOrganizers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      const totalRes = await fetch("http://localhost:8000/organizer/connected_count");
      const totalData = await totalRes.json();
      setTotals(totalData);

      const response = await fetch("http://127.0.0.1:8000/admin/organizers", {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
      const data: Organizer[] = await response.json();

      const organizerWithStatus = await Promise.all(
        data.map(async (org) => {
          const statusRes = await fetch(`http://localhost:8000/user/${org.id}/status`);
          const statusData = await statusRes.json();
          return { ...org, is_active: statusData.active };
        })
      );

      setOrganizers(organizerWithStatus);
    } catch (err) {
      setError("Erreur lors du chargement des organisateurs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizers();
  }, []);

  const handleUserUpdate = (updatedUser: User) => {
    setOrganizers((prev) =>
      prev.map((org) =>
        org.id === updatedUser.id
          ? { ...org, username: updatedUser.username, email: updatedUser.email, role: updatedUser.role }
          : org
      )
    );
  };

  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="space-y-4 p-2 md:p-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Organizer Management</h1>
        <p className="font-light text-sm">
          Manage event organizers and their permissions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-lg shadow p-4">
        <div className="border rounded-lg p-4 text-center">Active Organizers: {totals.active_count}</div>
        <div className="border rounded-lg p-4 text-center">Inactive Organizers: {totals.inactive_count}</div>
        <div className="border rounded-lg p-4 text-center">Total Organizers: {totals.total_users}</div>
      </div>

      {/* Organizer Table */}
      <div className="shadow rounded-lg p-4 space-y-4 overflow-x-auto">
        <div className="flex justify-between items-start md:items-center gap-2">
          <div>
            <h2 className="font-bold text-xl flex items-center gap-2"><FaUser /> Organizers List</h2>
            <p className="text-xs font-light">
              Manage organizers accounts and verification status
            </p>
          </div>

          <div className="flex items-start sm:items-center gap-2">
            <SearchBar onSearch={(query) => console.log("searching for:", query)} />
            <select className="border rounded-3xl text-xs p-2 w-full sm:w-auto">
              <option>All Status</option>
              <option>Verified</option>
              <option>Pending</option>
              <option>Suspended</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 p-6">Loading...</p>
        ) : (
          <table className="w-full min-w-[700px] border border-gray-400 rounded text-xs md:text-sm">
            <thead className="bg-gray-100">
              <tr className="text-left font-medium">
                <th className="px-4 py-2">Organizer's name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Performance</th>
                <th className="px-4 py-2">Revenue</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {organizers.map((user) => (
                <tr key={user.id} className="border-t border-gray-300">
                  <td className="px-4 py-2">
                    {user.username} <br />
                    <div className="text-xs font-light">ID: {user.id}</div>
                  </td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">
                    {user.events} events <br /> Last {user.date_event}
                  </td>
                  <td className="px-4 py-2">${user.revenu}</td>
                  <td className="px-4 py-2">
                    <span className={user.is_active ? "text-green-500" : "text-red-500"}>
                      {user.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => setSelectedUser({ id: user.id, username: user.username, email: user.email, role: "organizer" })}
                      className="text-xs px-2 py-1 rounded bg-yellow-200 hover:bg-yellow-300 transition-colors"
                    >
                      <FaEdit />
                    </button>
                    <DeleteUser
                      user={{ id: user.id, username: user.username, email: user.email, role: "organizer" }}
                      onDeleted={(id) => setOrganizers((prev) => prev.filter((u) => u.id !== id))}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {selectedUser && (
          <DashEditUser
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
            onUpdated={handleUserUpdate}
          />
        )}
      </div>
    </div>
  );
}

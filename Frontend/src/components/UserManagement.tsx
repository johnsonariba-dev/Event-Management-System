import React, { useEffect, useState } from "react";
import { FaEdit, FaUsers } from "react-icons/fa";
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
        onChange={(e) => {
          setQuery(e.target.value);
          onSearch(e.target.value);
        }}
        placeholder={placeholder || "Search users..."}
        className="border rounded-3xl h-8 p-2 text-xs w-full sm:w-64"
      />
    </form>
  );
};

interface User {
  id: number;
  username: string;
  email: string;
  ticket_price: number;
  Ticket_buy: string;
  is_active?: boolean;
}

interface UserEdit {
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

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [totals, setTotals] = useState<Totals>({
    total_users: 0,
    active_count: 0,
    inactive_count: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserEdit | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      const totalRes = await fetch("http://localhost:8000/connected_count");
      const totalData = await totalRes.json();
      setTotals(totalData);

      const response = await fetch("http://127.0.0.1:8000/admin/users", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      const data: User[] = await response.json();

      const userWithStatus = await Promise.all(
        data.map(async (user) => {
          const statusRes = await fetch(
            `http://localhost:8000/user/${user.id}/status`
          );
          const statusData = await statusRes.json();
          return { ...user, is_active: statusData.active };
        })
      );

      setUsers(userWithStatus);
    } catch (err) {
      setError("Error loading users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserUpdate = (updatedUser: UserEdit) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === updatedUser.id
          ? { ...user, username: updatedUser.username, email: updatedUser.email }
          : user
      )
    );
  };

  const filteredUsers = users.filter((user) =>
    [user.username, user.email].join(" ").toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="space-y-4 p-2 md:p-4 min-w-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="font-light text-sm">Monitor and manage platform users</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-lg shadow p-4">
        <div className="border rounded-lg p-4 text-center">Active Users: {totals.active_count}</div>
        <div className="border rounded-lg p-4 text-center">Inactive Users: {totals.inactive_count}</div>
        <div className="border rounded-lg p-4 text-center">Total Users: {totals.total_users}</div>
      </div>

      {/* User Table */}
      <div className="shadow rounded-lg p-4 space-y-4 overflow-x-auto min-w-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
          <div>
            <h2 className="font-bold text-xl flex items-center gap-2">
              <FaUsers /> Users List
            </h2>
            <p className="text-xs font-light">Manage users accounts and permissions</p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
            <SearchBar onSearch={setSearchQuery} />
            <select className="border rounded-3xl text-xs p-2 w-full sm:w-auto">
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>Suspended</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className="text-center p-6 text-gray-500">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-400 rounded text-xs md:text-sm min-w-[600px]">
              <thead className="bg-gray-100">
                <tr className="text-left font-medium">
                  <th className="px-4 py-2">User's name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Tickets</th>
                  <th className="px-4 py-2">Total Spent</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-t border-gray-300">
                      <td className="px-4 py-2 break-words">
                        {user.username}
                        <div className="text-xs font-light">ID: {user.id}</div>
                      </td>
                      <td className="px-4 py-2 break-words">{user.email}</td>
                      <td className="px-4 py-2 break-words">{user.Ticket_buy}</td>
                      <td className="px-4 py-2 break-words">{user.ticket_price ?? 0} XAF</td>
                      <td className="px-4 py-2">
                        <span className={user.is_active ? "text-green-500" : "text-red-500"}>
                          {user.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-2 flex gap-2 flex-wrap">
                        <button
                          onClick={() =>
                            setSelectedUser({
                              id: user.id,
                              username: user.username,
                              email: user.email,
                              role: "user",
                            })
                          }
                          className="text-xs px-2 py-1 rounded bg-yellow-200 hover:bg-yellow-300 transition-colors"
                        >
                          <FaEdit />
                        </button>
                        <DeleteUser
                          user={{ id: user.id, username: user.username, email: user.email, role: "organizer" }}
                          onDeleted={(id) => setUsers((prev) => prev.filter((u) => u.id !== id))}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {selectedUser && (
          <DashEditUser user={selectedUser} onClose={() => setSelectedUser(null)} onUpdated={handleUserUpdate} />
        )}
      </div>
    </div>
  );
}

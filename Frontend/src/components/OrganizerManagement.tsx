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
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder || "Search organizers..."}
        className="border rounded-3xl h-8 p-2 text-xs w-70"
      />
      {/* <button type="submit" className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">
        Search
      </button> */}
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

      const API_URL_1 = "http://localhost:8000/organizer/connected_count";
      const API_URL_2 = "http://127.0.0.1:8000/admin/organizers";

      // Totals
      const totalRes = await fetch(API_URL_1);
      const totalData = await totalRes.json();
      setTotals(totalData);

      const response = await fetch(API_URL_2, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const data: Organizer[] = await response.json();
      console.log(data);

      // Pour chaque utilisateur, récupérer son statut
      const organizerWithStatus = await Promise.all(
        data.map(async (org) => {
          const statusRes = await fetch(
            `http://localhost:8000/user/${org.id}/status`
          );
          const statusData = await statusRes.json();
          return { ...org, active: statusData.active };
        })
      );

      setOrganizers(organizerWithStatus);
    } catch (err) {
      setError("Erreur lors du chargement des organisateurs");
      console.error("Error fetching organizers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizers();
  }, []);

  // Callback appelé après mise à jour
  const handleUserUpdate = (updatedUser: User) => {
    // Mettre à jour la liste des ORGANIZATEURS
    setOrganizers((prevOrganizers) =>
      prevOrganizers.map((org) =>
        org.id === updatedUser.id
          ? {
              ...org,
              username: updatedUser.username,
              email: updatedUser.email,
              role: updatedUser.role,
            }
          : org
      )
    );
  };

  if (error) return <p className="text-center text-red-500">{error}</p>;
  return (
    <div>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Organizer Management</h1>
          <p className="font-light text-sm">
            Manage Event organizers and their permissions
          </p>
        </div>
        <div className="rounded-lg shadow ">
          <div className="grid grid-cols-3 rounded-lg gap-4 p-4">
            <div className="border rounded-lg p-4 ">
              Active Organizers: {totals.active_count}
            </div>
            <div className="border rounded-lg p-4 ">
              Inactive Organizers: {totals.inactive_count}
            </div>
            <div className=" border rounded-lg p-4 ">
              Total Organizers: {totals.total_users}
            </div>
          </div>
        </div>
        <div className="shadow rounded-lg p-4 space-y-4">
          <div className="flex justify-between">
            <div>
              <h2 className="font-bold text-xl flex items-center">
                <FaUser />
                Organizers List
              </h2>
              <p className="text-xs font-light">
                Manage organizers accounts and verification status
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div>
                <SearchBar
                  onSearch={(query) => console.log("searching for:", query)}
                />
              </div>
              <select className="border rounded-3xl text-xs p-2">
                <option>All Status</option>
                <option>Verified</option>
                <option>Pending</option>
                <option>Suspended</option>
              </select>
            </div>
          </div>

          {loading ? (
            <p className="text-center text-red-500">Loading...</p>
          ) : (
            <table className="w-full border border-gray-400 rounded">
              <thead>
                <tr className="text-sm rounded">
                  <th className="font-medium px-4 py-2 right">
                    Organizer's name
                  </th>
                  <th className="font-medium px-4 py-2 right">Email</th>
                  <th className="font-medium px-4 py-2 right">Performance</th>
                  <th className="font-medium px-4 py-2 right">Revenue</th>
                  {/* <th className="font-medium px-4 py-2 right">Rating</th> */}
                  <th className="font-medium px-4 py-2 right">Status</th>
                  <th className="font-medium px-4 py-2 right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {organizers.map((user, index) => (
                  <tr
                    key={index}
                    className="text-sm font-medium border  border-gray-400"
                  >
                    <td className="px-6 py-2">
                      {" "}
                      {user.username} <br />{" "}
                      <div className="text-xs font-light ">ID: {user.id}</div>
                    </td>
                    <td className="px-6 py-2">{user.email}</td>
                    <td className="px-6 py-2">
                      {user.events} events
                      <br /> Last {user.date_event}
                    </td>
                    <td className="px-6 py-2">${user.revenu}</td>
                    <td className="px-6 py-2">
                      <span
                        className={
                          user.is_active ? "text-green-500" : "text-red-500"
                        }
                      >
                        {user.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      {/* Actions placeholder */}
                      <button
                        value={"Edit"}
                        onClick={() =>
                          setSelectedUser({
                            id: user.id,
                            username: user.username,
                            email: user.email,
                            role: "organizer", // valeur logique dans votre contexte
                          })
                        }
                        className="text-xs px-2 py-1 rounded bg-yellow-200 mr-1"
                      >
                        <FaEdit />
                      </button>
                      <DeleteUser
                        user={{
                          id: user.id,
                          username: user.username,
                          email: user.email,
                          role: "organizer",
                        }}
                        onDeleted={(id) =>
                          // retire l'organisateur supprimé de la liste locale
                          setOrganizers((prev) =>
                            prev.filter((u) => u.id !== id)
                          )
                        }
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
    </div>
  );
}

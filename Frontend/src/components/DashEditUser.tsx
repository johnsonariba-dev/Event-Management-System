import  { useState, useEffect } from "react";

interface User {
  id: number;
  username: string;
  email: string;
  role: "user" | "organizer" | "admin";
}

interface Props {
  user: User;
  onClose: () => void;
  onUpdated: (u: User) => void;
}

const DashEditUser = ({ user, onClose, onUpdated }: Props) => {

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<User["role"]>("user");

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
      setRole(user.role);
    }
  }, [user]);

  const handleUpdate = async () => {
    const body = { username, email, role };
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://127.0.0.1:8000/admin/users/${user.id} `,
      {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!response) throw new Error("error to edit");
    const updateUser: User = await response.json();
    onUpdated(updateUser);
    onClose();

    // if (updateUser.role === "organizer") {
    //     navigate("/OrganizerManagement");
    //   } else if (updateUser.role === "user") {
    //     navigate("/UserManagement");
    //   } else {
    //     navigate("/dashboard");
    //   }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center pl-40 bg-black/50 backdrop-blur-xs bg-opacity-40">
      <div className="bg-white p-6 rounded  shadow-md w-96">
        <h2 className="text-lg font-bold mb-4">Modifier l’utilisateur</h2>

        <label className="block mb-2">
          Name
          <input
            className="border w-full p-2 rounded mt-1"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>

        <label className="block mb-2">
          Email
          <input
            type="email"
            className="border w-full p-2 rounded mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="block mb-4">
          Role
          <select
            className="border w-full p-2 rounded mt-1"
            value={role}
            onChange={(e) => setRole(e.target.value as User["role"])}
          >
            <option value="user">User</option>
            <option value="organizer">Organizer</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-violet-200 text-black rounded"
            onClick={handleUpdate}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
export default DashEditUser;

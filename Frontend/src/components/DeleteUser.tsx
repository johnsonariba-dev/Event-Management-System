import { useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";

interface User {
  id: number;
  username: string;
  email: string;
  role: "user" | "organizer" | "admin";
}

interface Props {
  user: User;
  onDeleted: (id: number) => void; // callback pour mettre à jour la liste dans le parent
}

const DeleteUser: React.FC<Props> = ({ user, onDeleted }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://127.0.0.1:8000/admin/users/${user.id}`, {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response) throw new Error("Error to deleting");
      onDeleted(user.id);
      setShowConfirm(false);
    } catch (error: any) {
        console.error(`error, ${error.message}`)
    }finally{
        setLoading(false)
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="text-xs px-2 py-1 rounded bg-red-200"
        >
        <RiDeleteBin6Line/>

      </button>

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center pl-40 backdrop-blur-xs bg-black/50">
          <div className="bg-white p-6 rounded shadow-md w-80">
            <h2 className="text-lg font-bold mb-4">Confirm the suppression</h2>
            <p className="mb-4">
              Do you want to delete <b>{user.username}</b> ?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowConfirm(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteUser;

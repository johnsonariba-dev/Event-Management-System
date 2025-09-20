
const Dashboard = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <div>You must be logged in to view this page</div>;
  if (role !== "admin") return <div>Only admins can view this page</div>;
  return (
    <div>
     
    </div>
  )
}

export default Dashboard;

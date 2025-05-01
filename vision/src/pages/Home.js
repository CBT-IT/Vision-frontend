import { useAuth } from "../context/AuthProvider";
import Navbar from "../components/basic/Navbar";

const Home = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <Navbar />
      <h1>Welcome {user?.email}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Home;

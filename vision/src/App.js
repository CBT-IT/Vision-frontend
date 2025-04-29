import React, { useEffect, useState } from "react";
import axios from "axios";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider, useMsal } from "@azure/msal-react";
import { msalConfig } from "./authConfig";

const pca = new PublicClientApplication(msalConfig);

function SignInButton() {
  const { instance } = useMsal();
  const handleLogin = () => instance.loginPopup();
  return <button onClick={handleLogin}>Sign in with CBT - Microsoft</button>;
}

function Dashboard() {
  const { accounts } = useMsal();
  return (
    <div>
      <h1>Welcome, {accounts[0]?.name}</h1>
      <p>You are authorized to view the dashboardf</p>
    </div>
  );
}

function MainApp() {
  const { accounts } = useMsal();
  return accounts.length > 0 ? <Dashboard /> : <SignInButton />;
}

function App() {
  return (
    <MsalProvider instance={pca}>
      <MainApp />
    </MsalProvider>
  );
}
// function App() {
//   const [count, setcount] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     axios
//       .get(`${process.env.REACT_APP_API_BASE_URL}/user-count`)
//       .then((response) => setcount(response.data.count))
//       .catch((err) => {
//         console.error(err);
//         setError("Error fetching count");
//       });
//   }, []);
//   return (
//     <div
//       style={{
//         textAlign: "center",
//         marginTop: "80px",
//         fontFamily: "sans-serif",
//       }}
//     >
//       <h1>User Info Count</h1>
//       <h1>Deployemnt Ready!!</h1>
//       {error && <p Style={{ color: "red" }}>{error}</p>}
//       {count !== null ? <h2>{count}</h2> : <h2>Loading ...</h2>}
//     </div>
//   );
// }

export default App;

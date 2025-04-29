import React, { useEffect, useState } from "react";
import AppRouter from "./routes/AppRouter";

function App() {
  return <AppRouter />;
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

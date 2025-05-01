export async function getUserCount(token) {
  const res = await fetch(
    "https://vision-backend-32ia.onrender.com/user-count",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await res.json();

  console.log("User Count:", data.count);
  return data.count;
}

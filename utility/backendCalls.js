export async function getUserCount(token) {
  const res = await fetch(
    "https://vision-backend-32ia.onrender.com/user-info-count",
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

export async function getUserMappings(token) {
  const res = await fetch("https://vision-backend-32ia.onrender.com/users)", {
    method: "GET",
    header: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  console.log("UserMapings");
  console.log(data);
  return data;
}

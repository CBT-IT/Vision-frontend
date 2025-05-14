export async function safeFetch(url, token, options = {}) {
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };
  const response = await fetch(url, {
    ...options,
    headers,
  });
  if (response.status === 401) {
    sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
    sessionStorage.clear();
    window.location.href = "../index.html";
    return;
  }
  return await response.json();
}

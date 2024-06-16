export const API_URL = "https://smart-scale-773f6dc98fe5.herokuapp.com";

export function fetchUser(): Promise<any> {
  return fetch(`${API_URL}/api/user/me`, {
    credentials: "include",
  })
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      console.error(error);
    });
}

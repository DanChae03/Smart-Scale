export function fetchUser(): Promise<any> {
  return fetch("https://smart-scale-773f6dc98fe5.herokuapp.com/api/user/me", {
    credentials: "include",
  })
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      console.error(error);
    });
}

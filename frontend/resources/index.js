import { loginURL, csrftokenURL } from "../config/config.js";

let form = document.getElementById("loginForm");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  event.stopPropagation();
  const elements = event.target.elements;

  const username = elements.email.value;
  const password = elements.password.value;

  const encodedData = btoa(`${username}:${password}`);

  const response = await fetch(csrftokenURL);
  const { CSRFToken } = await response.json();
  const headers = {
    Authorization: `Basic ${encodedData}`,
    "X-CSRF-Token": CSRFToken,
  };

  const options = {
    method: "POST",
    credentials: "include",
    mode: "cors",
    headers: headers,
  };
  console.log(options);
  fetch(loginURL, options)
    .then((res) => {
      if (res.status == 401 || res.status == 403) {
        alert("Username or password incorrect!");
        throw Error("Username or password incorrect");
      } else if (res.status == 200) {
        return res.json();
      } else if (res.status == 500) {
        alert("Something Went wrong. Try again!");
        throw Error("Something Went wrong. Try again!");
      }
    })
    .then((data) => storeJsonWebToken(data))
    .catch((err) => console.log(err));
});

function storeJsonWebToken(data) {
  alert("Login Success!");
  localStorage.setItem("token", JSON.stringify(data));
}

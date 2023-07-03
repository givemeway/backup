document.getElementById("loginform").addEventListener("submit", login);

function login(event) {
    event.
  let elements = event.target.elements;
  const username = elements.email.value;
  const password = elements.password.value;
  const url = "http://192.168.29.34:3000/app/receiveFile";
  const headers = {
    Authorization: btoa(`${username}:${password}`),
  };
  const options = {
    headers: headers,
    method: "POST",
  };
  fetch(url, options)
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
}

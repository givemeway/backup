let form = document.getElementById("loginForm");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  event.stopPropagation();
  const elements = event.target.elements;

  const username = elements.email.value;
  const password = elements.password.value;

  const encodedData = btoa(`${username}:${password}`);

  let headers = new Headers();
  headers.append("Authorization", `Basic ${encodedData}`);

  const url = "http://192.168.29.179:3000/app/login";
  const options = {
    method: "POST",
    credentials: "include",
    mode: "cors",
    headers: headers,
  };
  fetch(url, options)
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

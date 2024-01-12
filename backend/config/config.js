const domain = "localhost";
const host_url = `http://${domain}`;
const origin = `${host_url}:3000`;
const serverDomain = `https://localhost:3001`;
// const domain = "wealthy-grouse-modest.ngrok-free.app";
// const host_url = `https://wealthy-grouse-modest.ngrok-free.app`;
// const origin = `https://wealthy-grouse-modest.ngrok-free.app`;
// const serverDomain = `https://wealthy-grouse-modest.ngrok-free.app`;

// https://wealthy-grouse-modest.ngrok-free.app/
//  "ngrok http --host-header=rewrite --domain=wealthy-grouse-modest.ngrok-free.app 3000"
export { origin, domain, serverDomain };

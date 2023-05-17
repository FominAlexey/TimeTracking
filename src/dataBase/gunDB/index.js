import Gun from "gun";
const gun = Gun({
  peers: ["http://localhost:8765/gun"], // Put the relay node that you want here
  localStorage: false,
});
export default gun;

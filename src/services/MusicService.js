import APIClient, { baseURL } from "./APIClient";

const wsBaseURL = baseURL.startsWith("https")
  ? `wss${baseURL.slice(5)}`
  : `ws${baseURL.slice(4)}`;

export const wsURL = `${wsBaseURL}/nowplaying/ws`;

const MusicService = {
  async getNowPlaying() {
    const { data } = await APIClient.get("/nowplaying");
    return data;
  },

  socket: new WebSocket(wsURL),
  resetSocket() {
    this.socket = new WebSocket(wsURL);
  },
};

export default MusicService;

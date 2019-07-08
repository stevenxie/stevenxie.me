import { client, wsBaseURL } from "@/api";
export const wsURL = `${wsBaseURL}/nowplaying/ws`;

const service = {
  async getNowPlaying() {
    const { data } = await client.get("/nowplaying");
    return data;
  },

  socket: new WebSocket(wsURL),
  resetSocket() {
    this.socket = new WebSocket(wsURL);
  },
};

export default service;

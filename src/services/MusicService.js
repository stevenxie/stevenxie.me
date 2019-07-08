import { client, wsBaseURL } from "@/api";
export const wsURL = `${wsBaseURL}/nowplaying/ws`;

const MusicService = {
  async getNowPlaying() {
    const { data } = await client.get("/nowplaying");
    return data;
  },

  socket: new WebSocket(wsURL),
  resetSocket() {
    this.socket = new WebSocket(wsURL);
  },
};

export default MusicService;

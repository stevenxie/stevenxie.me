import APIClient from "./APIClient";

const NowPlayingService = {
  async getNowPlaying() {
    const { data } = await APIClient.get("/nowplaying");
    return data;
  },
};

export default NowPlayingService;

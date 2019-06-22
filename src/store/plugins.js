import NowPlayingService from "@/services/NowPlayingService";
import {
  NOW_PLAYING_SUCCESS,
  NOW_PLAYING_FAILURE,
  NOW_PLAYING_PROGRESS,
} from "./mutations";

const { socket } = NowPlayingService;
export const nowPlayingStreamPlugin = store => {
  socket.addEventListener("message", ({ data }) => {
    const { event, payload } = JSON.parse(data);
    switch (event) {
      case "error":
        store.commit(NOW_PLAYING_FAILURE, payload);
        break;

      case "nowplaying":
        store.commit(NOW_PLAYING_SUCCESS, payload);
        break;

      case "progress":
        store.commit(NOW_PLAYING_PROGRESS, payload);
        break;

      default:
        throw new Error(
          `plugins: unknown event '${event}' from NowPlaying stream`
        );
    }
  });
};

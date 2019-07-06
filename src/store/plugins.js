import MS from "@/services/MusicService";
import {
  NOW_PLAYING_LOADING,
  NOW_PLAYING_SUCCESS,
  NOW_PLAYING_FAILURE,
  NOW_PLAYING_PROGRESS,
} from "./mutations";

const RETRY_TIMEOUT = 3000;

export const nowPlayingStreamPlugin = store => {
  MS.socket.addEventListener("open", () => store.commit(NOW_PLAYING_LOADING));

  MS.socket.addEventListener("message", ({ data }) => {
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

  MS.socket.addEventListener("close", ({ reason }) => {
    store.commit(NOW_PLAYING_FAILURE, new Error(reason));

    console.error(`NowPlaying socket closed, retrying in ${RETRY_TIMEOUT} ms.`);
    setTimeout(() => (MS.resetSocket(), nowPlayingStreamPlugin(store)), 1000);
  });
};

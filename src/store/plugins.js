import ms from "@/services/music";
import {
  NOW_PLAYING_LOADING,
  NOW_PLAYING_SUCCESS,
  NOW_PLAYING_FAILURE,
  NOW_PLAYING_PROGRESS,
} from "./mutations";

const RETRY_TIMEOUT = 3000;

export const nowPlayingStreamPlugin = store => {
  ms.socket.addEventListener("open", () => store.commit(NOW_PLAYING_LOADING));

  ms.socket.addEventListener("message", ({ data }) => {
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

  ms.socket.addEventListener("close", ({ reason }) => {
    store.commit(NOW_PLAYING_FAILURE, new Error(reason));

    console.error(`NowPlaying socket closed, retrying in ${RETRY_TIMEOUT} ms.`);
    window.setTimeout(
      () => (ms.resetSocket(), nowPlayingStreamPlugin(store)),
      1000
    );
  });
};

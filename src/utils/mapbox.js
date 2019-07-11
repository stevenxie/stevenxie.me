import mapbox from "mapbox-gl/dist/mapbox-gl";

mapbox.accessToken = process.env.VUE_APP_MAPBOX_TOKEN;

export default mapbox;

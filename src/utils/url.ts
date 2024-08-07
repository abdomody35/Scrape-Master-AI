const validateUrl = (url: string) => {
  if (!isValidUrl(url)) return false;

  return checkHttp(url);
};

const isValidUrl = (url: string) => {
  return url.match(
    /(https?:\/\/|[a-zA-Z0-9-]+\.)[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+(:\d+)?(\/[^\s]*)?(\?[^\s]*)?(#[^\s]*)?/gim
  );
};

const checkHttp = (url: string) => {
  if (!url.startsWith("http")) return "https://" + url;

  if (url.startsWith("http://")) return url.replace("http", "https");

  return url;
};

const checkRoute = (url: string, baseUrl: string) => {
  if (url.startsWith("/")) {
    return baseUrl.endsWith("/") ? baseUrl + url.slice(1) : baseUrl + url;
  }
  return url;
};

const isImage = (url: string): boolean => {
  return /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico|avif|heif|heic|jxr|psd|tif|tiff|jp2|j2k|jpc|jpx|jpm|mj2|mjp2|mjs|svgz|wbmp|xbm|xpm|cur|ani|hdr|pic|ief|pcx|ras|tga|bmp|dib|rle)$/i.test(
    url
  );
};

const isVideo = (url: string): boolean => {
  return /\.(mp4|m4v|mkv|mov|avi|wmv|flv|f4v|webm|vob|ogv|ogg|drc|gifv|mng|qt|yuv|rm|rmvb|asf|amv|mpg|mpeg|m2v|3gp|3g2|svi|mxf|roq|nsv)$/i.test(
    url
  );
};

const isAudio = (url: string): boolean => {
  return /\.(flac|mp3|aac|aiff|alac|amr|ape|au|awb|dss|dsd|dvf|gsm|iklax|ivs|m4a|m4b|m4p|mmf|mpc|msv|ogg|oga|opus|ra|rm|raw|sln|tta|vox|wav|wma|wv|webm|8svx)$/i.test(
    url
  );
};

const isMedia = (url: string): boolean => {
  return isImage(url) || isVideo(url) || isAudio(url);
};

export {
  isValidUrl,
  checkHttp,
  validateUrl,
  isImage,
  isVideo,
  isAudio,
  checkRoute,
};

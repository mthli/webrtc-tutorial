function getVersionBasePath(version) {
  return `/v${version.replace(/\s+/g, '-')}`;
}

function getSpectrumUrl(handle) {
  return `https://spectrum.chat/${handle}`;
}

// https://git.io/JtwDL
export function isSSR() {
  return !(typeof globalThis.window != 'undefined' && globalThis.window.document);
}

exports.getSpectrumUrl = getSpectrumUrl;
exports.getVersionBasePath = getVersionBasePath;
exports.isSSR = isSSR;
exports.HEADER_HEIGHT = 72;

// This file overwrites the stock UV config.js

self.__uv$config = {
  prefix: "/active/go/",
  encodeUrl: Ultraviolet.codec.xor.encode,
  decodeUrl: Ultraviolet.codec.xor.decode,
  handler: "/active/uv.handler.js",
  client: "/active/uv.client.js",
  bundle: "/active/uv.bundle.js",
  config: "/active/uv.config.js",
  sw: "/active/uv.sw.js",
};
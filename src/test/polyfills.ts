/**
 * Polyfills required for MSW and jsdom environment
 * This file must be loaded FIRST via Jest setupFiles (not setupFilesAfterEnv)
 */

import { TextEncoder, TextDecoder } from "util";
import { ReadableStream, TransformStream, WritableStream } from "stream/web";

// Define TextEncoder, TextDecoder, and Streams first (required by undici)
Object.assign(globalThis, {
  TextEncoder,
  TextDecoder,
  ReadableStream,
  TransformStream,
  WritableStream,
});

// Now import undici for fetch polyfills (Node.js compatible)
// eslint-disable-next-line @typescript-eslint/no-require-imports
const undici = require("undici");

// Assign fetch-related globals
Object.assign(globalThis, {
  fetch: undici.fetch,
  Headers: undici.Headers,
  Request: undici.Request,
  Response: undici.Response,
  FormData: undici.FormData,
});

// BroadcastChannel polyfill (needed by MSW)
class BroadcastChannelPolyfill {
  name: string;
  onmessage: ((event: MessageEvent) => void) | null = null;

  constructor(name: string) {
    this.name = name;
  }

  postMessage() {
    // No-op for testing
  }

  close() {
    // No-op for testing
  }

  addEventListener() {
    // No-op for testing
  }

  removeEventListener() {
    // No-op for testing
  }
}

Object.assign(globalThis, {
  BroadcastChannel: BroadcastChannelPolyfill,
});

// Worker entry point. Webpack requires `new Worker(new URL(...))` to use a
// path relative to the importing module, so each tool ships this thin entry
// that pulls in the shared whisper worker implementation.
import "@mtosity/whisper/worker";

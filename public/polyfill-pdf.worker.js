// 1. Add the polyfill for Promise.withResolvers
if (!self.Promise.withResolvers) {
  self.Promise.withResolvers = function () {
    let resolve, reject;
    const promise = new self.Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}

// 2. Load the original pdf.js worker script
// This path assumes the original worker is also in the public directory.
// We will copy it there in the next step.
self.importScripts(`https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`);
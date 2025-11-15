if (!Promise.withResolvers) {
  Promise.withResolvers = function <T>() {
    let resolve: (value: T | PromiseLike<T>) => void;
    let reject: (reason?: any) => void;
    const promise = new Promise<T>((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve: resolve!, reject: reject! };
  };
}

import ReactDOM from 'react-dom/client';
import { pdfjs } from 'react-pdf';
import { AuthProvider } from './AuthContext';
import { CollaborativeProvider } from './CollaborativeContext';
import App from './App';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  './polyfill-pdf.worker.ts',
  import.meta.url
).toString();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <AuthProvider>
        <CollaborativeProvider>
            <App />
        </CollaborativeProvider>
    </AuthProvider>
);

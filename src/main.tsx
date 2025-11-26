import ReactDOM from 'react-dom/client';
import { AuthProvider } from './AuthContext';
import { CollaborativeProvider } from './CollaborativeContext';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <AuthProvider>
        <CollaborativeProvider>
            <App />
        </CollaborativeProvider>
    </AuthProvider>
);

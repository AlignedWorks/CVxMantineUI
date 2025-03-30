import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Home } from './pages/Home.page';
import { AuthenticationTitle } from './components/AuthenticationTitle/AuthenticationTitle';
import { RegistrationTile } from './components/RegistrationTile/RegistrationTile'
import { CollaborativeDirectory } from './pages/CollaborativeDirectory.page';
import { MemberDirectory } from './pages/MemberDirectory.page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <AuthenticationTitle />,
  },
  {
    path: '/register',
    element: <RegistrationTile />,
  },
  {
    path: '/collaborative-directory',
    element: <CollaborativeDirectory />,
  },
  {
    path: '/member-directory',
    element: <MemberDirectory />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}

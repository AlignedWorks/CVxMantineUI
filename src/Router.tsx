import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Home } from './pages/Home.page';
import { AuthenticationTitle } from './pages/AuthenticationTitle/AuthenticationTitle';
import { CollaborativeDirectory } from './pages/CollaborativeDirectory.page';
import { MemberDirectory } from './pages/MemberDirectory.page';
import { ProjectDirectory } from './pages/ProjectDirectory.page';

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
    path: '/collaborative-directory',
    element: <CollaborativeDirectory />,
  },
  {
    path: '/member-directory',
    element: <MemberDirectory />,
  },
  {
    path: '/project-directory',
    element: <ProjectDirectory />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}

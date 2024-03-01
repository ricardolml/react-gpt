import { RouterProvider } from 'react-router-dom';
import { router } from './presentation/routers/router';

export const ReactGPT = () => {
  return <RouterProvider router={router} />;
};

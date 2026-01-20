import { createHashRouter } from 'react-router';
import defaultRoutes from './defaultRoutes';

export const routes = [...defaultRoutes];

const router = createHashRouter([
  ...routes,
]);

export default router;

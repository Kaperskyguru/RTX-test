'use strict';

import { Router } from 'express';

// Import routes
import CatRoutes from '../features/cats/Cat.routes.js';
import AuthRoutes from '../features/auth/Auth.routes.js';
import passport from 'passport';

const router = Router({
  caseSensitive: true,
});

// Use imported routes in router
router.use('/auth', AuthRoutes);
router.use(
  '/catfacts',
  // passport.authenticate("jwt", { session: false }),
  CatRoutes
);

export default router;

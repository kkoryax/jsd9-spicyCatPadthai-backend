import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  // windowMs: 60 * 1000,
  max: 1000,                 // limit each IP to 100 requests
  standardHeaders: true,
  legacyHeaders: false,
});

export default limiter;

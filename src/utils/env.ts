/// This approach imports dotenv early to ensure environment variables are set
/// Further Reading: https://github.com/motdotla/dotenv/issues/133#issuecomment-255298822

import {config } from 'dotenv';
config();

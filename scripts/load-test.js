import http from 'k6/http';
import { check, sleep } from 'k6';

/**
 * Frontend Arena k6 Load Test Script
 * 
 * Rationale:
 * - This script models realistic concurrent traffic ramping from 100 to 5000 users.
 * - Spikes are avoided to test sustainable connection limits and pool utilization.
 * - Targets key entry points: Homepage, Hall of Fame, and Sponsors directories.
 * 
 * Execution:
 * k6 run -e BASE_URL=http://localhost:3000 scripts/load-test.js
 */

export const options = {
  stages: [
    { duration: '2m', target: 100 },   // Warmup: ramp to 100 users
    { duration: '5m', target: 1000 },  // Scaling: ramp to 1000 users
    { duration: '5m', target: 5000 },  // Peak ramp: ramp to 5000 users
    { duration: '5m', target: 5000 },  // Sustain peak load
    { duration: '3m', target: 0 },     // Cool down to 0 users
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],    // Failure rate must be < 1%
    http_req_duration: ['p(95)<500'],  // 95% of requests must complete under 500ms
  },
};

const BASE_URL = __ENV.BASE_URL || 'https://frontendarena.com';

export default function () {
  // 1. Visit Homepage (ISR 300s)
  const homeRes = http.get(`${BASE_URL}/`);
  check(homeRes, {
    'homepage status is 200': (r) => r.status === 200,
  });
  sleep(1);

  // 2. Visit Hall of Fame Page (ISR 3600s)
  const hofRes = http.get(`${BASE_URL}/hall-of-fame`);
  check(hofRes, {
    'hall-of-fame status is 200': (r) => r.status === 200,
  });
  sleep(2);

  // 3. Visit Sponsors Directory (ISR 3600s)
  const sponsorsRes = http.get(`${BASE_URL}/sponsors`);
  check(sponsorsRes, {
    'sponsors status is 200': (r) => r.status === 200,
  });
  sleep(1.5);
}

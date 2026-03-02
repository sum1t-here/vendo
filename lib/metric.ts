import { collectDefaultMetrics, register, Counter, Histogram } from 'prom-client'

collectDefaultMetrics()

export const apiRequests = new Counter({
  name: 'api_requests_total',
  help: 'Total number of API requests',
  labelNames: ['method', 'path', 'status'],
})

export const dbQueries = new Counter({
  name: 'db_queries_total',
  help: 'Total number of database queries',
  labelNames: ['collection', 'operation', 'status'],
})

export const requestDuration = new Histogram({
  name: 'api_request_duration_seconds',
  help: 'Duration of API requests in seconds',
  labelNames: ['method', 'path', 'status'],
  buckets: [0.1, 0.5, 1, 2, 5, 10],
})

// AUTH
export const loginSuccess = new Counter({
  name: 'auth_login_success_total',
  help: 'Total successful logins',
})

export const loginFailure = new Counter({
  name: 'auth_login_failure_total',
  help: 'Total failed logins',
})

export const logoutCounter = new Counter({
  name: 'auth_logout_total',
  help: 'Total logouts',
})

export const metrics = async () => {
  return register.metrics()
}
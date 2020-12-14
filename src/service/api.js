// REST API data object
const apiConfig = {
  url: process.env.REACT_APP_API_URL,
  key: process.env.REACT_APP_API_KEY,
  amqpConsumer: process.env.REACT_APP_API_AMQP_CONSUMER,
  driverConnection: process.env.REACT_APP_API_DRIVER_CONNECTION,
  simulator: 'supplychain'
}

export default apiConfig

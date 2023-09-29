const winston = require('winston');

const { createLogger, format, transports } = winston;

// Define a custom log format with timestamps
const customFormat = format.combine(
  format.timestamp(), // Add timestamp to the log entry
  format.json(), // Use JSON format for logs
);

const logger = createLogger({
  level: 'info',
  format: customFormat, // Use the custom format
  transports: [
    new transports.Console(), // Output logs to the console
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' }),
  ],
});

module.exports = logger;

module.exports = logger;

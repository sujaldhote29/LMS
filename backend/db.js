const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config();
const mysql = require('mysql2');

// Detect if connecting to a cloud provider that mandates SSL
const isCloudHost = (process.env.DB_HOST && (
    process.env.DB_HOST.includes('tidbcloud.com') ||
    process.env.DB_HOST.includes('aivencloud.com') ||
    process.env.DB_HOST.includes('clever-cloud.com') ||
    process.env.DB_HOST.includes('railway.app')
));

const useSSL = process.env.DB_SSL === 'true' || isCloudHost;

let poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'library_management',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000
};

// Support full connection string if provided (e.g. Railway or Render database URL)
if (process.env.DATABASE_URL || process.env.MYSQL_URL) {
    const dbUri = process.env.DATABASE_URL || process.env.MYSQL_URL;
    poolConfig = {
        uri: dbUri,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 10000
    };
}

if (useSSL) {
    poolConfig.ssl = {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'false' ? false : true
    };
}

const pool = mysql.createPool(poolConfig);

// Convert pool to use promises
const promisePool = pool.promise();

// Test connection
promisePool.getConnection()
    .then(connection => {
        console.log(`Successfully connected to MySQL database: ${process.env.DB_NAME || 'default'} (${process.env.DB_HOST || 'localhost'})`);
        connection.release();
    })
    .catch(err => {
        console.error('Error connecting to MySQL:', err.message || err);
    });

module.exports = promisePool;

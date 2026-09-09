const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');

async function setup() {
    try {
        const isCloudHost = (process.env.DB_HOST && (
            process.env.DB_HOST.includes('tidbcloud.com') ||
            process.env.DB_HOST.includes('aivencloud.com') ||
            process.env.DB_HOST.includes('clever-cloud.com') ||
            process.env.DB_HOST.includes('railway.app')
        ));
        const useSSL = process.env.DB_SSL === 'true' || isCloudHost;

        let connConfig = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            multipleStatements: true
        };

        if (process.env.DATABASE_URL || process.env.MYSQL_URL) {
            connConfig.uri = process.env.DATABASE_URL || process.env.MYSQL_URL;
        }

        if (useSSL) {
            connConfig.ssl = {
                minVersion: 'TLSv1.2',
                rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'false' ? false : true
            };
        }

        // When connecting to cloud database or when DB_NAME is set, connect directly to it
        if (isCloudHost || process.env.DB_NAME) {
            connConfig.database = process.env.DB_NAME || 'test';
            const connection = await mysql.createConnection(connConfig);
            const schemaFile = fs.existsSync(path.join(__dirname, 'schema_cloud.sql'))
                ? path.join(__dirname, 'schema_cloud.sql')
                : path.join(__dirname, 'schema.sql');
            const schema = fs.readFileSync(schemaFile, 'utf8');
            console.log(`Running schema on database '${connConfig.database}'...`);
            await connection.query(schema);
            console.log("Database tables created successfully!");
            await connection.end();
        } else {
            // Local fallback
            const connection = await mysql.createConnection(connConfig);
            const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
            console.log("Running local schema...");
            await connection.query(schema);
            console.log("Database and tables created successfully!");
            await connection.end();
        }
    } catch (err) {
        console.error("Error setting up database:", err.message || err);
    }
}

setup();

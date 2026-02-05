const dns = require('dns');

// Force IPv4 for all DNS lookups - PATCH MUST BE BEFORE SEQUELIZE/PG LOAD
const originalLookup = dns.lookup;
dns.lookup = (hostname, options, callback) => {
    if (typeof options === 'function') {
        callback = options;
        options = {};
    }
    options = options || {};
    options.family = 4;
    console.log(`DNS Lookup for ${hostname} forced to IPv4`);
    return originalLookup(hostname, options, callback);
};

const { Sequelize } = require('sequelize');
const path = require('path');

// Parse the connection string
const dbUrl = new URL(process.env.DATABASE_URL);

// Create a function to initialize Sequelize with resolved IP
let sequelize;

if (process.env.DATABASE_URL) {
    // We need to wait for DNS resolution, but Sequelize constructor is synchronous.
    // Ideally, we would resolve first, but for module export it's tricky.
    // Instead, we will configure Sequelize to use a custom connection manager or just rely on the side-effect we added to server.js

    // STRATEGY: Since we can't easily make this async at module level without refactoring the whole app,
    // we will keep the 'family: 4' which SHOULD work if passed correctly.

    // Let's try passing the options differently. sometimes dialectOptions structure is tricky.
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        protocol: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            },
            // Keep family: 4, it is the correct way for pg/net
            family: 4,
            // Add this too just in case
            socketPath: false,
        },
        logging: false,
        // Add pool options to enforce timeouts and retries
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    });
} else {
    // Fallback for when env vars aren't loaded yet (e.g. CI)
    sequelize = new Sequelize('sqlite::memory:', { logging: false });
}

module.exports = sequelize;

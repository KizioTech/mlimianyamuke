const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        process.exit(1);
    }
    console.log('Connected to the SQLite database.');
});

db.serialize(() => {
    db.each("SELECT name FROM sqlite_master WHERE type='table'", (err, table) => {
        if (err) {
            console.error(err.message);
        }
        console.log(`Table: ${table.name}`);

        db.all(`PRAGMA table_info(${table.name})`, (err, rows) => {
            if (err) {
                console.error(err.message);
            }
            console.log(`  Columns for ${table.name}:`);
            rows.forEach((row) => {
                console.log(`    - ${row.name} (${row.type})`);
            });
        });
    });
});

setTimeout(() => {
    db.close();
}, 2000);

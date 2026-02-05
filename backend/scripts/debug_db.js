const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
        process.exit(1);
    }
    console.log('Connected to the SQLite database.');
});

db.serialize(() => {
    db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Tables:', tables.map(t => t.name));

        const tablesToCheck = ['Farmers', 'Analytics', 'Testimonials'];
        let completed = 0;

        const checkCompletion = () => {
            completed++;
            if (completed >= tablesToCheck.length + 1) { // +1 for count
                db.close();
            }
        };

        tablesToCheck.forEach(tableName => {
            db.all(`PRAGMA table_info(${tableName})`, [], (err, columns) => {
                if (err) console.error(`Error checking ${tableName}:`, err);
                else {
                    console.log(`\nColumns for ${tableName}:`);
                    console.log(columns.map(c => `${c.name} (${c.type})`).join(', '));
                }
                checkCompletion();
            });
        });

        // Check if there are any farmers
        db.get("SELECT count(*) as count FROM Farmers", [], (err, row) => {
            console.log("\nFarmer Count:", row ? row.count : "Error");
            checkCompletion();
        });
    });
});

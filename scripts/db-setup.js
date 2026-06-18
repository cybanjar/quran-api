const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

const run = async () => {
  try {
    const dir = path.join(__dirname, '..', 'db', 'migrations');
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.sql')).sort();
    for (const f of files) {
      const sql = fs.readFileSync(path.join(dir, f), 'utf8');
      console.log('Running', f);
      await pool.query(sql);
    }
    console.log('Migrations applied');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

run();

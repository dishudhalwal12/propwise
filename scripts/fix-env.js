const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');

if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local not found! Please create it first.');
  process.exit(1);
}

let content = fs.readFileSync(envPath, 'utf8');
const lines = content.split('\n');
let fixed = false;

const newLines = lines.map(line => {
  if (line.startsWith('VITE_FIREBASE_')) {
    fixed = true;
    return line.replace('VITE_FIREBASE_', 'NEXT_PUBLIC_FIREBASE_');
  }
  return line;
});

if (fixed) {
  fs.writeFileSync(envPath, newLines.join('\n'));
  console.log('✅ Success! Renamed VITE_ keys to NEXT_PUBLIC_ in .env.local');
} else {
  console.log('ℹ️ No VITE_ keys found. Your .env.local might already be correct.');
}

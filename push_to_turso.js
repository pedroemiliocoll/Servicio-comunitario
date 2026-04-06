import { spawn } from 'child_process';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('====================================================');
console.log('📡 PUSHING DRIZZLE SCHEMA TO TURSO DATABASE');
console.log('====================================================\n');

rl.question('Please paste your Turso Database URL (e.g., libsql://...): ', (dbUrl) => {
    rl.question('Please paste your Turso Auth Token: ', (token) => {
        console.log('\n🚀 Starting Drizzle Push to Remote Turso DB...\n');
        
        // Inject exactly these variables to override any empty fallbacks
        const env = { 
            ...process.env, 
            TURSO_DATABASE_URL: dbUrl.trim(),
            TURSO_AUTH_TOKEN: token.trim()
        };

        const pushCmd = spawn('npx', ['drizzle-kit', 'push'], {
            stdio: 'inherit',
            env: env,
            shell: true
        });

        pushCmd.on('close', (code) => {
            console.log(`\n✅ Process exited with code ${code}`);
            console.log('If it says "changes applied", your Vercel app should now start working immediately!');
            rl.close();
        });
    });
});

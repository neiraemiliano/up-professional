#!/usr/bin/env node

// Auto-deployment webhook server for Home-Fixed
// This creates a webhook endpoint that triggers deployment on git push

const http = require('http');
const { exec } = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Configuration
const WEBHOOK_PORT = 3001;
const WEBHOOK_PATH = '/webhook/deploy';
const DEPLOY_SCRIPT = path.join(__dirname, 'deploy.sh');
const LOG_FILE = '/var/log/home-fixed-deploy.log';

// GitHub webhook secret (set this in your GitHub webhook settings)
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'your-webhook-secret-change-this';

// Logging function
function log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    console.log(logMessage.trim());
    
    try {
        fs.appendFileSync(LOG_FILE, logMessage);
    } catch (err) {
        console.error('Failed to write to log file:', err.message);
    }
}

// Verify GitHub webhook signature
function verifySignature(payload, signature) {
    if (!signature) return false;
    
    const expectedSignature = crypto
        .createHmac('sha256', WEBHOOK_SECRET)
        .update(payload)
        .digest('hex');
    
    const actualSignature = signature.replace('sha256=', '');
    
    return crypto.timingSafeEqual(
        Buffer.from(expectedSignature, 'hex'),
        Buffer.from(actualSignature, 'hex')
    );
}

// Execute deployment script
function runDeployment() {
    log('🚀 Starting automated deployment...');
    
    return new Promise((resolve, reject) => {
        exec(`chmod +x ${DEPLOY_SCRIPT} && ${DEPLOY_SCRIPT}`, (error, stdout, stderr) => {
            if (error) {
                log(`❌ Deployment failed: ${error.message}`);
                reject(error);
                return;
            }
            
            if (stderr) {
                log(`⚠️  Deployment warnings: ${stderr}`);
            }
            
            log(`✅ Deployment completed successfully`);
            log(`📝 Deployment output: ${stdout}`);
            resolve(stdout);
        });
    });
}

// Create HTTP server
const server = http.createServer(async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Hub-Signature-256');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // Only handle POST requests to webhook path
    if (req.method !== 'POST' || req.url !== WEBHOOK_PATH) {
        if (req.url === '/health') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'ok', service: 'home-fixed-webhook' }));
            return;
        }
        
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
        return;
    }
    
    // Read request body
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    
    req.on('end', async () => {
        try {
            // Verify webhook signature (if using GitHub)
            const signature = req.headers['x-hub-signature-256'];
            if (WEBHOOK_SECRET !== 'your-webhook-secret-change-this' && !verifySignature(body, signature)) {
                log('❌ Invalid webhook signature');
                res.writeHead(401, { 'Content-Type': 'text/plain' });
                res.end('Unauthorized');
                return;
            }
            
            // Parse webhook payload
            let payload;
            try {
                payload = JSON.parse(body);
            } catch (err) {
                log('❌ Invalid JSON payload');
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Bad Request: Invalid JSON');
                return;
            }
            
            // Check if it's a push to main branch (for GitHub webhooks)
            if (payload.ref && payload.ref !== 'refs/heads/main') {
                log(`ℹ️  Ignoring push to branch: ${payload.ref}`);
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('OK: Ignored (not main branch)');
                return;
            }
            
            // Log webhook info
            const commits = payload.commits || [];
            const commitCount = commits.length;
            const pusher = payload.pusher ? payload.pusher.name : 'unknown';
            
            log(`📨 Webhook received: ${commitCount} commits from ${pusher}`);
            if (commits.length > 0) {
                commits.slice(0, 3).forEach(commit => {
                    log(`   - ${commit.id.substring(0, 7)}: ${commit.message}`);
                });
            }
            
            // Run deployment
            await runDeployment();
            
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('OK: Deployment triggered successfully');
            
        } catch (error) {
            log(`❌ Webhook error: ${error.message}`);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
        }
    });
});

// Start server
server.listen(WEBHOOK_PORT, () => {
    log(`🔗 Home-Fixed webhook server listening on port ${WEBHOOK_PORT}`);
    log(`📍 Webhook URL: http://your-domain.com:${WEBHOOK_PORT}${WEBHOOK_PATH}`);
    log(`📄 Deploy script: ${DEPLOY_SCRIPT}`);
    log(`📋 Log file: ${LOG_FILE}`);
    console.log('');
    console.log('🔧 Setup instructions:');
    console.log(`1. Add webhook in GitHub: http://your-domain.com:${WEBHOOK_PORT}${WEBHOOK_PATH}`);
    console.log(`2. Set webhook secret: ${WEBHOOK_SECRET === 'your-webhook-secret-change-this' ? 'PLEASE CHANGE THE SECRET!' : '✓'}`);
    console.log(`3. Configure for "push" events on main branch`);
    console.log('');
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    log('🛑 Webhook server shutting down...');
    server.close(() => {
        log('✅ Webhook server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    log('🛑 Webhook server interrupted, shutting down...');
    server.close(() => {
        log('✅ Webhook server closed');
        process.exit(0);
    });
});
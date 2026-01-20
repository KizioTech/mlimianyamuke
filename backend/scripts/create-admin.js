#!/usr/bin/env node

/**
 * Admin Account Creation Script
 * 
 * This script allows the developer/lead administrator to create admin accounts securely.
 * Run this script directly on the server when you need to create a new admin account.
 * 
 * Usage: node scripts/create-admin.js
 */

const readline = require('readline');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');
const { User } = require('../models');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

async function createAdmin() {
    try {
        console.log('\n===========================================');
        console.log('  Mlimi Anyamuke - Admin Account Creator  ');
        console.log('===========================================\n');

        // Connect to database
        await sequelize.authenticate();
        console.log('✓ Database connection established\n');

        // Get username
        const username = await question('Enter admin username (min 3 characters): ');

        if (username.length < 3) {
            console.error('✗ Error: Username must be at least 3 characters long');
            process.exit(1);
        }

        // Check if username already exists
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            console.error(`✗ Error: Username "${username}" already exists`);
            process.exit(1);
        }

        // Get password
        const password = await question('Enter admin password (min 6 characters): ');

        if (password.length < 6) {
            console.error('✗ Error: Password must be at least 6 characters long');
            process.exit(1);
        }

        // Confirm password
        const confirmPassword = await question('Confirm password: ');

        if (password !== confirmPassword) {
            console.error('✗ Error: Passwords do not match');
            process.exit(1);
        }

        // Hash password
        console.log('\nHashing password...');
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create admin user
        console.log('Creating admin account...');
        const admin = await User.create({
            username,
            password: hashedPassword,
            role: 'admin'
        });

        console.log('\n✓ Admin account created successfully!');
        console.log('===========================================');
        console.log(`  Username: ${admin.username}`);
        console.log(`  Role: ${admin.role}`);
        console.log(`  ID: ${admin.id}`);
        console.log('===========================================\n');

    } catch (error) {
        console.error('\n✗ Error creating admin account:', error.message);
        process.exit(1);
    } finally {
        rl.close();
        await sequelize.close();
        process.exit(0);
    }
}

// Run the script
createAdmin();

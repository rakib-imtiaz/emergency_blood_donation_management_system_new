require('dotenv').config();
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

const createInitialAdmin = async () => {
    // Check if environment variables are set
    if (!process.env.INITIAL_ADMIN_EMAIL || !process.env.INITIAL_ADMIN_PASSWORD) {
        console.error('Required environment variables are not set:');
        console.error('INITIAL_ADMIN_EMAIL:', process.env.INITIAL_ADMIN_EMAIL);
        console.error('INITIAL_ADMIN_PASSWORD:', process.env.INITIAL_ADMIN_PASSWORD);
        process.exit(1);
    }

    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db('emergencyBloodDonationDB');
        const userCollection = db.collection('user');

        // Check if admin exists
        const adminExists = await userCollection.findOne({ role: 'admin' });
        if (adminExists) {
            console.log('Admin already exists:', adminExists.email);
            return;
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(process.env.INITIAL_ADMIN_PASSWORD, saltRounds);

        // Create admin user
        const adminUser = {
            email: process.env.INITIAL_ADMIN_EMAIL,
            password: hashedPassword,
            name: 'System Administrator',
            role: 'admin',
            createdAt: new Date()
        };

        const result = await userCollection.insertOne(adminUser);
        console.log('Initial admin created successfully:', adminUser.email);

    } catch (error) {
        console.error('Error creating initial admin:', error);
        process.exit(1);
    } finally {
        await client.close();
    }
};

// Run if this script is executed directly
if (require.main === module) {
    createInitialAdmin()
        .then(() => {
            console.log('Setup completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Setup failed:', error);
            process.exit(1);
        });
}

module.exports = createInitialAdmin; 
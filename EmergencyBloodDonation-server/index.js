const express = require('express')
const cors = require('cors');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const bcrypt = require('bcrypt');

//middleware
app.use(cors({
  origin: 'http://localhost:5173', // Your client's URL
  credentials: true
}));
app.use(express.json());

// Change this URI to local MongoDB
const uri = "mongodb://localhost:27017";

// Create a MongoClient
const client = new MongoClient(uri);

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log('MongoDB connection status:', client.topology.isConnected()); // Add this log

    //Database creation
    const userCollection = client.db('emergencyBloodDonationDB').collection('user');
    const donorCollection = client.db('emergencyBloodDonationDB').collection('donor');
    const patientBloodRequestCollection = client.db('emergencyBloodDonationDB').collection('request_blood');
    const donationCollection = client.db('emergencyBloodDonationDB').collection('blood_donations'); // Changed collection name
    const auditLogCollection = client.db('emergencyBloodDonationDB').collection('audit_logs');

    console.log('Collections initialized'); // Add this log

    //-=================================
    //USER related APIS
    //-=================================
    app.post('/user', async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user);
      res.send(result)
    })

    // Update the users endpoint with better logging
    app.get('/user', async (req, res) => {
      try {
        console.log('Fetching users...');
        const users = await userCollection.find().toArray();
        console.log('Found users:', users.length);

        if (!users || users.length === 0) {
          console.log('No users found in database');
        }

        res.send(users || []);
      } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send({ message: error.message });
      }
    });

    //===========================================================
    //  Donor Getting from DB and shwoing in Client
    //===========================================================  
    app.get('/donor', async (req, res) => {
      const cursor = donorCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })




    //===========================================================
    //  Donor Form submitting from client and storing in DB
    //===========================================================
    app.post('/donor', async (req, res) => {
      const donor = req.body;
      const result = await donorCollection.insertOne(donor);
      res.send(result);
    })




    //===========================================================
    // Request Blood Getting from DB and showing in Client side UI
    //===========================================================  
    app.get('/requestblood', async (req, res) => {
      try {
        console.log('Fetching blood requests...');

        const cursor = patientBloodRequestCollection.find();
        const requests = await cursor.toArray();

        console.log(`Found ${requests.length} blood requests`);

        // Format dates and add additional info if needed
        const formattedRequests = requests.map(request => ({
          ...request,
          createdAt: request.createdAt ? new Date(request.createdAt).toLocaleString() : 'N/A',
          status: request.status || 'pending'
        }));

        res.send(formattedRequests);
      } catch (error) {
        console.error('Error fetching blood requests:', error);
        res.status(500).send({
          success: false,
          message: 'Failed to fetch blood requests',
          error: error.message
        });
      }
    });




    //===========================================================
    //Requesting Blood Form submitting from client and storing in DB
    //===========================================================
    app.post('/requestblood', async (req, res) => {
      try {
        console.log('Received blood request:', req.body);

        const requestData = {
          ...req.body,
          createdAt: new Date(),
          status: 'pending'
        };

        const result = await patientBloodRequestCollection.insertOne(requestData);
        console.log('Blood request saved:', result);

        res.send({
          success: true,
          message: 'Blood request submitted successfully',
          requestId: result.insertedId
        });
      } catch (error) {
        console.error('Error saving blood request:', error);
        res.status(500).send({
          success: false,
          message: 'Failed to submit blood request',
          error: error.message
        });
      }
    })



    // app.get('/userprofile/:id',async(req,res)=>{
    //   const id = req.params.id;
    //   const query = {_id: new ObjectId(id)}
    //   const options={
    //     projection: {email:1,name:1,phone:1},
    //   };
    //   const result = await userCollection.findOne(query,options)
    //   res.send(result)
    // })

    // Create/Update user endpoint (combined)
    app.put('/user/:email', async (req, res) => {
      try {
        const email = req.params.email;
        const userData = req.body;

        console.log('Attempting to update/create user:', { email, userData });

        // Using upsert to create if doesn't exist or update if exists
        const result = await userCollection.findOneAndUpdate(
          { email: email },
          { $set: userData },
          {
            upsert: true,
            returnDocument: 'after'
          }
        );

        console.log('User update/create result:', result);
        res.json({ success: true, user: result.value });

      } catch (error) {
        console.error('Server error handling user:', error);
        res.status(500).json({
          success: false,
          message: 'Failed to handle user data',
          error: error.message
        });
      }
    });

    // Get user endpoint
    app.get('/user/:email', async (req, res) => {
      try {
        const email = req.params.email;
        console.log('Fetching user with email:', email);

        const user = await userCollection.findOne({ email: email });

        if (!user) {
          return res.status(404).json({
            success: false,
            message: 'User not found'
          });
        }

        res.json({
          success: true,
          user: user
        });

      } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({
          success: false,
          message: 'Failed to fetch user',
          error: error.message
        });
      }
    });

    // Blood Donation endpoint
    app.post('/blood-donation', async (req, res) => {
      try {
        const donation = req.body;
        console.log('Received donation:', donation);
        const result = await donationCollection.insertOne(donation);
        res.send(result);
      } catch (error) {
        console.error('Error saving donation:', error);
        res.status(500).send({ error: 'Failed to save donation' });
      }
    });

    // Add admin role check middleware
    const isAdmin = async (req, res, next) => {
      try {
        const email = req.query.email;
        console.log('Checking admin access for:', email);

        if (!email) {
          console.log('No email provided in request');
          return res.status(401).send({ message: 'Unauthorized access' });
        }

        const query = { email: email };
        const user = await userCollection.findOne(query);
        console.log('Found user:', user);

        if (!user || user.role !== 'admin') {
          console.log('User is not admin');
          return res.status(403).send({ message: 'Forbidden access' });
        }

        console.log('Admin access granted');
        next();
      } catch (error) {
        console.error('Error in admin check:', error);
        res.status(500).send({ message: error.message });
      }
    }

    // Add admin-related endpoints
    app.get('/users/admin/:email', async (req, res) => {
      try {
        const email = req.params.email;
        console.log('Checking admin status for:', email);

        const query = { email: email };
        const user = await userCollection.findOne(query);
        console.log('Found user:', user);

        const isAdmin = user?.role === 'admin';
        console.log('Is admin:', isAdmin);

        res.send({ admin: isAdmin });
      } catch (error) {
        console.error('Error checking admin status:', error);
        res.status(500).send({ message: error.message });
      }
    });

    // Update the admin stats endpoint
    app.get('/admin/stats', isAdmin, async (req, res) => {
      try {
        console.log('Fetching admin stats...');

        // Get counts from collections
        const [donors, requests, users] = await Promise.all([
          donorCollection.countDocuments(),
          patientBloodRequestCollection.countDocuments(),
          userCollection.countDocuments()
        ]);

        console.log('Stats:', { donors, requests, users });

        const stats = {
          totalDonors: donors || 0,
          totalRequests: requests || 0,
          totalUsers: users || 0
        };

        res.send(stats);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        res.status(500).send({ message: error.message });
      }
    });

    app.get('/admin/donors', isAdmin, async (req, res) => {
      try {
        const donors = await donorCollection.find().toArray();
        res.send(donors || []);
      } catch (error) {
        console.error('Error fetching donors:', error);
        res.status(500).send({ message: error.message });
      }
    });

    app.get('/admin/requests', isAdmin, async (req, res) => {
      try {
        const requests = await patientBloodRequestCollection.find().toArray();
        res.send(requests || []);
      } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).send({ message: error.message });
      }
    });

    // Make user admin
    app.patch('/users/admin/:id', isAdmin, async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          role: 'admin'
        }
      };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // Remove the create-first-admin endpoint and replace with a more secure version
    app.post('/admin/create', isAdmin, async (req, res) => {
      try {
        const { email, name } = req.body;

        // Only existing admins can create new admins
        const requestingAdmin = await userCollection.findOne({
          email: req.query.email,
          role: 'admin'
        });

        if (!requestingAdmin) {
          return res.status(403).send({ message: 'Unauthorized admin creation attempt' });
        }

        // Check if user exists
        let user = await userCollection.findOne({ email });

        if (user) {
          // Update existing user to admin
          await userCollection.updateOne(
            { email },
            {
              $set: {
                role: 'admin',
                updatedAt: new Date(),
                updatedBy: requestingAdmin.email
              }
            }
          );
        } else {
          // Create new admin user
          user = await userCollection.insertOne({
            email,
            name,
            role: 'admin',
            createdAt: new Date(),
            createdBy: requestingAdmin.email
          });
        }

        // Log admin creation for audit
        await auditLogCollection.insertOne({
          action: 'ADMIN_CREATED',
          targetEmail: email,
          performedBy: requestingAdmin.email,
          timestamp: new Date()
        });

        res.send({ success: true, message: 'Admin access granted' });
      } catch (error) {
        console.error('Error in admin creation:', error);
        res.status(500).send({ message: error.message });
      }
    });

    // Simplified admin login endpoint
    app.post('/admin/login', async (req, res) => {
      try {
        const { email, password } = req.body;

        // Find admin user
        const admin = await userCollection.findOne({
          email: email,
          role: 'admin'
        });

        if (!admin) {
          return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
          });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, admin.password);

        if (!isPasswordValid) {
          return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
          });
        }

        res.json({
          success: true,
          user: {
            email: admin.email,
            name: admin.name,
            role: admin.role
          }
        });

      } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({
          success: false,
          message: 'Internal server error'
        });
      }
    });

    // Enhanced dashboard stats endpoint
    app.get('/admin/dashboard-stats', isAdmin, async (req, res) => {
      try {
        // Get basic counts
        const [donors, requests, users] = await Promise.all([
          donorCollection.countDocuments(),
          patientBloodRequestCollection.countDocuments(),
          userCollection.countDocuments()
        ]);

        // Get blood type distribution
        const bloodTypeStats = await donorCollection.aggregate([
          { $group: { _id: "$bloodType", count: { $sum: 1 } } },
          { $project: { name: "$_id", value: "$count" } }
        ]).toArray();

        // Get monthly stats
        const monthlyStats = await Promise.all([
          donorCollection.aggregate([
            {
              $group: {
                _id: { $month: "$createdAt" },
                count: { $sum: 1 }
              }
            }
          ]).toArray(),
          patientBloodRequestCollection.aggregate([
            {
              $group: {
                _id: { $month: "$createdAt" },
                count: { $sum: 1 }
              }
            }
          ]).toArray()
        ]);

        // Get recent activity
        const recentActivity = await Promise.all([
          donorCollection.find().sort({ createdAt: -1 }).limit(5).toArray(),
          patientBloodRequestCollection.find().sort({ createdAt: -1 }).limit(5).toArray()
        ]);

        // Format monthly stats
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const formattedMonthlyStats = months.map((month, index) => ({
          month,
          donations: monthlyStats[0].find(stat => stat._id === index + 1)?.count || 0,
          requests: monthlyStats[1].find(stat => stat._id === index + 1)?.count || 0
        }));

        // Format recent activity
        const formattedActivity = [...recentActivity[0], ...recentActivity[1]]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 10)
          .map(activity => ({
            time: new Date(activity.createdAt).toLocaleString(),
            action: activity.type === 'donation' ? 'Blood Donation' : 'Blood Request',
            user: activity.name,
            status: activity.status || 'pending'
          }));

        res.json({
          totalDonors: donors,
          totalRequests: requests,
          totalUsers: users,
          bloodTypeStats,
          monthlyStats: formattedMonthlyStats,
          recentActivity: formattedActivity
        });

      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).send({ message: error.message });
      }
    });

    // Enhanced user management endpoints
    app.get('/admin/users', isAdmin, async (req, res) => {
      try {
        const users = await userCollection.find().toArray();
        res.send(users || []);
      } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send({ message: error.message });
      }
    });

    app.patch('/admin/users/:userId/role', isAdmin, async (req, res) => {
      try {
        const { userId } = req.params;
        const { role } = req.body;

        await userCollection.updateOne(
          { _id: new ObjectId(userId) },
          { $set: { role, updatedAt: new Date() } }
        );

        res.send({ success: true });
      } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).send({ message: error.message });
      }
    });

    app.patch('/admin/users/:userId/status', isAdmin, async (req, res) => {
      try {
        const { userId } = req.params;
        const { status } = req.body;

        await userCollection.updateOne(
          { _id: new ObjectId(userId) },
          { $set: { status, updatedAt: new Date() } }
        );

        res.send({ success: true });
      } catch (error) {
        console.error('Error updating user status:', error);
        res.status(500).send({ message: error.message });
      }
    });

    app.post('/admin/users/bulk-delete', isAdmin, async (req, res) => {
      try {
        const { userIds } = req.body;
        await userCollection.deleteMany({
          _id: { $in: userIds.map(id => new ObjectId(id)) }
        });
        res.send({ success: true });
      } catch (error) {
        console.error('Error in bulk delete:', error);
        res.status(500).send({ message: error.message });
      }
    });

    app.post('/admin/users/bulk-deactivate', isAdmin, async (req, res) => {
      try {
        const { userIds } = req.body;
        await userCollection.updateMany(
          { _id: { $in: userIds.map(id => new ObjectId(id)) } },
          { $set: { status: 'inactive', updatedAt: new Date() } }
        );
        res.send({ success: true });
      } catch (error) {
        console.error('Error in bulk deactivate:', error);
        res.status(500).send({ message: error.message });
      }
    });

    // Enhanced request management endpoints
    app.patch('/admin/requests/:requestId/status', isAdmin, async (req, res) => {
      try {
        const { requestId } = req.params;
        const { status } = req.body;
        const adminEmail = req.query.email;

        console.log('Received status update request:', {
          requestId,
          status,
          adminEmail
        });

        // Validate inputs
        if (!requestId || !status) {
          console.log('Missing required fields');
          return res.status(400).send({
            success: false,
            message: 'Request ID and status are required'
          });
        }

        // Check if request exists
        const request = await patientBloodRequestCollection.findOne({
          _id: new ObjectId(requestId)
        });

        if (!request) {
          console.log('Request not found:', requestId);
          return res.status(404).send({
            success: false,
            message: 'Request not found'
          });
        }

        // Update the request
        const result = await patientBloodRequestCollection.updateOne(
          { _id: new ObjectId(requestId) },
          {
            $set: {
              status,
              updatedAt: new Date(),
              updatedBy: adminEmail
            }
          }
        );

        console.log('Update result:', result);

        if (result.modifiedCount === 0) {
          return res.status(400).send({
            success: false,
            message: 'No changes were made'
          });
        }

        res.send({
          success: true,
          message: 'Status updated successfully'
        });

      } catch (error) {
        console.error('Error in status update:', error);
        res.status(500).send({
          success: false,
          message: error.message
        });
      }
    });

    app.patch('/admin/requests/:requestId/urgency', isAdmin, async (req, res) => {
      try {
        const { requestId } = req.params;
        const { urgency } = req.body;

        await patientBloodRequestCollection.updateOne(
          { _id: new ObjectId(requestId) },
          {
            $set: {
              urgency,
              updatedAt: new Date(),
              updatedBy: req.query.email
            }
          }
        );

        res.send({ success: true });
      } catch (error) {
        console.error('Error updating request urgency:', error);
        res.status(500).send({ message: error.message });
      }
    });

    app.delete('/admin/requests/:requestId', isAdmin, async (req, res) => {
      try {
        const { requestId } = req.params;
        await patientBloodRequestCollection.deleteOne({ _id: new ObjectId(requestId) });
        res.send({ success: true });
      } catch (error) {
        console.error('Error deleting request:', error);
        res.status(500).send({ message: error.message });
      }
    });

    // Enhanced donor management endpoints
    app.patch('/admin/donors/:donorId/availability', isAdmin, async (req, res) => {
      try {
        const { donorId } = req.params;
        const { status } = req.body;

        const result = await donorCollection.updateOne(
          { _id: new ObjectId(donorId) },
          {
            $set: {
              status,
              updatedAt: new Date(),
              updatedBy: req.query.email
            }
          }
        );

        if (result.modifiedCount === 0) {
          return res.status(400).send({
            success: false,
            message: 'No changes were made'
          });
        }

        res.send({ success: true, message: 'Status updated successfully' });
      } catch (error) {
        console.error('Error updating donor status:', error);
        res.status(500).send({ success: false, message: error.message });
      }
    });

    app.post('/admin/donors/bulk-deactivate', isAdmin, async (req, res) => {
      try {
        const { donorIds } = req.body;
        const result = await donorCollection.updateMany(
          { _id: { $in: donorIds.map(id => new ObjectId(id)) } },
          {
            $set: {
              status: 'unavailable',
              updatedAt: new Date(),
              updatedBy: req.query.email
            }
          }
        );

        res.send({ success: true, message: `${result.modifiedCount} donors deactivated` });
      } catch (error) {
        console.error('Error in bulk deactivate:', error);
        res.status(500).send({ success: false, message: error.message });
      }
    });

    app.delete('/admin/donors/:donorId', isAdmin, async (req, res) => {
      try {
        const { donorId } = req.params;
        const result = await donorCollection.deleteOne({ _id: new ObjectId(donorId) });

        if (result.deletedCount === 0) {
          return res.status(404).send({ success: false, message: 'Donor not found' });
        }

        res.send({ success: true, message: 'Donor deleted successfully' });
      } catch (error) {
        console.error('Error deleting donor:', error);
        res.status(500).send({ success: false, message: error.message });
      }
    });

    // Delete user endpoint
    app.delete('/admin/users/:userId', isAdmin, async (req, res) => {
      try {
        const { userId } = req.params;
        const adminEmail = req.query.email;

        // Validate userId
        if (!userId || !ObjectId.isValid(userId)) {
          return res.status(400).send({
            success: false,
            message: 'Invalid user ID'
          });
        }

        // Get user to be deleted
        const userToDelete = await userCollection.findOne({
          _id: new ObjectId(userId)
        });

        if (!userToDelete) {
          return res.status(404).send({
            success: false,
            message: 'User not found'
          });
        }

        // Prevent self-deletion
        if (userToDelete.email === adminEmail) {
          return res.status(403).send({
            success: false,
            message: 'Cannot delete your own account'
          });
        }

        // Don't allow deleting the last admin
        if (userToDelete.role === 'admin') {
          const adminCount = await userCollection.countDocuments({ role: 'admin' });
          if (adminCount <= 1) {
            return res.status(403).send({
              success: false,
              message: 'Cannot delete the last admin'
            });
          }
        }

        // Delete from MongoDB
        const result = await userCollection.deleteOne({
          _id: new ObjectId(userId)
        });

        if (result.deletedCount === 0) {
          return res.status(400).send({
            success: false,
            message: 'Failed to delete user'
          });
        }

        // Log the deletion
        await auditLogCollection.insertOne({
          action: 'USER_DELETED',
          targetUserId: userId,
          targetEmail: userToDelete.email,
          performedBy: adminEmail,
          timestamp: new Date()
        });

        res.send({
          success: true,
          message: 'User deleted successfully'
        });

      } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send({
          success: false,
          message: error.message || 'Internal server error'
        });
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    console.log("Connected successfully to local MongoDB server");

    // Also check if the database connection is working
    const checkDbConnection = async () => {
      try {
        const collections = await client.db('emergencyBloodDonationDB').listCollections().toArray();
        console.log('Available collections:', collections.map(c => c.name));

        const userCount = await userCollection.countDocuments();
        console.log('Total users in database:', userCount);
      } catch (error) {
        console.error('Database connection check failed:', error);
      }
    };

    // Call this after connecting
    checkDbConnection();
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: err.message
  });
});

app.get('/', (req, res) => {
  res.send('Emergency Blood server runing')
})

app.listen(port, () => {
  console.log(`Blood Donation project running on port ${port}`)
})

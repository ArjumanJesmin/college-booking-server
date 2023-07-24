const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dkozdag.mongodb.net/?retryWrites=true&w=majority`;



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1, // Use the imported ServerApiVersion
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        // Connect the client to the server (optional starting in v4.7)
        // await client.connect();
        const allCollegeCollection = client.db("ourCollege").collection('colleges')
        const classCollection = client.db("ourCollege").collection('admission')
        const usersCollection = client.db("ourCollege").collection('user')


        app.get('/colleges', async (req, res) => {
            const result = await allCollegeCollection.find().toArray();
            res.send(result);
        })

        app.get('/colleges/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await allCollegeCollection.findOne(query);
            res.send(result);
        })

        app.post('/admission', async (req, res) => {
            const item = req.body;
            const result = await classCollection.insertOne(item)
            res.send(result)
        })


        app.get('/admission', async (req, res) => {
            const result = await classCollection.find().toArray();
            res.send(result);
        })

        // -----------------------------------
        // app.post('/admission', async (req, res) => {
        //     const user = req.body;
        //     const query = { email: user.email }
        //     const existingUser = await classCollection.findOne(query);

        //     if (existingUser) {
        //         return res.send({ message: 'user already exists' })
        //     }

        //     const result = await classCollection.insertOne(user);
        //     res.send(result);
        // });

        // app.get('/admission/', async (req, res) => {
        //     let query = {};
        //     if (req.query.name && req.query.email) {
        //         query = { name: req.query.name, email: req.query.email }
        //     } else if (req.query.name) {
        //         query = { name: req.query.name }
        //     } else {
        //         query = { email: req.query.email }
        //     }
        //     const result = await classCollection.find(query).toArray();
        //     res.send(result)
        // })
        // -----------------------------------

        // users related apis
        // app.get('/users',  async (req, res) => {
        //     const result = await usersCollection.find().toArray()
        //     res.send(result)
        // })

        // app.post('/users', async (req, res) => {
        //     const user = req.body;
        //     console.log(user);

        //     const query = { email: user.email }
        //     const existingUser = await usersCollection.findOne(query);
        //     console.log('existing User', existingUser);

        //     if (existingUser) {
        //         return res.send({ message: 'user already exists' })
        //     }
        //     const result = await usersCollection.insertOne(user)
        //     res.sendStatus(result)
        // })
        // ---------------------------------------


        // Users releted apis

        app.get('/users', async (req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result);
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user)
            const query = { email: user.email }
            const existingUser = await usersCollection.findOne(query);
            console.log('ExistingUser', existingUser)

            if (existingUser) {
                return res.send({ message: 'User alerady exists' })
            }
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })

        //===============================================================
        // Send a ping to confirm a successful connection
        await client.db('admin').command({ ping: 1 });
        console.log('Pinged your deployment. You successfully connected to MongoDB!');
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

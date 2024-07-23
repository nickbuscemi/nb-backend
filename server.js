const express = require('express');
const cors = require('cors');
require('dotenv').config();
const nodemailer = require('nodemailer');
const app = express();
const port = process.env.PORT || 5252;

// const { MongoClient, ServerApiVersion } = require('mongodb');

// MongoDB URI and CLIENT setup
// const uri = `mongodb+srv://nickbuscemi13:${process.env.MONGO_DB_PASS}@cluster0.nbvl13g.mongodb.net/?retryWrites=true&w=majority`

/*const client = new MongoClient(uri, {
  serverApi: {
  version: ServerApiVersion.v1,
  strict: true,
  deprecationErrors: true
  }
});*/

// Apply middleware
app.use(cors());
app.use(express.json()); // for parsing application/json

// MongoDB connection function
/* async function connectToMongoDB() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
}*/

// database collectionsB
// const contactFormData = client.db("nickbuscemiPortfolio").collection("contactData");

// nodemailer config
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_USER, // Your email
        pass: process.env.GMAIL_APP_PASS // Your app password
    }
  });
  


app.post('/contact', async (req, res) => {
    try {
        // Assuming req.body is already parsed using app.use(express.json())
        const { firstName, lastName, phone, email, message } = req.body;
        // Email to the client
        const clientMailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: 'Confirmation of Your Submission',
            text: `Hello ${firstName},\n\nThank you for reaching out. I have received your submission and will get back to you soon.\n\nBest Regards,\nNicholas Buscemi.`
        };

        // Email to yourself
        const adminMailOptions = {
            from: email,
            to: process.env.GMAIL_USER, // Your (admin's) email address
            subject: 'New Contact Form Submission',
            text: `New submission received:\n\nName: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phone}\n\nMessage: ${message}`
        };

        // Send emails
        transporter.sendMail(clientMailOptions, function(error, info) {
            if (error) {
            console.error('Error sending email to client:', error);
            } else {
            console.log('Confirmation email sent to client: ' + info.response);
            }
        });

        transporter.sendMail(adminMailOptions, function(error, info) {
            if (error) {
            console.error('Error sending email to admin:', error);
            } else {
            console.log('Email sent to admin: ' + info.response);
            }
        });

        //const result = await contactFormData.insertOne({ firstName, lastName, phone, email, message });

        // Using the previously defined MongoDB collection

        res.status(200).json({ code: 200, message: "Message sent successfully"});
    } catch (error) {
        console.error('Error saving contact form data:', error);
        res.status(500).json({ code: 500, message: "Failed to send message", error: error.toString() });
    }
});





// Start server and connect to MongoDB
app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
    // await connectToMongoDB();
  });
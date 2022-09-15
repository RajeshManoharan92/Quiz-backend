const express = require('express');
const User = require("../model/user")
const Admin = require("../model/admin")
const Questions = require("../model/question")
const contactus = require('../model/contactus')
const answerCount = require('../model/answercount')
const jwt = require("jsonwebtoken")
require('dotenv').config()
const bcrypt = require("bcryptjs")


const router = express.Router();

// Register

router.post("/register", async (req, res) => {

    // Our register logic starts here

    try {
        // Get user input
        const { Role, firstName, lastName, email, password } = req.body;

        if (Role == "User") {

            try {
                const oldUser = await User.findOne({ email });
                if (oldUser) {
                    return res.send("User Exist");
                }

                //Encrypt user password
                encryptedUserPassword = await bcrypt.hash(password, 10);

                // Create user in our database
                const user = await User.create({
                    Role: Role,
                    first_name: firstName,
                    last_name: lastName,
                    email: email.toLowerCase(), // sanitize
                    password: encryptedUserPassword,

                });

                // Create token
                const token = jwt.sign(
                    { user_id: user._id, email },
                    process.env.TOKEN_KEY,
                    {
                        expiresIn: "5h",
                    }
                );
                // save user token
                user.token = token;

                // return new user
                res.status(201).json({ user, message: "Created" });
            }

            catch (err) {
                console.log(err);
            }
            // Our register logic ends here
        }

        else if (Role == "Admin") {

            try {
                const oldAdmin = await Admin.findOne({ email });
                if (oldAdmin) {
                    return res.send("Admin Exist");
                }

                //Encrypt user password
                encryptedUserPassword = await bcrypt.hash(password, 10);

                // Create user in our database
                const admin = await Admin.create({
                    Role: Role,
                    first_name: firstName,
                    last_name: lastName,
                    email: email.toLowerCase(), // sanitize
                    password: encryptedUserPassword,

                });

                // Create token
                const token = jwt.sign(
                    { user_id: admin._id, email },
                    process.env.TOKEN_KEY,
                    {
                        expiresIn: "5h",
                    }
                );
                // save user token
                admin.token = token;

                // return new user
                res.status(201).json({ admin, message: "Created" });
            }

            catch (err) {
                console.log(err);
            }
            // Our register logic ends here
        }

    }
    catch (err) {
        console.log(err);
    }
});


// Get user name

router.post("/getuser", async (req, res) => {

    // Our register logic starts here
    try {
        // Get user input

        const { email } = req.body

        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res.status(201).json(oldUser);;
        }

    } catch (err) {
        console.log(err);
    }
    // Our register logic ends here
});

// Login

router.post("/login", async (req, res) => {

    // Our login logic starts here
    try {
        // Get user input
        const { Role, email, password } = req.body;

        // if role is user

        if (Role == "user") {
            try {

                // Validate if user exist in our database
                const user = await User.findOne({ email });

                if (user && (await bcrypt.compare(password, user.password))) {
                    // Create token
                    const token = jwt.sign(
                        { user_id: user._id, email },
                        process.env.TOKEN_KEY,
                        {
                            expiresIn: "5h",
                        }
                    );

                    // save user token
                    user.token = token;

                    // user
                    return res.status(200).json({ user, message: "UserLoggedin" });
                }
                return res.send('Invalid');

                // Our login logic ends here
            }
            catch (err) {
                console.log(err)

            }
        }

        // if user is admin

        else if (Role == "admin") {
            try {

                // Validate if user exist in our database

                const admin = await Admin.findOne({ email });

                if (admin && (await bcrypt.compare(password, admin.password))) {
                    // Create token
                    const token = jwt.sign(
                        { user_id: admin._id, email },
                        process.env.TOKEN_KEY,
                        {
                            expiresIn: "5h",
                        }
                    );

                    // save user token
                    admin.token = token;

                    // user
                    return res.status(200).json({ admin, message: "AdminLoggedin" });
                }
                return res.send('Invalid');

                // Our login logic ends here
            }
            catch (err) {
                console.log(err)

            }
        }

    }
    catch (err) {
        console.log(err)
    }
});


// set new password 

router.post("/setnewpassword", async function (req, res) {

    try {

        // get user input

        const { Role, email, password } = req.body;

        // if role is user

        if (Role == "User") {

            try {

                // find user in db

                const NoUser = await User.findOne({ email });

                if (!NoUser) {
                    return res.send({ message: 'Not-user' });
                }

                // get id

                var _id = NoUser._id

                // hashing password

                encryptedUserPassword = await bcrypt.hash(password, 10);

                // update password

                const user1 = await User.findByIdAndUpdate({ _id }, { $set: { password: encryptedUserPassword } }, { returnNewDocument: true, new: true })

                return res
                    .status(200)
                    .json({ message: "User - Password changed", user1 });
            }
            catch (err) {
                console.log(err)

            }
        }

        // if role is admin

        if (Role == "Admin") {

            try {

                // find admin in db

                const NoAdmin = await Admin.findOne({ email });

                if (!NoAdmin) {
                    return res.send({ message: 'Not-admin' });
                }

                // get id

                var _id = NoAdmin._id

                // hashing password

                encryptedUserPassword = await bcrypt.hash(password, 10);

                // update password

                const admin = await Admin.findByIdAndUpdate({ _id }, { $set: { password: encryptedUserPassword } }, { returnNewDocument: true, new: true })

                return res
                    .status(200)
                    .json({ message: "Admin - Password changed", admin });
            }
            catch (err) {
                console.log(err)

            }
        }
    }

    catch (err) {
        console.log(err)

    }

})
// to get Quiz Question

router.get("/getQuestion", async function (req, res) {
    try {
        const name = await Questions.find({})
        if (name) {
            res.send(name)
        }
    }
    catch (err) {
        console.log(err)
    }
})

// to post new question

router.post("/postQuestion", async function (req, res) {
    try {
        const { Question, option1, option2, option3, Answer } = req.body;
        const name = await Questions.create({
            Question: Question,
            option1: option1,
            option2: option2,
            option3: option3,
            Answer: Answer,
        })

        if (name) {
            res.send(name)
        }
    }
    catch (err) {
        console.log(err)

    }
})

// to update question

router.put("/updateQuestion/:id", async function (req, res) {
    try {
        const name = await Questions.findByIdAndUpdate(req.params.id, req.body)
        if (name) {
            res.send(name)
        }
    }
    catch (err) {
        console.log(err)
    }
})

// to delete question

router.delete("/deleteQuestion/:id", async function (req, res) {
    try {
        const name = await Questions.findByIdAndDelete(req.params.id)
        if (name) {
            res.send(name)
            return res.send("deleted successfully")
        }
    }
    catch (err) {
        console.log(err)
    }
})

//to post contact us

router.post("/postcontactus", async function (req, res) {
    try {
        const { Username, UserContactNo, questionenquiry } = req.body;
        const contact = await contactus.create({
            Username: Username,
            UserContactNo: UserContactNo,
            questionenquiry: questionenquiry,
        })
        if (contact) {
            res.send(contact)
        }
    }
    catch (err) {
        console.log(err)
    }
})


// to get contact us post

router.get("/getcontactus", async function (req, res) {
    try {
        const contact = await contactus.find({})
        if (contact) {
            res.send(contact)
        }
    }
    catch (err) {
        console.log(err)
    }
})


// to delete contact us post

router.delete("/deletecontactus/:id", async function (req, res) {
    try {
        const contact = await contactus.findOneAndDelete(req.params.id)
        if (contact) {
            res.send(contact)
        }
    }
    catch (err) {
        console.log(err)
    }
})


// to post Answer Count 

router.post("/postAnswerCount", async function (req, res) {
    try {
        const { correctAnswerCount, questionAnswered } = req.body;
        const name = await answerCount.create({
            correctAnswerCount: correctAnswerCount,
            questionAnswered: questionAnswered,
        })

        if (name) {
            res.send(name)
        }
    }
    catch (err) {
        console.log(err)

    }
})


// to get answer count

router.get("/getAnswerCount", async function (req, res) {
    try {
        const name = await answerCount.find({})
        if (name) {
            res.send(name)
        }
    }
    catch (err) {
        console.log(err)
    }
})

module.exports = router;
// const nodemailer = require("nodemailer")

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//           host: 'smtp.gmail.com',
//           port: 465,
//         secure: true,

//   auth: {
//     user: "takshalm@gmail.com",
//     pass: process.env.password,
//   },
//   tls: {
//     rejectUnauthorized: false
//   },
//   // increase the timeout value
//   timeout: 60000
// });

// const sendEmail = (email, subject, message)=> { 
    
//     const mailOptions = {
//         from: "moviesop99@gmail.com",
//         to: email,
//         subject: subject,
//         text: message
//     };
//     transporter.sendMail(mailOptions, function(error, info) {
//         if (error) {
//           console.log("Error hai bhai systum mai!!")
//           console.error(error)
//         } else {
//           console.log("Email sent: " + info.response)
//         }
//     });    
// }

// module.exports = sendEmail
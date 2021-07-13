const express = require("express");
const app = express();
const request = require("request");
const bodyParser = require("body-Parser");
const https = require('https');




app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

//obtain data from main page
app.post("/", function (req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    //arrange data to send to mailchimp servers
    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName,
            }
        }]
    };

    const jsonData = JSON.stringify(data);

    // https request to mailchimp with authorisation method 
    const url = "https://us6.api.mailchimp.com/3.0/lists/981858d846";

    const options = {
        method: "POST",
        auth: "pb:7a8b475d995a6e87c5753de50bbae0a8-us6"
    }

    const request = https.request(url, options, function (response) {
        response.on("data", function (data) {
            console.log(JSON.parse(data));
            console.log(response.statusCode);
            //link to success and failure webpages
            if (response.statusCode === 200) {
                res.sendFile(__dirname + "/success.html");
            } else {
                res.sendFile(__dirname + "/failure.html");
            };
        })
    })
    //information send to mailchimp 
    request.write(jsonData);
    request.end;


});


app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");

});

//redirect to root page from buttom
app.post("/failure", function (req, res) {
    res.redirect("/");
});


app.listen(process.env.PORT || 3000, function () {
    console.log("server is running on port 3000");
});
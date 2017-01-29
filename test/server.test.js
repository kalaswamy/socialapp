const request = require("supertest");
const expect = require("chai").expect;

var app = require("../server/server");

describe ("Get /", () => 
{
    it ("Should Respond Ok", (done) => 
    {
       request(app)
       .get ("/")
       .expect(200, "Hello World")
       .end ((err, res) => 
       {
           if (err) return done(err);
           console.log(res.body);
           //expect(res.body).to.be.a("string");

           done();
       });
    });
});





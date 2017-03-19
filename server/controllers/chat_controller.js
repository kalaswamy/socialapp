

module.exports = {
    index(req, res, next) {
        res.render("chat", { chat_active: 'true', profileimage: "{{profileimage}}", name: "{{name}}", location: "{{location}}" });
    }
}
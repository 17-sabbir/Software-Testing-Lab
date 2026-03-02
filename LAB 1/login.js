function login(username, password) {
    if (username === "" && password === "") {
        return "Required UserName and password Fields";
    }

    // if (username === "") {
    //     return "Empty UserName Fields";
    // }

    if (password === "") {
        return "Empty Password Fields";
    }

    if (username === "admin" && password === "1234") {
        return "Login Successful";
    }

    return "Invalid Credentials";
}

module.exports = login;
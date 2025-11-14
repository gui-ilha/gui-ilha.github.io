import fs from "fs";
import path from "path";

const usersFile = path.resolve("data/users.json");

function loadUsers() {
    return JSON.parse(fs.readFileSync(usersFile, "utf8"));
}

function saveUsers(users) {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 4));
}

export const login = (req, res) => {
    const { username, password } = req.body;
    const users = loadUsers();

    const user = users.find(
        (u) => u.username === username && u.password === password
    );

    if (!user) {
        return res.status(400).json({ message: "Login inválido" });
    }

    res.json({ message: "Login bem-sucedido", user });
};

export const register = (req, res) => {
    const { username, password } = req.body;
    let users = loadUsers();

    if (users.some((u) => u.username === username)) {
        return res.status(400).json({ message: "Usuário já existe" });
    }

    const newUser = { username, password };
    users.push(newUser);
    saveUsers(users);

    res.json({ message: "Usuário criado com sucesso" });
};

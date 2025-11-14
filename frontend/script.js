const startPage = document.getElementById('start');
const loginPage = document.getElementById('login');
const registerPage = document.getElementById('register');
const dashboard = document.getElementById('dashboard');

function show(page){
    [startPage, loginPage, registerPage, dashboard].forEach(p => p.classList.remove('active'));
    page.classList.add('active');
}

// Botões para navegar entre páginas
document.getElementById('btn-login').onclick = () => show(loginPage);
document.getElementById('btn-register').onclick = () => show(registerPage);
document.getElementById('back-login').onclick = () => show(startPage);
document.getElementById('back-register').onclick = () => show(startPage);

// Simulação de login/cadastro com backend
const API_URL = "http://localhost:3000/auth";

document.getElementById('do-login').onclick = async () => {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    if(!username || !password){ alert("Preencha usuário e senha."); return; }

    try {
        const res = await fetch(`${API_URL}/login`,{
            method:"POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({username,password})
        });
        const data = await res.json();
        if(res.ok){
            document.getElementById('user-name').textContent = data.user.username;
            show(dashboard);
        } else {
            alert(data.message);
        }
    } catch(err){
        alert("Erro ao conectar ao servidor");
    }
};

document.getElementById('do-register').onclick = async () => {
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    
    if(!username || !password){ alert("Preencha usuário e senha."); return; }

    try {
        const res = await fetch(`${API_URL}/register`,{
            method:"POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({username,password})
        });
        const data = await res.json();
        if(res.ok){
            alert("Usuário criado com sucesso! Faça login.");
            show(loginPage);
        } else {
            alert(data.message);
        }
    } catch(err){
        alert("Erro ao conectar ao servidor");
    }
};

document.getElementById('logout').onclick = () => {
    show(startPage);
};

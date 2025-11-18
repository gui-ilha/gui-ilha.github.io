
function go(tela) {
    document.querySelectorAll(".screen")
        .forEach(s => s.classList.remove("visible"));
    document.getElementById(tela).classList.add("visible");
}

/* =============== LOGIN =============== */
function login() {
    let user = loginUser.value;
    let senha = loginSenha.value;

    let empresa = JSON.parse(localStorage.getItem("empresa"));

    if (!empresa) return alert("Nenhuma empresa cadastrada!");

    if (user === empresa.usuario && senha === empresa.senha) {
        go("telaPainelAdmin");
        return;
    }

    let users = JSON.parse(localStorage.getItem("usuarios")) || [];
    let encontrado = users.find(u => u.usuario === user && u.senha === senha);

    if (encontrado) {
        alert("Login de usuário interno realizado!");
        go("telaUpload");
        return;
    }

    alert("Usuário ou senha inválidos!");
}

/* =============== MÁSCARA CNPJ =============== */
empresaCNPJ.addEventListener("input", () => {
    let v = empresaCNPJ.value.replace(/\D/g, "");
    if (v.length >= 3) v = v.replace(/(\d{2})(\d)/, "$1.$2");
    if (v.length >= 6) v = v.replace(/(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    if (v.length >= 9) v = v.replace(/\.(\d{3})(\d)/, ".$1/$2");
    if (v.length >= 13) v = v.replace(/(\d{4})(\d)/, "$1-$2");
    empresaCNPJ.value = v;
});

/* =============== MÁSCARA CPF =============== */
userCPF.addEventListener("input", () => {
    let v = userCPF.value.replace(/\D/g, "");
    if (v.length >= 4) v = v.replace(/(\d{3})(\d)/, "$1.$2");
    if (v.length >= 7) v = v.replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
    if (v.length >= 11) v = v.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
    userCPF.value = v;
});

/* =============== CADASTRO EMPRESA =============== */
function cadastrarEmpresa() {
    let razao = empresaRazao.value;
    let fantasia = empresaFantasia.value;
    let cnpj = empresaCNPJ.value;
    let usuario = empresaUsuario.value;
    let s1 = empresaSenha.value;
    let s2 = empresaSenha2.value;

    if (s1 !== s2) return alert("As senhas não coincidem!");

    let empresa = { razao, fantasia, cnpj, usuario, senha: s1 };

    localStorage.setItem("empresa", JSON.stringify(empresa));

    alert("Empresa cadastrada com sucesso!");
    go("telaLogin");
}

/* =============== CADASTRAR USUÁRIO =============== */
function cadastrarUsuario() {
    let cpf = userCPF.value;
    let usuario = userNome.value;
    let senha = userSenha.value;

    let lista = JSON.parse(localStorage.getItem("usuarios")) || [];
    lista.push({ cpf, usuario, senha });

    localStorage.setItem("usuarios", JSON.stringify(lista));

    alert("Usuário cadastrado!");
    go("telaPainelAdmin");
}

/* =============== LISTAR USUÁRIOS =============== */
function abrirListaUsuarios() {
    const lista = JSON.parse(localStorage.getItem("usuarios")) || [];
    const box = document.getElementById("listaUsuariosBox");

    if (lista.length === 0) {
        box.innerHTML = "Nenhum usuário cadastrado ainda.";
        return;
    }

    box.innerHTML = ""; // limpa antes de adicionar
    lista.forEach((u, i) => {
        const div = document.createElement("div");
        div.classList.add("user-item");
        div.innerHTML = `
            • ${u.usuario} (CPF: ${u.cpf})
            <button class="delete-btn">X</button>
        `;

        // Adiciona evento de clique para remover
        div.querySelector(".delete-btn").addEventListener("click", () => {
            removerUsuario(i);
        });

        box.appendChild(div);
    });

    go("telaListaUsuarios");
}


function removerUsuario(index) {
    const lista = JSON.parse(localStorage.getItem("usuarios")) || [];
    if (!lista[index]) return;

    lista.splice(index, 1); // remove o usuário
    localStorage.setItem("usuarios", JSON.stringify(lista)); // salva
    abrirListaUsuarios(); // atualiza a lista
}



/* =============== PREVIEW DE IMAGEM =============== */
function previewImage() {
    let file = uploadInput.files[0];
    if (!file) return;

    let img = document.getElementById("preview");
    img.src = URL.createObjectURL(file);
    img.style.display = "block";
}

/* =============== ENVIAR IA (placeholder) =============== */
async function enviarParaIA() {
    const file = document.getElementById("uploadInput").files[0];
    if (!file) return alert("Selecione uma imagem!");

    const chatBox = document.getElementById("chatBox");

    const reader = new FileReader();
    reader.onload = async function() {
        const base64Img = reader.result;

        // Mensagem do usuário no chat
        const userMsg = document.createElement("div");
        userMsg.classList.add("msg", "user");
        userMsg.textContent = "Imagem enviada para análise...";
        chatBox.appendChild(userMsg);
        chatBox.scrollTop = chatBox.scrollHeight;

        try {
            const resp = await fetch("https://backend-ih3b.onrender.com/analise", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ imagem: base64Img })
            });

            const data = await resp.json();

            const gptMsg = document.createElement("div");
            gptMsg.classList.add("msg", "gpt");
            gptMsg.textContent = data.resultado || "Erro ao interpretar resposta";
            chatBox.appendChild(gptMsg);
            chatBox.scrollTop = chatBox.scrollHeight;

        } catch (err) {
            console.error(err);
            alert("Erro ao enviar imagem para análise.");
        }
    };

    reader.readAsDataURL(file);
}


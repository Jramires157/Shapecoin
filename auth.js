// auth.js - Versão Força Bruta
import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// Monitora se o usuário JÁ está logado ao abrir a página
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Usuário detectado:", user.email);
        // Força o redirecionamento se já estiver logado
        window.location.replace("dashboard.html");
    }
});

const form = document.getElementById('authForm');
const msg = document.getElementById('msg');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const btn = document.getElementById('submitBtn');

    msg.textContent = "Processando...";
    msg.style.color = "yellow";
    btn.disabled = true; // Evita clique duplo

    try {
        // Tenta Logar
        await signInWithEmailAndPassword(auth, email, password);
        msg.textContent = "Login Sucesso! Entrando...";
        msg.style.color = "green";
        
        // REDIRECIONAMENTO MANUAL E FORÇADO
        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1000);

    } catch (error) {
        // Se der erro, verifica se é usuário inexistente e CRIA A CONTA
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
            try {
                msg.textContent = "Criando nova conta...";
                await createUserWithEmailAndPassword(auth, email, password);
                
                msg.textContent = "Conta Criada! Entrando...";
                msg.style.color = "green";
                
                setTimeout(() => {
                    window.location.href = "dashboard.html";
                }, 1000);
                
            } catch (createError) {
                // Erro real na criação
                console.error(createError);
                msg.textContent = "Erro ao criar: " + createError.message;
                msg.style.color = "red";
                btn.disabled = false;
            }
        } else {
            // Outro erro (ex: senha errada para e-mail existente)
            console.error(error);
            msg.textContent = "Erro: " + error.message;
            msg.style.color = "red";
            btn.disabled = false;
        }
    }
});
});

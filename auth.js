// auth.js
import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// Se já estiver logado, manda pro painel
onAuthStateChanged(auth, (user) => {
    if (user) window.location.href = 'dashboard.html';
});

document.getElementById('authForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const msg = document.getElementById('msg');

    try {
        // Tenta logar
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        // Se der erro de "usuário não encontrado", tenta criar a conta
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
            try {
                await createUserWithEmailAndPassword(auth, email, password);
                alert("Conta criada com sucesso! Bem-vindo ao time.");
            } catch (createError) {
                msg.textContent = "Erro: " + createError.message;
                msg.style.color = "red";
            }
        } else {
            msg.textContent = "Senha incorreta ou erro no servidor.";
            msg.style.color = "red";
        }
    }
});
import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// Se já estiver logado, avisa e entra
onAuthStateChanged(auth, (user) => {
    if (user) {
        alert("Já logado como: " + user.email);
        window.location.href = 'dashboard.html';
    }
});

const form = document.getElementById('authForm');
const msg = document.getElementById('msg');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    msg.textContent = "Tentando conectar...";

    try {
        // Tenta Logar
        await signInWithEmailAndPassword(auth, email, password);
        alert("LOGIN SUCESSO! Redirecionando...");
        window.location.href = "dashboard.html";

    } catch (error) {
        // Se der erro, mostra o código exato no alerta
        alert("ERRO: " + error.code + "\n" + error.message);

        // Se o erro for "usuário não encontrado", tenta criar
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
            try {
                const confirmCreate = confirm("Usuário não existe. Criar nova conta?");
                if (confirmCreate) {
                    await createUserWithEmailAndPassword(auth, email, password);
                    alert("CONTA CRIADA! Entrando...");
                    window.location.href = "dashboard.html";
                }
            } catch (createError) {
                alert("ERRO AO CRIAR: " + createError.code + "\n" + createError.message);
            }
        }
    }
});

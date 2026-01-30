// dashboard.js
import { auth, db } from './firebase-config.js';
import { signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { doc, getDoc, setDoc, updateDoc, increment, collection, addDoc, query, where, getDocs, orderBy, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

let currentUser = null;

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = 'index.html';
        return;
    }
    currentUser = user;
    document.getElementById('userEmail').textContent = user.email.split('@')[0];
    loadBalance();
    loadHistory();
});

// Carregar Saldo
async function loadBalance() {
    const docRef = doc(db, "users", currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        document.getElementById('coins').textContent = docSnap.data().coins || 0;
    } else {
        // Cria perfil se não existir
        await setDoc(docRef, { coins: 0 });
    }
}

// === LÓGICA DO ANÚNCIO ===
window.startAdProcess = function() {
    const modal = document.getElementById('adModal');
    const timer = document.getElementById('timer');
    let timeLeft = 5;
    
    modal.style.display = 'flex';
    timer.textContent = timeLeft;

    const interval = setInterval(() => {
        timeLeft--;
        timer.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(interval);
            modal.style.display = 'none';
            saveWorkout(); // Só salva depois do tempo acabar
        }
    }, 1000);
}

// Salvar Treino
async function saveWorkout() {
    const type = document.getElementById('workoutType').value;
    const value = parseInt(document.getElementById('intensity').value);

    // 1. Salva no histórico
    await addDoc(collection(db, "history"), {
        uid: currentUser.uid,
        type: type,
        value: value,
        date: serverTimestamp()
    });

    // 2. Dá o dinheiro
    await updateDoc(doc(db, "users", currentUser.uid), {
        coins: increment(value)
    });

    alert(`Sucesso! Você ganhou ${value} moedas.`);
    loadBalance();
    loadHistory();
}

// Carregar Histórico
async function loadHistory() {
    const q = query(collection(db, "history"), where("uid", "==", currentUser.uid), orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);
    const list = document.getElementById('historyList');
    list.innerHTML = "";
    
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        list.innerHTML += `<div class="activity-item">
            <span>${data.type.toUpperCase()}</span>
            <span style="color:var(--primary)">+${data.value}</span>
        </div>`;
    });
}

window.logout = () => signOut(auth);
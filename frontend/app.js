const API_URL = 'http://localhost:3333'
let token = localStorage.getItem('token')

document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault()
    const data = {
        nome: e.target.nome.value,
        email: e.target.email.value,
        senha: e.target.senha.value
    }
    
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    
    if (response.ok) {
        alert('Cadastro realizado! Faça login.')
    } else {
        alert('Erro no cadastro')
    }
})

document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault()
    const data = {
        email: e.target.email.value,
        senha: e.target.senha.value
    }
    
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    
    if (response.ok) {
        const result = await response.json()
        token = result.token
        localStorage.setItem('token', token)
        document.getElementById('loggedIn').style.display = 'block'
        document.getElementById('loginForm').style.display = 'none'
        document.getElementById('registerForm').style.display = 'none'
    } else {
        alert('Login falhou')
    }
})

async function listarPEVs() {
    const response = await fetch(`${API_URL}/pevs`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    
    if (response.ok) {
        const pevs = await response.json()
        let html = '<h3>Pontos de Entrega Voluntária</h3><ul>'
        pevs.forEach(pev => {
            html += `<li>${pev.nome} - ${pev.descricao}</li>`
        })
        html += '</ul>'
        document.body.innerHTML += html
    }
}

async function mostrarFormEntrega() {
    const html = `
        <h3>Registrar Entrega de Recicláveis</h3>
        <form id="entregaForm">
            <input type="text" placeholder="ID do PEV" name="pevId" required>
            <input type="file" name="imagem" accept="image/*">
            <button type="submit">Registrar</button>
        </form>
    `
    document.body.innerHTML += html
    
    document.getElementById('entregaForm').addEventListener('submit', async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('pevId', e.target.pevId.value)
        if (e.target.imagem.files[0]) {
            formData.append('imagem', e.target.imagem.files[0])
        }
        
        const response = await fetch(`${API_URL}/entregas`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        })
        
        if (response.ok) {
            alert('Entrega registrada! +10 pontos')
        }
    })
}
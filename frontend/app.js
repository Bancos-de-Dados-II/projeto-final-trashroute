const API_URL = 'http://localhost:3333'

function el(id) { return document.getElementById(id) }

function esconder(id) {
  const d = el(id)
  if (!d) return
  d.classList.add('hidden')
  d.style.display = 'none'
}

function mostrar(id) {
  const d = el(id)
  if (!d) return
  d.classList.remove('hidden')
  d.style.display = 'block'
}

function pageType() { return document.body?.dataset?.page || '' }

function getToken() { return localStorage.getItem('tokenTWS') }

function getUser() {
  try { return JSON.parse(localStorage.getItem('user') || 'null') }
  catch { return null }
}

async function readPayload(res) {
  const ct = res.headers.get('content-type') || ''
  if (ct.includes('application/json')) return res.json().catch(() => ({}))
  return res.text().catch(() => '')
}

function unwrapArray(payload) {
  if (Array.isArray(payload)) return payload
  if (payload && Array.isArray(payload.data)) return payload.data
  if (payload && payload.data && Array.isArray(payload.data.data)) return payload.data.data
  return []
}

async function api(path, opts = {}) {
  const token = getToken()
  const headers = new Headers(opts.headers || {})
  if (token && !headers.has('Authorization')) headers.set('Authorization', `Bearer ${token}`)
  return fetch(`${API_URL}${path}`, { ...opts, headers })
}

async function apiJson(path, opts = {}) {
  const res = await api(path, opts)
  const payload = await readPayload(res)
  return { res, ok: res.ok, payload }
}

function logout() {
  localStorage.clear()
  window.location.href = 'index.html'
}

function escapeHtml(str) {
  return String(str ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function renderEmptyState(title, subtitle) {
  return `
    <div class="card soft">
      <div class="row" style="justify-content:space-between; gap:12px;">
        <div>
          <h2 style="margin:0">${escapeHtml(title)}</h2>
          <p class="sub" style="margin:6px 0 0">${escapeHtml(subtitle)}</p>
        </div>
      </div>
    </div>
  `
}

function renderSectionHeader(title, subtitle, closeFn) {
  return `
    <div class="row" style="justify-content:space-between; gap:12px;">
      <div>
        <h2 style="margin:0">${escapeHtml(title)}</h2>
        ${subtitle ? `<p class="sub" style="margin:6px 0 0">${escapeHtml(subtitle)}</p>` : ``}
      </div>
      <button class="btn btn-danger" onclick="${closeFn}()"> X </button>
    </div>
    <div class="divider"></div>
  `
}

let pevsVisivel = false
async function togglePEVs() {
  const div = el('resultado')
  if (!div) return

  if (pevsVisivel) {
    esconder('resultado')
    pevsVisivel = false
    return
  }

  try {
    const { ok, payload } = await apiJson('/pevs')
    if (!ok) throw new Error(payload?.message || 'Erro ao carregar PEVs')

    const pevs = unwrapArray(payload)
    const isAdmin = pageType() === 'admin'

    if (!pevs.length) {
      div.innerHTML = renderEmptyState('PEVs', 'Nenhum PEV encontrado.')
      mostrar('resultado')
      pevsVisivel = true
      return
    }

    let html = renderSectionHeader('PEVs', 'Lista de pontos de entrega', 'togglePEVs')
    html += `<ul class="list">`

    pevs.forEach(pev => {
      const coords = pev?.localizacao?.coordinates || []
      const lon = coords[0]
      const lat = coords[1]

      const nome = escapeHtml(pev?.nome || '')
      const desc = escapeHtml(pev?.descricao || '')
      const id = escapeHtml(pev?._id || '')

      html += `
        <li class="row" style="justify-content:space-between; gap:12px; align-items:flex-start;">
          <div>
            <div class="row" style="gap:8px; flex-wrap:wrap; align-items:center;">
              <strong>${nome}</strong>
              ${desc ? `<span class="badge">${desc}</span>` : ``}
            </div>
            <p class="sub" style="margin:6px 0 0">Lat: ${lat ?? ''} • Lon: ${lon ?? ''}</p>
          </div>

          ${isAdmin ? `
            <div class="row" style="gap:8px; flex-wrap:wrap; justify-content:flex-end;">
              <button class="btn btn-edit" onclick="editarPEV('${id}')">Editar</button>
              <button class="btn btn-danger" onclick="excluirPEV('${id}')">Excluir</button>
            </div>
          ` : ``}
        </li>
      `
    })

    html += `</ul>`

    div.innerHTML = html
    mostrar('resultado')
    pevsVisivel = true
  } catch (err) {
    console.error(err)
    alert('Erro de conexão')
  }
}

function renderEntregaForm(containerId, closeFnName) {
  const div = el(containerId)
  if (!div) return

  div.innerHTML = `
    ${renderSectionHeader('Registrar entrega', 'Envie uma imagem e selecione um PEV', closeFnName)}

    <form id="entregaForm" class="form-grid">
      <div>
        <label>PEV</label>
        <select name="pevId" required>
          <option value="">Carregando...</option>
        </select>
      </div>

      <div class="form-grid two">
        <div>
          <label>Imagem</label>
          <input type="file" name="imagem" accept="image/*" />
        </div>
        <div>
          <label>Observação</label>
          <input type="text" name="observacao" placeholder="Opcional" />
        </div>
      </div>

      <div class="actions">
        <button class="btn btn-primary" type="submit">Registrar</button>
      </div>
    </form>
  `
}

async function preencherSelectPevs(selectEl) {
  if (!selectEl) throw new Error('Select de PEV não encontrado')

  const { ok, payload } = await apiJson('/pevs')
  if (!ok) throw new Error(payload?.message || 'Erro ao carregar PEVs')

  const pevs = unwrapArray(payload)

  let options = '<option value="">Selecione um PEV</option>'
  pevs.forEach(pev => {
    if (pev?._id) options += `<option value="${escapeHtml(pev._id)}">${escapeHtml(pev?.nome || '')}</option>`
  })

  selectEl.innerHTML = options
}

function bindEntregaSubmit() {
  const form = document.getElementById('entregaForm')
  if (!form || form.dataset.bound === '1') return
  form.dataset.bound = '1'

  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const pevId = e.target?.pevId?.value
    if (!pevId) return alert('Selecione um PEV')

    const formData = new FormData()
    formData.append('pevId', pevId)

    const file = e.target?.imagem?.files?.[0]
    if (file) formData.append('imagem', file)

    const { ok, payload } = await apiJson('/entregas', { method: 'POST', body: formData })

    if (ok) {
      alert('Entrega registrada! +10 pontos')
      e.target.reset()
    } else {
      console.error(payload)
      alert(payload?.message || 'Erro ao registrar entrega')
    }
  })
}

let entregaVisivelUser = false
async function mostrarFormEntrega() {
  const div = el('entregaContainer')
  if (!div) return

  if (div.style.display === 'block') {
    esconder('entregaContainer')
    entregaVisivelUser = false
    return
  }

  try {
    renderEntregaForm('entregaContainer', 'esconderEntregaUser')
    const select = document.querySelector('#entregaContainer select[name="pevId"]')
    await preencherSelectPevs(select)
    mostrar('entregaContainer')
    entregaVisivelUser = true
    bindEntregaSubmit()
  } catch (err) {
    console.error(err)
    alert('Erro de conexão')
  }
}

function esconderEntregaUser() {
  esconder('entregaContainer')
  entregaVisivelUser = false
}

let entregaVisivelAdmin = false
async function toggleFormEntrega() {
  const div = el('entregaContainer')
  if (!div) return

  if (entregaVisivelAdmin) {
    esconder('entregaContainer')
    entregaVisivelAdmin = false
    return
  }

  try {
    renderEntregaForm('entregaContainer', 'toggleFormEntrega')
    const select = document.querySelector('#entregaContainer select[name="pevId"]')
    await preencherSelectPevs(select)
    mostrar('entregaContainer')
    entregaVisivelAdmin = true
    bindEntregaSubmit()
  } catch (err) {
    console.error(err)
    alert('Erro de conexão')
  }
}

let entregasVisivel = false
async function toggleMinhasEntregas() {
  const div = el('minhasEntregas')
  if (!div) return

  if (entregasVisivel) {
    esconder('minhasEntregas')
    entregasVisivel = false
    return
  }

  try {
    const { ok, payload } = await apiJson('/entregas/minhas')
    if (!ok) throw new Error(payload?.message || 'Erro ao carregar entregas')

    const entregas = unwrapArray(payload)

    if (!entregas.length) {
      div.innerHTML = renderEmptyState('Minhas entregas', 'Você ainda não registrou entregas.')
      mostrar('minhasEntregas')
      entregasVisivel = true
      return
    }

    let html = renderSectionHeader('Minhas entregas', 'Histórico de registros', 'toggleMinhasEntregas')
    html += `<ul class="list">`

    entregas.forEach(entrega => {
      const nomePev =
        entrega?.pevId?.nome ||
        entrega?.pev?.nome ||
        entrega?.pevNome ||
        (typeof entrega?.pevId === 'string' ? entrega.pevId : '') ||
        'PEV'

      const dt = entrega?.dataEntrega ? new Date(entrega.dataEntrega).toLocaleString() : ''
      html += `
        <li>
          <div class="row" style="justify-content:space-between; gap:12px; flex-wrap:wrap;">
            <div>
              Entrega no PEV: <strong>${escapeHtml(nomePev)}</strong>
              ${dt ? `<p class="sub" style="margin:6px 0 0">${escapeHtml(dt)}</p>` : ``}
            </div>
            <span class="badge">${escapeHtml(entrega?.status || 'PENDENTE')}</span>
          </div>
        </li>
      `
    })

    html += `</ul>`

    div.innerHTML = html
    mostrar('minhasEntregas')
    entregasVisivel = true
  } catch (err) {
    console.error(err)
    alert('Erro de conexão')
  }
}

let usuariosVisivel = false
async function toggleUsuarios() {
  const div = el('usuariosContainer')
  if (!div) return

  if (usuariosVisivel) {
    esconder('usuariosContainer')
    usuariosVisivel = false
    return
  }

  try {
    const { ok, payload } = await apiJson('/usuarios')
    if (!ok) throw new Error(payload?.message || 'Erro ao listar usuários')

    const usuarios = unwrapArray(payload)

    if (!usuarios.length) {
      div.innerHTML = renderEmptyState('Usuários', 'Nenhum usuário encontrado.')
      mostrar('usuariosContainer')
      usuariosVisivel = true
      return
    }

    let html = renderSectionHeader('Usuários', 'Gerenciamento (promover/excluir)', 'toggleUsuarios')
    html += `<ul class="list">`

    usuarios.forEach(u => {
      const role = u?.role || u?.isAdmin || ''
      const id = escapeHtml(u?._id || u?.id || '')
      const nome = escapeHtml(u?.nome || '')
      const email = escapeHtml(u?.email || '')

      const badgeText =
        role === 'ADMIN' || role === 's' || role === true || role === 'true'
          ? 'ADMIN'
          : String(role || 'USER')

      html += `
        <li class="row" style="justify-content:space-between; gap:12px; align-items:flex-start;">
          <div>
            <div class="row" style="gap:8px; flex-wrap:wrap; align-items:center;">
              <strong>${nome}</strong>
              <span class="badge">${escapeHtml(badgeText)}</span>
            </div>
            <p class="sub" style="margin:6px 0 0">${email}</p>
          </div>

          <div class="row" style="gap:8px; flex-wrap:wrap; justify-content:flex-end;">
            <button class="btn btn-ghost" onclick="adminUsuario('${id}')">Tornar Admin</button>
            <button class="btn btn-danger" onclick="excluirUsuario('${id}')">Excluir</button>
          </div>
        </li>
      `
    })

    html += `</ul>`

    div.innerHTML = html
    mostrar('usuariosContainer')
    usuariosVisivel = true
  } catch (err) {
    console.error(err)
    alert('Erro de conexão')
  }
}

async function refreshUsuarios() {
  usuariosVisivel = false
  esconder('usuariosContainer')
  await toggleUsuarios()
}

async function adminUsuario(id) {
  const ok = confirm('Tem certeza que deseja tornar este usuário ADMIN?')
  if (!ok) return

  const { res, payload } = await apiJson(`/usuarios/${id}/admin`, { method: 'PATCH' })
  if (!res.ok) return alert(payload?.message || 'Erro ao promover usuário')

  alert(payload?.message || 'Usuário promovido com sucesso')
  refreshUsuarios()
}

async function excluirUsuario(id) {
  const ok = confirm('Tem certeza que deseja excluir este usuário? Essa ação não pode ser desfeita.')
  if (!ok) return

  const { res, payload } = await apiJson(`/usuarios/${id}`, { method: 'DELETE' })
  if (!res.ok) return alert(payload?.message || 'Erro ao excluir usuário')

  alert(payload?.message || 'Usuário excluído')
  refreshUsuarios()
}

let formPevVisivel = false
function toggleFormPEV() {
  const div = el('formPEV')
  if (!div) return

  if (formPevVisivel) {
    esconder('formPEV')
    formPevVisivel = false
    return
  }

  div.innerHTML = `
    ${renderSectionHeader('Criar novo PEV', 'Preencha os dados abaixo', 'toggleFormPEV')}

    <form id="pevForm" class="form-grid">
      <div class="form-grid two">
        <div>
          <label>Nome</label>
          <input type="text" placeholder="Nome do PEV" name="nome" required />
        </div>
        <div>
          <label>Descrição</label>
          <input type="text" placeholder="Opcional" name="descricao" />
        </div>
      </div>

      <div class="form-grid two">
        <div>
          <label>Latitude</label>
          <input type="number" step="any" placeholder="-23.0000" name="latitude" required />
        </div>
        <div>
          <label>Longitude</label>
          <input type="number" step="any" placeholder="-46.0000" name="longitude" required />
        </div>
      </div>

      <div class="actions">
        <button class="btn btn-primary" type="submit">Criar PEV</button>
      </div>
    </form>
  `

  mostrar('formPEV')
  formPevVisivel = true

  const form = document.getElementById('pevForm')
  if (form.dataset.bound === '1') return
  form.dataset.bound = '1'

  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const data = {
      nome: e.target?.nome?.value || '',
      descricao: e.target?.descricao?.value || '',
      latitude: Number(e.target?.latitude?.value),
      longitude: Number(e.target?.longitude?.value)
    }

    const { res, payload } = await apiJson('/pevs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    if (res.ok) {
      alert('PEV criado com sucesso!')
      e.target.reset()
      toggleFormPEV()
      if (pevsVisivel) {
        pevsVisivel = false
        esconder('resultado')
        await togglePEVs()
      }
    } else {
      alert('Erro: ' + (payload?.message || 'Desconhecido'))
    }
  })
}

async function editarPEV(id) {
  try {
    const { ok, payload } = await apiJson(`/pevs/${id}`)
    if (!ok) return alert(payload?.message || 'Erro ao carregar dados do PEV')

    const pev = payload?.data || payload
    const coords = pev?.localizacao?.coordinates || []
    const longitude = coords[0]
    const latitude = coords[1]

    const div = el('formPEV')
    if (!div) return

    div.innerHTML = `
      ${renderSectionHeader('Editar PEV', 'Atualize os campos e salve', 'toggleFormPEV')}

      <form id="editPevForm" class="form-grid">
        <div class="form-grid two">
          <div>
            <label>Nome</label>
            <input type="text" placeholder="Nome do PEV" name="nome" value="${escapeHtml(pev?.nome || '')}" required />
          </div>
          <div>
            <label>Descrição</label>
            <input type="text" placeholder="Opcional" name="descricao" value="${escapeHtml(pev?.descricao || '')}" />
          </div>
        </div>

        <div class="form-grid two">
          <div>
            <label>Latitude</label>
            <input type="number" step="any" placeholder="-23.0000" name="latitude" value="${latitude ?? ''}" required />
          </div>
          <div>
            <label>Longitude</label>
            <input type="number" step="any" placeholder="-46.0000" name="longitude" value="${longitude ?? ''}" required />
          </div>
        </div>

        <div class="actions">
          <button class="btn btn-ghost" type="button" onclick="toggleFormPEV()">Cancelar</button>
          <button class="btn btn-primary" type="submit">Salvar alterações</button>
        </div>
      </form>
    `

    mostrar('formPEV')
    formPevVisivel = true

    const form = document.getElementById('editPevForm')
    if (form.dataset.bound === '1') return
    form.dataset.bound = '1'

    form.addEventListener('submit', async (e) => {
      e.preventDefault()

      const data = {
        nome: e.target?.nome?.value || '',
        descricao: e.target?.descricao?.value || '',
        latitude: Number(e.target?.latitude?.value),
        longitude: Number(e.target?.longitude?.value)
      }

      const { res, payload } = await apiJson(`/pevs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (res.ok) {
        alert(payload?.message || 'PEV atualizado com sucesso!')
        toggleFormPEV()
        if (pevsVisivel) {
          pevsVisivel = false
          esconder('resultado')
          await togglePEVs()
        }
      } else {
        alert('Erro: ' + (payload?.message || 'Desconhecido'))
      }
    })
  } catch (err) {
    console.error(err)
    alert('Erro de conexão')
  }
}

async function excluirPEV(id) {
  const ok = confirm('Tem certeza que deseja excluir este PEV?')
  if (!ok) return

  try {
    const { res, payload } = await apiJson(`/pevs/${id}`, { method: 'DELETE' })

    if (res.ok) {
      alert(payload?.message || 'PEV excluído com sucesso!')
      if (pevsVisivel) {
        pevsVisivel = false
        esconder('resultado')
        await togglePEVs()
      }
    } else {
      alert('Erro: ' + (payload?.message || 'Desconhecido'))
    }
  } catch (err) {
    console.error(err)
    alert('Erro de conexão')
  }
}

function bindAuth() {
  const registerForm = el('registerForm')
  if (registerForm && registerForm.dataset.bound !== '1') {
    registerForm.dataset.bound = '1'
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault()

      const data = {
        nome: e.target?.nome?.value || '',
        email: e.target?.email?.value || '',
        senha: e.target?.senha?.value || ''
      }

      try {
        const res = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })

        const payload = await readPayload(res)

        if (res.ok) {
          alert(payload?.message || 'Cadastro realizado! Faça login.')
          e.target.reset()
        } else {
          alert('Erro: ' + (payload?.message || 'Desconhecido'))
        }
      } catch (err) {
        console.error(err)
        alert('Erro de conexão')
      }
    })
  }

  const loginForm = el('loginForm')
  if (loginForm && loginForm.dataset.bound !== '1') {
    loginForm.dataset.bound = '1'
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault()

      const data = { email: e.target?.email?.value || '', senha: e.target?.senha?.value || '' }

      try {
        const res = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })

        const payload = await readPayload(res)
        if (!res.ok) return alert(payload?.message || 'Login falhou')

        const user = payload?.data?.user || payload?.user
        const tokenTWS = payload?.data?.tokenTWS || payload?.tokenTWS

        if (!tokenTWS || !user) return alert('Login falhou: resposta inválida')

        localStorage.setItem('tokenTWS', String(tokenTWS))
        localStorage.setItem('user', JSON.stringify(user))

        if (user?.isAdmin === 's') {
          window.location.href = 'admin.html'
          return
        }

        esconder('authForms')
        mostrar('loggedIn')

        const w = el('welcomeUser')
        if (w) w.innerText = `Olá ${user?.nome || ''}, seja bem-vindo!`
      } catch (err) {
        console.error(err)
        alert('Erro de conexão')
      }
    })
  }
}

function initUserPage() {
  bindAuth()

  const user = getUser()
  const token = getToken()

  if (user && token && token !== 'null') {
    esconder('authForms')
    mostrar('loggedIn')
    const w = el('welcomeUser')
    if (w) w.innerText = `Olá ${user?.nome || ''}, seja bem-vindo!`
  }
}

function initAdminPage() {
  const token = getToken()
  const user = getUser()

  if (!token || token === 'null' || !(user?.isAdmin === 's')) {
    alert('Acesso negado. Faça login como admin.')
    window.location.href = 'index.html'
  }
}

window.esconder = esconder
window.mostrar = mostrar
window.logout = logout
window.togglePEVs = togglePEVs
window.mostrarFormEntrega = mostrarFormEntrega
window.toggleFormEntrega = toggleFormEntrega
window.toggleMinhasEntregas = toggleMinhasEntregas
window.toggleUsuarios = toggleUsuarios
window.toggleFormPEV = toggleFormPEV
window.editarPEV = editarPEV
window.excluirPEV = excluirPEV
window.adminUsuario = adminUsuario
window.excluirUsuario = excluirUsuario
window.esconderEntregaUser = esconderEntregaUser

document.addEventListener('DOMContentLoaded', () => {
  if (pageType() === 'admin') initAdminPage()
  if (pageType() === 'user') initUserPage()
})

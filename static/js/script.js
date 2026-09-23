/* ==========================================================================
   NEUROMUNDO - SISTEMA CENTRALIZADO & MOTOR DE IA ADAPTATIVA (COPILOT IA)
   Arquitectura: Grado Clínico, Soporte Sensorial & InterACTION Neuroinclusiva
   ========================================================================== */

// --------------------------------------------------------------------------
// 2. INTERFAZ Y CONTROLADOR DEL COPILOT IA (CHAT UI)
// --------------------------------------------------------------------------
function abrirChatBot() {
    const modal = document.getElementById('chatModal') || document.getElementById('chat-ia-modal');
    if (modal) {
        modal.classList.remove('hidden');
        const input = document.getElementById('chatInput') || document.getElementById('chat-input');
        if (input) input.focus();
    }
}

// Cierra la interfaz visual del modal de chat
function cerrarChatBot() {
    const modal = document.getElementById('chatModal') || document.getElementById('chat-ia-modal');
    if (modal) modal.classList.add('hidden');
}

// Extrae el texto, genera respuestas del motor e incluye efectos de carga
function enviarMensajeChat() {
    const input = document.getElementById('chatInput') || document.getElementById('chat-input');
    const container = document.getElementById('chatMessages') || document.getElementById('chat-messages');

    if (!input || !container) return;
    const texto = input.value.trim();
    if (!texto) return;

    agregarBurbujaMensaje(texto, 'user', container);
    input.value = '';

    const typingId = 'typing-' + Date.now();
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ia typing-indicator';
    typingDiv.id = typingId;
    typingDiv.innerHTML = `<span>NeuroMundo está procesando</span> <span class="dots">...</span>`;
    container.appendChild(typingDiv);
    container.scrollTop = container.scrollHeight;

    setTimeout(() => {
        const elementoTyping = document.getElementById(typingId);
        if (elementoTyping) elementoTyping.remove();

        const respuestaIA = NeuroCopilotEngine.procesar(texto);
        agregarBurbujaMensaje(respuestaIA.texto, 'ia', container, respuestaIA.chips);
    }, 650);
}

// Inserta elementos en el DOM y mapea los botones interactivos finales
function agregarBurbujaMensaje(contenidoMarkdown, tipo, contenedor, chips = []) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${tipo}`;
    
    let html = contenidoMarkdown
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');

    msgDiv.innerHTML = html;
    contenedor.appendChild(msgDiv);

    if (chips && chips.length > 0) {
        const chipContainer = document.createElement('div');
        chipContainer.className = 'ia-chips-container';
        
        chips.forEach(chipText => {
            const botonChip = document.createElement('button');
            botonChip.className = 'chip-action-btn';
            botonChip.innerText = chipText;
            botonChip.onclick = () => {
                const input = document.getElementById('chatInput') || document.getElementById('chat-input');
                if (input) {
                    input.value = chipText;
                    enviarMensajeChat();
                }
            };
            chipContainer.appendChild(botonChip);
        });
        contenedor.appendChild(chipContainer);
    }
    
    contenedor.scrollTop = container.scrollHeight;
}

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector(".reddit-search-input");

    if (searchInput) {
        searchInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                const query = searchInput.value.trim();
                if (query !== "") {
                    alert("Buscando: " + query);
                }
            }
        });
    }
});

function toggleAcc(btn) {
            const card = btn.parentElement;
            card.classList.toggle('abierto');
        }

        function cambiarTab(id, el) {
            // Ocultar todas las secciones
            document.querySelectorAll('.seccion-app').forEach(s => s.classList.remove('activa'));
            // Mostrar la sección seleccionada
            document.getElementById(id).classList.add('activa');

            // Actualizar estado de las pestañas superiores
            const pestanas = document.querySelectorAll('.boton-pestana');
            pestanas.forEach(p => p.classList.remove('activa'));
            
            // Actualizar estado del menú inferior
            const navs = document.querySelectorAll('.nav-item');
            navs.forEach(n => n.classList.remove('activo'));

            // Marcar elemento activo según dónde hizo clic
            if (el.classList.contains('boton-pestana')) {
                el.classList.add('activa');
            }
        }


        // <!-- LOGICA JAVASCRIPT INTERACTIVA ESTILO REDDIT -->
        // Sistema de Votación UPVOTE / DOWNVOTE
        function votar(btn, delta) {
            const sidebar = btn.parentElement;
            const countElem = sidebar.querySelector('.vote-count');
            let count = parseInt(countElem.innerText);

            if (btn.classList.contains('active')) {
                btn.classList.remove('active');
                count -= delta;
            } else {
                sidebar.querySelectorAll('.vote-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                count += delta;
            }
            countElem.innerText = count;
        }

        // Mostrar / Ocultar Hilo de Comentarios
        function toggleComments(threadId) {
            const thread = document.getElementById(threadId);
            thread.style.display = thread.style.display === 'none' ? 'block' : 'none';
        }

        // Agregar comentario interactivo con ENTER
        function agregarComentario(e, inputElem, threadId) {
            if (e.key === 'Enter' && inputElem.value.trim() !== '') {
                const thread = document.getElementById(threadId);
                const nuevoComentario = document.createElement('div');
                nuevoComentario.className = 'comment-item';
                nuevoComentario.innerHTML = `<strong>u/Tú:</strong> ${inputElem.value.trim()}`;
                
                thread.insertBefore(nuevoComentario, inputElem.parentElement);
                
                // Actualizar contador
                const card = thread.closest('.reddit-post-card');
                const commentCount = card.querySelector('.comment-count');
                commentCount.innerText = parseInt(commentCount.innerText) + 1;

                inputElem.value = '';
            }
        }

        // Crear una nueva publicación dinámicamente
        function crearPublicacionReddit() {
            const input = document.getElementById('reddit-post-input');
            const texto = input.value.trim();

            if (!texto) return;

            const feed = document.getElementById('posts-feed');
            const newId = 'comments-' + Date.now();

            const postHTML = `
                <article class="reddit-post-card">
                    <div class="vote-sidebar">
                        <button class="vote-btn upvote" onclick="votar(this, 1)">▲</button>
                        <span class="vote-count">1</span>
                        <button class="vote-btn downvote" onclick="votar(this, -1)">▼</button>
                    </div>
                    <div class="post-main-content">
                        <div class="post-header-meta">
                            <span class="community-tag">r/Comunidad</span>
                            <span class="meta-dot">•</span>
                            <span class="post-author">u/Tú</span>
                            <span class="post-time">Ahora mismo</span>
                        </div>
                        <p class="reddit-post-body">${texto}</p>
                        <div class="reddit-post-actions">
                            <button class="reddit-action-btn" onclick="toggleComments('${newId}')">
                                💬 <span class="comment-count">0</span> Comentarios
                            </button>
                            <button class="reddit-action-btn" onclick="compartirPost()">🔗 Compartir</button>
                        </div>
                        <div id="${newId}" class="reddit-comments-thread" style="display: none;">
                            <div class="comment-input-box">
                                <input type="text" placeholder="Escribe un comentario..." onkeypress="agregarComentario(event, this, '${newId}')">
                            </div>
                        </div>
                    </div>
                </article>
            `;

            feed.insertAdjacentHTML('afterbegin', postHTML);
            input.value = '';
        }

        function compartirPost() {
            alert("¡Enlace copiado al portapapeles!");
        }

        
    function enviarMensaje() {
        const texto = chatInput.value.trim();
        if (!texto) return;

        agregarMensaje(texto, 'user');
        chatInput.value = '';

        setTimeout(() => {
            const respuesta = generarRespuestaIA(texto);
            agregarMensaje(respuesta, 'ia');
        }, 800);
    }

    function agregarMensaje(texto, tipo) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', tipo);
        msgDiv.textContent = texto;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function generarRespuestaIA(prompt) {
        const p = prompt.toLowerCase();
        if (p.includes('pictograma') || p.includes('imagen')) {
            return "🎨 He generado la secuencia de pictogramas para tu consulta. Puedes verla en el panel de pictogramas.";
        } else if (p.includes('calma') || p.includes('crisis') || p.includes('estres')) {
            return "🧘 Te recomiendo activar el 'Espacio de Calma y Descompresión' con ejercicios de respiración de 4 tiempos.";
        } else if (p.includes('rutina') || p.includes('agenda')) {
            return "📅 Puedes estructurar esta actividad en la 'Agenda Visual Diaria' para reducir la ansiedad.";
        } else {
            return "🤖 Entendido. Como asistente de NeuroMundo, sugiero revisar las herramientas de apoyo o adaptar la actividad con apoyos visuales.";
        }
    };

    /* ==========================================================================
   SISTEMA DE MODO PC / ESCRITORIO FORZADO
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Cargar estado del modo PC desde localStorage
    const savedViewMode = localStorage.getItem('neuromundo-view-mode');
    if (savedViewMode === 'pc') {
        document.body.classList.add('pc-mode');
        actualizarBotonVistaPC(true);
    } else {
        actualizarBotonVistaPC(false);
    }
});

function toggleViewMode() {
    const isPCMode = document.body.classList.toggle('pc-mode');
    
    // Guardar preferencia en localStorage
    localStorage.setItem('neuromundo-view-mode', isPCMode ? 'pc' : 'mobile');
    
    // Actualizar estado visual del botón
    actualizarBotonVistaPC(isPCMode);
    
    // Scroll al inicio para mejor experiencia visual
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function actualizarBotonVistaPC(isPCMode) {
    const viewToggle = document.getElementById('view-toggle');
    if (!viewToggle) return;
    
    if (isPCMode) {
        viewToggle.classList.add('active');
        viewToggle.setAttribute('aria-pressed', 'true');
        viewToggle.setAttribute('aria-label', 'Cambiar a vista móvil');
    } else {
        viewToggle.classList.remove('active');
        viewToggle.setAttribute('aria-pressed', 'false');
        viewToggle.setAttribute('aria-label', 'Cambiar a vista de escritorio');
    }
}

/* ==========================================================================
   SISTEMA DE TEMA BOOTSTRAP - DATA-BS-THEME
   ========================================================================== */

// Script de inicialización inmediata (ejecuta antes de DOMContentLoaded)
(function() {
    try {
        // Verificar tema guardado en localStorage
        const savedTheme = localStorage.getItem('themeMode');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Determinar tema inicial (prioridad: guardado > sistema > light)
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        
        // Aplicar tema inmediatamente al elemento raíz (evita parpadeo)
        document.documentElement.setAttribute('data-bs-theme', initialTheme);
        
        // Mantener compatibilidad con clase dark-theme existente
        if (initialTheme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    } catch (e) {
        console.warn('Error en inicialización inmediata del tema:', e);
        // Fallback a light mode si hay error
        document.documentElement.setAttribute('data-bs-theme', 'light');
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    // Sincronizar estado visual del botón después de cargar el DOM
    sincronizarBotonesTema();
    
    // Escuchar cambios en las preferencias del sistema operativo
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        // Solo cambiar si el usuario no ha establecido preferencia manual
        if (!localStorage.getItem('themeMode')) {
            aplicarTema(e.matches ? 'dark' : 'light');
        }
    });
});

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    aplicarTema(newTheme);
}

function aplicarTema(theme) {
    // Aplicar atributo nativo de Bootstrap
    document.documentElement.setAttribute('data-bs-theme', theme);
    
    // Guardar en localStorage
    localStorage.setItem('themeMode', theme);
    
    // Mantener compatibilidad con clase dark-theme existente
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
    
    // Sincronizar botones
    sincronizarBotonesTema();
}

function sincronizarBotonesTema() {
    const isDark = document.documentElement.getAttribute('data-bs-theme') === 'dark';
    const themeToggles = document.querySelectorAll('#theme-toggle, .theme-toggle-animated');
    
    themeToggles.forEach(toggleBtn => {
        toggleBtn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
        toggleBtn.setAttribute('aria-label', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
        
        const themeText = toggleBtn.querySelector('.btn-caption') || document.getElementById('theme-text');
        if (themeText) {
            themeText.textContent = isDark ? 'Oscuro' : 'Claro';
        }
        
        // Cambiar icono según el estado (Bootstrap Icons)
        const iconContainer = toggleBtn.querySelector('.icon-container');
        if (iconContainer) {
            const sunIcon = iconContainer.querySelector('.sun-icon');
            const moonIcon = iconContainer.querySelector('.moon-icon');
            
            if (sunIcon && moonIcon) {
                if (isDark) {
                    // Modo oscuro: mostrar sol (para cambiar a claro)
                    sunIcon.style.opacity = '1';
                    sunIcon.style.transform = 'rotate(0deg) scale(1)';
                    sunIcon.style.color = 'var(--brand-accent)';
                    moonIcon.style.opacity = '0';
                    moonIcon.style.transform = 'rotate(90deg) scale(0.5)';
                } else {
                    // Modo claro: mostrar luna (para cambiar a oscuro)
                    sunIcon.style.opacity = '0';
                    sunIcon.style.transform = 'rotate(-90deg) scale(0.5)';
                    moonIcon.style.opacity = '1';
                    moonIcon.style.transform = 'rotate(0deg) scale(1)';
                    moonIcon.style.color = '#ffffff';
                }
            }
        }
    });
}

// ==========================================================================
// 2. LÓGICA DEL PANEL DESPLEGABLE (BOTTOM SHEET) CORREGIDA
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    
    // Obtenemos los elementos del DOM
    const btnOpenAgenda = document.getElementById('open-agenda-sheet');
    const agendaSheet = document.getElementById('agenda-sheet');
    
    // Opcional: Si tienes un botón para cerrar dentro del panel
    const btnCloseAgenda = document.querySelector('.sheet-close-btn'); 
    // Opcional: El fondo oscuro para cerrar al hacer clic afuera
    const sheetBackdrop = document.querySelector('.sheet-backdrop');

    // Evento para ABRIR el panel
    // La condición 'if' evita errores si el botón no existe en la página actual
    if (btnOpenAgenda && agendaSheet) {
        btnOpenAgenda.addEventListener('click', () => {
            agendaSheet.classList.add('is-active');
        });
    }

    // Evento para CERRAR el panel desde el botón 'X' (si existe)
    if (btnCloseAgenda && agendaSheet) {
        btnCloseAgenda.addEventListener('click', () => {
            agendaSheet.classList.remove('is-active');
        });
    }

    // Evento para CERRAR el panel al hacer clic en el fondo oscuro
    if (sheetBackdrop && agendaSheet) {
        sheetBackdrop.addEventListener('click', () => {
            agendaSheet.classList.remove('is-active');
        });
    }

});

document.addEventListener('DOMContentLoaded', () => {
    const openBtn = document.getElementById('open-agenda-sheet');
    const closeBtn = document.getElementById('close-agenda-sheet');
    const sheet = document.getElementById('agenda-sheet');
    const backdrop = document.getElementById('sheet-backdrop');

    function openSheet() {
        if (!sheet) return;
        sheet.classList.add('active');
        sheet.setAttribute('aria-hidden', 'false');
        if (openBtn) openBtn.setAttribute('aria-expanded', 'true');
    }

    function closeSheet() {
        if (!sheet) return;
        sheet.classList.remove('active');
        sheet.setAttribute('aria-hidden', 'true');
        if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
    }

    if (openBtn) openBtn.addEventListener('click', openSheet);
    if (closeBtn) closeBtn.addEventListener('click', closeSheet);
    if (backdrop) backdrop.addEventListener('click', closeSheet);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sheet && sheet.classList.contains('active')) {
            closeSheet();
        }
    });
});

// =========================================================
// LOGICA DE DESPLIEGUE: SEMÁFORO SENSORIAL
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Seleccionamos los elementos del DOM
  const tarjetaSemaforo = document.querySelector('.tarjeta-modulo-app.alertas');
  
  if (tarjetaSemaforo) {
    const btnVerCasos = tarjetaSemaforo.querySelector('.boton-app-primario');
    // Asumimos que la vista de detalle es el siguiente elemento hermano o lo buscamos por clase
    const vistaDetalle = document.querySelector('.seccion-contenido'); 

    // 2. Nos aseguramos de que inicie oculto al cargar la página
    vistaDetalle.classList.add('oculto');

    // 3. Agregamos el evento de clic
    btnVerCasos.addEventListener('click', () => {
      // Alternamos la clase 'oculto'
      const estaOculto = vistaDetalle.classList.toggle('oculto');
      
      // 4. Actualizamos el texto del botón según el estado
      if (estaOculto) {
        btnVerCasos.textContent = 'Ver Casos y Validación Científica';
        // Opcional: Remover clase activa de la tarjeta si cambias bordes/sombras
        tarjetaSemaforo.classList.remove('tarjeta-activa'); 
      } else {
        btnVerCasos.textContent = 'Ocultar Información Clínica';
        tarjetaSemaforo.classList.add('tarjeta-activa');
        
        // Hacemos un scroll suave hacia el contenido para mejor UX
        vistaDetalle.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }
});
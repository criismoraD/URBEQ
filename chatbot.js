/**
 * URBEQ Chatbot - Asistente virtual para comprensión de proyectos y cotizaciones
 * Cambia de imagen según el contexto emocional de la conversación
 */

(function() {
    'use strict';

    // Configuración del chatbot
    const CONFIG = {
        nombre: 'Urbi',
        empresa: 'URBEQ',
        imagenes: {
            default: 'img%20bot/01-explicando.png',
            bienvenida: 'img%20bot/05-mostrando.png',
            explicando: 'img%20bot/01-explicando.png',
            ensenando: 'img%20bot/05-mostrando.png',
            contrato: 'img%20bot/02-contrato.png',
            contacto: 'img%20bot/04-llamando%20con%20el%20celular.png',
            feliz: 'img%20bot/03-salto%20de%20alegria.png',
            confirmar: 'img%20bot/06-pulgar%20arriba.png'
        },
        proyectos: {
            'palma real': {
                nombre: 'Palma Real',
                ubicacion: 'Pimentel, cerquita al mar',
                precioTotal: 85000,
                cuotaDesde: 580,
                caracteristicas: ['Lotes desde 160m²', 'Cerca de la playa', 'Agua y luz', 'Papeles al día'],
                url: 'proyecto-palma-real.html'
            },
            'requemar': {
                nombre: 'Reque Mar',
                ubicacion: 'Reque, sur de Chiclayo',
                precioTotal: 72000,
                cuotaDesde: 490,
                caracteristicas: ['Lotes desde 140m²', 'Zona en crecimiento', 'Plusvalía garantizada', 'Financiamiento directo'],
                url: 'proyecto-requemar.html'
            },
            'reque': {
                nombre: 'Reque Mar',
                ubicacion: 'Reque, sur de Chiclayo',
                precioTotal: 72000,
                cuotaDesde: 490,
                caracteristicas: ['Lotes desde 140m²', 'Zona en crecimiento', 'Plusvalía garantizada', 'Financiamiento directo'],
                url: 'proyecto-requemar.html'
            }
        }
    };

    // Estado de la conversación
    let estado = {
        paso: 'inicio',
        contexto: 'bienvenida',
        datosCotizacion: {
            proyecto: null,
            nombre: null,
            telefono: null,
            email: null,
            presupuesto: null,
            cuotaInicial: null
        },
        historial: []
    };

    // Base de conocimiento para respuestas
    const KNOWLEDGE_BASE = {
        saludos: ['hola', 'buenos dias', 'buenas tardes', 'buenas noches', 'hey', 'saludos', 'que tal', 'como estas'],
        proyectos: ['proyecto', 'proyectos', 'lotes', 'casas', 'terrenos', 'palma real', 'requemar', 'reque', 'pimentel'],
        cotizacion: ['cotizar', 'cotizacion', 'precio', 'cuota', 'mensual', 'financiamiento', 'pagar', 'inicial', 'cuotas'],
        legales: ['legal', 'papeles', 'sunarp', 'titulo', 'escritura', 'minuta', 'tramites', 'documentos', 'inscrito'],
        servicios: ['agua', 'luz', 'desague', 'servicios', 'luz electrica', 'electricidad'],
        ubicacion: ['ubicacion', 'donde esta', 'como llegar', 'direccion', 'mapa', 'ubicado'],
        contacto: ['contacto', 'telefono', 'whatsapp', 'llamar', 'escribir', 'correo', 'email', 'comunicar'],
        despedidas: ['adios', 'chau', 'hasta luego', 'nos vemos', 'bye', 'hasta pronto'],
        agradecimientos: ['gracias', 'muy amable', 'te agradezco', 'mil gracias', 'muchas gracias', 'excelente', 'muy bien', 'buen trabajo', 'bien hecho', 'perfecto', 'me ayudaste mucho', 'eres lo maximo', 'me encantas'],
        ayuda: ['ayuda', 'help', 'soporte', 'asistencia', 'que puedes hacer', 'funciones', 'capacidades']
    };

    // Crear elementos del DOM
    function crearChatbotUI() {
        const chatbotContainer = document.createElement('div');
        chatbotContainer.id = 'urbeq-chatbot';
        chatbotContainer.innerHTML =
            '<div class="chatbot-floating-btn" id="chatbot-toggle">' +
                '<span class="material-symbols-outlined">smart_toy</span>' +
                '<span class="chatbot-notification">1</span>' +
            '</div>' +
            '<div class="chatbot-window" id="chatbot-window">' +
                '<div class="chatbot-header">' +
                    '<div class="chatbot-avatar">' +
                        '<img src="img%20bot/01-explicando.png" alt="' + CONFIG.nombre + '" id="chatbot-avatar-img">' +
                    '</div>' +
                    '<div class="chatbot-info">' +
                        '<h4>' + CONFIG.nombre + '</h4>' +
                        '<span class="status">● En línea</span>' +
                    '</div>' +
                    '<div class="chatbot-actions">' +
                        '<button id="chatbot-minimize" title="Minimizar">' +
                            '<span class="material-symbols-outlined">remove</span>' +
                        '</button>' +
                        '<button id="chatbot-close" title="Cerrar">' +
                            '<span class="material-symbols-outlined">close</span>' +
                        '</button>' +
                    '</div>' +
                '</div>' +
                '<div class="chatbot-messages" id="chatbot-messages"></div>' +
                '<div class="chatbot-quick-actions" id="chatbot-quick-actions"></div>' +
                '<div class="chatbot-input-area">' +
                    '<input type="text" id="chatbot-input" placeholder="Escribe tu mensaje..." autocomplete="off">' +
                    '<button id="chatbot-send" title="Enviar">' +
                        '<span class="material-symbols-outlined">send</span>' +
                    '</button>' +
                '</div>' +
            '</div>';
        document.body.appendChild(chatbotContainer);

        document.getElementById('chatbot-toggle').addEventListener('click', toggleChatbot);
        document.getElementById('chatbot-minimize').addEventListener('click', minimizeChatbot);
        document.getElementById('chatbot-close').addEventListener('click', closeChatbot);
        document.getElementById('chatbot-send').addEventListener('click', enviarMensaje);
        document.getElementById('chatbot-input').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') enviarMensaje();
        });
    }

    function toggleChatbot() {
        const windowEl = document.getElementById('chatbot-window');
        const toggle = document.getElementById('chatbot-toggle');
        const notification = toggle.querySelector('.chatbot-notification');
        
        if (windowEl.classList.contains('active')) {
            windowEl.classList.remove('active');
        } else {
            windowEl.classList.add('active');
            notification.style.display = 'none';
            if (estado.historial.length === 0) {
                mostrarMensajeBienvenida();
            }
            setTimeout(function() { document.getElementById('chatbot-input').focus(); }, 100);
        }
    }

    function minimizeChatbot() {
        document.getElementById('chatbot-window').classList.remove('active');
    }

    function closeChatbot() {
        document.getElementById('chatbot-window').classList.remove('active');
    }

    function cambiarImagen(contexto) {
        // Solo actualiza el estado, la imagen se muestra en cada mensaje
        estado.contexto = contexto;
    }

    function agregarMensaje(texto, tipo, opciones) {
        const container = document.getElementById('chatbot-messages');
        const mensaje = document.createElement('div');
        mensaje.className = 'message ' + tipo;

        const hora = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

        if (tipo === 'bot') {
            // Mensaje del bot con imagen de contexto a la derecha
            const imagenContexto = CONFIG.imagenes[estado.contexto] || CONFIG.imagenes.default;
            mensaje.innerHTML =
                '<div class="message-content">' +
                    '<p>' + texto + '</p>' +
                    '<span class="message-time">' + hora + '</span>' +
                '</div>' +
                '<div class="message-context-image">' +
                    '<img src="' + imagenContexto + '" alt="Urbi">' +
                '</div>';
        } else {
            // Mensaje del usuario (sin imagen)
            mensaje.innerHTML =
                '<div class="message-content">' +
                    '<p>' + texto + '</p>' +
                    '<span class="message-time">' + hora + '</span>' +
                '</div>';
        }

        container.appendChild(mensaje);
        container.scrollTop = container.scrollHeight;

        estado.historial.push({ tipo: tipo, texto: texto, tiempo: new Date() });

        if (opciones && opciones.length > 0) {
            mostrarOpcionesRapidas(opciones);
        }
    }

    function mostrarOpcionesRapidas(opciones) {
        const container = document.getElementById('chatbot-quick-actions');
        container.innerHTML = '';
        
        opciones.forEach(function(opcion) {
            const btn = document.createElement('button');
            btn.className = 'quick-action-btn';
            btn.textContent = opcion.texto;
            btn.onclick = function() {
                agregarMensaje(opcion.texto, 'user');
                procesarRespuesta(opcion.valor || opcion.texto);
                container.innerHTML = '';
            };
            container.appendChild(btn);
        });
    }

    function mostrarMensajeBienvenida() {
        cambiarImagen('bienvenida');
        const hora = new Date().getHours();
        let saludo = '¡Hola!';
        if (hora < 12) saludo = '¡Buenos días!';
        else if (hora < 18) saludo = '¡Buenas tardes!';
        else saludo = '¡Buenas noches!';

        const mensaje = saludo + '<br><br>' +
            'Soy <strong>Urbi</strong>, tu asistente de URBEQ. 🏡<br><br>' +
            'Estoy aquí para ayudarte paso a paso.<br><br>' +
            'Solo escribe lo que necesitas y yo te entiendo.<br>' +
            'Por ejemplo, puedes escribir:<br>' +
            '• "Quiero ver casas"<br>' +
            '• "Cuánto cuesta"<br>' +
            '• "Necesito ayuda"<br><br>' +
            'También puedes hacer clic en los botones de abajo 👇';

        agregarMensaje(mensaje, 'bot', [
            { texto: '🏠 Ver casas y terrenos', valor: 'proyectos' },
            { texto: '💰 Saber precios', valor: 'cotizar' },
            { texto: '❓ Tengo dudas', valor: 'faq' }
        ]);
    }

    function enviarMensaje() {
        const input = document.getElementById('chatbot-input');
        const texto = input.value.trim();
        
        if (!texto) return;
        
        agregarMensaje(texto, 'user');
        input.value = '';
        
        mostrarEscribiendo();
        
        setTimeout(function() {
            ocultarEscribiendo();
            procesarRespuesta(texto);
        }, 800 + Math.random() * 500);
    }

    function mostrarEscribiendo() {
        const container = document.getElementById('chatbot-messages');
        const typing = document.createElement('div');
        typing.id = 'typing-indicator';
        typing.className = 'message bot typing';
        typing.innerHTML =
            '<div class="message-content">' +
                '<div class="typing-dots">' +
                    '<span></span><span></span><span></span>' +
                '</div>' +
            '</div>';
        container.appendChild(typing);
        container.scrollTop = container.scrollHeight;
    }

    function ocultarEscribiendo() {
        const typing = document.getElementById('typing-indicator');
        if (typing) typing.remove();
    }

    function procesarRespuesta(texto) {
        const lowerText = texto.toLowerCase();

        // ===== 1. MANEJAR CONTEXTO DE COTIZACIÓN PRIMERO =====
        if (estado.paso === 'cotizacion_proyecto') {
            // Si está seleccionando proyecto para cotizar
            if (contieneAlguna(lowerText, ['palma real', 'pimentel', 'playa'])) {
                estado.datosCotizacion.proyecto = 'palma real';
                continuarCotizacionInicial();
                return;
            }
            if (contieneAlguna(lowerText, ['reque', 'requemar'])) {
                estado.datosCotizacion.proyecto = 'requemar';
                continuarCotizacionInicial();
                return;
            }
            if (contieneAlguna(lowerText, ['no se', 'cualquiera', 'los dos', 'ambos', 'indiferente'])) {
                estado.datosCotizacion.proyecto = 'indefinido';
                continuarCotizacionInicial();
                return;
            }
            // Si no reconoce el proyecto, pedir de nuevo
            cambiarImagen('editar');
            agregarMensaje(
                'Perdón, no entendí bien. 😊<br><br>' +
                'Dime solo:<br>' +
                '• "Palma Real" (el de la playa)<br>' +
                '• "Reque Mar" (el de Reque)<br>' +
                '• O "No sé aún"',
                'bot',
                [
                    { texto: '🏖️ Palma Real', valor: 'cotizar palma real' },
                    { texto: '📈 Reque Mar', valor: 'cotizar requemar' },
                    { texto: '🤔 No sé aún', valor: 'cotizar indefinido' }
                ]
            );
            return;
        }

        if (estado.paso === 'cotizacion_inicial') {
            // Detectar porcentaje de cuota inicial
            const numeros = lowerText.match(/\d+/g);
            if (numeros && numeros.length > 0) {
                const numero = parseInt(numeros[0]);
                if (numero >= 5 && numero <= 50) {
                    estado.datosCotizacion.cuotaInicial = numero;
                    continuarCotizacionPlazo();
                    return;
                }
            }
            // Si escribe palabras
            if (contieneAlguna(lowerText, ['minima', 'poco', 'lo menos', '5', '10'])) {
                estado.datosCotizacion.cuotaInicial = 10;
                continuarCotizacionPlazo();
                return;
            }
            if (contieneAlguna(lowerText, ['maxima', 'mucho', 'todo', '50'])) {
                estado.datosCotizacion.cuotaInicial = 50;
                continuarCotizacionPlazo();
                return;
            }
            // No entendió
            cambiarImagen('editar');
            agregarMensaje(
                'Dime solo un número entre 5 y 50.<br>' +
                'Por ejemplo: "10" o "20".<br><br>' +
                'Eso sería el porcentaje que pagarías al inicio.',
                'bot',
                [
                    { texto: '💰 10% (mínimo)', valor: 'inicial 10' },
                    { texto: '💰 20%', valor: 'inicial 20' },
                    { texto: '💰 30%', valor: 'inicial 30' }
                ]
            );
            return;
        }

        if (estado.paso === 'cotizacion_plazo') {
            // Detectar número de meses o años
            const numeros = lowerText.match(/\d+/g);
            if (numeros && numeros.length > 0) {
                let numero = parseInt(numeros[0]);
                // Si dice años, convertir a meses
                if (lowerText.includes('año') || lowerText.includes('anos')) {
                    numero = numero * 12;
                }
                if (numero >= 12 && numero <= 120) {
                    estado.datosCotizacion.plazo = numero;
                    mostrarResultadoCotizacion();
                    return;
                }
            }
            // Opciones predefinidas
            if (contieneAlguna(lowerText, ['1 año', 'un año', '12'])) {
                estado.datosCotizacion.plazo = 12;
                mostrarResultadoCotizacion();
                return;
            }
            if (contieneAlguna(lowerText, ['2 años', 'dos años', '24'])) {
                estado.datosCotizacion.plazo = 24;
                mostrarResultadoCotizacion();
                return;
            }
            if (contieneAlguna(lowerText, ['3 años', 'tres años', '36'])) {
                estado.datosCotizacion.plazo = 36;
                mostrarResultadoCotizacion();
                return;
            }
            if (contieneAlguna(lowerText, ['5 años', 'cinco años', '60'])) {
                estado.datosCotizacion.plazo = 60;
                mostrarResultadoCotizacion();
                return;
            }
            // No entendió
            cambiarImagen('editar');
            agregarMensaje(
                'Dime el plazo en años.<br>' +
                'Por ejemplo: "2 años" o "3 años".<br><br>' +
                'Puedes pagar entre 1 y 10 años.',
                'bot',
                [
                    { texto: '📅 1 año', valor: 'plazo 12' },
                    { texto: '📅 2 años', valor: 'plazo 24' },
                    { texto: '📅 3 años', valor: 'plazo 36' },
                    { texto: '📅 5 años', valor: 'plazo 60' }
                ]
            );
            return;
        }

        // ===== 2. MANEJAR INTENCIONES GENERALES =====

        if (contieneAlguna(lowerText, KNOWLEDGE_BASE.saludos) || lowerText === 'hola') {
            estado.paso = 'inicio';
            cambiarImagen('bienvenida');
            mostrarMensajeBienvenida();
            return;
        }

        if (contieneAlguna(lowerText, KNOWLEDGE_BASE.despedidas)) {
            cambiarImagen('bienvenida');
            agregarMensaje(
                '¡Hasta luego! 🙌<br><br>' +
                'Si tienes más dudas, aquí estoy.<br>' +
                'Que tengas un buen día.',
                'bot',
                [
                    { texto: '🔄 Empezar otra consulta', valor: 'hola' },
                    { texto: '📞 Que me llamen', valor: 'contacto' }
                ]
            );
            return;
        }

        if (contieneAlguna(lowerText, KNOWLEDGE_BASE.agradecimientos)) {
            cambiarImagen('feliz');
            agregarMensaje(
                '¡Ay, qué lindo! 😊💕<br><br>' +
                'Me alegra mucho poder ayudarte.<br>' +
                '¡Eso me hace muy feliz!<br><br>' +
                '¿Necesitas algo más?',
                'bot',
                [
                    { texto: '🏠 Ver terrenos', valor: 'proyectos' },
                    { texto: '💰 Cotizar', valor: 'cotizar' },
                    { texto: '📅 Agendar visita', valor: 'visita' }
                ]
            );
            return;
        }

        if (contieneAlguna(lowerText, ['proyectos', 'ver proyectos', 'lotes', 'terrenos', 'casas'])) {
            mostrarProyectos();
            return;
        }

        if (contieneAlguna(lowerText, KNOWLEDGE_BASE.cotizacion) || lowerText.includes('cotizar') || lowerText.includes('cuotas') || lowerText.includes('pagar al mes')) {
            iniciarCotizacion();
            return;
        }

        if (contieneAlguna(lowerText, KNOWLEDGE_BASE.legales)) {
            cambiarImagen('contrato');
            agregarMensaje(
                '¡Tranquilo! Los papeles están todos en orden 📋<br><br>' +
                'Te explico en simple:<br>' +
                '✅ Los terrenos están inscritos en SUNARP (la oficina de propiedades del gobierno)<br>' +
                '✅ El título de propiedad está limpio, sin problemas<br>' +
                '✅ Te ayudamos con la escritura pública<br>' +
                '✅ No te cobramos extra por los trámites<br><br>' +
                'Todo es legal y seguro.',
                'bot',
                [
                    { texto: '🏠 Ver terrenos', valor: 'proyectos' },
                    { texto: '💰 Cuánto cuesta', valor: 'cotizar' },
                    { texto: '📞 Que me llamen', valor: 'contacto' }
                ]
            );
            return;
        }

        if (contieneAlguna(lowerText, KNOWLEDGE_BASE.servicios)) {
            cambiarImagen('explicando');
            agregarMensaje(
                'Los terrenos ya tienen todo listo 💡<br><br>' +
                'Incluyen:<br>' +
                '💧 Agua potable (ya conectada)<br>' +
                '⚡ Luz eléctrica (instalada)<br>' +
                '🚰 Desagüe (funcionando)<br>' +
                '🛣️ Calles y aceras pavimentadas<br><br>' +
                'Llegas y puedes empezar a construir tu casa de una vez.',
                'bot',
                [
                    { texto: '🏠 Ver terrenos', valor: 'proyectos' },
                    { texto: '💰 Cuánto cuesta', valor: 'cotizar' },
                    { texto: '📅 Quiero visitar', valor: 'visita' }
                ]
            );
            return;
        }

        if (contieneAlguna(lowerText, KNOWLEDGE_BASE.ubicacion)) {
            cambiarImagen('ensenando');
            agregarMensaje(
                'Te cuento dónde están 📍<br><br>' +
                '<strong>Palma Real:</strong><br>' +
                '📍 En Pimentel, cerquita del mar (unos minutos caminando)<br><br>' +
                '<strong>Reque Mar:</strong><br>' +
                '📍 En Reque, al sur de Chiclayo<br>' +
                'Es una zona que está creciendo mucho.<br><br>' +
                'Los dos son fáciles de llegar desde Chiclayo.',
                'bot',
                [
                    { texto: '🏖️ Palma Real', valor: 'info palma real' },
                    { texto: '📈 Reque Mar', valor: 'info requemar' },
                    { texto: '🚗 Quiero visitar', valor: 'visita' }
                ]
            );
            return;
        }

        if (contieneAlguna(lowerText, KNOWLEDGE_BASE.contacto)) {
            cambiarImagen('contacto');
            agregarMensaje(
                'Aquí tienes cómo hablar con nosotros 📞<br><br>' +
                '<strong>WhatsApp:</strong><br>' +
                '987 654 321 (escríbenos)<br><br>' +
                '<strong>Correo:</strong><br>' +
                'hola@urbeq.pe<br><br>' +
                '<strong>Horario de atención:</strong><br>' +
                'Lunes a Sábado<br>' +
                'De 9 de la mañana a 6 de la tarde<br><br>' +
                'Si quieres, te llamamos. Solo dime tu número.',
                'bot',
                [
                    { texto: '📱 Escríbenos por WhatsApp', valor: 'whatsapp' },
                    { texto: '🏠 Ver terrenos primero', valor: 'proyectos' }
                ]
            );
            return;
        }

        if (contieneAlguna(lowerText, ['palma real', 'pimentel'])) {
            mostrarInfoProyecto('palma real');
            return;
        }

        if (contieneAlguna(lowerText, ['reque', 'requemar'])) {
            mostrarInfoProyecto('requemar');
            return;
        }

        if (lowerText.includes('faq') || lowerText.includes('preguntas') || lowerText.includes('ayuda') || lowerText.includes('dudas')) {
            mostrarFAQ();
            return;
        }

        if (lowerText.includes('visita') || lowerText.includes('visitar') || lowerText.includes('visitarlos')) {
            cambiarImagen('confirmar');
            agregarMensaje(
                '¡Perfecto! Te llevamos a conocer el terreno 🚗<br><br>' +
                'Es gratis y sin compromiso.<br><br>' +
                '¿Cuándo te queda mejor?<br><br>' +
                '<strong>Horarios de visita:</strong><br>' +
                '• De lunes a viernes: 10am a 5pm<br>' +
                '• Sábados: 9am a 1pm',
                'bot',
                [
                    { texto: 'Este fin de semana', valor: 'visita finde' },
                    { texto: 'Durante la semana', valor: 'visita semana' },
                    { texto: '📞 Prefiero que me llamen', valor: 'contacto' }
                ]
            );
            return;
        }

        // Manejar acciones especiales
        if (texto === 'whatsapp') {
            window.open('https://wa.me/51987654321?text=Hola%20URBEQ,%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20sus%20proyectos', '_blank');
            return;
        }

        if (texto === 'mapa') {
            window.open('https://maps.google.com/?q=Chiclayo+Lambayeque', '_blank');
            return;
        }

        // Respuesta por defecto - No entendió
        cambiarImagen('editar');
        agregarMensaje(
            'Perdón, no entendí bien lo que escribiste. 😊<br><br>' +
            '¿Podrías escribirlo de otra forma?<br><br>' +
            'Usa palabras simples como:<br>' +
            '• "Quiero ver terrenos"<br>' +
            '• "Cuánto cuesta"<br>' +
            '• "Háblame de Palma Real"<br>' +
            '• "Quiero visitar"<br><br>' +
            'O simplemente haz clic en un botón de abajo:',
            'bot',
            [
                { texto: '🏠 Ver terrenos', valor: 'proyectos' },
                { texto: '💰 Cuánto cuesta', valor: 'cotizar' },
                { texto: '📞 Que me llamen', valor: 'contacto' },
                { texto: '🔄 Empezar de nuevo', valor: 'hola' }
            ]
        );
    }

    function contieneAlguna(texto, palabras) {
        return palabras.some(function(palabra) { return texto.includes(palabra); });
    }

    function mostrarProyectos() {
        cambiarImagen('ensenando');
        agregarMensaje(
            '¡Claro! Te cuento sobre nuestros terrenos 🏡<br><br>' +
            '<strong>Opción 1: Palma Real</strong><br>' +
            '📍 En Pimentel, cerca del mar<br>' +
            '💰 Precio: desde 85,000 soles<br>' +
            '� Tamaño: desde 160 metros cuadrados<br><br>' +
            '<strong>Opción 2: Reque Mar</strong><br>' +
            '� En Reque, sur de Chiclayo<br>' +
            '💰 Precio: desde 72,000 soles<br>' +
            '� Tamaño: desde 140 metros cuadrados<br><br>' +
            '¿Cuál te interesa más?',
            'bot',
            [
                { texto: '🏖️ El de la playa (Palma Real)', valor: 'info palma real' },
                { texto: '📈 El de Reque', valor: 'info requemar' },
                { texto: '💰 Quiero saber cuotas', valor: 'cotizar' },
                { texto: '📅 Quiero visitarlos', valor: 'visita' }
            ]
        );
    }

    function mostrarInfoProyecto(proyectoKey) {
        const proyecto = CONFIG.proyectos[proyectoKey];
        if (!proyecto) return;

        const caracteristicasSimples = proyecto.caracteristicas.slice(0, 3).map(function(c) { return '✓ ' + c; }).join('<br>');

        cambiarImagen('explicando');
        agregarMensaje(
            '<strong>' + proyecto.nombre + '</strong><br><br>' +
            '📍 Ubicación: ' + proyecto.ubicacion + '<br>' +
            '💰 Precio total: ' + proyecto.precioTotal.toLocaleString() + ' soles<br>' +
            '💳 Cuotas desde: ' + proyecto.cuotaDesde + ' soles al mes<br><br>' +
            'Lo que incluye:<br>' +
            caracteristicasSimples + '<br><br>' +
            '¿Te interesa?',
            'bot',
            [
                { texto: '💰 Quiero saber mis cuotas', valor: 'cotizar ' + proyectoKey },
                { texto: '📅 Quiero visitarlo', valor: 'visita' },
                { texto: '🏠 Ver el otro terreno', valor: 'proyectos' }
            ]
        );
    }

    function iniciarCotizacion() {
        estado.paso = 'cotizacion_proyecto';
        estado.datosCotizacion = { proyecto: null, cuotaInicial: null, plazo: null };
        cambiarImagen('explicando');
        agregarMensaje(
            '¡Perfecto! Te ayudo a saber cuánto pagarías al mes 💰<br><br>' +
            'Es muy fácil. Solo dime:<br>' +
            '¿Qué terreno te interesa?',
            'bot',
            [
                { texto: '🏖️ Palma Real (85,000 soles)', valor: 'cotizar palma real' },
                { texto: '📈 Reque Mar (72,000 soles)', valor: 'cotizar requemar' },
                { texto: '🤔 Aún no sé cuál', valor: 'cotizar indefinido' }
            ]
        );
    }

    function continuarCotizacionInicial() {
        estado.paso = 'cotizacion_inicial';
        cambiarImagen('ensenando');

        const proyecto = estado.datosCotizacion.proyecto;
        let nombreProyecto = 'el terreno';
        let precio = 78500; // Promedio

        if (proyecto === 'palma real') {
            nombreProyecto = 'Palma Real';
            precio = 85000;
        } else if (proyecto === 'requemar') {
            nombreProyecto = 'Reque Mar';
            precio = 72000;
        }

        estado.datosCotizacion.precio = precio;

        agregarMensaje(
            '¡Muy bien! Elegiste ' + nombreProyecto + ' ✓<br><br>' +
            'Precio: ' + precio.toLocaleString() + ' soles<br><br>' +
            'Ahora dime:<br>' +
            '¿Qué porcentaje puedes pagar al inicio?<br>' +
            '(Mínimo 5%, máximo 50%)<br><br>' +
            'Por ejemplo: "10" o "20"',
            'bot',
            [
                { texto: '💰 10% (mínimo)', valor: 'inicial 10' },
                { texto: '💰 20%', valor: 'inicial 20' },
                { texto: '💰 30%', valor: 'inicial 30' },
                { texto: '💰 50% (máximo)', valor: 'inicial 50' }
            ]
        );
    }

    function continuarCotizacionPlazo() {
        estado.paso = 'cotizacion_plazo';
        cambiarImagen('explicando');

        const porcentaje = estado.datosCotizacion.cuotaInicial || 20;
        const montoInicial = (estado.datosCotizacion.precio * porcentaje) / 100;
        const saldo = estado.datosCotizacion.precio - montoInicial;

        agregarMensaje(
            '¡Perfecto! ✓<br><br>' +
            'Cuota inicial: ' + porcentaje + '%<br>' +
            'Eso sería: ' + montoInicial.toLocaleString() + ' soles<br>' +
            'Saldo a financiar: ' + saldo.toLocaleString() + ' soles<br><br>' +
            'Ahora dime:<br>' +
            '¿En cuánto tiempo quieres pagar?<br>' +
            'Dime el número de años (de 1 a 10)',
            'bot',
            [
                { texto: '📅 1 año', valor: 'plazo 12' },
                { texto: '📅 2 años', valor: 'plazo 24' },
                { texto: '📅 3 años', valor: 'plazo 36' },
                { texto: '📅 5 años', valor: 'plazo 60' }
            ]
        );
    }

    function mostrarResultadoCotizacion() {
        estado.paso = 'cotizacion_resultado';
        cambiarImagen('confirmar');

        const precio = estado.datosCotizacion.precio;
        const inicial = estado.datosCotizacion.cuotaInicial || 20;
        const meses = estado.datosCotizacion.plazo || 36;

        const montoInicial = (precio * inicial) / 100;
        const saldo = precio - montoInicial;
        const cuota = Math.ceil(saldo / meses);
        const años = Math.floor(meses / 12);
        const mesesRestantes = meses % 12;

        let tiempoTexto = '';
        if (años > 0) {
            tiempoTexto = años + ' año' + (años > 1 ? 's' : '');
            if (mesesRestantes > 0) {
                tiempoTexto += ' y ' + mesesRestantes + ' mes' + (mesesRestantes > 1 ? 'es' : '');
            }
        } else {
            tiempoTexto = meses + ' meses';
        }

        const proyecto = estado.datosCotizacion.proyecto;
        let nombreProyecto = 'Terreno';
        if (proyecto === 'palma real') nombreProyecto = 'Palma Real';
        else if (proyecto === 'requemar') nombreProyecto = 'Reque Mar';

        agregarMensaje(
            '🎉 <strong>Tu cotización está lista</strong><br><br>' +
            '<strong>Proyecto:</strong> ' + nombreProyecto + '<br>' +
            '<strong>Precio total:</strong> ' + precio.toLocaleString() + ' soles<br><br>' +
            '<strong>Resumen:</strong><br>' +
            '• Cuota inicial (' + inicial + '%): ' + montoInicial.toLocaleString() + ' soles<br>' +
            '• Saldo: ' + saldo.toLocaleString() + ' soles<br>' +
            '• Plazo: ' + tiempoTexto + '<br>' +
            '• <strong>Cuota mensual: ' + cuota.toLocaleString() + ' soles</strong> 💳<br><br>' +
            '¿Te interesa? Te llevamos a conocerlo.',
            'bot',
            [
                { texto: '📅 Quiero visitar', valor: 'visita' },
                { texto: '📱 Escríbeme por WhatsApp', valor: 'whatsapp' },
                { texto: '🔄 Hacer otra cotización', valor: 'cotizar' }
            ]
        );
    }

    function mostrarFAQ() {
        cambiarImagen('ensenando');
        agregarMensaje(
            'Aquí te respondo las dudas más comunes ❓<br><br>' +
            '<strong>¿Necesito buen historial en el banco?</strong><br>' +
            'No es obligatorio. Cada caso es diferente y lo revisamos.<br><br>' +
            '<strong>¿Puedo empezar a construir ya?</strong><br>' +
            '¡Sí! Los terrenos ya tienen agua y luz listos.<br><br>' +
            '<strong>¿Hay gastos extras escondidos?</strong><br>' +
            'No. Te decimos todo desde el principio.<br><br>' +
            '<strong>¿Puedo ir a ver el terreno primero?</strong><br>' +
            '¡Claro! Te llevamos sin compromiso.<br><br>' +
            '¿Tienes otra duda? Escríbela y te respondo.',
            'bot',
            [
                { texto: '💰 Quiero saber precios', valor: 'cotizar' },
                { texto: '📅 Ir a visitar', valor: 'visita' },
                { texto: '📞 Que me llamen', valor: 'contacto' }
            ]
        );
    }

    // Inicializar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', crearChatbotUI);
    } else {
        crearChatbotUI();
    }

    // Exponer API global
    window.URBEQChatbot = {
        toggle: toggleChatbot,
        estado: function() { return estado; },
        reset: function() {
            estado = { paso: 'inicio', contexto: 'bienvenida', datosCotizacion: {}, historial: [] };
            document.getElementById('chatbot-messages').innerHTML = '';
            mostrarMensajeBienvenida();
        }
    };

})();

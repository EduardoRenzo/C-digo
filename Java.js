const nomeInput = document.querySelector('#nome');
const idadeInput = document.querySelector('#idade');
const curso = document.querySelector('#curso');
const resultado = document.querySelector('#resultadoTodosDados');
const turnos = document.querySelectorAll('input[name="turno"]');
const btnFundo = document.querySelector('#btnFundo');
const imagemFundo = document.querySelector('#imagemFundo');

// Lê os valores atuais do formulário.
function obterDados() {
    const nome = nomeInput.value.trim() || 'Não informado';
    const idade = idadeInput.value.trim() || 'Não informada';
    const cursoSelecionado = curso.options[curso.selectedIndex].text;

    const turnosSelecionados = [...turnos]
        .filter(turno => turno.checked)
        .map(turno => turno.parentElement.textContent.trim())
        .join(', ') || 'Não informado';

    return {
        nome,
        idade,
        cursoSelecionado,
        turnos: turnosSelecionados
    };
}

// Mostra todos os dados preenchidos.
function mostrarDados() {
    const dados = obterDados();

    resultado.innerHTML = `
        <strong>Todos os dados:</strong><br>
        Nome: ${dados.nome}<br>
        Idade: ${dados.idade}<br>
        Curso: ${dados.cursoSelecionado}<br>
        Turno(s): ${dados.turnos}
    `;

    animarLetras(resultado);
}

// Aplica animação a cada caractere do texto.
function animarLetras(elemento = document.body) {
    const walker = document.createTreeWalker(
        elemento,
        NodeFilter.SHOW_TEXT
    );

    const textos = [];
    let no;

    while ((no = walker.nextNode())) {
        const textoVisivel = no.nodeValue.trim();
        const elementoIgnorado =
            no.parentElement.closest('.letra, script, style');

        if (!elementoIgnorado && textoVisivel) {
            textos.push(no);
        }
    }

    textos.forEach(no => {
        const fragmento = document.createDocumentFragment();

        [...no.nodeValue].forEach(caractere => {
            if (/\s/.test(caractere)) {
                fragmento.append(caractere);
            } else {
                const letra = document.createElement('span');
                letra.className = 'letra';
                letra.textContent = caractere;
                fragmento.append(letra);
            }
        });

        no.replaceWith(fragmento);
    });
}

// Ativa a animação inicial.
animarLetras();

// Botão para mostrar os dados.
document.querySelector('#btnMostrarTodos')
    .addEventListener('click', mostrarDados);

// Botão para limpar os campos.
document.querySelector('#btnLimpar')
    .addEventListener('click', () => {
        nomeInput.value = '';
        idadeInput.value = '';
        curso.value = '';

        turnos.forEach(turno => {
            turno.checked = false;
        });

        resultado.textContent = '';
    });

// Abre o seletor de arquivos.
btnFundo.addEventListener('click', () => {
    imagemFundo.click();
});

// Aplica a imagem.
imagemFundo.addEventListener('change', () => {
    const arquivo = imagemFundo.files[0];

    if (arquivo) {
        document.body.style.backgroundImage =
            `url(${URL.createObjectURL(arquivo)})`;

        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundAttachment = 'fixed';
    }
});

// Atualiza os dados automaticamente quando os campos mudam.
[nomeInput, idadeInput, curso, ...turnos].forEach(campo => {
    const evento =
        campo.type === 'checkbox' || campo.tagName === 'SELECT'
            ? 'change'
            : 'input';

    campo.addEventListener(evento, mostrarDados);
});

// Opções editáveis com cores padrão
let userOptions = [
    { value: "100", color: "#db7093" },
    { value: "1", color: "#20b2aa" },
    { value: "50", color: "#d63e92" },
    { value: "0", color: "#daa520" },
    { value: "1000", color: "#ff340f" },
    { value: "10", color: "#ff7f50" },
    { value: "5", color: "#3cb371" },
    { value: "20", color: "#4169e1" }
];

// Cores padrão para novas opções
const defaultColors = [
    "#db7093", "#20b2aa", "#d63e92", "#daa520",
    "#ff340f", "#ff7f50", "#3cb371", "#4169e1",
    "#e74c3c", "#9b59b6", "#f39c12", "#27ae60",
    "#3498db", "#34495e", "#e67e22", "#1abc9c"
];

let wheel = document.querySelector('.wheel');
let spinBtn = document.querySelector('.spinBtn');
let value = Math.ceil(Math.random() * 3600);

// Função para distribuir opções nas 8 fatias sem repetições adjacentes
function distributeOptions() {
    const wheelOptions = new Array(8).fill(null);

    if (userOptions.length === 1) {
        // Se só tem 1 opção, preenche todas as fatias
        wheelOptions.fill(userOptions[0]);
    } else if (userOptions.length === 2) {
        // Alterna entre as 2 opções
        for (let i = 0; i < 8; i++) {
            wheelOptions[i] = userOptions[i % 2];
        }
    } else if (userOptions.length <= 8) {
        // Distribui as opções evitando adjacências quando possível
        const step = Math.floor(8 / userOptions.length);
        let currentIndex = 0;

        // Primeira passada: distribui as opções principais
        for (let i = 0; i < userOptions.length; i++) {
            wheelOptions[currentIndex % 8] = userOptions[i];
            currentIndex += step;
        }

        // Segunda passada: preenche os espaços vazios
        for (let i = 0; i < 8; i++) {
            if (wheelOptions[i] === null) {
                // Escolhe uma opção que não seja igual às adjacentes
                const prevIndex = (i - 1 + 8) % 8;
                const nextIndex = (i + 1) % 8;
                const prevOption = wheelOptions[prevIndex];
                const nextOption = wheelOptions[nextIndex];

                // Encontra uma opção diferente das adjacentes
                let selectedOption = userOptions[0];
                for (let opt of userOptions) {
                    if (opt !== prevOption && opt !== nextOption) {
                        selectedOption = opt;
                        break;
                    }
                }
                wheelOptions[i] = selectedOption;
            }
        }
    }

    return wheelOptions;
}

// Função para calcular o tamanho ideal da fonte baseado no comprimento do texto
function calculateFontSize(text) {
    const baseSize = 2; // Tamanho base em em
    const maxWidth = 80; // Largura máxima em pixels

    if (text.length <= 3) {
        return baseSize; // Texto curto mantém tamanho normal
    } else if (text.length <= 6) {
        return baseSize * 0.8; // Texto médio reduz 20%
    } else if (text.length <= 10) {
        return baseSize * 0.6; // Texto longo reduz 40%
    } else if (text.length <= 15) {
        return baseSize * 0.45; // Texto muito longo reduz 55%
    } else {
        return baseSize * 0.35; // Texto extremamente longo reduz 65%
    }
}

// Função para atualizar a roda baseada nas opções distribuídas
function updateWheel() {
    wheel.innerHTML = '';
    const wheelOptions = distributeOptions();

    wheelOptions.forEach((option, index) => {
        const numberDiv = document.createElement('div');
        numberDiv.className = 'number';
        numberDiv.style.setProperty('--i', index + 1);
        numberDiv.style.setProperty('--clr', option.color);

        const span = document.createElement('span');
        span.textContent = option.value;

        // Aplicar tamanho de fonte dinâmico
        const fontSize = calculateFontSize(option.value);
        span.style.fontSize = `${fontSize}em`;

        // Ajustar altura da linha para textos menores para melhor centralização
        if (fontSize < 1.5) {
            span.style.lineHeight = '1.2';
        }

        numberDiv.appendChild(span);
        wheel.appendChild(numberDiv);
    });

    updateDistributionInfo();
}

// Função para atualizar informações sobre a distribuição
function updateDistributionInfo() {
    const distributionInfo = document.getElementById('distributionInfo');
    const wheelOptions = distributeOptions();

    // Contar quantas vezes cada opção aparece
    const counts = {};
    wheelOptions.forEach(opt => {
        counts[opt.value] = (counts[opt.value] || 0) + 1;
    });

    let infoText = `<strong>Distribuição atual:</strong><br>`;
    for (let [value, count] of Object.entries(counts)) {
        const percentage = ((count / 8) * 100).toFixed(1);
        infoText += `${value}: ${count}/8 fatias (${percentage}%)<br>`;
    }

    distributionInfo.innerHTML = infoText;
}

// Função para renderizar a lista de opções editáveis
function renderOptionsList() {
    const optionsList = document.getElementById('optionsList');
    const addBtn = document.getElementById('addOptionBtn');

    optionsList.innerHTML = '';

    userOptions.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option-item';

        optionDiv.innerHTML = `
    <input type="text" value="${option.value}" onchange="updateOption(${index}, this.value)" placeholder="Valor da opção">
    <input type="color" value="${option.color}" onchange="updateOptionColor(${index}, this.value)" class="color-picker" style="--picker-color: ${option.color}">
    ${userOptions.length > 2 ? `<button class="remove-btn" onclick="removeOption(${index})">X</button>` : ''}
`;

        optionsList.appendChild(optionDiv);
    });

    // Desabilita o botão de adicionar se já tem 8 opções
    addBtn.disabled = userOptions.length >= 8;
}

// Funções de edição
function addNewOption() {
    if (userOptions.length < 8) {
        const newColor = defaultColors[userOptions.length % defaultColors.length];
        userOptions.push({ value: `Nova ${userOptions.length + 1}`, color: newColor });
        renderOptionsList();
        updateWheel();
    }
}

function removeOption(index) {
    if (userOptions.length > 2) {
        userOptions.splice(index, 1);
        renderOptionsList();
        updateWheel();
    }
}

function updateOption(index, newValue) {
    userOptions[index].value = newValue.trim() || `Opção ${index + 1}`;
    updateWheel();
}

function updateOptionColor(index, newColor) {
    userOptions[index].color = newColor;
    updateWheel();
    renderOptionsList(); // Atualiza a lista para refletir a nova cor
}

// Função de spin (mantém a lógica original corrigida)
spinBtn.onclick = function () {
    const spinAngle = Math.ceil(Math.random() * 3600);
    value += spinAngle;
    wheel.style.transform = `rotate(${value}deg)`;

    const winnerDiv = document.getElementById('winner');
    winnerDiv.classList.remove('show');

    setTimeout(() => {
        const wheelOptions = distributeOptions();
        const normalizedAngle = value % 360;
        const segmentAngle = 360 / 8; // Sempre 8 fatias
        const adjustedAngle = (360 - normalizedAngle + segmentAngle / 2) % 360;
        const winningIndex = Math.floor(adjustedAngle / segmentAngle);
        const winningValue = wheelOptions[winningIndex].value;

        winnerDiv.textContent = `Valor vencedor: ${winningValue}`;
        winnerDiv.classList.add('show');
    }, 3000);
};

// Inicialização
renderOptionsList();
updateWheel();
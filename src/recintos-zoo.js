export { RecintosZoo as RecintosZoo };

class Recinto {
    constructor(numero, bioma, tamanhoTotal, animaisExistentes = []) {
        this.numero = numero;
        this.bioma = bioma;
        this.tamanhoTotal = tamanhoTotal;
        this.animaisExistentes = animaisExistentes;
        this.espaçoLivre = this.calcularEspaçoLivre();
    }
    calcularEspaçoLivre() {
        return this.tamanhoTotal - this.animaisExistentes.reduce((total, animal) => total + animal.tamanho, 0);
    }
    isAdequado(animal, quantidade) {
        const novoEspaçoOcupado = animal.tamanho * quantidade;
        const espaçoDisponivel = this.espaçoLivre - novoEspaçoOcupado;

        // Verificar se há espaço suficiente
        if (espaçoDisponivel < 0) {
            return false;
        }

        // Verificar compatibilidade de bioma
        if (!animal.biomas.includes(this.bioma)) {
            return false;
        }

        // Verificar compatibilidade de espécies (carnívoros e hipopótamos)
        if (animal.especie === 'leao' || animal.especie === 'leopardo') {
            return this.animaisExistentes.length === 0;
        }

        if (animal.especie === 'hipopotamo') {
            return this.bioma === 'savana e rio';
        }

        // Verificar se há outros animais no recinto para os macacos
        if (animal.especie === 'macaco') {
            return this.animaisExistentes.length > 0;
        }

        return true;
    }

}

class Animal {
    constructor(especie, tamanho, biomas){
        this.especie = especie;
        this.tamanho = tamanho;
        this.biomas = biomas;
    }
}

class RecintosZoo {
    constructor(recintos) {
        this.recintos = recintos;
    }
    analisaRecintos(animal, quantidade) {
        const novoAnimal = new Animal(animal, ...ANIMAIS[animal]); // Obter dados do animal
        const recintosViaveis = this.recintos.filter(recinto => recinto.isAdequado(novoAnimal, quantidade));
        
        if (quantidade <= 0) {
            return { erro: 'Quantidade inválida' };
        }

        if (!ANIMAIS[animal]) {
            return { erro: 'Animal inválido' };
        }

        if (recintosViaveis.length === 0) {
            return { erro: 'Não há recinto viável' };
        }

        return {
            recintosViaveis: recintosViaveis.map(recinto => 
                `Recinto ${recinto.numero} (espaço livre: ${recinto.calcularEspaçoLivre() - animal.tamanho * quantidade} total: ${recinto.tamanhoTotal})`
            )
        };
    }

}

// Dados dos animais (conforme indicado)
const ANIMAIS = {
    'leao': [3, ['savana']],
    'leopardo': [2, ['savana']],
    'crocodilo': [3, ['rio']],
    'macaco': [1, ['savana', 'floresta']],
    'gazela': [2, ['savana']],
    'hipopotamo': [4, ['savana e rio']]
};

// Exemplo de uso
const recinto1 = new Recinto(1, 'savana', 10, [new Animal('macaco', 1, ['savana', 'floresta'])]);
const zoo = new RecintosZoo([recinto1]);
const resultado = zoo.analisaRecintos('macaco', 2);
console.log(resultado);



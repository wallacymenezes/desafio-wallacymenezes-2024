class RecintosZoo {

    constructor() {
        // Define os recintos disponíveis no zoológico
        this.recintos = [
            { numero: 1, bioma: 'savana', tamanho: 10, animais: [{ especie: 'MACACO', quantidade: 3 }] },
            { numero: 2, bioma: 'floresta', tamanho: 5, animais: [] },
            { numero: 3, bioma: ['savana', 'rio'], tamanho: 7, animais: [{ especie: 'GAZELA', quantidade: 1 }] },
            { numero: 4, bioma: 'rio', tamanho: 8, animais: [] },
            { numero: 5, bioma: 'savana', tamanho: 9, animais: [{ especie: 'LEAO', quantidade: 1 }] }
        ];

        // Define as características das espécies de animais tratadas pelo zoológico
        this.animais = {
            'LEAO': { tamanho: 3, biomas: ['savana'], carnivoro: true },
            'LEOPARDO': { tamanho: 2, biomas: ['savana'], carnivoro: true },
            'CROCODILO': { tamanho: 3, biomas: ['rio'], carnivoro: true },
            'MACACO': { tamanho: 1, biomas: ['savana', 'floresta'], carnivoro: false },
            'GAZELA': { tamanho: 2, biomas: ['savana'], carnivoro: false },
            'HIPOPOTAMO': { tamanho: 4, biomas: ['savana', 'rio'], carnivoro: false }
        }; 
    }

    analisaRecintos(tipoAnimal, quantidade) {
        if (!this.animais[tipoAnimal]) {
            return { erro: "Animal inválido" };
        }

        if (!Number.isInteger(quantidade) || quantidade <= 0) {
            return { erro: "Quantidade inválida" };
        }

        const especie = this.animais[tipoAnimal];
        const recintosViaveis = [];

        for (const recinto of this.recintos) {
            const espacoDisponivel = recinto.tamanho - this.calculateSpaceOccupied(recinto, tipoAnimal);

            if (
                this.biomeSuitable(recinto, especie) &&
                this.sufficientSpace(espacoDisponivel, especie.tamanho, quantidade) &&
                this.enclosureHasCarnivore(recinto, tipoAnimal) &&
                this.comfortableForExistingAnimals(recinto, tipoAnimal, quantidade)
            ) {
                const espacoRestante = espacoDisponivel - (especie.tamanho * quantidade);
                recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoRestante} total: ${recinto.tamanho})`);
            }
        }

        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável" };
        }

        recintosViaveis.sort((a, b) => a.split(' ')[1] - b.split(' ')[1]);
        return { recintosViaveis };
    }

    calculateSpaceOccupied(recinto, tipoAnimal) {
        let espaco = 0;
        const especiesNoRecinto = new Set();

        recinto.animais.forEach(animal => {
            const especie = this.animais[animal.especie];
            espaco += especie.tamanho * animal.quantidade;

            if (!especiesNoRecinto.has(animal.especie)) {
                especiesNoRecinto.add(animal.especie);
            }
        });

        if(especiesNoRecinto.size > 1) {
            espaco += 1;
        }else if(!especiesNoRecinto.has(tipoAnimal) && recinto.animais.length > 0) {
            espaco += 1;
        }

        return espaco;
    }

    biomeSuitable(recinto, especie) {

        if (Array.isArray(recinto.bioma)) {
            return recinto.bioma.some(b => especie.biomas.includes(b));
        }

        return especie.biomas.includes(recinto.bioma);
    }

    sufficientSpace(espacoDisponivel, tamanhoAnimal, quantidade) {
        if (espacoDisponivel <= tamanhoAnimal * quantidade) {
            return false;
        }
        return true;
    }

    comfortableForExistingAnimals(recinto, tipoAnimal, quantidade) {

        const jaPossuiHipopotamo = recinto.animais.some(a => a.especie === 'HIPOPOTAMO');
        const novoHipopotamo = tipoAnimal === 'HIPOPOTAMO';
        if ((jaPossuiHipopotamo || novoHipopotamo) && recinto.bioma !== 'savana' && 'rio') {
            return false;
        }

        if (tipoAnimal === 'MACACO' && recinto.animais.length === 0 && quantidade < 2) {
            return false;
        }

        return true;
    }

    enclosureHasCarnivore(recinto, tipoAnimal){
        const especie = this.animais[tipoAnimal];
        const temCarnivoro = recinto.animais.some(a => this.animais[a.especie].carnivoro);

        if (especie.carnivoro) {
            // Se o novo animal é carnívoro
            // Retorna true se não há carnívoros no recinto ou se todos os carnívoros no recinto são da mesma espécie
            return (recinto.animais.length === 0) || recinto.animais.every(a => this.animais[a.especie].carnivoro && a.especie === tipoAnimal);
        }
    
        // Se o novo animal não é carnívoro, deve ser aceito apenas se o recinto não contém carnívoros
        return !temCarnivoro;
    }

}

export { RecintosZoo as RecintosZoo };
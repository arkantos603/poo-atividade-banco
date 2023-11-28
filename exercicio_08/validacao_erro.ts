export class AplicacaoError extends Error { // QUESTÃO 7: ADICIONANDO CLASSES DE ERRO
    constructor(message: string) {
        super(message);
        this.name = 'AplicacaoError';
    } 
}

export class ContaInexistenteError extends AplicacaoError { // QUESTÃO 7: ADICIONANDO CLASSES DE ERRO
    constructor(message: string) {
        super(message);
        this.name = 'ContaInexistenteError';
    }
}

 class SaldoInsuficienteError extends AplicacaoError { // QUESTÃO 7: ADICIONANDO CLASSES DE ERRO
    constructor(message: string) {
        super(message);
        this.name = 'SaldoInsuficienteError'; // Posteiormente subtituido pela validação da questão 15
    }
}

export class ValorInvalidoError extends AplicacaoError { // Questão 11: Criando validarValor
    constructor(message: string) {
        super(message);
        this.name = 'ValorInvalidoError';
    }
}

export class PoupancaInvalidaError extends AplicacaoError { // Questão 12: Validar poupança
    constructor(message: string) {
        super(message);
        this.name = 'PoupancaInvalidaError';
    }
}

export class EntradaInvalidaError extends AplicacaoError { // Questão 15: Exceções personalizadas para tratar entradas inválidas
    constructor(message: string) {
        super(`Entrada inválida: ${message}`);
        this.name = 'EntradaInvalidaError';
    }
}

export class NumeroInvalidoError extends EntradaInvalidaError { // Questão 15: Exceções personalizadas para tratar entradas inválidas
    constructor() {
        super('Número inválido. Certifique-se de inserir um número válido.');
        this.name = 'NumeroInvalidoError';
    }
}

export class ValorVazioError extends EntradaInvalidaError { // Questão 15: Exceções personalizadas para tratar entradas inválidas
    constructor(campo: string) {
        super(`${campo} não pode estar vazio.`);
        this.name = 'ValorVazioError';
    }
}
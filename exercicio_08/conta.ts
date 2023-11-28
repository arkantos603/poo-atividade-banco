import { ValorInvalidoError } from './validacao_erro'

export class Conta {
    private _numero: string;
    private _saldo: number;
    private validarValor(valor: number, mensagemErro: string): void { // Questão 11: Criando validarValor
        if (valor <= 0) {
            throw new ValorInvalidoError(mensagemErro);
        }
    }

    constructor(numero: string, saldoInicial: number) { // QUESTÃO 6: Adicionando verificação e lançando execões
        if (saldoInicial < 0) {
            throw new ValorInvalidoError('Saldo inicial não pode ser menor que zero.');
        } // Questão 15: Exceções personalizadas para tratar entradas inválidas
        this._numero = numero;
        this._saldo = saldoInicial;
        //this.depositar(saldoInicial); // QUESTÃO 10: Utiliza o método depositar para atribuir o saldo inicial
    }

    sacar(valor: number): void {
        //   QUESTÃO 6: Adicionando verificação e lançando exceções
        //     if (valor < 0) {
        //         throw new Error('O valor do saque não pode ser menor que zero.');
        //     }
    
        //     if (this._saldo < valor) {
        //         throw new Error('Saldo insuficiente.');
        //     }

        // Questão 10: Aplicando ValorInvalidoError
        // if (valor <= 0) {
        //     throw new ValorInvalidoError('O valor do saque deve ser maior que zero.');
        // }
        // if (this._saldo < valor) {
        //     throw new SaldoInsuficienteError('Saldo insuficiente.');
        // }

        // Questão 11: Refatorando e criando validarValor
        // this.validarValor(valor, 'O valor do saque deve ser maior que zero.');
        // if (this._saldo < valor) {
        //     throw new SaldoInsuficienteError('Saldo insuficiente.');
        // }
        // this._saldo -= valor;
        
        // Questão 15: Exceções personalizadas para tratar entradas inválidas
        this.validarValor(valor, 'O valor do saque deve ser maior que zero.');
        this.validarValor(this._saldo - valor, 'Saldo insuficiente.');
        this._saldo -= valor;
    }

    depositar(valor: number): void { 
        // QUESTÃO 6: Adicionando verificação e lançando execões
        // if (valor < 0) {
        //     throw new Error('O valor do depósito não pode ser menor que zero.');
        // }
        // Questão 10: Aplicando ValorInvalidoError
        // if (valor <= 0) {
        //     throw new ValorInvalidoError('O valor do depósito deve ser maior que zero.');
        // }
        // this._saldo = this._saldo + valor;
        // Questão 11: Refatorando e criando validarValor
        this.validarValor(valor, 'O valor do depósito deve ser maior que zero.');
        this._saldo += valor;
    }

    transferir(contaDestino: Conta, valor: number): void {
        this.sacar(valor);
        contaDestino.depositar(valor);
    }

    get numero(): string {
        return this._numero;
    }

    get saldo(): number {
        return this._saldo;
    }
}

export class Poupanca extends Conta {
    private _taxaDeJuros: number;

    constructor(numero: string, saldo: number, taxaDeJuros: number) {
        super(numero, saldo);
        this._taxaDeJuros = taxaDeJuros;
    }

    renderJuros(): void {
        let juros: number = this.saldo * this._taxaDeJuros / 100;
        this.depositar(juros);
    }

    get taxaDeJuros(): number {
        return this._taxaDeJuros;
    }
}

export class ContaImposto extends Conta {
    private _taxaDesconto: number;

    constructor(numero: string, saldo: number, taxaDesconto: number) {
        super(numero, saldo);
        this._taxaDesconto = taxaDesconto;
    }

    sacar(valor: number): void {
        let valorDesconto = this.saldo * this._taxaDesconto / 100;
        super.sacar(valor + valorDesconto);
    }

    get taxaDesconto(): number {
        return this._taxaDesconto;
    }
}
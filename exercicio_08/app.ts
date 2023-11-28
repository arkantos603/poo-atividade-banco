import prompt = require("prompt-sync");
import {Banco} from './banco'
import {ContaInexistenteError, EntradaInvalidaError, NumeroInvalidoError, ValorVazioError} from './validacao_erro'
import {Conta, Poupanca, ContaImposto} from './conta';

class App {
    private banco: Banco;
    private input(message: string): string { // Questão 15: Exceções personalizadas para tratar entradas inválidas
        try {
            const userInput = prompt()(`${message}: `);

            if (!userInput.trim()) {
                throw new ValorVazioError(message);
            }

            return userInput;
        } catch (error) {
            if (error instanceof EntradaInvalidaError) {
                console.log(`Erro ao obter entrada: ${error.message}`);
            } else {
                console.log(`Erro inesperado: ${error}`);
            }
            return ''; // ou outro valor padrão
        }
    }

    private inputNumero(message: string): number { // Questão 15: Exceções personalizadas para tratar entradas inválidas
        try {
            const userInput = this.input(message);
            const numero = +userInput;

            if (isNaN(numero)) {
                throw new NumeroInvalidoError();
            }

            return numero;
        } catch (error) {
            if (error instanceof EntradaInvalidaError) {
                console.log(`Erro ao obter número: ${error.message}`);
            } else {
                console.log(`Erro inesperado: ${error}`);
            }
            return NaN; // ou outro valor padrão
        }
    }

    constructor() {
        this.banco = new Banco();
        this.input = prompt();
    }

    public run(): void {
        this.banco.carregarDeArquivo();

        let opcao: string = '';

        do {
            try {
                console.log("\nBem-vindo, digite uma opcao: \n");
                console.log('1 - Cadastrar      2 - Consultar       3 - Sacar\n' +
                    '4 - Depositar      5 - Excluir         6 - Transferir\n' +
                    '7 - Render Juros   0 - Sair\n');

                opcao = this.input("Opcao: ");

                switch (opcao) {
                    case "1":
                        this.inserir();
                        break;
                    case "2":
                        this.consultar();
                        break;
                    case "3":
                        this.sacar();
                        break;
                    case "4":
                        this.depositar();
                        break;
                    case "5":
                        this.excluir();
                        break;
                    case "6":
                        this.transferir();
                        break;
                    case "7":
                        this.renderJuros();
                        break;
                    case "0":
                        console.log("Saindo...");
                        break;
                    default:
                        console.log("Opcao invalida");
                }

                this.input("Operacao finalizada. Digite <enter>");
            } catch (error) {               // Questão 14: Tratamento de exceções, aplicação robusta
                console.log(`Erro inesperado: ${error}`);
            }
        } while (opcao != "0");

        try {
            this.banco.salvarEmArquivo();
            console.log("Aplicacao encerrada");
        } catch (error) {                   // Questão 14: Tratamento de exceções, aplicação robusta
            console.log(`Erro ao salvar em arquivo: ${error}`);
        }
    }

    private inserir(): void {
        console.log("\nCadastrar conta\n");
        let numero: string = this.input("Digite o numero da conta: ");
        let tipoConta: string = this.input("Digite o tipo da conta (C para Conta, CP para Poupança, CI para Conta com Imposto): ");
    
        try {
            if (tipoConta === "C") {
                let conta: Conta = new Conta(numero, 0);
                this.banco.inserir(conta);
            } else if (tipoConta === "CP") {
                let taxaDeJuros: number = +this.inputNumero("Digite a taxa de juros para Poupança: ");
                let poupanca: Poupanca = new Poupanca(numero, 0, taxaDeJuros);
                this.banco.inserir(poupanca);
            } else if (tipoConta === "CI") {
                let taxaDesconto: number = +this.inputNumero("Digite a taxa de desconto para Conta com Imposto: ");
                let contaImposto: ContaImposto = new ContaImposto(numero, 0, taxaDesconto);
                this.banco.inserir(contaImposto);
            } else {
                console.log("Tipo de conta inválido");
                return;
            }
    
            console.log(`Conta ${numero} cadastrada com sucesso.`);
        } catch (error) {
            if (error instanceof ContaInexistenteError) {
                console.log(`Erro ao cadastrar a conta ${numero}: ${error.message}`);
            } else {
                console.log(`Erro inesperado: ${error}`);
            }
        }
    }

    private consultar(): void {
        console.log("\nConsultar conta\n");
        let numero: string = this.input("Digite o numero da conta: ");

        let contaConsultada = this.banco.consultar(numero);
        if (contaConsultada) {
            console.log(`Conta ${contaConsultada.numero} encontrada. Saldo: ${contaConsultada.saldo}`);
        } else {
            console.log(`Conta ${numero} não encontrada.`);
        }
    }

    private sacar(): void {
        console.log("\nSacar valor\n");
        let numero: string = this.input("Digite o numero da conta: ");
        let valor: number = +this.inputNumero("Digite o valor de saque: ");

        this.banco.sacar(numero, valor);
    }

    private depositar(): void {
        console.log("\nDepositar valor\n");
        let numero: string = this.input("Digite o numero da conta: ");
        let valor: number = +this.inputNumero("Digite o valor de deposito: ");

        this.banco.depositar(numero, valor);
    }

    private excluir(): void {
        console.log("\nExcluir conta\n");
        let numero: string = this.input("Digite o numero da conta: ");

        this.banco.excluir(numero);
        console.log(`Conta ${numero} excluída.`);
    }

    private transferir(): void {
        console.log("\nTransferir valor\n");
        let numeroDebito: string = this.input("Digite o numero da conta de origem: ");
        let numeroCredito: string = this.input("Digite o numero da conta de destino: ");
        let valor: number = +this.inputNumero("Digite o valor a ser transferido: ");

        this.banco.transferir(numeroCredito, numeroDebito, valor);
    }

    private renderJuros(): void {
        console.log("\nRender Juros\n");
        let numero: string = this.input("Digite o numero da conta: ");

        this.banco.renderJuros(numero);
    }
}

const app = new App();
app.run();
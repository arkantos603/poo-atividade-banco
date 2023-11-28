import * as fs from 'fs';
import {Conta, Poupanca, ContaImposto} from './conta';
import {AplicacaoError, ContaInexistenteError, PoupancaInvalidaError} from './validacao_erro'

export class Banco {
    private contas: Conta[] = [];
    private CAMINHO_ARQUIVO: string = "./contas.txt";

    public inserir(conta: Conta): void { // Questão 13: Validação para não duplicar contas
        try {
            if (this.consultar(conta.numero)) {
                throw new ContaInexistenteError(`Conta ${conta.numero} já cadastrada.`);
            }

            this.contas.push(conta);
        } catch (error) {
            if (error instanceof ContaInexistenteError) {
                console.log(error.message);
            } else {
                throw error;
            }
        }
    }

    public consultar(numero: string): Conta | undefined { //QUESTÃO 8: LANÇAR EXCEÇÃO
        let contaConsultada = this.contas.find(conta => conta.numero === numero);
    
        if (!contaConsultada) {
           new ContaInexistenteError(`Conta ${numero} não encontrada.`);
        }
    
        return contaConsultada;
    }

    private consultarPorIndice(numero: string): number { //QUESTÃO 8: LANÇAR EXCEÇÃO
        let indice: number = this.contas.findIndex(conta => conta.numero === numero);

        if (indice === -1) {
            throw new ContaInexistenteError(`Conta ${numero} não encontrada.`);
        }

        return indice;
    }

    public alterar(conta: Conta): void { // Questão 9: Alterando forma de erro
        const indice: number = this.consultarPorIndice(conta.numero);
        this.contas[indice] = conta;
    }

    public excluir(numero: string): void {
        let indice: number = this.consultarPorIndice(numero);

        if (indice !== -1) {
            this.contas.splice(indice, 1);
        }
    }

    public depositar(numero: string, valor: number): void { // Questão 9: Alterando forma de erro
        try {
            const contaConsultada = this.consultar(numero) as Conta;

            contaConsultada.depositar(valor);
            console.log(`Depósito realizado. Novo saldo da conta ${numero}: ${contaConsultada.saldo}`);
        } catch (error) {
            if (error instanceof AplicacaoError) {
                console.log(`Erro ao depositar na conta ${numero}: ${error.message}`);
            } else {
                console.log(`Erro inesperado: ${error}`);
            }
        }
    }

    public sacar(numero: string, valor: number): void { // Questão 9: Alterando forma de erro
        try {
            const contaConsultada = this.consultar(numero) as Conta;

            contaConsultada.sacar(valor);
            console.log(`Saque realizado. Novo saldo da conta ${numero}: ${contaConsultada.saldo}`);
        } catch (error) {
            if (error instanceof AplicacaoError) {
                console.log(`Erro ao sacar da conta ${numero}: ${error.message}`);
            } else {
                console.log(`Erro inesperado: ${error}`);
            }
        }
    }


    public transferir(numeroCredito: string, numeroDebito: string, valor: number): void { 
        try { // Questão 9: Alterando forma de erro
            const contaCredito = this.consultar(numeroCredito) as Conta;
            const contaDebito = this.consultar(numeroDebito) as Conta;

            contaDebito.transferir(contaCredito, valor);
            console.log(`Transferência de ${valor} da conta ${numeroDebito} para a conta ${numeroCredito} realizada com sucesso.`);
            console.log(`Saldo da conta ${numeroDebito}: ${contaDebito.saldo}`);
            console.log(`Saldo da conta ${numeroCredito}: ${contaCredito.saldo}`);
        } catch (error) {
            if (error instanceof AplicacaoError) {
                console.log(error.message);
            } else {
                console.log(`Erro inesperado: ${error}`);
            }
        }
    }

    public renderJuros(numero: string): void { // Questão 12: Validar poupança
        try {
            let conta: Conta | undefined = this.consultar(numero);

            if (conta instanceof Poupanca) {
                conta.renderJuros();
                console.log(`Juros aplicados à conta ${numero}`);
            } else {
                throw new PoupancaInvalidaError(`A conta ${numero} não é uma poupança.`);
            }
        } catch (error) {
            if (error instanceof AplicacaoError) {
                console.log(error.message);
            } else {
                console.log(`Erro inesperado: ${error}`);
            }
        }
    }

    public getTotalDepositado(): number {
        let totalDepositado = this.contas.reduce((totalAcumulado: number, conta: Conta) => {
            return totalAcumulado + conta.saldo;
        }, 0);

        return totalDepositado;
    }

    public getMediaDepositada(): number {
        return this.getTotalDepositado() / this.getTotalContas();
    }

    public carregarDeArquivo() {
        try {
            const arquivo: string = fs.readFileSync(this.CAMINHO_ARQUIVO, 'utf-8');
            const linhas: string[] = arquivo.split('\r\n');
            console.log("Iniciando leitura de arquivo");
    
            for (let i: number = 0; i < linhas.length; i++) {
                let linhaConta: string[] = linhas[i].split(";");
                if (linhaConta.length >= 3) {
                    let numero: string = linhaConta[0];
                    let saldo: number = parseFloat(linhaConta[1]);
                    let tipo: string = linhaConta[2];
    
                    let conta: Conta | undefined = undefined;
    
                    if (tipo === 'C') {
                        conta = new Conta(numero, saldo);
                    } else if (tipo === 'CP' && linhaConta.length === 4) {
                        let taxaDeJuros: number = parseFloat(linhaConta[3]);
                        conta = new Poupanca(numero, saldo, taxaDeJuros);
                    } else if (tipo === 'CI' && linhaConta.length === 4) {
                        let taxaDesconto: number = parseFloat(linhaConta[3]);
                        conta = new ContaImposto(numero, saldo, taxaDesconto);
                    }
    
                    if (conta) {
                        this.inserir(conta);
                        console.log(`Conta ${conta.numero} carregada`);
                    }
                }
            }
    
            console.log("Fim do arquivo");
        } catch (error) {
            console.log("Erro ao carregar o arquivo:", error);
        }
    }

    public salvarEmArquivo(): void {
        let stringContas: string = "";
        let linha: string = "";

        for (let conta of this.contas) {
            if (conta instanceof Poupanca) {
                linha = `${conta.numero};${conta.saldo};CP;${conta.taxaDeJuros}\r\n`;
            } else if ((conta instanceof ContaImposto)) {
                linha = `${conta.numero};${conta.saldo};CI;${conta.taxaDesconto}\r\n`;
            } else {
                linha = `${conta.numero};${conta.saldo};C\r\n`;
            }

            stringContas += linha;
        }

        // Deleta os últimos \r\n da string que vai para o arquivo, evitando que grave uma linha vazia
        stringContas = stringContas.slice(0, stringContas.length - 2);

        try {
            fs.writeFileSync(this.CAMINHO_ARQUIVO, stringContas, 'utf-8');
        } catch (error) {
            console.log("Erro ao salvar o arquivo:", error);
        }
    }

    public getTotalContas(): number {
        return this.contas.length;
    }
}
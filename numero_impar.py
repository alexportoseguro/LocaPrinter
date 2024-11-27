def verificar_impar(numero):
    if numero % 2 != 0:
        return True
    return False

def main():
    try:
        numero = int(input("Digite um número para verificar se é ímpar: "))
        if verificar_impar(numero):
            print(f"O número {numero} é ímpar!")
        else:
            print(f"O número {numero} é par!")
    except ValueError:
        print("Por favor, digite um número válido!")

if __name__ == "__main__":
    main()

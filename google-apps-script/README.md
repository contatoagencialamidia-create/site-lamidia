# Automação dos formulários LAMIDIA

Este código mantém a landing page e o site institucional na mesma planilha:

- Landing page: aba `Página1`
- Site institucional: aba `Leads - Site Institucional`

## Atualização do Apps Script

1. Abra a planilha `Leads - Estratégia LAMIDIA`.
2. Acesse **Extensões > Apps Script**.
3. Substitua o conteúdo do arquivo `Code.gs` pelo conteúdo deste diretório.
4. Clique em **Implantar > Gerenciar implantações**.
5. Edite a implantação ativa e selecione **Nova versão**.
6. Confirme que a execução está configurada como você e o acesso como qualquer pessoa.
7. Implante mantendo a mesma URL terminada em `/exec`.

O site e a landing page já usam essa mesma URL, portanto não é necessário alterar o endereço no JavaScript depois da atualização.

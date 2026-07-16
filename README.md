# Documentação do Sistema - Manipulador de PDFs

## 1. Visão Geral

O **Manipulador de PDFs** é uma aplicação web client-side que permite aos usuários realizar operações básicas em arquivos PDF diretamente no navegador, sem necessidade de upload para servidores externos. A ferramenta oferece duas funcionalidades principais:

- **Dividir PDF**: Extrai cada página de um arquivo PDF como um documento individual.
- **Juntar PDFs**: Combina múltiplos arquivos PDF em um único documento.

A aplicação utiliza bibliotecas modernas para manipulação de PDFs e compressão de arquivos, garantindo processamento rápido e seguro.

---

## 2. Tecnologias Utilizadas

| Tecnologia | Versão | Finalidade |
|------------|--------|------------|
| **pdf-lib** | (via CDN) | Criação, manipulação e extração de páginas de documentos PDF |
| **JSZip** | (via CDN) | Compressão de múltiplos arquivos em um único pacote ZIP |
| **HTML5** | - | Estrutura da interface |
| **CSS3** | - | Estilização e responsividade |
| **JavaScript (ES6+)** | - | Lógica de negócio e manipulação do DOM |

---

## 3. Estrutura de Diretórios
/
├── index.html # Página principal da aplicação
├── style/
│ └── style.css # Estilos da interface
├── script/
│ └── script.js # Lógica de negócio e manipulação de PDFs
├── img/
│ └── logo branco.png # Logotipo da aplicação (header)
└── README.md # (opcional) Documentação do projeto


---

## 4. Funcionalidades

### 4.1. Dividir PDF (`split`)

**Descrição**:  
Recebe um único arquivo PDF e gera um arquivo ZIP contendo cada página do documento original como um PDF individual.

**Fluxo de Execução**:
1. O usuário seleciona **exatamente 1** arquivo PDF.
2. O sistema carrega o PDF em memória usando `pdf-lib`.
3. Para cada página do documento:
   - Cria um novo PDF vazio.
   - Copia a página atual para o novo PDF.
   - Salva o PDF como um arquivo separado.
4. Todos os PDFs gerados são adicionados a um arquivo ZIP.
5. O ZIP é disponibilizado para download.

**Validações**:
- Nenhum arquivo selecionado: alerta "Selecione exatamente 1 PDF para dividir."
- Mais de 1 arquivo selecionado: mesmo alerta.

---

### 4.2. Juntar PDFs (`merge`)

**Descrição**:  
Combina dois ou mais arquivos PDF em um único documento, preservando a ordem de seleção (primeiro selecionado primeiro no documento final).

**Fluxo de Execução**:
1. O usuário seleciona **pelo menos 2** arquivos PDF.
2. Um novo documento PDF vazio é criado.
3. Para cada arquivo selecionado:
   - Carrega o PDF em memória.
   - Copia todas as páginas para o documento mestre.
4. O documento final é salvo e disponibilizado para download.

**Validações**:
- Menos de 2 arquivos selecionados: alerta "Selecione pelo menos 2 arquivos PDF para juntar."

---

## 5. Interface do Usuário

### 5.1. Componentes

| Elemento | Tipo | Descrição |
|----------|------|-----------|
| `#mode` | `<select>` | Seletor de modo: "Dividir PDF" ou "Juntar PDFs" |
| `#upload` | `<input type="file">` | Campo para seleção de arquivos (múltiplos permitidos) |
| `#process` | `<button>` | Botão para executar a operação |
| `#reset` | `<button>` | Botão para limpar seleção e resultados |
| `#downloads` | `<section>` | Área onde os links de download são exibidos |

### 5.2. Estilos

- **Header**: Gradiente linear (verde/ciano) e logo centralizado.
- **Container Principal**: Fundo cinza claro (`#dfdede`), bordas arredondadas (25px), sombra suave.
- **Botões**:
  - `#process`: Verde (`#2f9e39`) – ação principal.
  - `#reset`: Vermelho (`#c22d22`) – limpar formulário.
- **Responsividade**: Ajuste de tamanho da logo e padding em telas menores que 600px.

---

## 6. Fluxo de Operação

```mermaid
graph TD
    A[Início] --> B[Selecionar Modo]
    B --> C{Qual modo?}
    C -->|split| D[Selecionar 1 PDF]
    C -->|merge| E[Selecionar 2+ PDFs]
    D --> F[Clicar em "Executar"]
    E --> F
    F --> G{Validação}
    G -->|Erro| H[Exibir Alerta]
    G -->|OK| I[Processar PDF(s)]
    I --> J{Modo}
    J -->|split| K[Criar ZIP com páginas]
    J -->|merge| L[Criar PDF unificado]
    K --> M[Gerar link de download]
    L --> M
    M --> N[Exibir link na seção #downloads]
    N --> O[Fim]
    H --> O

# 7. Detalhamento das Funções (`script.js`)

## `async function splitPDF(file)`

**Parâmetro**

- `file` — Objeto `File` representando o PDF de entrada.

### Processo

1. Lê o arquivo como `ArrayBuffer`.
2. Carrega o documento utilizando a biblioteca **pdf-lib**.
3. Itera por todas as páginas do documento.
4. Cria um novo PDF para cada página.
5. Adiciona cada PDF individual ao arquivo ZIP.
6. Gera o arquivo ZIP.
7. Cria um link para download.

**Saída**

- Link para download do arquivo **ZIP** contendo todas as páginas separadas.

---

## `async function mergePDFs(files)`

**Parâmetro**

- `files` — Array de objetos `File` contendo os PDFs a serem unidos.

### Processo

1. Cria um novo documento PDF vazio.
2. Percorre cada arquivo selecionado.
3. Copia todas as páginas para o PDF principal.
4. Salva o documento resultante.
5. Cria um link para download.

**Saída**

- Link para download do PDF unificado.

---

## `function resetForm()`

### Processo

- Limpa o campo de seleção de arquivos (`uploadInput.value = ''`).
- Restaura o seletor de modo para **"Dividir PDF"**.
- Remove os links de download da seção `#downloads`.

---

## Event Listeners

### `#process (click)`

- Verifica o modo selecionado.
- Valida a quantidade de arquivos.
- Executa:
  - `splitPDF()` quando o modo for **Dividir PDF**;
  - `mergePDFs()` quando o modo for **Juntar PDFs**.

### `#reset (click)`

- Executa `resetForm()`.

---

# 8. Exemplo de Uso

## Dividir PDF

1. Acesse a aplicação.
2. Mantenha selecionado o modo **Dividir PDF**.
3. Clique em **Selecionar arquivo(s) PDF**.
4. Escolha um único arquivo PDF.
5. Clique em **Executar**.
6. Aguarde o processamento.
7. Clique em **Baixar todas as páginas (ZIP)**.

---

## Juntar PDFs

1. Selecione o modo **Juntar PDFs**.
2. Escolha dois ou mais arquivos PDF.
3. Clique em **Executar**.
4. Aguarde o processamento.
5. Clique em **Baixar PDF Unificado**.

---

# 9. Segurança e Privacidade

- ✅ Processamento **100% local** no navegador.
- ✅ Nenhum arquivo é enviado para servidores.
- ✅ Os arquivos permanecem apenas em memória durante a execução.
- ✅ Não há armazenamento persistente.
- ✅ Não utiliza cookies.
- ✅ Não utiliza mecanismos de rastreamento (tracking).

---

# 10. Limitações

## Tamanho dos Arquivos

O limite depende da memória disponível no navegador. Arquivos muito grandes podem causar lentidão ou falhas durante o processamento.

## Compatibilidade

Recomenda-se utilizar navegadores modernos, como:

- Google Chrome
- Microsoft Edge
- Mozilla Firefox

Todos devem possuir suporte a:

- `async/await`
- File API
- JavaScript ES6+

## Formatos Suportados

Atualmente, apenas arquivos **PDF** são aceitos.

---

# 11. Possíveis Melhorias Futuras

- Extração de páginas específicas (intervalos).
- Renomeação automática dos PDFs gerados.
- Ordenação dos arquivos antes da junção (Drag and Drop).
- Barra de progresso durante o processamento.
- Tema escuro (Dark Mode).
- Suporte a PDFs protegidos por senha.
- Compressão de PDFs.
- Rotação de páginas.
- Exclusão de páginas específicas.
- Visualização prévia do documento.

---

# 12. Dependências Externas (CDN)

## pdf-lib

Biblioteca responsável pela manipulação dos documentos PDF.

```html
<script src="https://cdn.jsdelivr.net/npm/pdf-lib/dist/pdf-lib.min.js"></script>
```

---

## JSZip

Biblioteca responsável pela criação do arquivo ZIP.

```html
<script src="https://cdn.jsdelivr.net/npm/jszip/dist/jszip.min.js"></script>
```

---

# 13. Manutenção e Contribuição

## Requisitos para Desenvolvimento

- Editor de código (Visual Studio Code, Sublime Text ou equivalente)
- Navegador com ferramentas de desenvolvedor
- Conhecimentos básicos em HTML, CSS e JavaScript

---

## Passos para Contribuir

1. Faça um **Fork** do repositório.
2. Crie uma nova branch:

```bash
git checkout -b feature/nova-funcionalidade
```

3. Faça suas alterações e realize o commit:

```bash
git commit -m "Adiciona nova funcionalidade"
```

4. Envie sua branch para o GitHub:

```bash
git push origin feature/nova-funcionalidade
```

5. Abra um **Pull Request**.

---

# 14. Considerações Finais

O **PDF Flex** é uma ferramenta leve, rápida e segura para realizar operações básicas com arquivos PDF diretamente no navegador.

Sua arquitetura baseada em tecnologias web modernas permite fácil manutenção, excelente desempenho e grande potencial para futuras expansões.

Como todo o processamento ocorre localmente, nenhuma informação é enviada para servidores externos, garantindo total privacidade aos usuários. Isso torna a aplicação adequada para uso pessoal, educacional e corporativo.

---

## Informações da Documentação

| Item | Valor |
|------|-------|
| Aplicação | PDF Flex |
| Versão | **1.0.0** |
| Ano | **2025** |
| Processamento | 100% Local |
| Linguagens | HTML, CSS e JavaScript |
| Bibliotecas | pdf-lib e JSZip |

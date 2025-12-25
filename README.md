# JIM Consultoria

Plataforma web desenvolvida para a **JIM Consultoria**, focada na gestão centralizada de editais de fomento, captação de leads e controle de pipeline de vendas. A aplicação consiste em uma landing page pública para conversão e um painel administrativo robusto para a equipe interna.

## 🚀 Tecnologias

O projeto utiliza uma stack moderna baseada em:

- **Framework:** [SvelteKit](https://kit.svelte.dev/)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS
- **Banco de Dados & Auth:** [Supabase](https://supabase.com/)
- **Linting & Formatting:** [Biome](https://biomejs.dev/)
- **Gerenciador de Pacotes:** [pnpm](https://pnpm.io/)

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (versão 20 ou superior recomendada)
- [pnpm](https://pnpm.io/installation)
- [Supabase CLI](https://supabase.com/docs/guides/cli) (para desenvolvimento local com banco de dados)

## 🔧 Instalação

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/jim-consultoria.git
   cd jim-consultoria
   ```

2. **Instale as dependências:**
   ```bash
   pnpm install
   ```

3. **Configure as variáveis de ambiente:**
   Duplique o arquivo de exemplo e preencha com suas credenciais do Supabase.
   ```bash
   cp .env.example .env
   ```

4. **Configure o banco de dados (Local):**
   Inicie o Supabase localmente e aplique as migrações.
   ```bash
   npx supabase start
   ```

## 💻 Uso

### Desenvolvimento
Para iniciar o servidor de desenvolvimento:

```bash
pnpm dev
```

Acesse a aplicação em `http://localhost:5173`.

### Build de Produção
Para criar a versão otimizada para produção:

```bash
pnpm build
```

Para visualizar a versão de produção localmente:

```bash
pnpm preview
```

### Qualidade de Código (Lint & Format)
Este projeto utiliza o **Biome**. Para verificar e corrigir problemas de estilo:

```bash
# Verificar problemas
pnpm biome check .

# Corrigir automaticamente
pnpm biome check --write .
```

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça um Fork do projeto.
2. Crie uma Branch para sua feature (`git checkout -b feature/MinhaFeature`).
3. Commit suas mudanças (`git commit -m 'Adiciona: MinhaFeature'`).
4. Push para a Branch (`git push origin feature/MinhaFeature`).
5. Abra um Pull Request.

Certifique-se de que seu código passa nas verificações do Biome antes de submeter.

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
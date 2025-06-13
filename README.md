# DentalConnect - Backend 🦷

![Status do Projeto](https://img.shields.io/badge/Status-Concluído-brightgreen)

## 🚀 Como rodar o backend localmente

### Pré-requisitos

- **Node.js** instalado (você pode baixar em https://nodejs.org/)
- **Banco de dados no Supabase do projeto**
- **Variáveis de ambiente** (serão necessárias para a configuração do JWT e do Supabase)

 ### Instalação

1. Clone o repositório:  
   ```bash
   git clone https://github.com/laissilva04/dentalconnect-backend.git
2. Acesse o diretório do projeto:  
   ```bash
   cd dentalconnect-backend
3. Instale as dependências:  
   ```bash
   npm install
4. Configure as variáveis de ambiente:
  Crie um arquivo .env na raiz do projeto e adicione as variáveis necessárias, como o segredo do JWT e as credenciais do Supabase.
   ```bash
   JWT_SECRET=jwt
   SUPABASE_URL=supabaseurl
   SUPABASE_KEY=supabasekey
6. Inicie o servidor: 
   ```bash
   node indes.js

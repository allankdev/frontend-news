# 📩 The News - Gamificação de Newsletters

## 🚀 Sobre o Projeto
O **The News** é uma plataforma de **gamificação para newsletters**, incentivando o engajamento dos leitores através de **streaks, badges e rankings**. Inspirado no **Duolingo**, o sistema permite que os usuários acompanhem seu progresso e conquistas enquanto leem as newsletters enviadas regularmente.

## 🎯 Funcionalidades
### ✅ **Área do Usuário**
- **Página Inicial** com introdução ao projeto e botão para login
- **Dashboard do Usuário** exibindo:
  - Streak atual (quantos dias consecutivos abriu a newsletter)
  - Histórico de leituras e progresso
  - Mensagens motivacionais para incentivar o usuário
  - Conquistas e Badges

### ✅ **Dashboard Administrativo**
- Visualização de **métricas de engajamento geral**
- **Ranking** dos leitores mais engajados
- **Filtros avançados** por período, newsletter e status de streak
- **Gráficos de padrões de engajamento**

### ✅ **Regras de Streak e Badges**
- Streak aumenta **+1 a cada dia consecutivo** que o usuário abrir uma newsletter
- Se o usuário perder um dia, o streak é **zerado** (exceto domingos)
- Badges são concedidos ao atingir **3, 7, 14, 30 dias de streak**

## 🛠 Tecnologias Utilizadas
- **Frontend**: React, Next.js, Tailwind CSS, shadcn/ui, Recharts
- **Backend**: NestJS, Prisma ORM, PostgreSQL
- **Autenticação**: JWT
- **Webhook**: Beehiiv API para rastrear aberturas de emails

## 🏗 Estrutura do Projeto
```
📂 frontend-news
 ├── public/               # Arquivos estáticos (logo, favicon, etc.)
 ├── src/
 │   ├── app/
 │   │   ├── layout.tsx   # Layout global
 │   │   ├── page.tsx     # Página inicial
 │   │   ├── login/
 │   │   ├── dashboard/
 │   │   ├── admin/
 ├        ── public/
 │   ├── components/      # Componentes reutilizáveis
 │   ├── lib/             # Configuração de API
 │   ├── providers/       # Contexto de autenticação
 │   ├── hooks/           # Hooks personalizados
 ├── .env.local           # Variáveis de ambiente
 ├── package.json         # Dependências do projeto
```

## 🔧 Como Rodar o Projeto
### **1️⃣ Configurar o Backend**
```sh
cd backend-news
npm install
npm run start
```
Certifique-se de que o backend está rodando em **http://localhost:3000**

### **2️⃣ Rodar o Frontend**
```sh
cd frontend-news
npm install
npm run dev
```
O frontend rodará em **http://localhost:4000**

## 🌍 Variáveis de Ambiente (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXTAUTH_URL=http://localhost:4000
JWT_SECRET=super_secret_key
```

## ✅ Testes Realizados
- **Autenticação e redirecionamento correto de usuários**
- **Incremento e reset de streaks conforme regras**
- **Recebimento de dados via webhook do Beehiiv**
- **Exibição correta dos badges e ranking**
- **Responsividade e experiência do usuário**


## 🔍 Melhorias Futuras
- Implementar **notificações push** para lembrar os usuários de abrir a newsletter
- Criar **mecânica de desafios e missões diárias**
- Permitir **customização de avatares e perfis**

## 📦 Entrega
- ✅ Código-fonte no **GitHub (repositório privado)**
- ✅ Demonstração funcional **(vídeo ou link hospedado)**
- ✅ Relatório de análise técnica

---
Feito com ❤️ por **[Allan Kelven]** 🚀


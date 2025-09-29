# 📅 Dashboard de Presença - Sistema de Agendamento

Sistema de agendamento com Firebase para gerenciar presenças nos locais Berrine, Santana ou Home Office.

## 🚀 Funcionalidades

- ✅ **Agendamento em tempo real** com Firebase Firestore
- ✅ **Multi-usuário** - Vários funcionários podem agendar simultaneamente  
- ✅ **Calendário interativo** com react-calendar
- ✅ **Validação de email** (@grupomast.com.br)
- ✅ **Exportação para Excel** (apenas admin)
- ✅ **Autenticação admin** para exportar dados
- ✅ **Design responsivo** para mobile e desktop
- ✅ **Indicadores de conectividade** em tempo real

## 🔧 Configuração Rápida

### 1. Instale as dependências
```bash
npm install
```

### 2. Firebase já configurado!
O arquivo `.env` já contém suas credenciais do Firebase.

### 3. Configure o Firestore (IMPORTANTE!)

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Vá para o projeto **agenda-mast**
3. No menu lateral: **Firestore Database**
4. Se não existir, clique **"Criar banco de dados"**
5. Escolha **"Iniciar no modo de teste"**
6. Em **Regras**, substitua por:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /agendamentos/{document} {
      // Permitir todas as operações: read, write (create/update) e delete
      allow read, write, delete: if true;
    }
  }
}
```

### 4. Execute o projeto
```bash
npm run dev
```

## 👤 Login Admin

Para exportar Excel:
- **Usuário**: `admin`
- **Senha**: `presença@mast`

## 📱 Como Usar

1. **Selecione uma data** no calendário
2. **Digite seu email** (@grupomast.com.br)
3. **Escolha o local** (Berrine/Santana/Home Office)
4. **Adicionar Agendamento**
5. **Admin**: Clique "Exportar Excel" → Login → Download

## 🛠️ Tecnologias

- React 18 + TypeScript + Vite
- Tailwind CSS + Firebase Firestore
- React Hook Form + React Calendar
- ExcelJS + Lucide Icons

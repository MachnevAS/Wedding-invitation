# 💍 Свадебное приглашение

Одностраничный сайт-приглашение на свадьбу

## 🚀 Начало работы

### Установка зависимостей
```bash
npm install
# или
yarn install
```

### Запуск в development режиме
```bash
npm run dev
# или
yarn dev
```

### Добавление .env файла с данными
```text
GOOGLE_SHEET_ID=YOUR_GOOGLE_SHEET_ID
GOOGLE_SHEETS_API_KEY=YOUR_GOOGLE_SHEETS_API_KEY
GOOGLE_SERVICE_ACCOUNT_KEY='{YOUR_config.json}'
GOOGLE_GUESTS_SHEET_NAME=guests
GOOGLE_PHOTO_SHEET_NAME=photo

NEXT_PUBLIC_RECAPTCHA_SITE_KEY=YOUR_RECAPTCHA_SITE_KEY
RECAPTCHA_SECRET_KEY=YOUR_RECAPTCHA_SECRET_KEY
```

Приложение будет доступно по адресу: `http://localhost:3000`

## 🛠 Технологии

<div style="display: flex; flex-wrap: wrap; gap: 10px; margin: 15px 0;">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs" alt="Next.js">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Shadcn/ui-000000?style=for-the-badge" alt="Shadcn/ui">
</div>

- **Next.js 14** - Фреймворк с SSR/SSG поддержкой
- **TypeScript** - Статическая типизация
- **Tailwind CSS** - Утилитарные стили
- **Shadcn/ui** - Готовые компоненты
- **Google Sheets API** - Хранение ответов гостей
- **Genkit** - AI-функционал (опционально)

## 📁 Структура проекта

```
.
├── .idx/           # Конфигурация среды разработки
├── docs/           # Документация
├── src/
│   ├── ai/         # AI-модули
│   ├── app/        # Страницы Next.js
│   ├── components/ # UI компоненты
│   │   └── ui/     # Shadcn/ui компоненты
│   ├── hooks/      # Кастомные хуки
│   ├── lib/        # Вспомогательные функции
│   └── services/   # Внешние сервисы
└── configs/        # Конфигурационные файлы
```

<details>
<summary>📂 Полная структура</summary>

```text
.
├── .idx
│   └── dev.nix
├── docs
│   └── blueprint.md
├── src
│   ├── ai
│   │   ├── dev.ts
│   │   └── genkit.ts
│   ├── app
│   │   ├── actions.ts
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components
│   │   ├── rsvp-form.tsx
│   │   ├── scroll-reveal.tsx
│   │   └── ui
│   │       ├── accordion.tsx
│   │       ├── alert-dialog.tsx
│   │       ├── alert.tsx
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── calendar.tsx
│   │       ├── card.tsx
│   │       ├── chart.tsx
│   │       ├── checkbox.tsx
│   │       ├── dialog.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── form.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── menubar.tsx
│   │       ├── popover.tsx
│   │       ├── progress.tsx
│   │       ├── radio-group.tsx
│   │       ├── scroll-area.tsx
│   │       ├── select.tsx
│   │       ├── separator.tsx
│   │       ├── sheet.tsx
│   │       ├── sidebar.tsx
│   │       ├── skeleton.tsx
│   │       ├── slider.tsx
│   │       ├── switch.tsx
│   │       ├── table.tsx
│   │       ├── tabs.tsx
│   │       ├── textarea.tsx
│   │       ├── toast.tsx
│   │       ├── toaster.tsx
│   │       └── tooltip.tsx
│   ├── hooks
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib
│   │   └── utils.ts
│   └── services
│       └── google-sheets-service.ts
├── components.json
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```
</details>

## 🏗 Сборка и деплой

### Production сборка
```bash
npm run build
# или
yarn build
```

### Запуск production сервера
```bash
npm start
# или
yarn start
```

### Дополнительные команды
```bash
# Проверка кода
npm run lint
# или
yarn lint

# Форматирование кода
npm run format
# или
yarn format
```

## ✨ Особенности
- ♿ Полная доступность (a11y)
- 📱 Адаптивный дизайн
- 🎨 Кастомные анимации
- 🔒 Защита данных Google Sheets
- ⚡ Оптимизация производительности

---

<div align="center">
  <sub>Создано с ❤️ для вашего особенного дня</sub>
</div>
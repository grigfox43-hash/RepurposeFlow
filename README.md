# RepurposeFlow (Медиа-комбайн) 🚀

> **«Превратите 1 подкаст или созвон в 15 готовых публикаций для соцсетей за 3 минуты».**

Платформа автоматической дистрибуции контента нового поколения на базе **Google Gemini 2.0**. Сервис принимает аудио/видеофайлы (MP3, WAV, MP4) или ссылки на YouTube, анализирует контекст и генерирует готовый пул публикаций для всех ключевых платформ.

---

## ⚡️ Возможности платформы

- **15 форматов контента в 1 клик:**
  - **LinkedIn:** Экспертные треды и слайдовые PDF-карусели.
  - **VC.ru / Habr / Medium:** Полноценные аналитические лонгриды с H1-H3, таблицами и выводами.
  - **Reels / Shorts / TikTok:** 3 динамичных 30-секундных сценария с 3-секундными хуками и визуальными подсказками.
  - **Telegram:** Сжатые выжимки с эмодзи-разметкой и разбором кейсов.
  - **Email-рассылка:** 3 варианта цепляющих тем для высокого Open Rate + текст письма.
  - **Цитаты & Панчлайны:** Ключевые фразы для графических дизайнерских карточек.
  - **Executive Summary & Show Notes:** Полный структурированный транскрипт с таймкодами спикеров.
- **Интерактивная Студия (Studio Editor):**
  - Разделенный экран (Split-view) с деревом всех материалов.
  - Встроенный Markdown-редактор с мгновенным автосохранением.
  - **AI-редактор Gemini:** кнопки «✂️ Сократить в 2 раза», «🔥 Усилить хук», «🎯 Добавить CTA» или произвольный промпт.
  - Экспорт в Notion, Google Docs и буфер обмена в 1 клик.
- **Кредитная система учета минут:**
  - **Starter ($29/мес):** 120 минут аудио/видео.
  - **Pro ($79/мес):** 360 минут + автоэкспорт в Notion.
  - **Agency ($199/мес):** 1200 минут + мульти-воркспейсы под клиентов.
- **Мультимодальный Google Gemini 2.0:**
  - Полнотекстовое понимание аудио и видео (контекст до 2M токенов).
  - Считывание эмоциональных пиков, таймкодов и вирусных тезисов.

---

## 🛠 Технологический стек

- **Frontend & App Framework:** [Next.js 15](https://nextjs.org/) (App Router), React 19, TypeScript
- **Стилизация & UI:** [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/), Canvas Confetti
- **ИИ-ядро:** [Google Gemini API](https://ai.google.dev/) (`@google/genai` — Gemini 2.0 Flash, Gemini 1.5 Pro)
- **Хранилище файлов:** Cloudflare R2 / AWS S3 (Presigned URLs для прямой загрузки до 500 МБ)
- **База данных & Auth:** [Supabase](https://supabase.com/) (PostgreSQL + RLS)
- **Оркестратор автоматизации:** [n8n](https://n8n.io/) (готовый шаблон воркфлоу включен в репозиторий)
- **Деплой:** [Vercel](https://vercel.com/)

---

## 🚀 Быстрый старт локально

### 1. Клонирование и установка зависимостей
```bash
git clone https://github.com/your-username/RepurposeFlow.git
cd RepurposeFlow
npm install
```

### 2. Настройка переменных окружения
Скопируйте пример файла конфигурации:
```bash
cp .env.example .env.local
```
Укажите ваш ключ Google Gemini (получить бесплатно можно в [Google AI Studio](https://aistudio.google.com/app/apikey)):
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
> *Примечание:* Даже без указания ключа приложение работает в полнофункциональном демонстрационном режиме со смарт-генератором!

### 3. Запуск dev-сервера
```bash
npm run dev
```
Откройте [http://localhost:3000](http://localhost:3000) в браузере.

---

## 🌐 Деплой на Vercel в 1 клик

1. Запушьте репозиторий на ваш GitHub:
   ```bash
   git add .
   git commit -m "feat: initial RepurposeFlow launch"
   git push origin main
   ```
2. Откройте [Vercel Dashboard](https://vercel.com/new) и импортируйте репозиторий.
3. В разделе **Environment Variables** добавьте:
   - `GEMINI_API_KEY`
   - `NEXT_PUBLIC_GEMINI_API_KEY`
4. Нажмите **Deploy**. Проект готов к работе в глобальной CDN!

---

## 🔄 Интеграция с n8n

В папке `/n8n/` находится готовый файл воркфлоу:
`n8n/workflow-repurposeflow-gemini.json`

1. Откройте n8n и нажмите **Import from File** $\rightarrow$ выберите файл воркфлоу.
2. В переменных окружения n8n добавьте:
   - `GEMINI_API_KEY`
   - `REPURPOSEFLOW_WEBHOOK_SECRET`
3. В настройках RepurposeFlow укажите URL вашего webhook из n8n:
   `https://n8n.yourdomain.com/webhook/repurposeflow-job`

---

## 🗄 Структура базы данных (Supabase)

SQL-скрипт инициализации всех таблиц и RLS-политик находится в:
`supabase/schema.sql`

Таблицы:
- `profiles` — пользователи, баланс и списание минут
- `workspaces` — изолированные воркспейсы клиентов (для агентств)
- `media_jobs` — задачи на обработку аудио/видео
- `transcripts` — полный транскрипт со спикерами и таймкодами
- `content_items` — 15 форматов сгенерированных публикаций

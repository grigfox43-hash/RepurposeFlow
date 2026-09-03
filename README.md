# RepurposeFlow (Медиа-комбайн) 🚀

> **«Превратите 1 подкаст или созвон в 15 готовых публикаций для соцсетей за 3 минуты».**

Платформа автоматической дистрибуции контента нового поколения на базе **Google Gemini**. Сервис принимает аудио/видеофайлы (MP3, WAV, MP4) или ссылки на YouTube, анализирует контекст и генерирует готовый пул публикаций для всех ключевых платформ.

---

## 🌐 Ссылки на продакшн и репозиторий

- **Production URL на Vercel:** [https://repurposeflow-zeta.vercel.app](https://repurposeflow-zeta.vercel.app)
- **Альтернативный домен:** [https://repurposeflow-ei6wqgt8h-greenteam1.vercel.app](https://repurposeflow-ei6wqgt8h-greenteam1.vercel.app)
- **Исходный код на GitHub:** [https://github.com/grigfox43-hash/RepurposeFlow](https://github.com/grigfox43-hash/RepurposeFlow)

---

## ⚡️ Возможности платформы

- **Двуязычный интерфейс (RU 🇷🇺 / EN 🇺🇸):**
  - Автоматическое определение языка пользователя по браузеру.
  - Мгновенное переключение языка через флаги в шапке с сохранением выбора.
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
  - Встроенный Markdown-редактор с мгновенным сохранением в базу данных.
  - **AI-редактор Google Gemini:** кнопки «✂️ Сократить в 2 раза», «🔥 Усилить хук», «🎯 Добавить CTA» или произвольный промпт.
  - Экспорт в Notion, Google Docs и буфер обмена в 1 клик.
- **Мультимодальный Google Gemini AI:**
  - Нативное понимание аудио и видео контекста.
  - Считывание эмоциональных пиков, таймкодов и вирусных тезисов.
- **Реальная база данных:**
  - Полноценная персистентность всех проектов, постов и транскриптов.
  - Поддержка Supabase PostgreSQL и встроенного серверного хранилища.

---

## 🛠 Технологический стек

- **Frontend & App Framework:** [Next.js 15](https://nextjs.org/) (App Router), React 19, TypeScript
- **Стилизация & UI:** [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/), Canvas Confetti
- **ИИ-ядро:** [Google Gemini API](https://ai.google.dev/)
- **Хранилище файлов:** Cloudflare R2 / AWS S3 (Presigned URLs для прямой загрузки до 500 МБ)
- **База данных:** Supabase PostgreSQL + Server Persistent Storage
- **Оркестратор автоматизации:** [n8n](https://n8n.io/)
- **Деплой:** [Vercel](https://vercel.com/)

---

## 🚀 Быстрый старт локально

### 1. Клонирование и установка зависимостей
```bash
git clone https://github.com/grigfox43-hash/RepurposeFlow.git
cd RepurposeFlow
npm install
```

### 2. Настройка переменных окружения
Создайте `.env.local`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Запуск dev-сервера
```bash
npm run dev
```
Откройте [http://localhost:3000](http://localhost:3000) в браузере.

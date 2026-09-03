# Техническое задание на редизайн (для AI-исполнителя)

> Это инструкция для нейросети/агента, который будет **реализовывать** редизайн в коде.
> Сайт и его структура (HTML-разметка, секции, контент, тексты, порядок блоков) **уже готовы и не меняются**.
> Задача — **только визуальный слой**: CSS/стили, шрифты, цвета, и анимации/параллакс/интерактивные эффекты.

---

## 0. Жёсткие ограничения (прочитать перед началом работы)

1. **Не менять структуру DOM/HTML**, не менять порядок секций, не удалять и не добавлять контентные блоки, не менять тексты.
2. **Не менять существующие `id`/`class`, используемые в JS-логике**, если они завязаны на функциональность (формы, обработчики, роутинг). Если для анимаций нужен новый класс — добавляй новый, не переименовывай старый.
3. Разрешено и нужно:
   - менять CSS (цвета, типографику, отступы, тени, границы, фоны, радиусы);
   - добавлять новые CSS-классы/атрибуты `data-*` для анимаций;
   - подключать библиотеки анимаций (GSAP, Framer Motion, Lenis и т.п.);
   - добавлять JS-код инициализации анимаций/параллакса, не трогающий существующую бизнес-логику;
   - добавлять декоративные элементы (SVG-фигуры, canvas-фон, псевдоэлементы) при условии, что они не ломают вёрстку и доступность.
4. Перед началом работы — **провести аудит текущего кода**: определить стек (чистый HTML/CSS/JS, React, Vue, WordPress/Tailwind и т.д.), найти файлы стилей, найти существующие имена секций/классов, чтобы привязать инструкции ниже к реальным селекторам.
5. Все изменения должны быть **обратимыми и изолированными** — по возможности через отдельный CSS-файл/модуль (`redesign.css`, `animations.js`) или через переопределение CSS-переменных, чтобы легко откатить при необходимости.
6. Обязательно соблюдать `prefers-reduced-motion: reduce` — при этой настройке все параллакс/скролл-анимации должны быть отключены или заменены на простой fade.
7. Не ухудшать производительность: LCP < 2.5s, CLS < 0.1, анимации только на `transform`/`opacity` (не на `top/left/width/height`).

---

## 1. Дизайн-токены (CSS-переменные)

Добавить/заменить в `:root` (или в существующую систему токенов, если она есть):

```css
:root {
  /* Фон */
  --bg-primary: #0A0A12;
  --bg-secondary: #12121C;
  --bg-tertiary: #161622;

  /* AI-градиент (фирменный, сквозной) */
  --gradient-ai: linear-gradient(135deg, #4C6EF5 0%, #9B5DE5 50%, #F15BB5 100%);
  --color-accent-1: #4C6EF5; /* indigo */
  --color-accent-2: #9B5DE5; /* violet */
  --color-accent-3: #F15BB5; /* pink */

  /* CTA / успех */
  --color-cta: #B4FF39; /* неоновый лайм */
  --color-cta-alt: #3DDC97;

  /* Текст */
  --text-primary: #F5F5FA;
  --text-secondary: #9A9AB0;

  /* Типографика */
  --font-heading: "Space Grotesk", "Inter Tight", sans-serif;
  --font-body: "Inter", "Manrope", sans-serif;
  --font-mono: "JetBrains Mono", "Space Mono", monospace;

  /* Радиусы/тени */
  --radius-card: 20px;
  --radius-btn: 14px;
  --shadow-glow: 0 0 40px rgba(155, 93, 229, 0.35);

  /* Анимация */
  --ease-default: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fast: 0.25s;
  --duration-base: 0.5s;
  --duration-slow: 0.9s;
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
```

Применить эти токены глобально: заменить существующие цвета фона/текста/акцентов на эти переменные (найти в текущем CSS хардкод-цвета и заменить на `var(--...)`).

---

## 2. Подключение библиотек

Установить (npm) или подключить через CDN — выбрать в зависимости от стека:

```bash
npm install gsap lenis framer-motion
```

или через CDN в `<head>`/перед `</body>`:

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js"></script>
<script src="https://unpkg.com/lenis@1/dist/lenis.min.js"></script>
```

Базовая инициализация плавного скролла (один раз, глобально, в главном JS-файле):

```js
gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}
```

Для React/Vue-проектов — обернуть эту инициализацию в хук/composable, вызываемый один раз на монтировании layout-компонента.

---

## 3. Задачи по секциям

> Найди в текущей вёрстке соответствующую секцию по смыслу (контенту), примени указанные стили/анимации к её существующим элементам. Не меняй HTML-структуру, только добавляй классы/атрибуты `data-anim="..."` и CSS/JS.

### 3.1 Header/навигация
- Стиль: прозрачный фон при скролле в самом верху страницы; при скролле вниз > 50px — добавить класс (например `.nav--scrolled`) через JS-listener на `scroll`, который включает `backdrop-filter: blur(12px)` и полупрозрачный `background: rgba(10,10,18,0.7)`.
- Логотип/ключевой текст — `background: var(--gradient-ai); -webkit-background-clip: text; color: transparent;`.
- Ссылки навигации: `::after` подчёркивание, `transform: scaleX(0)` → `scaleX(1)` при hover, `transition: transform var(--duration-fast) var(--ease-default)`, `transform-origin: left`.

### 3.2 Hero-секция
- Фон: заменить текущий фон на `var(--bg-primary)` + декоративный слой — абсолютно позиционированный `div`/`canvas`/SVG с размытым градиентным "blob" (`background: var(--gradient-ai); filter: blur(80px); opacity: 0.5;`), анимированным через CSS `@keyframes` (плавное перемещение/масштабирование, 8–12s, `ease-in-out`, `infinite alternate`).
- Заголовок: применить split-text появление через GSAP при загрузке страницы:

```js
gsap.from('.hero-title .word', {
  y: 40, opacity: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out'
});
```
(Если заголовок — простой текстовый узел без разбивки на `.word`, оборачивать слова в `<span class="word">` через JS при инициализации, не трогая исходный текстовый контент вручную.)

- CTA-кнопка: `box-shadow` пульсация через CSS `@keyframes pulse-glow` (2.5s, infinite), усиление тени на `:hover`.
- Параллакс декоративного слоя относительно курсора (опционально, десктоп только):

```js
document.querySelector('.hero').addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  gsap.to('.hero-blob', { x, y, duration: 0.6, ease: 'power2.out' });
});
```

### 3.3 Секция "Как это работает" / процесс
- Для каждого шага процесса (существующие карточки/блоки шагов) добавить scroll-triggered появление:

```js
gsap.utils.toArray('.step-card').forEach((card, i) => {
  gsap.from(card, {
    y: 60, opacity: 0, duration: 0.6, ease: 'power3.out',
    scrollTrigger: { trigger: card, start: 'top 80%' }
  });
});
```
- Если есть визуальный элемент "видео → карточки соцсетей" — анимировать разлёт дочерних иконок/карточек через `stagger` при пересечении вьюпорта (см. код выше, применить к дочерним элементам с задержкой `stagger: 0.12`).
- Соединительная линия между шагами (если есть SVG `path` или её нужно добавить как декоративный элемент) — анимация "рисования":

```css
.connector-path {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  transition: stroke-dashoffset 1.2s var(--ease-default);
}
.connector-path.is-visible { stroke-dashoffset: 0; }
```
(класс `is-visible` добавлять через `IntersectionObserver`).

### 3.4 Карточки фич/преимуществ
- Существующие карточки: обновить фон на `background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); backdrop-filter: blur(10px); border-radius: var(--radius-card);`.
- 3D-tilt на hover (десктоп):

```js
document.querySelectorAll('.feature-card').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(card, { rotateY: px * 8, rotateX: -py * 8, duration: 0.3, ease: 'power2.out', transformPerspective: 600 });
  });
  card.addEventListener('mouseleave', () => {
    gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.4 });
  });
});
```
- Появление карточек по одной при скролле — тот же паттерн stagger, что в 3.3.
- Анимированная градиентная рамка при hover: `conic-gradient` + `mask` (добавить псевдоэлемент `::before` с `background: var(--gradient-ai)`, `animation: rotate-border 3s linear infinite` при `:hover`, маскирование через `padding` + `background-clip`).

### 3.5 Карусель кейсов/примеров контента
- Если карусель уже реализована — только заменить визуальный стиль карточек (тени, радиусы, hover-zoom `transform: scale(1.03)` на видео-превью, `transition: transform 0.4s var(--ease-default)`).
- Если требуется горизонтальный parallax между слоями — фон карусели двигать медленнее самих карточек через `ScrollTrigger` с разными `scrub`-значениями.
- Автовоспроизведение видео-превью при попадании в viewport — через существующий `IntersectionObserver`, если такого нет — добавить малый JS-снипет, не меняющий разметку `<video>`.

### 3.6 Логотипы/отзывы
- Лента логотипов: бесшовный CSS marquee:

```css
.logos-track { display: flex; animation: marquee 30s linear infinite; }
.logos-track:hover { animation-play-state: paused; }
@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
```
(трек должен содержать список логотипов, продублированный x2 — если дублирования нет, добавить его через JS-клонирование существующих элементов, не трогая исходный контент).

### 3.7 Тарифы
- Выделенный/рекомендованный план — анимированная градиентная обводка (аналог 3.4, но постоянная, не только на hover).
- Переключатель период/месяц-год — плавная анимация переключения через `transition` на позиции индикатора + легкий `scale` bounce (`cubic-bezier(0.34, 1.56, 0.64, 1)`).

### 3.8 FAQ (если есть аккордеон)
- Анимация раскрытия высоты через `grid-template-rows: 0fr → 1fr` (`transition: grid-template-rows 0.35s var(--ease-default)`), либо через существующий JS-аккордеон — обновить только CSS-переходы, не трогая логику открытия/закрытия.

### 3.9 Финальный CTA-блок / Footer
- Крупный градиентный текст: `background: var(--gradient-ai); background-size: 200% auto; -webkit-background-clip: text; color: transparent; animation: gradient-shift 6s ease infinite;`

```css
@keyframes gradient-shift { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
```
- Декоративный фон footer — статичные/медленно плывущие частицы через CSS (без тяжёлого JS/canvas, если не критично).

---

## 4. Общие микро-интеракции (применить ко всем существующим одноимённым элементам)

- Все primary-кнопки: `transition: transform var(--duration-fast), box-shadow var(--duration-fast); &:hover { transform: scale(1.03); box-shadow: var(--shadow-glow); }`
- Скролл-прогресс бар вверху страницы (новый декоративный элемент, добавляется в конец `<body>`):

```html
<div class="scroll-progress"></div>
```
```css
.scroll-progress {
  position: fixed; top: 0; left: 0; height: 3px; width: 0%;
  background: var(--gradient-ai); z-index: 9999;
}
```
```js
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  document.querySelector('.scroll-progress').style.width = pct + '%';
});
```

---

## 5. Порядок выполнения (чеклист для агента)

1. [ ] Провести аудит текущего кода: стек, файлы стилей, точки входа JS, имена секций.
2. [ ] Добавить/интегрировать блок CSS-переменных из раздела 1.
3. [ ] Подключить библиотеки из раздела 2, инициализировать плавный скролл с проверкой `prefers-reduced-motion`.
4. [ ] Пройти по разделу 3 секция за секцией: найти реальный селектор → применить стиль/анимацию → проверить, что HTML не менялся.
5. [ ] Применить общие микро-интеракции из раздела 4.
6. [ ] Прогнать проверку производительности (Lighthouse: LCP/CLS/TBT) и адаптивности (мобильные брейкпоинты — параллакс/3D-tilt отключать на `max-width: 768px`).
7. [ ] Проверить работу с `prefers-reduced-motion: reduce` включённым в системе.
8. [ ] Проверить, что вся исходная функциональность (формы, ссылки, обработчики) работает без изменений.

---

## 6. Что явно НЕ входит в задачу

- Изменение текстов, порядка блоков, добавление/удаление секций.
- Изменение бизнес-логики (формы отправки, авторизация, интеграции).
- Переход на другой фреймворк/стек.

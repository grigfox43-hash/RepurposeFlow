export type LegalTabKey = 'privacy' | 'terms' | 'cookies' | 'ads_ai' | 'impressum' | 'ccpa';

export interface LegalDocument {
  id: LegalTabKey;
  titleRu: string;
  titleEn: string;
  badgeRu: string;
  badgeEn: string;
  lastUpdated: string;
  contentRu: string;
  contentEn: string;
}

export const LEGAL_DOCUMENTS: Record<LegalTabKey, LegalDocument> = {
  privacy: {
    id: 'privacy',
    titleRu: 'Политика конфиденциальности и обработки данных',
    titleEn: 'Privacy and Data Protection Policy',
    badgeRu: '152-ФЗ • GDPR • CCPA/CPRA',
    badgeEn: 'GDPR • CCPA/CPRA • 152-FZ',
    lastUpdated: '04.09.2026',
    contentRu: `
### 1. Общие положения и применимое законодательство
Настоящая Политика конфиденциальности регулирует порядок сбора, хранения, обработки и защиты информации, предоставляемой пользователями платформы RepurposeFlow (далее — «Сервис», «Платформа»).
Сервис разработан и функционирует в строгом соответствии с:
- **Законодательством РФ**: Федеральный закон от 27.07.2006 № 152-ФЗ «О персональных данных», Федеральный закон от 27.07.2006 № 149-ФЗ «Об информации, информационных технологиях и о защите информации».
- **Законодательством Европейского Союза**: Регламент (ЕС) 2016/679 Европейского парламента и Совета от 27 апреля 2016 г. (General Data Protection Regulation — GDPR).
- **Законодательством США**: California Consumer Privacy Act (CCPA) с изменениями согласно California Privacy Rights Act (CPRA).

### 2. Оператор данных (Data Controller)
Оператором обработки персональных данных является команда RepurposeFlow.
- Контактный адрес электронной почты по вопросам обработки данных и реализации прав субъектов: **privacy@repurposeflow.com**
- Ответственное лицо за организацию обработки персональных данных (Data Protection Officer): DPO RepurposeFlow.

### 3. Категории собираемых данных
Платформа собирает и обрабатывает следующие категории информации:
1. **Данные учетной записи**: адрес электронной почты, имя пользователя, хешированный пароль.
2. **Пользовательский контент**: загружаемые аудио- и видеофайлы (MP3, WAV, MP4, M4A и др.), текстовые расшифровки (транскрипты), сгенерированные текстовые посты и настройки тональности.
3. **Технические и аналитические данные**: IP-адрес, тип браузера, версия ОС, файлы cookie, временные метки сессий.
4. **API-ключи**: при использовании пользователем собственного ключа Gemini API он хранится локально в защищенном хранилище браузера (LocalStorage) и передается исключительно на серверы AI-провайдера для выполнения запросов пользователя.

### 4. Правовые основания и цели обработки (GDPR ст. 6, 152-ФЗ ст. 6)
Обработка данных осуществляется на следующих законных основаниях:
- **Исполнение договора (Пользовательского соглашения)**: предоставление функционала транскрибации, анализа и дистрибуции контента.
- **Согласие субъекта персональных данных**: дается пользователем при регистрации аккаунта, подписке на рассылку или активации необязательных файлов cookie.
- **Законный интерес (Legitimate Interest)**: защита инфраструктуры от вредоносных атак, предотвращение злоупотреблений сервисом, обеспечение отказоустойчивости.

### 5. Привлечение третьих лиц (Субпроцессоры)
Для обеспечения работы Сервиса используются сертифицированные мировые инфраструктурные провайдеры:
- **Google Cloud / Gemini API**: обработка аудиопотоков, создание транскрипций и генерация текстовых форматов в изолированном контексте.
- **Cloudflare / Amazon S3 (R2)**: защищенное зашифрованное хранилище медиафайлов.
- **Vercel Inc.**: хостинг и исполнение серверных функций (Serverless Edge).
Все субпроцессоры соответствуют международным стандартам безопасности (ISO 27001, SOC 2 Type II) и обеспечивают шифрование данных при передаче (TLS 1.3) и хранении (AES-256).

### 6. Права пользователей (GDPR, 152-ФЗ, CCPA)
Каждый пользователь обладает следующими неотъемлемыми правами:
- **Право на доступ (Right to Access)**: получение копии всех хранящихся данных об учетной записи в машиночитаемом формате (JSON).
- **Право на исправление (Right to Rectification)**: изменение неточных или устаревших сведений в личном кабинете.
- **Право на удаление («Право на забвение» / Right to Erasure, 152-ФЗ ст. 21, GDPR ст. 17)**: полное и безвозвратное уничтожение учетной записи и всех связанных медиапроектов по запросу пользователя или через кнопку в личном кабинете.
- **Право на отзыв согласия**: отзыв ранее предоставленного согласия на обработку данных в любой момент времени путем направления уведомления на privacy@repurposeflow.com.
- **Право на переносимость данных (Data Portability)**.
- **Право на запрет продажи данных (Do Not Sell/Share, CCPA)**: Сервис **никогда не продает** и не сдает в аренду персональные данные третьим лицам.

### 7. Сроки хранения данных
- Данные аккаунта хранятся в течение срока действия учетной записи.
- Временные загруженные аудио/видеофайлы хранятся в защищенном хранилище и удаляются автоматически либо по команде пользователя.
- При удалении учетной записи все персональные данные безвозвратно удаляются из баз данных в течение 30 календарных дней.
    `,
    contentEn: `
### 1. General Provisions & Regulatory Scope
This Privacy Policy governs the collection, storage, processing, and protection of information submitted by users of the RepurposeFlow platform (the "Service", "Platform").
The Service is designed and operated in strict compliance with:
- **European Union Law**: Regulation (EU) 2016/679 (General Data Protection Regulation — GDPR) and the ePrivacy Directive.
- **United States Law**: California Consumer Privacy Act (CCPA) as amended by the California Privacy Rights Act (CPRA).
- **Russian Federation Law**: Federal Law No. 152-FZ "On Personal Data".

### 2. Data Controller
The Data Controller responsible for personal data processing is RepurposeFlow.
- Dedicated Data Protection & Inquiries Email: **privacy@repurposeflow.com**
- Data Protection Officer (DPO): RepurposeFlow DPO Unit.

### 3. Categories of Information Collected
1. **Account Information**: Email address, user display name, hashed passwords.
2. **User Uploads & Content**: Audio and video recordings (MP3, WAV, MP4, etc.), transcripts, AI-generated multi-format text drafts, tone-of-voice preferences.
3. **Technical & Log Data**: IP addresses, browser fingerprint, operating system version, cookies, session timestamps.
4. **API Keys**: When a user inputs their custom Gemini API key, it is saved strictly in the user's browser local storage (LocalStorage) and dispatched solely to the official AI endpoint to fulfill explicit processing commands.

### 4. Legal Basis for Processing (GDPR Article 6)
- **Contract Performance**: Providing media ingestion, transcription, repurposing, and distribution studio services.
- **Consent**: Explicitly granted upon registration, newsletter subscription, or cookie preference selection.
- **Legitimate Interests**: Security monitoring, preventing infrastructure abuse, ensuring high availability.

### 5. Third-Party Processors (Subprocessors)
We partner exclusively with enterprise-tier infrastructure providers:
- **Google Cloud / Gemini Multimodal API**: Audio processing, transcription, and generative repurposing in an enterprise-isolated context.
- **Cloudflare / S3-compatible R2**: Encrypted media storage.
- **Vercel Inc.**: Edge hosting and serverless compute.
All subprocessors maintain SOC 2 Type II and ISO 27001 certifications with TLS 1.3 in-transit and AES-256 at-rest encryption.

### 6. User Rights (GDPR, CCPA, 152-FZ)
- **Right to Access**: Retrieve a full export of account data in JSON format at any time.
- **Right to Rectification**: Update profile information inside the Personal Cabinet.
- **Right to Erasure ("Right to be Forgotten", GDPR Art. 17)**: Irrevocably wipe your account and all associated media files through the cabinet interface or by email.
- **Right to Data Portability**.
- **Right to Opt-Out of Sale/Sharing (CCPA)**: We do **NOT** sell or rent your personal data to data brokers or advertising networks.

### 7. Data Retention
Account data is kept for the active life of the account. Upon explicit deletion request, all personal data is permanently purged from production stores within 30 days.
    `
  },

  terms: {
    id: 'terms',
    titleRu: 'Пользовательское соглашение и оферта',
    titleEn: 'Terms of Service & User Agreement',
    badgeRu: 'Публичная оферта ст. 437 ГК РФ • Terms of Service',
    badgeEn: 'Public Agreement • Binding Terms',
    lastUpdated: '04.09.2026',
    contentRu: `
### 1. Акцепт соглашения и публичная оферта
Настоящий документ является публичной офертой в соответствии со ст. 437 Гражданского кодекса Российской Федерации (ГК РФ), а также юридически обязывающим соглашением между пользователем и платформой RepurposeFlow.
Регистрация учетной записи, загрузка медиафайлов или использование любого функционала Сервиса означает полное и безоговорочное принятие (акцепт) условий настоящего Соглашения.

### 2. Описание Сервиса
RepurposeFlow предоставляет облачный программный комплекс для мультимодальной транскрибации, контент-анализа и автоматической генерации производных материалов (постов, тредов, статей, сценариев Reels) на базе искусственного интеллекта Gemini.

### 3. Интеллектуальная собственность и авторские права
1. **Права на исходные материалы**: Пользователь сохраняет за собой все исключительные авторские и смежные права на загружаемые аудио- и видеозаписи.
2. **Гарантии пользователя**: Загружая файлы на Платформу, Пользователь гарантирует, что обладает всеми необходимыми правами, лицензиями и согласиями на использование аудио/видеоматериалов и содержащихся в них персональных данных третьих лиц.
3. **Права на сгенерированные результаты**: Права на производные тексты, созданные с помощью ИИ на основе исходных материалов Пользователя, принадлежат Пользователю в объеме, предусмотренном применимым законодательством об интеллектуальной собственности.

### 4. Правила допустимого использования (Acceptable Use Policy)
Пользователю категорически запрещается:
- Загружать материалы экстремистского, террористического характера, призывы к насилию, детскую порнографию, контент, нарушающий государственную тайну или права третьих лиц.
- Использовать Платформу для генерации спама, вредоносного ПО, фишинговых сообщений или распространения заведомо ложной информации (дезинформации).
- Совершать попытки взлома инфраструктуры, обратной разработки (reverse engineering) или обхода установленных лимитов запросов.

### 5. Ограничение ответственности и отказ от гарантий
1. Сервис предоставляется на условиях **«КАК ЕСТЬ» («AS IS»)**.
2. Администрация не несет ответственности за возможные галлюцинации искусственного интеллекта, фактические неточности в сгенерированных текстах. Пользователь **обязан осуществлять вычитку и фактчекинг** материалов перед их публичным размещением.
3. Администрация не несет ответственности за блокировки аккаунтов Пользователя в сторонних социальных сетях (LinkedIn, Telegram, VC.ru и др.), возникшие в результате нарушения Пользователем правил указанных сетей.

### 6. Порядок разрешения споров
Все споры и разногласия подлежат разрешению путем конструктивных переговоров с направлением претензии на **legal@repurposeflow.com**. Срок ответа на претензию — 15 рабочих дней.
    `,
    contentEn: `
### 1. Acceptance of Terms
By creating an account, uploading media files, or accessing any service of RepurposeFlow, you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Platform.

### 2. Description of Service
RepurposeFlow is an AI-driven multimodal content transformation platform that converts long-form audio/video recordings into distributed textual and social formats using Gemini AI technology.

### 3. Intellectual Property Rights
1. **User Media Ownership**: You retain full ownership and all intellectual property rights in your uploaded recordings.
2. **User Warranty**: You represent and warrant that you own or have obtained all necessary licenses, permissions, and rights to upload and process the media and speech content on our platform.
3. **AI Output Ownership**: To the fullest extent permitted by applicable law, you own the rights to the derivative text materials generated from your source files.

### 4. Acceptable Use Policy
You agree not to use the Service to:
- Ingest, process, or disseminate unlawful, defamatory, harassing, obscene, or fraudulent content.
- Violate any third party's privacy, copyright, trademark, or trade secret rights.
- Create automated spam, phishing emails, or deceptive promotional materials.
- Attempt to compromise the security, integrity, or availability of the Platform.

### 5. Limitation of Liability & Warranty Disclaimer
1. THE SERVICE IS PROVIDED ON AN **"AS IS" AND "AS AVAILABLE"** BASIS.
2. WE EXPRESSLY DISCLAIM ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING ACCURACY OF AI OUTPUTS. Artificial intelligence models may occasionally generate hallucinations or erroneous data; **human editorial oversight is strictly required prior to publication**.
3. Under no circumstances will RepurposeFlow be liable for indirect, incidental, punitive, or consequential damages.

### 6. Dispute Resolution & Governing Law
Any inquiry or dispute shall be submitted to **legal@repurposeflow.com**. Both parties agree to make a good-faith effort to resolve any conflict through informal negotiation within 30 days.
    `
  },

  cookies: {
    id: 'cookies',
    titleRu: 'Политика использования файлов Cookie',
    titleEn: 'Cookie and Tracking Technologies Policy',
    badgeRu: 'ePrivacy Directive • GDPR • 152-ФЗ',
    badgeEn: 'ePrivacy • GDPR • CCPA Consent',
    lastUpdated: '04.09.2026',
    contentRu: `
### 1. Что такое файлы Cookie?
Файлы cookie — это небольшие текстовые фрагменты данных, сохраняемые в вашем браузере при посещении веб-сайта. Они позволяют сайту запоминать ваши предпочтения (язык интерфейса, авторизацию, активный воркспейс) и обеспечивать корректную работу интерактивных функций.

### 2. Какие категории Cookie мы используем?
1. **Строго обязательные (Strictly Necessary)**:
   - Обеспечивают базовую безопасность сессий, работу личного кабинета, защиту от CSRF-атак и сохранение вашего выбора в баннере согласия.
   - Данные cookie не могут быть отключены, так как без них функционирование веб-приложения невозможно.
2. **Функциональные (Functional)**:
   - Сохраняют выбранный язык интерфейса (RU/EN), тему оформления, выбранную по умолчанию тональность генерации (Tone of Voice).
3. **Аналитические (Analytics & Performance)**:
   - Помогают анализировать производительность страниц, скорость обработки очередей и выявлять технические ошибки. Собираются в агрегированном анонимизированном виде.
4. **Маркетинговые (Marketing)**:
   - Сервис **НЕ использует** сторонние рекламные сети для продажи таргетированной рекламы и трекинга между сайтами.

### 3. Управление файлами Cookie
Вы можете в любой момент изменить свои предпочтения:
- Воспользовавшись кнопкой **«Настройки Cookie»** в подвале сайта.
- Изменив настройки блокировки файлов cookie в вашем браузере (Chrome, Safari, Firefox, Edge).
    `,
    contentEn: `
### 1. What are Cookies?
Cookies are small text files placed on your device by your web browser when you visit websites. They are widely used to make web applications function efficiently, preserve login sessions, and save user settings.

### 2. Categories of Cookies Deployed
1. **Strictly Necessary Cookies**:
   - Vital for core application security, session authorization, CSRF protection, and recording your cookie consent state.
   - Cannot be deactivated without breaking application functionality.
2. **Functional Cookies**:
   - Remember your chosen language (RU/EN), workspace selection, and default tone-of-voice configuration.
3. **Performance & Analytics Cookies**:
   - Help monitor API error rates, processing speed, and platform health. Data is strictly aggregated and anonymized.
4. **Advertising & Marketing Cookies**:
   - We do **NOT** deploy third-party cross-site behavioral tracking or data-broker cookies.

### 3. Managing Your Preferences
You can update your cookie preferences at any time via the **"Cookie Settings"** button in the site footer or through your browser's security settings.
    `
  },

  ads_ai: {
    id: 'ads_ai',
    titleRu: 'Дисклеймер ИИ, рекламы и калькулятора ROI',
    titleEn: 'AI, Advertising & Earnings Disclaimer',
    badgeRu: '38-ФЗ о рекламе • EU AI Act • FTC Disclosures',
    badgeEn: 'FTC • EU AI Act • 38-FZ Advertising',
    lastUpdated: '04.09.2026',
    contentRu: `
### 1. Законодательство о рекламе в РФ (ФЗ № 38-ФЗ «О рекламе»)
1. **Статус Платформы**: Сервис RepurposeFlow является исключительно программным техническим инструментом (SaaS) для автоматизированной переработки и подготовки контента. Платформа **не является** рекламодателем, рекламопроизводителем, рекламораспространителем или оператором рекламных данных (ОРД).
2. **Обязанность маркировки рекламы (ЕРИР / erid)**:
   - В соответствии со статьей 18.1 Федерального закона № 38-ФЗ «О рекламе», все рекламные материалы, распространяемые в сети «Интернет» на территории РФ, подлежат обязательной маркировке идентификатором рекламы (\`erid\`) и учету в Едином реестре интернет-рекламы (ЕРИР).
   - **Ответственность за квалификацию сгенерированного текста как рекламы, получение токена в ОРД и своевременную отчетность несет исключительно Пользователь**, публикующий данный материал на целевой площадке.
3. **Отсутствие скрытой рекламы**: Материалы, созданные Платформой, не содержат скрытых ссылок на третьих лиц, если они не были явно загружены самим Пользователем.

### 2. Прозрачность искусственного интеллекта (EU AI Act & FTC Disclosures)
1. **Уведомление об ИИ**: В соответствии с Европейским регламентом об искусственном интеллекте (EU AI Act) и руководящими принципами Федеральной торговой комиссии США (FTC 16 CFR Part 255), Пользователь настоящим уведомлен, что текстовые материалы, сценарии и посты генерируются с применением нейросетевых алгоритмов Gemini.
2. **Обязанность фактчекинга**: Нейросетевые алгоритмы могут допускать неточности, искажать цифры или генерировать гипотетические данные. Пользователь несет личную ответственность за проверку сведений перед публикацией от своего имени.

### 3. Дисклеймер Калькулятора окупаемости (ROI) и заявлений о доходах
- Все расчеты, представленные в интерактивном калькуляторе на главной странице (например, «Сэкономлено 14 часов», «Экономия $880», «Рост охватов +380%»), являются **иллюстративными оценочными моделями**, основанными на средних рыночных ставках копирайтеров и редакторов.
- Данные расчеты **не являются гарантией дохода**, обещанием конкретного финансового результата или публичной офертой (ст. 437 ГК РФ). Индивидуальные результаты зависят от ниши, качества исходного звука и дистрибуционной стратегии автора.

### 4. Требования к Email-рассылкам (CAN-SPAM Act)
При использовании сгенерированных шаблонов рассылок Пользователь обязуется соблюдать требования законодательства об электронной почте (CAN-SPAM Act в США, ст. 18 ФЗ «О рекламе» в РФ): включать реальный физический адрес отправителя и действующую ссылку на отписку от рассылки.
    `,
    contentEn: `
### 1. Advertising Regulations & Disclosures (FTC & Global Standards)
1. **Tool Classification**: RepurposeFlow is strictly a technical cloud software utility (SaaS) assisting creators in repurposing speech recordings. RepurposeFlow does not act as an advertising agency, publisher, or broker.
2. **National Ad Disclosures**: Users distributing promotional or sponsored content are solely responsible for adhering to local advertising laws (including FTC Endorsement Guides in the US and mandatory national ad registration requirements such as ERIR/erid in Russia).

### 2. AI Transparency (EU AI Act & FTC Guidelines)
1. **AI Generation Notice**: Pursuant to the EU Artificial Intelligence Act and FTC guidelines, all generated text, scripts, and summaries are produced by artificial intelligence algorithms (Gemini).
2. **Human-in-the-Loop Requirement**: AI outputs may contain hallucinations, formatting artifacts, or factual inaccuracies. You are required to review, verify, and edit all materials prior to publication.

### 3. ROI Calculator & Earnings Disclaimer
- The figures generated by our interactive calculator (e.g. "Hours saved", "Budget saved", "+380% reach growth") are **hypothetical illustrative estimates** based on generic market rates for human writers.
- They do **NOT** guarantee specific earnings, audience growth, or operational savings. Actual outcomes vary depending on industry, content quality, and distribution velocity.

### 4. Email Newsletter Compliance (CAN-SPAM Act)
When deploying email campaign drafts generated by the Service, you must comply with the US CAN-SPAM Act and applicable international anti-spam legislation by including valid postal identification and a functional unsubscribe mechanism.
    `
  },

  impressum: {
    id: 'impressum',
    titleRu: 'Реквизиты, контакты и точка связи DSA',
    titleEn: 'Legal Notice, Impressum & DSA Contact',
    badgeRu: 'Реквизиты • EU Digital Services Act • Контакты',
    badgeEn: 'Corporate Details • EU DSA • Contacts',
    lastUpdated: '04.09.2026',
    contentRu: `
### 1. Сведения о сервисе
- **Наименование**: RepurposeFlow Cloud Content Platform
- **Официальный веб-сайт**: https://repurposeflow-zeta.vercel.app
- **Основной профиль**: программное обеспечение как услуга (SaaS) для мультимодальной обработки контента.

### 2. Каналы связи
- **Служба технической и клиентской поддержки**: support@repurposeflow.com
- **Юридический отдел и вопросы соблюдения законодательства**: legal@repurposeflow.com
- **Запросы по персональным данным (DPO)**: privacy@repurposeflow.com
- **Единая точка контакта для государственных органов и пользователей ЕС (EU Digital Services Act, Art. 11, 12)**: dsa-contact@repurposeflow.com (рабочие языки: русский, английский).

### 3. Хостинг и технологическая инфраструктура
- Провайдер хостинга: Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA.
- AI-инфраструктура: Google Cloud Platform (Gemini Multimodal Services).
    `,
    contentEn: `
### 1. Platform Identification
- **Service Name**: RepurposeFlow Cloud Content Platform
- **Official Web Domain**: https://repurposeflow-zeta.vercel.app
- **Core Activity**: SaaS provider for automated multimodal media transformation.

### 2. Points of Contact
- **Customer & Technical Support**: support@repurposeflow.com
- **Legal & Compliance Inquiries**: legal@repurposeflow.com
- **Data Protection Officer (DPO)**: privacy@repurposeflow.com
- **Single Point of Contact under EU Digital Services Act (DSA, Art. 11 & 12)**: dsa-contact@repurposeflow.com (Supported languages: English, Russian).

### 3. Hosting & Infrastructure Providers
- Application Host: Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA.
- AI Multimodal Inference: Google Cloud Platform (Gemini API Enterprise Services).
    `
  },

  ccpa: {
    id: 'ccpa',
    titleRu: 'Не продавать и не передавать мои личные данные (CCPA/CPRA)',
    titleEn: 'Do Not Sell or Share My Personal Information (CCPA/CPRA)',
    badgeRu: 'California Privacy Rights Act (CPRA)',
    badgeEn: 'California Consumer Privacy Act (CCPA)',
    lastUpdated: '04.09.2026',
    contentRu: `
### Уведомление для жителей Калифорнии (CCPA / CPRA)
В соответствии с Законом Калифорнии о защите персональных данных потребителей (CCPA) с изменениями согласно CPRA, жители Калифорнии имеют право запретить продажу («Sell») или передачу («Share») своих персональных данных третьим лицам для целей межконтекстной поведенческой рекламы.

### Заявление платформы RepurposeFlow:
1. **Мы НЕ продаем ваши персональные данные**. Мы никогда не передавали и не планируем передавать персональные данные пользователей брокерам данных или сторонним рекламным сетям в обмен на денежное или иное вознаграждение.
2. **Мы НЕ делимся вашими персональными данными** для показа таргетированной рекламы на сторонних сайтах.
3. Ваши загруженные медиафайлы и транскрипции используются **исключительно для выполнения ваших прямых инструкций** по переработке аудио/видео с помощью Gemini API.

Если вы хотите подтвердить свой статус отказа (Opt-Out) или направить официальный запрос в соответствии с CCPA/CPRA, обратитесь по адресу: **privacy@repurposeflow.com** с темой письма *«CCPA Do Not Sell Request»*.
    `,
    contentEn: `
### Notice for California Residents (CCPA / CPRA)
Under the California Consumer Privacy Act (CCPA), as amended by the California Privacy Rights Act (CPRA), California residents possess the statutory right to opt-out of the "sale" or "sharing" of their personal information for cross-context behavioral advertising.

### RepurposeFlow Statement:
1. **We DO NOT SELL your personal information**. We have never sold, and will never sell, personal data to data brokers or third parties for monetary or other valuable consideration.
2. **We DO NOT SHARE your personal data** for cross-context behavioral advertising.
3. All ingested recordings and generated transcripts are processed **exclusively to execute your explicit content repurposing commands** via the Gemini API.

To submit a formal California consumer rights inquiry or opt-out verification, please contact: **privacy@repurposeflow.com** with the subject line *"CCPA Do Not Sell Request"*.
    `
  }
};

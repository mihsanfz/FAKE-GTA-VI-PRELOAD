const home = document.querySelector("#home");
const usernameGate = document.querySelector("#username-gate");
const usernameForm = document.querySelector("#username-form");
const usernameInput = document.querySelector("#username-input");
const speedInput = document.querySelector("#download-speed");
const languageInput = document.querySelector("#language-select");
const countdownLabel = document.querySelector("#countdown");
const toast = document.querySelector("#toast");
const modal = document.querySelector("#download-modal");
const moreButton = document.querySelector("#more-button");
const preparingPanel = document.querySelector("#download-preparing");
const downloadItem = document.querySelector("#download-item");
const progressFill = document.querySelector("#progress-fill");
const progressBar = document.querySelector(".progress-track");
const downloadMeta = document.querySelector("#download-meta");
const libraryScreen = document.querySelector("#library-screen");
const openGameButton = document.querySelector("#open-game");
let toastTimer;
let progressTimer;
let prepareTimer;
let progress = 0;
let isPreparing = false;
let downloadDuration = Number(speedInput.value);
let downloadStartedAt;
let currentLanguage = languageInput.value;

const translations = {
  id: {
    locale: "id-ID", dayShort: "d", loading: "Memuat", progressLabel: "Progress unduhan simulasi", simulator: "SIMULATOR PRE-LOAD", description: "Pengalaman paling imersif untuk menatap progress bar dan bertanya-tanya: “kok lama banget?”",
    countdownLabel: "Hitung mundur sampai 19 November", downloadButton: "Lihat status download", releaseNote: "sampai 19 November (katanya)", fileSize: "Ukuran file:", freeSpace: "Ruang kosong:",
    friendsTitle: "Teman yang bermain", friendsEmpty: "Belum ada. Kamu yang pertama tertipu.", terms: "Health / Ratings / Privacy / Terms", disclaimer: "SIMULASI FAN-MADE — TIDAK ADA FILE YANG DIUNDUH",
    consoleMenu: "Menu konsol", home: "Beranda", games: "Game", notifications: "Notifikasi", music: "Musik", settings: "Pengaturan",
    preparing: "Menyiapkan download...", signIn: "PLAYER SIGN-IN", welcome: "Siapa namamu?", welcomeText: "Masukkan username untuk masuk ke game library.",
    usernameLabel: "USERNAME KAMU", usernamePlaceholder: "Contoh: Lucia", speedLabel: "KECEPATAN DOWNLOAD", languageLabel: "BAHASA / LANGUAGE", enter: "Masuk",
    gateDisclaimer: "SIMULASI FAN-MADE — BUKAN GAME RESMI", toast: "Info: game ini hanya simulasi untuk bercanda.",
    speeds: ["1 Bulan", "10 hari", "5 hari", "2 hari", "1 hari", "12 jam", "5 jam", "1 jam", "30 menit", "GOD MODE 5 menit wkwk"],
    eta: (d, h, m) => d ? `${d} hari ${h} jam tersisa` : h ? `${h} jam ${m} menit tersisa` : `${m} menit tersisa`,
  },
  en: {
    locale: "en-US", dayShort: "d", loading: "Loading", progressLabel: "Download progress simulation", simulator: "PRE-LOAD SIMULATOR", description: "The most immersive experience in watching a progress bar and asking: “why is this taking so long?”",
    countdownLabel: "Countdown to November 19", downloadButton: "View download status", releaseNote: "until November 19 (allegedly)", fileSize: "File size:", freeSpace: "Free space:",
    friendsTitle: "Friends who play", friendsEmpty: "No friends yet. You're the first to fall for it.", terms: "Health / Ratings / Privacy / Terms", disclaimer: "FAN-MADE SIMULATION — NO FILES ARE DOWNLOADED",
    consoleMenu: "Console menu", home: "Home", games: "Games", notifications: "Notifications", music: "Music", settings: "Settings",
    preparing: "Preparing download...", signIn: "PLAYER SIGN-IN", welcome: "What's your name?", welcomeText: "Enter a username to access the game library.",
    usernameLabel: "YOUR USERNAME", usernamePlaceholder: "Example: Lucia", speedLabel: "DOWNLOAD SPEED", languageLabel: "LANGUAGE", enter: "Enter",
    gateDisclaimer: "FAN-MADE SIMULATION — NOT AN OFFICIAL GAME", toast: "Info: this game is just a joke simulation.",
    speeds: ["1 month", "10 days", "5 days", "2 days", "1 day", "12 hours", "5 hours", "1 hour", "30 minutes", "GOD MODE 5 minutes lol"],
    eta: (d, h, m) => d ? `${d} day${d === 1 ? "" : "s"} left` : h ? `${h}h ${m}m left` : `${m}m left`,
  },
  ru: {
    locale: "ru-RU", dayShort: "д", loading: "Загрузка", progressLabel: "Симуляция загрузки", simulator: "СИМУЛЯТОР ПРЕДЗАГРУЗКИ", description: "Самое захватывающее занятие — смотреть на индикатор загрузки и думать: «почему так долго?»",
    countdownLabel: "Обратный отсчёт до 19 ноября", downloadButton: "Статус загрузки", releaseNote: "до 19 ноября (якобы)", fileSize: "Размер файла:", freeSpace: "Свободно:",
    friendsTitle: "Друзья в игре", friendsEmpty: "Пока никого. Ты первым попался на эту шутку.", terms: "Здоровье / Рейтинг / Конфиденциальность / Условия", disclaimer: "ФАНАТСКАЯ СИМУЛЯЦИЯ — ФАЙЛЫ НЕ СКАЧИВАЮТСЯ",
    consoleMenu: "Меню консоли", home: "Главная", games: "Игры", notifications: "Уведомления", music: "Музыка", settings: "Настройки",
    preparing: "Подготовка загрузки...", signIn: "ВХОД ИГРОКА", welcome: "Как тебя зовут?", welcomeText: "Введи имя пользователя для входа в библиотеку игр.",
    usernameLabel: "ИМЯ ПОЛЬЗОВАТЕЛЯ", usernamePlaceholder: "Например: Lucia", speedLabel: "СКОРОСТЬ ЗАГРУЗКИ", languageLabel: "ЯЗЫК", enter: "Войти",
    gateDisclaimer: "ФАНАТСКАЯ СИМУЛЯЦИЯ — НЕ ОФИЦИАЛЬНАЯ ИГРА", toast: "Информация: это шуточная симуляция.",
    speeds: ["1 месяц", "10 дней", "5 дней", "2 дня", "1 день", "12 часов", "5 часов", "1 час", "30 минут", "РЕЖИМ БОГА — 5 минут"],
    eta: (d, h, m) => d ? `${d} дн. ${h} ч. осталось` : h ? `${h} ч. ${m} мин. осталось` : `${m} мин. осталось`,
  },
  ja: {
    locale: "ja-JP", dayShort: "日", loading: "読み込み中", progressLabel: "ダウンロード進行状況のシミュレーション", simulator: "事前ダウンロード・シミュレーター", description: "進行状況バーを眺めながら「まだ終わらないの？」と思う、最高に没入できる体験。",
    countdownLabel: "11月19日までのカウントダウン", downloadButton: "ダウンロード状況", releaseNote: "11月19日まで（たぶん）", fileSize: "ファイルサイズ：", freeSpace: "空き容量：",
    friendsTitle: "プレイ中のフレンド", friendsEmpty: "まだいません。最初にこの冗談に引っかかったのはあなたです。", terms: "健康 / レーティング / プライバシー / 利用規約", disclaimer: "ファンメイドのシミュレーション — ファイルはダウンロードされません",
    consoleMenu: "コンソールメニュー", home: "ホーム", games: "ゲーム", notifications: "通知", music: "ミュージック", settings: "設定",
    preparing: "ダウンロードを準備中...", signIn: "プレイヤーサインイン", welcome: "お名前は？", welcomeText: "ゲームライブラリーに入るユーザー名を入力してください。",
    usernameLabel: "ユーザー名", usernamePlaceholder: "例：Lucia", speedLabel: "ダウンロード速度", languageLabel: "言語", enter: "入る",
    gateDisclaimer: "ファンメイドのシミュレーション — 公式ゲームではありません", toast: "お知らせ：これはジョーク用のシミュレーションです。",
    speeds: ["1か月", "10日", "5日", "2日", "1日", "12時間", "5時間", "1時間", "30分", "ゴッドモード 5分 w"],
    eta: (d, h, m) => d ? `残り${d}日 ${h}時間` : h ? `残り${h}時間 ${m}分` : `残り${m}分`,
  },
  ar: {
    locale: "ar-SA", dayShort: "ي", loading: "جارٍ التحميل", progressLabel: "محاكاة تقدم التنزيل", simulator: "محاكاة التحميل المسبق", description: "تجربة غامرة لمشاهدة شريط التقدم والتساؤل: «لماذا يستغرق كل هذا الوقت؟»",
    countdownLabel: "العد التنازلي حتى 19 نوفمبر", downloadButton: "حالة التنزيل", releaseNote: "حتى 19 نوفمبر (على ما يُقال)", fileSize: "حجم الملف:", freeSpace: "المساحة المتاحة:",
    friendsTitle: "الأصدقاء الذين يلعبون", friendsEmpty: "لا يوجد أحد بعد. أنت أول من صدّق هذه المزحة.", terms: "الصحة / التصنيف / الخصوصية / الشروط", disclaimer: "محاكاة من صنع المعجبين — لا يتم تنزيل أي ملفات",
    consoleMenu: "قائمة الجهاز", home: "الرئيسية", games: "الألعاب", notifications: "الإشعارات", music: "الموسيقى", settings: "الإعدادات",
    preparing: "جارٍ تجهيز التنزيل...", signIn: "تسجيل دخول اللاعب", welcome: "ما اسمك؟", welcomeText: "أدخل اسم المستخدم للدخول إلى مكتبة الألعاب.",
    usernameLabel: "اسم المستخدم", usernamePlaceholder: "مثال: Lucia", speedLabel: "سرعة التنزيل", languageLabel: "اللغة", enter: "دخول",
    gateDisclaimer: "محاكاة من صنع المعجبين — ليست لعبة رسمية", toast: "معلومة: هذه مجرد محاكاة للمزاح.",
    speeds: ["شهر واحد", "10 أيام", "5 أيام", "يومان", "يوم واحد", "12 ساعة", "5 ساعات", "ساعة واحدة", "30 دقيقة", "وضع خارق — 5 دقائق"],
    eta: (d, h, m) => d ? `متبقي ${d} يوم و${h} ساعة` : h ? `متبقي ${h} ساعة و${m} دقيقة` : `متبقي ${m} دقيقة`,
  },
  zh: {
    locale: "zh-CN", dayShort: "天", loading: "加载中", progressLabel: "下载进度模拟", simulator: "预下载模拟器", description: "沉浸式体验：盯着进度条，心想“怎么还要这么久？”",
    countdownLabel: "距离11月19日倒计时", downloadButton: "查看下载状态", releaseNote: "距离11月19日（据说）", fileSize: "文件大小：", freeSpace: "可用空间：",
    friendsTitle: "正在游玩的好友", friendsEmpty: "还没有好友。你是第一个相信这个玩笑的人。", terms: "健康 / 评级 / 隐私 / 条款", disclaimer: "粉丝制作的模拟 — 不会下载任何文件",
    consoleMenu: "主机菜单", home: "主页", games: "游戏", notifications: "通知", music: "音乐", settings: "设置",
    preparing: "正在准备下载...", signIn: "玩家登录", welcome: "你叫什么名字？", welcomeText: "输入用户名以进入游戏库。",
    usernameLabel: "用户名", usernamePlaceholder: "例如：Lucia", speedLabel: "下载速度", languageLabel: "语言", enter: "进入",
    gateDisclaimer: "粉丝制作的模拟 — 并非官方游戏", toast: "提示：这只是一个玩笑模拟。",
    speeds: ["1个月", "10天", "5天", "2天", "1天", "12小时", "5小时", "1小时", "30分钟", "上帝模式 5分钟 哈哈"],
    eta: (d, h, m) => d ? `剩余${d}天 ${h}小时` : h ? `剩余${h}小时 ${m}分钟` : `剩余${m}分钟`,
  },
  de: {
    locale: "de-DE", dayShort: "T", loading: "Wird geladen", progressLabel: "Download-Fortschrittssimulation", simulator: "PRELOAD-SIMULATOR", description: "Das ultimative Erlebnis: den Fortschrittsbalken beobachten und sich fragen: „Warum dauert das so lange?“",
    countdownLabel: "Countdown bis zum 19. November", downloadButton: "Downloadstatus anzeigen", releaseNote: "bis zum 19. November (angeblich)", fileSize: "Dateigröße:", freeSpace: "Freier Speicher:",
    friendsTitle: "Freunde im Spiel", friendsEmpty: "Noch niemand. Du bist als Erstes auf den Scherz hereingefallen.", terms: "Gesundheit / Bewertungen / Datenschutz / Bedingungen", disclaimer: "FAN-SIMULATION — ES WERDEN KEINE DATEIEN HERUNTERGELADEN",
    consoleMenu: "Konsolenmenü", home: "Startseite", games: "Spiele", notifications: "Benachrichtigungen", music: "Musik", settings: "Einstellungen",
    preparing: "Download wird vorbereitet...", signIn: "SPIELER-ANMELDUNG", welcome: "Wie heißt du?", welcomeText: "Gib einen Benutzernamen ein, um die Spielebibliothek zu öffnen.",
    usernameLabel: "BENUTZERNAME", usernamePlaceholder: "Zum Beispiel: Lucia", speedLabel: "DOWNLOAD-GESCHWINDIGKEIT", languageLabel: "SPRACHE", enter: "Weiter",
    gateDisclaimer: "FAN-SIMULATION — KEIN OFFIZIELLES SPIEL", toast: "Info: Das Spiel ist nur eine Spaß-Simulation.",
    speeds: ["1 Monat", "10 Tage", "5 Tage", "2 Tage", "1 Tag", "12 Stunden", "5 Stunden", "1 Stunde", "30 Minuten", "GOTT-MODUS 5 Minuten lol"],
    eta: (d, h, m) => d ? `Noch ${d} Tg. ${h} Std.` : h ? `Noch ${h} Std. ${m} Min.` : `Noch ${m} Min.`,
  },
  es: {
    locale: "es-ES", dayShort: "d", loading: "Cargando", progressLabel: "Simulación del progreso de descarga", simulator: "SIMULADOR DE PRE-DESCARGA", description: "La experiencia más inmersiva: mirar una barra de progreso y preguntarse «¿por qué tarda tanto?»",
    countdownLabel: "Cuenta atrás hasta el 19 de noviembre", downloadButton: "Ver estado de descarga", releaseNote: "hasta el 19 de noviembre (supuestamente)", fileSize: "Tamaño del archivo:", freeSpace: "Espacio disponible:",
    friendsTitle: "Amigos que juegan", friendsEmpty: "Aún no hay. Eres el primero en caer en la broma.", terms: "Salud / Clasificación / Privacidad / Términos", disclaimer: "SIMULACIÓN HECHA POR FANS — NO SE DESCARGAN ARCHIVOS",
    consoleMenu: "Menú de consola", home: "Inicio", games: "Juegos", notifications: "Notificaciones", music: "Música", settings: "Ajustes",
    preparing: "Preparando descarga...", signIn: "INICIO DE SESIÓN", welcome: "¿Cómo te llamas?", welcomeText: "Escribe un nombre de usuario para entrar a la biblioteca de juegos.",
    usernameLabel: "NOMBRE DE USUARIO", usernamePlaceholder: "Ejemplo: Lucia", speedLabel: "VELOCIDAD DE DESCARGA", languageLabel: "IDIOMA", enter: "Entrar",
    gateDisclaimer: "SIMULACIÓN HECHA POR FANS — NO ES UN JUEGO OFICIAL", toast: "Aviso: esto es solo una simulación de broma.",
    speeds: ["1 mes", "10 días", "5 días", "2 días", "1 día", "12 horas", "5 horas", "1 hora", "30 minutos", "MODO DIOS 5 minutos jaja"],
    eta: (d, h, m) => d ? `Quedan ${d} d ${h} h` : h ? `Quedan ${h} h ${m} min` : `Quedan ${m} min`,
  },
  fr: {
    locale: "fr-FR", dayShort: "j", loading: "Chargement", progressLabel: "Simulation de progression du téléchargement", simulator: "SIMULATEUR DE PRÉCHARGEMENT", description: "L’expérience la plus immersive : regarder une barre de progression et se demander « pourquoi est-ce si long ? »",
    countdownLabel: "Compte à rebours jusqu’au 19 novembre", downloadButton: "Voir l’état du téléchargement", releaseNote: "jusqu’au 19 novembre (soi-disant)", fileSize: "Taille du fichier :", freeSpace: "Espace libre :",
    friendsTitle: "Amis en jeu", friendsEmpty: "Personne pour l’instant. Tu es le premier à te faire avoir.", terms: "Santé / Classification / Confidentialité / Conditions", disclaimer: "SIMULATION DE FANS — AUCUN FICHIER N’EST TÉLÉCHARGÉ",
    consoleMenu: "Menu de la console", home: "Accueil", games: "Jeux", notifications: "Notifications", music: "Musique", settings: "Paramètres",
    preparing: "Préparation du téléchargement...", signIn: "CONNEXION JOUEUR", welcome: "Comment tu t’appelles ?", welcomeText: "Saisis un nom d’utilisateur pour accéder à la bibliothèque de jeux.",
    usernameLabel: "NOM D’UTILISATEUR", usernamePlaceholder: "Exemple : Lucia", speedLabel: "VITESSE DE TÉLÉCHARGEMENT", languageLabel: "LANGUE", enter: "Entrer",
    gateDisclaimer: "SIMULATION DE FANS — PAS UN JEU OFFICIEL", toast: "Info : ce jeu est une simulation humoristique.",
    speeds: ["1 mois", "10 jours", "5 jours", "2 jours", "1 jour", "12 heures", "5 heures", "1 heure", "30 minutes", "MODE DIEU 5 minutes lol"],
    eta: (d, h, m) => d ? `Encore ${d} j ${h} h` : h ? `Encore ${h} h ${m} min` : `Encore ${m} min`,
  },
  ko: {
    locale: "ko-KR", dayShort: "일", loading: "로딩 중", progressLabel: "다운로드 진행 시뮬레이션", simulator: "사전 다운로드 시뮬레이터", description: "진행 표시줄을 바라보며 “왜 이렇게 오래 걸리지?”라고 생각하는 몰입형 경험.",
    countdownLabel: "11월 19일까지 카운트다운", downloadButton: "다운로드 상태 보기", releaseNote: "11월 19일까지 (라고 합니다)", fileSize: "파일 크기:", freeSpace: "사용 가능 공간:",
    friendsTitle: "함께 플레이하는 친구", friendsEmpty: "아직 없어요. 이 농담에 가장 먼저 속으셨네요.", terms: "건강 / 등급 / 개인정보 / 약관", disclaimer: "팬 제작 시뮬레이션 — 실제 파일은 다운로드되지 않습니다",
    consoleMenu: "콘솔 메뉴", home: "홈", games: "게임", notifications: "알림", music: "음악", settings: "설정",
    preparing: "다운로드 준비 중...", signIn: "플레이어 로그인", welcome: "이름이 뭐예요?", welcomeText: "게임 라이브러리에 들어갈 사용자 이름을 입력하세요.",
    usernameLabel: "사용자 이름", usernamePlaceholder: "예: Lucia", speedLabel: "다운로드 속도", languageLabel: "언어", enter: "입장",
    gateDisclaimer: "팬 제작 시뮬레이션 — 공식 게임이 아닙니다", toast: "안내: 장난용 시뮬레이션입니다.",
    speeds: ["1개월", "10일", "5일", "2일", "1일", "12시간", "5시간", "1시간", "30분", "갓 모드 5분 ㅋㅋ"],
    eta: (d, h, m) => d ? `${d}일 ${h}시간 남음` : h ? `${h}시간 ${m}분 남음` : `${m}분 남음`,
  },
  pt: {
    locale: "pt-BR", dayShort: "d", loading: "Carregando", progressLabel: "Simulação do progresso do download", simulator: "SIMULADOR DE PRÉ-DOWNLOAD", description: "A experiência mais imersiva: olhar para uma barra de progresso e pensar “por que está demorando tanto?”",
    countdownLabel: "Contagem regressiva até 19 de novembro", downloadButton: "Ver status do download", releaseNote: "até 19 de novembro (supostamente)", fileSize: "Tamanho do arquivo:", freeSpace: "Espaço livre:",
    friendsTitle: "Amigos que jogam", friendsEmpty: "Ainda não há ninguém. Você foi o primeiro a cair nessa.", terms: "Saúde / Classificação / Privacidade / Termos", disclaimer: "SIMULAÇÃO DE FÃ — NENHUM ARQUIVO É BAIXADO",
    consoleMenu: "Menu do console", home: "Início", games: "Jogos", notifications: "Notificações", music: "Música", settings: "Configurações",
    preparing: "Preparando download...", signIn: "ENTRADA DO JOGADOR", welcome: "Qual é o seu nome?", welcomeText: "Digite um nome de usuário para entrar na biblioteca de jogos.",
    usernameLabel: "NOME DE USUÁRIO", usernamePlaceholder: "Exemplo: Lucia", speedLabel: "VELOCIDADE DO DOWNLOAD", languageLabel: "IDIOMA", enter: "Entrar",
    gateDisclaimer: "SIMULAÇÃO DE FÃ — NÃO É UM JOGO OFICIAL", toast: "Aviso: isto é apenas uma simulação de brincadeira.",
    speeds: ["1 mês", "10 dias", "5 dias", "2 dias", "1 dia", "12 horas", "5 horas", "1 hora", "30 minutos", "MODO DEUS 5 minutos kkk"],
    eta: (d, h, m) => d ? `Restam ${d} d ${h} h` : h ? `Restam ${h} h ${m} min` : `Restam ${m} min`,
  },
  it: {
    locale: "it-IT", dayShort: "g", loading: "Caricamento", progressLabel: "Simulazione avanzamento download", simulator: "SIMULATORE DI PRE-CARICAMENTO", description: "L’esperienza più immersiva: guardare una barra di avanzamento e chiedersi «perché ci mette così tanto?»",
    countdownLabel: "Conto alla rovescia fino al 19 novembre", downloadButton: "Vedi stato download", releaseNote: "fino al 19 novembre (a quanto pare)", fileSize: "Dimensione file:", freeSpace: "Spazio libero:",
    friendsTitle: "Amici che giocano", friendsEmpty: "Ancora nessuno. Sei il primo a cascarci.", terms: "Salute / Classificazione / Privacy / Termini", disclaimer: "SIMULAZIONE DEI FAN — NESSUN FILE VIENE SCARICATO",
    consoleMenu: "Menu console", home: "Home", games: "Giochi", notifications: "Notifiche", music: "Musica", settings: "Impostazioni",
    preparing: "Preparazione del download...", signIn: "ACCESSO GIOCATORE", welcome: "Come ti chiami?", welcomeText: "Inserisci un nome utente per accedere alla raccolta giochi.",
    usernameLabel: "NOME UTENTE", usernamePlaceholder: "Esempio: Lucia", speedLabel: "VELOCITÀ DI DOWNLOAD", languageLabel: "LINGUA", enter: "Entra",
    gateDisclaimer: "SIMULAZIONE DEI FAN — NON È UN GIOCO UFFICIALE", toast: "Info: è solo una simulazione scherzosa.",
    speeds: ["1 mese", "10 giorni", "5 giorni", "2 giorni", "1 giorno", "12 ore", "5 ore", "1 ora", "30 minuti", "MODALITÀ DIO 5 minuti ahah"],
    eta: (d, h, m) => d ? `Ancora ${d} g ${h} h` : h ? `Ancora ${h} h ${m} min` : `Ancora ${m} min`,
  },
  hi: {
    locale: "hi-IN", dayShort: "दि", loading: "लोड हो रहा है", progressLabel: "डाउनलोड प्रगति सिम्युलेशन", simulator: "प्री-लोड सिम्युलेटर", description: "प्रोग्रेस बार देखते हुए यह सोचना कि “इतना समय क्यों लग रहा है?” — सबसे रोमांचक अनुभव।",
    countdownLabel: "19 नवंबर तक उलटी गिनती", downloadButton: "डाउनलोड स्थिति देखें", releaseNote: "19 नवंबर तक (कथित तौर पर)", fileSize: "फ़ाइल का आकार:", freeSpace: "खाली जगह:",
    friendsTitle: "खेलने वाले दोस्त", friendsEmpty: "अभी कोई नहीं। इस मज़ाक में सबसे पहले आप फँसे।", terms: "स्वास्थ्य / रेटिंग / गोपनीयता / शर्तें", disclaimer: "फैन-निर्मित सिम्युलेशन — कोई फ़ाइल डाउनलोड नहीं होती",
    consoleMenu: "कंसोल मेन्यू", home: "होम", games: "गेम", notifications: "सूचनाएँ", music: "संगीत", settings: "सेटिंग",
    preparing: "डाउनलोड तैयार हो रहा है...", signIn: "प्लेयर साइन-इन", welcome: "आपका नाम क्या है?", welcomeText: "गेम लाइब्रेरी में जाने के लिए यूज़रनेम डालें।",
    usernameLabel: "आपका यूज़रनेम", usernamePlaceholder: "उदाहरण: Lucia", speedLabel: "डाउनलोड गति", languageLabel: "भाषा", enter: "आगे बढ़ें",
    gateDisclaimer: "फैन-निर्मित सिम्युलेशन — आधिकारिक गेम नहीं", toast: "जानकारी: यह सिर्फ़ मज़ाकिया सिम्युलेशन है।",
    speeds: ["1 महीना", "10 दिन", "5 दिन", "2 दिन", "1 दिन", "12 घंटे", "5 घंटे", "1 घंटा", "30 मिनट", "गॉड मोड 5 मिनट हाहा"],
    eta: (d, h, m) => d ? `${d} दिन ${h} घंटे शेष` : h ? `${h} घंटे ${m} मिनट शेष` : `${m} मिनट शेष`,
  },
};

const libraryTranslations = {
  id: { libraryTitle: "Perpustakaan Game", libraryNav: "Navigasi perpustakaan", search: "Cari", sortFilter: "Urutkan dan filter", accessories: "Aksesori", installed: "Terinstal", collection: "Koleksi Anda", playstationPlus: "PlayStation Plus", allGames: "Semua: 1", sortBy: "Urutkan:", mostRecent: "Terbaru", gameCover: "Grand Theft Auto VI" },
  en: { libraryTitle: "Game Library", libraryNav: "Library navigation", search: "Search", sortFilter: "Sort and filter", accessories: "Accessories", installed: "Installed", collection: "Your Collection", playstationPlus: "PlayStation Plus", allGames: "All: 1", sortBy: "Sort by:", mostRecent: "Most Recent", gameCover: "Grand Theft Auto VI" },
  ru: { libraryTitle: "Библиотека игр", libraryNav: "Навигация по библиотеке", search: "Поиск", sortFilter: "Сортировка и фильтр", accessories: "Аксессуары", installed: "Установлено", collection: "Ваша коллекция", playstationPlus: "PlayStation Plus", allGames: "Все: 1", sortBy: "Сортировка:", mostRecent: "Сначала новые", gameCover: "Grand Theft Auto VI" },
  ja: { libraryTitle: "ゲームライブラリー", libraryNav: "ライブラリーナビゲーション", search: "検索", sortFilter: "並べ替えとフィルター", accessories: "アクセサリー", installed: "インストール済み", collection: "あなたのコレクション", playstationPlus: "PlayStation Plus", allGames: "すべて: 1", sortBy: "並べ替え:", mostRecent: "最近追加した順", gameCover: "Grand Theft Auto VI" },
  ar: { libraryTitle: "مكتبة الألعاب", libraryNav: "التنقل في المكتبة", search: "بحث", sortFilter: "ترتيب وتصفية", accessories: "الملحقات", installed: "المثبتة", collection: "مجموعتك", playstationPlus: "PlayStation Plus", allGames: "الكل: 1", sortBy: "ترتيب حسب:", mostRecent: "الأحدث", gameCover: "Grand Theft Auto VI" },
  zh: { libraryTitle: "游戏库", libraryNav: "游戏库导航", search: "搜索", sortFilter: "排序和筛选", accessories: "配件", installed: "已安装", collection: "你的收藏", playstationPlus: "PlayStation Plus", allGames: "全部：1", sortBy: "排序方式：", mostRecent: "最近添加", gameCover: "Grand Theft Auto VI" },
  de: { libraryTitle: "Spielebibliothek", libraryNav: "Bibliotheksnavigation", search: "Suchen", sortFilter: "Sortieren und filtern", accessories: "Zubehör", installed: "Installiert", collection: "Deine Sammlung", playstationPlus: "PlayStation Plus", allGames: "Alle: 1", sortBy: "Sortieren nach:", mostRecent: "Zuletzt hinzugefügt", gameCover: "Grand Theft Auto VI" },
  es: { libraryTitle: "Biblioteca de juegos", libraryNav: "Navegación de biblioteca", search: "Buscar", sortFilter: "Ordenar y filtrar", accessories: "Accesorios", installed: "Instalados", collection: "Tu colección", playstationPlus: "PlayStation Plus", allGames: "Todos: 1", sortBy: "Ordenar por:", mostRecent: "Más recientes", gameCover: "Grand Theft Auto VI" },
  fr: { libraryTitle: "Bibliothèque de jeux", libraryNav: "Navigation de la bibliothèque", search: "Rechercher", sortFilter: "Trier et filtrer", accessories: "Accessoires", installed: "Installés", collection: "Votre collection", playstationPlus: "PlayStation Plus", allGames: "Tous : 1", sortBy: "Trier par :", mostRecent: "Plus récents", gameCover: "Grand Theft Auto VI" },
  ko: { libraryTitle: "게임 라이브러리", libraryNav: "라이브러리 탐색", search: "검색", sortFilter: "정렬 및 필터", accessories: "액세서리", installed: "설치됨", collection: "내 컬렉션", playstationPlus: "PlayStation Plus", allGames: "전체: 1", sortBy: "정렬 기준:", mostRecent: "최근 항목", gameCover: "Grand Theft Auto VI" },
  pt: { libraryTitle: "Biblioteca de jogos", libraryNav: "Navegação da biblioteca", search: "Pesquisar", sortFilter: "Ordenar e filtrar", accessories: "Acessórios", installed: "Instalados", collection: "Sua coleção", playstationPlus: "PlayStation Plus", allGames: "Todos: 1", sortBy: "Ordenar por:", mostRecent: "Mais recentes", gameCover: "Grand Theft Auto VI" },
  it: { libraryTitle: "Libreria giochi", libraryNav: "Navigazione libreria", search: "Cerca", sortFilter: "Ordina e filtra", accessories: "Accessori", installed: "Installati", collection: "La tua raccolta", playstationPlus: "PlayStation Plus", allGames: "Tutti: 1", sortBy: "Ordina per:", mostRecent: "Più recenti", gameCover: "Grand Theft Auto VI" },
  hi: { libraryTitle: "गेम लाइब्रेरी", libraryNav: "लाइब्रेरी नेविगेशन", search: "खोजें", sortFilter: "क्रम और फ़िल्टर", accessories: "एक्सेसरीज़", installed: "इंस्टॉल किए गए", collection: "आपका संग्रह", playstationPlus: "PlayStation Plus", allGames: "सभी: 1", sortBy: "क्रम:", mostRecent: "हाल ही में जोड़े गए", gameCover: "Grand Theft Auto VI" },
};

function applyLanguage(language) {
  currentLanguage = translations[language] ? language : "id";
  const translation = translations[currentLanguage];
  document.documentElement.lang = translation.locale;
  document.documentElement.dir = currentLanguage === "ar" ? "rtl" : "ltr";
  document.title = `Grand Theft Auto VI — ${translation.simulator}`;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (translation[key]) element.textContent = translation[key];
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    const key = element.dataset.i18nAriaLabel;
    if (translation[key]) element.setAttribute("aria-label", translation[key]);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    const key = element.dataset.i18nPlaceholder;
    if (translation[key]) element.setAttribute("placeholder", translation[key]);
  });
  document.querySelectorAll("[data-library-i18n]").forEach((element) => {
    const key = element.dataset.libraryI18n;
    element.textContent = libraryTranslations[currentLanguage][key];
  });
  document.querySelectorAll("[data-library-i18n-aria-label]").forEach((element) => {
    const key = element.dataset.libraryI18nAriaLabel;
    element.setAttribute("aria-label", libraryTranslations[currentLanguage][key]);
  });
  document.querySelectorAll("#download-speed option").forEach((option, index) => {
    option.textContent = translation.speeds[index];
  });
  updateCountdown();
  updateClock();
  if (downloadStartedAt) updateDownloadProgress();
}

languageInput.addEventListener("change", () => applyLanguage(languageInput.value));
applyLanguage(currentLanguage);

function enterGameLibrary(username) {
  const displayName = username.trim();
  downloadDuration = Number(speedInput.value);
  document.querySelector("#profile-name").textContent = displayName;
  document.querySelector("#profile-avatar").firstChild.textContent = displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
  home.setAttribute("aria-hidden", "false");
  usernameGate.hidden = true;
  libraryScreen.hidden = false;
  libraryScreen.setAttribute("aria-hidden", "false");
  openGameButton.focus();
}

openGameButton.addEventListener("click", () => {
  libraryScreen.hidden = true;
  libraryScreen.setAttribute("aria-hidden", "true");
  home.setAttribute("aria-hidden", "false");
  moreButton.focus();
});

usernameForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!usernameForm.reportValidity()) return;
  enterGameLibrary(usernameInput.value);
});

usernameInput.focus();

document.querySelectorAll(".custom-image").forEach((image) => {
  const showImage = () => image.parentElement.classList.add("has-image");
  const hideImage = () => image.remove();
  image.addEventListener("load", showImage);
  image.addEventListener("error", hideImage);
  if (image.complete) {
    if (image.naturalWidth > 0) showImage();
    else hideImage();
  }
});

function updateCountdown() {
  const now = new Date();
  let target = new Date(now.getFullYear(), 10, 19, 0, 0, 0);
  if (target <= now) target = new Date(now.getFullYear() + 1, 10, 19, 0, 0, 0);

  const remainingSeconds = Math.max(0, Math.floor((target.getTime() - now.getTime()) / 1000));
  const days = Math.floor(remainingSeconds / 86400);
  const hours = Math.floor((remainingSeconds % 86400) / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;
  const translation = translations[currentLanguage];
  const numberFormat = new Intl.NumberFormat(translation.locale, { useGrouping: false });
  const twoDigitFormat = new Intl.NumberFormat(translation.locale, { useGrouping: false, minimumIntegerDigits: 2 });
  countdownLabel.textContent = `${numberFormat.format(days)}${translation.dayShort} ${twoDigitFormat.format(hours)}:${twoDigitFormat.format(minutes)}:${twoDigitFormat.format(seconds)}`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 3000);
}

function updateDownloadProgress() {
  const translation = translations[currentLanguage];
  const elapsed = Math.min(Date.now() - downloadStartedAt, downloadDuration);
  progress = elapsed / downloadDuration * 100;
  const downloadedMb = 173.6 + ((209750 - 173.6) * progress / 100);
  const numberFormat = new Intl.NumberFormat(translation.locale, { useGrouping: false, minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const downloadedSize = downloadedMb < 1000
    ? `${numberFormat.format(downloadedMb)} MB`
    : `${numberFormat.format(downloadedMb / 1000)} GB`;
  const totalSize = new Intl.NumberFormat(translation.locale, { useGrouping: false, minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(209.75);
  const remainingMs = Math.max(0, downloadDuration - elapsed);
  const remainingMinutes = Math.ceil(remainingMs / 60000);
  const remainingDays = Math.floor(remainingMinutes / 1440);
  const remainingHours = Math.floor((remainingMinutes % 1440) / 60);
  const minutes = remainingMinutes % 60;

  progressFill.style.width = `${Math.max(0.15, downloadedMb / 209750 * 100)}%`;
  progressBar.setAttribute("aria-valuenow", String(Math.round(downloadedMb / 209750 * 10000) / 100));
  const remainingTime = translation.eta(remainingDays, remainingHours, minutes);
  downloadMeta.textContent = `${remainingTime} (${downloadedSize}/${totalSize} GB)`;

  if (elapsed >= downloadDuration) {
    clearInterval(progressTimer);
    progressTimer = undefined;
  }
}

function openDownload() {
  moreButton.classList.add("has-opened");
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  if (!downloadStartedAt && !isPreparing) {
    isPreparing = true;
    preparingPanel.hidden = false;
    downloadItem.hidden = true;
    prepareTimer = setTimeout(() => {
      isPreparing = false;
      prepareTimer = undefined;
      preparingPanel.hidden = true;
      downloadItem.hidden = false;
      downloadStartedAt = Date.now();
      updateDownloadProgress();
      progressTimer = setInterval(updateDownloadProgress, 500);
    }, 850);
  }
}

moreButton.addEventListener("click", openDownload);

function closeDownload() {
  if (prepareTimer) {
    clearTimeout(prepareTimer);
    prepareTimer = undefined;
    isPreparing = false;
    preparingPanel.hidden = true;
    downloadItem.hidden = false;
  }
  modal.hidden = true;
  document.body.style.overflow = "";
  moreButton.focus();
}

modal.addEventListener("click", (event) => {
  if (event.target === modal) closeDownload();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.hidden) closeDownload();
});

function updateClock() {
  document.querySelector("#clock").textContent = new Intl.DateTimeFormat(translations[currentLanguage].locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

updateCountdown();
updateClock();
setInterval(updateCountdown, 1000);
setInterval(updateClock, 30000);

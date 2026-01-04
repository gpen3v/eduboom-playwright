# Playwright Автоматизирани тестове за eduboom.pl

### Покритие на тестовете
1. Onboarding Flow - по задание
- Позитивен сценарий - успешен onboarding на нов потребител, след избор на роля "Ученик", избор на произволен клас и пренасочване към /dashboard, където се показват само уроци на избрания клас.
- Негативен сценарий - симулация на сървърна грешка (status 500) и неуспешно пренасочване към /dashboard
2. Guest Learning Flow - сценарий по избор. Обхваща избирането на клас и предмет от /lessons страницата, избор на урок и гледане на видео урок от нерегистриран потребител. Достъпът и гледането на видео уроци е фундаментът на платформата, затова е избран за автоматизиране. Качеството и надеждността на тази функционалност дава възможност на потребителя да се ангажира с процеса на обучение, от което следва регистрация и абонамент. Те също са критични функционалности за потребителя и бизнеса, но зависят от външни системи и е трудно да се осигури цялостно покритие и стабилност на автоматизираните тестове без достъп до тях.

### Структура
```
├── .github/workflows/                   # GitHub Actions workflows за CI/CD
│   └── playwright.yml                      # Workflow за Playwright тестовете
├── fixtures/                            # Директория за fixtures
│   └── fixtures.ts                         # fixture за подготовка на тестовата среда
├── pages/                               # Page Objects - преизползваеми локатори и методи
│   ├── dashboard.ts                     
│   ├── general.ts                       
│   ├── lessons.ts                       
│   ├── mission.ts                       
│   ├── onboarding.ts                    
│   ├── subject.ts                       
│   └── videoLesson.ts                   
├── tests/                               # E2E Тестове
│   ├── onboardingFlow.spec.ts              # Onboarding flow тестове
│   └── videoLessonFlow.spec.ts             # Video lesson flow test
├── utils/                               # Директория за помощни файлове
│     └── testData.json                     # Тестови данни
└── playwright.config.ts                 # Playwright конфигурация
```

## Предварителни изисквания

- Node.js (LTS version)
- npm (comes with Node.js)

## Инсталация

1. Clone the repository:
```bash
git clone https://github.com/gpen3v/eduboom-playwright.git
cd eduboom-playwright
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install --with-deps
```

## Пускане на тестовете

### Всички тестове:
```bash
npx playwright test
```

### Конкретен файл с тестове:
```bash
npx playwright test tests/onboardingFlow.spec.ts
```

### Конкретен тест:
```bash
npx playwright test tests/onboardingFlow.spec.ts --grep "Positive Scenario - Successful Onboarding"
```

### В браузър - headed mode:
```bash
npx playwright test --headed
```
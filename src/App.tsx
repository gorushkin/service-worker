import './App.css'

const features = [
  'Регистрация service worker при старте приложения',
  'Предзагрузка shell-ресурсов в install',
  'Очистка старых кешей в activate',
  'Базовая cache-first стратегия для GET-запросов',
]

const nextSteps = [
  'Добавить версионирование кеша под свои релизы',
  'Расширить fetch-логику для API и fallback-страниц',
  'Подключить Web Push или Background Sync при необходимости',
]

function App() {
  return (
    <main className="app-shell">
      <section className="hero">
        <p className="eyebrow">Vite + React + TypeScript</p>
        <h1>Service worker starter</h1>
        <p className="lead">
          Проект уже регистрирует service worker и содержит минимальный шаблон,
          от которого удобно развивать offline-first поведение.
        </p>
      </section>

      <section className="panel">
        <div>
          <h2>Что уже есть</h2>
          <ul className="feature-list">
            {features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2>Ключевые файлы</h2>
          <ul className="file-list">
            <li>
              <code>src/main.tsx</code> регистрирует worker
            </li>
            <li>
              <code>src/sw.ts</code> содержит lifecycle и fetch-обработчик
            </li>
            <li>
              <code>src/App.tsx</code> служит как стартовый экран проекта
            </li>
          </ul>
        </div>
      </section>

      <section className="panel panel-muted">
        <div>
          <h2>Следом обычно делают</h2>
          <ol className="steps-list">
            {nextSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  )
}

export default App

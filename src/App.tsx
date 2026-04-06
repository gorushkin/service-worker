import { useEffect, useState } from 'react'
import './App.css'

const TODO_URL = 'https://jsonplaceholder.typicode.com/todos/1'

type TodoResponse = {
  userId: number
  id: number
  title: string
  completed: boolean
  source?: 'network' | 'offline-fallback'
}

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
  const [todo, setTodo] = useState<TodoResponse | null>(null)
  const [status, setStatus] = useState('Загружаю данные...')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTodo = async () => {
      try {
        setError(null)

        const response = await fetch(TODO_URL)

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const data = (await response.json()) as TodoResponse

        setTodo(data)
        setStatus(
          data.source === 'offline-fallback'
            ? 'Сработал offline fallback из service worker'
            : 'Получены реальные данные по сети',
        )
      } catch (fetchError) {
        const message =
          fetchError instanceof Error ? fetchError.message : 'Unknown error'

        setError(message)
        setStatus('Запрос завершился ошибкой')
      }
    }

    void loadTodo()
  }, [])

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

      <section className="panel panel-api">
        <div>
          <h2>Демо API-запроса</h2>
          <p className="panel-copy">
            Запрос уходит на <code>{TODO_URL}</code>. При наличии сети ты
            увидишь реальные данные, а без сети service worker вернет
            специальный JSON fallback.
          </p>
          <p className="status-chip">{status}</p>
          {error ? <p className="error-text">{error}</p> : null}
        </div>

        <pre className="response-card">
          <code>{JSON.stringify(todo, null, 2)}</code>
        </pre>
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

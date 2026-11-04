import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary.jsx'
import { Layout } from './components/Layout.jsx'
import { SessionProvider } from './context/SessionContext.jsx'
import { AboutPage } from './pages/AboutPage.jsx'
import { DatasetPage } from './pages/DatasetPage.jsx'
import { ErrorPage } from './pages/ErrorPage.jsx'
import { HomePage } from './pages/HomePage.jsx'
import { NotFoundPage } from './pages/NotFoundPage.jsx'
import { ResultPage } from './pages/ResultPage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <SessionProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/result" element={<ResultPage />} />
              <Route path="/dataset" element={<DatasetPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/error" element={<ErrorPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </SessionProvider>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

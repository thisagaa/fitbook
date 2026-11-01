import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HashRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import ClassDetailPage from './pages/ClassDetailPage'
import { CreateClassPage, EditClassPage } from './pages/ClassEditorPage'
import ClassListPage from './pages/ClassListPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import MyBookingsPage from './pages/MyBookingsPage'
import NotFoundPage from './pages/NotFoundPage'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, staleTime: Infinity } },
})

/** HashRouter is used because GitHub Pages cannot rewrite deep links to index.html. */
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="classes" element={<ClassListPage />} />
            <Route path="classes/:id" element={<ClassDetailPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="my-bookings" element={<MyBookingsPage />} />
            </Route>
            <Route element={<ProtectedRoute adminOnly />}>
              <Route path="classes/new" element={<CreateClassPage />} />
              <Route path="classes/:id/edit" element={<EditClassPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </QueryClientProvider>
  )
}

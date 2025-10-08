import './App.css'
import ReduxProvider from './store/ReduxProvider'
import { AppProvider } from "./shared/contexts/AppContext"
import { Layout } from "./shared/components/layout/layout"

function App() {

  return (
    <ReduxProvider>
    <AppProvider>
      <Layout>
      <div className="min-h-screen bg-background text-foreground"></div>
      </Layout>
    </AppProvider>
    </ReduxProvider>
  )
}

export default App

import { AppProvider } from "./shared/contexts/AppContext"
import { Layout } from "./shared/components/layout/layout"

function App() {

  return (
    <AppProvider>
      <Layout>
      <div className="min-h-screen bg-background text-foreground"></div>
      </Layout>
    </AppProvider>
  )
}

export default App

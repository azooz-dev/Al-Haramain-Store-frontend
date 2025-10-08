import { AppProvider } from "./shared/contexts/AppContext"

function App() {

  return (
    <AppProvider>
      <div className="min-h-screen bg-background text-foreground"></div>
    </AppProvider>
  )
}

export default App

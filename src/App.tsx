import ReduxProvider from './store/ReduxProvider'
import { AppProvider } from "./shared/contexts/AppContext"
import { AppRouter } from './shared/routing/AppRouter'

function App() {

  return (
    <ReduxProvider>
      <AppProvider>
        <div className="min-h-screen bg-background text-foreground">
          <AppRouter/>
        </div>
      </AppProvider>
    </ReduxProvider>
  )
}

export default App

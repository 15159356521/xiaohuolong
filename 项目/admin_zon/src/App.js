import PrivateRouter from './pages/PrivateRouter'
import { HistoryRouter, history } from './utils/history'

function App() {
	return (
		<HistoryRouter history={history}>
			<PrivateRouter />
		</HistoryRouter>
	)
}

export default App

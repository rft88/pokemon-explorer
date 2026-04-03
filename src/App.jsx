import { useState } from 'react'
import { fetchResource } from './services/pokeapi.js'
import PokeballIcon from './components/PokeballIcon.jsx'
import RequestPanel from './components/RequestPanel.jsx'
import StatusBar from './components/StatusBar.jsx'
import ResultViewer from './components/ResultViewer.jsx'
import PokemonCard from './components/PokemonCard.jsx'
import styles from './App.module.css'

export default function App() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [reqInfo, setReqInfo] = useState(null)

  function isPokemonResult(data) {
    return data?.name !== undefined && data?.sprites !== undefined && data?.types !== undefined
  }

  async function handleFetch(id) {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetchResource(id)
      setResult(res)
      setReqInfo({ status: res.status, url: res.url, elapsed: res.elapsed })
    } catch (err) {
      setError(err.message)
      setReqInfo({
        error: true,
        status: err.status,
        url: err.url,
        elapsed: err.elapsed,
      })
    } finally {
      setLoading(false)
    }
  }

  const showPokemonCard = result?.data && isPokemonResult(result.data)

  return (
    <div className={styles.layout}>
      <div className={styles.bgGrid} aria-hidden="true" />

      <div className={styles.content}>
        <header className={styles.navbar}>
          <div className={styles.navbarBrand}>
            <PokeballIcon size={32} />
            <div>
              <h1 className={styles.title}>Pokémon Explorer</h1>
            </div>
          </div>

          <div className={styles.navbarSearch}>
            <RequestPanel onFetch={handleFetch} loading={loading} />
          </div>
        </header>

        <main className={styles.mainContent}>
          {showPokemonCard ? (
            <PokemonCard data={result.data} />
          ) : (
            <section className={styles.resultsStack}>
              <StatusBar state={reqInfo} />
              <ResultViewer data={result?.data} error={error} />
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

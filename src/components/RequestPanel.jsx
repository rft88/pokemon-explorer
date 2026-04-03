import { useState } from 'react'
import styles from './RequestPanel.module.css'

export default function RequestPanel({ onFetch, loading }) {
  const [resourceId, setResourceId] = useState('')

  function handleSubmit(e) {
    e?.preventDefault()
    if (!resourceId.trim()) return
    onFetch(resourceId.trim())
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSubmit(e)
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        className={styles.input}
        type="text"
        placeholder="Search Pokémon by name or ID"
        value={resourceId}
        onChange={e => setResourceId(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <button
        type="submit"
        className={styles.btn}
        disabled={loading || !resourceId.trim()}
      >
        {loading ? (
          <>
            <span className={styles.spinner} />
            Searching…
          </>
        ) : (
          <>
            <span className={styles.arrow}>→</span>
            Search
          </>
        )}
      </button>
    </form>
  )
}

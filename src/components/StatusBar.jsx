import styles from './StatusBar.module.css'

export default function StatusBar({ state }) {
  if (!state) return (
    <div className={styles.bar}>
      <span className={`${styles.dot} ${styles.idle}`} />
      <span className={styles.text}>Aguardando requisição</span>
    </div>
  )

  const { status, url, elapsed, error } = state
  const isOk = !error

  return (
    <div className={styles.bar}>
      <span className={`${styles.dot} ${isOk ? styles.ok : styles.err}`} />
      <span className={`${styles.code} ${isOk ? styles.codeOk : styles.codeErr}`}>
        {isOk ? status : (status || 'ERR')}
      </span>
      <span className={styles.url}>{url}</span>
      {elapsed != null && (
        <span className={styles.time}>{elapsed} ms</span>
      )}
    </div>
  )
}

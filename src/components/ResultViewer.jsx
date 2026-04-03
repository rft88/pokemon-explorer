import { useState, useEffect } from 'react'
import styles from './ResultViewer.module.css'

function syntaxHighlight(json) {
  const str = JSON.stringify(json, null, 2)
  return str.replace(
    /("(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+\.?\d*([eE][+-]?\d+)?)/g,
    (match) => {
      let cls = 'num'
      if (/^"/.test(match)) cls = /:$/.test(match) ? 'key' : 'str'
      else if (/true|false/.test(match)) cls = 'bool'
      else if (/null/.test(match)) cls = 'null'
      return `<span class="${cls}">${match}</span>`
    }
  )
}

function CardsList({ data }) {
  const results = data?.results
  if (!Array.isArray(results)) return null
  return (
    <div>
      <div className={styles.cardsGrid}>
        {results.map((item, i) => (
          <div key={i} className={styles.card}>
            <span className={styles.cardName}>{item.name || '—'}</span>
            <span className={styles.cardUrl}>{item.url || ''}</span>
          </div>
        ))}
      </div>
      {data.count != null && (
        <p className={styles.total}>
          Total: <strong>{data.count}</strong> registros
        </p>
      )}
    </div>
  )
}

function DetailTable({ data }) {
  const entries = Object.entries(data)
  const visible = entries.slice(0, 50)
  const hidden = entries.length - 50

  function formatVal(v) {
    if (v === null || v === undefined) return <span className={styles.null}>null</span>
    if (Array.isArray(v)) return <span className={styles.meta}>[{v.length} itens]</span>
    if (typeof v === 'object') {
      const s = JSON.stringify(v)
      return <span className={styles.obj}>{s.length > 120 ? s.slice(0, 120) + '…' : s}</span>
    }
    return String(v)
  }

  return (
    <div className={styles.tableScroll}>
      <table className={styles.table}>
        <tbody>
          {visible.map(([k, v]) => (
            <tr key={k}>
              <td className={styles.tdKey}>{k}</td>
              <td className={styles.tdVal}>{formatVal(v)}</td>
            </tr>
          ))}
          {hidden > 0 && (
            <tr>
              <td colSpan={2} className={styles.moreRow}>
                … mais {hidden} campos — veja a aba JSON para tudo.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

function JsonView({ data }) {
  return (
    <div
      className={styles.jsonView}
      dangerouslySetInnerHTML={{ __html: syntaxHighlight(data) }}
    />
  )
}

export default function ResultViewer({ data, error }) {
  const hasList = Array.isArray(data?.results)
  const tabs = hasList
    ? ['cards', 'tabela', 'json']
    : ['detalhes', 'json']

  const [active, setActive] = useState(hasList ? 'cards' : 'detalhes')

  useEffect(() => {
    setActive(hasList ? 'cards' : 'detalhes')
  }, [data, hasList])

  if (error) {
    return (
      <div className={styles.errorBox}>
        <span className={styles.errorIcon}>✕</span>
        <div>
          <p className={styles.errorTitle}>Requisição falhou</p>
          <p className={styles.errorMsg}>{error}</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>⬡</div>
        <p>Selecione um endpoint e clique em <strong>Enviar</strong></p>
      </div>
    )
  }

  return (
    <div>
      <div className={styles.tabs}>
        {tabs.map(t => (
          <button
            key={t}
            className={`${styles.tab} ${active === t ? styles.tabActive : ''}`}
            onClick={() => setActive(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className={styles.tabContent}>
        {active === 'cards'   && <CardsList data={data} />}
        {active === 'tabela'  && <DetailTable data={data} />}
        {active === 'detalhes'&& <DetailTable data={data} />}
        {active === 'json'    && <JsonView data={data} />}
      </div>
    </div>
  )
}

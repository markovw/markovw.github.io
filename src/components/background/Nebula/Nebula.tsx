import styles from './Nebula.module.css'

export default function Nebula() {
  return (
    <div className={styles.nebula} aria-hidden="true">
      <div className={`${styles.nebulaBlob} ${styles.nebulaBlob1}`} />
      <div className={`${styles.nebulaBlob} ${styles.nebulaBlob2}`} />
      <div className={`${styles.nebulaBlob} ${styles.nebulaBlob3}`} />
    </div>
  )
}

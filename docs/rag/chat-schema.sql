-- Esquema del Asistente Xlerion (MariaDB 11.4, cPanel).
-- Ejecutar en phpMyAdmin sobre la base creada para el chat.
-- No guarda el texto de la conversacion ni la IP: solo hashes con pepper.

CREATE TABLE IF NOT EXISTS chat_audit (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  question_hash CHAR(64) NOT NULL,
  answer_hash CHAR(64) NOT NULL,
  ip_hash CHAR(64) NOT NULL,
  confidence DECIMAL(4,3) NULL,
  sources_count TINYINT UNSIGNED NOT NULL DEFAULT 0,
  refused TINYINT(1) NOT NULL DEFAULT 0,
  consent_version VARCHAR(20) NOT NULL,
  latency_ms SMALLINT UNSIGNED NOT NULL,
  PRIMARY KEY (id),
  KEY idx_created (created_at),
  KEY idx_ip_time (ip_hash, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS chat_rate (
  ip_hash CHAR(64) NOT NULL,
  window_start DATETIME NOT NULL,
  hits SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  PRIMARY KEY (ip_hash)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

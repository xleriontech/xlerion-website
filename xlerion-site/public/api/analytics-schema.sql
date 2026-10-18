/**
 * Script SQL para crear tablas de Analytics en xlerion.com
 * Ejecutar en la BD remota
 * BD: xlerionc_proyectos
 * Usuario: xlerionc_admin
 */
USE xlerionc_proyectos;
-- Tabla de vistas de página
CREATE TABLE IF NOT EXISTS page_views (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL,
    page_title VARCHAR(255) NOT NULL,
    page_type VARCHAR(50) NOT NULL DEFAULT 'page',
    time_spent_ms INT NOT NULL DEFAULT 0,
    user_agent VARCHAR(500),
    language VARCHAR(10),
    client_ip VARCHAR(45) NOT NULL,
    screen_resolution VARCHAR(20),
    referrer_url VARCHAR(500),
    page_url VARCHAR(500),
    hostname VARCHAR(255),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_session (session_id),
    INDEX idx_page_title (page_title),
    INDEX idx_client_ip (client_ip),
    INDEX idx_created_at (created_at),
    INDEX idx_hostname (hostname)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Tabla de pings (actividad en vivo)
CREATE TABLE IF NOT EXISTS page_view_pings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL UNIQUE,
    page_title VARCHAR(255) NOT NULL,
    duration_ms INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_session (session_id),
    INDEX idx_updated_at (updated_at)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Tabla de eventos personalizados
CREATE TABLE IF NOT EXISTS user_events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL,
    event_name VARCHAR(100) NOT NULL,
    event_data JSON,
    page_title VARCHAR(255),
    client_ip VARCHAR(45),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_session (session_id),
    INDEX idx_event_name (event_name),
    INDEX idx_created_at (created_at)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Tabla de sesiones (resumen)
CREATE TABLE IF NOT EXISTS sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL UNIQUE,
    first_page VARCHAR(255),
    last_page VARCHAR(255),
    total_pages_viewed INT DEFAULT 0,
    total_duration_ms INT DEFAULT 0,
    language VARCHAR(10),
    client_ip VARCHAR(45),
    screen_resolution VARCHAR(20),
    user_agent VARCHAR(500),
    referrer_url VARCHAR(500),
    started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ended_at DATETIME,
    INDEX idx_session (session_id),
    INDEX idx_client_ip (client_ip),
    INDEX idx_started_at (started_at)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Vista para reportes rápidos (top páginas)
CREATE OR REPLACE VIEW top_pages AS
SELECT page_title,
    page_type,
    COUNT(*) as total_views,
    AVG(time_spent_ms) as avg_time_ms,
    COUNT(DISTINCT session_id) as unique_visitors,
    DATE(created_at) as view_date
FROM page_views
GROUP BY page_title,
    page_type,
    DATE(created_at)
ORDER BY total_views DESC;
-- Vista para reportes por IP
CREATE OR REPLACE VIEW analytics_by_ip AS
SELECT client_ip,
    COUNT(*) as total_views,
    COUNT(DISTINCT session_id) as sessions,
    SUM(time_spent_ms) / 1000 as total_time_seconds,
    AVG(time_spent_ms) as avg_time_ms,
    MIN(created_at) as first_visit,
    MAX(created_at) as last_visit
FROM page_views
GROUP BY client_ip
ORDER BY total_views DESC;
-- Vista para reportes por hora
CREATE OR REPLACE VIEW analytics_by_hour AS
SELECT DATE_FORMAT(created_at, '%Y-%m-%d %H:00:00') as hour,
    COUNT(*) as total_views,
    COUNT(DISTINCT session_id) as unique_visitors,
    COUNT(DISTINCT client_ip) as unique_ips,
    AVG(time_spent_ms) as avg_time_ms
FROM page_views
GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d %H:00:00')
ORDER BY hour DESC;
-- Vista para resumen de eventos
CREATE OR REPLACE VIEW event_summary AS
SELECT event_name,
    COUNT(*) as total_events,
    COUNT(DISTINCT session_id) as unique_sessions,
    DATE(created_at) as event_date
FROM user_events
GROUP BY event_name,
    DATE(created_at)
ORDER BY event_date DESC,
    total_events DESC;
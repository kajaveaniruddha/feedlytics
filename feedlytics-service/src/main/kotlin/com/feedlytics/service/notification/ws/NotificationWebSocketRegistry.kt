package com.feedlytics.service.notification.ws

import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import org.springframework.web.socket.TextMessage
import org.springframework.web.socket.WebSocketSession
import java.util.concurrent.ConcurrentHashMap

@Component
class NotificationWebSocketRegistry {

    private val log = LoggerFactory.getLogger(javaClass)
    private val sessionsByUserId = ConcurrentHashMap<Long, MutableSet<WebSocketSession>>()

    fun register(userId: Long, session: WebSocketSession) {
        sessionsByUserId.computeIfAbsent(userId) { ConcurrentHashMap.newKeySet() }.add(session)
        log.debug("WS registered userId={} sessionId={}", userId, session.id)
    }

    fun unregister(userId: Long, session: WebSocketSession) {
        sessionsByUserId[userId]?.remove(session)
        log.debug("WS unregistered userId={} sessionId={}", userId, session.id)
    }

    fun broadcastText(userId: Long, json: String) {
        val sessions = sessionsByUserId[userId] ?: return
        val message = TextMessage(json)
        for (s in sessions) {
            if (!s.isOpen) continue
            try {
                synchronized(s) {
                    s.sendMessage(message)
                }
            } catch (e: Exception) {
                log.debug("Failed to send WS to session {}: {}", s.id, e.message)
            }
        }
    }
}

package com.feedlytics.service.notification.ws

import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import org.springframework.web.socket.CloseStatus
import org.springframework.web.socket.TextMessage
import org.springframework.web.socket.WebSocketSession
import org.springframework.web.socket.handler.TextWebSocketHandler

@Component
class NotificationWebSocketHandler(
    private val registry: NotificationWebSocketRegistry,
) : TextWebSocketHandler() {

    private val log = LoggerFactory.getLogger(javaClass)

    override fun afterConnectionEstablished(session: WebSocketSession) {
        val userId = session.attributes[NotificationWebSocketConfig.USER_ID_ATTR] as? Long ?: run {
            log.warn("WS connection missing user id; closing")
            session.close(CloseStatus.NOT_ACCEPTABLE)
            return
        }
        registry.register(userId, session)
    }

    override fun afterConnectionClosed(session: WebSocketSession, status: CloseStatus) {
        val userId = session.attributes[NotificationWebSocketConfig.USER_ID_ATTR] as? Long ?: return
        registry.unregister(userId, session)
    }

    override fun handleTextMessage(session: WebSocketSession, message: TextMessage) {
        val text = message.payload.trim()
        if (text.contains("\"type\":\"ping\"") || text == """{"type":"ping"}""") {
            session.sendMessage(TextMessage("""{"type":"pong"}"""))
        }
    }
}

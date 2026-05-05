package com.feedlytics.service.workspace.service.impl

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import com.feedlytics.service.common.exception.BadRequestException
import com.feedlytics.service.common.exception.ForbiddenException
import com.feedlytics.service.common.exception.NotFoundException
import com.feedlytics.service.workspace.config.PlanLimits
import com.feedlytics.service.workspace.dto.request.UpdateWidgetOriginsRequest
import com.feedlytics.service.workspace.dto.response.RotateApiKeyResponse
import com.feedlytics.service.workspace.dto.response.RotateWidgetSecretResponse
import com.feedlytics.service.workspace.dto.response.WorkspaceIntegrationStatusResponse
import com.feedlytics.service.workspace.entity.WorkspacesEntity
import com.feedlytics.service.workspace.entity.enums.WorkspaceRoleEnum
import com.feedlytics.service.workspace.repository.WorkspaceMembersRepository
import com.feedlytics.service.workspace.repository.WorkspaceRepository
import com.feedlytics.service.workspace.service.WorkspaceIntegrationService
import org.slf4j.LoggerFactory
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.net.URI
import java.security.SecureRandom
import java.util.Base64
import java.util.UUID

@Service
class WorkspaceIntegrationServiceImpl(
    private val workspaceRepository: WorkspaceRepository,
    private val workspaceMemberRepository: WorkspaceMembersRepository,
    private val passwordEncoder: PasswordEncoder,
) : WorkspaceIntegrationService {

    private val logger = LoggerFactory.getLogger(WorkspaceIntegrationServiceImpl::class.java)
    private val objectMapper = ObjectMapper()

    @Transactional(readOnly = true)
    override fun getStatus(workspacePublicId: UUID, userId: Long): WorkspaceIntegrationStatusResponse {
        val workspace = findWorkspaceByPublicId(workspacePublicId)
        requireOwnerOrAdmin(workspace.id, userId)
        checkWorkspaceAccessible(workspace)
        val origins = parseStoredOrigins(workspace.widgetAllowedOrigins)
        return WorkspaceIntegrationStatusResponse(
            hasApiKey = !workspace.apiKeyHash.isNullOrBlank(),
            hasWidgetSecret = !workspace.widgetSecretHash.isNullOrBlank(),
            hasWidgetOrigins = origins.isNotEmpty(),
            widgetOrigins = origins,
        )
    }

    @Transactional
    override fun rotateApiKey(workspacePublicId: UUID, userId: Long): RotateApiKeyResponse {
        val workspace = findWorkspaceByPublicId(workspacePublicId)
        requireOwnerOrAdmin(workspace.id, userId)
        checkWorkspaceAccessible(workspace)
        val plaintext = API_KEY_PREFIX + randomTokenPayload()
        workspace.apiKeyHash = passwordEncoder.encode(plaintext)
        workspaceRepository.save(workspace)
        logger.info("Workspace API key rotated workspacePublicId={}", workspacePublicId)
        return RotateApiKeyResponse(apiKey = plaintext)
    }

    @Transactional
    override fun revokeApiKey(workspacePublicId: UUID, userId: Long) {
        val workspace = findWorkspaceByPublicId(workspacePublicId)
        requireOwnerOrAdmin(workspace.id, userId)
        checkWorkspaceAccessible(workspace)
        workspace.apiKeyHash = null
        workspaceRepository.save(workspace)
        logger.info("Workspace API key revoked workspacePublicId={}", workspacePublicId)
    }

    @Transactional
    override fun rotateWidgetSecret(workspacePublicId: UUID, userId: Long): RotateWidgetSecretResponse {
        val workspace = findWorkspaceByPublicId(workspacePublicId)
        requireOwnerOrAdmin(workspace.id, userId)
        checkWorkspaceAccessible(workspace)
        val plaintext = WIDGET_SECRET_PREFIX + randomTokenPayload()
        workspace.widgetSecretHash = passwordEncoder.encode(plaintext)
        workspaceRepository.save(workspace)
        logger.info("Workspace widget secret rotated workspacePublicId={}", workspacePublicId)
        return RotateWidgetSecretResponse(widgetSecret = plaintext)
    }

    @Transactional
    override fun revokeWidgetSecret(workspacePublicId: UUID, userId: Long) {
        val workspace = findWorkspaceByPublicId(workspacePublicId)
        requireOwnerOrAdmin(workspace.id, userId)
        checkWorkspaceAccessible(workspace)
        workspace.widgetSecretHash = null
        workspaceRepository.save(workspace)
        logger.info("Workspace widget secret revoked workspacePublicId={}", workspacePublicId)
    }

    @Transactional
    override fun updateWidgetOrigins(
        workspacePublicId: UUID,
        userId: Long,
        request: UpdateWidgetOriginsRequest,
    ): WorkspaceIntegrationStatusResponse {
        val workspace = findWorkspaceByPublicId(workspacePublicId)
        requireOwnerOrAdmin(workspace.id, userId)
        checkWorkspaceAccessible(workspace)
        val normalized = request.origins.map { normalizeOrigin(it) }.distinct()
        if (normalized.size > MAX_ALLOWED_ORIGINS) {
            throw BadRequestException(
                "INVALID_ORIGIN",
                "At most $MAX_ALLOWED_ORIGINS allowed origins are supported",
            )
        }
        workspace.widgetAllowedOrigins = if (normalized.isEmpty()) {
            null
        } else {
            objectMapper.writeValueAsString(normalized)
        }
        workspaceRepository.save(workspace)
        logger.info("Workspace widget origins updated workspacePublicId={} count={}", workspacePublicId, normalized.size)
        return WorkspaceIntegrationStatusResponse(
            hasApiKey = !workspace.apiKeyHash.isNullOrBlank(),
            hasWidgetSecret = !workspace.widgetSecretHash.isNullOrBlank(),
            hasWidgetOrigins = normalized.isNotEmpty(),
            widgetOrigins = normalized,
        )
    }

    private fun parseStoredOrigins(raw: String?): List<String> {
        if (raw.isNullOrBlank()) return emptyList()
        return try {
            objectMapper.readValue(raw, object : TypeReference<List<String>>() {})
        } catch (_: Exception) {
            emptyList()
        }
    }

    private fun findWorkspaceByPublicId(publicId: UUID): WorkspacesEntity =
        workspaceRepository.findByPublicId(publicId)
            ?: throw NotFoundException("WORKSPACE_NOT_FOUND", "Workspace not found")

    private fun requireOwnerOrAdmin(workspaceId: Long, userId: Long) {
        val allowedRoles = listOf(WorkspaceRoleEnum.OWNER, WorkspaceRoleEnum.ADMIN)
        workspaceMemberRepository.findByUserIdAndWorkspaceIdAndRoleIn(userId, workspaceId, allowedRoles)
            ?: throw ForbiddenException("FORBIDDEN", "Only owner or admin can manage integration credentials")
    }

    private fun checkWorkspaceAccessible(workspace: WorkspacesEntity) {
        if (!PlanLimits.isAccessible(workspace.plan)) {
            throw ForbiddenException(
                "WORKSPACE_ARCHIVED",
                "This workspace has been archived due to plan limits. Upgrade to PRO or BUSINESS to restore access.",
            )
        }
    }

    private fun randomTokenPayload(): String {
        val bytes = ByteArray(TOKEN_BYTES)
        SECURE_RANDOM.nextBytes(bytes)
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes)
    }

    private fun normalizeOrigin(raw: String): String {
        val trimmed = raw.trim()
        if (trimmed.isEmpty()) {
            throw BadRequestException("INVALID_ORIGIN", "Origin cannot be blank")
        }
        val withoutTrailingSlash = trimmed.removeSuffix("/")
        val uri = try {
            URI(withoutTrailingSlash)
        } catch (_: Exception) {
            throw BadRequestException("INVALID_ORIGIN", "Invalid origin: $raw")
        }
        if (uri.scheme != "http" && uri.scheme != "https") {
            throw BadRequestException("INVALID_ORIGIN", "Origin must use http or https")
        }
        if (uri.host.isNullOrBlank()) {
            throw BadRequestException("INVALID_ORIGIN", "Origin must include a host")
        }
        val path = uri.path
        if (path != null && path.isNotEmpty() && path != "/") {
            throw BadRequestException("INVALID_ORIGIN", "Origin must not include a path")
        }
        if (uri.query != null) {
            throw BadRequestException("INVALID_ORIGIN", "Origin must not include a query string")
        }
        if (uri.fragment != null) {
            throw BadRequestException("INVALID_ORIGIN", "Origin must not include a fragment")
        }
        if (withoutTrailingSlash.length > MAX_ORIGIN_LENGTH) {
            throw BadRequestException("INVALID_ORIGIN", "Origin is too long")
        }
        return withoutTrailingSlash
    }

    companion object {
        private const val API_KEY_PREFIX = "flt_"
        private const val WIDGET_SECRET_PREFIX = "fltw_"
        private const val TOKEN_BYTES = 32
        private const val MAX_ORIGIN_LENGTH = 512
        private const val MAX_ALLOWED_ORIGINS = 5
        private val SECURE_RANDOM = SecureRandom()
    }
}

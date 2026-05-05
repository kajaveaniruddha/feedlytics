package com.feedlytics.service.workspace.service.impl

import com.feedlytics.service.common.entity.BasePublicEntity
import com.feedlytics.service.common.exception.BadRequestException
import com.feedlytics.service.common.exception.ForbiddenException
import com.feedlytics.service.workspace.dto.request.UpdateWidgetOriginsRequest
import com.feedlytics.service.workspace.entity.WorkspaceMembersEntity
import com.feedlytics.service.workspace.entity.WorkspacesEntity
import com.feedlytics.service.workspace.entity.enums.MemberStatusEnum
import com.feedlytics.service.workspace.entity.enums.PlansEnum
import com.feedlytics.service.workspace.entity.enums.WorkspaceRoleEnum
import com.feedlytics.service.workspace.repository.WorkspaceMembersRepository
import com.feedlytics.service.workspace.repository.WorkspaceRepository
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mock
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.Mockito.`when`
import org.mockito.ArgumentMatchers.any
import org.springframework.security.crypto.password.PasswordEncoder
import java.util.UUID

@ExtendWith(MockitoExtension::class)
class WorkspaceIntegrationServiceImplTest {

    @Mock
    private lateinit var workspaceRepository: WorkspaceRepository

    @Mock
    private lateinit var workspaceMemberRepository: WorkspaceMembersRepository

    @Mock
    private lateinit var passwordEncoder: PasswordEncoder

    private lateinit var service: WorkspaceIntegrationServiceImpl

    @BeforeEach
    fun setup() {
        service = WorkspaceIntegrationServiceImpl(
            workspaceRepository,
            workspaceMemberRepository,
            passwordEncoder,
        )
    }

    private val workspacePublicId: UUID = UUID.fromString("aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee")
    private val userId = 42L

    private fun freeWorkspace(): WorkspacesEntity {
        val w = WorkspacesEntity(
            name = "Test",
            description = null,
            ownerId = userId,
            plan = PlansEnum.FREE,
        )
        val f = BasePublicEntity::class.java.getDeclaredField("publicId")
        f.isAccessible = true
        f.set(w, workspacePublicId)
        return w
    }

    private fun stubFindWorkspaceAndAdmin(workspace: WorkspacesEntity) {
        `when`(workspaceRepository.findByPublicId(workspacePublicId)).thenReturn(workspace)
        val member = WorkspaceMembersEntity(
            workspaceId = workspace.id,
            userId = userId,
            role = WorkspaceRoleEnum.ADMIN,
            status = MemberStatusEnum.ACTIVE,
        )
        `when`(
            workspaceMemberRepository.findByUserIdAndWorkspaceIdAndRoleIn(
                userId,
                workspace.id,
                listOf(WorkspaceRoleEnum.OWNER, WorkspaceRoleEnum.ADMIN),
            ),
        ).thenReturn(member)
    }

    private fun stubAdminAccess(workspace: WorkspacesEntity) {
        stubFindWorkspaceAndAdmin(workspace)
        `when`(workspaceRepository.save(any(WorkspacesEntity::class.java))).thenAnswer { it.getArgument(0) }
    }

    @Test
    fun `updateWidgetOrigins rejects invalid origin`() {
        val workspace = freeWorkspace()
        stubFindWorkspaceAndAdmin(workspace)
        val ex = assertThrows<BadRequestException> {
            service.updateWidgetOrigins(
                workspacePublicId,
                userId,
                UpdateWidgetOriginsRequest(origins = listOf("not-a-url")),
            )
        }
        assertEquals("INVALID_ORIGIN", ex.code)
    }

    @Test
    fun `updateWidgetOrigins rejects origin with path`() {
        val workspace = freeWorkspace()
        stubFindWorkspaceAndAdmin(workspace)
        assertThrows<BadRequestException> {
            service.updateWidgetOrigins(
                workspacePublicId,
                userId,
                UpdateWidgetOriginsRequest(origins = listOf("https://example.com/foo")),
            )
        }
    }

    @Test
    fun `updateWidgetOrigins persists normalized origins`() {
        val workspace = freeWorkspace()
        stubAdminAccess(workspace)
        val result = service.updateWidgetOrigins(
            workspacePublicId,
            userId,
            UpdateWidgetOriginsRequest(
                origins = listOf("https://example.com/", "http://localhost:3000"),
            ),
        )
        assertTrue(result.hasWidgetOrigins)
        assertEquals(listOf("https://example.com", "http://localhost:3000"), result.widgetOrigins)
    }

    @Test
    fun `updateWidgetOrigins rejects more than five origins`() {
        val workspace = freeWorkspace()
        stubFindWorkspaceAndAdmin(workspace)
        val origins = listOf(
            "https://a.example.com",
            "https://b.example.com",
            "https://c.example.com",
            "https://d.example.com",
            "https://e.example.com",
            "https://f.example.com",
        )
        val ex = assertThrows<BadRequestException> {
            service.updateWidgetOrigins(
                workspacePublicId,
                userId,
                UpdateWidgetOriginsRequest(origins = origins),
            )
        }
        assertEquals("INVALID_ORIGIN", ex.code)
        assertTrue(ex.message.contains("At most 5", ignoreCase = true))
    }

    @Test
    fun `rotateApiKey returns prefixed secret and encodes`() {
        val workspace = freeWorkspace()
        stubAdminAccess(workspace)
        `when`(passwordEncoder.encode(any(String::class.java))).thenReturn("hashed")
        val res = service.rotateApiKey(workspacePublicId, userId)
        assertTrue(res.apiKey.startsWith("flt_"))
        assertTrue(res.apiKey.length > 10)
    }

    @Test
    fun `getStatus forbidden for member without admin`() {
        val workspace = freeWorkspace()
        `when`(workspaceRepository.findByPublicId(workspacePublicId)).thenReturn(workspace)
        `when`(
            workspaceMemberRepository.findByUserIdAndWorkspaceIdAndRoleIn(
                userId,
                workspace.id,
                listOf(WorkspaceRoleEnum.OWNER, WorkspaceRoleEnum.ADMIN),
            ),
        ).thenReturn(null)
        assertThrows<ForbiddenException> {
            service.getStatus(workspacePublicId, userId)
        }
    }
}

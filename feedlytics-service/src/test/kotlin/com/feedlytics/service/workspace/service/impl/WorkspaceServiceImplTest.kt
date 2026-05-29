package com.feedlytics.service.workspace.service.impl

import com.feedlytics.service.common.entity.BaseEntity
import com.feedlytics.service.common.entity.BasePublicEntity
import com.feedlytics.service.common.repository.UserRepository
import com.feedlytics.service.feedback.entity.enums.SourceTypeEnum
import com.feedlytics.service.feedback.repository.FeedbacksRepository
import com.feedlytics.service.feedback.service.FeedbacksService
import com.feedlytics.service.widget.repository.WidgetRepository
import com.feedlytics.service.workspace.dto.UsageInfoDto
import com.feedlytics.service.workspace.entity.WorkspaceMembersEntity
import com.feedlytics.service.workspace.entity.WorkspacesEntity
import com.feedlytics.service.workspace.entity.enums.MemberStatusEnum
import com.feedlytics.service.workspace.entity.enums.PlansEnum
import com.feedlytics.service.workspace.entity.enums.WorkspaceRoleEnum
import com.feedlytics.service.workspace.planlimits.ArchivedPlanLimitStrategy
import com.feedlytics.service.workspace.planlimits.BusinessPlanLimitStrategy
import com.feedlytics.service.workspace.planlimits.FreePlanLimitStrategy
import com.feedlytics.service.workspace.planlimits.PlanLimitStrategyFactory
import com.feedlytics.service.workspace.planlimits.ProPlanLimitStrategy
import com.feedlytics.service.workspace.repository.WorkspaceMembersRepository
import com.feedlytics.service.workspace.repository.WorkspaceRepository
import com.feedlytics.service.workspace.service.UsageLimitService
import com.feedlytics.service.workspace.service.WorkspacePlanService
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mock
import org.mockito.Mockito.`when`
import org.mockito.Mockito.verify
import org.mockito.junit.jupiter.MockitoExtension
import java.time.Instant
import java.util.UUID

@ExtendWith(MockitoExtension::class)
class WorkspaceServiceImplTest {

    @Mock
    private lateinit var workspaceRepository: WorkspaceRepository

    @Mock
    private lateinit var workspaceMemberRepository: WorkspaceMembersRepository

    @Mock
    private lateinit var workspacePlanService: WorkspacePlanService

    @Mock
    private lateinit var feedbacksService: FeedbacksService

    @Mock
    private lateinit var feedbacksRepository: FeedbacksRepository

    @Mock
    private lateinit var usageLimitService: UsageLimitService

    @Mock
    private lateinit var userRepository: UserRepository

    @Mock
    private lateinit var widgetRepository: WidgetRepository

    private lateinit var service: WorkspaceServiceImpl

    private val workspacePublicId: UUID = UUID.fromString("aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee")
    private val userId = 42L

    @BeforeEach
    fun setup() {
        val planLimitStrategyFactory = PlanLimitStrategyFactory(
            listOf(
                FreePlanLimitStrategy(),
                ProPlanLimitStrategy(),
                BusinessPlanLimitStrategy(),
                ArchivedPlanLimitStrategy(),
            ),
        )
        service = WorkspaceServiceImpl(
            workspaceRepository = workspaceRepository,
            workspaceMemberRepository = workspaceMemberRepository,
            workspacePlanService = workspacePlanService,
            feedbacksService = feedbacksService,
            feedbacksRepository = feedbacksRepository,
            usageLimitService = usageLimitService,
            userRepository = userRepository,
            planLimitStrategyFactory = planLimitStrategyFactory,
            widgetRepository = widgetRepository,
        )
    }

    @Test
    fun `getWorkspacePlanUsage returns source breakdown and plan limits`() {
        val workspace = workspace(plan = PlansEnum.FREE, internalId = 100L)
        val member = WorkspaceMembersEntity(
            workspaceId = workspace.id,
            userId = userId,
            role = WorkspaceRoleEnum.OWNER,
            status = MemberStatusEnum.ACTIVE,
        )
        val periodStart = Instant.parse("2026-05-01T00:00:00Z")
        val periodEnd = Instant.parse("2026-06-01T00:00:00Z")

        `when`(workspaceRepository.findByPublicId(workspacePublicId)).thenReturn(workspace)
        `when`(workspaceMemberRepository.findByUserIdAndWorkspaceId(userId, workspace.id)).thenReturn(member)
        `when`(usageLimitService.getCurrentUsage(workspace.id)).thenReturn(
            UsageInfoDto(
                feedbackCount = 42,
                apiCalls = 0,
                campaignCount = 0,
                periodStart = periodStart,
            ),
        )
        `when`(
            feedbacksRepository.getFeedbackUsageBySourceType(
                workspaceId = workspace.id,
                periodStart = periodStart,
                periodEnd = periodEnd,
            ),
        ).thenReturn(
            listOf(
                sourceCountRow("WIDGET", 30L),
                sourceCountRow("API_KEY", 10L),
            ),
        )
        `when`(workspaceMemberRepository.countByWorkspaceId(workspace.id)).thenReturn(2L)

        val response = service.getWorkspacePlanUsage(workspacePublicId, userId)

        assertEquals(PlansEnum.FREE, response.plan)
        assertEquals(periodStart, response.periodStart)
        assertEquals(periodEnd, response.periodEnd)
        assertEquals(42L, response.monthlyFeedback.used)
        assertEquals(100, response.monthlyFeedback.limit)
        assertEquals(2L, response.members.used)
        assertEquals(2, response.members.limit)

        assertEquals(listOf(SourceTypeEnum.API_KEY, SourceTypeEnum.WIDGET, SourceTypeEnum.CAMPAIGN), response.feedbacksBySourceType.map { it.sourceType })
        assertEquals(10L, response.feedbacksBySourceType[0].used)
        assertEquals(1000, response.feedbacksBySourceType[0].limit)
        assertEquals(30L, response.feedbacksBySourceType[1].used)
        assertEquals(100, response.feedbacksBySourceType[1].limit)
        assertEquals(0L, response.feedbacksBySourceType[2].used)
        assertEquals(100, response.feedbacksBySourceType[2].limit)

        verify(feedbacksRepository).getFeedbackUsageBySourceType(
            workspaceId = workspace.id,
            periodStart = periodStart,
            periodEnd = periodEnd,
        )
    }

    private fun workspace(plan: PlansEnum, internalId: Long): WorkspacesEntity {
        val workspace = WorkspacesEntity(
            name = "Test workspace",
            description = null,
            ownerId = userId,
            plan = plan,
        )
        val idField = BaseEntity::class.java.getDeclaredField("id")
        idField.isAccessible = true
        idField.set(workspace, internalId)
        val publicIdField = BasePublicEntity::class.java.getDeclaredField("publicId")
        publicIdField.isAccessible = true
        publicIdField.set(workspace, workspacePublicId)
        return workspace
    }

    private fun sourceCountRow(sourceType: String, usedCount: Long): FeedbacksRepository.FeedbackUsageBySourceTypeRow {
        return object : FeedbacksRepository.FeedbackUsageBySourceTypeRow {
            override val sourceType: String = sourceType
            override val usedCount: Long = usedCount
        }
    }
}

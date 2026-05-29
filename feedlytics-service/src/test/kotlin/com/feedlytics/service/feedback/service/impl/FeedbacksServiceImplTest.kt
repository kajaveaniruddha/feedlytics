package com.feedlytics.service.feedback.service.impl

import com.feedlytics.service.feedback.repository.FeedbackAiAnalysisRepository
import com.feedlytics.service.feedback.repository.FeedbackCategoriesRepository
import com.feedlytics.service.feedback.repository.FeedbacksRepository
import com.feedlytics.service.workspace.repository.WorkspaceMembersRepository
import com.feedlytics.service.workspace.repository.WorkspaceRepository
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mock
import org.mockito.ArgumentMatchers.eq
import org.mockito.Mockito.`when`
import org.mockito.junit.jupiter.MockitoExtension
import java.time.Instant
import java.time.LocalDate
import java.util.UUID

@ExtendWith(MockitoExtension::class)
class FeedbacksServiceImplTest {

    @Mock
    private lateinit var feedbacksRepository: FeedbacksRepository

    @Mock
    private lateinit var feedbackAiAnalysisRepository: FeedbackAiAnalysisRepository

    @Mock
    private lateinit var feedbackCategoriesRepository: FeedbackCategoriesRepository

    @Mock
    private lateinit var workspaceRepository: WorkspaceRepository

    @Mock
    private lateinit var workspaceMembersRepository: WorkspaceMembersRepository

    private lateinit var service: FeedbacksServiceImpl

    private val workspaceId = 1L
    private val workspacePublicId = UUID.randomUUID()
    @BeforeEach
    fun setup() {
        service = FeedbacksServiceImpl(
            feedbacksRepository = feedbacksRepository,
            feedbackAiAnalysisRepository = feedbackAiAnalysisRepository,
            feedbackCategoriesRepository = feedbackCategoriesRepository,
            workspaceRepository = workspaceRepository,
            workspaceMembersRepository = workspaceMembersRepository,
        )
    }

    @Test
    fun `getFeedbacksOverviewAnalytics includes rolling 30 day trend with change percent`() {
        `when`(feedbacksRepository.getFeedbacksOverviewAnalytics(workspaceId)).thenReturn(
            object : FeedbacksRepository.FeedbackOverviewAnalyticsRow {
                override val publicId = workspacePublicId
                override val totalFeedbacks = 100L
                override val averageRating = 4.5
            },
        )
        `when`(feedbackAiAnalysisRepository.getSentimentCountsByWorkspaceId(workspaceId)).thenReturn(emptyList())
        `when`(feedbackCategoriesRepository.countByWorkspaceId(workspaceId)).thenReturn(0L)
        `when`(
            feedbacksRepository.countFeedbacksInRange(
                eq(workspaceId),
                anyInstant(),
                anyInstant(),
            ),
        ).thenReturn(124L, 100L)
        `when`(feedbacksRepository.countFeedbacksByDay(eq(workspaceId), anyInstant(), anyInstant())).thenReturn(
            listOf(dayRow(LocalDate.now(java.time.ZoneOffset.UTC), 5L)),
        )

        val overview = service.getFeedbacksOverviewAnalytics(workspaceId)

        assertEquals(124L, overview.rolling30DayFeedbacks.count)
        assertEquals(100L, overview.rolling30DayFeedbacks.previousPeriodCount)
        assertEquals(24.0, overview.rolling30DayFeedbacks.changePercent)
        assertEquals(30, overview.rolling30DayFeedbacks.dailyCounts.size)
    }

    @Test
    fun `rolling trend change percent is zero when previous period has no feedback`() {
        `when`(feedbacksRepository.getFeedbacksOverviewAnalytics(workspaceId)).thenReturn(
            object : FeedbacksRepository.FeedbackOverviewAnalyticsRow {
                override val publicId = workspacePublicId
                override val totalFeedbacks = 0L
                override val averageRating = 0.0
            },
        )
        `when`(feedbackAiAnalysisRepository.getSentimentCountsByWorkspaceId(workspaceId)).thenReturn(emptyList())
        `when`(feedbackCategoriesRepository.countByWorkspaceId(workspaceId)).thenReturn(0L)
        `when`(
            feedbacksRepository.countFeedbacksInRange(eq(workspaceId), anyInstant(), anyInstant()),
        ).thenReturn(10L, 0L)
        `when`(feedbacksRepository.countFeedbacksByDay(eq(workspaceId), anyInstant(), anyInstant())).thenReturn(emptyList())

        val overview = service.getFeedbacksOverviewAnalytics(workspaceId)

        assertEquals(0.0, overview.rolling30DayFeedbacks.changePercent)
    }

    private fun anyInstant(): Instant =
        org.mockito.ArgumentMatchers.any(Instant::class.java) ?: Instant.EPOCH

    private fun dayRow(day: LocalDate, count: Long): FeedbacksRepository.FeedbackCountByDayRow =
        object : FeedbacksRepository.FeedbackCountByDayRow {
            override val day = day
            override val feedbackCount = count
        }
}

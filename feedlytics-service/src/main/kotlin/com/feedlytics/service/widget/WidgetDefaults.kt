package com.feedlytics.service.widget

import com.feedlytics.service.widget.entity.WidgetEntity
import com.feedlytics.service.widget.entity.WidgetThemeJson

object WidgetDefaults {

    val theme: WidgetThemeJson = WidgetThemeJson(
        formBgColor = "#FFFFFF",
        formTextColor = "#1A1A1A",
        accentColor = "#6366F1",
        inputBgColor = "#F9FAFB",
        inputBorderColor = "#E5E7EB",
        inputTextColor = "#111827",
        secondaryTextColor = "#6B7280",
        fontFamily = "Inter",
        borderRadius = 12,
        shadow = "subtle",
        cardMaxWidth = 432,
        cardPadding = "default",
        successMessage = "Thank you for your feedback!",
        showConfetti = true,
        successRedirectUrl = null,
        successCtaText = null,
        successCtaUrl = null,
        buttonText = "Send Feedback",
    )

    fun newEntityForWorkspace(workspaceId: Long): WidgetEntity = WidgetEntity(
        workspaceId = workspaceId,
        collectName = false,
        collectEmail = true,
        theme = theme,
        isActive = true,
    )
}

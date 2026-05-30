package com.feedlytics.service.widget.entity

import com.fasterxml.jackson.annotation.JsonIgnoreProperties

@JsonIgnoreProperties(ignoreUnknown = true)
data class WidgetThemeJson(
    val formBgColor: String,
    val formTextColor: String,
    val accentColor: String,
    val inputBgColor: String,
    val inputBorderColor: String,
    val inputTextColor: String,
    val secondaryTextColor: String,
    val fontFamily: String,
    val borderRadius: Int,
    val shadow: String,
    val cardMaxWidth: Int,
    val cardPadding: String,
    val successMessage: String,
    val showConfetti: Boolean,
    val successRedirectUrl: String?,
    val successCtaText: String?,
    val successCtaUrl: String?,
    val buttonText: String,
)

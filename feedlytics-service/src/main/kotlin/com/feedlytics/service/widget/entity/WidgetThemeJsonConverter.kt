package com.feedlytics.service.widget.entity

import jakarta.persistence.AttributeConverter
import jakarta.persistence.Converter
import tools.jackson.databind.DeserializationFeature
import tools.jackson.databind.json.JsonMapper
import tools.jackson.module.kotlin.KotlinModule

/**
 * Maps [WidgetThemeJson] to a JSON string for persistence.
 * The entity column uses [@JdbcTypeCode][org.hibernate.annotations.JdbcTypeCode]([SqlTypes.JSON])
 * so Hibernate binds PostgreSQL `jsonb` correctly (a plain [String] converter alone becomes `varchar`).
 */
@Converter(autoApply = false)
class WidgetThemeJsonConverter : AttributeConverter<WidgetThemeJson, String> {

    companion object {
        private val mapper: JsonMapper =
            JsonMapper.builder()
                .addModule(KotlinModule.Builder().build())
                .disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                .build()
    }

    override fun convertToDatabaseColumn(attribute: WidgetThemeJson?): String? =
        attribute?.let { mapper.writeValueAsString(it) }

    override fun convertToEntityAttribute(dbData: String?): WidgetThemeJson {
        require(!dbData.isNullOrBlank()) { "widgets.theme must not be null or blank" }
        return mapper.readValue(dbData, WidgetThemeJson::class.java)
    }
}

export interface CreateTranslationDto {
    translation_key: string;
    language_code: string;
    type: string;
    text_value: string;
}
// valid types: app, site_name, site_desc, site_welcome, building_name, building_desc, location_name, at_location_message, location_desc* (not actually used anywhere), approach_instruction, to_next_instruction
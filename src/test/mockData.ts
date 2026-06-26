
// default mock data for testing
export const mockPathData = {
  path: {
    path_id: 1,
    name: "Test Path",
    building_id: 1,
    start_location_id: 1,
    end_location_id: 2,
    is_active: true,
    priority: 1,
    elevated_priority_starts_at: null,
    elevated_priority_expires_at: null,
    distance_meters: 100,
    estimated_time_minutes: 5,
    accessibility_level: 1,
    video_instruction_url: "",
    trl_path_name_key: null,
    allowed_organizations: [],
  },
  steps: [
    {
      id: 1,
      name: "Step 1",
      order: 1,
      location_id: 1,
      distance_to_next_meters: 10,
      video_timestamp_seconds: 0,
    },
    {
      id: 2,
      name: "Step 2",
      order: 2,
      location_id: 2,
      distance_to_next_meters: 20,
      video_timestamp_seconds: 0,
    },
  ],
};

export const mockLocationList = [
  { id: 1, name: "Location 1" },
  { id: 2, name: "Location 2" },
];

export const mockEntryLocations = [
  {
    location_id: 1,
    name: "Entry Location 1",
    image_url: "https://example.com/entry1.jpg",
    trl_location_name_key: "entry_location_1",
    translations: {
      fi: [
        { translation_key: "entry_location_1", text_value: "Sisäänkäynti 1" },
      ],
      en: [
        { translation_key: "entry_location_1", text_value: "Entry Location 1" },
      ],
    },
  },
  {
    location_id: 2,
    name: "Entry Location 2",
    image_url: "https://example.com/entry2.jpg",
    trl_location_name_key: "entry_location_2",
    translations: {
      fi: [
        { translation_key: "entry_location_2", text_value: "Sisäänkäynti 2" },
      ],
      en: [
        { translation_key: "entry_location_2", text_value: "Entry Location 2" },
      ],
    },
  },
];
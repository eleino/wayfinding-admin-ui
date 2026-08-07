
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
    trl_location_name_key: "LOCATION_1_NAME",
    translations: {
      fi: [
        { translation_key: "LOCATION_1_NAME", text_value: "Sisäänkäynti 1" },
      ],
      en: [
        { translation_key: "LOCATION_1_NAME", text_value: "Entry Location 1" },
      ],
    },
  },
  {
    location_id: 2,
    name: "Entry Location 2",
    image_url: "https://example.com/entry2.jpg",
    trl_location_name_key: "LOCATION_2_NAME",
    translations: {
      fi: [
        { translation_key: "LOCATION_2_NAME", text_value: "Sisäänkäynti 2" },
      ],
      en: [
        { translation_key: "LOCATION_2_NAME", text_value: "Entry Location 2" },
      ],
    },
  },
];

export const mockPathInstructions = {
  steps: [
    {
      step_order: 1,
      distance_to_next_meters: 10,
      video_instruction_url: "https://youtube.com?t=0",
      img_on_approach: null,
      img_to_next: {
        url: "http://localhost:3000/images/locations/1/step-1ea49fed-c8a0-4555-88cb-8eea8c1483c1.jpg",
        overlay: {
          overlay_image_url:
            "http://localhost:3000/images/overlays/overlay-057d2558-7ab5-4e65-a0c0-56b951d24f05.png",
          position_x_percent: "-80.00",
          position_y_percent: "5.00",
          overlay_size: 18,
          rotation_deg: -15,
          rotation_x_deg: 77,
        },
      },
      trl_instruction_on_approach_key: "CURRENT_LOCATION_1_MSG",
      trl_instruction_to_next_key: "TRL_NEXT_FROM_1_TO_2",
      translations: {
        fi: [
          {
            translation_key: "CURRENT_LOCATION_1_MSG",
            text_value: null,
          },
          {
            translation_key: "TRL_NEXT_FROM_1_TO_2",
            text_value: "Kulje ovien läpi pääaulaan.",
          },
        ],
      },
    },
    {
      step_order: 2,
      distance_to_next_meters: 25,
      video_instruction_url: "https://youtube.com?t=0",
      img_on_approach: {
        url: "http://localhost:3000/images/locations/2/step-52001f62-fa5a-48a2-bc15-e115a8de5c22.png",
        overlay: {
          overlay_image_url:
            "http://localhost:3000/images/overlays/overlay-ffe40ca4-1d0e-4773-b728-fe4eb2977dc9.png",
          position_x_percent: "-60.00",
          position_y_percent: "-5.00",
          overlay_size: 30,
          rotation_deg: 0,
          rotation_x_deg: 68,
        },
      },
      img_to_next: {
        url: "http://localhost:3000/images/locations/2/step-52c12dd6-36eb-4801-9bb0-375532ff14d2.png",
        overlay: {
          overlay_image_url:
            "http://localhost:3000/images/overlays/overlay-057d2558-7ab5-4e65-a0c0-56b951d24f05.png",
          position_x_percent: "-90.00",
          position_y_percent: "-30.00",
          overlay_size: 19,
          rotation_deg: 1,
          rotation_x_deg: 69,
        },
      },
      trl_instruction_on_approach_key: "TRL_APPROACH_FROM_1_TO_2_TO_4",
      trl_instruction_to_next_key: "TRL_NEXT_FROM_2_TO_4",
      translations: {
        fi: [
          {
            translation_key: "TRL_APPROACH_FROM_1_TO_2_TO_4",
            text_value: "Käänny aulasta vasemmalle.",
          },
          {
            translation_key: "TRL_NEXT_FROM_2_TO_4",
            text_value: "Kulje käytävää eteenpäin.",
          },
        ],
      },
    },
    {
      step_order: 3,
      distance_to_next_meters: 0,
      video_instruction_url: "https://youtube.com?t=0",
      img_on_approach: {
        url: "http://localhost:3000/images/locations/4/step-709a3df0-393a-4d2a-a06b-392ce65e8877.jpg",
        overlay: {
          overlay_image_url:
            "http://localhost:3000/images/overlays/overlay-057d2558-7ab5-4e65-a0c0-56b951d24f05.png",
          position_x_percent: "-5.00",
          position_y_percent: "-15.00",
          overlay_size: 23,
          rotation_deg: 20,
          rotation_x_deg: 70,
        },
      },
      img_to_next: null,
      trl_instruction_on_approach_key:
        "TRL_APPROACH_FROM_2_TO_4_TO_DESTINATION",
      trl_instruction_to_next_key: "TRL_NEXT_FROM_2_TO_4_TO_DESTINATION",
      translations: {
        fi: [
          {
            translation_key: "TRL_APPROACH_FROM_2_TO_4_TO_DESTINATION",
            text_value: "Ravintola Isku Center on oikealla.",
          },
          {
            translation_key: "TRL_NEXT_FROM_2_TO_4_TO_DESTINATION",
            text_value: null,
          },
        ],
      },
    },
  ],
  destination: {
    location_id: 4,
    trl_location_name_key: "LOCATION_4_NAME",
    translations: {
      fi: [
        {
          translation_key: "LOCATION_4_NAME",
          text_value: "Ravintola",
        },
      ],
    },
  },
};

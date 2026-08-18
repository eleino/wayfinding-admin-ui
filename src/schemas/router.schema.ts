import * as v from 'valibot';

export const searchParamsSchema = v.object({
    orgId: v.optional(v.number()),
    siteId: v.optional(v.number()),
    buildingId: v.optional(v.number()),
    locationId: v.optional(v.number()),
    pathId: v.optional(v.number()),
    stepId: v.optional(v.number()),
    created: v.optional(v.boolean()),
    type: v.optional(v.string()),
})

export type SearchParams = v.InferOutput<typeof searchParamsSchema>;

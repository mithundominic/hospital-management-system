// Responsibility: Route path definitions for enterprise organization tier

export const ORG_ROUTES = {
  organizations: {
    list: "/organizations",
    detail: "/organizations/:orgId",
    facilities: "/organizations/:orgId/facilities",
    facilityDetail: "/organizations/:orgId/facilities/:facilityId",
    members: "/organizations/:orgId/members",
    patientsSearch: "/organizations/:orgId/patients/search",
  },
} as const;

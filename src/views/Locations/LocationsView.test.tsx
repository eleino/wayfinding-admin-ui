import { expect, test, vi } from "vitest";
import { screen } from "@testing-library/react";
import LocationsView from "./LocationsView";
import { renderWithQuery } from "test/render";
import type { SearchParams } from "@apptypes/searchParams";

// mock search params, hoisted to be available on initialization
// const useSearchMock = vi.hoisted(() =>
//   vi.fn<() => SearchParams>(() => ({
//     orgId: 1,
//     siteId: 2,
//     buildingId: 3,
//     locationId: undefined,
//   })),
// );

// // need to mock getRouteApi and Link for the LocationsView component to function
// vi.mock("@tanstack/react-router", () => ({
//   getRouteApi: () => ({
//     useSearch: useSearchMock,
//   }),
//   Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
//     <a href={to}>{children}</a>
//   ),
// }));

// mock ShowLocation and LocationsSelections components
vi.mock("@components/Locations/ShowLocation", () => ({
  ShowLocation: ({
    locationId,
    searchParams,
  }: {
    locationId: number;
    searchParams: SearchParams;
  }) => (
    <div data-testid="show-location">
      ShowLocation Component - Location ID: {locationId}, Search Params:{" "}
      {JSON.stringify(searchParams)}
    </div>
  ),
}));

vi.mock("@components/Locations/LocationsSelections", () => ({
  LocationsSelections: ({
    searchParams,
    page,
  }: {
    searchParams: SearchParams;
    page: string;
  }) => (
    <div data-testid="locations-selections">
      LocationsSelections Component - Search Params:{" "}
      {JSON.stringify(searchParams)}, Page: {page}
    </div>
  ),
}));

// test that LocationsView is rendered, <h1>Locations</h1> should always be present
test("renders LocationsView component", async () => {
  await renderWithQuery(<LocationsView />, { searchParams: { orgId: 1, siteId: 2, buildingId: 3, locationId: undefined }, path: "/locations" });
  const headingElement = screen.getByRole("heading", { level: 1, name: "Locations" });
  expect(headingElement).toBeInTheDocument();
});

// should show ShowLocation if locationId is present in search params, otherwise show LocationsSelections
test("renders ShowLocation when locationId is present in search params", async () => {

  await renderWithQuery(<LocationsView />, { searchParams: { orgId: 1, siteId: 2, buildingId: 3, locationId: 5 }, path: "/locations" });
  const showLocationElement = screen.getByTestId("show-location");
  expect(showLocationElement).toBeInTheDocument();
  expect(showLocationElement).toHaveTextContent(
    "ShowLocation Component - Location ID: 5",
  );
});

test("renders LocationsSelections when locationId is not present in search params", async () => {
  // useSearchMock.mockReturnValue({
  //   orgId: 1,
  //   siteId: 2,
  //   buildingId: 3,
  //   locationId: undefined,
  // });

  await renderWithQuery(<LocationsView />, { searchParams: { orgId: 1, siteId: 2, buildingId: 3, locationId: undefined }, path: "/locations" });
  const locationsSelectionsElement = screen.getByTestId("locations-selections");
  expect(locationsSelectionsElement).toBeInTheDocument();
  expect(locationsSelectionsElement).toHaveTextContent(
    'LocationsSelections Component - Search Params: {"orgId":1,"siteId":2,"buildingId":3}, Page: locations',
  );
});

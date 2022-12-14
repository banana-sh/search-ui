import { setupDriver, SubjectArguments } from "../../test/helpers";
import { itResetsCurrent, itUpdatesURLState } from "../../test/sharedTests";
import { RequestState } from "../../types";

// We mock this so no state is actually written to the URL
jest.mock("../../URLManager");
import URLManager from "../../URLManager";
const MockedURLManager = jest.mocked(URLManager, true);

beforeEach(() => {
  MockedURLManager.mockClear();
});

describe("#clearFilters", () => {
  function subject(
    except?,
    {
      initialFilters = [],
      initialState = {
        filters: initialFilters
      }
    }: SubjectArguments = {}
  ) {
    const { driver, updatedStateAfterAction } = setupDriver({
      initialState
    });

    driver.clearFilters(except);
    jest.runAllTimers();
    return updatedStateAfterAction.state;
  }

  itResetsCurrent(() => subject(null, { initialState: { current: 2 } }));

  itUpdatesURLState(URLManager, () => {
    subject();
  });

  it("Does not update other Search Parameter values", () => {
    const initialState: RequestState = {
      resultsPerPage: 60,
      sortField: "name",
      sortDirection: "asc",
      sortList: [
        { field: "name", direction: "asc" },
        { field: "title", direction: "desc" }
      ],
      searchTerm: "test"
    };
    const { resultsPerPage, sortField, sortDirection, sortList, searchTerm } =
      subject(null, { initialState });
    expect({
      resultsPerPage,
      sortField,
      sortDirection,
      sortList,
      searchTerm
    }).toEqual(initialState);
  });

  it("Removes all filters", () => {
    expect(
      subject([], {
        initialFilters: [
          { field: "initial", values: ["value"], type: "all" },
          {
            field: "test",
            values: ["anotherValue", "value", "someOtherValue"],
            type: "all"
          }
        ]
      }).filters
    ).toEqual([]);
  });

  it("Removes all except the filters listed in 'except'", () => {
    expect(
      subject(["initial"], {
        initialFilters: [
          { field: "initial", values: ["value"], type: "all" },
          {
            field: "test",
            values: ["anotherValue", "value", "someOtherValue"],
            type: "all"
          }
        ]
      }).filters
    ).toEqual([{ field: "initial", values: ["value"], type: "all" }]);
  });
});

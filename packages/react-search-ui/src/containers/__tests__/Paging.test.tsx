import React from "react";
import { shallow } from "enzyme";
import { PagingContainer } from "../Paging";

const params = {
  current: 1,
  resultsPerPage: 20,
  setCurrent: jest.fn(),
  totalPages: 5
};

beforeEach(() => {
  params.setCurrent = jest.fn();
});

it("supports a render prop", () => {
  const render = ({ current = 2 }) => {
    return <div>{current}</div>;
  };
  const wrapper = shallow(<PagingContainer {...params} view={render} />).dive();
  expect(wrapper).toMatchSnapshot();
});

it("renders empty when there are no results", () => {
  const view = () => <div />;
  const wrapper = shallow(
    <PagingContainer
      {...{
        ...params,
        totalPages: 0
      }}
      view={view}
    />
  );
  expect(wrapper.find(view).length).toBe(0);
  expect(wrapper.text()).toBe("");
});

it("will call back when a the page is changed", () => {
  let viewProps;

  shallow(
    <PagingContainer
      {...params}
      view={(props) => {
        viewProps = props;
        return <div />;
      }}
    />
  ).dive();

  const { onChange } = viewProps;
  onChange(2);

  const current = params.setCurrent.mock.calls[0][0];
  expect(current).toEqual(2);
});

it("passes className through to the view", () => {
  let viewProps;
  const className = "test-class";
  shallow(
    <PagingContainer
      {...params}
      className={className}
      view={(props) => {
        viewProps = props;
        return <div />;
      }}
    />
  ).dive();
  expect(viewProps.className).toEqual(className);
});

it("passes data-foo through to the view", () => {
  let viewProps;
  const data = "bar";
  shallow(
    <PagingContainer
      {...params}
      data-foo={data}
      view={(props) => {
        viewProps = props;
        return <div />;
      }}
    />
  ).dive();
  expect(viewProps["data-foo"]).toEqual(data);
});

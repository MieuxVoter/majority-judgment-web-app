import React from "react";
import ReactDOM from "react-dom";
import { MemoryRouter } from "react-router-dom";

import Routes from "./Routes";
import App from "./App";
import Adapter from "enzyme-adapter-react-16";
import { mount, configure } from "enzyme";

import Home from "./components/views/Home";
import CreateElection from "./components/views/CreateElection";
import Result from "./components/views/Result";
import Vote from "./components/views/Vote";
import UnknownView from "./components/views/UnknownView";

configure({ adapter: new Adapter() });

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

describe("open good View component for each route", () => {
  it("should show Home view component for `/`", () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={["/"]}>
        <Routes />
      </MemoryRouter>
    );
    expect(wrapper.find(Home)).toHaveLength(1);
    expect(wrapper.find(UnknownView)).toHaveLength(0);
  });

  it("should show CreateElection view component for `/create-election`", () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={["/create-election"]}>
        <Routes />
      </MemoryRouter>
    );
    expect(wrapper.find(CreateElection)).toHaveLength(1);
    expect(wrapper.find(UnknownView)).toHaveLength(0);
  });

  //this test is not good because window.location.search is empty even there is ?title= parameter in route
  //Clement : I don't know how to achieve this test for now (maybe the component using window.location.search is not a good practice)
  /*it("should show CreateElection view component with title for `/create-election/?title=test%20with%20title`", () => {
    const wrapper = mount(
      <MemoryRouter
        initialEntries={["/create-election/?title=test%20with%20title"]}
      >
        <Routes />
      </MemoryRouter>
    );
    expect(wrapper.find(CreateElection)).toHaveLength(1);
    expect(wrapper.find('input[name="title"]').props().value).toBe(
      "test with title"
    );
    expect(wrapper.find(UnknownView)).toHaveLength(0);
  });*/

  it("should show UnknownView view component for `/vote`", () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={["/vote"]}>
        <Routes />
      </MemoryRouter>
    );
    expect(wrapper.find(Vote)).toHaveLength(0);
    expect(wrapper.find(UnknownView)).toHaveLength(1);
  });

  it("should show UnknownView view component for `/result`", () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={["/result"]}>
        <Routes />
      </MemoryRouter>
    );
    expect(wrapper.find(Result)).toHaveLength(0);
    expect(wrapper.find(UnknownView)).toHaveLength(1);
  });

  it("should show UnknownView view component for `/aaabbbcccddd`", () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={["/aaabbbcccddd"]} initialIndex={0}>
        <Routes />
      </MemoryRouter>
    );
    expect(wrapper.find(UnknownView)).toHaveLength(1);
  });
});

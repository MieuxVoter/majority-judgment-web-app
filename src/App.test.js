import React from 'react';
import ReactDOM from 'react-dom';
import { Route,MemoryRouter } from 'react-router-dom';

import App from './App';
import Adapter from 'enzyme-adapter-react-16';
import { shallow,mount,configure } from 'enzyme';

import Home from "./components/views/Home.js";
import CreateBallot from "./components/views/CreateBallot.js";
import UnknownView from "./components/views/UnknownView";

configure({ adapter: new Adapter() });


it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});


/*let pathMap = {};
describe('open good View component for each route', () => {

  beforeAll(() => {
    const app = shallow(<App/>);
    pathMap = app.find(Route).reduce((pathMap, route) => {
      const routeProps = route.props();
      pathMap[routeProps.path] = routeProps.component;
      return pathMap;
    }, {});
    console.log(pathMap)
  });

  it('should show Home component for `/`', () => {
    expect(pathMap['/']).toBe(Home);
  });

  it('should show CreateBallot component for `/create-ballot`', () => {
    expect(pathMap['/create-ballot']).toBe(CreateBallot);
  });


});*/

describe('open good View component for each route', () => {


  it('should show Home component for `/`', () => {
    const wrapper = mount( <MemoryRouter initialEntries = {['/']} initialIndex={0} >
          <App/>
        </MemoryRouter>
    );
    expect(wrapper.find(Home)).toHaveLength(1);
    expect(wrapper.find(UnknownView)).toHaveLength(0);
  });


  it('should show CreateBallot component for `/create-ballot`', () => {
    const wrapper = mount( <MemoryRouter initialEntries = {['/create-ballot']} initialIndex={1} >
          <App/>
        </MemoryRouter>
    );
    expect(wrapper.find(CreateBallot)).toHaveLength(1);
    expect(wrapper.find(UnknownView)).toHaveLength(0);
  });


 /* it('should show UnknownView component for `/aaabbbcccddd`', () => {
    const wrapper = mount( <MemoryRouter initialEntries = {['/aaabbbcccddd']} initialIndex={0} >
          <App/>
        </MemoryRouter>
    );
    console.log(wrapper.debug());
    expect(wrapper.find(UnknownView)).toHaveLength(1);
  });*/

});
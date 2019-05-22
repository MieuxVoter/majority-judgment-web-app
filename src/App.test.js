import React from 'react';
import ReactDOM from 'react-dom';
import { Route } from 'react-router-dom';
import App from './App';
import Adapter from 'enzyme-adapter-react-16';
import { shallow,configure } from 'enzyme';

import Home from "./components/views/Home.js";
import CreateBallot from "./components/views/CreateBallot.js";
import UnknownView from "./components/views/UnknownView";

configure({ adapter: new Adapter() })

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});


let pathMap = {};
describe('open good View component for each route', () => {

  beforeAll(() => {
    const App = shallow(<App/>);
    pathMap = App.find(Route).reduce((pathMap, route) => {
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

  /*it('should show UnknowView component for `/xvwverdtebdj`', () => {
    expect(pathMap['/xvwverdtebdj']).toBe(UnknownView);
  });*/

});
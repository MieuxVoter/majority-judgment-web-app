import React from 'react';
import ReactDOM from 'react-dom';
import {MemoryRouter} from 'react-router-dom';

import Routes from './Routes';
import App from './App';
import Adapter from 'enzyme-adapter-react-16';
import {mount, configure} from 'enzyme';

import Home from "./components/views/Home.js";
import CreateBallot from "./components/views/CreateBallot.js";
import Result from "./components/views/Result.js";
import Vote from "./components/views/Vote.js";
import UnknownView from "./components/views/UnknownView";

configure({adapter: new Adapter()});


it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App/>, div);
    ReactDOM.unmountComponentAtNode(div);
});


describe('open good View component for each route', () => {

    it('should show Home view component for `/`', () => {
        const wrapper = mount(<MemoryRouter initialEntries={['/']}>
                <Routes/>
            </MemoryRouter>
        );
        expect(wrapper.find(Home)).toHaveLength(1);
        expect(wrapper.find(UnknownView)).toHaveLength(0);
    });


    it('should show CreateBallot view component for `/create-ballot`', () => {
        const wrapper = mount(<MemoryRouter initialEntries={['/create-ballot']}>
                <Routes/>
            </MemoryRouter>
        );
        expect(wrapper.find(CreateBallot)).toHaveLength(1);
        expect(wrapper.find(UnknownView)).toHaveLength(0);
    });

    it('should show Vote view component for `/vote`', () => {
        const wrapper = mount(<MemoryRouter initialEntries={['/vote']}>
                <Routes/>
            </MemoryRouter>
        );
        expect(wrapper.find(Vote)).toHaveLength(1);
        expect(wrapper.find(UnknownView)).toHaveLength(0);
    });

    it('should show Result view component for `/result`', () => {
        const wrapper = mount(<MemoryRouter initialEntries={['/result']}>
                <Routes/>
            </MemoryRouter>
        );
        expect(wrapper.find(Result)).toHaveLength(1);
        expect(wrapper.find(UnknownView)).toHaveLength(0);
    });


    it('should show UnknownView view component for `/aaabbbcccddd`', () => {
        const wrapper = mount(<MemoryRouter initialEntries={['/aaabbbcccddd']} initialIndex={0}>
                <Routes/>
            </MemoryRouter>
        );
        expect(wrapper.find(UnknownView)).toHaveLength(1);
    });

});

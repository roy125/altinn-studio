import { JSDOM } from 'jsdom';
import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import 'jest';

const { document } = new JSDOM(
  '<!doctype html><html lang="no"><body>Body text<div id="root"></div></body></html>',
).window;

global['document'] = document;
global['window'] = document.defaultView;

global.window.resizeTo = (width, height) => {
  global.window['innerWidth'] = width || global.window.innerWidth;
  global.window['innerHeight'] = height || global.window.innerHeight;
  global.window.dispatchEvent(new Event('resize'));
};

Enzyme.configure({
  adapter: new Adapter(),
});

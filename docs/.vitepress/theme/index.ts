import DefaultTheme from 'vitepress/theme';
import DidBtcr2DemoCreate from './components/DidBtcr2DemoCreate.vue';
import DidBtcr2DemoResolve from './components/DidBtcr2DemoResolve.vue';
import './custom.css';
export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('DidBtcr2DemoCreate', DidBtcr2DemoCreate);
    app.component('DidBtcr2DemoResolve', DidBtcr2DemoResolve);
  },
};

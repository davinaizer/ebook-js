import App from './App';
import ConsoleFix from 'libs/ConsoleFix';
import ViewportUnitsBuggyfill from 'viewport-units-buggyfill';

ViewportUnitsBuggyfill.init();

let app = new App({ el: '#main' });
app.bootstrap();

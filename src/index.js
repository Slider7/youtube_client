import App from './controllers/App';
import AppView from './views/AppView';
import AppModel from './models/AppModel';

const model = new AppModel();
const view = new AppView();
const app = new App(model, view);

app.start();

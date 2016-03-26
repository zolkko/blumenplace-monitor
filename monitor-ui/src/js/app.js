import Backbone from 'backbone';
import Router from './router';
import MainView from './screens/main/index';
import UsersController from './controllers/users-controller';

Backbone.$ = $;

class Application {
    constructor() {
        new Router();
        Backbone.history.start();
    }

    initialize () {
        this.controllers = {
            users: new UsersController({ app: this })
        };
        
        this.router = new Router({
            app: this,
            controllers: this.controllers
        });
        
        this.mainView = new MainView({
            el: $('#app'),
            router: this.router
        });

        this.showApp();
    }

    showApp () {
        this.mainView.render();
        Backbone.history.start({ pushState: true });
    }
}

export default Application;


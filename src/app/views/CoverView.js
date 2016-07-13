import Backbone from 'backbone';
import Bootstrap from 'bootstrap-sass';
import EventBus from 'helpers/EventBus';
import Progressbar from 'views/components/Progressbar';

import tpl_cover from 'templates/cover.hbs';
import tpl_cover_newuser from 'templates/cover_newuser.hbs';

export default class CoverView extends Backbone.View {

    constructor(options) {
        Object.assign(options || {}, {
            events: {
                'click #start-btn': 'start'
            }
        });
        super(options);
    }

    initialize() {
        console.log("CoverPageView.initialize");

        this.globalProgress = this.model.globalProgress;
        this.template = (this.model.maxIndex > 0 && this.model.lessonMode === "normal") ? tpl_cover : tpl_cover_newuser;
    }

    render() {
        this.$el.html(this.template(this));

        if (this.template === tpl_cover) {
            this.progressbar = new Progressbar({
                el: '#progress-bar-cover',
                model: this.model
            });
            this.progressbar.render();
        }
        return this;
    }

    start(e) {
        e.preventDefault();

        var $startBtn = this.$("#start-btn");
        $startBtn.attr('disabled', 'disabled');
        this.stopListening();

        EventBus.trigger(EventBus.event.NAV_START);
    }
}

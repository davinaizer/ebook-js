import Backbone from 'backbone';
import Bootstrap from 'bootstrap-sass';
import EventBus from 'helpers/EventBus';
import Progressbar from 'views/components/Progressbar';

// templates
import tpl_cover from 'templates/cover.hbs';
import tpl_cover_incomplete from 'templates/cover-incomplete.hbs';
import tpl_cover_completed from 'templates/cover-completed.hbs';

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
        console.log('CoverPageView.initialize');

        this.globalProgress = this.model.globalProgress;
        this.template = tpl_coveró;

        if (this.model.lessonMode === 'normal') {
            if (this.globalProgress == 100) {
                this.template = tpl_cover_completed;
            } else if (this.model.maxIndex > 0) {
                this.template = tpl_cover_incomplete;
            }
        }
    }

    render() {
        this.$el.html(this.template(this));

        let $progressBar = this.$('#progress-bar-cover');
        if ($progressBar.length > 0) {
            this.progressbar = new Progressbar({
                el: $progressBar,
                model: this.model
            });
            this.progressbar.render();
        }

        return this;
    }

    start(e) {
        e.preventDefault();

        var $startBtn = this.$('#start-btn');
        $startBtn.attr('disabled', 'disabled');
        this.stopListening();

        EventBus.trigger(EventBus.event.NAV_START);
    }
}

import $ from 'jquery';
import Backbone from 'backbone';
import Bootstrap from 'bootstrap-sass';
import EventBus from 'helpers/EventBus';
import template from 'templates/components/progressbar.hbs';

export default class Progressbar extends Backbone.View {

    constructor(options) {
        Object.assign(options || {}, {});
        super(options);
    }

    initialize() {
        console.log("GlobalProgressbar.initialize");

        this.template = template;
        this.chapterProgress = this.model.getChaptersProgress();

        var chapters = this.model.chapters;
        var userTotal = 0;
        var globalTotal = 0;

        for (var i = 0; i < chapters.length; ++i) {
            var chapterP = this.chapterProgress[i];

            chapterP.user *= 100;
            chapterP.local = (chapterP.user * chapterP.global);

            userTotal += chapterP.local;
            globalTotal += chapterP.global * 100;

            chapterP.userTotal = userTotal;
            chapterP.globalTotal = globalTotal;
            chapterP.user = chapterP.user.toFixed(0);
        }
    }

    render() {
        console.log("GlobalProgressbar.render");

        this.$el.html(this.template(this));
        this.$('[data-toggle="tooltip"]').tooltip({trigger: 'hover'});

        return this;
    }
}

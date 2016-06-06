/**
 * Created by Naizer on 02/06/2016.
 */
import $ from 'jquery';
import Backbone from 'backbone';
import EventBus from 'helpers/EventBus';
import template from 'templates/components/chapter_nav.hbs';

export default class ChapterNavView extends Backbone.View {

    constructor(options) {
        $.extend(options || {}, {
                id: "chapter-guide",
                events: {
                    "click #btn-next-chapter": "nextChapter",
                    "click #btn-prev-chapter": "prevChapter"
                }
            }
        );
        super(options);
    }

    initialize() {
        console.log("ChapterNavView.initialize");
        this.template = template;
    }

    render() {
        console.log("ChapterNavView.render");
        this.$el.hide();
        this.$el.html(this.template());
        this.$el.fadeIn(500);

        this.validate();

        return this;
    }

    validate() {
        // validate
        var currentChapter = this.model.getCurrentChapter();
        if (currentChapter.index == 0) {
            this.$("#btn-prev-chapter").hide();
        } else if (currentChapter.index == currentChapter.total - 1) {
            this.$("#btn-next-chapter").hide();
        }
    }

    prevChapter(e) {
        e.preventDefault();
        EventBus.trigger(EventBus.event.NAV_PREVIOUS_CHAPTER);
    }

    nextChapter(e) {
        e.preventDefault();
        EventBus.trigger(EventBus.event.NAV_NEXT_CHAPTER);
    }

}

/**
 * Created by Naizer on 02/06/2016.
 */
import $ from 'jquery';
import Backbone from 'backbone';
import Bootstrap from 'bootstrap-sass';
import EventBus from 'helpers/EventBus';
import template from 'templates/components/chapter_nav.hbs';

export default class ChapterNavView extends Backbone.View {

    constructor(options) {
        $.extend(options || {}, {
                id: "chapter-guide",
                events: {
                    "click #btn-next-chapter": "nextChapter",
                    "click #btn-prev-chapter": "prevChapter",
                    "click ul>li": "chapterNav"
                }
            }
        );
        super(options);
    }

    initialize() {
        console.log("ChapterNavView.initialize");
        this.template = template;
        this.chapters = this.model.data.chapter;
        console.log("ChapterNavView.initialize: ", this.chapters);
    }

    render() {
        console.log("ChapterNavView.render");
        this.$el.hide();
        this.$el.html(this.template(this));
        this.$el.fadeIn(500);

        this.$('[data-toggle="tooltip"]').tooltip({trigger: 'hover'});
        this.validate();

        return this;
    }

    validate() {
        // validate buttons
        var currentChapter = this.model.getCurrentChapter();
        if (currentChapter.index == 0) {
            this.$("#btn-prev-chapter").hide();
        } else if (currentChapter.index == currentChapter.total - 1) {
            this.$("#btn-next-chapter").hide();
        }

        //-- validate chapter guide
        var maxChapter = this.model.getMaxItem().chapter;
        var nextChapterId = maxChapter.index + 1;

        this.$("ul>li").each((index, el)=> {
            if (currentChapter.index == index) {
                $(el).addClass("active");
            } else if (index > nextChapterId) {
                $(el).addClass("disabled");
                $(el).attr("disabled", true);
            }
        });
    }

    prevChapter(e) {
        e.preventDefault();
        EventBus.trigger(EventBus.event.NAV_PREVIOUS_CHAPTER);
    }

    nextChapter(e) {
        e.preventDefault();
        EventBus.trigger(EventBus.event.NAV_NEXT_CHAPTER);
    }

    chapterNav(e) {
        var $target = this.$(e.currentTarget);
        var chapterId = $target.find("a").attr("href").split("#chapter_")[1];
        var isEnabled = !$target.is("[disabled]");
        if (isEnabled) {
            EventBus.trigger(EventBus.event.NAV_GOTO_CHAPTER, chapterId);
        }
        e.preventDefault();
    }

}

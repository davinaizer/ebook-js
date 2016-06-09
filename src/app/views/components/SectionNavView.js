import $ from 'jquery';
import Backbone from 'backbone';
import Bootstrap from 'bootstrap-sass';
import EventBus from 'helpers/EventBus';
import template from 'templates/components/section_nav.hbs';

export default class SectionsNavView extends Backbone.View {

    constructor(options) {
        Object.assign(options || {}, {
                el: "#section-nav",
                events: {
                    "click li": "sectionNav"
                }
            }
        );
        super(options);
    }

    initialize() {
        this.template = template;
    }

    render() {
        console.log("SectionsNavView.render:");

        this.section = this.model.getCurrentChapter().section;

        this.$el.hide();
        this.$el.html(this.template(this));
        this.$el.fadeIn(500);

        this.$('[data-toggle="tooltip"]').tooltip({trigger: 'hover'});
        this.validate();

        return this;
    }

    validate() {
        console.log("SectionsNavView.validate");

        var currentSection = this.model.getCurrentItem();
        var maxSection = this.model.getMaxItem();
        var maxSectionIndex = (maxSection.chapter.index > currentSection.chapter.index) ? currentSection.total : maxSection.index;

        this.$("li").each((index, el)=> {
            this.$(el).removeClass("active disabled").attr("disabled", false);

            if (index == currentSection.index) {
                $(el).addClass("active").attr("disabled", true);
            }
            if (index > maxSectionIndex) {
                $(el).addClass("disabled").attr("disabled", true);
            }
        });
    }

    sectionNav(e) {
        var $target = this.$(e.currentTarget);
        var sectionId = $target.find("a").attr("href").split("section/")[1];
        var isEnabled = !$target.is("[disabled]");

        if (isEnabled) {
            var sectionUid = this.section[sectionId].uid;
            var section = this.model.getItem(sectionUid);
            EventBus.trigger(EventBus.event.NAV_GOTO, section);
        }
        e.preventDefault();
    }
}

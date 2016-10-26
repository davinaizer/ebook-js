import Backbone from 'backbone';
import Bootstrap from 'bootstrap-sass';
import EventBus from 'libs/EventBus';
import Template from 'core/navigation/SectionNav.hbs';

export default class SectionNavView extends Backbone.View {

  constructor(options) {
    Object.assign(options || {}, {
      el: '#section-nav',
      events: {
        'click li': 'sectionNav'
      }
    });
    super(options);
  }

  initialize() {
    this.template = Template;
  }

  render() {
    console.log('SectionNavView.render:');

    this.$el.hide();
    this.$el.html(this.template(this.model));
    this.$el.fadeIn(500);

    //set fixed height for parent DIV
    this.$el.css('height', this.$el.find('nav').css("height"));

    this.$('[data-toggle="tooltip"]').tooltip({ trigger: 'hover' });
    this.validate();

    return this;
  }

  validate() {
    let currentSection = this.model.getCurrentSection();
    let maxSection = this.model.getMaxSection();
    let maxSectionIndex = (maxSection.chapter.index > currentSection.chapter.index) ? currentSection.total : maxSection.index;

    this.$('li').each((index, el) => {
      this.$(el).find('a').blur();
      this.$(el).removeClass('disabled').attr('disabled', false);

      if (index > maxSectionIndex) {
        this.$(el).addClass('disabled').attr('disabled', true);
      }
    });
  }

  sectionNav(e) {
    let $target = this.$(e.currentTarget);
    let sectionUid = $target.attr('id').split('section-nav-item-')[1];
    let isEnabled = !$target.is('[disabled]');

    if (isEnabled) {
      let section = this.model.getSection(sectionUid);
      EventBus.trigger(EventBus.event.NAV_GOTO, { section: section });
    }
    e.preventDefault();
  }
}

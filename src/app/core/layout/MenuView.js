import Backbone from 'backbone';
import EventBus from 'libs/EventBus';
import ProgressbarView from 'core/shared/ProgressbarView';

import Template from 'core/layout/Menu.hbs';

export default class MenuView extends Backbone.View {

  constructor(options) {
    options = Object.assign(options || {}, {
      events: {
        'click a': 'navHandler'
      }
    });
    super(options);
  }

  initialize() {
    this.bind('navHandler', 'keyPress');

    this.isOpen = false;
    this.template = Template;
  }

  render() {
    console.log('MenuView.render');

    this.$el.html(this.template(this.model));

    this.progressbar = new ProgressbarView({
      el: '#progress-bar-menu',
      model: this.model
    });

    this.progressbar.render();
    this.clearFixColumns();
    this.validate();

    return this;
  }

  clearFixColumns() {
    //-- Dynamic CLEAR FIX
    this.$('div.chapter-list').each((i, el) => {
      let count = i + 1;
      if (count % 2 === 0) {
        this.$(el).after('<div class="clearfix visible-sm-block"></div>');
      } else if (count % 3 === 0) {
        this.$(el).after('<div class="clearfix visible-md-block visible-lg-block"></div>');
      }
    });
  }

  show() {
    if (!this.isOpen) {
      this.isOpen = true;
      this.render();

      this.$('.menu').height('100%');
      this.$('.menu').scrollTop(0);
      $('body').css('overflow', 'hidden');
    }
  }

  hide() {
    if (this.isOpen) {
      this.isOpen = false;

      this.$('.menu').height(0);
      $('body').css('overflow', 'scroll');
    }
  }

  toggle() {
    if (this.isOpen) {
      this.hide();
    } else {
      this.show();
    }
  }

  validate() {
    let maxSectionUid = this.model.getMaxSection().uid;
    let currentSectionUid = this.model.getCurrentSection().uid;

    this.$('.list-group > a').each((index, el) => {
      this.$(el).blur();
      this.$(el).removeClass('active disabled').attr('disabled', false);

      if (index === currentSectionUid) {
        this.$(el).addClass('current');
      } else if (index > maxSectionUid) {
        this.$(el).addClass('disabled').attr('disabled', true);
      }
    });
  }

  //-- NAVIGATION FUNTCIONS
  navHandler(e) {
    let $target = this.$(e.currentTarget);
    let id = $target.attr('id');
    let isEnabled = !$target.is('[disabled]') && (id.indexOf('btn-menu-') > -1);

    if (isEnabled) {
      this.hide();

      let sectionUid = parseInt(id.split('btn-menu-')[1]);
      if (sectionUid >= 0) {
        EventBus.trigger(EventBus.event.NAV_GOTO, { section: this.model.getSection(sectionUid) });
      }
    }
    e.preventDefault();
  }
}

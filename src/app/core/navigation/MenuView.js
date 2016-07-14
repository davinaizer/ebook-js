import Backbone from 'backbone';
import EventBus from 'libs/EventBus';

import ProgressbarView from 'core/shared/ProgressbarView';
import Template from 'core/navigation/Menu.hbs';

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

    //-- lister for keyboard
    $(document).on('keydown', (e) => {
      this.keyPress(e);
    });
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
    this.isOpen = true;
    this.render();

    this.$('.dashboard').height('100%');
    this.$('.dashboard').scrollTop(0);

    $('body').css('overflow', 'hidden');
  }

  hide() {
    this.isOpen = false;
    this.$('.dashboard').height(0);

    $('body').css('overflow', 'scroll');
  }

  toggle() {
    if (this.isOpen) {
      this.hide();
    } else {
      this.show();
    }
  }

  validate() {
    let maxSectionUid = this.model.maxSection.uid;
    let currentSectionUid = this.model.currentSection.uid;

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

    if (isEnabled && !this.isPageLoading) {
      this.hide();

      let sectionUid = parseInt(id.split('btn-menu-')[1]);
      if (sectionUid >= 0) {
        EventBus.trigger(EventBus.event.NAV_GOTO, { section: this.model.getSection(sectionUid) });
      }
    }
    e.preventDefault();
  }

  keyPress(e) {
    let code = e.keyCode || e.which;
    if (code === 27 && this.isOpen) {
      //ESC press
      this.hide();
      e.preventDefault();
    }
  }
}

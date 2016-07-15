import Backbone from 'backbone';
import EventBus from 'libs/EventBus';

import Template from 'core/layout/Help.hbs';

export default class HelpView extends Backbone.View {

  constructor(options) {
    options = Object.assign(options || {}, {
      events: {}
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
    console.log('HelpView.render');

    this.$el.html(this.template());

    return this;
  }

  show() {
    this.isOpen = true;
    this.render();

    this.$('.help').height('100%');
    this.$('.help').scrollTop(0);

    $('body').css('overflow', 'hidden');
  }

  hide() {
    this.isOpen = false;
    this.$('.help').height(0);

    $('body').css('overflow', 'scroll');
  }

  toggle() {
    if (this.isOpen) {
      this.hide();
    } else {
      this.show();
    }
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

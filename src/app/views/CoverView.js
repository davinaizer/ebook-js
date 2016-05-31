import $ from 'jquery';
import Backbone from 'backbone';
import TweenMax from 'gsap';
import template from 'templates/cover.hbs';

export default class CoverView extends Backbone.View {

    constructor(options) {
        $.extend(options || {}, {
                el: $("#content"),
                events: {
                    'click #start-btn': 'start'
                }
            }
        );
        super(options);
    }

    initialize() {
        console.log("CoverPageView.initialize");
        this.template = template;
    }

    render() {
        this.$el.html(this.template(this.model));
        return this;
    }

    start() {
        var $startBtn = this.$("#start-btn");
        $startBtn.text("Aguarde");
        $startBtn.attr('disabled', 'disabled');

        //-- Fetch StatusModel
        this.model.fetch();
    }
}

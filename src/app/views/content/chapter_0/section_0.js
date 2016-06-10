import EventBus from 'helpers/EventBus';
import BaseView from 'views/content/BaseView';
import Bootstrap from 'bootstrap-sass';
import TourData from 'data/tour.json';
import template from 'templates/components/tour.hbs'

//AMD?
require('bootstrap-tour');

export default class SectionView extends BaseView {

    constructor(options) {
        Object.assign(options || {}, {});
        super(options);
    }

    initialize() {
    }

    bootstrap() {
        if (this.navModel.maxIndex === 0) {
            TourData.template = template;
            var tour = new Tour(TourData);
            tour.template = template;
            tour.init();
            tour.start();
        }
    }
}

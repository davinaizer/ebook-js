import EventBus from 'libs/EventBus';
import SectionView from 'core/section/SectionView';

export default class extends SectionView {

  constructor(options) {
    super(options);
  }

  bootstrap() {
    // FINISH - LESSON_STATUS === COMPLETED
    console.log('EventBus.event.STATUS_FINISH');
    EventBus.trigger(EventBus.event.STATUS_UPDATE, { 'cmi.core.score.raw': 100 });
    EventBus.trigger(EventBus.event.STATUS_FINISH);
    EventBus.trigger(EventBus.event.PAGE_LOADED);
  }
}

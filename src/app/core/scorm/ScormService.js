import Backbone from 'backbone';
import EventBus from 'libs/EventBus';
import ScormApi from 'libs/ScormApi';

export default class ScormService extends Backbone.Model {

  constructor(options) {
    Object.assign(options || {}, {});
    super(options);
  }

  initialize() {
    console.log('ScormService.initialize');

    this.scorm = ScormApi;
    this.scorm.version = '1.2';
    this.isAvailable = false;
    this.lessonMode = 'normal';
    this.lessonStatus = 'incomplete';
    this.suspendData = {};
  }

  fetch() {
    console.log('ScormService.fetch');

    this.isAvailable = this.scorm.init();

    if (this.isAvailable && this.lessonMode === 'normal') {
      console.log('ScormService.isAvailable ?' + this.isAvailable);

      //-- Check for first time SCO launch
      //this.scorm.get('cmi.core.entry') === 'ab-initio'
      this.lessonStatus = this.getParam('cmi.core.lesson_status');
      this.suspendData = this.getParam('cmi.suspend_data');

      if (this.suspendData !== '' && this.suspendData !== undefined && this.suspendData !== null) {
        console.info('Resuming... Reading STATUS from SUSPEND_DATA.');

        this.suspendData = this.suspendData.replace(/'/g, '\"');
        this.suspendData = JSON.parse(this.suspendData);

        if (this.lessonStatus === 'completed') {
          window.alert('Você já completou este módulo.');
        }
      } else {
        console.info('First time SCO launch. Setting initial data.');

        this.suspendData = {};
        let scormData = {
          'cmi.core.lesson_status': 'incomplete',
          'cmi.core.exit': 'suspend',
          'cmi.suspend_data': this.suspendData
        };
        this.update(null, scormData);
      }
    } else {
      console.warn('SCORM API not available. Setting lessonMode = "browse".');
      this.lessonMode = 'browse';
    }

    EventBus.trigger(EventBus.event.STATUS_LOADED, { suspendData: this.suspendData });
  }

  setParam(param, value) {
    let success = this.scorm.set(param, value);
    console.log('ScormService.setParam(', param, ') =>', value, ':', success);
  }

  getParam(param) {
    let ret = this.scorm.get(param);
    console.log('ScormService.getParam(', param, ') =>', ret);
    return ret;
  }

  update(data) {
    if (this.isAvailable) {
      if (this.lessonStatus !== 'completed') {
        for (let key in data) {
          if (data.hasOwnProperty(key)) {
            if (key.indexOf('suspend_data') > -1) {
              Object.assign(this.suspendData, data[key]);
              data[key] = JSON.stringify(this.suspendData).replace(/"/g, '\'');
            }
            this.setParam(key, data[key]);
          }
        }
        this.save();
      } else {
        console.warn('ScormService.update: LESSON_STATUS == COMPLETED. Cant update SCORM Data!');
      }
    } else if (this.lessonMode === 'normal') {
      console.warn('SCORM API not available. Cant update SCORM Data!');
    }
  }

  save() {
    let success = this.scorm.save();
    console.log('ScormService.save:', success);
  }

  dispatchSuspendData() {
    EventBus.trigger(EventBus.event.STATUS_LOADED, this.suspendData);
  }

  finish() {
    console.log('ScormService.finish');
    if (this.lessonStatus === 'incomplete') {
      this.lessonStatus = 'completed';
      this.setParam('cmi.core.lesson_status', this.lessonStatus);
      this.save();
    } else {
      console.warn('Lesson already Completed! Cannot Finish!');
    }
  }

  quit() {
    console.log('ScormService.quit');
    if (this.isActive) {
      this.save();
      this.scorm.quit();
    }
  }
}

var _ = require('underscore');

var rubyContext = {
  rbBasicObject: {},
  rbObject: {},
  rbClass: {},
  rbModule: {},

  _baseObject: {
    myClass: null,
    mySuperClass: null,
    myEigenClass: null,
    myType: null, // object, eigenObject, class, eigenClass

    myVariables: {},
    myMethods: {
      test_method: 'true;'
    },

    sendInstanceMethod: function(method_name) {
      console.log('sendInstance ' + Math.random());
      if (this.myMethods[method_name]) {
        return eval(this.myMethods[method_name]);
      }

      if (this.myType == 'object') { this.myEigenClass.sendInstanceMethod(method_name) }
      if (this.myType == 'eigenClass') { this.mySuperClass.sendInstanceMethod(method_name) }
      if (this.myType == 'class') { this.mySuperClass.sendInstanceMethod(method_name) }
    },

    sendClassMethod: function(method_name) {
      console.log('sendClass');
      if (this.myMethods[method_name]) {
        return eval(this.myMethods[method_name]);
      }

      if (this.myType == 'class') { this.myEigenClass.sendClassMethod(method_name) };
      if (this.myType == 'eigenClass') { this.mySuperClass.sendClassMethod(method_name) };
    },

    send: function(method_name) {
      console.log('send ' + this.myType);
      if (this.myType == 'object') { return this.sendInstanceMethod(method_name) };
      if (this.myType == 'class') { return this.sendClassMethod(method_name) };
    }
  },

  init: function() {
      this.rbModule = this._baseObject;
      this.rbModule.myMethods['define_method'] = function(method_name, method_body) {
        this.myMethods[method_name] = method_body;
      }
      this.rbClass = this._baseObject;
    },
}

var tester = {
  run: function(context) {
    if (context.rbBasicObject) { console.log('SUCCESS: object exist') } else { console.log('FAILED: basic object not exist') }
    if (context.rbObject) { console.log('SUCCESS: basic object exist') } else { console.log('FAILED: object not exist') }
    if (context.rbClass) { console.log('SUCCESS: class exist') } else { console.log('FAILED: class not exist') }
    if (context.rbModule) { console.log('SUCCESS: module exist') } else { console.log('FAILED: module not exist') }
    if (context._baseObject) { console.log('SUCCESS: _baseObject exist') } else { console.log('FAILED: _baseObject not exist') }
    context.init();
    //if (context.rbClass.send('new')) { console.log('SUCCESS: rbClass.new') } else { console.log('FAILED: rbClass.new') }
    // if (context.rbClass.send('class')
    var obj = _.clone(context._baseObject);
    obj.myType = 'object';

    var cl = _.clone(context._baseObject);
    cl.myType = 'class';

    var ecl = _.clone(context._baseObject);
    ecl.myType = 'eigenClass';

    obj.mySuperClass = cl;
    obj.myEigenClass = ecl;

    obj.mySuperClass.mySuperClass = _.clone(cl);
    obj.mySuperClass.myEigenClass = _.clone(ecl);

    obj.mySuperClass.mySuperClass.myEigenClass = _.clone(ecl);

    obj.mySuperClass.mySuperClass.myMethods['foo'] = 'true';
    //console.log(obj.myEigenClass.myMethods);
    console.log(obj);
    //console.log(obj.mySuperClass.mySuperClass);
    if (obj.send('foo')) { console.log('SUCCESS: instance method') } else { console.log('FAILED: instance method') }

    obj.mySuperClass.mySuperClass.myEigenClass.myMethods['bar'] = 'true'
    if (obj.mySuperClass.send('bar')) { console.log('SUCCESS: class method') } else { console.log('FAILED: class method') }
  }
}

tester.run(rubyContext);
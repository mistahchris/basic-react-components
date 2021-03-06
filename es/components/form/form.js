var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import PropTypes from "prop-types";

import { concatClassNames } from "../../helpers.js";
import FormInput from "./formInput.js";

var Form = function (_Component) {
  _inherits(Form, _Component);

  function Form(props) {
    _classCallCheck(this, Form);

    var _this = _possibleConstructorReturn(this, _Component.call(this));

    ["handleSubmit", "renderChildren"].forEach(function (fn) {
      return _this[fn] = _this[fn].bind(_this);
    });
    // this is used to store references to uncontrolled components
    _this.formRefs = {};
    // this is used to determine what children this component
    // should "control"
    _this.formComponentTypes = [FormInput].concat(props.componentTypesToRegister);
    return _this;
  }

  Form.prototype.handleSubmit = function handleSubmit(e) {
    e.preventDefault();
    // copy formData from props
    var form = _extends({}, this.props.formData);

    // add values from uncontrolled inputs
    Object.values(this.formRefs).forEach(function (_ref) {
      var name = _ref.name,
          ref = _ref.ref;

      form[name.toLowerCase()] = ref.value;
    });

    // submit form with data from both controlled and
    // uncontrolled components
    this.props.onSubmit(form);
  };

  Form.prototype.renderChildren = function renderChildren() {
    var _this2 = this;

    return React.Children.map(this.props.children, function (child) {
      var passUnmodified = !_this2.formComponentTypes.includes(child.type);
      if (passUnmodified) return child;

      var _child$props = child.props,
          name = _child$props.name,
          uncontrolled = _child$props.uncontrolled;

      var childName = name;

      if (uncontrolled) {
        // pass down a function that can pass a reference to the
        // input dom element back up
        return React.cloneElement(child, {
          setRef: function setRef(element) {
            return _this2.formRefs[childName] = element;
          }
        });

        // if child should be a controlled form component
        // add onChange and value props to it - to make it
        // "controlled"
      } else {
        return React.cloneElement(child, {
          onChange: function onChange(_ref2) {
            var name = _ref2.name,
                value = _ref2.value;
            return _this2.props.onChange({ name: name, value: value });
          },
          value: _this2.props.formData[childName].value || ""
        });
      }
    });
  };

  Form.prototype.render = function render() {
    var _props = this.props,
        classes = _props.classes,
        addClasses = _props.addClasses;

    return React.createElement(
      "form",
      {
        className: concatClassNames(classes, addClasses),
        onSubmit: this.handleSubmit
      },
      this.renderChildren()
    );
  };

  return Form;
}(Component);

Form.defaultProps = {
  classes: ["pa1", "ph3-m", "ph4-ns"],
  componentTypesToRegister: []
};

Form.propTypes = process.env.NODE_ENV !== "production" ? {
  classes: PropTypes.arrayOf(PropTypes.string),
  addClasses: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  formData: PropTypes.object,
  componentTypesToRegister: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.element, PropTypes.func]))
} : {};

export default Form;
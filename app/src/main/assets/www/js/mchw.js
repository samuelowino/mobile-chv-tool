/*
 * Copyright (c) 2014. The Trustees of Indiana University.
 *
 * This version of the code is licensed under the MPL 2.0 Open Source license with additional
 * healthcare disclaimer. If the user is an entity intending to commercialize any application
 * that uses this code in a for-profit venture, please contact the copyright holder.
 */

/* Start - Minimal one element selected
 * Parameter:
 * * Fieldset element where the input must be selected at least one.
 * * Message to be displayed when none of the elements in the fieldset is selected.
 */
var validateSelected = function (source) {
    var errors = {};
    var fieldSet = $(source).filter(':visible');
    if (fieldSet.length) {
        var tag = fieldSet.prop('tagName');
        // check if the source element is a field set (or other container in the future).
        if (tag.toLowerCase() != 'fieldset') {
            // if not, then this is an input element. And then get the closest field set.
            fieldSet = $(source).closest('fieldset');
            // if we can't find the fieldset container, then just return the empty validation errors.
            if (!fieldSet.length) {
                return errors;
            }
        }
        // get the visible inputs element that are checked
        var checkedInput = $(fieldSet).find('input:checked');
        if (checkedInput.length == 0) {
            errors[$(fieldSet).attr('name')] = "This question must be answered.";
        }
    }
    return errors;
};
/* End - Minimal one element selected */

/* Start - Selecting an element should be single selection
 * * Parameter:
 * * Fieldset element where the input should be a single selection or the collection of checkboxes elements.
 * * Values which should be a single selection.
 * * Message to be displayed when the element is selected with other element.
 */
var validateAlone = function (source, values, message) {
    var errors = {};
    var fieldSet = $(source).filter(':visible');
    if (fieldSet.length) {
        var tag = fieldSet.prop('tagName');
        // if the tag is not fieldset, then it is an input.
        // then get the closest fieldset for the inputs (which must be a fieldset).
        if (tag.toLowerCase() != 'fieldset') {
            fieldSet = $(source).closest('fieldset');
            // if we can't find the fieldset container, then just return the empty validation errors.
            if (!fieldSet.length) {
                return errors;
            }
        }
        var checkedBoxes = $(fieldSet).find('input:checkbox:checked');
        if (checkedBoxes.length > 1) {
            $.each(checkedBoxes, function (i, checkBox) {
                $.each(values, function (j, value) {
                    if ($(checkBox).val() == value) {
                        errors[$(fieldSet).attr('name')] = message;
                    }
                })
            })
        }
    }
    return errors;
};
/* End - Selecting an element should be single selection */

/* Start - Show and hide validation error messages */
var showValidationMessages = function (errors) {
    var validator = $('form').validate();
    if (!$.isEmptyObject(errors)) {
        validator.showErrors(errors);
    }
};

var toggleValidationMessages = function (errors) {
    var validator = $('form').validate();
    if ($.isEmptyObject(errors)){
        // remove the error messages
        validator.resetForm();
    } else {
        // show the error messages
        validator.showErrors(errors);
    }
};
/* End - Show and hide validation error messages */

$(document).ready(function () {
    'use strict';
    var dateFormat = "dd-mm-yy";

    $('form').append(
        '<div class="form-group text-center">' +
        '    <input class="btn btn-primary" id="save_draft" type="button" value="Save"/>' +
        '    <input class="btn btn-primary" id="submit_form" type="button" value="Submit"/>' +
        '</div>'
    );

    /* Start - Toggle free text element */
    var hasFreetext = $('.has-freetext');
    hasFreetext.change(function () {
        var freetext = $(this).closest('.section').find('.freetext');
        if ($(this).is(':checkbox')) {
            if ($(this).is(':checked')) {
                freetext.show();
            } else {
                freetext.hide();
            }
        }
    });
    hasFreetext.trigger('change');
    /* End - Toggle free text element */

    /* Start - Toggle future date validation */
    $('.future-date').change(function () {
        if ($(this).is(':visible') && $(this).val() != '') {
            var errors = {};
            var pattern = /(\d{2})-(\d{2})-(\d{4})/g;
            var matches = pattern.exec($(this).val());
            var enteredDate = new Date(matches[3], matches[2] - 1, matches[1]);
            var today = new Date();
            if (enteredDate <= today) {
                errors[$(this).attr('name')] = "Please enter a date in the future.";
            }
            toggleValidationMessages(errors);
        }
    });
    /* End - Toggle future date validation */

    /* Start - Toggle past date validation */
    $('.past-date').change(function () {
        if ($(this).is(':visible') && $(this).val() != '') {
            var errors = {};
            var pattern = /(\d{2})-(\d{2})-(\d{4})/g;
            var matches = pattern.exec($(this).val());
            var enteredDate = new Date(matches[3], matches[2] - 1, matches[1]);
            var today = new Date();
            if (enteredDate > today) {
                errors[$(this).attr('name')] = "Please enter a date prior or equal to today.";
            }
            toggleValidationMessages(errors);
        }
    });
    /* End - Toggle past date validation */

    /* Start - Removing error message in the container of checkbox and radio */
    $('input:checkbox, input:radio').change(function () {
        var container = $(this).closest('fieldset');
        $(container).removeClass('error');
        $(container).parent().find('label.error').remove();
    });
    /* End - Removing error message in the container of checkbox and radio */

    /* Start - Function to save the form */
    document.submit = function () {
        var repeatingSections = $('.repeat');
        var showErrorMessageIfInvalid = true;
        var validForm = document.multipleSectionRepeatsValidationCheck(repeatingSections,showErrorMessageIfInvalid);
        if (typeof $.fn.customValidationCheck !== 'undefined' && typeof $.fn.customValidationCheck === 'function') {
            validForm = validForm && $.fn.customValidationCheck();
        }
        if (validForm) {
    	    $(this).find('input:text').each(function(){
    		$(this).val($.trim($(this).val()));
    	    });
            save("complete", false);
        } else {
            addValidationMessage();
        }
    };

    document.autoSaveForm = function(){
        save("incomplete", true);
    };

    document.saveDraft = function () {
        save("incomplete", false);
        return false;
    };

    var save = function (status, keepFormOpen) {
        var jsonData = JSON.stringify($('form').serializeEncounterForm(), null, '\t');
        var pre = $("#json-output");
        if (pre.length == 0) {
            pre = document.createElement("pre");
            $(pre).attr("id", "json-output");
            $(pre).append(jsonData);
            $('body').append(pre);
        } else {
            pre.html(jsonData);
        }
    };

    var addValidationMessage = function () {
        var validationError = $('#validation-error');
        if (validationError.length == 0) {
            $('form').prepend(
                    '<div class="error" id="validation-error">' +
                    '    There is one or more validation check failed on this form. Please review and resubmit the form' +
                    '</div>'
            );
        } else {
            validationError.html('There is one or more validation failed on this form. Please review and resubmit the form');
        }
        $('html, body').animate({ scrollTop: 0 }, 'slow');
    };

    var removeValidationMessage = function () {
        $('#validation-error').remove();
    };

    function saveCHVForm() {
        AppJavascriptInterface.saveCHVForm();
    }
    /* End - Function to save the form */

    /*Start- BarCode Functionality*/

    /* Called by the Activity WebViewActivity*/
    document.populateBarCode = function (jsonString) {
        $.each(jsonString, function (key, value) {
            var $inputField = $("input[name='" + key + "']");
            $inputField.val(value);
            $inputField.trigger('change');  //Need this to trigger the event so AMRS id gets populated.
        })
    };

    $('.barcode_btn').click(function () {
        barCodeComponent.startBarCodeIntent($(this).parent().find("input[type='text']").attr('name'));
    });

    /*End- BarCode Functionality*/

    /*Start- Imaging Functionality*/

    /* Called by the Activity WebViewActivity*/
    document.populateImage = function (sectionName, jsonString) {
        var $parent = $('div[data-name="' + sectionName + '"]');
        $.each(jsonString, function (key, value) {
            var $inputField = $parent.find("input[name='" + key + "']");
            $inputField.val(value);
            $inputField.trigger('change');  //Need this to trigger the event so image gets populated.
        })
    };

    $('.image_btn').click(function () {
        imagingComponent.startImageIntent($(this).parent().parent().attr('data-name'),
            $(this).parent().find("input[type='hidden']").attr('name'),
            $(this).parent().find("input[type='hidden']").val(),
            $(this).parent().find("input[type='text']").attr('name'),
            $(this).parent().find("input[type='text']").val(),
            $("input[name='encounter.form_uuid']").val());
    });

    /*End- Imaging Functionality*/

    /*Start- Audio Capture Functionality*/

    /* Called by the Activity WebViewActivity*/
    document.populateAudio = function (sectionName, jsonString) {
        var $parent = $('div[data-name="' + sectionName + '"]');
        $.each(jsonString, function (key, value) {
            var $inputField = $parent.find("input[name='" + key + "']");
            $inputField.val(value);
            $inputField.trigger('change');  //Need this to trigger the event so audio gets populated.
        })
    };

    $('.audio_record_btn').click(function () {
        audioComponent.startAudioIntent($(this).parent().parent().attr('data-name'),
            $(this).parent().find("input[type='hidden']").attr('name'),
            $(this).parent().find("input[type='hidden']").val(),
            $(this).parent().find("input[type='text']").attr('name'),
            $(this).parent().find("input[type='text']").val(),
            $("input[name='encounter.form_uuid']").val());
    });

    /*End- Audio Capture Functionality*/

    /*Start- Video Capture Functionality*/

    /* Called by the Activity WebViewActivity*/
    document.populateVideo = function (sectionName, jsonString) {
        var $parent = $('div[data-name="' + sectionName + '"]');
        $.each(jsonString, function (key, value) {
            var $inputField = $parent.find("input[name='" + key + "']");
            $inputField.val(value);
            $inputField.trigger('change');  //Need this to trigger the event so video gets populated.
        })
    };

    $('.video_record_btn').click(function () {
        videoComponent.startVideoIntent($(this).parent().parent().attr('data-name'),
            $(this).parent().find("input[type='hidden']").attr('name'),
            $(this).parent().find("input[type='hidden']").val(),
            $(this).parent().find("input[type='text']").attr('name'),
            $(this).parent().find("input[type='text']").val(),
            $("input[name='encounter.form_uuid']").val());
    });

    /*End- Video Capture Functionality*/

    /* Start - Initialize jQuery DatePicker */

    $('.datepicker').datepicker({
        dateFormat: dateFormat,
        changeMonth: true,
        changeYear: true
    });

    /* Start - Initialize jQuery DatePicker */

    /* Start - CheckDigit algorithm Source: https://wiki.openmrs.org/display/docs/Check+Digit+Algorithm */

    $.validator.addMethod("checkDigit", function (value, element) {
            var num = value.split('-');
            if (num.length != 2) {
                return false;
            }
            return $.fn.luhnCheckDigit(num[0]) == num[1];
        }, "Please enter digits that matches CheckDigit algorithm."
    );

    // attach 'checkDigit' class to perform validation.
    jQuery.validator.addClassRules({
        checkDigit: { checkDigit: true }
    });

    $.fn.luhnCheckDigit = function (number) {
        var validChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVYWXZ_";
        number = number.toUpperCase().trim();
        var sum = 0;
        for (var i = 0; i < number.length; i++) {
            var ch = number.charAt(number.length - i - 1);
            if (validChars.indexOf(ch) < 0) {
                return false;
            }
            var digit = ch.charCodeAt(0) - 48;
            var weight;
            if (i % 2 == 0) {
                weight = (2 * digit) - parseInt(digit / 5) * 9;
            }
            else {
                weight = digit;
            }
            sum += weight;
        }
        sum = Math.abs(sum) + 10;
        return (10 - (sum % 10)) % 10;
    };

    /* End - CheckDigit Algorithm */

    $.fn.isNotRequiredAndEmpty = function (value, element) {
        if (!$(element).attr('required') && value == '') return true;
    };

    // attach 'checkDigit' class to perform validation.
    jQuery.validator.addClassRules({
        checkDigit: { checkDigit: true }
    });

    /* Start - Checking that the current date is not in the future */

    $.validator.addMethod("nonFutureDate", function (value, element) {
            if ($.fn.isNotRequiredAndEmpty(value, element)) return true;
            var pattern = /(\d{2})-(\d{2})-(\d{4})/g;
            var matches = pattern.exec(value);
            var enteredDate = new Date(matches[3], matches[2] - 1, matches[1]);
            var today = new Date();
            return enteredDate <= today;
        }, "Please enter a date prior or equal to today."
    );

    // attach 'nonFutureDate' class to perform validation.
    jQuery.validator.addClassRules({
        nonFutureDate: { nonFutureDate: true }
    });

    /* End - nonFutureDate*/

    /* Start - Checking that the current date is in the future */

    $.validator.addMethod("checkFutureDate", function (value, element) {
            if ($.fn.isNotRequiredAndEmpty(value, element)) return true;
            var pattern = /(\d{2})-(\d{2})-(\d{4})/g;
            var matches = pattern.exec(value);
            var enteredDate = new Date(matches[3], matches[2] - 1, matches[1]);
            var today = new Date();
            return enteredDate > today;
        }, "Please enter a date in the future."
    );

    // attach 'checkFutureDate' class to perform validation.
    jQuery.validator.addClassRules({
        checkFutureDate: { checkFutureDate: true }
    });

    /* End - checkFutureDate*/

    /* Start - Checking that the entered value is a valid phone number */

    $.validator.addMethod("phoneNumber", function (value, element) {
            if ($.fn.isNotRequiredAndEmpty(value, element)) return true;
            var inputLength = value.length;
            return inputLength >= 8 && inputLength <= 12;
        }, "Invalid Phone Number. Please check and re-enter."
    );

    // attach 'phoneNumber' class to perform validation.
    jQuery.validator.addClassRules({
        phoneNumber: { phoneNumber: true }
    });

    /* End - phoneNumber*/

    /* Start - checkNoneSelectedAlone*/

    $.fn.checkNoneSelectedAlone = function (nameArray) {
        var $validator = $('form').validate();
        var errors = {};
        var result = true;
        $.each(nameArray, function (i, element) {
            var fieldSetElem = $('fieldset[name="' + element + '"]');
            result = isValidForNoneSelection(fieldSetElem);
            if (!result) {
                errors[element] = "If 'None' is selected, no other options can be selected.";
            }
        });
        if (!result) {
            $validator.showErrors(errors);
        }
        return result;
    };

    var isValidForNoneSelection = function (element) {
        var $fieldset = $(element);
        if ($fieldset.prop('tagName') != 'FIELDSET') {
            return true;
        }
        var valid = true;
        var totalSelected = $fieldset.find('input:checkbox:checked').length;
        $.each($fieldset.find('input:checkbox:checked'), function (i, cBoxElement) {
            if (($(cBoxElement).val() == 'none' || $(cBoxElement).val() == '1107^NONE^99DCT')
                && totalSelected > 1) {
                valid = false;
            }
        });
        return valid;
    };

    /* End - checkNoneSelectedAlone*/

    $.fn.getTempBirthDate = function (years) {
        var currentYear = new Date().getFullYear();
        var estimatedDate = new Date(currentYear - parseInt(years), 0, 1);
        return $.datepicker.formatDate(dateFormat, estimatedDate);
    };

    $.fn.getAgeInYears = function (birthDateString) {
        var birthDate = new Date(birthDateString);
        var today = new Date();
        var milliSecondsInAYear = 1000 * 60 * 60 * 24 * 365.26;
        return (today - birthDate) / milliSecondsInAYear;
    };

    /* Start - Used for Sub-Forms */

    $('.repeat')
        .append("<input class='btn btn-primary add_section pull-left' type='button' value='+'/>")
        .append("<input class='btn btn-primary remove_section pull-right' type='button' value='-'/><span class='clear'></span>");

    /* Modified by Sam to create active cloned buttons and separate sections by data-name */
    $(document.body).on('click', '.add_section', function () {
        var $clonedSection = $(this).parent().clone(true).insertAfter($(this).parent());
        var parentName = $clonedSection.attr("id");

        /* Get largest suffix so far */
        var _id = $(this).parent().attr('id');
        var $repeatedSections = $("." + _id);
        var suffixInt = 0;
        $.each($repeatedSections, function (i, repeatedSection) {
            var idnr = $(repeatedSection).attr("data-name").match(/\d+$/);
            if (parseInt(idnr) > parseInt(suffixInt)) {
                suffixInt = idnr;
            }
        });
        if (parseInt(suffixInt) == 0) {
            parentName += "1";
        } else {
            parentName += parseInt(suffixInt) + 1;
        }
        $clonedSection.attr("data-name", parentName);

        document.clearValuesOnClonedFields($clonedSection);
        if(document.isMaxRepeatsReached($clonedSection)){
            $('.add_section').prop('disabled', true);
        }
        var showErrorMessageIfInvalid = false;
        document.multipleSectionRepeatsValidationCheck($("." + $clonedSection.attr("id")),showErrorMessageIfInvalid);
    });

    $(document.body).on('click', '.remove_section', function () {
        document.removeIfRepeatedSection($(this));
    });

    document.clearValuesOnClonedFields = function ($clonedSection){
        $clonedSection.find(':input:not(:button):not(:radio):not(:checkbox)').val('');
        $clonedSection.find(':input:not(:button)').trigger('change');
        $clonedSection.find(':radio').prop('checked',false);
        $clonedSection.find(':radio').trigger('change');
        $clonedSection.find(':checkbox').prop('checked',false);
        $clonedSection.find(':checkbox').trigger('change');
    }

    $(document.body).on('click', '.remove_section', function () {
        document.removeIfRepeatedSection($(this));
    });

    document.removeIfRepeatedSection = function($element){
        var $parent = $element.parent();
        var _id = $parent.attr('id');
        var similarElements = $parent.parent().find("." + _id);
        if (similarElements.length > 1) {
            $parent.remove();
            if(!document.isMaxRepeatsReached($(similarElements[0]))){
               similarElements.find('.add_section').prop('disabled',false);
            }
        }
    }
    /* remove any nested cloned subsections.
        This function is reusable with custom cloning
        @param removalClickElementSelector is optional*/
    document.removeRepeatedSubSections = function($parentSection, removalClickElementSelector){
        if(typeof removalButtonClass === "undefined"){
            removalClickElementSelector = '.remove_section';
        }
        var $repeated_subsection = $parentSection.find(removalClickElementSelector);
        if ($repeated_subsection !== undefined && $repeated_subsection instanceof Array) {
            $.each($repeated_subsection,
                function(key,section){
                    $.each($(section),
                        function(k,v){
                           document.removeIfRepeatedSection($(v));
                        }
                    );
                }
            );
        } else if($repeated_subsection !== undefined) {
            $.each($repeated_subsection,
                function(k,v){
                   document.removeIfRepeatedSection($(v));
               }
            );
        }
    }

    document.isMaxRepeatsReached = function($section){
        var _id = $section.attr('id');
        var sectionCount = $section.parent().find("." + _id).length;
        var repeatParams = $section.attr('data-repeatparams');
        if(repeatParams != null){
            repeatParams = $.parseJSON(repeatParams);
            if(typeof repeatParams.max != 'undefined'){
                var maxRepeats=repeatParams.max;
                return sectionCount >= maxRepeats;
            }
        } else {
            return false;
        }
    }

    document.getCurrentAndMinimumRepeats = function($section){
        var _id = $section.attr('id');
        var sectionCount = $section.parent().find("." + _id).length;
        var repeatParams = $section.attr('data-repeatparams');
        var minRepeatsParams = null;
        if(repeatParams != null){
            repeatParams = $.parseJSON(repeatParams);
            if(typeof repeatParams.min != 'undefined'){
                var minRepeats=repeatParams.min;
                minRepeatsParams = {};
                minRepeatsParams['current_repeats'] = sectionCount;
                minRepeatsParams['minimum_repeats'] = minRepeats;
            }
        }
        return minRepeatsParams;
    }

    document.repeatValidationCheck = function($section,showErrorMessageIfInvalid) {
        var validSection = true;
        var minRepeatsParams = document.getCurrentAndMinimumRepeats($section);
        if(minRepeatsParams != null && minRepeatsParams.current_repeats < minRepeatsParams.minimum_repeats){
            validSection = false;
            if(showErrorMessageIfInvalid){
                var $validationError = $section.find('.repeat-error');
                if($validationError.length>0){
                    $validationError.html("Minimum repeats not satisfied. Needs at least "+minRepeatsParams.minimum_repeats);
                    $validationError.show();
                } else {
                    $validationError = '<div class="error repeat-error">Minimum repeats is not satisfied. Needs at least ' + minRepeatsParams.minimum_repeats + '. </div>';
                    $section.append($validationError);
                }
            }
        } else {
            var $validationError = $section.find('.repeat-error');
            if($validationError.length>0){
                $validationError.hide();
            }
        }
        return validSection;
    }
    document.multipleSectionRepeatsValidationCheck = function($selector, showErrorMessageIfInvalid) {
        var validForm = true;
        $.each($selector,function(k,v){
            if(validForm){
                validForm = document.repeatValidationCheck($(v),showErrorMessageIfInvalid);
            } else {
                document.repeatValidationCheck($(v),showErrorMessageIfInvalid);
            }
        });
        return validForm;
    }

    /* End - Used for Sub-Forms */

    /* Start - Checks that a field is a decimal */

    $.validator.addClassRules({
        isDecimal: {
            number: true
        }
    });

    /* End - Checks that a field is a decimal */

    /* Start - JS to Prepopulate Data in the Form */
    var populateDataConcepts = function ($div, value) {
        $.each(value, function (k, v) {
            if (v instanceof Array) {
               var $elements = $div.find('[data-concept="' + k + '"]');
                 if ($elements.length < v.length) {
                    $.each(v, function (i, valueElement) {
                        if (i == 0) {
                            $.each($elements, function(i, element) {
                                applyValue(element, valueElement);
                            });
                        } else {
                            var $div = $elements.closest('.repeat, .custom-repeat');
                            var $clonedDiv = $div.clone(true);
                            $div.after($clonedDiv);
                            $elements = $clonedDiv.find('[data-concept="' + k + '"]');
                            $.each($elements, function(i, element) {
                                applyValue(element, valueElement);
                            });
                        }
                    });
                } else if ($elements.length == v.length) {
                    $.each(v, function (i, valueElement) {
                        applyValue($elements[i], valueElement);
                    });
                } else {
                    $.each(v, function (i, valueElement) {
                        $.each($elements, function(i, element) {
                            applyValue(element, valueElement);
                        });
                    });
                }
            }else if (v instanceof Object){
                if(v.obs_value !== undefined && v.obs_datetime !== undefined){
                    var obs_elements = $div.find('[data-concept="' + k + '"]');
                    $.each(obs_elements, function(i, element) {
                        applyValue(element, v.obs_value);
                    });

                    var datetime_element = $div.find('[data-obsdatetimefor="' + obs_elements.attr('name') + '"]');
                    applyValue(datetime_element, v.obs_datetime);
                }else{
                    populateObservations($div, v);
                }
            } else {
                var elements = $div.find('[data-concept="' + k + '"]');
                $.each(elements, function(i, element) {
                    applyValue(element, v);
                });
            }
        });
    };

       var populateNonConceptFields = function ($parentDiv, prePopulateJson) {
        $.each(prePopulateJson, function (key, value) {
            var $elements = $parentDiv.find('[name="' + key + '"]');
            if (value instanceof Array) {
                 if ($elements.length < value.length) {
                    $.each(value, function (i, valueElement) {
                        if (i == 0) {
                            $.each($elements, function(i, element) {
                                applyValue(element, valueElement);
                            });
                        } else {
                            var $div = $elements.closest('.repeat, .custom-repeat');
                            var $clonedDiv = $div.clone(true);
                            $div.after($clonedDiv);
                            $elements = $clonedDiv.find('[name="' + key + '"]');
                            $.each($elements, function(i, element) {
                                applyValue(element, valueElement);
                            });
                        }
                    });
                } else if ($elements.length == value.length) {
                    $.each(value, function (i, valueElement) {
                        applyValue($elements[i], valueElement);
                    });
                } else {
                    $.each(value, function (i, valueElement) {
                        $.each($elements, function(i, element) {
                            applyValue(element, valueElement);
                        });
                    });
                }
            } else if (value instanceof Object){
                populateNonObservations($parentDiv, value);
            } else {
                $.each($elements, function (i, element) {
                    applyValue(element, value);
                });
            }
        });
    };

    var applyValue = function (element, value) {
        if ($(element).is(':checkbox') || $(element).is(':radio')) {
            if ($(element).val() == value) {
                $(element).prop('checked', true);
            }
        } else {
            $(element).val(value);
        }
    };

    var populateNonObservations = function ($parentDiv, prePopulateJson) {
        $.each(prePopulateJson, function (key, value) {
            if (value instanceof Object) {
                // check if this is a grouping observation.
                var $div = $parentDiv.find('div[data-group="' + key + '"]');
                if ($div.length > 0) {
                    // we are dealing with grouping
                    if (value instanceof Array) {
                        $.each(value, function (i, element) {
                            if (i == 0) {
                                populateNonConceptFields($div, element);
                            } else {
                                var $clonedDiv = $div.clone(true);
                                document.clearValuesOnClonedFields($clonedDiv);
                                document.removeRepeatedSubSections($clonedDiv);
                                populateNonConceptFields($clonedDiv, element);
                                $div.after($clonedDiv);
                            }
                        });
                    } else {
                        populateNonConceptFields($div, value);
                    }
                } else {
                    // we are not dealing with repeating
                    if (value instanceof Array) {
                        var elements = $parentDiv.find('[data-group="' + key + '"]');
                        if (elements.length < value.length) {
                            $.each(value, function (i, valueElement) {
                                if (i == 0) {
                                    $.each(elements, function (i, element) {
                                        applyValue(element, valueElement);
                                    });
                                } else {
                                    var $div = $(elements).closest('.repeat, .custom-repeat');
                                    var $clonedDiv = $div.clone(true);
                                    $div.after($clonedDiv);
                                    elements = $clonedDiv.find('[data-group="' + key + '"]');
                                    $.each(elements, function (i, element) {
                                        applyValue(element, valueElement);
                                    });
                                }
                            });
                        } else {
                            $.each(value, function (i, valueElement) {
                                $.each(elements, function (i, element) {
                                    applyValue(element, valueElement);
                                });
                            });
                        }
                    } else {
                        populateNonConceptFields($div, value);
                    }
                }
            }
            else {
                var $elements = $parentDiv.find('[name="' + key + '"]');
                $.each($elements, function (i, element) {
                    applyValue(element, value);
                });
            }
        });
    };

    var populateObservations = function ($parentDiv, prePopulateJson) {
        $.each(prePopulateJson, function (key, value) {
            if (value instanceof Object) {
                // check if this is a grouping observation.
                var $div = $parentDiv.find('div[data-concept="' + key + '"]');
                if ($div.length > 0) {
                    // we are dealing with grouping
                    if (value instanceof Array) {
                        $.each(value, function (i, element) {
                            if (i == 0) {
                                populateDataConcepts($div, element);
                            } else {
                                var $clonedDiv = $div.clone(true);
                                document.clearValuesOnClonedFields($clonedDiv);
                                document.removeRepeatedSubSections($clonedDiv);
                                populateDataConcepts($clonedDiv, element);
                                $div.after($clonedDiv);
                            }
                        });
                    } else {
                        populateDataConcepts($div, value);
                    }
                } else {
                    // we are not dealing with repeating
                    if (value instanceof Array) {
                        var elements = $parentDiv.find('[data-concept="' + key + '"]');
                        if (elements.length < value.length) {
                            $.each(value, function (i, valueElement) {
                                if (i == 0) {
                                    $.each(elements, function (i, element) {
                                        applyValue(element, valueElement);
                                    });
                                } else {
                                    var $div = $(elements).closest('.repeat, .custom-repeat');
                                    var $clonedDiv = $div.clone(true);
                                    $div.after($clonedDiv);
                                    elements = $clonedDiv.find('[data-concept="' + key + '"]');
                                    $.each(elements, function (i, element) {
                                        applyValue(element, valueElement);
                                    });
                                }
                            });
                        } else {
                            $.each(value, function (i, valueElement) {
                                $.each(elements, function (i, element) {
                                    applyValue(element, valueElement);
                                });
                            });
                        }
                    } else if (value.obs_value !== undefined && value.obs_datetime !== undefined) {
                        var obs_elements = $parentDiv.find('[data-concept="' + key + '"]');
                        $.each(obs_elements, function (i, element) {
                            applyValue(element, value.obs_value);
                        });
                        var datetime_element = $parentDiv.find('[data-obsdatetimefor="' + obs_elements.attr('name') + '"]');
                        applyValue(datetime_element, value.obs_datetime);
                    } else {
                        populateDataConcepts($div, value);
                    }
                }
            }
            else {
                var $elements = $parentDiv.find('[data-concept="' + key + '"]');
                $.each($elements, function (i, element) {
                    applyValue(element, value);
                });
            }
        });
    };

    var prePopulateData = $.trim($('#pre_populate_data').html());

    if (prePopulateData != '') {
        console.time("Starting population");
        var prePopulateJSON = JSON.parse(prePopulateData);
        $.each(prePopulateJSON, function(key, value) {
            if (key === 'observation') {
                populateObservations($('form'),value);
            } else {
                populateNonObservations($('form'),value);
            }
        });
        console.timeEnd("Starting population");
    }
    /* End - JS to Prepopulate Data in the Form */

    /* Start - Code to Serialize form along with Data-Concepts */
    $.fn.serializeEncounterForm = function () {
        var jsonResult = $.extend({}, serializeNonConceptElements(this),
        serializeNestedNonConceptElements(this),
            serializeConcepts(this), serializeNestedConcepts(this));
        var completeObject = {};
        var defaultKey = "observation";
        $.each(jsonResult, function (k, v) {
            var key = defaultKey;
            var dotIndex = k.indexOf(".");
            if (dotIndex >= 0) {
                key = k.substr(0, k.indexOf("."));
            }
            var objects = completeObject[key];
            if (objects === undefined) {
                objects = {};
                completeObject[key] = objects;
            }
            objects[k] = v;
        });
        return completeObject;
    };

    var serializeNonConceptElements = function ($form) {
        var object = {};
        var $inputElements = $form.find('[name]').not('[data-concept]');
        $.each($inputElements, function (i, element) {
          var $closestElement = $(element).closest('.section, .group-set', $form);
          if ($form.is($closestElement) || $closestElement.attr('data-group') == undefined ) {
            if ($(element).is(':checkbox') || $(element).is(':radio')) {
                if ($(element).is(':checked')) {
                    object = pushIntoArray(object, $(element).attr('name'), $(element).val());
                }
            } else {
                object = pushIntoArray(object, $(element).attr('name'), $(element).val());
            }
          }
        });
        return object;
    };

    var serializeNestedNonConceptElements = function ($form) {
        var result = {};
        var allParentDivs = $form.find('div[data-group]').filter(':visible');
        var nestedParentDivs = allParentDivs.find('div[data-group]');
        var rootParentDivs = allParentDivs.not(nestedParentDivs);
        $.each(rootParentDivs, function (i, element) {
            var $childDivs = $(element).find('div[data-group]');
            if($childDivs.length > 0){
                var subResult1 = serializeNestedNonConceptElements($(element));
                var subResult2 = serializeNonConceptElements($(element));
                var subResultCombined = $.extend({}, subResult1,subResult2);
                result = pushIntoArray(result, $(element).attr('data-group'), subResultCombined);
            } else {
                var $allNonConcepts = $(element).find('*[name]');
                result = pushIntoArray(result, $(element).attr('data-group'), jsonifyNonConcepts($allNonConcepts));

            }
        });
        return result;
    }

    var serializeNestedConcepts = function ($form) {
        var result = {};
        var allParentDivs = $form.find('div[data-concept]').filter(':visible');
        var nestedParentDivs = allParentDivs.find('div[data-concept]');
        var rootParentDivs = allParentDivs.not(nestedParentDivs);
        $.each(rootParentDivs, function (i, element) {
            var $childDivs = $(element).find('div[data-concept]');
            if($childDivs.length > 0){
                var subResult1 = serializeNestedConcepts($(element));
                var subResult2 = serializeConcepts($(element));
                var subResultCombined = $.extend({}, subResult1,subResult2);
                result = pushIntoArray(result, $(element).attr('data-concept'), subResultCombined);
            } else {
                var $allConcepts = $(element).find('*[data-concept]');
                result = pushIntoArray(result, $(element).attr('data-concept'), jsonifyConcepts($allConcepts));
            }
        });
        return result;
    };

    var serializeConcepts = function ($form) {
        var object = {};
        var allConcepts = $form.find('*[data-concept]').filter(':visible');
        $.each(allConcepts, function (i, element) {
            var $closestElement = $(element).closest('.section, .concept-set', $form);
            if ($form.is($closestElement) || $closestElement.attr('data-concept') == undefined ) {
                var jsonifiedConcepts = jsonifyConcepts($(element));
                if (JSON.stringify(jsonifiedConcepts) != '{}' && jsonifiedConcepts != "") {
                    $.each(jsonifiedConcepts, function (key, value) {
                        if (object[key] !== undefined) {
                            if (!object[key].push) {
                                object[key] = [object[key]];
                            }
                            object[key].push(value || '');
                        } else {
                            object[key] = value || '';
                        }
                    });
                }
            }
        });
        return object;
    };

    var jsonifyConcepts = function ($allConcepts) {
        var o = {};
        $.each($allConcepts, function (i, element) {
            if ($(element).is(':checkbox') || $(element).is(':radio')) {
                if ($(element).is(':checked')) {
                    o = pushIntoArray(o, $(element).attr('data-concept'), $(element).val());
                }
            } else {
                o = pushIntoArray(o, $(element).attr('data-concept'), $(element).val());
            }
        });
        return o;
    };
    var jsonifyNonConcepts = function ($allNonConcepts) {
        var o = {};
        $.each($allNonConcepts, function (i, element) {
          //if element is metadata check whether corresponding value is present
          if(typeof $(element).attr('data-metadata-for') !== 'undefined'){
             var correspondingValueElementName = $(element).attr('data-metadata-for');
             var value = $(element).closest('div[data-group]').find('[name="' + correspondingValueElementName + '"]').val();
             if(value != ''){
               jsonifyNonConcept(o,element);
             }
          } else {
            jsonifyNonConcept(o,element);
          }
        });
        return o;
    };

    var jsonifyNonConcept = function(object,element){
      if ($(element).is(':checkbox') || $(element).is(':radio')) {
          if ($(element).is(':checked')) {
              object = pushIntoArray(object, $(element).attr('name'), $(element).val());
          }
      } else {
          object = pushIntoArray(object, $(element).attr('name'), $(element).val());
      }
      return object;
    };

    var pushIntoArray = function (object, key, value) {
        if (JSON.stringify(value) == '{}' || value == "") {
            return object;
        }
        if (object[key] !== undefined) {
            if (!object[key].push) {
                object[key] = [object[key]];
            }
            object[key].push(value || '');
        } else {
            object[key] = value || '';
        }
        return object;
    };

    /* End - Code to Serialize form along with Data-Concepts */

     document.setupAutoCompleteData = function(elementName) {
         var dataDictionary = [
                 {"val": "7", "label": "Chulaimbo"},
                 {"val": "3", "label": "Turbo"},
                 {"val": "17", "label": "Iten"},
                 {"val": "2", "label": "Mosoriot"},
                 {"val": "8", "label": "Webuye"},
                 {"val": "84", "label": "Ampath MTRH"}
             ];
         document.setupAutoComplete('encounter\\.location_id', dataDictionary);
     };

    //Set up auto complete for an element.(generic, will work with any element that needs auto complete on it)
    document.setupAutoComplete = function(elementName, dataDictionary) {

        $("#" + elementName).autocomplete({
            source: dataDictionary,
            create: function(event, ui) {
                var val = $('input[name=' + elementName + ']').val();
                $.each(dataDictionary, function(i, elem) {
                    if (elem.val == val) {
                        $("#" + elementName).val(elem.label);
                    }
                });
            },
            select: function(event, ui) {
                $('input[name="' + elementName + '"]').val(ui.item.val);
                $("#" + elementName).val(ui.item.label);
                return false;
            }
        });
    }

    document.setupAutoCompleteDataForProvider = function(elementName) {
          var providers = [{"val":"3356-3","label":"David S. Pamba"},
                      {"val":"237-8","label":"Ariya Patrick"},
                      {"val":"3331-6","label":"Benjamin Osiya Ekirapa"},
                      {"val":"3332-4","label":"Molly Omodek Aluku"},
                      {"val":"3355-5","label":"Clementine Ingosi Osiel"}];
          document.setupAutoCompleteForProvider('encounter\\.provider_id_select', providers);
    };



    //Set up auto complete for the provider element.
    document.setupAutoCompleteForProvider = function(elementName, providers) {

        $("#" + elementName).autocomplete({
            source: providers,
            create: function(event, ui) {
                var provider_val = $('input[name="' + elementName + '"]').val();
                $.each(providers, function(i, elem) {
                    if (elem.val == provider_val) {
                        $("#" + elementName).val(elem.label);
                    }
                });
            },
            select: function(event, ui) {
                $('input[name="' + elementName + '"]').val(ui.item.val);
                $("#" + elementName).val(ui.item.label);
                $('#encounter\\.provider_id').val(ui.item.val);
                return false;
            }
        });
    }

    document.setupValidationForProvider = function(value, element) {
        /* Start - Checking that the user entered provider exists in the list of possible providers */
        var listOfProviders = [{"val":"3356-3","label":"David S. Pamba"},
                              {"val":"237-8","label":"Ariya Patrick"},
                              {"val":"3331-6","label":"Benjamin Osiya Ekirapa"},
                              {"val":"3332-4","label":"Molly Omodek Aluku"},
                              {"val":"3355-5","label":"Clementine Ingosi Osiel"}];
        $.validator.addMethod("validProviderOnly", function(value, element) {

            if ($.fn.isNotRequiredAndEmpty(value, element)) return true;
            var providerEnteredByUser = value;
            for (var i = 0; i < listOfProviders.length; i++) {
                if (providerEnteredByUser == listOfProviders[i].label) {
                    return true;
                }
            }
            return false;
        }, "Please provide a provider from the list of possible providers.");
    }
        // attach 'validProviderOnly' class to perform validation.
        jQuery.validator.addClassRules({

            "valid-provider-only": {
                validProviderOnly: true
            }
        });
        /* End - validProviderOnly*/


    document.setupValidationForLocation = function(value, element) {
                     var listOfLocations = [
                             {"val": "7", "label": "Chulaimbo"},
                             {"val": "3", "label": "Turbo"},
                             {"val": "17", "label": "Iten"},
                             {"val": "2", "label": "Mosoriot"},
                             {"val": "8", "label": "Webuye"},
                             {"val": "84", "label": "Ampath MTRH"}
                         ];

        /* Start - Checking that the user entered location exists in the list of possible locations */
        $.validator.addMethod("validLocationOnly", function(value, element) {
            if ($.fn.isNotRequiredAndEmpty(value, element)) return true;
            var locationEnteredByUser = $('#encounter\\.location_id').val();
            for (var i = 0; i < listOfLocations.length; i++) {
                if (locationEnteredByUser == listOfLocations[i].label) {
                    return true;
                }
            }
            return false;
        }, "Please provide a location from the list of possible locations.");

    }

    // attach 'validLocationOnly' class to perform validation.
        jQuery.validator.addClassRules({
            "valid-location-only": { validLocationOnly: true }
        });
        /* End - validLocationOnly*/


    document.setupValidationForConsultation = function(value, element, listOfConsultants) {
        /* Start - Checking that the user entered consultant exists in the list of possible consultant */
        $.validator.addMethod("validConsultantOnly", function(value, element) {
            if ($.fn.isNotRequiredAndEmpty(value, element)) return true;
            var locationEnteredByUser = $('#consultation\\.recipient').val();
            for (var i = 0; i < listOfConsultants.length; i++) {
                if (locationEnteredByUser == listOfConsultants[i].label) {
                    return true;
                }
            }
            return false;
        }, "Please provide a consultant from the list of possible consultants.");

    }

        // attach 'validConsultantOnly' class to perform validation.
    jQuery.validator.addClassRules({
        "valid-consultant-only": { validConsultantOnly: true }
    });
    /* End - validConsultantOnly*/
});

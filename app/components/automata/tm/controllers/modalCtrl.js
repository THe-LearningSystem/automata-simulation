(function () {
    'use strict';

    angular
        .module('automata-simulation')
        .controller('ModalCtrl', ModalCtrl);

    ModalCtrl.$inject = ['$uibModalInstance'];

    function ModalCtrl($uibModalInstance) {
        var vm = this;
        // if (data !== undefined) {
        //     console.log(data);
        //     vm.courseId = data.course._id;
        //     if(data.section !== undefined){
        //        vm.section = data.section;
        //     }
        // }
        //
        //
        // vm.languages = I18nManager.config.languages;
        // vm.selected = I18nManager.config.default;
        //
        //
        // vm.selectLanguage = function (language) {
        //     vm.selected = language;
        // };
        //
        // vm.create = function () {
        //     var data={
        //         courseId:vm.courseId,
        //         payload:vm.section
        //     };
        //     Courses.createSection(data);
        //     $uibModalInstance.close();
        // };
        //
        // vm.update = function () {
        //     var data={
        //         courseId:vm.courseId,
        //         sectionId:vm.section._id,
        //         payload:vm.section
        //     };
        //     Courses.updateSection(data);
        //     $uibModalInstance.close();
        // };
        //
        // vm.delete = function () {
        //     var data={
        //         courseId:vm.courseId,
        //         sectionId:vm.section._id
        //     };
        //     Courses.deleteSection(data);
        //     $uibModalInstance.close();
        // };
        //
        vm.cancel = function () {
            $uibModalInstance.dismiss("");
        };
    }
}());

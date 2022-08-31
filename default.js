"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
function yearsSince(startDate, endDate) {
    const millisecondsPerYear = 365 * 24 * 60 * 60 * 1000;
    return (endDate.getTime() - startDate.getTime()) / millisecondsPerYear;
}
/**
 * We haved decided to grant bonus vacation to every employee, 1 day per year of experience
 * we need to email them a notice.
 */
function grantVacation(emailApi, payroll, addresses, employees) {
    return __awaiter(this, void 0, void 0, function* () {
        //  Map the payroll to access by the id
        let payrollMap = payroll.map(i => [i.emp_id, i]);
        //  Map the addresses to access by the id
        let addressesMap = addresses.map(i => [i.emp_id, i]);
        //  Map the employees to access by the id 
        let employeesMap = employees.map(i => [i.id, i]);
        let emailBatchId = emailApi.createBatch();
        for (var index in payroll) {
            //  Replace the line to access all the information of the employee by the id
            //  let payrollInfo = payroll[index];
            let payrollInfo = payrollMap.get(payroll[index].emp_id);
            //  let addressInfo = addresses.find(x => x.emp_id == payrollInfo.emp_id);
            let addressInfo = addressesMap.get(payroll[index].emp_id);
            //  let empInfo = employees.find(x => x.id == payrollInfo.emp_id);
            let empInfo = employeesMap.get(payroll[index].emp_id);
            let today = new Date();
            const yearsEmployed = yearsSince(empInfo.endDate, today);
            let newVacationBalance = yearsEmployed + payrollInfo.vacationDays;
            emailApi.queueEmail(emailBatchId, addressInfo.email, "Good news!", `Dear ${empInfo.name}\n` +
                `based on your ${yearsEmployed} years of employment, you have been granted ${yearsEmployed} days of vacation, bringing your total to ${newVacationBalance}`);
        }
        yield emailApi.flushBatch(emailBatchId);
    });
}

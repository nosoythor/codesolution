import { AddressBook } from "./model/AddressBook";
import { EmailApi } from "./model/EmailApi";
import { Payroll } from "./model/Payroll";
import { Employee } from "./model/Employee";



function yearsSince(startDate: Date|null, endDate: Date): number {
    //  Add a validation to verify startDate
    if(startDate === null) return 0;
    const millisecondsPerYear = 365 * 24 * 60 * 60 * 1000;
    return ( endDate.getTime() - startDate.getTime() ) / millisecondsPerYear;
}


/**
 * We haved decided to grant bonus vacation to every employee, 1 day per year of experience
 * we need to email them a notice.
 */


async function grantVacation(
    emailApi: EmailApi,
    payroll: Payroll[],
    addresses: AddressBook[],
    employees: Employee[],
) {
    //  Map the payroll to access by the id
    let payrollMap : Map<string,Payroll> = new Map<string,Payroll>(payroll.map(i=>[i.emp_id,i]));
    //  Map the addresses to access by the id
    let addressesMap : Map<string,AddressBook> = new Map<string,AddressBook>(addresses.map(i=>[i.emp_id,i]));
    //  Map the employees to access by the id 
    let employeesMap : Map<string,Employee> = new Map<string,Employee>(employees.map(i=>[i.id,i]));

    let emailBatchId = emailApi.createBatch();
    for (var index in payroll) {
        //  Avoid unnecesary loop to find the address and employee information

        //  Replace the line to access all the information of the employee by the id
        //  let payrollInfo = payroll[index];
        let payrollInfo = payrollMap.get(payroll[index].emp_id);
        //  let addressInfo = addresses.find(x => x.emp_id == payrollInfo.emp_id);
        let addressInfo = addressesMap.get(payroll[index].emp_id);
        //  let empInfo = employees.find(x => x.id == payrollInfo.emp_id);
        let empInfo = employeesMap.get(payroll[index].emp_id);
        //  Validate payroll,employee,address are not null to continue
        if(payrollInfo === undefined || addressInfo === undefined || empInfo === undefined) return;

        let today = new Date()

        const yearsEmployed = yearsSince(  empInfo.endDate , today);
        let newVacationBalance = yearsEmployed + payrollInfo.vacationDays;

        emailApi.queueEmail(
            emailBatchId,
            addressInfo.email,
            "Good news!",
            `Dear ${empInfo.name}\n` +
            `based on your ${yearsEmployed} years of employment, you have been granted ${yearsEmployed} days of vacation, bringing your total to ${newVacationBalance}`
        );
    }
    await emailApi.flushBatch(emailBatchId);
}

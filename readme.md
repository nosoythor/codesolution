Issue detected:

As we go through the function we find out it search for the employee information 3 times on each loop wich means a lot of processing time because the function has to look for AddressBook data and Employee data, this consumes a lot of memory and make the process slower.

Another reason for the script to be so slow is because of the mailserver, as the script loads it with multiple requests and then wait until it's flushed then the solution should be to wait for each of the request to flush the mailserver and continue with the next request. The solution is to include into the loop the batch creation and at the end of the loop flush.

Solution A:

Create just one interface or class to hold all the information of the employee, it has to be delivered from the backend in just one object so it can be process faster. As the datasource has all the information and can be parsed into one object there is no need to run 2 more loops inside the main loop to search on each collection for the rest of the data.

Solution B:

If there is not option to change either the database or query to deliver all the information in one source of data, then take the following actions:

Is important to notice that AddressBook, Employee and Payroll interfaces shares emp_id === id === emp_id meaning have to be related, as the function shows the relation is 1 to 1.

1.- AddressBook emp_id can't be null and has to be string
2.- Map the datasources to match Map<string,AddressBook|Employee|Payroll>, this will prevent unnecessary loops and will give access to each of the datasources by the id of the employee. Map the arrays outside of any loop so it runs just one time.
3.- On each loop access the AddressBook, Employee and Payroll data by the id with the following sintaxis:
    payrollMap.get([EMPLOYEE_ID]);
    This will help to prevent unnecessary loops
4.- Validate payroll,employee,address are not null to continue otherwise break the loop
5.- Add a validation to verify startDate inside the function yearsSince

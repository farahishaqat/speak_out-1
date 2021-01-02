export default (schedules = [], action) => {
    switch (action.type) {
        case 'getScheduleForUser':

            return schedules.filter((getScheduleForUser) => getScheduleForUser.date === action.payload.date);

        default:
            return schedules;
    }
}
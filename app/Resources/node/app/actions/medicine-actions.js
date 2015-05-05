var AppDispatcher = require('../dispatcher/app-dispatcher');
var MedicineConstants = require('../constants/medicine-constants');
var MedicineApi = require('../webapi/medicine-api');

var MedicineActions = {
    fetchMedicines: function() {
        AppDispatcher.dispatch({
            actionType: MedicineConstants.MEDICINES_FETCH_ALL,
        });

        MedicineApi.fetchMedicines(MedicineActions.setMedicines);
    },

    setMedicines: function(medicines) {
        AppDispatcher.dispatch({
            actionType: MedicineConstants.MEDICINES_SET_ALL,
            medicines: medicines
        });
    }
};

module.exports = MedicineActions;
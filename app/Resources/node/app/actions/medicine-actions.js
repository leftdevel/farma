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
    },

    createMedicine: function(entity) {
        AppDispatcher.dispatch({
            actionType: MedicineConstants.MEDICINES_CREATE,
            entity: entity
        });

        MedicineApi.createMedicine(entity, MedicineActions.createMedicineSuccess);
    },

    createMedicineSuccess: function() {
        AppDispatcher.dispatch({
            actionType: MedicineConstants.MEDICINES_CREATE_SUCCESS
        });

        // @TODO move to a socket listener
        MedicineApi.fetchMedicines();
    }
};

module.exports = MedicineActions;
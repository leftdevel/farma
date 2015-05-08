var AppDispatcher = require('../dispatcher/app-dispatcher');
var MedicineConstants = require('../constants/medicine-constants');
var MedicineApi = require('../webapi/medicine-api');
var DateUtils = require('../lib/date/date-utils');
var deepAssign = require('object-assign-deep');

function prepareEntity(entity) {
    var preparedEntity = deepAssign({}, entity);
    preparedEntity.expiry = DateUtils().convertToUnixTimestampUTC(entity.expiry_year, entity.expiry_month);
    preparedEntity.cost = parseInt(entity.cost * 100, 10);
    preparedEntity.price = parseInt(entity.price * 100, 10);

    return preparedEntity;
}

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
        var preparedEntity = prepareEntity(entity);

        AppDispatcher.dispatch({
            actionType: MedicineConstants.MEDICINES_CREATE,
            entity: entity
        });

        MedicineApi.createMedicine(preparedEntity, MedicineActions.createMedicineSuccess);
    },

    createMedicineSuccess: function() {
        AppDispatcher.dispatch({
            actionType: MedicineConstants.MEDICINES_CREATE_SUCCESS
        });

        // @TODO move to a socket listener
        MedicineActions.fetchMedicines();
    }
};

module.exports = MedicineActions;
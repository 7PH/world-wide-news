/**
 * @TODO implement
 *
 * @param {string} id Id of the range input
 * @param {Function} onChange Callback for when the value change
 * @returns {Function} Function to call to change the value of the range
 */
function rangeControl(id, onChange) {

    let value = 1;

    return newValue => {
        value = newValue;
    };
}
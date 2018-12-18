/**
 * @TODO implement
 *
 * @param {string} id Id of the range input
 * @param {Function} onChange Callback for when the value change
 * @returns {Function} Function to call to change the value of the range
 */
export function rangeControl(id, onChange) {

    const range = document.getElementById(id);

    range.addEventListener('change', () => onChange(range.value));

    return newValue => {

        range.value = newValue;
    };
}

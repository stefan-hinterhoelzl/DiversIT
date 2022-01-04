
/**
 * interface of a dialog
 *
 * @export
 * @interface Dialog
 */
export interface Dialog {
    /** optional the header or title of a dialog 
     * - if not provided, no header will be visible
    */
    header?: string;
    /** optional the text describing some circumstance or instructions
     * - if not provided, no description or instructions will be visible to the user
     */
    text?: string;
    /** the placeholdertext for a inputarea 
     * - if provided inputarea will be visible and return it's value on positiv dialoge exit
     */
    placeholderForInputArea?: string;
    /** optional some value of the textarea 
     * - if omitted placeholderForInputArea will be shown
    */
    inputAreaValue?: string;
    /** the placeholdertext for a input field
     * - if omitted no inputfiel will be shown
     * - if provided value of inputfield will be return on positiv exit of dialog
     */
    placeholderForInput?: string;
    /** value of the inputfiel */
    inputValue?: string;
    /** The value inside the button which confirmes the action */
    buttonTextConfirm?: string;
    /** the value of the button which aborts the dialog */
    buttonTextAbort?: string;
}
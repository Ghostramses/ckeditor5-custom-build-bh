import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import inlineAutoformatEditing from '@ckeditor/ckeditor5-autoformat/src/inlineautoformatediting';

class CustomAutoformat extends Autoformat {
  afterInit() {
    super.afterInit();
    this._addManWomanAutoformats();
  }

  _addManWomanAutoformats() {
    const commands = this.editor.commands;

    if (commands.get('bold')) {
      const boldCallback = getCallbackFunctionForInlineAutoformat(
        this.editor,
        'bold'
      );

      inlineAutoformatEditing(
        this.editor,
        this,
        /(?:^|\s)(\*\*)(Hombre:|Mujer:)(\*\*)$/g,
        boldCallback
      );

      inlineAutoformatEditing(
        this.editor,
        this,
        /(?:^|\s)(\*\*)(Hombre [1-9]{1}\d*:|Mujer [1-9]{1}\d*:)(\*\*)$/g,
        boldCallback
      );
    }
  }
}

// Helper function for getting `inlineAutoformatEditing` callbacks that checks if command is enabled.
//
// @param {module:core/editor/editor~Editor} editor
// @param {String} attributeKey
// @returns {Function}
function getCallbackFunctionForInlineAutoformat(editor, attributeKey) {
  return (writer, rangesToFormat) => {
    const command = editor.commands.get(attributeKey);

    if (!command.isEnabled) {
      return false;
    }

    const validRanges = editor.model.schema.getValidRanges(
      rangesToFormat,
      attributeKey
    );

    for (const range of validRanges) {
      writer.setAttribute(attributeKey, true, range);
    }

    // After applying attribute to the text, remove given attribute from the selection.
    // This way user is able to type a text without attribute used by auto formatter.
    writer.removeSelectionAttribute(attributeKey);
  };
}

export { CustomAutoformat };

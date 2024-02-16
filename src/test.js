import { basicSetup } from "codemirror"
import { EditorView } from "codemirror"
import { json } from "@codemirror/lang-json"
import { EditorState } from "@codemirror/state"

export function setupEditors() {
    const jsonRequestBody = document.getElementById('data-json-request-body')
    const jsonResponseBody = document.getElementById('data-json-response-body')

    const basicExtensions = [
        basicSetup,
        json(),
        EditorState.tabSize.of(2)
    ]

    const requestEditor = new EditorView({
        state: EditorState.create({
            doc: "{\n\t\n}",
            extensions: basicExtensions
        }),
        parent: jsonRequestBody
    })

    const responseEditor = new EditorView({
        state: EditorState.create({
            doc: "{}",
            extensions: [...basicExtensions, EditorView.editable.of(false)],
        }),
        parent: jsonResponseBody
    })

    function updateResponseEditor(value){
        responseEditor.dispatch({
            changes: {
                from: 0,
                to: responseEditor.state.doc.length,
                insert: JSON.stringify(value, null, 2)
            },
        })
    }
    console.log(requestEditor);
    return {requestEditor, updateResponseEditor}
}
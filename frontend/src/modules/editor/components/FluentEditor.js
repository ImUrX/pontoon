/* @flow */

import * as React from 'react';
import AceEditor from 'react-ace';
import { FluentParser, lineOffset, columnOffset }
    from 'fluent-syntax';

import './editor-mode-fluent';
import './editor-theme-fluent';

import type { EditorProps } from './GenericEditor';

const fluent_parser = new FluentParser();

function annotate(source) {
    let resource = fluent_parser.parse(source);
    let junks = resource.body.filter(entry => entry.type === 'Junk');
    let annotations = [];

    for (let junk of junks) {
        for (let annot of junk.annotations) {
            annotations.push({
                type: 'error',
                text: `${annot.code}: ${annot.message}`,
                row: lineOffset(source, annot.span.start),
                column: columnOffset(source, annot.span.start),
            });
        }
    }

    return annotations;
}


/*
 * Render an Ace editor for Fluent string editting.
 */
export default class FluentEditor extends React.Component<EditorProps> {
    render() {
        const options = {
            animatedScroll: false,
            autoScrollEditorIntoView: false,
            behavioursEnabled: false,
            cursorStyle: 'ace',
            displayIndentGuides: false,
            fadeFoldWidgets: false,
            fontSize: 14,
            highlightActiveLine: false,
            highlightSelectedWord: false,
            printMargin: false,
            printMarginColumn: false,
            scrollPastEnd: false,
            showInvisibles: false,
            showFoldWidgets: false,
            showLineNumbers: false,
            showPrintMargin: false,
        };

        return <AceEditor
            mode='fluent'
            theme='fluent'
            width='100%'
            wrapEnabled={ true }
            setOptions={ options }
            value={ this.props.translation }
            annotations={ annotate(this.props.translation) }
            onChange={ this.props.updateTranslation }
            debounceChangePeriod={200}
        />;
    }
}

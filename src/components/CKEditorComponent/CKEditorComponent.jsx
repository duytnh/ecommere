import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const CKEditorComponent = ({ onReady, onChange, onBlur, onFocus, initialValue }) => {
    return (
        <div>
            <CKEditor
                editor={ClassicEditor}
                data={initialValue}
                onReady={onReady}
                onChange={onChange}
                onBlur={onBlur}
                onFocus={onFocus}
            />
        </div>
    );
}

export default CKEditorComponent;

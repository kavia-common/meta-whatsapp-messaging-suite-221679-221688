import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import Table from '../common/Table';
import { parseCsv } from '../../utils/csvParser';
import { validateCSVHeaders } from '../../utils/validators';
import { CSVHeaders } from '../../utils/constants';

/**
 * UploadContactsModal
 * Allows CSV selection, previews the first rows, and calls onUpload with the File and settings.
 */
// PUBLIC_INTERFACE
export default function UploadContactsModal({ open, onClose, onUpload }) {
  const [file, setFile] = useState(null);
  const [listName, setListName] = useState('');
  const [delimiter, setDelimiter] = useState(',');
  const [hasHeader, setHasHeader] = useState(true);
  const [error, setError] = useState(null);
  const [textPreview, setTextPreview] = useState('');

  const parsed = useMemo(() => {
    if (!textPreview) return { headers: [], rows: [] };
    return parseCsv(textPreview, { delimiter, header: hasHeader, limitRows: 50 });
  }, [textPreview, delimiter, hasHeader]);

  const headerValidation = useMemo(() => {
    if (!hasHeader || !parsed.headers?.length) return { valid: true, missing: [], extras: [] };
    return validateCSVHeaders(parsed.headers, CSVHeaders.CONTACTS);
  }, [parsed.headers, hasHeader]);

  const columns = useMemo(() => {
    const heads = parsed.headers && parsed.headers.length > 0
      ? parsed.headers
      : (parsed.rows[0]?.map((_, idx) => `col_${idx + 1}`) || []);
    return heads.map((h, idx) => ({ key: (r) => r[idx], header: h }));
  }, [parsed]);

  const handleFileChange = async (e) => {
    const f = e.target.files?.[0];
    setFile(f || null);
    setError(null);
    setTextPreview('');
    if (f) {
      try {
        const txt = await f.text();
        setTextPreview(txt);
      } catch (ex) {
        setError(ex?.message || 'Failed to read file');
      }
    }
  };

  const submit = async () => {
    if (!file) {
      setError('Please select a CSV file.');
      return;
    }
    if (!listName.trim()) {
      setError('Please enter a list name.');
      return;
    }
    if (hasHeader && !headerValidation.valid) {
      setError(`CSV is missing required headers: ${headerValidation.missing.join(', ')}`);
      return;
    }
    setError(null);
    await onUpload?.({ file, listName: listName.trim(), delimiter, hasHeader });
  };

  return (
    <Modal open={open} onClose={onClose} title="Upload Contacts (CSV)" size="lg" footer={null}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
        <Input
          id="list-name"
          label="List name"
          value={listName}
          onChange={(e) => setListName(e.target.value)}
          placeholder="e.g., customers_q1"
          required
        />

        <div className="form-field">
          <label htmlFor="csv-file" className="form-label">CSV file <span className="req" aria-hidden="true">*</span></label>
          <input
            id="csv-file"
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileChange}
            className="form-input"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          <Select
            id="csv-delim"
            label="Delimiter"
            value={delimiter}
            onChange={(e) => setDelimiter(e.target.value)}
            options={[
              { value: ',', label: 'Comma (,)' },
              { value: ';', label: 'Semicolon (;)' },
              { value: '\t', label: 'Tab (\\t)' },
              { value: '|', label: 'Pipe (|)' },
            ]}
          />
          <Select
            id="csv-header"
            label="Header row"
            value={hasHeader ? '1' : '0'}
            onChange={(e) => setHasHeader(e.target.value === '1')}
            options={[
              { value: '1', label: 'Yes' },
              { value: '0', label: 'No' },
            ]}
          />
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <Button variant="secondary" onClick={submit}>Upload</Button>
          </div>
        </div>

        {error ? <div className="form-error" role="alert">{error}</div> : null}

        {hasHeader && parsed.headers?.length ? (
          <div className="toast" role="status" style={{ marginTop: 4 }}>
            <div className={`toast__content ${headerValidation.valid ? '' : 'text-error'}`}>
              {headerValidation.valid
                ? `Detected headers: ${parsed.headers.join(', ')}`
                : `Missing headers: ${headerValidation.missing.join(', ')}. Extras: ${headerValidation.extras.join(', ')}`}
            </div>
          </div>
        ) : null}

        <div>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Preview</div>
          <Table
            columns={columns}
            data={parsed.rows.map((r, idx) => ({ id: idx, ...r }))}
            emptyMessage={file ? 'No rows parsed. Check delimiter/header options.' : 'Select a CSV file to preview.'}
            dense
          />
        </div>
      </div>
    </Modal>
  );
}

UploadContactsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpload: PropTypes.func,
};

import { useRef, useState } from 'react';
import { UploadCloud, Trash2, ImageIcon } from 'lucide-react';
import { Button } from '../../components';
import { useToast } from '../../context';
import { useLoginLogo, notifyLogoChanged } from '../../hooks';
import { STORAGE_KEYS } from '../../constants';
import defaultLogo from '../../assets/default-logo.png';

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
const MAX_SIZE_MB = 2;

export default function Settings() {
  const { logoUrl, hasCustomLogo, refresh } = useLoginLogo();
  const { showToast } = useToast();
  const fileInputRef = useRef(null);

  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [saving, setSaving] = useState(false);

  const validateFile = (candidate) => {
    if (!ACCEPTED_TYPES.includes(candidate.type)) {
      return 'Only PNG, JPG, JPEG, or SVG files are supported.';
    }
    if (candidate.size > MAX_SIZE_MB * 1024 * 1024) {
      return `File is too large. Please choose an image under ${MAX_SIZE_MB}MB.`;
    }
    return '';
  };

  const handleFileSelect = (e) => {
    const candidate = e.target.files?.[0];
    if (!candidate) return;

    const errorMsg = validateFile(candidate);
    if (errorMsg) {
      setValidationError(errorMsg);
      setFile(null);
      setPreview(null);
      e.target.value = '';
      return;
    }

    setValidationError('');
    setFile(candidate);

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(candidate);
  };

  const handleSave = async () => {
  if (!file) return;

  setSaving(true);

  try {
    // Save Base64 image in localStorage
    localStorage.setItem(STORAGE_KEYS.LOGIN_LOGO, preview);

    notifyLogoChanged();

    await refresh();

    setFile(null);
    setPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    showToast('Logo updated successfully.', 'success');
  } finally {
    setSaving(false);
  }
};

const handleRemove = async () => {
  setSaving(true);

  try {
    localStorage.removeItem(STORAGE_KEYS.LOGIN_LOGO);

    notifyLogoChanged();

    await refresh();

    setFile(null);
    setPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    showToast('Logo removed successfully.', 'success');
  } finally {
    setSaving(false);
  }
};

  const displayLogo = preview || logoUrl || defaultLogo;

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-(--ux-text)">Settings</h1>

      <section className="rounded-(--ux-radius-card) border border-(--ux-border) bg-white p-6">
        <h2 className="text-base font-semibold text-(--ux-text)">Login Branding</h2>
        <p className="mt-1 text-sm text-(--ux-text-muted)">
          Upload the logo shown on the Login page. Changes apply instantly, without restarting the app.
        </p>

        <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border border-(--ux-border) bg-gray-50">
            {displayLogo ? (
              <img src={displayLogo} alt="Login logo preview" className="h-full w-full object-cover" />
            ) : (
              <ImageIcon className="h-8 w-8 text-gray-300" />
            )}
          </div>

          <div className="flex-1 space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".png,.jpg,.jpeg,.svg,image/png,image/jpeg,image/svg+xml"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
                <UploadCloud className="h-4 w-4" />
                {hasCustomLogo ? 'Replace logo' : 'Upload logo'}
              </Button>
              {hasCustomLogo && (
                <Button variant="danger" onClick={handleRemove} disabled={saving}>
                  <Trash2 className="h-4 w-4" />
                  Remove
                </Button>
              )}
            </div>
            <p className="text-xs text-(--ux-text-muted)">PNG, JPG, JPEG, or SVG. Max {MAX_SIZE_MB}MB.</p>
            {validationError && <p className="text-xs text-red-500">{validationError}</p>}
          </div>
        </div>

        {file && (
          <div className="mt-6 flex justify-end gap-3 border-t border-(--ux-border) pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setFile(null);
                setPreview(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} loading={saving}>
              Save changes
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}

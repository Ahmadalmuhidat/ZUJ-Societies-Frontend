import { useEffect, useRef, useCallback, useState } from 'react';
import { toast } from 'react-toastify';

export function useAutoSave(saveFunction, data, delay = 1000) {
  const timeoutRef = useRef(null);
  const previousDataRef = useRef(data);
  const isFirstRender = useRef(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  const debouncedSave = useCallback(async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        setIsSaving(true);
        await saveFunction();
        setLastSaved(new Date());
        
        // Auto-save successful - no toast needed (visual indicator shows status)
      } catch (error) {
        console.error('Auto-save failed:', error);
        toast.error('Failed to save settings automatically', {
          position: 'bottom-right',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          toastId: 'autosave-error' // Prevent duplicates
        });
      } finally {
        setIsSaving(false);
      }
    }, delay);
  }, [saveFunction, delay]);

  useEffect(() => {
    // Skip if data is null (not loaded yet)
    if (data === null) {
      return;
    }

    // Skip the first render to avoid saving on initial load
    if (isFirstRender.current) {
      isFirstRender.current = false;
      previousDataRef.current = data;
      return;
    }

    // Check if data has actually changed
    const hasChanged = JSON.stringify(data) !== JSON.stringify(previousDataRef.current);
    
    if (hasChanged) {
      previousDataRef.current = data;
      debouncedSave();
    }

    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, debouncedSave]);

  return { debouncedSave, isSaving, lastSaved };
}

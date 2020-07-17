// @flow
import {
  useCallback, useContext, useRef, useEffect,
} from 'react';
import Upload from 'react-native-background-upload';

import type { DocumentPickerResult, Attachment, AttachmentType } from '../types';
import { getCallableFunction } from '../utils';
import AccountContext from '../contexts/AccountContext';

type Options = {
  docId: string,
  onProgressMessage: string,
  collection: 'lessons' | 'assignments' | 'assignment-submissions',
  file: DocumentPickerResult,
  attachmentType: AttachmentType,
}

function useAttachmentUploader() {
  const { activeAccount } = useContext(AccountContext);

  const isMounted = useRef<boolean>(true);

  useEffect(() => () => {
    isMounted.current = false;
  }, []);

  const upload: (Options) => Promise<null | Attachment> = useCallback(async ({
    docId,
    collection,
    file,
    attachmentType,
    onProgressMessage,
  }) => {
    if (!activeAccount || !isMounted.current) {
      return null;
    }

    const getAttachmentUploadURL = await getCallableFunction('getAttachmentUploadURL');
    const { data: { uploadURL } } = await getAttachmentUploadURL({
      userId: activeAccount.id,
      docId,
      collection,
      contentType: file.type,
    });

    if (!isMounted.current) {
      return null;
    }

    await Upload.startUpload({
      url: uploadURL,
      path: file.uri,
      method: 'PUT',
      customUploadId: docId,
      headers: {
        'Content-Type': file.type,
      },
      notification: {
        enabled: true,
        autoClear: true,
        enableRingTone: false,
        onProgressTitle: 'Uploading',
        onProgressMessage,
      },
    });

    const attachment = {
      type: attachmentType,
      url: '',
      name: file.name,
      size: file.size,
      mimeType: file.type,
    };

    return attachment;
  }, [activeAccount]);

  return { upload };
}

export default useAttachmentUploader;

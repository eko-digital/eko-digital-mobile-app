// @flow
import React, {
  useCallback, useState, useEffect, useMemo, useRef, useContext,
} from 'react';
import { Card, Button, ProgressBar } from 'react-native-paper';
import * as FileSystem from 'expo-file-system';
import FileViewer from 'react-native-file-viewer';
import { Alert } from 'react-native';

import FilePreview from './FilePreview';
import InstituteContext from '../contexts/InstituteContext';

type Props = {
  type: 'pdf' | 'other',
  name: string,
  size: number,
  uri: string,
  localFileName: string,
  style?: any,
}

function DownloadableFileCard({
  type, name, size, uri, localFileName, style = null,
}: Props) {
  const [initializing, setInitializing] = useState<boolean>(true);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [localFileExists, setLocalFileExists] = useState<boolean>(true);

  const { institute } = useContext(InstituteContext);

  const localFileURI = useMemo(() => FileSystem.cacheDirectory + localFileName, [localFileName]);
  const downloadResumable = useRef<FileSystem.DownloadResumable | null>(null);

  const checkForLocalFile = useCallback(async () => {
    try {
      const localFileInfo = await FileSystem.getInfoAsync(localFileURI);
      setLocalFileExists(localFileInfo.exists);
    } catch (error) {
      console.error(error);
    }
    setInitializing(false);
  }, [localFileURI]);

  useEffect(() => {
    checkForLocalFile();
  }, [checkForLocalFile]);

  const handleProgress = useCallback(({ totalBytesWritten, totalBytesExpectedToWrite }) => {
    setDownloadProgress(totalBytesWritten / totalBytesExpectedToWrite);
  }, []);

  const startDownloading = useCallback(() => {
    setIsDownloading(true);

    downloadResumable.current = FileSystem.createDownloadResumable(
      uri,
      localFileURI,
      {},
      handleProgress,
    );

    downloadResumable.current
      .downloadAsync()
      .then(() => {
        setLocalFileExists(true);
        setIsDownloading(false);
        setDownloadProgress(0);
      })
      .catch((error) => {
        Alert.alert(
          'Oops, something went wrong.',
          'Please make sure you are connected to the internet.',
          [{ text: 'OK' }],
        );
        console.error(error);
        setLocalFileExists(false);
        setIsDownloading(false);
        setDownloadProgress(0);
      });
  }, [handleProgress, localFileURI, uri]);

  const openFile = useCallback(() => {
    if (!localFileExists) {
      return;
    }

    FileViewer.open(localFileURI.replace('file://', ''))
      .catch((error) => {
        console.error(error);
        Alert.alert(
          'Oops, something went wrong.',
          `Please try again. If this error persists, please notify your teacher or ${institute?.type || 'institute'}.`,
          [{ text: 'OK' }],
        );
      });
  }, [institute, localFileExists, localFileURI]);

  const deleteFile = useCallback(async () => {
    if (!localFileExists) {
      return;
    }

    try {
      await FileSystem.deleteAsync(localFileURI);
      setLocalFileExists(false);
      setIsDownloading(false);
      setDownloadProgress(0);
    } catch (error) {
      console.error(error);
      Alert.alert(
        'Oops, something went wrong.',
        `Please try again. If this error persists, please notify your teacher or ${institute?.type || 'institute'}.`,
        [{ text: 'OK' }],
      );
    }
  }, [institute, localFileExists, localFileURI]);

  const confirmDelete = useCallback(() => {
    if (!localFileExists) {
      return;
    }

    Alert.alert(
      'Delete file?',
      `Are you sure you want to delete "${name}"?`,
      [{ text: 'Cancel' }, { text: 'Delete', onPress: deleteFile }],
    );
  }, [deleteFile, localFileExists, name]);

  return (
    <Card style={style}>
      <FilePreview
        type={type}
        name={name}
        size={size}
      />
      {!initializing && (
        <Card.Actions>
          {localFileExists ? [
            <Button key="open" onPress={openFile}>Open</Button>,
            <Button key="delete" onPress={confirmDelete}>Delete</Button>,
          ] : (
            !isDownloading && <Button onPress={startDownloading}>Download</Button>
          )}
        </Card.Actions>
      )}
      {isDownloading && (
      <ProgressBar
        progress={downloadProgress}
        indeterminate={downloadProgress === 0}
      />
      )}
    </Card>
  );
}

export default DownloadableFileCard;

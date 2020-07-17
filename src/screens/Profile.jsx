// @flow
import React, {
  useContext,
  useCallback,
  useState,
  useMemo,
} from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useTheme, List, TouchableRipple } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-crop-picker';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

import UserAvatar from '../components/UserAvatar';
import AccountContext from '../contexts/AccountContext';
import { capitalize } from '../utils';
import config from '../config';
import InstituteContext from '../contexts/InstituteContext';

const styles = StyleSheet.create({
  container: {
    padding: config.values.space.normal,
    alignItems: 'center',
  },
  photoButton: {
    position: 'relative',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: 10,
    borderRadius: 22,
  },
  detailsSection: {
    width: '100%',
    marginTop: 30,
  },
});

function Profile() {
  const [uploading, setUploading] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(null);

  const navigation = useNavigation();

  const { activeAccount: account } = useContext(AccountContext);
  const theme = useTheme();
  const { currentUser } = auth();
  const { institute, classes, courses } = useContext(InstituteContext);

  const uploadImage = useCallback(async (localImagePath: string) => {
    if (!account) {
      return;
    }

    setUploading(true);

    try {
      const collection = account.isTeacher ? 'teachers' : 'students';

      const remoteRef = storage().ref(`users/${currentUser.uid}/photos/${account.id}`);
      await remoteRef.putFile(localImagePath);
      const downloadUrl = await remoteRef.getDownloadURL();
      await firestore().collection(collection)
        .doc(account.id)
        .update({ photoURL: downloadUrl });
    } catch (error) {
      console.error(error);
    }

    setUploading(false);
  }, [account, currentUser.uid]);

  const changePhoto = useCallback(async () => {
    try {
      const result = await ImagePicker.openPicker({
        mediaType: 'photo',
        width: 432,
        height: 432,
        cropping: true,
        cropperCircleOverlay: true,
        cropperActiveWidgetColor: theme.colors.primary,
        cropperToolbarColor: '#FFFFFF',
      });
      setImage(result.path);
      await uploadImage(result.path);
      setImage(null);
    } catch (error) {
      if (error.message.toLowerCase().includes('user cancelled')) {
        return;
      }
      console.error(error);
    }
  }, [theme.colors.primary, uploadImage]);

  const navigateToInstitute = useCallback(() => {
    navigation.navigate('Institute');
  }, [navigation]);

  const studentClassName: string | null = useMemo(() => {
    if (account && !account.isTeacher && account.class) {
      return classes.find((c) => c.id === account.class)?.name || null;
    }
    return null;
  }, [account, classes]);

  const studentCourseNames: string[] | null = useMemo(() => {
    if (account && !account.isTeacher && account.courses) {
      return account.courses.map((courseId) => {
        const course = courses.find((c) => c.id === courseId);
        return course?.name;
      }).filter(Boolean);
    }
    return null;
  }, [account, courses]);

  const teacherCourseNames: string[] | null = useMemo(() => {
    if (account && account.isTeacher && account.courses) {
      return account.courses.map((courseId) => {
        const course = courses.find((c) => c.id === courseId);
        const klass = course?.class ? classes.find((c) => c.id === course?.class) : null;
        return course && klass ? `${klass.name}: ${course.name}` : null;
      }).filter(Boolean);
    }
    return null;
  }, [account, classes, courses]);

  if (!account || !institute) {
    return null;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableRipple
        borderless
        style={styles.photoButton}
        onPress={changePhoto}
      >
        <>
          <UserAvatar
            photoURL={image || account.photoURL}
            name={account.name}
            size={144}
            loading={uploading}
          />
          {!uploading && (
            <MaterialCommunityIcons
              name="camera"
              size={24}
              color="#fff"
              style={[styles.editIcon, { backgroundColor: theme.colors.primary }]}
            />
          )}
        </>
      </TouchableRipple>

      <List.Section style={styles.detailsSection}>
        <List.Item
          title="Name"
          description={account.name}
          // eslint-disable-next-line react/jsx-props-no-spreading
          left={(props) => <List.Icon {...props} icon="account-outline" />}
        />
        {currentUser.email && (
          <List.Item
            title="Email"
            description={currentUser.email}
            // eslint-disable-next-line react/jsx-props-no-spreading
            left={(props) => <List.Icon {...props} icon="at" />}
          />
        )}
        {currentUser.phoneNumber && (
          <List.Item
            title="Phone number"
            description={currentUser.phoneNumber}
            // eslint-disable-next-line react/jsx-props-no-spreading
            left={(props) => <List.Icon {...props} icon="phone-outline" />}
          />
        )}
        <List.Item
          title={capitalize(institute?.type || 'institute')}
          description={institute ? institute.name : '...'}
          // eslint-disable-next-line react/jsx-props-no-spreading
          left={(props) => <List.Icon {...props} icon="bank-outline" />}
          // eslint-disable-next-line react/jsx-props-no-spreading
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={navigateToInstitute}
        />
        {studentClassName && (
          <List.Item
            title={capitalize(institute.i18n.classSingular)}
            description={studentClassName}
            // eslint-disable-next-line react/jsx-props-no-spreading
            left={(props) => <List.Icon {...props} icon="account-group-outline" />}
          />
        )}
        {teacherCourseNames && (
          <List.Item
            title={capitalize(institute.i18n.coursePlural)}
            description={teacherCourseNames.join('\n')}
            // eslint-disable-next-line react/jsx-props-no-spreading
            left={(props) => <List.Icon {...props} icon="teach" />}
            descriptionNumberOfLines={100}
          />
        )}
        {studentCourseNames && (
          <List.Item
            title={capitalize(institute.i18n.coursePlural)}
            description={studentCourseNames.join('\n')}
            // eslint-disable-next-line react/jsx-props-no-spreading
            left={(props) => <List.Icon {...props} icon="book-outline" />}
            descriptionNumberOfLines={100}
          />
        )}
      </List.Section>
    </ScrollView>
  );
}

export default Profile;

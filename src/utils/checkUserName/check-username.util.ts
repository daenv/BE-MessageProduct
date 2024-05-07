import { CustomException } from 'src/common';

const containsSpecialCharacters = (str) => {
  const regex = /[!@#$%^&*(),.?":{}|<>]/;
  return regex.test(str);
};

const checkUsername = (phoneNumber) => {
  try {
    if (containsSpecialCharacters(phoneNumber)) {
      throw new CustomException(
        'Phone number cannot contain special characters',
      );
    }
    return true;
  } catch (error) {
    throw new CustomException(error.message);
  }
};

export default checkUsername;
